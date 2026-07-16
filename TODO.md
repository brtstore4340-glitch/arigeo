# ARIGEO Website Redesign — TODO.md (SSOT)

**Status:** Active implementation source of truth  
**Project:** ARIGEO Corporate + Brand Gateway Website  
**Project root:** `D:\01 Main Work\Boots\Agentic AI\mission-control\arigeo-project`  
**Implementation root:** `D:\01 Main Work\Boots\Agentic AI\mission-control\arigeo-project\arigeo-web-draft`  
**Approved mockup/assets:** `D:\01 Main Work\Boots\Agentic AI\mission-control\arigeo-project\arigeo-web-draft\baseonme`  
**Authoritative plan:** `D:\01 Main Work\Boots\Agentic AI\mission-control\arigeo-project\REDESIGN-PLAN.md`  
**Brief source:** Google Slides “Arigeo Brief”  
**Last revised:** 2026-07-15

> This file is the single source of truth for all ARIGEO redesign agents.  
> No other TODO, scratch plan, or agent-created checklist may override this file.

---

# 0. Execution Rules — LOCKED

## 0.1 Source priority

When sources conflict, use this order:

1. `TODO.md` — execution status, phase gates, locked decisions
2. `REDESIGN-PLAN.md` — intended corrections and implementation strategy
3. Approved mockup and assets in `arigeo-web-draft\baseonme`
4. Approved company brief and factual business content
5. Existing source code
6. Agent assumptions

The current rendered website is not an authoritative design source unless this file marks the section as approved.

## 0.2 Completion rule

Do not mark any item complete using build output alone.

Completion requires applicable evidence from:

- Visual comparison
- Route validation
- Functional validation
- Desktop, tablet, and mobile proof
- Type check
- Lint
- Production build
- Console review
- Accessibility review
- Content verification

## 0.3 Content integrity

- Do not invent claims, certifications, customer counts, statistics, addresses, policies, partners, prices, ratings, awards, sustainability targets, or medical/dermatological approval.
- Missing factual content must be marked `CONTENT REQUIRED`.
- Placeholder content must never be silently treated as production content.
- Product structured data must not include fabricated offers, prices, availability, ratings, or reviews.

## 0.4 Agent safety

- No two agents may edit the same file at the same time.
- Each task must declare file ownership before implementation.
- Agents must read this file before editing source code.
- Agents must not change framework, routing model, CMS choice, or design direction without an explicit update to this file.
- Preserve working functionality and create a backup before destructive changes.
- Do not delete assets until replacements have been visually validated.
- Do not create duplicated page implementations.
- Do not leave experimental files in production routes.

---

# 1. Locked Architecture Decisions

## 1.1 Product role

ARIGEO is:

- A corporate website
- A brand portfolio gateway
- A product-discovery layer
- A trust-building platform
- A scalable foundation for future launches

ARIGEO is not:

- A heavy e-commerce website
- A direct replacement for the Captain Maid consumer website
- A medical-supply or hospital-equipment website
- A generic consulting-company template

## 1.2 Brand structure

Canonical display names:

- ARIGEO
- Captain Maid
- GenuLeaf
- CeraTory

Canonical slugs:

- `captain-maid`
- `genuleaf`
- `ceratory`

Do not use:

- `CaptainMaid`
- `Captainmaid`
- `captainmaid`
- `ceratories`

## 1.3 Frontend stack

Current stack remains authoritative unless `REDESIGN-PLAN.md` explicitly approves a change:

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- next-intl
- Vercel

Do not migrate frameworks during redesign.

## 1.4 CMS architecture

CMS choice is locked:

```text
D:\01 Main Work\Boots\Agentic AI\mission-control\brand-content-platform
```

- CMS: Payload CMS
- Database: Supabase PostgreSQL
- Media: Vercel Blob
- Hosting: Vercel
- Architecture: Central multi-brand headless CMS

Do not install Sanity or Strapi.

During redesign:

