---
name: 0937-code-snippets
description: **Source:** `/route/mission-control/ψ/learn/bear2u/my-skills/origin/skills/land
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-03
  source: fleet-memory
---

# Landing Page Guide V2 - Code Snippets & Patterns

**Skill:** `landing-page-guide-v2`  
**Generated:** 2026-06-03 09:37  
**Source:** `/route/mission-control/ψ/learn/bear2u/my-skills/origin/skills/landing-page-guide-v2/SKILL.md`

---

## 1. Full Content Summary

The **Landing Page Guide V2** is a comprehensive skill for building distinctive, high-converting landing pages using Next.js 14+ and ShadCN UI. It combines:

- **Proven Conversion Framework**: 11 essential elements from DESIGNNAS for measurable conversion rates
- **Exceptional Design Quality**: Bold aesthetic choices that create unforgettable brand experiences  
- **Production-Ready Code**: TypeScript, Tailwind CSS, and performance optimization

**Core Philosophy**: "A landing page must convert visitors AND make them remember your brand. Generic, template-looking pages fail at both."

The skill emphasizes design-first thinking before any code, intentional aesthetic choices, and avoidance of generic "AI-generated" aesthetics (purple gradients, Inter fonts, centered layouts).

---

## 2. Key Code Snippets & Templates

### 2.1 Design System CSS Variables (globals.css)

```css
@import url('https://fonts.googleapis.com/css2?family=Your+Display+Font&family=Your+Body+Font&display=swap');

:root {
  /* Typography */
  --font-display: 'Your Display Font', sans-serif;
  --font-body: 'Your Body Font', sans-serif;

  /* Colors */
  --color-primary: #your-dominant-color;
  --color-accent: #your-accent-color;
  --color-neutral: #your-neutral-color;
  --color-background: #your-bg-color;

  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 2rem;
  --spacing-lg: 4rem;
  --spacing-xl: 6rem;

  /* Animation timing */
  --duration-fast: 150ms;
  --duration-medium: 300ms;
  --duration-slow: 500ms;
  --easing: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Apply fonts */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
}

body {
  font-family: var(--font-body);
}
```

### 2.2 Tailwind Configuration (tailwind.config.ts)

```typescript
export default {
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      colors: {
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        // ... etc
      },
    },
  },
}
```

### 2.3 SEO Metadata Configuration (layout.tsx / page.tsx)

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SEO Optimized Title with Keywords | Brand Name',
  description: 'Compelling description with main keywords',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  openGraph: {
    title: 'OG Title',
    description: 'OG Description',
    images: ['/og-image.jpg'],
  },
}
```

### 2.4 Hero Title with Staggered Animation

```tsx
// Hero title with staggered animation
<h1 className="text-6xl font-display font-bold">
  <span className="inline-block animate-fade-in" style={{ animationDelay: '0ms' }}>
    Beautiful
  </span>{' '}
  <span className="inline-block animate-fade-in" style={{ animationDelay: '100ms' }}>
    Landing
  </span>{' '}
  <span className="inline-block animate-fade-in" style={{ animationDelay: '200ms' }}>
    Pages
  </span>
</h1>

// Add to globals.css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in var(--duration-slow) var(--easing) both;
}
```

### 2.5 Hero CTA Button (ShadCN Button with Custom Styling)

```tsx
<Button
  size="lg"
  className="bg-accent hover:bg-accent/90 text-white px-12 py-6 text-xl font-display rounded-full shadow-2xl hover:shadow-accent/50 hover:scale-105 transition-all duration-300"
>
  Get Started →
</Button>
```

### 2.6 Benefits Card (ShadCN Card with Hover Effects)

```tsx
<Card className="border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-white to-primary/5">
  {/* Custom content */}
</Card>
```

