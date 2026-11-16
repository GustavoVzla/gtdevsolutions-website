/**
 * Env readers that treat EMPTY values as unset. Hosting panels (hPanel) can import a
 * `.env` with `NAME=` lines; with `process.env.NAME ?? default` an empty string would
 * win over the default (e.g. an empty LEADS_INBOX made lead notices fail on 2026-11-05).
 */
export function env(name: string): string | undefined {
  const v = process.env[name]?.trim();
  return v ? v : undefined;
}

/** Positive integer from env, or the default when unset, empty or invalid. */
export function envInt(name: string, fallback: number): number {
  const n = Number.parseInt(env(name) ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
