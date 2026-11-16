import { z } from "zod";
import { allow, limits } from "@/lib/server/redis";
import { autoReplyEnabled, sendLeadAutoReply, sendLeadNotice } from "@/lib/server/email";
import { saveLead } from "@/lib/server/leads";
import { alertOps } from "@/lib/server/ops-alert";
import { getClientIp, isAllowedOrigin, maskEmail, rateLimitKey } from "@/lib/server/security";

const ContactSchema = z.object({
  nombre: z.string().trim().max(120).optional().default(""),
  email: z.email().trim().max(254),
  telefono: z
    .string()
    .trim()
    .max(40)
    .regex(/^[0-9+()\-.\s]*$/, "Teléfono no válido")
    .optional()
    .default(""),
  empresa: z.string().trim().max(160).optional().default(""),
  mensaje: z.string().trim().min(1).max(4000),
  /** Explicit acceptance of the privacy policy (RGPD consent). */
  privacidad: z.literal(true),
  /** Honeypot: hidden field, humans leave it empty. */
  website: z.string().max(200).optional().default(""),
});

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  if (!isAllowedOrigin(req)) return json({ ok: false, error: "forbidden" }, 403);

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) return json({ ok: false, error: "invalid_input" }, 400);
  const data = parsed.data;

  // Honeypot hit: pretend success, do nothing.
  if (data.website) return json({ ok: true });

  const ip = rateLimitKey(getClientIp(req));
  // Fails OPEN when Redis is missing/down (null): losing a lead is worse than a
  // burst of notices to our own inbox. Redis is a required env var in production.
  const ipAllowed = await allow(limits.contactIp, ip);
  if (ipAllowed === false) return json({ ok: false, error: "rate_limited" }, 429);

  const lead = {
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono,
    empresa: data.empresa,
    mensaje: data.mensaje,
  };

  const noticeSent = await sendLeadNotice("Formulario web", lead);
  const stored = await saveLead({ source: "form", ...lead, email_sent: noticeSent });

  if (!noticeSent && !stored) {
    // Lead would be lost: tell the user so they use WhatsApp/email instead.
    console.error("[contact] lead NOT delivered nor stored", maskEmail(data.email));
    await alertOps("lead_lost", `Formulario web: no enviado ni guardado (${maskEmail(data.email)})`);
    return json({ ok: false, error: "delivery_failed" }, 502);
  }

  if (!noticeSent) {
    await alertOps("email_failed", `Formulario web: aviso por email fallido, lead guardado (${maskEmail(data.email)})`);
  }

  // Auto-reply only when enabled and rate limiting is available (fail closed):
  // max 3 per IP and 1 per destination per 24 h. IP is checked first so a blocked
  // IP does not burn the destination's token. Never affects the response.
  if (autoReplyEnabled) {
    const ipReplyAllowed = await allow(limits.autoReplyIp, ip);
    const toAllowed = ipReplyAllowed ? await allow(limits.autoReplyTo, data.email.toLowerCase()) : false;
    if (ipReplyAllowed && toAllowed) {
      await sendLeadAutoReply(data.email, data.nombre);
    }
  }

  return json({ ok: true });
}