### 2.7 Reduced Motion Support (Accessibility)

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 2.8 ShadCN Components Installation

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add accordion
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add input
```

---

## 3. Step-by-Step Implementation Workflow

### Step 1: Design First (CRITICAL - Before Coding)
1. **Understand Context**
   - What problem does this product solve?
   - Who is the target audience?
   - What's the brand personality?
   - What's the ONE thing visitors will remember?

2. **Choose Aesthetic Direction** (commit fully to ONE)
   - Minimalist & Refined
   - Bold & Maximalist
   - Retro-Futuristic
   - Organic & Natural
   - Editorial & Magazine
   - Brutalist & Raw

3. **Define Design System**
   - Display font (NOT Inter/Roboto/Arial)
   - Body font
   - Typography scale (H1: 4rem → Body: 1rem)
   - Color palette (Dominant 60%, Accent 10%, Neutral 30%)
   - Motion strategy (page load, scroll, hover)
   - Spatial approach (layout, spacing, flow)

### Step 2: Setup Design System (CSS Variables)
- Create `globals.css` with typography, colors, spacing, animation timing
- Define `--font-display`, `--font-body`, `--color-primary`, etc.
- Update `tailwind.config.ts` to extend theme

### Step 3: Setup Metadata (SEO)
- Configure `title`, `description`, `keywords`
- Add Open Graph tags for social sharing
- Include schema markup for business/product info

### Step 4: Create Component Structure with Design
Build in this order:
1. **Header** - Sticky navigation with smooth transitions
2. **Hero** - MASSIVE typography, staggered animations, bold CTA
3. **MediaSection** - Showcase with depth (shadows, 3D effects)
4. **Benefits** - Asymmetric layout, custom icons, animated on scroll
5. **Testimonials** - Unique card design, custom avatars
6. **FAQ** - Smooth accordion with custom styling
7. **FinalCTA** - Dramatic full-width section
8. **Footer** - Multi-column with refined typography

### Step 5: Customize ShadCN Components
- Modify default styles in component files
- Add custom variants in Tailwind config
- Override with className props
- Create wrapper components for brand-specific styling
- **Remember**: ShadCN is a starting point, not the final design

### Step 6: Implement Animations
- Page load: Staggered reveals with animation-delay (0ms, 100ms, 200ms, 300ms, 500ms)
- Scroll animations: Fade-ups, parallax, scroll-triggered reveals
- Hover states: Scale, shadow, color shift
- Use CSS animations over JavaScript (GPU-accelerated)

### Step 7: Implement Responsive Design
- Mobile-first approach
- Tailwind breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- Minimum touch target: 44x44px
- Minimum font size on mobile: 16px
- Maintain design system across all breakpoints

### Step 8: Optimize Performance
- Use Next.js `Image` component for all images
- Add `priority` prop for above-the-fold images
- Lazy load below-the-fold content
- Use `font-display: swap` for web fonts
- Prefer CSS animations over JavaScript
- Tree-shake unused ShadCN components

### Step 9: Ensure Accessibility
- Semantic HTML5 (`<header>`, `<main>`, `<section>`, `<footer>`)
- ARIA labels for icon-only buttons
- Keyboard navigation (Tab key testing)
- Descriptive alt text for all images
- Color contrast: WCAG AA minimum (4.5:1 for text)
- Respect `prefers-reduced-motion`

---

## 4. Example Prompts & Workflows

### Example Prompt for Creating a SaaS Landing Page
```
Create a high-converting landing page for [SaaS Product Name].

Design System:
- Aesthetic: Minimalist & Professional
- Display Font: Space Grotesk
- Body Font: DM Sans
- Primary Color: #0066cc (blue - trust)
- Accent Color: #ff6b35 (orange - urgency)

Include all 11 essential elements:
1. SEO-optimized URL
2. Animated logo in sticky header
3. MASSIVE hero title (5rem+) with subtitle
4. Primary CTA button (pill shape, hover scale)
5. Social proof (reviews, stats, animated count-up)
6. Product screenshots in device frames with parallax
7. 5 key features with custom icons in asymmetric layout
8. 4 customer testimonials with circular avatars
9. FAQ with smooth accordion animation
10. Final CTA section (full-width with gradient background)
11. Multi-column footer with newsletter signup

All components must use ShadCN UI and be heavily customized with Tailwind.
```

### Example Animation Pattern Prompt
```
Create staggered page load animation for hero section:

Timing:
- Title word 1: 0ms
- Title word 2: 100ms
- Title word 3: 200ms
- Subtitle: 300ms
- CTA Button: 500ms

Use cubic-bezier(0.4, 0, 0.2, 1) easing.
Fade-in + translateY(20px) transition effect.
Respect prefers-reduced-motion.
```

### Example Responsive Design Prompt
```
Make landing page responsive with mobile-first approach:

