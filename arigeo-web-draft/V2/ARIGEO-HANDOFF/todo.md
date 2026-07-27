# TODO — ARIGEO Corporate Website

> **MANDATORY:** Base44 has been removed from the handoff baseline. Do not reinstall, restore or use it as a temporary bridge.

## Definition of Done

งานถือว่าเสร็จเมื่อ:

- Desktop homepage visually matches `handoff/references/target-red-circle.png`
- All PPTX sitemap pages/templates exist and route correctly
- TH/EN content model works without mixed-language leakage
- Public pages require no authentication
- Payload CMS can manage homepage, brands, products, categories, news, media and SEO
- Forms, GA4/GTM events, accessibility, responsive layout and production build are validated
- No Base44 package, plugin, config, environment variable, client, API call or auth scaffold exists in source or production bundle

---

## P0 — Establish a trustworthy baseline

- [ ] Create a working branch and record original ZIP checksum
- [ ] Run `npm install`; capture full output
- [x] Remove Base44 Vite plugin and keep React-only Vite config
- [ ] Normalize Tailwind config for ESM
- [ ] Run and pass `npm run lint`
- [ ] Run and pass `npm run typecheck`
- [ ] Run and pass `npm run build`
- [ ] Start local dev server and capture baseline screenshots at 1440, 1024, 768, 390 widths
- [ ] Record baseline console/network errors
- [x] Confirm no Base44 data/backend is required for public pages

**P0 acceptance:** clean install + lint + typecheck + build with evidence.

---

## P1 — Remove legacy coupling and establish architecture

- [x] Remove `AuthProvider` and Base44 auth gate from public route tree
- [x] Remove unused Base44 login/register/reset/forgot password pages
- [x] Remove `src/api/base44Client.js`
- [x] Remove `base44/` config directory
- [x] Remove `@base44/sdk` and `@base44/vite-plugin` from dependencies
- [ ] Remove dead UI libraries that are not used by target scope; verify with import scan
- [ ] Define route map with locale prefix
- [ ] Add error boundary and public 404 page consistent with design system
- [ ] Add environment schema and `.env.example` without secrets
- [ ] Decide monorepo boundary:
  - [ ] `apps/web` = existing React/Vite frontend
  - [ ] `apps/cms` = Payload CMS
  - [ ] shared generated types/API client

**P1 acceptance:** public homepage opens directly, repository scan finds no Base44 runtime reference, network panel has no Base44 requests, and build remains green.

---

## P2 — Design system and exact homepage implementation

### Tokens and foundations

- [ ] Add approved ARIGEO red/black/white/neutral/green tokens
- [ ] Define container widths, section spacing, radii, shadows, borders and type scale
- [ ] Add approved web fonts or approved system fallback
- [ ] Add real ARIGEO logo component from supplied asset
- [ ] Add reusable `Container`, `Section`, `Button`, `IconButton`, `Card`, `LinkArrow` primitives
- [ ] Add responsive image component with aspect ratio and focal point support

### Header

- [ ] Match desktop header geometry from target
- [ ] Implement real menu routes
- [ ] Add desktop divider, language switcher and search
- [ ] Build accessible mobile navigation
- [ ] Verify sticky/scroll state without layout jump

### Hero

- [ ] Rebuild red-circle product composition exactly
- [ ] Lock desktop headline line breaks and red emphasis
- [ ] Use approved hero packshot(s), not remote placeholder
- [ ] Match CTA size/radius/arrow
- [ ] Add slider indicators; implement actual slides only when content exists
- [ ] Validate crop at 1440, 1280, 1024, 768, 390

### Category gateway

- [ ] Rebuild Household card
- [ ] Rebuild Skincare card
- [ ] Add red underline, overlay panel, CTA and circular icon
- [ ] Route to brand/product discovery pages

### Trust/value panel

- [ ] Convert to single bordered 3-column container
- [ ] Add separators and bottom arrows
- [ ] Ensure mobile stack has logical separators

### News

- [ ] Rebuild bordered four-card layout
- [ ] Add category pill + date row
- [ ] Add equal-height title/arrow layout
- [ ] Add newsroom route and article links

### Newsletter

- [ ] Rebuild horizontal desktop panel
- [ ] Add validation, loading, error and success states
- [ ] Add privacy/consent link

### Footer

