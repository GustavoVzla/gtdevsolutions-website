import "server-only";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { env, envInt } from "./env";

/**
 * Upstash Redis is optional at build time but REQUIRED for the chatbot and for
 * the lead auto-reply: without it there is no rate limit, so those features
 * fail closed (see callers). Accepts both naming schemes:
 *  - UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (Upstash console)
 *  - KV_REST_API_URL / KV_REST_API_TOKEN (Vercel Marketplace integration)
 */
const url = env("UPSTASH_REDIS_REST_URL") ?? env("KV_REST_API_URL");
const token = env("UPSTASH_REDIS_REST_TOKEN") ?? env("KV_REST_API_TOKEN");

export const redis: Redis | null = url && token ? new Redis({ url, token }) : null;

/** Every key of this site lives under this prefix (the DB may be shared). */
export const KEY_PREFIX = "gtdev-web";

function limiter(name: string, tokens: number, window: Parameters<typeof Ratelimit.slidingWindow>[1]) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, window),
    prefix: `${KEY_PREFIX}:rl:${name}`,
    analytics: false,
  });
}

export const limits = {
  /** Contact form submissions per IP. */
  contactIp: limiter("contact-ip", 5, "10 m"),
  /** Auto-replies per destination email (anti "use our form to spam a third party"). */
  autoReplyTo: limiter("autoreply-to", 1, "24 h"),
  /** Auto-replies per IP (one IP cannot fan out to many destination addresses). */
  autoReplyIp: limiter("autoreply-ip", 3, "24 h"),
  /** loadPreviousSession reads per IP. */
  chatLoadIp: limiter("chat-load-ip", 30, "10 m"),
  /** Chat messages per IP. */
  chatIp: limiter("chat-ip", 20, "10 m"),
  /** Chat messages per session. */
  chatSession: limiter("chat-session", 40, "24 h"),
  /** Global chat budget guard: hard cap of LLM calls per day for the whole site. */
  chatGlobal: limiter("chat-global", envInt("CHAT_DAILY_CAP", 500), "24 h"),
};

/** Returns true when allowed. `null` limiter => caller decides (fail open/closed). */
export async function allow(l: Ratelimit | null, id: string): Promise<boolean | null> {
  if (!l) return null;
  try {
    const { success } = await l.limit(id);
    return success;
  } catch (e) {
    // Upstash down or bad token: report "unknown" (null) instead of throwing,
    // so callers can fail open (lead delivery) or closed (LLM, auto-reply).
    console.error("[ratelimit] check failed:", e instanceof Error ? e.message : "unknown");
    // Dynamic import: ops-alert.ts imports this module, so a static import would be a cycle.
    void import("./ops-alert").then((m) => m.alertOps("ratelimit_down", "Upstash no responde o token invalido")).catch(() => {});
    return null;
  }
}