Mobile (sm: <640px):
- Stack all sections vertically
- Font size: 24px for H1, 16px for body
- Touch targets: 44x44px minimum
- Simplified layout (single column)

Tablet (md: 768px):
- 2-column layouts for benefits
- Larger font sizes (H1: 32px)

Desktop (lg: 1024px):
- Full 3+ column layouts
- Large typography (H1: 48px+)

Maintain all colors, fonts, brand identity across breakpoints.
```

---

## 5. Technologies & Frameworks Referenced

### Required Stack
- **Next.js 14+** (App Router)
- **TypeScript** (type safety)
- **Tailwind CSS** (styling)
- **ShadCN UI** (accessible components)
- **Framer Motion** (optional, for advanced animations)
- **Next.js Image Component** (optimization)

### Recommended Display Fonts (Distinctive)
- Space Grotesk
- Clash Display
- Cabinet Grotesk
- Syne
- DM Serif Display
- Zodiak
- Fraunces
- Archivo Black
- Unbounded
- Outfit
- Playfair Display
- Crimson Pro
- Libre Baskerville
- Epilogue

### Recommended Body Fonts (Refined)
- DM Sans
- General Sans
- Switzer
- Geist
- Manrope
- Karla
- Work Sans

### Fonts to NEVER Use
- ❌ Inter
- ❌ Roboto
- ❌ Arial
- ❌ Helvetica
- ❌ system-ui

---

## 6. Checklists, Rules & Principles

### Design Quality Checklist ⭐
- [ ] **Aesthetic direction chosen** and executed consistently
- [ ] **Typography**: Distinctive display font (NOT Inter/Roboto/Arial)
- [ ] **Typography**: Clear hierarchy with dramatic scale differences
- [ ] **Color palette**: Defined CSS variables, cohesive throughout
- [ ] **Backgrounds**: NOT plain white - has texture/gradient/pattern
- [ ] **Animations**: Staggered page load, scroll-triggered reveals
- [ ] **Layout**: Not generic centered grid - has unique composition
- [ ] **ShadCN customization**: Components heavily customized, not default
- [ ] **NO generic AI aesthetics**: Passes the "does this look AI-generated?" test

### 11 Essential Elements Checklist ✅
- [ ] 1. URL with keywords
- [ ] 2. Company logo (top-left, animated)
- [ ] 3. SEO-optimized title and subtitle (MASSIVE typography)
- [ ] 4. Primary CTA in hero (distinctive design, micro-interactions)
- [ ] 5. Social proof (reviews, stats, animated)
- [ ] 6. Images or videos (with depth effects, not placeholders)
- [ ] 7. Benefits/features section (3-6 items, custom icons, unique layout)
- [ ] 8. Customer testimonials (4-6 items, styled cards)
- [ ] 9. FAQ section (5-10 questions, smooth accordion)
- [ ] 10. Final CTA at bottom (dramatic, full-width)
- [ ] 11. Footer with contact and legal links (multi-column, refined)

### Technical Requirements 🔧
- [ ] Next.js 14+ with App Router
- [ ] TypeScript types defined
- [ ] Tailwind CSS styling
- [ ] ShadCN UI components installed and customized
- [ ] Metadata configured for SEO (title, description, OG tags)
- [ ] Images optimized with Next.js Image component
- [ ] Responsive design implemented (mobile-first)
- [ ] Accessibility standards met (WCAG AA)
- [ ] Performance optimized (lazy loading, font optimization)
- [ ] Reduced motion support for animations

### Final Polish Checklist 💎
- [ ] All fonts loaded correctly (check browser DevTools)
- [ ] Color contrast tested (use browser DevTools)
- [ ] Tested on mobile, tablet, desktop
- [ ] Keyboard navigation works
- [ ] Hover states feel delightful
- [ ] No Lorem Ipsum or placeholder content
- [ ] Brand feels unique and memorable

### Core Design Principles
1. **Conversion + Memorability**: A landing page must both convert and be memorable
2. **Intentional Design**: Every aesthetic choice should be deliberate, not default
3. **No Generic AI Aesthetics**: Avoid the "AI-generated" look
4. **Design System First**: Define fonts, colors, motion before coding
5. **Customize Everything**: ShadCN is a starting point, not the final design

### Things to AVOID (Generic AI Aesthetics)

**DON'T:**
- ❌ Inter/Roboto/Arial fonts
- ❌ Purple gradients on white backgrounds
- ❌ Perfectly centered, symmetric layouts every time
- ❌ Generic line icons
- ❌ Default yellow star ratings
- ❌ Boring rectangular buttons with no personality
- ❌ White background with no visual interest
- ❌ Cookie-cutter three-column feature grids
- ❌ Stock photos of people pointing at laptops
- ❌ Placeholder or generic images

**DO:**
- ✅ Choose distinctive fonts that match brand personality
- ✅ Commit to a unique color palette (not always purple!)
- ✅ Create unexpected layouts with asymmetry
- ✅ Design or select characterful icons
- ✅ Custom-style all UI elements to match aesthetic
- ✅ Add background textures, gradients, or patterns
- ✅ Vary layouts across sections
- ✅ Use product screenshots, custom illustrations, or authentic photography

### Animation Best Practices
- **Page Load**: One well-orchestrated entrance with staggered reveals
- **Scroll Animations**: Sections fade up as they enter viewport
- **Hover States**: Surprise and delight (scale, shadow, color shift)
- **Performance**: Prefer CSS animations over JavaScript (GPU-accelerated)
- Use `transform` and `opacity` only (avoid animating width, height, top, left)
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` is smooth and professional
- **Less is more**: One great page entrance > scattered micro-animations
- Always respect `prefers-reduced-motion`

