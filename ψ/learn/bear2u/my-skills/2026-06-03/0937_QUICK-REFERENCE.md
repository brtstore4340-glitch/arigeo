---
name: 0937-quick-reference
description: ---
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-03
  source: fleet-memory
---

# Landing Page Guide V2 - Quick Reference

**Generated:** 2026-06-03 09:37 | **Skill:** landing-page-guide-v2

---

## What It Does

Creates **high-converting landing pages** that are both functional (conversion-optimized) and memorable (visually extraordinary). Combines the 11-element conversion framework with bold, distinctive design using Next.js 14+ and ShadCN UI.

---

## When to Use This Skill

| Trigger | Use This Skill |
|---------|---|
| Creating any landing page, marketing page, or product page | ✅ |
| Need to balance conversion + memorable brand experience | ✅ |
| Building Next.js / React promotional websites | ✅ |
| Want to avoid generic "AI-generated" template aesthetics | ✅ |
| Designing pages that need both strategy AND design excellence | ✅ |

---

## Key Features

### 1. The 11 Essential Elements (Conversion Framework)
Framework built on DESIGNNAS proven conversion model:

1. **URL with Keywords** — SEO-optimized structure
2. **Company Logo (Header)** — Animated, sticky, brand identity
3. **SEO Title + Subtitle (Hero)** — MASSIVE typography with keywords
4. **Primary CTA (Hero)** — Distinctive design, micro-interactions
5. **Social Proof (Hero)** — Reviews, stats, animated count-ups
6. **Images/Videos (Media)** — Product showcases with depth effects
7. **Core Benefits (Features)** — 3-6 key advantages, custom icons
8. **Customer Testimonials** — 4-6 reviews with styled cards
9. **FAQ Section** — 5-10 questions in smooth accordion
10. **Final CTA (Bottom)** — Dramatic full-width section
11. **Footer (Contact + Legal)** — Multi-column, refined

**CRITICAL:** All 11 elements required in every landing page. No exceptions.

### 2. Design Excellence (Anti-Generic AI Aesthetics)
Ensure pages don't look AI-generated:

**DON'T:**
- ❌ Inter, Roboto, Arial, or system fonts
- ❌ Purple gradients on white (overused)
- ❌ Perfectly centered symmetric grids
- ❌ Generic line icons
- ❌ Boring rectangular buttons
- ❌ Stock photos of people at laptops

**DO:**
- ✅ Distinctive display fonts (Clash Display, Space Grotesk, Syne, Cabinet Grotesk, etc.)
- ✅ Custom color palettes (not always purple!)
- ✅ Asymmetric, unexpected layouts
- ✅ Characterized icons (animated on hover)
- ✅ Micro-interactions on buttons + cards
- ✅ Texture, gradients, patterns in backgrounds

### 3. Six Aesthetic Directions (Pick ONE and Commit)

| Direction | Key Traits | Best For |
|-----------|-----------|----------|
| **Minimalist & Refined** | Clean, generous whitespace, sophisticated typography, 2-3 colors | Luxury, professional services, premium SaaS |
| **Bold & Maximalist** | Rich layers, dynamic animations, vibrant colors, high contrast | Creative agencies, entertainment, youth brands |
| **Retro-Futuristic** | Geometric patterns, neon, glitch effects, monospace fonts | Gaming, tech startups, creative tools |
| **Organic & Natural** | Soft shapes, gradients, earth tones, rounded corners, smooth motion | Wellness, sustainability, food |
| **Editorial & Magazine** | Strong typography, asymmetric layouts, large imagery, bold whitespace | Content platforms, media, education |
| **Brutalist & Raw** | Unconventional layouts, system fonts, high contrast, minimal animation | Art, fashion, anti-establishment |

### 4. Design System Upfront (Before Coding)

Define **4 core decisions** before writing any code:

```
📝 Typography
  - Display font (distinctive, not generic)
  - Body font (readable, complementary)
  - Scale (e.g., H1: 4rem → H2: 3rem → Body: 1rem)

🎨 Color Palette
  - Dominant color (60% usage)
  - Accent color (10% usage, high contrast)
  - Neutral palette (30%, grays/earth tones)
  - Background strategy

⚡ Motion Strategy
  - Page load (staggered reveals with animation-delay)
  - Scroll interactions (fade-ups, parallax)
  - Hover states (scale, color shift, lift)
  - CTA animations (attention without annoying)

🏗️ Spatial Approach
  - Layout style (centered? asymmetric? grid-breaking?)
  - Spacing system (tight or generous?)
  - Section flow (stacked? diagonal? overlapping?)
```

---

## How to Invoke / Activate

### Workflow: Design-First Approach

**STEP 1: Understand Context**
- What problem does the product solve?
- Who is the target audience?
- What's the brand personality (playful, professional, luxury, bold)?
- What will visitors **remember** after leaving?

**STEP 2: Choose Aesthetic Direction**
Pick ONE from the 6 options above and commit fully. Example decision:
```
"Retro-Futuristic aesthetic: geometric patterns, neon accents, glitch effects, 
monospace fonts for tech startup appeal"
```