- Use local typed content adapters where needed.
- Keep UI component contracts compatible with future Payload CMS records.
- Do not make public rendering depend on an unfinished CMS.
- Connect the live CMS only after page, route, and content contracts are stable.

## 1.5 Locale and routes

All public routes must support locale-aware rendering.

Preferred route contract:

```text
/[locale]
/[locale]/about
/[locale]/brands
/[locale]/brands/[brand-slug]
/[locale]/products
/[locale]/products/[product-slug]
/[locale]/innovation
/[locale]/sustainability
/[locale]/newsroom
/[locale]/newsroom/[article-slug]
/[locale]/careers
/[locale]/contact
/[locale]/privacy
/[locale]/terms
/[locale]/sitemap
```

Required behavior:

- `/` resolves or redirects to the default locale.
- `/en/...` renders English.
- `/th/...` renders Thai.
- Locale switching preserves the current page where possible.
- Missing translations use documented fallback behavior.
- No accidental Thai/English mixing.

---

# 2. Locked Design Direction

## 2.1 Brand expression

- White-dominant composition
- Strong black typography
- ARIGEO red as the primary brand signal
- Soft neutral support surfaces
- Green only as a subtle nature cue
- Nature-science visual language
- Premium, calm, clear, human, and credible
- Generous but controlled whitespace
- Clear CTA hierarchy
- No clutter

## 2.2 Kao reference rule

Kao Global may inspire:

- Information architecture
- Navigation clarity
- Brand gateway behavior
- Calm browsing experience
- Category-first discovery

Kao must not be copied visually. ARIGEO identity must remain dominant.

## 2.3 Photography rules

Use:

- Bright home rituals
- Clean household environments
- Skincare textures
- Natural ingredients
- Product still life
- Light and approachable lab/science moments
- Everyday care
- Product quality and trust

Avoid primary imagery that positions ARIGEO as:

- A hospital supplier
- A medical-equipment vendor
- A warehouse operator
- A generic corporate consultancy

Third-party brand imagery must not appear in production without approval.

---

# 3. Current Project Status

## 3.1 Homepage status

**Status: CONDITIONAL PASS — supporting pages may proceed**

Completed at desktop level:

- [x] Header structure aligned with approved direction
- [x] Hero composition restored
- [x] Product-led hero visual restored
- [x] Large red-circle motif restored
- [x] Household gateway restored
- [x] Skincare gateway restored
- [x] Three trust pillars restored
- [x] News & Stories structure restored
- [x] Newsletter structure restored
- [x] Corporate footer structure restored
- [x] English homepage visually close to approved mockup
- [x] Thai homepage visually close to approved mockup

Remaining homepage backlog:

- [ ] Replace the unapproved Curology image
- [ ] Verify all hero and product mockups are approved assets
- [ ] Remove or flag placeholder news content
- [ ] Remove or verify unproven claims, including carbon-neutrality wording
- [ ] Improve Thai hero line breaks
- [ ] Improve Thai card heading line breaks
- [ ] Improve Thai navigation readability
- [ ] Improve trust-pillar body-text readability
- [ ] Improve footer readability
- [ ] Validate desktop at 1440px and 1920px
- [ ] Complete tablet proof
- [ ] Complete mobile proof
- [ ] Complete keyboard and focus-state review
- [ ] Complete performance baseline

Homepage is no longer a blocker for About, Brands, Innovation, Sustainability, Newsroom, Careers, and Contact work.

Homepage final approval remains required before production launch.

---

# 4. Global Sitemap and Page Scope

## 4.1 Required pages

- [x] Home shell exists
- [x] About Us / ARIGEO Way (Proof: /[locale]/about route)
- [ ] Our Brands portfolio
- [ ] Captain Maid brand page
- [ ] GenuLeaf brand page
- [ ] CeraTory brand page
- [ ] Products listing
- [ ] Product detail template
- [ ] Innovation
- [ ] Sustainability / Responsibility
- [ ] Newsroom listing
- [ ] News article detail
- [ ] Careers
- [ ] Contact Us
- [ ] Privacy Policy
- [ ] Terms of Use
- [ ] Human-readable sitemap
- [ ] XML sitemap
- [ ] robots.txt

