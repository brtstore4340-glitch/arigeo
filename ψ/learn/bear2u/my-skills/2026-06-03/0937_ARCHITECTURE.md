# Architecture: Landing Page Guide V2 Skill

**Date:** 2026-06-03  
**Location:** `/route/mission-control/ψ/learn/bear2u/my-skills/origin/skills/landing-page-guide-v2/`  
**Skill ID:** `landing-page-guide-v2`

---

## Table of Contents

1. [Directory Structure](#directory-structure)
2. [Repository Overview](#repository-overview)
3. [Entry Points](#entry-points)
4. [Core Abstractions & Patterns](#core-abstractions--patterns)
5. [Skill Purpose & Philosophy](#skill-purpose--philosophy)
6. [Integration with My Skills Repo](#integration-with-my-skills-repo)
7. [Key Design Patterns](#key-design-patterns)

---

## Directory Structure

```
landing-page-guide-v2/
├── SKILL.md                          # [PRIMARY] Main skill documentation
├── landing-page-v2.png               # Visual reference/screenshot
└── references/
    ├── 11-essential-elements.md      # Detailed framework explanation
    └── component-examples.md         # Production-ready code samples
```

### File Descriptions

| File | Purpose | Size | Type |
|------|---------|------|------|
| **SKILL.md** | Complete skill documentation with philosophy, workflow, and guidelines | ~800 lines | Markdown |
| **landing-page-v2.png** | Visual reference showing the guide's application | Image | PNG |
| **references/11-essential-elements.md** | Element-by-element breakdown of conversion framework | ~200 lines | Markdown |
| **references/component-examples.md** | Copy-paste-ready React/TypeScript component code | ~150+ lines | Markdown with TSX |

### What Each File Does

#### SKILL.md (Entry Point)
This is **the definitive guide** for creating landing pages. It contains:
- Overview of the skill's purpose
- When to use the skill
- Design thinking framework (before coding)
- The 11 essential elements detailed breakdown
- Design aesthetics guidelines (typography, color, motion, spatial)
- Technology stack requirements (Next.js 14+, ShadCN UI, Tailwind)
- Project structure template
- Step-by-step implementation workflow (9 steps)
- Validation checklist
- Best practices and patterns
- Success metrics

**This is a comprehensive, self-contained guide** — users read this when implementing a landing page.

#### references/11-essential-elements.md
Supporting reference that provides:
- Principle behind each of the 11 elements
- Implementation specifics
- Good vs. bad examples for each element
- SEO, conversion, and design considerations for elements 1-11

**Purpose:** Detailed reference when implementing specific elements (e.g., "how do I make the FAQ section work?").

#### references/component-examples.md
Production-ready code samples including:
- Hero section (with Button, Badge, Image from ShadCN)
- Benefits section (with Card, icons)
- Testimonials section (with Avatar, Card)
- FAQ section (with Accordion)
- Final CTA section
- Footer section

**Purpose:** Copy-paste starting points for each component section. Not complete — meant to be customized heavily.

---

## Repository Overview

### My Skills Hub Structure

The skill lives within a larger **custom skills repository** for Claude Code:

```
my-skills/origin/
├── skills/                           # All 23 skills live here
│   ├── landing-page-guide-v2/       # THIS SKILL
│   ├── landing-page-guide/          # Earlier version (v1)
│   ├── card-news-generator/         # Related: Instagram card content
│   ├── card-news-generator-v2/      # Enhanced version
│   ├── flutter-init/                # Flutter project scaffolder
│   ├── nextjs15-init/               # Next.js project scaffolder
│   ├── design-prompt-generator-v2/  # AI prompt generation
│   ├── code-changelog/              # Code documentation
│   ├── prompt-enhancer/             # Request contextualization
│   ├── web-to-markdown/             # Web scraping
│   ├── workthrough/                 # Work documentation
│   ├── codex/                       # Code analysis tools
│   └── [17 others]
├── README.md                         # Repository index & quick install
├── SKILL_DISTRIBUTION_GUIDE.md       # Organizational guide
└── [supporting files]
```

### Skill Distribution

The repository contains **23 skills** across several categories:

**Code Generation & Architecture:**
- flutter-init (Clean Architecture scaffolder)
- nextjs15-init (Next.js 15 project generator)
- design-prompt-generator-v2 (UI/design prompts)

**Content & Design:**
- landing-page-guide-v2 (THIS SKILL)
- landing-page-guide (v1)
- card-news-generator, card-news-generator-v2 (Instagram cards)
- midjourney-cardnews-bg (Image prompts)

**Code Analysis & Iteration:**
- codex (OpenAI Codex CLI)
- codex-claude-loop (Claude + Codex duo)
- codex-claude-cursor-loop (Claude + Codex + Cursor trio)
- code-changelog (Change documentation)
- code-prompt-coach (Session analysis)

**Utilities & Transformers:**
- prompt-enhancer (Context analysis)
- web-to-markdown (Page scraping)
- meta-prompt-generator (Command creation)
- web-search (DuckDuckGo integration)

**Documentation:**
- workthrough, workthrough-v2 (Work logs)

**Specialized:**
- gemini-logo-remover (Image inpainting)

---

## Entry Points

### Primary Entry Point: SKILL.md

When users want to create a landing page, they:

1. **Read SKILL.md** to understand the philosophy and workflow
2. **Follow the Design Thinking section** to choose aesthetic direction
3. **Reference the 11 essential elements** to ensure all conversion factors are present
4. **Reference component-examples.md** when building actual React components
5. **Use the validation checklist** before completing the page

### Secondary Entry Points

**For specific element details:**
- Element-specific questions → Read `references/11-essential-elements.md`

**For code copy-paste:**
- "Show me how to build this component" → Read `references/component-examples.md`

**For visual reference:**
- "What does this skill deliver?" → View `landing-page-v2.png`

### Installation/Usage

As registered in the My Skills marketplace:
```bash
/plugin marketplace install suji-father-marketplace@landing-page-guide-v2
```

When invoked: Claude loads SKILL.md and references, then guides user through the workflow.

---

## Core Abstractions & Patterns

### 1. The 11 Essential Elements Framework

This is the **core abstraction** — a proven conversion optimization framework from DESIGNNAS:

```
Element 1:  URL with Keywords              [SEO]
Element 2:  Company Logo (Header)          [Branding]
Element 3:  SEO Title & Subtitle (Hero)    [Value Prop]
Element 4:  Primary CTA (Hero)             [Conversion]
Element 5:  Social Proof (Hero)            [Trust]
Element 6:  Images or Videos               [Demonstration]
Element 7:  Core Benefits/Features         [Value Details]
Element 8:  Customer Testimonials          [Social Proof]
Element 9:  FAQ Section                    [Friction Reduction]
Element 10: Final CTA (Bottom)             [2nd Chance Conversion]
Element 11: Footer with Contact/Legal      [Trust Signals]
```

**Pattern:** Every element has TWO requirements:
- **Functional requirement** (for conversion) — must be included
- **Design excellence requirement** (for memorability) — must be distinctive

### 2. Design System Definition (Before Code)

Core pattern: **Define design system BEFORE coding:**

```
Design System = {
  Typography: {
    displayFont: (distinctive, memorable),
    bodyFont: (refined, readable),
    scale: (hierarchical with dramatic jumps)
  },
  Color: {
    dominant: (60% usage),
    accent: (10% usage, high contrast),
    neutral: (30% usage)
  },
  Motion: {
    pageLoad: (staggered reveals),
    scroll: (fade-ups, parallax),
    hover: (delightful surprises)
  },
  Spatial: {
    layout: (symmetric|asymmetric|grid-breaking),
    spacing: (tight|generous),
    flow: (stacked|diagonal|overlapping)
  }
}
```

This is **documented in CSS variables** and applied consistently.

### 3. Aesthetic Direction Pattern

Users choose ONE extreme direction and execute with precision:

- **Minimalist & Refined** — Brutally clean, generous whitespace
- **Bold & Maximalist** — Rich layers, dynamic animations, vibrant colors
- **Retro-Futuristic** — Nostalgic + modern, glitch effects, geometric
- **Organic & Natural** — Soft shapes, nature colors, smooth motion
- **Editorial & Magazine** — Typographic hierarchy, asymmetric, bold imagery
- **Brutalist & Raw** — Unconventional, intentional "ugly," high contrast

**Pattern Principle:** Choose ONE. Bold maximalism and refined minimalism both convert — the key is **intentionality**, not intensity.

### 4. Component Hierarchical Structure

Landing pages decompose into 8 major sections:

```
Header (Element 2)
  ↓
Hero (Elements 3-5)
  ↓
MediaSection (Element 6)
  ↓
Benefits (Element 7)
  ↓
Testimonials (Element 8)
  ↓
FAQ (Element 9)
  ↓
FinalCTA (Element 10)
  ↓
Footer (Element 11)
```

Each section maps to ShadCN UI components that are **heavily customized** (not default).

### 5. ShadCN UI as Starting Point, Not Endpoint

Core pattern for component customization:

```typescript
// ShadCN component is baseline accessibility & functionality
<Button />  // ← WCAG-compliant, but generic

// Customize heavily with brand aesthetic
<Button
  className="
    bg-accent hover:bg-accent/90
    px-12 py-6 text-xl
    font-display
    rounded-full shadow-2xl
    hover:shadow-accent/50 hover:scale-105
    transition-all duration-300
  "
>
  Get Started →
</Button>
```

This ensures:
- ✅ Accessibility maintained (semantic HTML, ARIA)
- ✅ Full customization applied (colors, spacing, animations)
- ✅ Ownership retained (you own the code, not locked to package versions)

### 6. Motion Strategy Pattern

Animation is hierarchical and purposeful:

```
Page Load:
  Hero Title     → animate-fade-in (delay: 0ms)
  Title Words    → animate-fade-in (delay: 100ms, 200ms, 300ms each)
  Subtitle       → animate-fade-in (delay: 300ms)
  CTA Button     → animate-fade-in (delay: 500ms, with emphasis)

Scroll Animations:
  Each Section   → fade-up as enters viewport
  Cards          → stagger in (each +100ms delay)

Hover States:
  Buttons        → scale(1.05), shadow expand, color shift
  Cards          → lift effect (translateY -4px)
  Images         → subtle zoom or parallax
```

**Principle:** One well-orchestrated entrance > scattered micro-animations.

### 7. Anti-Pattern: Avoiding Generic AI Aesthetics

The skill explicitly teaches what NOT to do:

```
❌ AVOID:
- Inter/Roboto/Arial fonts
- Purple gradients on white
- Perfectly centered, symmetric layouts
- Generic line icons
- Default yellow star ratings
- Boring rectangular buttons
- White background (no visual interest)
- Cookie-cutter 3-column grids
- Stock photos of people pointing at laptops

✅ DO:
- Distinctive fonts matching brand personality
- Unique color palettes (not always purple!)
- Unexpected asymmetric layouts
- Characterful, custom-designed icons
- Custom-styled UI elements
- Background textures, gradients, or patterns
- Varied layouts across sections
- Product screenshots, custom illustrations, authentic photos
```

This is a **defensive pattern** against the "AI-generated landing page" aesthetic that has become a cliché.

---

## Skill Purpose & Philosophy

### What This Skill Does

**landing-page-guide-v2** is a **comprehensive guide for creating distinctive, high-converting landing pages** that combine:

1. **Proven Conversion Framework** (11 essential elements)
   - Based on DESIGNNAS's high-conversion research
   - Ensures functional effectiveness

2. **Exceptional Design Quality** (aesthetic direction)
   - Bold, intentional design choices
   - Avoids generic "AI-generated" aesthetic
   - Ensures memorability and brand distinctiveness

3. **Production-Ready Technology Stack**
   - Next.js 14+ (App Router)
   - TypeScript (type safety)
   - ShadCN UI (accessible, customizable components)
   - Tailwind CSS (utility-first styling)

### Core Philosophy

**"A landing page must convert visitors AND make them remember your brand."**

The skill rejects the false dichotomy between:
- ❌ "High-converting, generic templates that blend together"
- ❌ "Beautiful but ineffective artistic experiments"

Instead, it enables:
- ✅ **Conversion-optimized** (all 11 elements present)
- ✅ **Visually extraordinary** (distinctive aesthetic direction)
- ✅ **Memorable** (users remember your brand)

### Key Insight

Generic, template-looking pages fail at both conversion AND memorability. This skill teaches:

1. **Design Thinking First** — Before coding, commit to a bold aesthetic direction
2. **Define Design System** — Typography, colors, motion, spatial approach
3. **Execute All 11 Elements** — With design excellence, not minimum viability
4. **Customize ShadCN Components** — Use accessibility, modify aesthetics completely
5. **Validate Against Checklist** — Both conversion AND design quality

---

## Integration with My Skills Repo

### How This Skill Fits

**landing-page-guide-v2** is the **design & conversion guide** in the ecosystem:

```
┌─────────────────────────────────────────────────────────────┐
│ Design & Content Generation                                 │
├─────────────────────────────────────────────────────────────┤
│ • design-prompt-generator-v2 (AI design prompts)            │
│ • landing-page-guide-v2 (Landing page design guide) ← HERE  │
│ • landing-page-guide (v1, earlier version)                  │
│ • card-news-generator-v2 (Content visualization)            │
│ • midjourney-cardnews-bg (Image generation prompts)         │
└─────────────────────────────────────────────────────────────┘
         ↓ Used with ↓
┌─────────────────────────────────────────────────────────────┐
│ Project Scaffolding & Setup                                 │
├─────────────────────────────────────────────────────────────┤
│ • nextjs15-init (Next.js 15 project generator)              │
│ • flutter-init (Flutter scaffolder)                         │
└─────────────────────────────────────────────────────────────┘
         ↓ Documented via ↓
┌─────────────────────────────────────────────────────────────┐
│ Code Analysis & Iteration                                   │
├─────────────────────────────────────────────────────────────┤
│ • code-changelog (Change documentation)                     │
│ • code-prompt-coach (Session improvement)                   │
│ • codex-claude-loop (Multi-AI iteration)                    │
└─────────────────────────────────────────────────────────────┘
```

### Typical Workflow Using Multiple Skills

```
User: "Create a modern SaaS landing page for my product"

1. [design-prompt-generator-v2] → Generate design direction
2. [landing-page-guide-v2]      → Guide through 11 elements
3. [nextjs15-init]              → Bootstrap Next.js 15 project
4. [code-changelog]             → Document changes
5. [code-prompt-coach]          → Improve prompts
```

### Related Skills in Detail

**landing-page-guide** (v1)
- Earlier version, simpler approach
- Still available for users who prefer minimal guidance
- Superseded by landing-page-guide-v2

**design-prompt-generator-v2**
- Generates AI prompts for web design
- Can inform aesthetic choices for landing pages
- Complements landing-page-guide-v2

**nextjs15-init**
- Auto-generates Next.js 15 project structure
- landing-page-guide-v2 references this tech stack
- Can be used immediately after design phase

**card-news-generator-v2**
- Creates visual card content (Instagram, social media)
- Could be used for hero background images
- Orthogonal use case (not for landing page CTAs, but supporting content)

---

## Key Design Patterns

### Pattern 1: Design-First Methodology

**Problem:** Developers often code first, design later, resulting in generic-looking pages.

**Solution:** The skill mandates a Design Thinking phase before any code:

```
PHASE 1: DESIGN THINKING (Required First)
├── Understand Context (brand, audience, problem)
├── Choose Aesthetic Direction (minimalist|maximalist|retro|etc)
└── Define Design System (fonts, colors, motion, spacing)

PHASE 2: CODE IMPLEMENTATION
├── Setup design system as CSS variables
├── Create component structure
├── Customize ShadCN components heavily
└── Implement animations

PHASE 3: VALIDATION
├── All 11 elements present?
├── Design quality checklist
├── Technical requirements met?
└── Final polish
```

This is **enforced through narrative and education**, not automation.

### Pattern 2: Dual Requirements (Functional + Design)

Each of the 11 elements has two requirements:

```
Element = {
  Functional: "Must be included for conversion" ✅
  Design Excellence: "Must be distinctive and beautiful" ✅
}
```

Example: Primary CTA
- Functional: "Main button in hero section" ✅
- Design Excellence: "Make it IMPOSSIBLE to miss with size, color, position, micro-interactions" ✅

This ensures pages are **both effective AND memorable**.

### Pattern 3: CSS Variables for Design System

All design decisions are centralized in CSS variables:

```css
:root {
  /* Typography */
  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'DM Sans', sans-serif;

  /* Colors */
  --color-primary: #1a1a1a;
  --color-accent: #ff6b35;
  --color-neutral: #f5f5f5;

  /* Animation */
  --duration-fast: 150ms;
  --easing: cubic-bezier(0.4, 0, 0.2, 1);
}
```

Benefits:
- Single source of truth
- Easy brand customization
- Consistent throughout page
- Easy to iterate on aesthetics

### Pattern 4: Component-to-Element Mapping

8 React components map to 11 elements:

```typescript
<Header />           // Element 2 (Logo, Navigation)
<Hero />             // Elements 3-5 (Title, CTA, Social Proof)
<MediaSection />     // Element 6 (Images/Videos)
<Benefits />         // Element 7 (Features)
<Testimonials />     // Element 8 (Reviews)
<FAQ />              // Element 9 (Accordion)
<FinalCTA />         // Element 10 (Bottom CTA)
<Footer />           // Element 11 (Contact, Legal)
```

Each component receives design system props and customizes ShadCN elements.

### Pattern 5: Responsive Design as First-Class Citizen

Mobile-first responsive is mandatory, not optional:

```tsx
<h1 className="
  text-4xl sm:text-5xl lg:text-6xl
  font-display font-bold
  leading-tight
">
  Responsive heading scales with viewport
</h1>
```

Tested on:
- Mobile (640px)
- Tablet (768px)
- Desktop (1024px+)
- Ultra-wide (1280px+)

### Pattern 6: Performance as Design Requirement

Performance optimizations are documented as part of design:

- **Images:** Next.js Image component, WebP format, lazy loading
- **Fonts:** `font-display: swap` to avoid FOIT
- **CSS Animations:** Use `transform` and `opacity` (GPU-accelerated)
- **Bundle:** Tree-shake unused ShadCN components
- **Target Metrics:** LCP < 2.5s, FID < 100ms, CLS < 0.1

This ensures beautiful pages also perform well.

### Pattern 7: Accessibility as Non-Negotiable

Accessibility is enforced throughout:

- Semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<footer>`)
- ARIA labels for icon-only buttons
- Sufficient color contrast (WCAG AA minimum: 4.5:1)
- Keyboard navigation support (test with Tab key)
- Reduced motion support:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

ShadCN components provide the baseline; customization maintains these standards.

---

## Technical Stack

### Required Technologies

| Technology | Purpose | Version | Reasoning |
|-----------|---------|---------|-----------|
| **Next.js** | Framework, App Router | 14+ | Server-side rendering, optimized images, best DX |
| **TypeScript** | Type safety | Latest | Catch bugs, better IDE support, documentation |
| **Tailwind CSS** | Styling | Latest | Utility-first, rapid prototyping, consistent spacing |
| **ShadCN UI** | Component library | Latest | Accessible, customizable, copy-paste flexibility |
| **Framer Motion** | Advanced animations | Latest | Optional: scroll triggers, page transitions |

### ShadCN Components Required

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add accordion
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add input
```

### Why This Stack?

- **Next.js 14+:** App Router is modern standard, optimized image/font delivery
- **TypeScript:** Catches errors before runtime, excellent for component libraries
- **Tailwind CSS:** Rapid styling, consistency, maintainability
- **ShadCN UI:** Not a package (copy-paste), so you own and customize every line
- **Framer Motion:** Optional, but enables advanced scroll-triggered animations

---

## File Dependencies

```
SKILL.md (Entry Point)
├── Requires reading: references/11-essential-elements.md
│   └── Deep dive on elements 1-11
├── References: references/component-examples.md
│   └── Copy-paste code starting points
└── Shows: landing-page-v2.png
    └── Visual example of deliverable
```

**Reading Order for Users:**

1. Start with SKILL.md → Understand philosophy and overview
2. Design Thinking section → Plan your aesthetic
3. The 11 Essential Elements section → Learn what to include
4. Technology Stack section → Setup tools
5. Implementation Workflow section → Follow step-by-step
6. Refer to references/ as needed during building
7. Validate Against Checklist → Polish and complete

---

## Summary

### What Is landing-page-guide-v2?

A **comprehensive guide** (not code generator) for creating landing pages that are:
- **Conversion-optimized** (11 essential elements framework)
- **Visually distinctive** (bold aesthetic direction)
- **Production-ready** (Next.js 14+, ShadCN, TypeScript)
- **Accessible** (WCAG AA standards)
- **Performant** (Core Web Vitals optimized)

### Key Entry Point

Read **SKILL.md** first. It's self-contained, teaches design-first methodology, and references supporting materials.

### Core Pattern

```
Design System Definition → Component Structure → 11 Elements Implementation → Validation Checklist
```

### Integration

Part of **My Skills Hub** ecosystem, complementing:
- `nextjs15-init` (project scaffolding)
- `design-prompt-generator-v2` (design direction)
- `code-changelog` (documentation)

### Philosophy

**"The best landing pages convert AND inspire."**

Every design choice is intentional. Every element serves conversion. Every aesthetic detail creates brand distinctiveness. Generic, templated pages fail at both — this skill teaches both conversion science and design excellence.

---

**Generated:** 2026-06-03  
**Analyzed By:** Architecture Explorer Agent  
**Source:** `/route/mission-control/ψ/learn/bear2u/my-skills/origin/skills/landing-page-guide-v2/`