**STEP 3: Define Design System**
In comments at top of main component, document:
```typescript
/*
  DESIGN SYSTEM
  Typography: Clash Display (headers), DM Sans (body)
  Colors: Primary #FF006E (hot pink), Accent #00D9FF (cyan), Neutral #0A0E27 (dark)
  Motion: 300ms smooth easing, staggered 100ms delays on page load
  Layout: Asymmetric, overlapping sections with diagonal dividers
*/
```

**STEP 4: Setup Tech Stack**
```bash
# Required
npx create-next-app@latest --typescript
npm install tailwindcss shadcn-ui framer-motion

# Install ShadCN components
npx shadcn-ui@latest add button card accordion badge avatar separator input
```

**STEP 5: Build CSS Design System**
Create `globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=ClashDisplay:wght@400;700');

:root {
  --font-display: 'Clash Display', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --color-primary: #FF006E;
  --color-accent: #00D9FF;
  --color-background: #0A0E27;
  --spacing-lg: 4rem;
  --duration-medium: 300ms;
  --easing: cubic-bezier(0.4, 0, 0.2, 1);
}
```

**STEP 6: Create Component Structure**
```
components/
├── Header.tsx        # Logo + nav (sticky, smooth transitions)
├── Hero.tsx          # Title, CTA, social proof (MASSIVE typography)
├── MediaSection.tsx  # Images/videos (depth, 3D effects)
├── Benefits.tsx      # Features (custom icons, animated on scroll)
├── Testimonials.tsx  # Reviews (styled cards, avatars)
├── FAQ.tsx           # Accordion (smooth expand/collapse)
├── FinalCTA.tsx      # Bottom CTA (dramatic, full-width)
└── Footer.tsx        # Contact + legal (multi-column)
```

**STEP 7: Customize ShadCN (NOT Default)**
ShadCN components are starting points. Customize heavily:
```tsx
// Don't: use default styling
<Button>Get Started</Button>

// Do: heavily customize
<Button className="bg-accent hover:bg-accent/90 text-white px-12 py-6 
  text-xl font-display rounded-full shadow-2xl hover:shadow-accent/50 
  hover:scale-105 transition-all duration-300">
  Get Started →
</Button>
```

