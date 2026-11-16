import { beforeEach, describe, expect, it, vi } from "vitest";

const calls: { op: string; args: unknown[] }[] = [];
const exec = vi.fn();
const fakeRedis = {
  pipeline: () => {
    const p = {
      set: (...args: unknown[]) => (calls.push({ op: "set", args }), p),
      zadd: (...args: unknown[]) => (calls.push({ op: "zadd", args }), p),
      zremrangebyscore: (...args: unknown[]) => (calls.push({ op: "zrem", args }), p),
      exec,
    };
    return p;
  },
};
const mod = { redis: fakeRedis as unknown, KEY_PREFIX: "gtdev-web" };
vi.mock("../redis", () => ({
  get redis() {
    return mod.redis;
  },
  KEY_PREFIX: "gtdev-web",
}));

import { saveLead } from "../leads";

const lead = { source: "form" as const, email: "a@b.com", email_sent: true };

beforeEach(() => {
  calls.length = 0;
  exec.mockReset().mockResolvedValue([]);
  mod.redis = fakeRedis;
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("saveLead", () => {
  it("returns false without redis", async () => {
    mod.redis = null;
    expect(await saveLead(lead)).toBe(false);
  });

  it("stores the lead with 12-month TTL and indexes it in the ZSET", async () => {
    expect(await saveLead(lead)).toBe(true);
    const set = calls.find((c) => c.op === "set")!;
    expect(String(set.args[0])).toMatch(/^gtdev-web:lead:[0-9a-f-]{36}$/);
    expect(set.args[2]).toEqual({ ex: 31536000 });
    expect(JSON.parse(set.args[1] as string)).toMatchObject({ email: "a@b.com", created_at: expect.any(String) });
    const zadd = calls.find((c) => c.op === "zadd")!;
    expect(zadd.args[0]).toBe("gtdev-web:leads");
    expect(typeof (zadd.args[1] as { score: number }).score).toBe("number");
    expect(calls.some((c) => c.op === "zrem")).toBe(true);
  });

  it("returns false and does not throw when exec fails", async () => {
    exec.mockRejectedValue(new Error("boom"));
    await expect(saveLead(lead)).resolves.toBe(false);
  });
});
