# gtdevsolutions.com

Production website of **GT Dev Solutions** (automation, web development and Web3 services), live at **https://gtdevsolutions.com**.

Built with Next.js 16 (App Router), React 19, TypeScript (strict) and Tailwind CSS v4. Content is in Spanish.

## Features

- Landing page: services, projects, about and contact sections.
- Interactive prototype catalog (`/catalogo`): 24 static HTML demos under `public/prototipos/`.
- Contact form (`POST /api/contact`): zod validation, honeypot, privacy checkbox, origin check, per-IP rate limiting (Upstash Redis), notification and auto-reply via Resend.
- AI chatbot (`POST /api/chat`): custom React widget plus a route handler using the Anthropic API (Vercel AI SDK), with conversation memory, daily cap and rate limits in Redis, and lead extraction.
- Legal pages (`/privacidad`, `/aviso-legal`) for GDPR/LSSI compliance.
- Unit tests with Vitest (security helpers, chat menu, API routes).

## Stack

| Area | Tech |
|---|---|
| Framework | Next.js 16 (standalone output), React 19, TypeScript 5.9 |
| Styling | Tailwind CSS v4, lucide-react |
| Validation | zod |
| Email | Resend |
| Rate limiting / memory | Upstash Redis + `@upstash/ratelimit` |
| AI | `ai` (Vercel AI SDK) + `@ai-sdk/anthropic` |
| Tests | Vitest |

## Architecture

```
src/
  app/            App Router pages and API routes (/api/contact, /api/chat)
  components/     UI components (ChatWidget, sections, footer...)
  lib/            constants, chat menu logic
  lib/server/     server-only code: env, security (IP/origin), email, prompts, ops alerts
public/prototipos static HTML prototype catalog
scripts/          env check and postbuild (standalone assets copy)
```

Server-only modules are isolated with `server-only`; all inputs are validated with zod; abusive traffic is limited per IP and per day.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in your own keys
npm run dev                  # http://localhost:3000
npm test                     # Vitest
npm run build && npm start   # production build (standalone)
```

Required services: Resend (email), Upstash Redis (limits/memory), Anthropic API (chatbot). See `.env.example`.

## Built by

Gustavo Tejera, https://github.com/GustavoVzla

License: MIT.

---

## Resumen en español

Sitio web real de GT Dev Solutions (https://gtdevsolutions.com), hecho con Next.js 16, React 19, TypeScript y Tailwind v4. Incluye landing, catálogo de 24 prototipos interactivos, formulario de contacto con validación, rate limiting y respuesta automática por email, y un chatbot con IA (Anthropic) con memoria y límites en Redis. Para ejecutarlo: `npm install`, copiar `.env.example` a `.env.local`, `npm run dev`.