## 4.2 Header navigation

Required top-level items:

- [x] About Us
- [x] Our Brands
- [x] Products
- [x] Innovation
- [x] Sustainability
- [x] Newsroom
- [x] Careers
- [x] Contact Us
- [x] Language switcher
- [x] Search icon present
- [ ] Decide whether search is UI-only or implemented
- [ ] Validate mobile hamburger at 320px+
- [ ] Validate keyboard operation
- [ ] Validate focus visibility
- [ ] Validate locale switch preserves current page

## 4.3 Footer

- [x] Corporate multi-column footer exists
- [ ] Validate every footer link
- [ ] Replace placeholder social links
- [ ] Replace placeholder company summary where required
- [ ] Add final legal links
- [ ] Add final copyright text
- [ ] Add human sitemap link
- [ ] Ensure all links return 200 or an intentional redirect

---

# 5. Phase Plan and Gates

## Phase 0 — Audit, Safety, and Contract

**Status: COMPLETE**

- [x] Review official brief
- [x] Review approved homepage mockup
- [x] Establish design direction
- [x] Establish central CMS architecture
- [x] Create current route inventory (Proof: ROUTE-MAP.md)
- [x] Create component inventory (Proof: COMPONENT-MAP.md)
- [x] Create content inventory (Proof: CONTENT-INVENTORY.md)
- [x] Create asset inventory (Proof: ASSET-INVENTORY.md)
- [x] Create current build baseline (Proof: next build success log)
- [x] Create visual-gap report for all existing pages (Proof: REDESIGN-GAP-REPORT.md)
- [x] Identify files expected to change by phase (Proof: REDESIGN-AUDIT.md)
- [x] Back up current working implementation (Proof: recovery/src-redesign-backup/)
- [x] Record backup path (Proof: `recovery/src-redesign-backup/`)
- [x] Confirm Git working tree state (Proof: `git status` clear check)
- [x] Confirm current production/deployment baseline (Proof: production build passing)

**Exit gate:** inventories, backup, baseline, and risks documented.

---

## Phase 1 — Homepage Visual Parity

**Status: CONDITIONAL PASS**

See Section 3.1.

**Exit gate for final pass:**

- [ ] Approved assets only
- [ ] Verified copy only
- [ ] Desktop proof
- [ ] Tablet proof
- [ ] Mobile proof
- [ ] Accessibility baseline
- [ ] Performance baseline
- [ ] No material visual mismatch with approved mockup

Supporting pages may proceed before final pass.

---

## Phase 2 — Shared Design System and Application Shell

**Status: COMPLETE**

- [x] Consolidate color tokens
- [x] Consolidate typography scale
- [x] Consolidate spacing scale
- [x] Consolidate container widths
- [x] Consolidate grid rules
- [x] Consolidate border and radius tokens
- [x] Consolidate shadow tokens
- [x] Consolidate button variants
- [x] Consolidate link variants
- [x] Consolidate cards
- [x] Consolidate form controls
- [x] Consolidate section headings
- [x] Consolidate focus states
- [x] Consolidate reduced-motion behavior
- [x] Document responsive breakpoints
- [x] Document image aspect ratios
- [x] Document page-shell structure
- [x] Remove arbitrary one-off styling where safe
- [x] Ensure Thai font rendering is consistent
- [x] Ensure English font rendering is consistent

**Exit gate:** new pages can reuse shared components without copying homepage code.

---

## Phase 3 — About Us / ARIGEO Way

**Status: COMPLETE**

Required route:

```text
/[locale]/about
```

Required sections:

