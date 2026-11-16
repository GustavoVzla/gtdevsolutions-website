import { beforeEach, describe, expect, it, vi } from "vitest";

const generateText = vi.hoisted(() => vi.fn());
const stored = vi.hoisted(() => ({ pushed: [] as unknown[] }));

vi.mock("ai", () => ({ generateText }));
vi.mock("@ai-sdk/anthropic", () => ({ anthropic: (m: string) => ({ model: m }) }));
vi.mock("@/lib/server/redis", () => {
  const pipeline = {
    rpush: (_k: string, ...msgs: unknown[]) => {
      stored.pushed.push(...msgs);
      return pipeline;
    },
    ltrim: () => pipeline,
    expire: () => pipeline,
    exec: async () => [],
  };
  return {
    KEY_PREFIX: "test",
    limits: {},
    allow: async () => true,
    redis: { lrange: async () => [], pipeline: () => pipeline, set: async () => "OK" },
  };
});
vi.mock("@/lib/server/email", () => ({
  autoReplyEnabled: false,
  sendLeadAutoReply: vi.fn(),
  sendLeadNotice: vi.fn(async () => true),
}));
vi.mock("@/lib/server/leads", () => ({ saveLead: vi.fn(async () => true) }));
vi.mock("@/lib/server/ops-alert", () => ({ alertOps: vi.fn(), maskPhone: (p: string) => p }));

import { POST } from "../route";
import { MENU_OPTIONS } from "@/lib/chat-menu";

const send = (chatInput: string) =>
  POST(
    new Request("https://gtdevsolutions.com/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json", origin: "https://gtdevsolutions.com" },
      body: JSON.stringify({ action: "sendMessage", sessionId: "session-1234", chatInput }),
    }),
  );

describe("POST /api/chat menu numbering", () => {
  beforeEach(() => {
    process.env.ANTHROPIC_API_KEY = "test-key";
    stored.pushed = [];
    generateText.mockReset();
    generateText.mockResolvedValue({ text: "respuesta" });
  });

  it("expands a bare menu pick for the model and the stored history", async () => {
    const res = await send("4");
    expect(await res.json()).toEqual({ output: "respuesta" });
    const args = generateText.mock.calls[0][0];
    expect(args.messages.at(-1)).toEqual({
      role: "user",
      content: "4) Aún no estoy segur@ y quiero explorar opciones",
    });
    expect(args.instructions).toContain(MENU_OPTIONS.join("\n"));
    expect(stored.pushed[0]).toEqual({
      role: "user",
      content: "4) Aún no estoy segur@ y quiero explorar opciones",
    });
  });

  it("leaves normal messages untouched", async () => {
    await send("tengo 3 clínicas");
    expect(generateText.mock.calls[0][0].messages.at(-1)).toEqual({ role: "user", content: "tengo 3 clínicas" });
  });
});
