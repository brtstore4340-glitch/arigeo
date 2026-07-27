# ARIGEO Website DIFF

> **Mandatory baseline update:** Base44 SDK/plugin/config/client and its auth scaffold have been removed from this handoff package. The implementation must keep them absent. Reintroducing Base44 is not allowed.


## 0. Scope and source of truth

เอกสารนี้เทียบ 3 สถานะ:

- **A — Current deployed visual:** `handoff/references/current-deployed-2026-07-16.png` (392×2048)
- **B — Editable source baseline:** React/Vite project ใน ZIP นี้
- **C — Target:** `handoff/references/target-red-circle.png` (864×1821) + `Arigeo-Brief.pptx`

> ข้อสำคัญ: A กับ B ไม่ใช่ implementation เดียวกันอย่างชัดเจน ภาพ deployed เป็นหน้าไทยแบบ corporate/medical ยาวหลาย section ขณะที่ source ZIP มี component structure ที่ใกล้ C มากกว่า ดังนั้นให้แก้จาก **B** และใช้ **A** เพื่อดูสิ่งที่ต้องเลิกใช้เท่านั้น

---

## 1. Executive diff

| Area | Current deployed (A) | ZIP baseline (B) | Required target (C) |
|---|---|---|---|
| Primary positioning | Supplier/corporate trust, medical and industrial tone | Consumer corporate homepage skeleton | Corporate credibility + brand gateway for Household and Skincare |
| Language | Thai content แม้ path แสดง `/en` | English hard-coded | TH/EN route and CMS fields; `/en` English, `/th` Thai |
| Hero | Centered Thai statement + product thumbnail strip | 2-column English hero | Exact red-circle composition, left narrative, right product still life, slider indicators |
| Navigation | Small Thai nav + red contact button | Desktop English nav | Compact Kao-inspired nav, ARIGEO wordmark, Global selector, search, responsive menu |
| Brand discovery | Business fields and categories | Two category cards | Household + Skincare gateway with image-led cards, then brand/product routes |
| Trust/value | Multiple long corporate sections | 3 generic value props | Single bordered 3-column trust panel matching mockup |
| News | 3 cards | 4 cards, minimal styling | 4 bordered editorial cards with category/date/title/arrow |
| Conversion | Large red partnership contact section | Newsletter only | Homepage newsletter per mockup + dedicated contact/partnership/career forms |
| Footer | Dark footer | Light footer only | Light multi-column footer + black legal strip |
| CMS | Not visible | Static `siteData.js` | Payload CMS, admin-friendly modules, draft/preview, TH/EN |
| Product discovery | Category tiles only | No product route | Brand hub, product listing filters, product detail template |
| SEO/analytics | Unknown | Basic static meta only | Page-level SEO, clean URLs, GA4/GTM events |

---

## 2. What to preserve from the ZIP baseline

- React 18 + Vite + Tailwind component model
- Existing homepage component split:
  - `Navigation.jsx`
  - `Hero.jsx`
  - `ContentSplit.jsx`
  - `ValueProps.jsx`
  - `NewsStories.jsx`
  - `Newsletter.jsx`
  - `Footer.jsx`
- `react-router-dom` for public routes
- `lucide-react` for utility icons, provided final icons visually match the reference
- Global design token approach in `src/index.css`
- Alias `@/*` pattern

Preserve structure, not current measurements/content.

---

## 3. P0 technical blockers before visual work

### 3.1 Vite config is invalid

**File:** `vite.config.js`

- Calls `base44({...})`
- Does not import `base44`
- Source is configured as ESM (`"type": "module"`)

**Handoff baseline:** Base44 plugin/runtime coupling is removed. Keep the Vite build React-only and do not use a temporary Base44 migration bridge.

### 3.2 Public site is wrapped in authentication

**Files:** `src/App.jsx`, `src/lib/AuthContext.jsx`, auth pages/components

- Home rendering waits for auth/public settings
- Auth errors can redirect users to login
- Contradicts corporate public website requirement

**Target action:** public routes render without auth. CMS admin authentication belongs to Payload CMS, not the public app.

### 3.3 Base44 export dependencies and dead code

**Files/dirs:** `base44/`, `src/api/base44Client.js`, auth pages, Base44 packages in `package.json`

- Adds unused runtime, attack surface and maintenance cost
- Existing Base44 client is a stub returning false/empty data

**Handoff baseline:** removed after dependency scan. Do not restore these files or packages.

### 3.4 Tailwind config module mismatch risk

**File:** `tailwind.config.js`

