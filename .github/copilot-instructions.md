# Copilot Instructions for HidroKaltim

## Build, test, and lint commands

- Install dependencies: `npm install`
- Dev server: `npm run dev`
- Production build: `npm run build`
- Production server: `npm run start`
- Lint all files: `npm run lint`
- Lint a single file: `npx eslint app/components/Body.tsx`
- Tests: there is currently no test runner/script configured in `package.json` (no `test` script), so single-test execution is not available yet.

## High-level architecture

- Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Leaflet, Prisma.
- Current app entry is `app/page.tsx`, which composes `Header`, `Body`, and `Footer`.
- The weather dashboard flow is currently client-driven:
  - `app/components/Body.tsx` (`"use client"`) creates mocked BMKG-like weather payload data and passes both flattened forecast data and raw nested weather data to `CurahHujan`.
  - `app/components/CurahHujan.tsx` computes 24-hour alert states from `RawWeatherData` (`cuaca` nested arrays with numeric weather codes), then renders cards and map container UI.
  - `app/components/WeatherMap.tsx` is a client-only Leaflet integration with dynamic import in `useEffect` and explicit map cleanup.
- Prisma is configured for MySQL (`prisma.config.ts` + `DATABASE_URL`) with a minimal `User` model in `prisma/schema.prisma`; this data layer is currently not connected to active UI routes/components.
- `docs/frontend-guide.md` and `docs/backend-guide.md` contain broader Indonesian migration/architecture guidance; treat them as context and verify against the current code tree before implementing features.

## Key conventions

- Keep product/UI copy in Indonesian unless the task explicitly changes language.
- Use `"use client"` only for interactive/browser-only behavior (state/effects/Leaflet); keep other components server-compatible where possible.
- Preserve the existing weather data contract used by `Body` and `CurahHujan`:
  - raw shape: `RawWeatherData` with `cuaca: WeatherForecast[][]`
  - alert logic depends on numeric BMKG weather code thresholds.
- Follow existing Tailwind-first styling patterns (utility classes, gradient cards, no CSS module pattern in current components).
- Path alias `@/*` is available via `tsconfig.json`.
- Because this project uses a newer Next.js version, read relevant docs in `node_modules/next/dist/docs/` before implementing framework-level changes.