- [x] Company overview (Proof: AboutPage)
- [x] Short company story (Proof: storyText in messages)
- [x] Our Purpose (Proof: description in messages)
- [x] Our Mission (Proof: missionItems in messages)
- [x] Our Vision (Proof: visionText in messages)
- [x] Our Values (Proof: values list in messages)
- [x] Quality with Purpose (Proof: companyInfoTitle & principles keys)
- [x] Innovation That Understands People (Proof: principles keys)
- [x] Care Beyond the Product (Proof: storyText & locationsText)
- [x] Our Principles
  - [x] We Make Safety and Quality Non-Negotiable
  - [x] We Improve Every Day
  - [x] We Grow Responsibly
  - [x] We Succeed Together
- [x] Our Commitment (Proof: principles keys)
- [x] Leadership (Factual gate: CONTENT REQUIRED)
- [x] Milestones / timeline (Factual gate: CONTENT REQUIRED)
- [x] Locations (Proof: locationsText in messages)

Implementation rules:

- [x] Use typed content data
- [x] Support TH/EN
- [x] Do not fabricate company history (Certified story from mockup used)
- [x] Do not fabricate leadership information (Marked as CONTENT REQUIRED)
- [x] Do not fabricate locations (Certified Chatuchak address used)
- [x] Mark unavailable sections `CONTENT REQUIRED` (Verified warning boxes)
- [x] Use approved ARIGEO design system (Reuses global tokens)
- [x] Add page metadata
- [x] Add breadcrumbs
- [x] Add responsive proof

**Exit gate:** complete structure, verified available content, no fabricated facts.

---

## Phase 4 — Our Brands

**Status: STRUCTURE COMPLETE — pending responsive proof and content approval**

Required routes (all implemented, dynamic rendering; unknown slug → 404):

```text
/[locale]/brands
/[locale]/brands/captain-maid
/[locale]/brands/genuleaf
/[locale]/brands/ceratory
```

Portfolio page:

- [x] Household foundation (Proof: /[locale]/brands household section)
- [x] Skincare foundation (Proof: /[locale]/brands skincare section)
- [x] Clear brand entry points (Proof: BrandCard → /brands/[slug])
- [x] Brand overview cards (Proof: BrandCard with positioning + category tags)
- [x] Category-first browsing (Proof: category tags on cards)
- [x] Links to brand and product pages (Proof: exploreBrand + viewProducts links; /products route itself is Phase 5)

Each brand page must support:

- [x] Brand story (Proof: Brands.*.story in messages, storyTitle section)
- [x] Benefit focus (Proof: positioning line in hero)
- [x] Product categories (Proof: numbered category grid from messages)
- [ ] Hero products (blocked: no approved brand-specific product imagery; CeraTory renders brand mark instead — no ARIGEO-branded photos reused to avoid misrepresentation)
- [x] Distinct visual identity within ARIGEO system (Proof: per-brand image/brand-mark hero within shared tokens)
- [x] Link to product listing (Proof: viewProducts → /products; route lands in Phase 5)
- [x] TH/EN (Proof: Brands namespace parity verified in both message files)
- [x] SEO metadata (Proof: generateMetadata per slug with localized name + positioning)
- [x] Breadcrumbs (Proof: Home / Our Brands / [Brand] nav)
- [ ] Responsive proof

Captain Maid:

- [x] Household positioning (Proof: Brands.captainMaid.positioning)
- [x] Floor Cleaner (Proof: categories[0])
- [x] Bathroom Cleaner (Proof: categories[1])
- [x] Kitchen Cleaner (Proof: categories[2])
- [x] Glass Cleaner (Proof: categories[3])
- [x] Multi-purpose Disinfectant (Proof: categories[4])
- [x] Dishwashing (Proof: categories[5])
- [ ] Additional approved categories

GenuLeaf:

- [x] Soothing (Proof: categories[0])
- [x] Brightening (Proof: categories[3])
- [x] Barrier repair (Proof: categories[2])
- [x] Cleansing (Proof: categories[1])
- [ ] Replace placeholder products with approved data (CONTENT REQUIRED gate rendered on page)

CeraTory:

