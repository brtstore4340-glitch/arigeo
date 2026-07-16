# ARIGEO Content Inventory (CONTENT-INVENTORY.md)

This file catalogs all text-based assets and localization namespaces inside ARIGEO.

## 1. Local Translation Structure
The active translation catalogs reside under `src/messages/` and support multi-lingual routing (`en.json`, `th.json`).

| Translation Block | Keys | Type | Source / Status |
|---|---|---|---|
| `Navigation` | `about, brands, products, innovation, sustainability, news, careers, contact, language` | Global Site Headers | Verified & Mapped |
| `Hero` | `slide1.headline0, slide1.headline1, slide1.subline, slide1.body, slide1.primary, slide1.secondary` | Homepage Hero Intro | Verified & Mapped |
| `Categories` | `household.tone, household.title, household.description, household.cta, skincare.tone, skincare.title, skincare.description, skincare.cta` | Brand Gateway Section | Verified & Mapped |
| `Values` | `innovation.title/description/cta, sustainability.title/description/cta, safety.title/description/cta` | Trust Pillar Section | Verified & Mapped |
| `News` | `eyebrow, title, viewAll, articles.1, articles.2, articles.3, articles.4` | Newsroom Previews | Mockup Reference (Factual check pending) |
| `Newsletter` | `title, description, placeholder, button, subscribing, success, error` | Subscription Prompts | Verified & Mapped |
| `Footer` | `description, columns.*, links.*, rights, terms, privacy, sitemap` | Site Footer Lists | Mapped (Factual check pending) |

---

## 2. Content required / Factual Gaps (LOCKED Decisions)
The following content assets are currently missing or marked as **`CONTENT REQUIRED`** to prevent the fabrication of statistics, certifications, coordinates, or policies in production.

### 2.1 Corporate Claims & Business Identity
- **[CONTENT REQUIRED]** Official company Purpose, Vision, and Mission declarations.
- **[CONTENT REQUIRED]** Certified company Milestones and Leadership profiles.
- **[CONTENT REQUIRED]** Verified company Locations (addresses, coordinates, map parameters).
- **[CONTENT REQUIRED]** Validated green/sustainability evidence (removing draft assertions of Carbon Neutrality by 2050 until verified).

### 2.2 Brand & Product Discovery
- **[CONTENT REQUIRED]** Captain Maid approved product lists and descriptions.
- **[CONTENT REQUIRED]** GenuLeaf approved skincare product formulas and safety records.
- **[CONTENT REQUIRED]** CeraTory dermatologist-verified derma skincare properties (do not claim dermatologist-approval unless verified by corporate compliance).

### 2.3 Legal & Compliance
- **[CONTENT REQUIRED]** Final approved Privacy Policy text.
- **[CONTENT REQUIRED]** Final approved Terms of Use text.
- **[CONTENT REQUIRED]** Forms collection privacy policy consent confirmation rules.

---

## 3. Legacy Messages Backup (Rollback Safety)
Unused medical and agricultural translations are archived in `src/messages/_legacy/`:
- `en.json` (Legacy)
- `th.json` (Legacy)
