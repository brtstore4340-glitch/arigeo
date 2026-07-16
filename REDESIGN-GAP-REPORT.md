# ARIGEO Visual Gap Report (REDESIGN-GAP-REPORT.md)

This document maps visual discrepancies and gaps between the current codebase and the approved mockup.

## 1. Homepage Desktop Status
**Status: CONDITIONAL PASS — Desktop layout matches visually**

| Section | Mockup Ref | Implemented State | Discrepancy / Gap |
|---|---|---|---|
| **Header** | High-end sticky white header with search and Global dropdown | Redesigned sticky site-header with brand mark, search icon, and next-intl Language Switcher | None. Aligned with App Router architecture |
| **Hero Section** | Custom layout with procedural CSS Bottles illustration, stacked towels, plant vector, and red orb | Exact HTML and CSS Illustration Artwork ported into `HeroCarousel.tsx` and `globals.css` | **[MINOR]** Thai text line breaks in heading can be improved for better readability on desktop |
| **Category Banners** | Side-by-side card grid showing Household and Skincare categories, accent lines, and round overlays | Exact grid layout implemented in `CategorySection.tsx` with Unsplash image backgrounds | None. Pixel-perfect parity |
| **Feature Panel (Values)** | 3-column feature block outlining Innovation, Sustainability, and Safety | Ported into `ValuesSection.tsx` with sharp SVG icons | None. Matches mockup perfectly |
| **Newsroom Grid** | 4-column article card grid with taxonomy tag hover state | Ported into `NewsSection.tsx` with scale-up hover animations | None. Parity achieved |
| **Newsletter Band** | Grey gradient layout with email input and Subscribe button | Ported into `NewsletterSection.tsx` with interactive form state | None. Parity achieved |
| **Footer** | Multi-column footer list with deep black utility bottom bar | Ported into `Footer.tsx` | None. Parity achieved |

---

## 2. Homepage Tablet and Mobile Gaps
**Status: NOT PROVEN**

- **[GAP] Mobile/Tablet Hamburger Navigation:** Mobile menu has not been fully verified at `< 375px` to ensure zero text collision or overlapping.
- **[GAP] Visual Scale:** The CSS bottle art on mobile viewports shrinks but requires a sanity check on layout padding and alignment to ensure no horizontal overflow.

---

## 3. Supporting Pages Gap Analysis
**Status: READY TO PROCEED**

All supporting sub-pages (About Us, Our Brands, Innovation, Sustainability, Newsroom listings, Careers, Contact Us) currently **do not exist** as routes in the physical production paths. They must be generated from scratch using our shared visual tokens.
- **[ACTION]** Generate `/[locale]/about`, `/[locale]/brands`, `/[locale]/innovation`, `/[locale]/sustainability`, `/[locale]/newsroom`, `/[locale]/careers`, `/[locale]/contact`.
