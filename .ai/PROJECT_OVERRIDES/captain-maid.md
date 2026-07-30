# 🏠 Captain Maid — Brand Overrides

**Project**: Premium Home Cleaning Service  
**Brand Position**: Japanese Quality, Warm Luxury, Trustworthy  
**Target Audience**: Homeowners seeking premium, reliable cleaning service

---

## 🎯 Brand Identity

| Attribute | Value |
|-----------|-------|
| **Tone** | Warm, elegant, professional, calming |
| **Energy** | Premium, serene, trustworthy |
| **Personality** | Friendly yet professional, knowledgeable, detail-oriented |
| **Emotional** | Safe, cared-for, confident, relaxed |

---

## 🎨 Color Overrides

### Primary Colors (Captain Maid)
```css
--color-primary-500: #1e3a5f;      /* Navy Blue (Japanese, trustworthy) */
--color-primary-50:  #f0f5fa;      /* Light navy */
--color-primary-900: #0d1b2a;      /* Deep navy */

--color-accent: #d4af37;            /* Gold (premium, luxury) */
--color-accent-light: #e6c549;      /* Light gold */

--color-secondary: #e8f4f8;         /* Soft cyan (clean) */
```

### Semantic Colors (Captain Maid)
```css
--color-success-500: #059669;       /* Green (clean, healthy) */
--color-warning-500: #f59e0b;       /* Amber (attention needed) */
--color-error-500: #dc2626;         /* Red (urgent) */
```

### Text & Backgrounds
```css
--color-text-primary: #0d1b2a;      /* Deep navy (primary text) */
--color-text-secondary: #4b5563;    /* Medium gray */
--color-bg-primary: #ffffff;        /* Pure white (clean aesthetic) */
--color-bg-secondary: #f8fafb;      /* Off-white (calm) */
```

---

## 🔤 Typography Overrides

### Fonts
```css
--font-family-sans: "Noto Sans Thai", "Segoe UI", Roboto, sans-serif;
--font-family-serif: Georgia, serif;
```

### Headings
```css
/* H1: Hero, main title */
--text-h1-size: 2.25rem;        /* 36px */
--text-h1-weight: 600;          /* Semibold, not heavy */

/* H2: Section titles */
--text-h2-size: 1.875rem;       /* 30px */
--text-h2-weight: 600;

/* H3: Card titles */
--text-h3-size: 1.25rem;        /* 20px */
--text-h3-weight: 500;          /* Medium for warmth */

/* Body: General text */
--text-body-size: 1rem;         /* 16px */
--text-body-weight: 400;
--text-body-line-height: 1.6;   /* Slightly loose for readability */
```

### Special Styles
```css
/* CTA text (buttons, links) */
--text-cta-weight: 600;         /* Semibold */
--text-cta-size: 1rem;          /* 16px */

/* Labels (form fields, tags) */
--text-label-size: 0.875rem;    /* 14px */
--text-label-weight: 500;       /* Medium */
```

---

## 📏 Spacing Overrides

### Hero Section
```css
--space-hero-padding: 6rem 2rem;   /* Large vertical padding */
--space-hero-max-width: 1200px;
```

### Cards & Sections
```css
--space-card-padding: 2rem;        /* Generous padding */
--space-section-gap: 4rem;         /* Large gap between sections */
```

---

## 🎞️ Photography & Imagery

### Style
- **Real photography only** — never AI illustrations or fake images
- **Authentic cleaning action** — staff at work, actual homes
- **Color treatment**: Warm, natural light, inviting
- **Composition**: People-focused when featuring team, clean spaces when showing homes
- **Editing**: Slightly warm white balance (+500K), moderate saturation

### Hero Images
- 30% left safe area for text (portrait mode)
- Full-height on mobile (with text overlay)
- 16:9 aspect ratio on desktop
- Always includes trust signal (before/after, team, testimonial)

