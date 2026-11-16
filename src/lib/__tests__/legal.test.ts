import { describe, expect, it } from "vitest";
import { LEGAL } from "../constants";

describe("LEGAL (data controller shown in /privacidad and /aviso-legal)", () => {
  it("has no unresolved placeholders before going to production", () => {
    expect(JSON.stringify(LEGAL)).not.toMatch(/PENDIENTE/);
  });
  it("identifies the controller and a contact address", () => {
    expect(LEGAL.controllerName.length).toBeGreaterThan(5);
    expect(LEGAL.controllerAddress.length).toBeGreaterThan(5);
    expect(LEGAL.privacyEmail).toMatch(/@gtdevsolutions\.com$/);
  });
});
