import { afterEach, describe, expect, it, vi } from "vitest";
import { escapeHtml, extractContact, getClientIp, isAllowedOrigin, maskEmail } from "../security";

const req = (origin?: string) =>
  new Request("https://gtdevsolutions.com/api/chat", { method: "POST", headers: origin ? { origin } : {} });

describe("extractContact", () => {
  it("finds an email", () => {
    expect(extractContact("escríbanme a juan.perez@empresa.es por favor").email).toBe("juan.perez@empresa.es");
  });
  it("finds Spanish and international phones", () => {
    expect(extractContact("mi móvil es 600 12 34 56").telefono).toBe("600 12 34 56");
    expect(extractContact("llámenme al +34 600123456").telefono).toBe("+34 600123456");
    expect(extractContact("whatsapp 0058 412 1234567").telefono).toBe("0058 412 1234567");
  });
  it("ignores budgets, dates and short numbers (regression: n8n regex flagged them as leads)", () => {
    expect(extractContact("tengo un presupuesto de 15000000").telefono).toBeUndefined();
    expect(extractContact("para el 2026-11-05").telefono).toBeUndefined();
    expect(extractContact("unos 5000 euros").telefono).toBeUndefined();
    expect(extractContact("pedido 123456789012345678").telefono).toBeUndefined();
  });
  it("never spans a newline in the phone", () => {
    expect(extractContact("604\n993451").telefono).toBeUndefined();
  });
  it("drops absurdly long emails", () => {
    expect(extractContact(`${"a".repeat(260)}@x.com`).email).toBeUndefined();
  });
});

describe("isAllowedOrigin", () => {
  afterEach(() => vi.unstubAllEnvs());
  it("allows production origins", () => {
    expect(isAllowedOrigin(req("https://gtdevsolutions.com"))).toBe(true);
    expect(isAllowedOrigin(req("https://www.gtdevsolutions.com"))).toBe(true);
  });
  it("rejects missing and foreign origins", () => {
    expect(isAllowedOrigin(req())).toBe(false);
    expect(isAllowedOrigin(req("https://evil.example"))).toBe(false);
  });
  it("allows only this deployment's own preview URL, not other website-* projects", () => {
    vi.stubEnv("VERCEL_URL", "website-abc123-gtdev.vercel.app");
    expect(isAllowedOrigin(req("https://website-abc123-gtdev.vercel.app"))).toBe(true);
    expect(isAllowedOrigin(req("https://website-attacker.vercel.app"))).toBe(false);
  });
});

describe("escapeHtml / maskEmail", () => {
  it("escapes HTML", () => {
    expect(escapeHtml(`<img src=x onerror="a('b')">&`)).toBe("&lt;img src=x onerror=&quot;a(&#39;b&#39;)&quot;&gt;&amp;");
  });
  it("masks emails for logs", () => {
    expect(maskEmail("juan@empresa.es")).toBe("ju***@empresa.es");
  });
});

describe("getClientIp", () => {
  afterEach(() => vi.unstubAllEnvs());
  const h = (headers: Record<string, string>) => new Request("https://gtdevsolutions.com/", { headers });

  it("uses x-real-ip first", () => {
    expect(getClientIp(h({ "x-real-ip": "203.0.113.5", "x-forwarded-for": "198.51.100.1" }))).toBe("203.0.113.5");
  });
  it("uses a single x-forwarded-for entry", () => {
    expect(getClientIp(h({ "x-forwarded-for": "203.0.113.7" }))).toBe("203.0.113.7");
  });
  it("ignores the client-controlled left side (hops=1 takes the last entry)", () => {
    expect(getClientIp(h({ "x-forwarded-for": "1.2.3.4, 203.0.113.9, 10.0.0.1" }))).toBe("10.0.0.1");
  });
  it("honours TRUSTED_PROXY_HOPS=2", () => {
    vi.stubEnv("TRUSTED_PROXY_HOPS", "2");
    expect(getClientIp(h({ "x-forwarded-for": "1.2.3.4, 203.0.113.9, 10.0.0.1" }))).toBe("203.0.113.9");
  });
  it("falls back to unknown when hops exceed the list", () => {
    vi.stubEnv("TRUSTED_PROXY_HOPS", "5");
    expect(getClientIp(h({ "x-forwarded-for": "203.0.113.9" }))).toBe("unknown");
  });
  it("rejects syntactically invalid IPs and falls through", () => {
    expect(getClientIp(h({ "x-real-ip": "not-an-ip", "x-forwarded-for": "evil, 203.0.113.9" }))).toBe("203.0.113.9");
    expect(getClientIp(h({ "x-forwarded-for": "garbage" }))).toBe("unknown");
  });
  it("accepts IPv6", () => {
    expect(getClientIp(h({ "x-real-ip": "2001:db8::1" }))).toBe("2001:db8::1");
  });
  it("CLIENT_IP_HEADER forces a single header and ignores the others", () => {
    vi.stubEnv("CLIENT_IP_HEADER", "cf-connecting-ip");
    expect(
      getClientIp(h({ "cf-connecting-ip": "203.0.113.20", "x-real-ip": "198.51.100.1", "x-forwarded-for": "198.51.100.2" })),
    ).toBe("203.0.113.20");
    expect(getClientIp(h({ "x-real-ip": "198.51.100.1" }))).toBe("unknown");
  });
  it("CLIENT_IP_HEADER=x-forwarded-for applies the hops rule", () => {
    vi.stubEnv("CLIENT_IP_HEADER", "X-Forwarded-For");
    expect(getClientIp(h({ "x-real-ip": "198.51.100.1", "x-forwarded-for": "9.9.9.9, 203.0.113.30" }))).toBe("203.0.113.30");
  });
  it("returns unknown without headers", () => {
    expect(getClientIp(h({}))).toBe("unknown");
  });
});

describe("rateLimitKey", () => {
  it("keeps IPv4 as is", async () => {
    const { rateLimitKey } = await import("../security");
    expect(rateLimitKey("188.26.195.164")).toBe("188.26.195.164");
  });
  it("groups IPv6 by /64 so rotating addresses in one prefix share a limit", async () => {
    const { rateLimitKey } = await import("../security");
    const a = rateLimitKey("2a0c:5a80:6101:ee00:1da4:8f8b:cbcd:aa10");
    const b = rateLimitKey("2a0c:5a80:6101:ee00:ffff:1:2:3");
    expect(a).toBe("2a0c:5a80:6101:ee00::/64");
    expect(b).toBe(a);
    expect(rateLimitKey("2a0c:5a80:6101:ee01::1")).not.toBe(a);
  });
  it("expands compressed IPv6 and strips leading zeros", async () => {
    const { rateLimitKey } = await import("../security");
    expect(rateLimitKey("2001:db8::1")).toBe("2001:db8:0:0::/64");
    expect(rateLimitKey("2001:0db8:0000:0042::5")).toBe("2001:db8:0:42::/64");
    expect(rateLimitKey("::1")).toBe("0:0:0:0::/64");
  });
  it("maps IPv4-mapped IPv6 to the IPv4", async () => {
    const { rateLimitKey } = await import("../security");
    expect(rateLimitKey("::ffff:203.0.113.9")).toBe("203.0.113.9");
  });
  it("leaves non-IP keys untouched", async () => {
    const { rateLimitKey } = await import("../security");
    expect(rateLimitKey("unknown")).toBe("unknown");
  });
});
