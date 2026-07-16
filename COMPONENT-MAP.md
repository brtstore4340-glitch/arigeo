# ARIGEO Component Map (COMPONENT-MAP.md)

This file catalogs all frontend presentation components inside ARIGEO.

## 1. Active Redesigned Components

### 1.1 Layout Shells
- **`Header.tsx`** (`src/components/Header.tsx`): Site header featuring the sticky glassmorphism backdrop blur, navigation, global search icon, and locale-aware next-intl language switcher.
- **`Footer.tsx`** (`src/components/Footer.tsx`): Bottom navigation and credentials section divided into 6 distinct corporate links columns, and deep black bottom utility bar.

### 1.2 Homepage Section Components
- **`HeroCarousel.tsx`** (`src/components/HeroCarousel.tsx`): High-fidelity hero slider containing responsive headings, dual CTA buttons, and the interactive procedural CSS Bottles (surface cleaner, clear handwash, body lotion, moisture cream jar), leafy plant vector elements, stacked towels, and red gradient orb backdrop.
- **`CategorySection.tsx`** (`src/components/CategorySection.tsx`): Dual brand gateways for Household (Captain Maid) and Skincare (GenuLeaf / CeraTory) featuring full-bleed Unsplash illustrations, responsive grids, custom boundaries, accent lines, and round overlays (`⌁` and `◫`).
- **`ValuesSection.tsx`** (`src/components/ValuesSection.tsx`): 3-column trust feature panel using custom SVGs (Flask, Globe, Heart) to communicate corporate reliability, innovation, and sustainability.
- **`NewsSection.tsx`** (`src/components/NewsSection.tsx`): 4-column responsive grid with interactive cards that scale up on hover (`.news-card:hover`) showcasing corporate milestones, product launches, and lifestyle tips.
- **`NewsletterSection.tsx`** (`src/components/NewsletterSection.tsx`): Newsletter subscription form with real-time email syntax validation, loading, success state, and error handling.

### 1.3 Design System UI Primitives
These components reside under `src/components/ui/` for enterprise-wide reusability.
- **`Button.tsx`**: Reusable premium button featuring primary (red fill) and secondary (outline border) variants. Inherits routing from next-intl `Link`.
- **`DotAccent.tsx`**: Custom-molded red dot anchor matching the ARIGEO brand logo signature.
- **`SectionHeading.tsx`**: Layout utility combining a section eyebrow (with leading DotAccent) and structured bold headings.
- **`Tag.tsx`**: Inline taxonomy tag with standard and brand-tint states (light red background with primary red text).

---

## 2. Legacy Components (Rollback Safety)
Unused medical and agricultural components are preserved under `src/components/_legacy/` to maintain project integrity:
- `AnimatedGallery.tsx`
- `BusinessSection.tsx`
- `ContactSection.tsx`
- `Footer.tsx` (Legacy)
- `Header.tsx` (Legacy)
- `Hero.tsx` (Legacy)
- `HeroSection.tsx` (Legacy)
- `NewsSection.tsx` (Legacy)
- `ProductSection.tsx`
- `PurposeSection.tsx`
- `QualitySection.tsx`
- `SustainabilitySection.tsx`
- `WhyChooseSection.tsx`
