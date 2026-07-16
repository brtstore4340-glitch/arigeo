# REDESIGN-CONTRACT.md

## Scope of Work

### In Scope
- Porting and converting high-fidelity drafts from `_claude-draft-components` (which implement the `baseonme` mockup) into the main `src/components/` directory.
- Refactoring components to use `next-intl` (`useTranslations`) and eliminating hardcoded text.
- Overhauling the Home page composition (`src/app/[locale]/page.tsx`) to render the new sections.
- Replacing legacy messages (`src/messages/*.json`) with the new Household and Skincare narrative.
- Relocating old, unused legacy components and messages to `_legacy/` directories to maintain fallback/historical context.
- Expanding `tailwind.config.ts` to include the specific `household` and `skincare` tones.
- Implementing a fully responsive layout (Mobile, Tablet, Desktop) referencing the mockup structure.

### Out of Scope
- E-commerce functionality (cart, checkout).
- Backend APIs or real database connections (the Newsletter will mock success).
- Creating new physical assets or photos (using existing `public/images/domo/`).
- Changing the `Kanit` font to another font for the core layout (it handles Thai well).
- Replacing Next.js with another framework.

## Reusable Components
- `Header.tsx` (Adapted with sticky scrolling and language switcher)
- `Footer.tsx` (Adapted with multi-column design)
- `HeroCarousel.tsx` (Accessible, interactive hero)
- `CategorySection.tsx` (Reusable alternating left/right layout for brands/categories)
- `ValuesSection.tsx` (Grid for trust/quality pillars)
- `NewsSection.tsx` / `NewsCard.tsx` (Grid for press/news)
- `NewsletterSection.tsx` (Form collection)
- UI primitives: `Button.tsx`, `Tag.tsx`, `SectionHeading.tsx`, `DotAccent.tsx`.

## Page Templates
- `Home` (The primary focus of this redesign: Hero -> Categories -> Values -> News -> Newsletter).

## Design Tokens (Tailwind)
- **Primary Brand Red:** `#D50306` (`arigeo-red`)
- **Hover Red:** `#C50C15` (`arigeo-darkred`)
- **Tint Red:** `#FBE6E7` (`arigeo-redtint`)
- **Black/Ink:** `#010101` (`arigeo-black`)
- **Surface:** `#F3F3F4` (`arigeo-surface`)
- **Household Accent:** `#F5EFE6` (Surface) / `#B08D57` (Tone)
- **Skincare Accent:** `#EEF3F4` (Surface) / `#6E9A9E` (Tone)

## Responsive Rules
- **Mobile (< 768px):** Stack columns vertically, ensure tap targets (buttons/links) are at least 44px, collapse navigation into a hamburger menu.
- **Tablet (768px - 1024px):** 2-column grids for Categories and News, full-width Hero images.
- **Desktop (> 1024px):** Side-by-side Hero, alternating ContentSplit images, 3-column Values, 4-column News grid, horizontal Header nav.

## Content Placeholders
- **Images:** Use `public/images/domo/img-*.png` and `asset-*.png` as visual placeholders.
- **Links:** Use relative paths (e.g., `/products/household`, `/about`) without actual destination pages mapped yet (will 404 cleanly in Next.js).
- **News:** Dummy dates and titles from the mockup text.

## Acceptance Criteria
- [ ] No hardcoded text in any UI component; everything is loaded via `next-intl`.
- [ ] The build succeeds (`npm run build`) with zero type/lint errors.
- [ ] Both `/en` and `/th` routes render flawlessly.
- [ ] Visual composition matches the `baseonme` mockup structure (spacing, fonts, component order).
- [ ] Red and neutral color palettes are strictly applied.
- [ ] Legacy components are safely moved to `_legacy/`, not deleted.
- [ ] Site responds perfectly across Mobile, Tablet, and Desktop breakpoints.
