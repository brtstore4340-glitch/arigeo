# REDESIGN-AUDIT.md

## Current Architecture Summary
- **Framework:** Next.js 14.2.35 (App Router) with TypeScript.
- **Styling:** Tailwind CSS 3.4.
- **Internationalization:** `next-intl` 4.13.1 (locales: `en`, `th`).
- **State:** The existing `arigeo-project` codebase is configured for a medical/agricultural distributor with legacy components (`BusinessSection.tsx`, `QualitySection.tsx`, etc.).
- **New Target State:** The codebase must transition to a corporate parent brand portfolio gateway (Household & Skincare) based on the `baseonme` mockup.

## Design Asset Inventory
- **Mockup Reference:** `arigeo-web-draft/reference.png` and the React/Vite implementation in `arigeo-web-draft/baseonme`.
- **Images:** `public/images/domo/asset-*.png`, `img-*.png`, `public/images/logos/arigeo.png`.
- **Design Tokens:** Extracted from `baseonme/src/index.css` (HSL variables).
  - Primary Brand Red: `hsl(356 95% 46%)` -> Hex `E30613` approx. (Already defined as `#D50306` in `tailwind.config.ts` per decision log).
  - Neutral Backgrounds: White (`#FFFFFF`), Secondary/Platinum (`#F7F7F5` or `hsl(210 20% 97%)`).

## Route Inventory
- **Existing Routes:** `/` (Home, via `src/app/[locale]/page.tsx`).
- **Required Routes:** Home (`/`), with planned support (links) for About Us, Our Brands, Products, Innovation, Sustainability, Newsroom, Careers, Contact Us, Privacy Policy, Terms of Use, Sitemap.

## Component Inventory
- **Existing Legacy Components:** `Header.tsx`, `Footer.tsx`, `Hero.tsx`, `HeroSection.tsx`, `AnimatedGallery.tsx`, `BusinessSection.tsx`, `QualitySection.tsx`, `SustainabilitySection.tsx`, `ProductSection.tsx`, `WhyChooseSection.tsx`, `NewsSection.tsx`, `ContactSection.tsx`.
- **Target Mockup Components (from `baseonme`):** `Hero.jsx`, `ContentSplit.jsx` (Category gateways), `ValueProps.jsx`, `NewsStories.jsx`, `Newsletter.jsx`.
- **Draft Components Available:** `_claude-draft-components` contains high-fidelity React Server Components versions of the target mockup (e.g., `HeroCarousel.tsx`, `CategorySection.tsx`, `ValuesSection.tsx`, `NewsCard.tsx`, `NewsletterSection.tsx`).

## Mockup-to-Code Mapping
| Mockup Section (`baseonme`) | Target Component (`src/components/`) | Data Source |
|---|---|---|
| Navigation / Header | `Header.tsx` | `messages > Navigation` |
| `Hero.jsx` | `HeroCarousel.tsx` / `Hero.tsx` | `messages > Hero` |
| `ContentSplit.jsx` | `CategorySection.tsx` | `messages > Categories` |
| `ValueProps.jsx` | `ValuesSection.tsx` | `messages > Values` |
| `NewsStories.jsx` | `NewsSection.tsx` / `NewsCard.tsx` | `messages > News` |
| `Newsletter.jsx` | `NewsletterSection.tsx` | `messages > Newsletter` |
| Footer | `Footer.tsx` | `messages > Footer` |

## Gap Analysis
- **Content:** The current hardcoded Thai content focuses on medicine/agriculture. It must be replaced with the Household/Skincare corporate narrative using `next-intl` translations.
- **Styling:** The existing Tailwind config uses custom colors (`arigeo.red`, `arigeo.light`), while the mockup relies on standard HSL tokens (`primary`, `secondary`, `muted`). We will unify the design system using the `arigeo-*` tokens defined in the `REDESIGN-PLAN.md` and `_claude-draft-components/styles/tokens.css`.
- **Components:** Legacy components must be moved to `src/components/_legacy/` and replaced with the new, responsive, accessible components inspired by `_claude-draft-components`.

## Risks and Blockers
- **i18n Sync:** Any new component must not have hardcoded text; keys must be updated simultaneously in both `en.json` and `th.json` to prevent runtime errors.
- **Routing:** Must ensure that `next-intl` wrappers (`Link` from `@/i18n/routing`) are used instead of native Next.js `<Link>` or `<a>` to maintain locale state.

## Files Expected to Change
- `tailwind.config.ts` (Design token integration)
- `src/app/globals.css` (Base styling and fonts)
- `src/messages/en.json` & `src/messages/th.json` (Full content overhaul)
- `src/app/[locale]/page.tsx` (Page composition overhaul)
- `src/components/Header.tsx` & `src/components/Footer.tsx`
- New components: `Hero.tsx`, `CategorySection.tsx`, `ValuesSection.tsx`, `NewsSection.tsx`, `NewsletterSection.tsx`.
