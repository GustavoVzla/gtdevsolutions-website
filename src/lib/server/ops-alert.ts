import "server-only";
import { KEY_PREFIX, redis } from "./redis";

/**
 * Operational alerts to Telegram (bot of GT Dev). Optional: without
 * OPS_TELEGRAM_BOT_TOKEN and OPS_TELEGRAM_CHAT_ID it does nothing.
 * Never throws and never includes personal data: callers pass already-masked details.
 */
export type OpsAlertKind = "lead_lost" | "email_failed" | "model_failed" | "chat_cap" | "ratelimit_down";

const THROTTLE_SECONDS = 3600;

/** Last 3 digits only, for phone numbers in alert details. */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length > 3 ? `***${digits.slice(-3)}` : "***";
}

export async function notifyOps(kind: OpsAlertKind, detail: string): Promise<void> {
  try {
    const token = process.env.OPS_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.OPS_TELEGRAM_CHAT_ID;
    if (!token || !chatId) return;

    // Anti-noise: one alert per kind per hour. A lost lead is always sent.
    if (kind !== "lead_lost" && redis) {
      try {
        const first = await redis.set(`${KEY_PREFIX}:ops-alert:${kind}`, 1, { nx: true, ex: THROTTLE_SECONDS });
        if (first !== "OK") return;
      } catch {
        // Redis down: better a possible duplicate than silence.
      }
    }

    const env = process.env.VERCEL_ENV;
    const tag = env && env !== "production" ? ` [${env}]` : "";
    const text = `🚨 gtdevsolutions.com — ${kind}${tag}\n${detail.slice(0, 500)}\n${new Date().toISOString()}`;

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error("[ops-alert] telegram responded", res.status);
  } catch (e) {
    // Error name only: the message of a failed fetch could embed the URL (and the token).
    console.error("[ops-alert] send failed:", e instanceof Error ? e.name : "unknown");
  }
}

/**
 * Send the alert and wait for it. Awaited BEFORE responding on purpose: on Hostinger
 * (Node app behind LiteSpeed) the process can be recycled right after the response,
 * so work in `after()` may be lost. notifyOps never throws and its fetch is capped at 5 s.
 */
export async function alertOps(kind: OpsAlertKind, detail: string): Promise<void> {
  await notifyOps(kind, detail);
}
