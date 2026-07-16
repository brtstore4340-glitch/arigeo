# ARIGEO Route Inventory and Map (ROUTE-MAP.md)

This file documents the routing structure of the ARIGEO corporate website.

## 1. Active Implemented Routes
All active routes are locale-aware and handled through Next.js App Router and `next-intl` middleware.

| Path Pattern | Component File | Description | Status |
|---|---|---|---|
| `/` | `src/middleware.ts` | Redirects to default locale (`/th`) | Active |
| `/[locale]` | `src/app/[locale]/page.tsx` | Redesigned Homepage | Active (CONDITIONAL PASS) |

## 2. Planned / Redesign Page Scope (Supporting Pages)
These routes are defined in `TODO.md` and are ready for implementation.

| Path Pattern | Target Component File | Phase | Status |
|---|---|---|---|
| `/[locale]/about` | `src/app/[locale]/about/page.tsx` | Phase 3 | Ready to start |
| `/[locale]/brands` | `src/app/[locale]/brands/page.tsx` | Phase 4 | Ready to start |
| `/[locale]/brands/captain-maid` | `src/app/[locale]/brands/captain-maid/page.tsx` | Phase 4 | Ready to start |
| `/[locale]/brands/genuleaf` | `src/app/[locale]/brands/genuleaf/page.tsx` | Phase 4 | Ready to start |
| `/[locale]/brands/ceratory` | `src/app/[locale]/brands/ceratory/page.tsx` | Phase 4 | Ready to start |
| `/[locale]/products` | `src/app/[locale]/products/page.tsx` | Phase 5 | Blocked by content contract |
| `/[locale]/products/[product-slug]` | `src/app/[locale]/products/[product-slug]/page.tsx` | Phase 5 | Blocked by content contract |
| `/[locale]/innovation` | `src/app/[locale]/innovation/page.tsx` | Phase 6 | Ready to start |
| `/[locale]/sustainability` | `src/app/[locale]/sustainability/page.tsx` | Phase 6 | Ready to start |
| `/[locale]/newsroom` | `src/app/[locale]/newsroom/page.tsx` | Phase 7 | Ready to start |
| `/[locale]/newsroom/[article-slug]` | `src/app/[locale]/newsroom/[article-slug]/page.tsx` | Phase 7 | Ready to start |
| `/[locale]/careers` | `src/app/[locale]/careers/page.tsx` | Phase 7 | Ready to start |
| `/[locale]/contact` | `src/app/[locale]/contact/page.tsx` | Phase 7 | Ready to start |
| `/[locale]/privacy` | `src/app/[locale]/privacy/page.tsx` | Phase 10 | Ready to start |
| `/[locale]/terms` | `src/app/[locale]/terms/page.tsx` | Phase 10 | Ready to start |
| `/[locale]/sitemap` | `src/app/[locale]/sitemap/page.tsx` | Phase 10 | Ready to start |

## 3. SEO / Search Engine Routes
These virtual or static resources are mapped in the public root.

| Route | Source / Target File | Purpose | Status |
|---|---|---|---|
| `/sitemap.xml` | `src/app/sitemap.xml/route.ts` | Search engine XML map | Planned |
| `/robots.txt` | `src/app/robots.txt/route.ts` | Search crawler guidance | Planned |