- [x] Derma-skincare positioning (Proof: Brands.ceraTory.positioning)
- [x] Acne care (Proof: categories[1])
- [x] Barrier care (Proof: categories[0])
- [ ] Replace placeholder products with approved data (CONTENT REQUIRED gate rendered on page)
- [x] Do not claim dermatologist approval unless verified (Proof: no such claim in copy)

**Exit gate:** all three pages use approved content or explicit content-required markers.

---

## Phase 5 — Product Discovery and Product Detail

**Status: BLOCKED BY CONTENT CONTRACT**

Required routes:

```text
/[locale]/products
/[locale]/products/[product-slug]
```

Product-listing requirements:

- [ ] Lightweight corporate product discovery
- [ ] No heavy e-commerce UI
- [ ] Filters:
  - [ ] Brand
  - [ ] Category
  - [ ] Concern
  - [ ] Product type
  - [ ] Launch collection
- [ ] Desktop filter layout
- [ ] Mobile filter layout
- [ ] Empty state
- [ ] Reset filters
- [ ] URL or state behavior documented
- [ ] Keyboard-accessible controls

Product-card fields:

- [ ] Image
- [ ] Product name
- [ ] Brand
- [ ] Size
- [ ] Key benefit
- [ ] CTA

Product-detail fields:

- [ ] Overview
- [ ] Usage
- [ ] Key ingredients or technology
- [ ] Safety claims
- [ ] Quality claims
- [ ] Related products
- [ ] Contact CTA
- [ ] Image gallery where assets support it
- [ ] TH/EN
- [ ] SEO metadata
- [ ] Breadcrumbs

Content rules:

- [ ] Canonical product data kept outside visual components
- [ ] No fabricated price
- [ ] No fabricated availability
- [ ] No fabricated rating or review
- [ ] Product JSON-LD only when factual required fields exist
- [ ] Related products use documented rules, not arbitrary AI selection

**Exit gate:** typed product contract approved and sample records validated.

---

## Phase 6 — Innovation and Sustainability

**Status: READY TO START WITH VERIFIED CONTENT**

Innovation route:

```text
/[locale]/innovation
```

Innovation requirements:

- [ ] R&D
- [ ] Ingredients
- [ ] Technology
- [ ] Standards
- [ ] Quality assurance
- [ ] Science-and-nature storytelling
- [ ] Verified evidence only
- [ ] No fabricated laboratory or certification claims

Sustainability route:

```text
/[locale]/sustainability
```

Sustainability requirements:

- [ ] Care for home, skin, and planet
- [ ] Environment
- [ ] Social responsibility
- [ ] Governance, where approved
- [ ] Verified proof points only
- [ ] No unverified carbon-neutrality target
- [ ] CMS-ready content structure

**Exit gate:** all public claims have approved sources or are removed.

---

## Phase 7 — Newsroom, Careers, and Contact

### 7.1 Newsroom

Routes:

```text
/[locale]/newsroom
/[locale]/newsroom/[article-slug]
```

- [ ] Listing page
- [ ] Article detail template
- [ ] Category
- [ ] Publication date
- [ ] Hero image
- [ ] Body content
- [ ] Author only when factual
- [ ] SEO metadata
- [ ] Related news
- [ ] Homepage integration
- [ ] Replace placeholder articles before production

### 7.2 Careers

Route:

```text
/[locale]/careers
```

- [ ] Why ARIGEO
- [ ] Open positions
- [ ] Life at ARIGEO
- [ ] Application method
- [ ] Privacy consent where applicable
- [ ] Decide internal form, email routing, or external link
- [ ] Do not publish fictional vacancies

### 7.3 Contact

Route:

```text
/[locale]/contact
```

MVP approach:

- [ ] Build one reusable enquiry form
- [ ] Enquiry types:
  - [ ] General
  - [ ] Product
  - [ ] Partnership / Distributor
  - [ ] Media
  - [ ] Career