### Aesthetic Direction Options (Pick ONE and Commit)

**Minimalist & Refined**
- Brutally clean layouts, generous whitespace
- Sophisticated typography with large scale contrasts
- Monochromatic or limited color palette (2-3 colors max)
- Subtle micro-interactions, elegant transitions
- Examples: Luxury products, professional services, premium SaaS

**Bold & Maximalist**
- Rich, complex visual layers
- Dynamic animations and scroll effects
- Gradient meshes, textures, and overlapping elements
- Vibrant color palettes with high contrast
- Examples: Creative agencies, entertainment, youth brands

**Retro-Futuristic**
- Nostalgic elements with modern execution
- Geometric patterns, neon accents
- Glitch effects, scanlines, grain textures
- Monospace or display fonts with character
- Examples: Gaming, tech startups, creative tools

**Organic & Natural**
- Soft, flowing shapes and gradients
- Nature-inspired colors (earth tones, pastels)
- Smooth animations mimicking natural motion
- Rounded corners, soft shadows
- Examples: Wellness, sustainability, food

**Editorial & Magazine**
- Strong typographic hierarchy
- Grid-breaking asymmetric layouts
- Large, impactful imagery
- Bold use of whitespace and negative space
- Examples: Content platforms, media, education

**Brutalist & Raw**
- Unconventional layouts, intentional "ugly"
- System fonts or deliberately basic typography
- High contrast, limited color
- Minimal or no animations
- Examples: Art, fashion, anti-establishment brands

### Typography Excellence Rules
- **NEVER** use generic fonts: Inter, Roboto, Arial, Helvetica, system-ui
- **Display fonts** should be distinctive and memorable
- **Pair wisely**: Display font for headings + refined body font for text
- **Scale dramatically**: Create clear hierarchy with size jumps (not subtle differences)
- **Letter spacing**: Adjust for display fonts (often needs tighter tracking)
- **Line height**: Display = 1.1-1.2, Body = 1.6-1.8
- **Never compromise on typography** - it's 80% of design
- Test readability on actual devices, not just dev tools

