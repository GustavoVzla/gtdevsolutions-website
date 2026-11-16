/**
 * Pure helpers for the website chat widget: markdown-lite parsing (no HTML is
 * ever produced, only a typed tree the component renders as React elements)
 * and mapping of the /api/chat `loadPreviousSession` payload.
 */

export type ChatRole = "user" | "bot";
export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
}

export type Inline = { kind: "text"; text: string } | { kind: "strong"; text: string };
export type Block =
  | { kind: "paragraph"; lines: Inline[][] }
  | { kind: "list"; items: Inline[][] };

export const MAX_INPUT_LENGTH = 1000;
export const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{8,100}$/;

/** Splits **bold** segments; everything else stays literal text. */
export function parseInline(line: string): Inline[] {
  const out: Inline[] = [];
  const re = /\*\*([^*\n]+?)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) out.push({ kind: "text", text: line.slice(last, m.index) });
    out.push({ kind: "strong", text: m[1] });
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push({ kind: "text", text: line.slice(last) });
  return out;
}

const LIST_ITEM = /^\s*(?:[-*•]|\d+[.)])\s+(.*)$/;

/** Paragraphs (blank-line separated, single newlines kept as line breaks) and "- " lists. */
export function parseMarkdownLite(input: string): Block[] {
  const blocks: Block[] = [];
  let para: Inline[][] = [];
  let list: Inline[][] = [];
  const flushPara = () => {
    if (para.length) blocks.push({ kind: "paragraph", lines: para });
    para = [];
  };
  const flushList = () => {
    if (list.length) blocks.push({ kind: "list", items: list });
    list = [];
  };
  for (const raw of input.replace(/\r\n?/g, "\n").split("\n")) {
    const item = LIST_ITEM.exec(raw);
    if (item) {
      flushPara();
      list.push(parseInline(item[1]));
    } else if (raw.trim() === "") {
      flushPara();
      flushList();
    } else {
      flushList();
      para.push(parseInline(raw.trim()));
    }
  }
  flushPara();
  flushList();
  return blocks;
}

interface StoredMessage {
  id?: unknown;
  kwargs?: { content?: unknown };
}

/** Maps the `loadPreviousSession` response to chat messages; ignores malformed entries. */
export function mapHistory(payload: unknown): ChatMessage[] {
  const data = (payload as { data?: unknown } | null)?.data;
  if (!Array.isArray(data)) return [];
  const out: ChatMessage[] = [];
  data.forEach((entry: StoredMessage, i: number) => {
    const idPath = Array.isArray(entry?.id) ? entry.id : [];
    const kind = idPath[idPath.length - 1];
    const content = entry?.kwargs?.content;
    if (typeof content !== "string" || content === "") return;
    if (kind === "HumanMessage") out.push({ id: `h${i}`, role: "user", text: content });
    else if (kind === "AIMessage") out.push({ id: `h${i}`, role: "bot", text: content });
  });
  return out;
}
