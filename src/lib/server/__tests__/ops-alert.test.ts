import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const set = vi.fn();
vi.mock("../redis", () => ({ KEY_PREFIX: "gtdev-web", redis: { set: (...a: unknown[]) => set(...a) } }));

import { notifyOps } from "../ops-alert";

const fetchMock = vi.fn();

beforeEach(() => {
  set.mockReset().mockResolvedValue("OK");
  fetchMock.mockReset().mockResolvedValue({ ok: true, status: 200 });
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("notifyOps", () => {
  it("does nothing without env vars", async () => {
    await notifyOps("model_failed", "x");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts to Telegram with chat_id and keeps the token out of the body", async () => {
    vi.stubEnv("OPS_TELEGRAM_BOT_TOKEN", "SECRETTOKEN");
    vi.stubEnv("OPS_TELEGRAM_CHAT_ID", "12345");
    await notifyOps("model_failed", "boom");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://api.telegram.org/botSECRETTOKEN/sendMessage");
    expect(init.body).not.toContain("SECRETTOKEN");
    const body = JSON.parse(init.body);
    expect(body.chat_id).toBe("12345");
    expect(body.text).toContain("model_failed");
    expect(set).toHaveBeenCalledWith("gtdev-web:ops-alert:model_failed", 1, { nx: true, ex: 3600 });
  });

  it("skips a repeated non-lead alert within the hour", async () => {
    vi.stubEnv("OPS_TELEGRAM_BOT_TOKEN", "t");
    vi.stubEnv("OPS_TELEGRAM_CHAT_ID", "1");
    set.mockResolvedValue(null);
    await notifyOps("chat_cap", "x");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("always sends lead_lost", async () => {
    vi.stubEnv("OPS_TELEGRAM_BOT_TOKEN", "t");
    vi.stubEnv("OPS_TELEGRAM_CHAT_ID", "1");
    set.mockResolvedValue(null);
    await notifyOps("lead_lost", "x");
    await notifyOps("lead_lost", "x");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(set).not.toHaveBeenCalled();
  });

  it("never throws when fetch fails", async () => {
    vi.stubEnv("OPS_TELEGRAM_BOT_TOKEN", "SECRETTOKEN");
    vi.stubEnv("OPS_TELEGRAM_CHAT_ID", "1");
    fetchMock.mockRejectedValue(new Error("network down"));
    await expect(notifyOps("lead_lost", "x")).resolves.toBeUndefined();
  });
});
