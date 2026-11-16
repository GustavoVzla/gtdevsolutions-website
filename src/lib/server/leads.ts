import "server-only";
import { redis, KEY_PREFIX } from "./redis";

/**
 * Backup copy of every lead in Upstash Redis (the same DB used for rate limits).
 *  - `gtdev-web:lead:<id>`  JSON string, TTL 12 months (retention in the privacy policy)
 *  - `gtdev-web:leads`      ZSET of ids, score = creation time in ms (index)
 * Read in the Upstash console: ZRANGE gtdev-web:leads 0 -1, then GET gtdev-web:lead:<id>.
 */
const RETENTION_SECONDS = 31_536_000; // 365 days
const RETENTION_MS = RETENTION_SECONDS * 1000;

export type LeadSource = "form" | "chatbot";

export interface LeadRecord {
  source: LeadSource;
  nombre?: string | null;
  email?: string | null;
  telefono?: string | null;
  empresa?: string | null;
  mensaje?: string | null;
  session_id?: string | null;
  email_sent: boolean;
}

/** Never throws: a storage failure must not break lead delivery by email. */
export async function saveLead(lead: LeadRecord): Promise<boolean> {
  if (!redis) return false;
  try {
    const id = crypto.randomUUID();
    const now = Date.now();
    const record = { ...lead, created_at: new Date(now).toISOString() };
    const pipe = redis.pipeline();
    pipe.set(`${KEY_PREFIX}:lead:${id}`, JSON.stringify(record), { ex: RETENTION_SECONDS });
    pipe.zadd(`${KEY_PREFIX}:leads`, { score: now, member: id });
    // Drop index entries whose lead key has already expired.
    pipe.zremrangebyscore(`${KEY_PREFIX}:leads`, 0, now - RETENTION_MS);
    await pipe.exec();
    return true;
  } catch (e) {
    console.error("[leads] store failed:", e instanceof Error ? e.name : "unknown");
    return false;
  }
}
