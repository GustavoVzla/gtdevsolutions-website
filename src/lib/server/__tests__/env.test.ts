import { afterEach, describe, expect, it, vi } from "vitest";
import { env, envInt } from "../env";

describe("env helpers (empty values count as unset)", () => {
  afterEach(() => vi.unstubAllEnvs());
  it("returns undefined for unset, empty and blank values", () => {
    vi.stubEnv("X_TEST_EMPTY", "");
    vi.stubEnv("X_TEST_BLANK", "   ");
    expect(env("X_TEST_UNSET_123")).toBeUndefined();
    expect(env("X_TEST_EMPTY")).toBeUndefined();
    expect(env("X_TEST_BLANK")).toBeUndefined();
  });
  it("returns trimmed values", () => {
    vi.stubEnv("X_TEST_VAL", "  soluciones@gtdevsolutions.com ");
    expect(env("X_TEST_VAL")).toBe("soluciones@gtdevsolutions.com");
  });
  it("regression: empty LEADS_INBOX falls back to the default with ??", () => {
    vi.stubEnv("LEADS_INBOX", "");
    expect(env("LEADS_INBOX") ?? "soluciones@gtdevsolutions.com").toBe("soluciones@gtdevsolutions.com");
  });
  it("envInt: default on empty/invalid/non-positive, parsed otherwise", () => {
    vi.stubEnv("X_INT", "");
    expect(envInt("X_INT", 500)).toBe(500);
    vi.stubEnv("X_INT", "abc");
    expect(envInt("X_INT", 500)).toBe(500);
    vi.stubEnv("X_INT", "0");
    expect(envInt("X_INT", 500)).toBe(500);
    vi.stubEnv("X_INT", "300");
    expect(envInt("X_INT", 500)).toBe(300);
  });
});
