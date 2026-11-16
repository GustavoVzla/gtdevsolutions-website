// Run on the server: `node scripts/check-env.mjs`. Prints only variable NAMES, never values.
const required = [
  ["RESEND_API_KEY"],
  ["KV_REST_API_URL", "UPSTASH_REDIS_REST_URL"],
  ["KV_REST_API_TOKEN", "UPSTASH_REDIS_REST_TOKEN"],
  ["ANTHROPIC_API_KEY"],
];
const optional = [
  "CLIENT_IP_HEADER", "TRUSTED_PROXY_HOPS", "EMAIL_FROM", "LEADS_INBOX", "CHAT_MODEL", "CHAT_DAILY_CAP",
  "ALLOWED_ORIGINS", "AUTO_REPLY_ENABLED", "OPS_TELEGRAM_BOT_TOKEN", "OPS_TELEGRAM_CHAT_ID",
];
const temporary = [];
const set = (n) => Boolean(process.env[n]?.trim());

let missing = 0;
for (const group of required) {
  const ok = group.some(set);
  if (!ok) missing++;
  console.log(`${ok ? "OK     " : "MISSING"} (required) ${group.join(" | ")}`);
}
for (const n of optional) console.log(`${set(n) ? "set    " : "unset  "} (optional) ${n}`);
for (const n of temporary) {
  console.log(`${set(n) ? "set    " : "unset  "} (temporary) ${n}${set(n) ? "  <- remove after the header check" : ""}`);
}
console.log(missing ? `\n${missing} required variable(s) missing.` : "\nAll required variables present.");
process.exit(missing ? 1 : 0);