- [ ] Name
- [ ] Email
- [ ] Phone
- [ ] Company
- [ ] Subject / enquiry type
- [ ] Message
- [ ] Client validation
- [ ] Server validation
- [ ] Rate limiting or anti-spam
- [ ] Consent text
- [ ] Privacy link
- [ ] Verified success state only after server acceptance
- [ ] Confirmation email only after mail-provider proof
- [ ] Define recipient/routing rules
- [ ] Replace placeholder address
- [ ] Replace placeholder phone
- [ ] Replace placeholder email
- [ ] Replace placeholder map

Separate specialized forms may be added only after business fields and routing are approved.

**Exit gate:** forms have proven backend handling and do not fake success.

---

## Phase 8 — Local Content Adapter and CMS Readiness

**Status: PLAN AFTER CONTENT CONTRACTS**

- [ ] Define typed interfaces for:
  - [ ] Pages
  - [ ] Brands
  - [ ] Products
  - [ ] Categories
  - [ ] News
  - [ ] Media
  - [ ] Navigation
  - [ ] Site settings
- [ ] Keep local content adapter working without CMS
- [ ] Separate content from presentation
- [ ] Remove duplicated canonical data
- [ ] Document Payload-compatible field mapping
- [ ] Add timeout contract for future CMS calls
- [ ] Add cached fallback contract
- [ ] Add error boundaries where async data is introduced
- [ ] Document migration sequence
- [ ] Document rollback sequence

**Exit gate:** all page components consume stable typed contracts.

---

## Phase 9 — Central Payload CMS Integration

**Status: NOT STARTED**

CMS root:

```text
D:\01 Main Work\Boots\Agentic AI\mission-control\brand-content-platform
```

Initial CMS modules:

- [ ] Users
- [ ] Sites
- [ ] Pages
- [ ] Brands
- [ ] Products
- [ ] Categories
- [ ] Media
- [ ] News / Articles
- [ ] Navigation
- [ ] Site settings

Capabilities:

- [ ] TH/EN fields
- [ ] Draft
- [ ] Preview
- [ ] Publish
- [ ] Media management
- [ ] Site ownership
- [ ] Role-based access
- [ ] Marketing-friendly fields
- [ ] No unrestricted CSS editing
- [ ] No arbitrary HTML unless sanitized and approved
- [ ] On-demand revalidation
- [ ] CMS-unavailable fallback
- [ ] Data migration proof
- [ ] No inconsistency between local source and CMS master data

**Exit gate:** Marketing can update approved content without code changes.

---

## Phase 10 — SEO, Analytics, and Legal

### 10.1 SEO

- [ ] Clean localized URLs
- [ ] Unique page titles
- [ ] Unique meta descriptions
- [ ] Canonical URLs
- [ ] hreflang for TH/EN
- [ ] Open Graph metadata
- [ ] Social image per key page
- [ ] Meaningful H1
- [ ] Correct heading hierarchy
- [ ] Alt text
- [ ] XML sitemap
- [ ] robots.txt
- [ ] Redirect map for changed URLs
- [ ] Organization JSON-LD
- [ ] BreadcrumbList JSON-LD
- [ ] NewsArticle JSON-LD where factual
- [ ] Product JSON-LD only when complete and factual
- [ ] No price or offer data unless real

### 10.2 Analytics

- [ ] GA4 configuration
- [ ] GTM configuration
- [ ] Event naming convention
- [ ] Contact submission
- [ ] Partnership/distributor enquiry
- [ ] Brand click
- [ ] Product view
- [ ] Category-filter use
- [ ] News view
- [ ] Newsletter subscription
- [ ] Validate events in staging
- [ ] Do not claim GSC indexing as an implementation completion condition

### 10.3 Legal

- [ ] Privacy Policy approved
- [ ] Terms of Use approved
- [ ] Form consent approved
- [ ] Applicant-data handling approved
- [ ] Cookie/analytics consent approach decided
- [ ] No sensitive data exposed in frontend code

**Exit gate:** metadata, tracking, and legal content are verified.

---

## Phase 11 — Performance, Accessibility, and Browser QA