### Icons
- Stroke-based, 2px weight
- Rounded corners (--radius-md)
- Navy blue (#1e3a5f) default
- Gold (#d4af37) for premium features
- Never sharp/corporate style

---

## 🎬 Motion & Animation

### Philosophy
- **Gentle** — never flashy or playful
- **Premium** — smooth, purposeful, high-quality feel
- **Subtle** — enhance, don't distract

### Transitions
```css
--button-hover-duration: 200ms;    /* Smooth button change */
--button-hover-easing: ease-out;
--hover-scale: 1.02;               /* Subtle growth */

--page-transition-duration: 300ms; /* Smooth page transitions */
```

### Hover Effects
- Buttons: Slight color shift + shadow increase
- Cards: Subtle lift (2px scale) + shadow deepening
- Links: Underline animation (left-to-right), no color change on hover

### No Motion
- ❌ Never use glass-morphism effects (not premium)
- ❌ Never use blurs (can reduce readability)
- ❌ Only use glass effect if meaningful (rare)

---

## 🌙 Dark Mode

### When to Use
- Respect `prefers-color-scheme: dark`
- Default to light mode (primary experience)
- Dark mode is enhancement, not required

### Dark Mode Colors
```css
@media (prefers-color-scheme: dark) {
  --color-bg-primary: #0d1b2a;      /* Deep navy background */
  --color-bg-secondary: #1a2635;    /* Slightly lighter navy */
  --color-text-primary: #f0f5fa;    /* Light text */
  --color-text-secondary: #b0b8c0;  /* Gray text */
  --color-border: #2a3844;          /* Navy borders */
  --color-accent: #e6c549;          /* Gold (stands out on dark) */
}
```

---

## 🏗️ Layout & Grid

### Hero Section
- 30% text safe zone on left (desktop)
- Full-width image on right
- Mobile: Full-width hero image with text overlay
- Max-width: 1280px + margins

### Card Grid
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column
- Gap: 2rem

### Feature Sections
- Alternating layout: image left / content right, then image right / content left
- Mobile: Always content above image (single column)

---

## 🎯 Components

### Buttons

**Primary CTA** (Book Now, Schedule)
```css
background: var(--color-primary-500);    /* Navy blue */
color: white;
padding: 0.75rem 2rem;
border-radius: var(--radius-md);
font-weight: 600;
transition: 200ms ease-out;

&:hover {
  background: var(--color-primary-600);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

**Secondary Button** (Learn More, Skip)
```css
background: var(--color-gray-100);
color: var(--color-primary-500);
border: 1px solid var(--color-border-light);
padding: 0.75rem 2rem;
border-radius: var(--radius-md);
```

**Ghost Button** (Help, Support)
```css
background: transparent;
color: var(--color-primary-500);
border: none;
text-decoration: underline;
```

### Cards
- Padding: 2rem
- Border: 1px solid #e5e7eb (light gray)
- Radius: --radius-lg (16px)
- Shadow: --shadow-md (subtle lift)
- Hover: Shadow increases, no scale (subtle lift via shadow only)

### Testimonials
- Avatar: 48px circular image
- Quote: Serif font (Georgia), 1.25rem
- Author: Medium weight, navy blue
- Star rating: Gold color (#d4af37)

---

## ♿ Accessibility

- Color contrast: Navy on white = 10.7:1 ✅
- Gold accent: Only with dark bg (4:1+ minimum)
- Focus indicators: 2px navy outline + offset
- Link underlines: Always present (not color alone)
- Button size: Min 44×44px (mobile touch target)

---

## 🔍 SEO & Meta

### Meta Tags
- **Title**: "{Service} in {Location} | Captain Maid" (≤60 chars)
- **Description**: "Professional cleaning service. Japanese quality, trusted for 10+ years." (≤160 chars)
- **OG Image**: Premium hero image (1200×630px)
- **OG Type**: website

### Structured Data
- Organization schema
- LocalBusiness schema (if location-based)
- ServiceArea schema
- Review/RatingAggregation (if testimonials)

---

## 📊 Performance

- **Hero image**: WebP + lazy loading (below fold images)
- **Max page size**: <3MB (images optimized)
- **LCP target**: <2.5s (hero image critical)
- **CLS target**: <0.1 (no layout shifts on image load)

---

**Version**: 1.0  
**Last Updated**: 2026-07-21  
**Authority**: Omega Design Director