- Uses `module.exports` while project is ESM

**Target action:** convert to `export default` or rename to `.cjs`, then validate build.

### 3.5 Missing production assets

**File:** `src/lib/siteData.js`

- All images use external generated-image URLs
- Export report shows `assetCount: 0`

**Target action:** store approved assets locally or in controlled CMS media storage with stable alt text, focal point and responsive derivatives.

### 3.6 Baseline validation unavailable

- `npm install` timed out in handoff environment
- `npm run build` could not run because dependencies were unavailable

**Target action:** first developer must capture actual install/lint/typecheck/build evidence.

---

## 4. Homepage visual diff — section by section

### 4.1 Header / Navigation

**Baseline:** `src/components/Navigation.jsx`

Required changes:

- Replace CSS-drawn logo text with approved ARIGEO SVG/PNG wordmark
- Match target header height, left/right padding and compact menu spacing
- Add vertical divider before Global selector on desktop
- Keep search as icon-only control with accessible label
- Global selector must map to `/en` and `/th`, not a decorative button
- Add active/focus/keyboard states
- On mobile: drawer/sheet with scroll lock, Escape close, focus management
- Header may be sticky; avoid oversized shadow. Use subtle border/elevation only after scroll

Target menu:

`About Us | Our Brands | Products | Innovation | Sustainability | Newsroom | Careers | Contact Us`

### 4.2 Hero — highest visual priority

**Baseline:** `src/components/Hero.jsx`

Required desktop composition:

- Two-column composition approximately 42% copy / 58% image
- Headline breaks:
  - `Elevating`
  - `Everyday Life`
  - red emphasis: `Through Innovation`
  - red emphasis: `People Understand`
- Product still life must sit in front of a dominant solid ARIGEO red circle
- Plant and towel props remain secondary; no busy background
- CTA: solid red rounded rectangle with right arrow
- Slider indicators at bottom-left, first active red
- Large neutral background, high whitespace, no blurred red blob as final treatment

Baseline mismatch:

- Current source uses a blurred low-opacity circle and a standalone product PNG
- Text wraps responsively without controlled desktop line breaks
- Hero uses `min-h-[90vh]`, which may not match reference height

Required responsive behavior:

- Tablet: retain product priority, reduce circle and typography safely
- Mobile: copy first, product second; circle remains behind product and cannot overlap text; CTA full-width only when necessary

### 4.3 Household / Skincare gateway

**Baseline:** `src/components/ContentSplit.jsx`

Required changes:

- Cards must match reference: large image area with a pale translucent/gradient text panel
- Title, red underline, description, text CTA and circular outlined category icon
- Preserve equal height and matched visual rhythm
- Link destinations:
  - Household → `/[locale]/brands/captainmaid` or filtered product listing
  - Skincare → brand gateway for GenuLeaf + CeraTory
- Content must be CMS-driven and localized

Baseline mismatch:

- Source uses a generic 50/50 flex card with icon above title
- Missing red underline and bottom circular icon treatment

### 4.4 Trust/value panel

**Baseline:** `src/components/ValueProps.jsx`

Required changes:

- Place all 3 items inside one bordered white container
- Vertical separators on desktop
- Icons are red line icons, not icons in tinted circles
- Text aligns left
- Add small arrow action at bottom of each column
- Section background remains white; do not use a full gray band

Values:

1. Innovation for Better Living
2. Sustainability for the Future
3. Safety & Quality You Can Trust

Each item should route to its relevant content page.

### 4.5 News & Stories

**Baseline:** `src/components/NewsStories.jsx`

Required changes:

- Section heading and `View All News →` on same row
- Four equal bordered cards on desktop
- Image ratio and card border radius match reference
- Category pill and date share one metadata row
- Title has fixed line clamp for equal card height
- Bottom-right arrow action
- Data from Payload CMS with publish date, category, slug, locale and SEO fields

Baseline mismatch:

- Articles are borderless and metadata is stacked
- Dates/content differ from target and brief
- No article route

### 4.6 Newsletter

**Baseline:** `src/components/Newsletter.jsx`

Required changes:

- Desktop layout is horizontal: copy left, email field center/right, CTA right
- Pale neutral full-width panel with moderate radius
- Validation, consent/privacy copy and actual integration endpoint required
- Success/error/loading states must be accessible
- Do not use local React state as production submission persistence

### 4.7 Footer

**Baseline:** `src/components/Footer.jsx`

Required changes:

- Light footer with logo/description/socials at left and six link columns
- Dedicated black legal strip below it
- Footer links must route to real pages
- Correct current year dynamically
- Social links and corporate details must come from CMS/global settings
- `Careers` cannot be represented by assigning `id="careers"` to footer

---

## 5. Information architecture diff from PPTX

The ZIP only implements `/` and a 404 route. Required public routes:

```text
/[locale]
/[locale]/about
/[locale]/about/arigeo-way
/[locale]/brands
/[locale]/brands/captainmaid
/[locale]/brands/genuleaf
/[locale]/brands/ceratory
/[locale]/products
/[locale]/products/[slug]
/[locale]/innovation
/[locale]/sustainability
/[locale]/newsroom
/[locale]/newsroom/[slug]
/[locale]/careers
/[locale]/contact
/[locale]/privacy
/[locale]/terms
/[locale]/sitemap
```

Required product discovery filters:

- Brand
- Business/category: Household, Skincare
- Concern: Cleansing, Barrier Care, Brightening, Acne Care, Anti-bac, etc.
- Product type
- Launch collection

Required product details:

- Product image(s)
- Name
- Size
- Key benefit
- Overview
- Usage
- Key ingredients / technology
- Safety / quality claims
- Related products
- Contact CTA

---

## 6. Brand/content diff

### Required brand families

- **Captainmaid** — Household
  - Floor Cleaner
  - Bathroom Cleaner
  - Kitchen Cleaner
  - Glass Cleaner
  - Multi-purpose Disinfectant
  - Dishwash / Dishwasher product naming to be confirmed by owner
  - Hand Wash
  - Washing Machine Cleaner
  - Anti-bac Home Care
- **GenuLeaf** — Skincare
  - Soothing
  - Brightening
  - Barrier Repair
  - Cleansing
  - Acne Care
- **CeraTory** — Derma Skincare
  - Final product names and categories are still UNKNOWN in the PPTX

### Required corporate content

- Company overview and purpose
- ARIGEO Way
- Mission, vision and values
- Quality with Purpose
- Innovation That Understands People
- Care Beyond the Product
- Principles and commitments
- R&D, ingredients and standards
- Care for home, skin and planet

The deployed page’s medical/industrial supplier framing can only be reused where approved; it cannot replace the brand gateway structure in the brief.

---

## 7. CMS and data diff

**Current:** all data hard-coded in `src/lib/siteData.js`.

**Target:** Payload CMS with admin-friendly collections and globals. See `handoff/CMS_CONTENT_MODEL.md`.

Must support:

- TH/EN localized fields
- Draft/publish and preview
- Reusable media with alt text and focal point
- Ordered homepage modules
- Brand/product/news/category CRUD
- SEO metadata and social image
- Contact/form routing settings
- Redirect management
- Audit fields

---

## 8. Forms, SEO and analytics diff

### Forms

Required:

- General enquiry
- Partnership/distributor enquiry
- Career/contact routing
- Newsletter signup

Each needs server-side validation, spam protection, success/error state and routing destination configuration.

### SEO

Required:

- Localized title and meta description
- Canonical URL and hreflang
- Clean slugs
- Open Graph/Twitter metadata
- Organization, Product, Article and Breadcrumb structured data where valid
- XML sitemap and robots controls

### Analytics

Required GA4/GTM events:

- `contact_submit`
- `partnership_submit`
- `career_contact_submit`
- `newsletter_submit`
- `brand_click`
- `product_view`
- `product_filter`
- `language_change`

Do not load analytics before consent where legally required.

---

## 9. Accessibility and performance diff

Required minimum:

- WCAG 2.2 AA target
- Keyboard-complete navigation and forms
- Visible focus states
- Semantic heading order
- Accessible labels for icon buttons
- Correct alt text; decorative images use empty alt
- Respect `prefers-reduced-motion`
- Responsive images (`srcset`/sizes or CMS derivatives)
- Lazy-load below-fold media
- No layout shift from images/fonts
- Lighthouse target on production-like build:
  - Performance ≥ 90
  - Accessibility ≥ 95
  - Best Practices ≥ 95
  - SEO ≥ 95

---

## 10. UNKNOWN / owner input required

Do not invent these:

- Approved ARIGEO logo master files and logo clear-space rules
- Approved product packshots and exact product labels
- Final company address, phone, email and map
- Final mission/vision/value copy
- Claims substantiation and legal wording
- GenuLeaf and CeraTory final SKU names
- Career vacancies/workflow
- Social media URLs
- Newsletter/email provider and form recipients
- GA4/GTM IDs
- Cookie/consent requirements by target markets
- Final hosting/domain/environment ownership
