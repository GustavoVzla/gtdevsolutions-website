import { describe, expect, it } from "vitest";
import { mapHistory, parseInline, parseMarkdownLite } from "../chat-format";

describe("parseInline", () => {
  it("extracts bold segments", () => {
    expect(parseInline("a **b** c")).toEqual([
      { kind: "text", text: "a " },
      { kind: "strong", text: "b" },
      { kind: "text", text: " c" },
    ]);
  });
  it("leaves unmatched markers as text", () => {
    expect(parseInline("2 ** 3")).toEqual([{ kind: "text", text: "2 ** 3" }]);
  });
});

describe("parseMarkdownLite", () => {
  it("builds paragraphs with line breaks and lists", () => {
    const blocks = parseMarkdownLite("Hola **mundo**\nsegunda línea\n\n- uno\n- **dos**\n\nFin");
    expect(blocks).toHaveLength(3);
    expect(blocks[0]).toMatchObject({ kind: "paragraph" });
    expect((blocks[0] as { lines: unknown[] }).lines).toHaveLength(2);
    expect(blocks[1]).toEqual({
      kind: "list",
      items: [[{ kind: "text", text: "uno" }], [{ kind: "strong", text: "dos" }]],
    });
    expect(blocks[2]).toMatchObject({ kind: "paragraph" });
  });
  it("keeps raw HTML as literal text (never an element)", () => {
    const blocks = parseMarkdownLite('<script>alert(1)</script> **x**');
    const json = JSON.stringify(blocks);
    expect(json).toContain("<script>alert(1)</script>");
    expect(blocks.every((b) => b.kind === "paragraph" || b.kind === "list")).toBe(true);
    expect(json).not.toMatch(/"kind":"(?!text|strong|paragraph|list)/);
  });
  it("returns no blocks for empty input", () => {
    expect(parseMarkdownLite("  \n\n")).toEqual([]);
  });
});

describe("mapHistory", () => {
  it("maps human and AI messages and skips malformed entries", () => {
    const res = mapHistory({
      data: [
        { id: ["langchain", "schema", "HumanMessage"], kwargs: { content: "hola" } },
        { id: ["langchain", "schema", "AIMessage"], kwargs: { content: "qué tal" } },
        { id: ["x", "SystemMessage"], kwargs: { content: "no" } },
        { id: ["x", "AIMessage"], kwargs: {} },
        null,
      ],
    });
    expect(res.map((m) => [m.role, m.text])).toEqual([
      ["user", "hola"],
      ["bot", "qué tal"],
    ]);
  });
  it("handles bad payloads", () => {
    expect(mapHistory(null)).toEqual([]);
    expect(mapHistory({ data: "x" })).toEqual([]);
  });
});