### Color & Visual Coherence Rules
- **Define CSS variables** for all colors (maintain consistency)
- **Dominant color** should appear throughout (not just CTAs)
- **Accent colors** must have sufficient contrast for accessibility (WCAG AA minimum)
- Avoid: Purple gradients on white (overused AI aesthetic)
- **Backgrounds**: Create atmosphere with gradients, meshes, patterns, or textures
- Dark text on light backgrounds should be near-black (#1a1a1a), not pure black
- Consider color psychology: Blue = trust, Green = growth, Red = urgency, Purple = creativity

### Performance Targets
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1

---

## 7. Content Type-Specific Patterns

### SaaS Product Landing Page
**Conversion Focus**: Free trial CTA, feature comparisons, pricing clarity, security badges  
**Aesthetic Recommendations**:
- Minimalist & Professional: Clean layout, lots of whitespace, sophisticated typography
- Tech-Forward: Gradient backgrounds, subtle animations, modern sans-serif fonts
- Bold & Confident: Large typography, high-contrast CTAs, dynamic hover states  
**Avoid**: Generic blue gradients, stock photos of laptops in coffee shops

### E-commerce Product Landing Page
**Conversion Focus**: Product images, pricing, shipping info, return policy, urgency  
**Aesthetic Recommendations**:
- Luxury/Premium: Elegant serif fonts, monochrome palette, generous whitespace
- Energetic/Youth: Bold colors, playful fonts, dynamic layouts, vibrant CTAs
- Natural/Sustainable: Earth tones, organic shapes, soft shadows, rounded corners  
**Avoid**: Cluttered layouts, too many competing visual elements

### Service/Agency Landing Page
**Conversion Focus**: Portfolio/case studies, process explanation, team credentials, contact form  
**Aesthetic Recommendations**:
- Creative/Bold: Asymmetric layouts, unique typography, portfolio as hero
- Editorial: Magazine-style layouts, large imagery, strong typographic hierarchy
- Minimalist/Portfolio: Grid of work, minimal text, let work speak for itself  
**Avoid**: Generic "professional" templates, stock photography

### Event/Webinar Landing Page
**Conversion Focus**: Date/time prominence, speaker profiles, agenda, registration form, countdown timer  
**Aesthetic Recommendations**:
- Exciting/Dynamic: Animated countdown, gradient backgrounds, energetic colors
- Professional/Conference: Clean layout, speaker headshots with borders, agenda timeline
- Community/Friendly: Warm colors, circular avatars, social proof emphasis  
**Avoid**: Boring bullet-point agendas, generic conference aesthetics

### Mobile App Landing Page
**Conversion Focus**: App Store badges, screenshots in device frames, feature highlights, demo video  
**Aesthetic Recommendations**:
- Modern/Sleek: Device mockups with 3D tilt, floating screenshots, smooth animations
- Playful/Fun: Bright colors, illustrated icons, character mascots
- Screenshot-Forward: Large phone mockups as hero, minimal text, visual storytelling  
**Avoid**: Tiny screenshots, generic app icons

---

## 8. Project Structure Template

```
landing-page/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles + design system
├── components/
│   ├── Header.tsx          # Logo & Navigation (Element 2)
│   ├── Hero.tsx            # Title, CTA, Social Proof (Elements 3-5)
│   ├── MediaSection.tsx    # Images/Videos (Element 6)
│   ├── Benefits.tsx        # Core Benefits (Element 7)
│   ├── Testimonials.tsx    # Customer Reviews (Element 8)
│   ├── FAQ.tsx             # FAQ Accordion (Element 9)
│   ├── FinalCTA.tsx        # Bottom CTA (Element 10)
│   └── Footer.tsx          # Contact & Legal (Element 11)
├── public/
│   └── images/             # Optimized images
└── package.json
```

---

## 9. Key Reference Files Mentioned

- `references/11-essential-elements.md` - In-depth explanation of each of the 11 essential elements with principles, implementation tips, and examples
- `references/component-examples.md` - Complete, production-ready component code using ShadCN UI for all major sections

---

## 10. Success Metrics

### Conversion Metrics
- Click-through rate on CTAs
- Form submission rate
- Scroll depth (are users reaching all 11 elements?)
- Bounce rate and time on page

### Brand Metrics
- User feedback on design quality
- Social sharing of the landing page
- Brand recall in user surveys
- Differentiation from competitors

---

## Core Quote

> "A landing page must convert visitors AND make them remember your brand. Generic, template-looking pages fail at both. This skill ensures your landing pages are functionally effective and visually extraordinary."

And the final principle:

> "Every landing page is an opportunity to make an unforgettable first impression. The 11 essential elements ensure conversions. Exceptional design ensures they remember your brand. Never sacrifice one for the other. **The best landing pages convert AND inspire.**"

---

**End of Code Snippets Document**
