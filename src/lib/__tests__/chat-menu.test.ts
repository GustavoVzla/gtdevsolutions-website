import { describe, expect, it } from "vitest";
import { MENU_OPTIONS, normalizeMenuChoice, welcomeMessages } from "../chat-menu";
import { buildChatbotPrompt } from "../server/chatbot-prompt";

describe("normalizeMenuChoice", () => {
  it.each(["4", "4)", "4.", " 4 ", "opción 4", "opcion 4", "Opción 4", "OPCION 4", "la 4", "#4", "n 4"])(
    "maps %j to option 4",
    (input) => {
      expect(normalizeMenuChoice(input)).toBe("4) Aún no estoy segur@ y quiero explorar opciones");
    },
  );
  it("maps every option 1-4 to its menu text", () => {
    [1, 2, 3, 4].forEach((n, i) => expect(normalizeMenuChoice(String(n))).toBe(MENU_OPTIONS[i]));
    expect(normalizeMenuChoice("#1")).toBe("1) Automatizar procesos");
    expect(normalizeMenuChoice("opción 2")).toBe("2) Desarrollar una web o app a medida");
  });
  it.each(["0", "5", "9", "12", "opción 7", "4 sucursales", "tengo 3 clínicas", "hola", "", "1 2", "a4"])(
    "returns null for %j",
    (input) => {
      expect(normalizeMenuChoice(input)).toBeNull();
    },
  );
});

describe("welcome menu", () => {
  it("welcomeMessages('tu') carries the exact menu options", () => {
    const menu = welcomeMessages("tu")[2];
    for (const o of MENU_OPTIONS) expect(menu).toContain(o);
    expect(menu).toBe(
      "¿Qué te interesa más? 1) Automatizar procesos, 2) Desarrollar una web o app a medida, 3) Implementar chatbots o asistentes con IA, o 4) Aún no estoy segur@ y quiero explorar opciones.",
    );
  });
  it("usted variant keeps the same options", () => {
    const msgs = welcomeMessages("usted");
    expect(msgs).toHaveLength(3);
    for (const o of MENU_OPTIONS) expect(msgs[2]).toContain(o);
    expect(msgs.join(" ")).not.toMatch(/vosotros|\btu\b|\bte\b/i);
  });
});

describe("system prompt", () => {
  const prompt = buildChatbotPrompt("tu");
  it("lists the welcome menu with exact numbering and the option 4 rule", () => {
    expect(prompt).toContain("## Menú inicial (ya mostrado al usuario)");
    expect(prompt).toContain(MENU_OPTIONS.join("\n"));
    expect(prompt).toMatch(/La opción 4 significa que aún no sabe qué necesita/);
    expect(prompt).toContain("no reenumeres los servicios");
  });
  it("tone line follows the tone", () => {
    expect(prompt).toContain("Trata al usuario de tú (castellano neutro, nunca vosotros).");
    expect(buildChatbotPrompt("usted")).toContain("Trata al usuario de usted (castellano neutro, nunca vosotros).");
  });
});
