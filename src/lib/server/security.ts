import "server-only";
import { isIP } from "node:net";
import { envInt } from "./env";

function validIp(value: string | null | undefined): string | null {
  const v = value?.trim();
  return v && isIP(v) ? v : null;
}

/** Entry `hops` positions from the RIGHT of an X-Forwarded-For list (1 = last = added by the nearest trusted proxy). */
function fromForwardedFor(header: string | null, hops: number): string | null {
  if (!header) return null;
  const parts = header.split(",").map((p) => p.trim());
  return validIp(parts[parts.length - hops]);
}

/**
 * Client IP behind a reverse proxy. Never trusts the LEFT side of X-Forwarded-For:
 * the client controls it. Configuration (env):
 *  - CLIENT_IP_HEADER: if set (e.g. "x-real-ip", "cf-connecting-ip", "x-forwarded-for"),
 *    ONLY that header is used.
 *  - TRUSTED_PROXY_HOPS (default 1): for x-forwarded-for, the entry that many positions
 *    from the right (the one appended by the trusted proxy).
 * Default order without CLIENT_IP_HEADER: x-real-ip -> x-forwarded-for (right side) -> "unknown".
 * `x-real-ip` is only reliable if the proxy OVERWRITES it (verified on Hostinger 2026-11-05:
 * Hostinger/LiteSpeed); on Vercel the edge overwrites both headers.
 */
export function getClientIp(req: Request): string {
  const hops = envInt("TRUSTED_PROXY_HOPS", 1);
  const forced = process.env.CLIENT_IP_HEADER?.trim().toLowerCase();
  if (forced) {
    const raw = req.headers.get(forced);
    const ip = forced === "x-forwarded-for" ? fromForwardedFor(raw, hops) : validIp(raw);
    return ip ?? "unknown";
  }
  return (
    validIp(req.headers.get("x-real-ip")) ??
    fromForwardedFor(req.headers.get("x-forwarded-for"), hops) ??
    "unknown"
  );
}

const STATIC_ALLOWED_ORIGINS = new Set([
  "https://gtdevsolutions.com",
  "https://www.gtdevsolutions.com",
  "http://localhost:3000",
]);

/**
 * Browser-origin check. Not a defence against curl (rate limits cover that),
 * but stops other websites from embedding our endpoints and spending our quota.
 * This deployment's own Vercel URLs (previews) are allowed.
 */
export function isAllowedOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  if (STATIC_ALLOWED_ORIGINS.has(origin)) return true;
  const extra = process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim());
  if (extra?.includes(origin)) return true;
  // This deployment's own Vercel URLs (previews). Set by Vercel at runtime, so a
  // third-party project called "website-*" cannot pass this check.
  const own = [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]
    .filter(Boolean)
    .map((h) => `https://${h}`);
  return own.includes(origin);
}

/** Escape user text before interpolating it into HTML emails. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Mask an email for logs: "ju***@dominio.com". Never log full personal data. */
export function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain) return "***";
  return `${user!.slice(0, 2)}***@${domain}`;
}

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
// Phone: international prefix (+34 / 0034) followed by 7-14 digits, or a Spanish
// 9-digit number starting with 6/7/8/9. Only spaces, dots and dashes as separators
// (no newlines). Avoids treating budgets, dates or order numbers as phones.
const PHONE_RE = /(?:\+|\b00)\d{1,3}[ .-]?(?:\d[ .-]?){6,13}\d\b|\b[6789]\d{2}[ .-]?\d{2,3}[ .-]?\d{2,3}[ .-]?\d{0,3}\b/;

/** Contact data typed in a chat message (same purpose as the n8n "Extract Contact Data" node). */
export function extractContact(text: string): { email?: string; telefono?: string } {
  let email = text.match(EMAIL_RE)?.[0];
  if (email && email.length > 254) email = undefined;
  let telefono = text.match(PHONE_RE)?.[0]?.trim();
  if (telefono) {
    const digits = telefono.replace(/\D/g, "").length;
    if (digits < 9 || digits > 15) telefono = undefined;
  }
  return { email, telefono };
}

/**
 * Key used for per-IP rate limits. IPv4: the address. IPv6: its /64 prefix, because a
 * single home or mobile connection gets a whole /64 and can rotate addresses inside it,
 * which would bypass a per-address limit. IPv4-mapped IPv6 (::ffff:a.b.c.d) -> the IPv4.
 */
export function rateLimitKey(ip: string): string {
  if (isIP(ip) !== 6) return ip;
  const lower = ip.toLowerCase();
  const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return mapped[1]!;
  const [head, tail = ""] = lower.split("::");
  const h = head ? head.split(":") : [];
  const t = tail ? tail.split(":") : [];
  const groups = lower.includes("::") ? [...h, ...Array(8 - h.length - t.length).fill("0"), ...t] : h;
  return `${groups.slice(0, 4).map((g) => g.replace(/^0+(?=.)/, "")).join(":")}::/64`;
}
