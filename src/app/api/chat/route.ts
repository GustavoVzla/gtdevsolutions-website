import { generateText, type ModelMessage } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { CHATBOT_SYSTEM_PROMPT } from "@/lib/server/chatbot-prompt";
import { allow, KEY_PREFIX, limits, redis } from "@/lib/server/redis";
import { autoReplyEnabled, sendLeadAutoReply, sendLeadNotice } from "@/lib/server/email";
import { saveLead } from "@/lib/server/leads";
import { maskPhone, alertOps } from "@/lib/server/ops-alert";
import { extractContact, getClientIp, isAllowedOrigin, maskEmail, rateLimitKey } from "@/lib/server/security";
import { env } from "@/lib/server/env";
import { CHAT_TONE, normalizeMenuChoice, rateLimitedMessage, unavailableMessage } from "@/lib/chat-menu";

/**
 * Backend for the @n8n/chat widget, replacing the n8n "When chat message received"
 * webhook. Protocol (from @n8n/chat src/api/message.ts + types/webhook.ts):
 *  - POST { action: "sendMessage", sessionId, chatInput, metadata? } -> { output }
 *  - POST { action: "loadPreviousSession", sessionId, metadata? }    -> { data: LangChain-style messages }
 * Errors are returned as 200 + { output } so the widget shows a friendly text
 * instead of "Error: Failed to receive response".
 */

// Anthropic API direct (ANTHROPIC_API_KEY).
// Not via AI Gateway: Gateway requires card verification for BYOK (403 "Verification
// Required", 2026-11-05). Runs on the Max-plan promotional API credits: no card on the
// Console org, so when credits run out calls fail and the chat degrades to UNAVAILABLE
// instead of charging. No fallback model: every fallback needed Gateway or another vendor.
const MODEL = env("CHAT_MODEL") ?? "claude-haiku-5-5";
const HISTORY_SENT_TO_MODEL = 10; // same window as the n8n Simple Memory node
const HISTORY_STORED = 20;
const HISTORY_TTL_SECONDS = 60 * 60 * 24; // 24 h, as the n8n Redis memory

const UNAVAILABLE = unavailableMessage(CHAT_TONE);
const RATE_LIMITED = rateLimitedMessage(CHAT_TONE);

const Session = z.string().trim().min(8).max(100).regex(/^[A-Za-z0-9_-]+$/);
const Body = z.discriminatedUnion("action", [
  z.object({ action: z.literal("sendMessage"), sessionId: Session, chatInput: z.string().trim().min(1).max(1000) }),
  z.object({ action: z.literal("loadPreviousSession"), sessionId: Session }),
]);

type StoredMessage = { role: "user" | "assistant"; content: string };

const historyKey = (sessionId: string) => `${KEY_PREFIX}:chat:${sessionId}`;

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

async function readHistory(sessionId: string): Promise<StoredMessage[]> {
  if (!redis) return [];
  const items = await redis.lrange<StoredMessage>(historyKey(sessionId), 0, -1);
  return items.filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string");
}

async function appendHistory(sessionId: string, messages: StoredMessage[]) {
  if (!redis) return;
  const key = historyKey(sessionId);
  const p = redis.pipeline();
  p.rpush(key, ...messages);
  p.ltrim(key, -HISTORY_STORED, -1);
  p.expire(key, HISTORY_TTL_SECONDS);
  await p.exec();
}

async function handleLead(sessionId: string, ip: string, contact: { email?: string; telefono?: string }, history: StoredMessage[]) {
  if (!redis) return;
  // Notify once per session and contact value.
  const dedupe = `${KEY_PREFIX}:chat-lead:${sessionId}:${contact.email ?? contact.telefono}`;
  const first = await redis.set(dedupe, 1, { nx: true, ex: HISTORY_TTL_SECONDS });
  if (first !== "OK") return;

  const transcript = history
    .map((m) => `${m.role === "user" ? "Usuario" : "Asistente"}: ${m.content}`)
    .join("\n\n");

  const who = contact.email ? maskEmail(contact.email) : maskPhone(contact.telefono ?? "");
  const noticeSent = await sendLeadNotice(
    "Chatbot web",
    { email: contact.email, telefono: contact.telefono },
    { sessionId, transcript },
  );
  const stored = await saveLead({
    source: "chatbot",
    email: contact.email ?? null,
    telefono: contact.telefono ?? null,
    mensaje: transcript.slice(0, 8000),
    session_id: sessionId,
    email_sent: noticeSent,
  });
  if (!noticeSent && !stored) {
    console.error("[chat] LEAD LOST: not emailed nor stored", contact.email ? maskEmail(contact.email) : "phone");
    await alertOps("lead_lost", `Chatbot: no enviado ni guardado (${who})`);
  } else if (!noticeSent) {
    await alertOps("email_failed", `Chatbot: aviso por email fallido, lead guardado (${who})`);
  }

  if (contact.email && autoReplyEnabled) {
    // IP first: a blocked IP must not burn the destination's daily token.
    const ipOk = await allow(limits.autoReplyIp, ip);
    const toOk = ipOk ? await allow(limits.autoReplyTo, contact.email.toLowerCase()) : false;
    if (toOk && ipOk) await sendLeadAutoReply(contact.email);
    else console.warn("[chat] auto-reply skipped by rate limit", maskEmail(contact.email));
  }
}