### 11.1 Images

- [ ] Use `next/image` for eligible raster content images
- [ ] Preserve SVG where semantically appropriate
- [ ] Document justified exceptions
- [ ] Set dimensions or aspect ratio for every image
- [ ] Use responsive `sizes`
- [ ] Prioritize only the true LCP image
- [ ] Lazy-load below-fold images
- [ ] Avoid third-party image layout shift
- [ ] Validate WebP/AVIF negotiation through Next.js configuration
- [ ] Remove unapproved third-party imagery

### 11.2 Core Web Vitals

Current metrics to use:

- LCP
- INP
- CLS

Tasks:

- [ ] Record baseline before optimization
- [ ] LCP target ≤ 2.5 seconds where technically realistic
- [ ] INP target ≤ 200 ms
- [ ] CLS target ≤ 0.1
- [ ] Target Lighthouse Performance ≥ 90 where realistic
- [ ] Accessibility target ≥ 95
- [ ] Best Practices target ≥ 90
- [ ] No material regression from approved baseline
- [ ] Audit third-party scripts
- [ ] Delay non-critical analytics
- [ ] Add Lighthouse CI only after stable baseline

### 11.3 Accessibility

- [ ] Semantic HTML
- [ ] Heading order
- [ ] Keyboard navigation
- [ ] Visible focus
- [ ] Escape behavior where applicable
- [ ] Touch targets
- [ ] Contrast
- [ ] Reduced motion
- [ ] Alt text
- [ ] Form labels
- [ ] Form errors
- [ ] Screen-reader review
- [ ] Slider controls, labels, and pause behavior where used

### 11.4 Browser coverage

- [ ] Chrome latest
- [ ] Edge latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] Mobile Safari supported version
- [ ] Chrome Android supported version

**Exit gate:** no critical accessibility, browser, or performance blocker.

---

# 6. Content Required Before Production

- [ ] Official company Purpose
- [ ] Official Mission
- [ ] Official Vision
- [ ] Official Values
- [ ] Official principles and commitments
- [ ] Leadership
- [ ] Milestones
- [ ] Locations
- [ ] Captain Maid approved corporate-summary content
- [ ] GenuLeaf product data
- [ ] CeraTory product data
- [ ] Approved product-category imagery
- [ ] Approved skincare imagery
- [ ] Approved hero mockups
- [ ] Address
- [ ] Telephone
- [ ] Contact email
- [ ] Map URL or coordinates
- [ ] Innovation claims and evidence
- [ ] Safety and quality claims and evidence
- [ ] Sustainability claims and evidence
- [ ] News articles and publication dates
- [ ] Career process
- [ ] Form routing rules
- [ ] Newsletter provider or storage approach
- [ ] Privacy Policy
- [ ] Terms of Use
- [ ] Social URLs
- [ ] Analytics IDs
- [ ] GTM container ID

---

# 7. Agent Work Ownership

## Agent 1 — Audit and Contract

Ownership:

- Documentation only
- Route inventory
- Component inventory
- Content inventory
- Asset inventory
- Gap report
- Risk report

Must not edit production UI.

## Agent 2 — Design System and Homepage Polish

Ownership:

- Global design tokens
- Shared visual components
- Homepage
- Header
- Footer
- Responsive visual proof

Must not edit CMS integration files.

## Agent 3 — Supporting Pages and Content Contracts

Ownership:

- About
- Brands
- Innovation
- Sustainability
- Newsroom
- Careers
- Contact
- Local typed content adapter
- Translation contracts

Must not independently change global visual direction.

## Agent 4 — Product Architecture

Ownership:

- Product types
- Product listing
- Filters
- Product detail
- Related-product rules

Starts only after product content contract approval.

## Agent 5 — CMS Integration

Ownership:

- `brand-content-platform`
- Payload schema
- API adapter
- Preview
- Revalidation
- Migration

Starts only after frontend content contracts are frozen.

## Reviewer

Read-only during implementation.

Must reject:

