# Cloury Network

A cinematic, premium Minecraft network platform — built like a real gaming ecosystem, not a Minecraft server site.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/cloury run dev` — run the frontend (port 25583)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Framer Motion, Tailwind CSS, wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for all API contracts)
- `lib/db/src/schema/` — Drizzle DB schema (news.ts, events.ts, players.ts)
- `artifacts/api-server/src/routes/` — API route handlers
- `artifacts/cloury/src/` — React frontend
  - `src/components/home/` — Homepage section components (Hero, Features, etc.)
  - `src/pages/` — All page components
- `attached_assets/` — Brand images (Cloury logo variants)

## Architecture decisions

- OpenAPI-first: spec in `lib/api-spec/openapi.yaml` drives codegen for both frontend hooks and server Zod validators
- Leaderboard is derived from the players table (no separate table) — sorted at query time by category
- Server status returns live random ping/player count (no direct Minecraft API dependency)
- Brand images imported via `@assets/` alias pointing to `attached_assets/`
- Dark-only theme (no light mode) — deep navy/black with cyan+purple glow palette

## Product

- Fullscreen cinematic hero with live server status, animated player counter, copy-IP and Discord CTAs
- Homepage: features grid, network stats, news/events previews, FAQ, support CTA
- Pages: Wiki, Rules, Ranks, Leaderboard (kills/coins/playtime), News, Events, Player Profile, Support, Login/Register
- Live data: server status, news articles, events, leaderboard from PostgreSQL

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `openapi.yaml`
- Always run `pnpm --filter @workspace/db run push` after changing DB schema
- Do NOT restart the frontend workflow until backend routes are complete
- Brand images must be imported via `@assets/IMG_*.png` — the `attached_assets/` dir is not web-served directly

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
