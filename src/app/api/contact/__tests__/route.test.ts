import { describe, expect, it } from "vitest";
import { POST } from "../route";

// No RESEND/UPSTASH env in tests: nothing is sent or stored.
const post = (body: unknown, origin = "https://gtdevsolutions.com") =>
  POST(
    new Request("https://gtdevsolutions.com/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json", origin },
      body: JSON.stringify(body),
    }),
  );

const valid = { nombre: "Ana", email: "ana@empresa.es", mensaje: "Hola", privacidad: true };

describe("POST /api/contact", () => {
  it("rejects foreign origins", async () => {
    expect((await post(valid, "https://evil.example")).status).toBe(403);
  });
  it("requires explicit privacy consent (RGPD)", async () => {
    expect((await post({ ...valid, privacidad: false })).status).toBe(400);
    const { privacidad: _omit, ...noConsent } = valid;
    expect((await post(noConsent)).status).toBe(400);
  });
  it("rejects invalid email", async () => {
    expect((await post({ ...valid, email: "nope" })).status).toBe(400);
  });
  it("silently accepts honeypot hits without sending anything", async () => {
    const res = await post({ ...valid, website: "http://spam" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });
  it("returns 502 when the lead can be neither emailed nor stored", async () => {
    expect((await post(valid)).status).toBe(502);
  });
});