export async function POST(req: Request) {
  if (!isAllowedOrigin(req)) return json({ output: UNAVAILABLE }, 403);

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return json({ output: UNAVAILABLE }, 400);
  }
  const parsed = Body.safeParse(raw);
  if (!parsed.success) return json({ output: UNAVAILABLE }, 400);
  const body = parsed.data;

  if (body.action === "loadPreviousSession") {
    if ((await allow(limits.chatLoadIp, rateLimitKey(getClientIp(req)))) === false) return json({ data: [] });
    const history = await readHistory(body.sessionId);
    return json({
      data: history.map((m) => ({
        lc: 1,
        type: "constructor",
        id: ["langchain_core", "messages", m.role === "user" ? "HumanMessage" : "AIMessage"],
        kwargs: { content: m.content, additional_kwargs: {} },
      })),
    });
  }

  // No Redis => no rate limit and no budget guard => fail closed (never call the LLM unprotected).
  if (!redis || !process.env.ANTHROPIC_API_KEY) return json({ output: UNAVAILABLE });

  const ip = rateLimitKey(getClientIp(req));
  const [ipOk, sessionOk] = await Promise.all([
    allow(limits.chatIp, ip),
    allow(limits.chatSession, body.sessionId),
  ]);
  if (!ipOk || !sessionOk) return json({ output: RATE_LIMITED });
  if (!(await allow(limits.chatGlobal, "all"))) {
    console.error("[chat] global daily cap reached");
    await alertOps("chat_cap", "Tope diario global del chatbot alcanzado (CHAT_DAILY_CAP)");
    return json({ output: UNAVAILABLE });
  }

  const history = await readHistory(body.sessionId);
  // A bare menu pick ("4") only makes sense with the client-side welcome menu: expand it
  // so the model and the stored history both see the option text. Lead detection below
  // still uses the original input.
  const userText = normalizeMenuChoice(body.chatInput) ?? body.chatInput;
  const messages: ModelMessage[] = [
    ...history.slice(-HISTORY_SENT_TO_MODEL).map((m) => ({ role: m.role, content: m.content }) as ModelMessage),
    { role: "user", content: userText },
  ];

  let output: string;
  try {
    const result = await generateText({
      model: anthropic(MODEL),
      instructions: CHATBOT_SYSTEM_PROMPT,
      messages,
      maxOutputTokens: 500,
      temperature: 0.4,
      maxRetries: 1,
      timeout: 25_000,
    });
    output = result.text.trim() || UNAVAILABLE;
  } catch (e) {
    console.error("[chat] model call failed:", e instanceof Error ? e.message : "unknown");
    const reason = e instanceof Error ? `${e.name}: ${e.message}` : "unknown";
    await alertOps("model_failed", `Anthropic: ${reason.slice(0, 200)}`);
    return json({ output: UNAVAILABLE });
  }

  const newMessages: StoredMessage[] = [
    { role: "user", content: userText },
    { role: "assistant", content: output },
  ];
  await appendHistory(body.sessionId, newMessages);

  const contact = extractContact(body.chatInput);
  if (contact.email || contact.telefono) {
    const fullHistory = [...history, ...newMessages];
    // Awaited before responding (no after()): a Node process on shared hosting can be
    // recycled right after the response and the lead would be lost.
    try {
      await handleLead(body.sessionId, ip, contact, fullHistory);
    } catch (e) {
      console.error("[chat] LEAD LOST, handleLead failed:", e instanceof Error ? e.message : "unknown");
      await alertOps("lead_lost", "Chatbot: handleLead lanzo una excepcion");
    }
  }

  return json({ output });
}