- [ ] Rebuild light footer columns
- [ ] Add black legal strip
- [ ] Replace placeholder links and social URLs
- [ ] Use dynamic year

**P2 acceptance:** screenshot comparison at 1440px has no major structural/layout mismatch with target.

---

## P3 — Full sitemap and templates

- [ ] About Us landing
- [ ] ARIGEO Way / purpose / mission / vision / values
- [ ] Our Brands hub
- [ ] Captainmaid brand landing
- [ ] GenuLeaf brand landing
- [ ] CeraTory brand landing
- [ ] Products listing
- [ ] Product filters: brand, category, concern, type, collection
- [ ] Product detail template
- [ ] Innovation page
- [ ] Sustainability / Responsibility page
- [ ] Newsroom listing
- [ ] News article template
- [ ] Careers page
- [ ] Contact page
- [ ] Privacy, Terms and Sitemap pages
- [ ] Breadcrumbs on nested pages
- [ ] Empty states and no-result states

**P3 acceptance:** every navigation/footer link resolves to a real, responsive page or an explicitly marked unpublished route.

---

## P4 — Payload CMS

- [ ] Initialize Payload CMS in separate app/package
- [ ] Configure database and media storage for target environment
- [ ] Create localized collections and globals from `handoff/CMS_CONTENT_MODEL.md`
- [ ] Generate TypeScript types/API contract
- [ ] Implement draft/preview flow
- [ ] Implement frontend caching and revalidation strategy
- [ ] Add seed data matching approved homepage copy
- [ ] Add role model for CMS admins/editors
- [ ] Add image alt text/focal point validation
- [ ] Add slug uniqueness and redirect handling
- [ ] Add form submission collections or approved delivery integration
- [ ] Document backup/restore and content migration

**P4 acceptance:** marketing editor can create/publish a product and news item in both languages without code changes.

---

## P5 — Localization, SEO, forms and analytics

### Localization

- [ ] Implement `/en` and `/th`
- [ ] Add language switch preserving equivalent route where possible
- [ ] Add localized slug strategy
- [ ] Add fallback behavior that never mixes languages in one page

### SEO

- [ ] Per-page title/meta/OG fields
- [ ] Canonical and hreflang
- [ ] XML sitemap
- [ ] robots.txt controls
- [ ] Structured data for Organization/Product/Article/Breadcrumb
- [ ] 301 redirect registry

### Forms

- [ ] General enquiry
- [ ] Partnership/distributor enquiry
- [ ] Career/contact routing
- [ ] Newsletter signup
- [ ] Server validation + spam protection + rate limiting
- [ ] Configurable email/routing recipients
- [ ] Privacy consent and retention policy

### Analytics

- [ ] GA4/GTM configuration through environment variables
- [ ] Implement events listed in `DIFF.md`
- [ ] Add consent-aware loading where required
- [ ] Verify events in debug mode

**P5 acceptance:** localized metadata validates, all forms submit end-to-end, expected analytics events fire once.

---

## P6 — Assets and content production

- [ ] Obtain approved ARIGEO logo files
- [ ] Obtain exact hero product packshots
- [ ] Obtain Household lifestyle image
- [ ] Obtain Skincare still-life image
- [ ] Obtain four news images
- [ ] Obtain brand key visuals for Captainmaid, GenuLeaf and CeraTory
- [ ] Enter final corporate address/contact/map
- [ ] Enter approved mission/vision/values
- [ ] Enter product copy, usage, ingredients/technology and substantiated claims
- [ ] Add image licensing/source log
- [ ] Produce responsive AVIF/WebP/JPEG derivatives

**P6 acceptance:** no production page depends on temporary remote generated-image URLs.

---

## P7 — QA, security and release

- [ ] Run complete `handoff/QA_CHECKLIST.md`
- [ ] Visual regression at required breakpoints
- [ ] Keyboard and screen-reader smoke test
- [ ] Lighthouse production audit
- [ ] Cross-browser: Chrome, Edge, Safari, Firefox
- [ ] Validate form abuse controls
- [ ] Validate no secrets/service keys in client bundle
- [ ] Validate CMS authorization and upload restrictions
- [ ] Validate sitemap, robots, canonical and redirects
- [ ] Validate 404/500/error states
- [ ] Create deployment and rollback runbook
- [ ] Create content editor guide
- [ ] Obtain final stakeholder sign-off

**P7 acceptance:** production build, release checklist and rollback procedure are all documented and tested.
