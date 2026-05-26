# insulmakkah.com

The website of **عوازل مكة** — insulation and leak-detection services in Makkah, KSA.

Next.js 15 (App Router) + TypeScript + Tailwind v4. Deploys to Vercel.

## Structure

| Path | What it is |
|---|---|
| `/app` | App Router routes — homepage, `/services`, `/areas`, `/contact`, `/about`, `/blog`, and the 180 SEO-driver pages at `/[city]/[service]`. |
| `/components` | UI components — Hero, ServiceCard, FAQAccordion, CityServiceGrid, etc. |
| `/content` | Typed content modules — services, cities, city×service overrides, reviews, business profile. Zod-validated at build time. Shape mirrors the planned Sanity schema 1:1. |
| `/lib` | Shared helpers — SEO metadata, URL builders. |
| `/scripts` | Build-time scripts — content validation. |
| `/public` | Static assets — images, favicons, GSC verification. |
| `/data` | Legacy blog post JSON (10 posts × AR/EN). Preserved for the upcoming Sanity migration; not consumed by the app yet. |
| `/.github/workflows` | CI — typecheck, lint, content validation, build. |

## Local development

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

| Script | What it does |
|---|---|
| `npm run dev` | Next.js dev server with HMR |
| `npm run build` | Validate content + production build (220 static pages) |
| `npm run typecheck` | `tsc --noEmit` over the project |
| `npm run validate-content` | Zod-validates `content/*.ts` and prints per-city override coverage |
| `npm run lint` | ESLint with `next/core-web-vitals` + `next/typescript` rules |

## Deploy

Vercel project's **Root Directory** is the repository root.

- Required env var: `NEXT_PUBLIC_GA_ID` (currently `G-J3SV4QG95R`).
- Sitemap, robots, and OG images are generated from `app/sitemap.ts`, `app/robots.ts`, and per-page metadata helpers in `lib/seo.ts`.
- Legacy URLs `/index.html` and `/blog.html` 308-redirect to their new paths via `next.config.ts`.

## Content authoring

The 9 services and 20 cities/neighborhoods power 180 city × service SEO landing pages at `/[city]/[service]`. Each combo can have a hand-written override in `content/city-service-overrides.ts` (≥550 chars, gated by Zod at build time). Combos without an override fall through to a templated default — SEO-acceptable but lower value.

`npm run validate-content` prints per-city coverage so you can prioritise authoring.
