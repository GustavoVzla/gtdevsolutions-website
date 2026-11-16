/**
 * Welcome menu of the website chatbot, shared by the widget (client) and the
 * /api/chat route + system prompt (server). The greeting only exists in the
 * browser, so the backend must know the same numbering to understand a reply
 * such as "4". Keep this file free of server-only imports.
 */

/**
 * How the assistant addresses the user. Changing it switches the greeting, the
 * menu question and the client fallback message of the widget AND the tone
 * instruction of the system prompt.
 */
export type ChatTone = "tu" | "usted";
export const CHAT_TONE: ChatTone = "tu";

export const MENU_OPTIONS = [
  "1) Automatizar procesos",
  "2) Desarrollar una web o app a medida",
  "3) Implementar chatbots o asistentes con IA",
  "4) Aún no estoy segur@ y quiero explorar opciones",
] as const;

const [OPT1, OPT2, OPT3, OPT4] = MENU_OPTIONS;
const MENU_INLINE = `${OPT1}, ${OPT2}, ${OPT3}, o ${OPT4}.`;

export function welcomeMessages(tone: ChatTone): string[] {
  if (tone === "usted") {
    return [
      "¡Hola! 👋 Bienvenid@ a GT Dev Solutions",
      "Soy su asistente virtual. Estoy aquí para ayudarle a encontrar la solución tecnológica ideal para su negocio.",
      `¿Qué le interesa más? ${MENU_INLINE}`,
    ];
  }
  return [
    "¡Hola! 👋 Bienvenid@ a GT Dev Solutions",
    "Soy tu asistente virtual. Estoy aquí para ayudarte a encontrar la solución tecnológica ideal para tu negocio.",
    `¿Qué te interesa más? ${MENU_INLINE}`,
  ];
}

/** Message shown by the widget when the backend cannot answer. */
export function unavailableMessage(tone: ChatTone): string {
  return tone === "usted"
    ? "Ahora mismo no puedo responder. Puede escribirnos por WhatsApp al +34 600 000 000 o usar el formulario de la sección Contacto y le responderemos personalmente."
    : "Ahora mismo no puedo responder. Puedes escribirnos por WhatsApp al +34 600 000 000 o usar el formulario de la sección Contacto y te responderemos personalmente.";
}

/** Shown when a visitor sends too many messages (per-IP/session limits). */
export function rateLimitedMessage(tone: ChatTone): string {
  return tone === "usted"
    ? "Ha enviado muchos mensajes en poco tiempo. Espere unos minutos o escríbanos por WhatsApp al +34 600 000 000 o desde el formulario de Contacto."
    : "Has enviado muchos mensajes en poco tiempo. Espera unos minutos o escríbenos por WhatsApp al +34 600 000 000 o desde el formulario de Contacto.";
}

const CHOICE = /^(?:(?:opcion|la|el|numero|num|n)\s*)?#?\s*([1-4])\s*[).:\-]?$/;

/**
 * If the whole message is just a pick from the welcome menu ("4", "4)", "opción 2",
 * "la 3", "#1"), returns "<n>) <option text>"; otherwise null.
 */
export function normalizeMenuChoice(input: string): string | null {
  const s = input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  const m = CHOICE.exec(s);
  return m ? MENU_OPTIONS[Number(m[1]) - 1] : null;
}
