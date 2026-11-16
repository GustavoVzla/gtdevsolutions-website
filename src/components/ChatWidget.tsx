"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import {
  MAX_INPUT_LENGTH,
  SESSION_ID_PATTERN,
  mapHistory,
  parseMarkdownLite,
  type ChatMessage,
  type Inline,
} from "@/lib/chat-format";
import { CHAT_TONE, unavailableMessage, welcomeMessages } from "@/lib/chat-menu";

const STORAGE_KEY = "gtdev-chat-session";
const API_URL = "/api/chat";

const INITIAL_MESSAGES = welcomeMessages(CHAT_TONE);
const UNAVAILABLE = unavailableMessage(CHAT_TONE);

function getSessionId(create: boolean): string | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && SESSION_ID_PATTERN.test(stored)) return stored;
    if (!create) return null;
    const id = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    // localStorage blocked: use an in-memory id for this call.
    return create ? crypto.randomUUID() : null;
  }
}

async function post(body: Record<string, unknown>): Promise<unknown> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function InlineText({ nodes }: { nodes: Inline[] }) {
  return (
    <>
      {nodes.map((n, i) =>
        n.kind === "strong" ? <strong key={i}>{n.text}</strong> : <span key={i}>{n.text}</span>,
      )}
    </>
  );
}

/** Renders model text as React elements only; no HTML string is ever injected. */
function BotText({ text }: { text: string }) {
  return (
    <>
      {parseMarkdownLite(text).map((block, i) =>
        block.kind === "list" ? (
          <ul key={i} className="gt-chat-list">
            {block.items.map((item, j) => (
              <li key={j}>
                <InlineText nodes={item} />
              </li>
            ))}
          </ul>
        ) : (
          <p key={i}>
            {block.lines.map((line, j) => (
              <span key={j}>
                {j > 0 && <br />}
                <InlineText nodes={line} />
              </span>
            ))}
          </p>
        ),
      )}
    </>
  );
}

function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const counter = useRef(0);

  const nextId = () => `m${counter.current++}`;

  // Load previous session (or show the greeting) once when the panel opens.
  useEffect(() => {
    let cancelled = false;
    const greeting = (): ChatMessage[] =>
      INITIAL_MESSAGES.map((text) => ({ id: nextId(), role: "bot" as const, text }));
    const sessionId = getSessionId(false);
    if (!sessionId) {
      setMessages(greeting());
      setLoaded(true);
      return;
    }
    post({ action: "loadPreviousSession", sessionId })
      .then((payload) => {
        if (cancelled) return;
        const history = mapHistory(payload);
        setMessages(history.length ? history : greeting());
      })
      .catch(() => {
        if (!cancelled) setMessages(greeting());
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [loaded]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, waiting]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || waiting) return;
    const sessionId = getSessionId(true);
    setInput("");
    setMessages((m) => [...m, { id: nextId(), role: "user", text }]);
    setWaiting(true);
    try {
      const data = (await post({ action: "sendMessage", sessionId, chatInput: text })) as {
        output?: unknown;
      };
      const output = typeof data.output === "string" && data.output ? data.output : UNAVAILABLE;
      setMessages((m) => [...m, { id: nextId(), role: "bot", text: output }]);
    } catch {
      setMessages((m) => [...m, { id: nextId(), role: "bot", text: UNAVAILABLE }]);
    } finally {
      setWaiting(false);
      // The textarea is re-enabled on the next render; focus after it commits.
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [input, waiting]);

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Asistente virtual de GT Dev Solutions"
      className="gt-chat-panel"
    >
      <header className="gt-chat-header">
        <div>
          <h2>¡Hola! 👋 Bienvenid@</h2>
          <p>Asistente virtual de GT Dev Solutions</p>
        </div>
        <button type="button" aria-label="Cerrar" onClick={onClose} className="gt-chat-close">
          <X size={20} aria-hidden="true" />
        </button>
      </header>

      <div className="gt-chat-messages" role="log" aria-live="polite" aria-relevant="additions">
        {messages.map((m) => (
          <div key={m.id} className={`gt-chat-msg gt-chat-msg-${m.role}`}>
            {m.role === "bot" ? <BotText text={m.text} /> : <p>{m.text}</p>}
          </div>
        ))}
        {waiting && (
          <div className="gt-chat-msg gt-chat-msg-bot" role="status">
            <span className="gt-chat-sr">Escribiendo…</span>
            <span aria-hidden="true" className="gt-chat-dots">
              <i />
              <i />
              <i />
            </span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        className="gt-chat-form"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          rows={1}
          maxLength={MAX_INPUT_LENGTH}
          disabled={waiting}
          placeholder="Escribe tu mensaje aquí..."
          aria-label="Mensaje"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              void send();
            }
          }}
        />
        <button
          type="submit"
          aria-label="Enviar mensaje"
          disabled={waiting || input.trim() === ""}
          className="gt-chat-send"
        >
          <Send size={18} aria-hidden="true" />
        </button>
      </form>

      <footer className="gt-chat-footer">
        Asistente con IA: puede cometer errores. <Link href="/privacidad">Privacidad</Link>
      </footer>
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      {open && <ChatPanel onClose={close} />}
      <button
        type="button"
        className="gt-chat-toggle"
        aria-label={open ? "Cerrar asistente" : "Abrir asistente"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X size={28} aria-hidden="true" /> : <MessageCircle size={28} aria-hidden="true" />}
      </button>
    </>
  );
}