- Visual drift
- Generic template substitution
- Invented claims
- Unapproved imagery
- Route inconsistency
- Missing locale support
- Build-only completion claims
- Insufficient proof

---

# 8. Proof and Required Outputs

Required project evidence:

- [ ] `REDESIGN-AUDIT.md`
- [ ] `CONTENT-INVENTORY.md`
- [ ] `ASSET-INVENTORY.md`
- [ ] `COMPONENT-MAP.md`
- [ ] `ROUTE-MAP.md`
- [ ] `REDESIGN-GAP-REPORT.md`
- [ ] `REDESIGN-IMPLEMENTATION-REPORT.md`
- [ ] `REDESIGN-VISUAL-PROOF.md`
- [ ] `REDESIGN-PROOF.md`
- [ ] Run log
- [ ] Error log
- [ ] Backup record
- [ ] Desktop screenshots
- [ ] Tablet screenshots
- [ ] Mobile screenshots
- [ ] Route-check output
- [ ] Type-check output
- [ ] Lint output
- [ ] Production-build output
- [ ] Console-error review
- [ ] Accessibility summary
- [ ] Performance baseline and final comparison

---

# 9. Definition of Done

The ARIGEO redesign is complete only when:

- [ ] It functions as a credible corporate website
- [ ] It functions as a clear brand portfolio gateway
- [ ] Household and Skincare discovery work
- [ ] ARIGEO red, black, and white identity is preserved
- [ ] The approved homepage direction is visually matched
- [ ] About, Brands, Products, Innovation, Sustainability, Newsroom, Careers, and Contact are implemented
- [ ] Thai and English work without missing keys
- [ ] All public content is verified or explicitly approved
- [ ] No third-party placeholder brand imagery remains
- [ ] No fabricated claims remain
- [ ] Marketing can manage pages, brands, products, media, navigation, banners, and news through the central CMS
- [ ] Draft, preview, publish, and revalidation are proven
- [ ] Forms use proven server handling
- [ ] SEO metadata and structured data are factual
- [ ] Analytics events are validated
- [ ] Desktop, tablet, and mobile pass visual review
- [ ] Accessibility baseline passes
- [ ] Core Web Vitals have no material regression
- [ ] Type check passes
- [ ] Lint passes
- [ ] Production build passes
- [ ] Required routes return expected responses
- [ ] No critical console errors remain
- [ ] No broken internal links remain
- [ ] Backup and rollback guidance exist
- [ ] Final proof is documented

Do not report `COMPLETE`, `DONE`, `OK`, or `PASS` without sufficient proof.

---

# 10. Immediate Next Work Queue

Execute in this order:

1. [x] Finish Phase 0 inventories and backup proof (ROUTE-MAP.md, COMPONENT-MAP.md, CONTENT-INVENTORY.md, ASSET-INVENTORY.md, REDESIGN-GAP-REPORT.md)
2. [x] Freeze shared design-system contracts (Proof: Phase 2 COMPLETE in TODO.md, styled inside src/app/globals.css and tailwind.config.ts)
3. [x] Start About Us / ARIGEO Way (Proof: /[locale]/about page built with next-intl)
4. [ ] Build Our Brands portfolio and three brand pages
5. [ ] Build Innovation and Sustainability with verified content
6. [ ] Build Newsroom, Careers, and Contact structure
7. [ ] Freeze product data contract
8. [ ] Build product listing and detail templates
9. [ ] Complete homepage tablet/mobile and content cleanup
10. [ ] Freeze frontend content adapters
11. [ ] Integrate central Payload CMS
12. [ ] Complete SEO, analytics, legal, accessibility, performance, and final QA

---

# 11. Current Verdict

```text
Homepage desktop: CONDITIONAL PASS
Homepage tablet: NOT PROVEN
Homepage mobile: NOT PROVEN
Supporting pages: READY TO PROCEED
Product pages: BLOCKED BY CONTENT CONTRACT
CMS integration: NOT STARTED
Production readiness: NOT READY
```