**STEP 8: Implement Animations**
```tsx
// Staggered page load
<h1>
  <span style={{ animationDelay: '0ms' }} className="animate-fade-in">
    Beautiful
  </span>
  <span style={{ animationDelay: '100ms' }} className="animate-fade-in">
    Landing
  </span>
</h1>

// Add to globals.css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**STEP 9: Validate Against Checklist**
Before shipping, verify:
- ✅ All 11 elements present
- ✅ Distinctive fonts (not Inter/Roboto)
- ✅ Custom color palette defined
- ✅ Background has texture/gradient (not plain)
- ✅ Animations staggered on load + scroll
- ✅ ShadCN heavily customized
- ✅ Responsive tested (mobile/tablet/desktop)
- ✅ Accessibility WCAG AA (color contrast, keyboard nav)

---

## Output Format

Landing pages produced by this skill deliver:

| Output | Details |
|--------|---------|
| **Next.js App** | Full-stack ready, App Router, TypeScript |
| **Responsive Design** | Mobile-first, tested breakpoints (sm/md/lg/xl) |
| **Optimized Images** | Next.js Image component, lazy loading, WebP |
| **SEO Metadata** | Title, description, OG tags configured |
| **Custom Styling** | Tailwind + CSS variables for brand system |
| **Component Library** | Customized ShadCN UI components |
| **Animations** | CSS-based (GPU-accelerated), respect prefers-reduced-motion |
| **Conversion-Ready** | All 11 elements included, strategic CTAs |
| **Performance** | LCP <2.5s, optimized bundle, lazy loading |

---

## Practical Tips for Using This Skill Effectively

### Typography Master Class
- **NEVER** default to safe fonts — distinctive fonts = memorable brand
- **Display fonts at 4rem+** — they need size to shine
- **Pair strategically**: Expressive display + readable body font
- **Letter spacing**: Display fonts often need tighter tracking (-0.02em)
- **Test on real devices** — DevTools font rendering differs from actual screens

### Color Palette Strategy
- **Define CSS variables FIRST** — ensures consistency across all sections
- **Primary color**: Use in 3-4 places (logo, headings, accent text)
- **Accent color**: High contrast, sparingly used, drives CTAs
- **Avoid pure black/white** — use near-black (#1a1a1a) + near-white (#fafafa)
- **Color psychology**: Blue=trust, Green=growth, Red=urgency, Purple=creativity

### Animation Best Practices
- **One great entrance > scattered micro-animations** — orchestrate page load
- **Use animation-delay** — create visual rhythm (0ms, 100ms, 200ms)
- **Respect prefers-reduced-motion** — accessibility critical
- **GPU-accelerated**: Animate `transform` + `opacity`, NOT `width`/`height`/`top`
- **Easing matters**: `cubic-bezier(0.4, 0, 0.2, 1)` = smooth + professional

### CTA Optimization
- **Primary CTA**: Above fold, impossible to miss, 44x44px minimum (touch target)
- **Final CTA**: Last chance moment — make it dramatic (full-width, urgency)
- **Micro-interactions**: Hover scale (1.05), shadow expand, color shift
- **Copy variations**: Test "Start Free Trial" vs "Try Free for 14 Days"
- **Add urgency smartly**: "Limited spots" or countdown timers where genuine

### Image & Video Handling
- **NEVER use placeholders** — kills credibility
- **Product screenshots** in device mockups (laptop/phone frames)
- **Depth effects**: Shadows, reflections, 3D tilt, parallax on scroll
- **Lazy loading**: `loading="lazy"` for below-fold images
- **Video play buttons**: Custom design, ambient background glow

### Conversion Psychology
- **Social proof matters**: Real names + photos convert better than stock photos
- **Specificity builds trust**: "47% faster" beats "much faster"
- **Reduce friction**: Minimize form fields, clear value prop above fold
- **Testimonials**: 4-6 items max (quality over quantity)
- **Scroll depth**: FAQ section ensures users see all 11 elements

### Mobile-First Responsive
- **Base font 16px minimum** — touch screens at arm's length need readability
- **Test all breakpoints**: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- **Stack on mobile**: Side-by-side on desktop only
- **Maintain design system**: Colors, fonts, spacing stay consistent

### Performance Tricks
- **Font loading**: Use `font-display: swap` to avoid FOIT (flash of invisible text)
- **Image format**: Serve WebP with JPEG fallback, use Next.js Image
- **Prefetch critical**: Add `<link rel="prefetch" href="...">`
- **Code splitting**: Dynamic imports for heavy components
- **Target**: LCP <2.5s, FID <100ms, CLS <0.1

---

## Limitations & Gotchas

### Gotchas to Watch

| Gotcha | How to Avoid |
|--------|---|
| **ShadCN default styling** | Always customize—not using defaults shows. Override className, create wrapper components |
| **Generic fonts** | Before importing any font, ask: "Is this distinctive?" If it's Inter/Roboto, NO |
| **Layout timidity** | Bold asymmetry works better than safe centered grids. Don't fear breaking conventions |
| **Animation overload** | One orchestrated page entrance > dozens of scattered hover effects. Respect prefers-reduced-motion |
| **No design system upfront** | Designing without defined typography/colors = inconsistency. Define CSS variables FIRST |
| **Placeholder images** | Kills credibility instantly. Use real product shots or commission illustrations |
| **Forgetting mobile** | Test on actual phones—DevTools rendering differs. 16px base font minimum |
| **Color contrast failures** | Test with browser DevTools or WAVE. WCAG AA minimum: 4.5:1 for text |
| **Missing metadata** | SEO tags not set = poor Google ranking. Configure title, description, OG tags |
| **Accessibility ignored** | Keyboard navigation must work (test with Tab key). ARIA labels for icon buttons |

### Technical Limitations

- **Next.js 14+ required** — App Router mandatory (no Pages Router)
- **TypeScript strongly recommended** — skill assumes type safety
- **ShadCN components as baseline** — heavy customization required
- **Tailwind CSS dependency** — styling approach is Tailwind-native
- **Performance trade-offs** — animations add bundle size; prioritize above-the-fold performance
- **Browser support** — modern browsers only; IE11 not supported

### Design Limitations

- **All 11 elements mandatory** — no shortcuts for minimalist pages
- **Distinctive fonts required** — rules out common safe choices
- **Bold aesthetic required** — timid designs don't stand out
- **No generic templates** — each page requires genuine strategic thinking
- **Brand consistency required** — design system must extend to other marketing materials

### When NOT to Use This Skill

❌ Creating admin dashboards (use UI/UX design skills instead)
❌ Internal tools or CRUD applications (use Shadcn setup-and-go patterns)
❌ Highly complex multi-page sites (better suited for full-site design frameworks)
❌ Client sites requiring legal/compliance template designs (use legal-grade templates)
❌ When budget severely constraints custom design work (stock templates may be necessary)

---

## Quick Decision Tree

```
Do you need a landing page?
├─ Yes, conversion-focused + memorable brand experience?
│  └─ USE THIS SKILL ✅
├─ Yes, but admin dashboard / internal tool?
│  └─ Use UI component library instead
├─ Yes, but cookie-cutter cheap solution?
│  └─ Use pre-made templates
└─ Yes, but highly complex multi-page site?
   └─ Use full-site design framework
```

---

## Key Takeaway

> **"The best landing pages convert AND inspire. Never sacrifice one for the other."**

This skill ensures both by combining:
1. **11 essential elements** (proven conversion framework)
2. **Exceptional design** (distinctive, memorable, bold aesthetics)
3. **Production-ready code** (Next.js 14+, ShadCN, optimized)

**Success = High conversion rate + Users remember your brand**

---

**Reference Files in Origin:**
- `11-essential-elements.md` — Detailed breakdown of each element
- `component-examples.md` — Production-ready component code
- `landing-page-v2.png` — Visual reference

**Last Updated:** 2026-06-03
