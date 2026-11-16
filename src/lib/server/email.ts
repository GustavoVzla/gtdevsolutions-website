import "server-only";
import { Resend } from "resend";
import { escapeHtml } from "./security";
import { env } from "./env";

/**
 * Email delivery through Resend (domain gtdevsolutions.com verified in Resend,
 * DKIM d=gtdevsolutions.com so DMARC aligns).
 * - Internal notice  -> soluciones@ (Reply-To = the lead, so Gustavo answers directly)
 * - Auto-reply       -> the lead (fixed text, never echoes the lead's message; Reply-To = soluciones@)
 */
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const LEADS_INBOX = env("LEADS_INBOX") ?? "soluciones@gtdevsolutions.com";
const FROM = env("EMAIL_FROM") ?? "GT Dev Solutions <web@gtdevsolutions.com>";

export const emailEnabled = resend !== null;
/** Auto-reply: text approved by Gustavo (2026-11-05), so ON by default. Kill switch: AUTO_REPLY_ENABLED=false. */
export const autoReplyEnabled = process.env.AUTO_REPLY_ENABLED !== "false";

async function send(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo: string;
  idempotencyKey?: string;
}): Promise<boolean> {
  if (!resend) {
    console.error("[email] RESEND_API_KEY missing: email not sent");
    return false;
  }
  try {
    const { error } = await resend.emails.send(
      {
        from: FROM,
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
        replyTo: params.replyTo,
      },
      params.idempotencyKey ? { idempotencyKey: params.idempotencyKey } : undefined,
    );
    if (error) {
      console.error("[email] resend error:", error.name, error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[email] resend threw:", e instanceof Error ? e.message : "unknown");
    return false;
  }
}

export interface LeadFields {
  nombre?: string;
  email?: string;
  telefono?: string;
  empresa?: string;
  mensaje?: string;
}

const LABELS: Array<[keyof LeadFields, string]> = [
  ["nombre", "Nombre"],
  ["email", "Email"],
  ["telefono", "Teléfono"],
  ["empresa", "Empresa / sector"],
  ["mensaje", "Mensaje"],
];

/** Notice to Gustavo with everything the lead sent. */
export async function sendLeadNotice(
  source: "Formulario web" | "Chatbot web",
  lead: LeadFields,
  extra?: { sessionId?: string; transcript?: string },
): Promise<boolean> {
  const rows = LABELS.filter(([k]) => lead[k])
    .map(
      ([k, label]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top"><b>${label}</b></td><td style="padding:4px 0;white-space:pre-wrap">${escapeHtml(lead[k]!)}</td></tr>`,
    )
    .join("");
  const textRows = LABELS.filter(([k]) => lead[k])
    .map(([k, label]) => `${label}: ${lead[k]}`)
    .join("\n");

  const transcriptHtml = extra?.transcript
    ? `<h3 style="margin-top:20px">Conversación</h3><pre style="white-space:pre-wrap;font-family:inherit;background:#f5f5f5;padding:12px;border-radius:6px">${escapeHtml(extra.transcript)}</pre>`
    : "";

  const who = lead.email || lead.telefono || lead.nombre || "sin datos";
  return send({
    to: LEADS_INBOX,
    replyTo: lead.email || LEADS_INBOX,
    subject: `Nuevo lead (${source}): ${who}`.slice(0, 180),
    html: `<div style="font-family:Arial,sans-serif;max-width:640px;color:#222">
<h2 style="margin:0 0 12px">Nuevo lead — ${source}</h2>
<table cellpadding="0" cellspacing="0">${rows}</table>
${extra?.sessionId ? `<p style="color:#888;font-size:12px">Sesión chatbot: ${escapeHtml(extra.sessionId)}</p>` : ""}
${transcriptHtml}
<hr/><p style="color:#888;font-size:12px">Enviado automáticamente desde gtdevsolutions.com. Responder a este correo contesta al lead.</p></div>`,
    text: `Nuevo lead — ${source}\n\n${textRows}${extra?.transcript ? `\n\nConversación:\n${extra.transcript}` : ""}`,
  });
}

/**
 * Auto-reply to the lead.
 * Text approved by Gustavo on 2026-11-05 (castellano neutro, usted; 24 h laborables;
 * signature "Gustavo Tejera – GT Dev Solutions"; sender web@).
 * Anti-abuse: fixed text; only the first name is interpolated (escaped, truncated);
 * the lead's message is never echoed, so the form cannot be used to send arbitrary
 * content to third parties from our domain.
 */
export async function sendLeadAutoReply(to: string, nombre?: string): Promise<boolean> {
  const firstName = (nombre ?? "").trim().split(/\s+/)[0]?.slice(0, 40) ?? "";
  const saludo = firstName ? `Hola, ${escapeHtml(firstName)}:` : "Hola:";
  const saludoText = firstName ? `Hola, ${firstName}:` : "Hola:";

  return send({
    to,
    replyTo: LEADS_INBOX,
    subject: "Hemos recibido su consulta — GT Dev Solutions",
    idempotencyKey: `autoreply-${to.toLowerCase()}-${new Date().toISOString().slice(0, 10)}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;color:#333;line-height:1.5">
<p>${saludo}</p>
<p>Gracias por escribir a GT Dev Solutions. Hemos recibido su consulta y le responderemos personalmente en un plazo máximo de 24 horas laborables.</p>
<p>Si desea añadir información o adelantar algún detalle, puede responder directamente a este correo.</p>
<p>Un saludo cordial,</p>
<p><strong>Gustavo Tejera – GT Dev Solutions</strong><br/>
<a href="mailto:soluciones@gtdevsolutions.com" style="color:#333;font-size:13px">soluciones@gtdevsolutions.com</a> · <a href="https://gtdevsolutions.com" style="color:#65a30d;font-size:13px">gtdevsolutions.com</a></p>
<p style="color:#999;font-size:11px">Recibe este mensaje porque alguien envió una consulta con esta dirección en gtdevsolutions.com. Si no fue usted, puede ignorarlo: no volveremos a escribirle.</p>
</div>`,
    text: `${saludoText}

Gracias por escribir a GT Dev Solutions. Hemos recibido su consulta y le responderemos personalmente en un plazo máximo de 24 horas laborables.

Si desea añadir información o adelantar algún detalle, puede responder directamente a este correo.

Un saludo cordial,
Gustavo Tejera – GT Dev Solutions
soluciones@gtdevsolutions.com · gtdevsolutions.com

Recibe este mensaje porque alguien envió una consulta con esta dirección en gtdevsolutions.com. Si no fue usted, puede ignorarlo: no volveremos a escribirle.`,
  });
}
