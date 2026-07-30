# MARCUZ HIGH-FIDELITY DESIGN

**Status**: Production-Ready Wireframes & Specs  
**Date**: 2026-07-04  
**Format**: Component specifications + Layout hierarchy + Interaction patterns  

---

## 🎯 DESIGN PRINCIPLES (IMPLEMENTED)

✓ **Premium Minimalism** — Maximum impact with minimum elements  
✓ **Generous Whitespace** — Breathing room between sections  
✓ **Large Typography** — Readable, impactful headlines  
✓ **Elegant Grid** — 12-column responsive system  
✓ **Refined Motion** — Purposeful animations, never gratuitous  
✓ **Real Imagery** — Authentic business moments  
✓ **Trust Through Clarity** — Every element serves a purpose  

---

## 📐 RESPONSIVE GRID SYSTEM

### Desktop (1200px+)
```
- Full width: 1200px content
- Padding: 60px horizontal
- Column width: 80px
- Gutter: 20px
- 12-column layout
```

### Tablet (768px-1199px)
```
- Full width: 90% of viewport
- Padding: 40px horizontal
- Column width: 60px
- Gutter: 16px
- 8-column layout
```

### Mobile (< 768px)
```
- Full width: 95% of viewport
- Padding: 24px horizontal
- Single column layout
- Touch targets: minimum 44px height
```

---

## 01 — HERO SECTION

### Layout Specs

**Desktop Layout:**
```
┌─────────────────────────────────────────────────┐
│                                                 │
│         HEADLINE (56px, centered)               │
│    "Technology should make work effortless."    │
│                                                 │
│              ↓ 32px whitespace ↓                │
│                                                 │
│       SUBHEADING (18px, centered, warm gray)    │
│     "Marcuz helps organizations redesign..."    │
│                                                 │
│              ↓ 48px whitespace ↓                │
│                                                 │
│     [Primary CTA]    [Secondary CTA]            │
│                                                 │
│              ↓ 64px whitespace ↓                │
│                                                 │
│              [Hero Image - Full Width]          │
│         (1200px × 500px, 12:5 aspect ratio)    │
│                                                 │
│              ↓ 24px whitespace ↓                │
│                                                 │
│        SOCIAL PROOF (14px, centered, graphite)  │
│    "Trusted by ORRY Thailand, Arigeo, Maid"    │
│                                                 │
└─────────────────────────────────────────────────┘

Total Section Height: ~900px (desktop)
```

**Tablet Layout:**
```
- Headline: 40px
- Subheading: 16px
- Single column buttons (stacked)
- Hero image: 90% width
- Total height: ~800px
```

**Mobile Layout:**
```
- Headline: 32px
- Subheading: 14px
- Single column buttons (full width)
- Hero image: 95% width + scroll reveal
- Total height: ~750px
```

### Hero Image Specifications

**Image Requirements:**
- Dimensions: 1200px × 500px (minimum)
- Aspect Ratio: 12:5
- Style: Modern office/business environment
- Tone: Professional, aspirational, authentic
- Content: People working collaboratively, modern workspace, technology visible but not dominant

**Image Treatment:**
- Subtle gradient overlay (10% dark, adds depth)
- Slight zoom on scroll (parallax effect, 10% scale change)
- Fade-in animation (300ms ease-out)

### Component Specifications

**Headline Component**
```
Element: h1.hero-headline
Font: Display font (Inter)
Size: 56px (desktop) / 40px (tablet) / 32px (mobile)
Weight: 700 (bold)
Color: --color-text-primary
Line-height: 1.2
Letter-spacing: -0.02em
Text-align: center
Max-width: 900px
Animation: slideDown (300ms ease-out)
```

**Subheading Component**
```
Element: p.hero-subheading
Font: Body font
Size: 18px (desktop) / 16px (tablet) / 14px (mobile)
Weight: 400 (normal)
Color: --color-text-secondary
Line-height: 1.6
Max-width: 700px
Margin-block: 32px 48px
Animation: slideDown (300ms ease-out, delay 100ms)
```

**CTA Button Group**
```
Element: .hero-cta-group
Display: flex
Justify-content: center
Gap: 16px
Flex-wrap: wrap (on mobile: flex-direction column)

Primary Button:
- Text: "Book a Discovery Session"
- Style: Button primary (bg: blue, text: white)
- Padding: 16px 32px
- Height: 44px (touch target)
- Border-radius: 8px
- Font: 16px, 600 weight
- Cursor: pointer
- Transition: background 200ms ease-out
- Hover: background darker blue + shadow-md
- Focus: outline 2px var(--color-primary) offset 2px
- Animation: slideUp (300ms ease-out, delay 200ms)

Secondary Button:
- Text: "View Our Work"
- Style: Button ghost (bg: transparent, border: 1px gray, text: primary blue)
- Padding: 16px 32px
- Height: 44px
- Border-radius: 8px
- Font: 16px, 600 weight
- Hover: bg light gray
- Animation: slideUp (300ms ease-out, delay 250ms)
```

**Social Proof**
```
Element: .hero-social-proof
Font: 14px, normal weight
Color: --color-text-secondary
Margin-top: 64px
Text-align: center
Animation: fadeIn (300ms ease-out, delay 400ms)
```

### Interaction Patterns

**Scroll Animations:**
- Hero headline: Fade in + slide down (on page load)
- Subheading: Fade in + slide down (delay 100ms)
- Buttons: Fade in + slide up (delay 200ms)
- Social proof: Fade in (delay 400ms)
- Hero image: Parallax zoom (10% scale on scroll)

**Hover States:**
- Primary button: Background color darkens, shadow increases
- Secondary button: Background becomes light gray
- Both buttons: Subtle scale increase (1.02x)

**Mobile Interactions:**
- Buttons stack vertically, full width
- Touch targets: 44px minimum height
- No hover effects on touch devices
- Tap feedback: Background color change 200ms

---

## 02 — TRUSTED RELATIONSHIPS

### Layout Specs

**Desktop Layout:**
```
┌────────────────────────────────────────┐
│         SECTION TITLE (32px)           │
│  "We partner with growing organizations"│
│                                        │
│           ↓ 24px whitespace ↓          │
│                                        │
│  INTRO TEXT (16px, centered, max 600px)│
│  "From concept to execution, we work..." │
│                                        │
│           ↓ 64px whitespace ↓          │
│                                        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │  ORRY   │  │ ARIGEO  │  │ CATION  │ │
│  │Thailand │  │         │  │  MAID   │ │
│  │         │  │         │  │         │ │
│  │ [Logo]  │  │ [Logo]  │  │ [Logo]  │ │
│  │         │  │         │  │         │ │
│  │Description Description Description │ │
│  │         │  │         │  │         │ │
│  └─────────┘  └─────────┘  └─────────┘ │
│                                        │
│  Gap between cards: 32px               │
│  Card width: calc(33.33% - 21px)      │
│                                        │
└────────────────────────────────────────┘

Total Section Height: ~600px
Background: White
Margin-block: 96px (top) / 96px (bottom)
```

**Tablet Layout:**
```
- 2-column grid (cards stack 2-1)
- Card width: calc(50% - 16px)
- Gap: 24px
- Total height: ~850px
```

**Mobile Layout:**
```
- Single column stack
- Card width: 100%
- Gap: 16px
- Total height: ~900px
```

### Component Specifications

**Section Header**
```
Element: .section-header
Text-align: center
Margin-block: 0 24px

h2.section-title:
- Font: 32px, 700 weight, text-primary
- Max-width: 100%
- Line-height: 1.2

p.section-intro:
- Font: 16px, 400 weight, text-secondary
- Max-width: 600px
- Margin: 0 auto
- Line-height: 1.6
```

**Client Card Component**
```
Element: .client-card
Display: flex
Flex-direction: column
Padding: 32px
Background: white
Border: 1px solid var(--color-border)
Border-radius: 12px
Transition: box-shadow 200ms ease-out, transform 200ms ease-out

Hover State:
- Box-shadow: var(--shadow-md)
- Transform: translateY(-4px)

Card Content Structure:
┌─────────────────────┐
│   [Client Logo]     │ 60px height, centered, 32px margin-bottom
│                     │
│  CLIENT NAME        │ 20px, 700 weight, text-primary
│                     │ 16px margin-bottom
│                     │
│  Role/Description   │ 14px, 400 weight, text-secondary
│  Line-height: 1.6   │ 24px margin-bottom
│                     │
│  Status Badge       │ "Active partner"
│  (Optional)         │ 12px, 500 weight, gray
│                     │
└─────────────────────┘
```

**Client Logo Styling**
```
Element: img.client-logo
Max-height: 60px
Max-width: 120px
Object-fit: contain
Margin: 0 auto
```

### Interaction Patterns

**On Scroll:**
- Cards fade in + scale up (scaleIn animation, 300ms)
- Staggered: each card delays 100ms after previous
- Animation trigger: when card enters viewport

**Hover (Desktop):**
- Shadow increases (shadow-md)
- Card lifts slightly (translateY -4px)
- All transitions: 200ms ease-out

**Mobile:**
- No hover effects
- Cards respond to tap with subtle feedback

---

## 03 — BUSINESS REALITY

### Layout Specs

**Desktop Layout:**
```
┌────────────────────────────────────────┐
│    SECTION TITLE (32px, centered)      │
│  "The challenge every growing org faces"│
│                                        │
│         ↓ 24px whitespace ↓            │
│                                        │
│  INTRO TEXT (16px, centered)           │
│  "As businesses scale, the tools..."   │
│                                        │
│         ↓ 64px whitespace ↓            │
│                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────┐ │
│  │ Problem  │  │ Problem  │  │ Prob │ │
│  │   Icon   │  │   Icon   │  │ Icon │ │
│  │          │  │          │  │      │ │
│  │ Headline │  │ Headline │  │ Head │ │
│  │          │  │          │  │      │ │
│  │Descrip   │  │Descrip   │  │Descr │ │
│  │          │  │          │  │      │ │
│  │Impact »  │  │Impact »  │  │Impac │ │
│  └──────────┘  └──────────┘  └──────┘ │
│                                        │
│  Gap: 24px                             │
│  3 columns (2 on tablet, 1 on mobile)  │
│                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────┐ │
│  │ Problem  │  │ Problem  │  │ Prob │ │
│  │   4      │  │   5      │  │  6   │ │
│  └──────────┘  └──────────┘  └──────┘ │
│                                        │
└────────────────────────────────────────┘

Background: Warm gray (var(--color-gray-warm))
Padding: 96px horizontal / 96px vertical
Grid: 3 columns, 24px gap
```

**Tablet Layout:**
```
- 2-column grid
- Gap: 20px
- Padding: 60px horizontal / 80px vertical
```

**Mobile Layout:**
```
- Single column
- Full width cards
- Padding: 24px horizontal / 64px vertical
```

### Component Specifications

**Problem Card Component**
```
Element: .problem-card
Display: flex
Flex-direction: column
Padding: 32px
Background: white
Border: 1px solid transparent
Border-radius: 8px
Transition: all 200ms ease-out

Hover State (Desktop only):
- Background: light blue (var(--color-blue-light))
- Border: 1px solid var(--color-primary)
- Transform: translateY(-2px)
- Box-shadow: var(--shadow-sm)

Card Structure:
┌──────────────────────┐
│   Icon (32×32)       │ 32px height, accent blue color
│                      │ 24px margin-bottom
│                      │
│   HEADLINE (18px)    │ 700 weight, text-primary
│   "Manual Work..."   │ 16px margin-bottom
│                      │
│   Description (14px) │ 400 weight, text-secondary
│   "Spreadsheets..."  │ Line-height: 1.6
│                      │ 24px margin-bottom
│                      │
│   Impact (13px)      │ Italic, accent blue, "icon »"
│   "Teams spend..."   │ 
│                      │
└──────────────────────┘
```

**Icon Styling**
```
Element: .problem-icon
Width: 32px
Height: 32px
Color: var(--color-primary)
Margin-bottom: 24px

Icon Set:
- Manual work: Clock/hourglass icon
- Disconnected: Link/chain icon
- Slow approvals: Hourglass icon
- Knowledge loss: Person/exit icon
- Visibility gap: Eye icon
- Scaling complexity: Growth/line icon
```

**Impact Text**
```
Element: .impact-text
Font-size: 13px
Font-style: italic
Color: var(--color-primary)
Margin-top: auto (pushes to bottom of card)

Format: "📊 [impact statement] »"
```

### Interaction Patterns

**On Scroll:**
- Cards fade in (fadeIn, 300ms)
- Staggered entrance (100ms between each)

**Hover (Desktop):**
- Background changes to light blue
- Border becomes solid primary
- Card lifts slightly (translateY -2px)
- All transitions: 200ms ease-out

**On Click/Focus:**
- Card highlights (for accessibility)
- Link target if card is clickable

---

## 04 — WHAT WE BELIEVE

### Layout Specs

**Desktop Layout:**
```
┌────────────────────────────────────────┐
│   SECTION TITLE (32px, centered)       │
│       "Our philosophy."                │
│                                        │
│      ↓ 24px whitespace ↓               │
│                                        │
│  INTRO TEXT (16px, centered, max 600px)│
│  "Everything we do is guided by..."    │
│                                        │
│      ↓ 64px whitespace ↓               │
│                                        │
│  ┌─────────────────────────────────┐  │
│  │ Belief 1                        │  │
│  │                                 │  │
│  │ HEADLINE (20px)                 │  │
│  │ "Tech should simplify, not..."  │  │
│  │                                 │  │
│  │ Description (14px, text-secondary)│  │
│  │ "If your software requires..."  │  │
│  └─────────────────────────────────┘  │
│                                        │
│  ┌─────────────────────────────────┐  │
│  │ Belief 2                        │  │
│  │ ... (repeats)                   │  │
│  └─────────────────────────────────┘  │
│                                        │
│  (7 belief cards total)                │
│  Single column layout                  │
│  Gap: 24px between cards               │
│                                        │
└────────────────────────────────────────┘

Background: White
Padding: 96px horizontal / 96px vertical
Max-width per card: 900px, centered
```

**Tablet/Mobile Layout:**
```
- Still single column
- Card width: 100%
- Padding: 24px horizontal / 64px vertical
```

### Component Specifications

**Belief Card Component**
```
Element: .belief-card
Display: flex
Flex-direction: column
Padding: 40px
Background: white
Border: 1px solid var(--color-border)
Border-radius: 12px
Transition: all 200ms ease-out
Max-width: 900px
Margin: 0 auto

Hover State (Desktop):
- Border-color: var(--color-primary)
- Box-shadow: var(--shadow-md)
- Background: var(--color-blue-light)

Card Structure:
┌──────────────────────────┐
│  HEADLINE (20px)         │ 700 weight, text-primary
│  "Technology should..."  │ 20px margin-bottom
│                          │
│  Description (14px)      │ 400 weight, text-secondary
│  "If your software..."   │ Line-height: 1.8
│                          │
└──────────────────────────┘
```

### Interaction Patterns

**On Scroll:**
- Cards fade in + slideDown (300ms ease-out)
- Staggered: 100ms delay between each card

**Hover (Desktop):**
- Border becomes primary color
- Background becomes light blue
- Shadow increases
- All transitions: 200ms ease-out

---

## 05 — TRANSFORMATION

### Layout Specs

**Desktop Layout:**
```
┌────────────────────────────────────────┐
│  SECTION TITLE (32px, centered)        │
│  "From scattered to seamless."         │
│                                        │
│      ↓ 24px whitespace ↓               │
│                                        │
│  INTRO TEXT (centered)                 │
│                                        │
│      ↓ 64px whitespace ↓               │
│                                        │
│  ┌─ BEFORE ─┬─────────────┬─ AFTER ─┐ │
│  │           │   ARROW     │          │ │
│  │ Disconnect│      ↓      │ Connected│ │
│  │           │   Motion    │          │ │
│  │ • Manual  │   (300ms)   │ • Auto   │ │
│  │ • Scattered          │ • Unified  │ │
│  │ • Slow    │  Through   │ • Fast   │ │
│  │ • Siloed  │ Transform  │ • Integrated
│  │ • Limited │           │ • Real-time
│  │ • Chaos   │           │ • Aligned  │
│  │           │           │          │ │
│  └─────────┴─────────────┴─────────┘ │
│                                        │
│      ↓ 64px whitespace ↓               │
│                                        │
│  INDUSTRY EXAMPLES (3-column grid)     │
│  Healthcare | Retail | Hospitality     │
│                                        │
└────────────────────────────────────────┘

Background: Warm gray background
Padding: 96px
```

**Tablet/Mobile Layout:**
```
- Stack vertically: Before → Arrow → After
- Single column examples
- Padding: 24px horizontal / 64px vertical
```

### Component Specifications

**Transformation Diagram**
```
Element: .transformation-container
Display: grid
Grid-template-columns: 1fr 100px 1fr
Gap: 32px
Max-width: 1000px
Margin: 0 auto

┌────────────────────────────────────────┐
│  .before-state │ .arrow │ .after-state │
└────────────────────────────────────────┘

Before State:
- Headline: "Disconnected" (20px, 700 weight, red tint)
- List: 6 items (14px, text-secondary)
- List-style: none
- Each item: "• [text]"
- Color: Graphite

Arrow/Transition:
- Central column (100px wide)
- Vertical arrow (↓)
- Animation: Pulse effect (1.2s infinite)
- Text below: "Through thoughtful design" (12px, italic, accent)
- Text below: "and strategic automation" (12px, italic, accent)
- Duration: Plays on scroll into view

After State:
- Headline: "Connected" (20px, 700 weight, green tint)
- List: 6 items (14px, text-secondary)
- Same styling as before

Color Tints:
- Before: Subtle red overlay (10% opacity on background)
- Arrow: Accent blue
- After: Subtle green overlay (10% opacity on background)
```

**Animation Spec: Transformation**
```
Trigger: On scroll into viewport
Duration: 800ms total

Timeline:
0ms:    Arrow fades in, scale 0
200ms:  Arrow reaches full opacity & scale
250ms:  Vertical line animates down (motion-path)
400ms:  After state fades in from right
600ms:  Items list animates in (staggered, 50ms each)
800ms:  Complete, arrow pulses gently
```

**Industry Example Cards**
```
Element: .industry-example
Display: grid (3 columns desktop, 1 column mobile)
Gap: 24px
Margin-top: 64px

Card Structure:
┌────────────────────┐
│  INDUSTRY (12px)   │ Uppercase, accent blue
│  "HEALTHCARE"      │
│                    │
│  BEFORE → AFTER    │ 14px, text-secondary
│  "Manual appts →   │ Two-line comparison
│   Auto scheduling" │
│                    │
└────────────────────┘

Hover (Desktop):
- Background: light blue
- Border: accent
- Transform: scale 1.02
```

### Interaction Patterns

**On Scroll:**
- Entire diagram animates into view
- Arrow appears first
- Before/After states fade in
- Industry examples stagger in

**Animation Priority:**
- Arrow animation always plays (important visual cue)
- Smooth 800ms total duration
- Reduced motion: All animations become instant

---

## 06 — BUSINESS OUTCOMES

### Layout Specs

**Desktop Layout:**
```
┌────────────────────────────────────────────────┐
│  SECTION TITLE (32px)                          │
│  "What transformation looks like."             │
│                                                │
│     ↓ 24px whitespace ↓                        │
│                                                │
│  INTRO TEXT (16px, centered)                   │
│                                                │
│     ↓ 64px whitespace ↓                        │
│                                                │
│  ┌────────────┐  ┌────────────┐  ┌────────┐  │
│  │ Operate    │  │ Serve      │  │ Make   │  │
│  │ Better     │  │ Customers  │  │ Better │  │
│  │            │  │ Better     │  │Decisions│ │
│  │ Icon (32)  │  │ Icon (32)  │  │ Icon   │  │
│  │ Headline   │  │ Headline   │  │Headline│  │
│  │ Desc       │  │ Desc       │  │Desc    │  │
│  │ Examples   │  │ Examples   │  │Examples│  │
│  └────────────┘  └────────────┘  └────────┘  │
│                                                │
│  ┌────────────┐  ┌────────────┐  ┌────────┐  │
│  │ Automate   │  │ Build AI   │  │ Scale  │  │
│  │ Repetitive │  │ Capabilities Operatns │  │
│  │ Work       │  │            │          │  │
│  │ ...        │  │ ...        │  │ ...    │  │
│  └────────────┘  └────────────┘  └────────┘  │
│                                                │
│  Grid: 3 columns (2 tablet, 1 mobile)         │
│  Gap: 24px                                    │
│                                                │
└────────────────────────────────────────────────┘

Background: White
Padding: 96px
```

### Component Specifications

**Outcome Card Component**
```
Element: .outcome-card
Display: flex
Flex-direction: column
Padding: 32px
Background: white
Border: 1px solid var(--color-border)
Border-radius: 8px
Transition: all 300ms ease-out
Min-height: 400px (equal height cards)

Hover State (Desktop):
- Border-color: var(--color-primary)
- Box-shadow: var(--shadow-lg)
- Transform: translateY(-8px)
- Background: var(--color-blue-light)

Card Structure:
┌────────────────────┐
│  Icon (40×40)      │ Accent blue color
│  Margin-bottom: 24 │
│                    │
│  HEADLINE (18px)   │ 700 weight, text-primary
│  "Streamline..."   │ 16px margin-bottom
│                    │
│  Description (14px)│ 400 weight, text-secondary
│  Line-height: 1.6  │ 20px margin-bottom
│  Flex: 1 (grows)   │
│                    │
│  EXAMPLES:         │ 13px, accent blue, list
│  - Reduce cycles   │ • Bullet format
│  - Eliminate entry │ 4px margin between items
│  - Standardize     │ Margin-top: auto
│                    │
└────────────────────┘
```

**Icon Set for Outcomes**
```
1. Operate Better: Gear/Cog icon
2. Serve Customers: User/Heart icon
3. Make Better Decisions: Target/Data icon
4. Automate Repetitive: Robot/Automation icon
5. Build AI: Brain/Lightning icon
6. Scale Operations: Growth/Upward arrow icon

All icons: 40×40, var(--color-primary)
```

### Interaction Patterns

**On Scroll:**
- Cards fade in + scale up (300ms)
- Staggered: 100ms between each card
- Icons animate separately (bounceIn effect)

**Hover (Desktop):**
- Entire card lifts (translateY -8px)
- Shadow increases significantly
- Background becomes light blue
- Border gains primary color
- All transitions: 300ms ease-out

**Mobile:**
- Cards stack vertically
- Touch feedback only (no hover)
- Cards remain card background

---

## 07 — CASE STUDIES

### Layout Specs

**Desktop Layout:**
```
┌──────────────────────────────────────────┐
│ SECTION TITLE (32px)                     │
│ "How transformation works in practice."  │
│                                          │
│    ↓ 64px whitespace ↓                   │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  FEATURED CASE STUDY               │  │
│  │  ┌──────────────────────────────┐  │  │
│  │  │ "ORRY Thailand" Badge (14px) │  │  │
│  │  │ E-commerce                   │  │  │
│  │  └──────────────────────────────┘  │  │
│  │                                    │  │
│  │  HEADLINE (32px)                   │  │
│  │  "Building a platform that scales" │  │
│  │                                    │  │
│  │     ↓ 24px ↓                       │  │
│  │                                    │  │
│  │  Grid (2 columns):                 │  │
│  │  ┌──────────────┬──────────────┐   │  │
│  │  │ CHALLENGE    │ THINKING     │   │  │
│  │  │              │              │   │  │
│  │  │ [Icon] Head  │ [Icon] Head  │   │  │
│  │  │              │              │   │  │
│  │  │ Copy...      │ Copy...      │   │  │
│  │  └──────────────┴──────────────┘   │  │
│  │                                    │  │
│  │  ┌──────────────┬──────────────┐   │  │
│  │  │ APPROACH     │ SOLUTION     │   │  │
│  │  │              │              │   │  │
│  │  │ [Icon] Head  │ [Icon] Head  │   │  │
│  │  │              │              │   │  │
│  │  │ Copy...      │ Copy...      │   │  │
│  │  └──────────────┴──────────────┘   │  │
│  │                                    │  │
│  │  ┌──────────────────────────────┐  │  │
│  │  │ OUTCOME                      │  │  │
│  │  │                              │  │  │
│  │  │ [Icon] Headline              │  │  │
│  │  │ • 40% reduction in time      │  │  │
│  │  │ • 99% inventory accuracy     │  │  │
│  │  │ • Real-time visibility       │  │  │
│  │  └──────────────────────────────┘  │  │
│  │                                    │  │
│  │  [CTA Button - Primary]            │  │
│  │  "Book a Discovery Session"        │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│     ↓ 64px whitespace ↓                  │
│                                          │
│  SECONDARY CASE STUDIES (2-column grid)  │
│  Arigeo | Cation Maid                    │
│  [Compact cards with challenge+outcome]  │
│                                          │
└──────────────────────────────────────────┘

Background: White with featured case bg (light gray)
Featured case padding: 48px
```

**Tablet Layout:**
```
- Featured case: Single column sections
- Secondary cases: Single column
- Padding: 40px
```

**Mobile Layout:**
```
- Featured case: All sections stack vertically
- Secondary cases: Full width cards
- Padding: 24px
```

### Component Specifications

**Featured Case Study Card**
```
Element: .featured-case-study
Background: var(--color-gray-warm)
Padding: 48px (desktop) / 32px (tablet) / 24px (mobile)
Border-radius: 12px
Border: 1px solid var(--color-gray-medium)

Client Badge:
- Font: 12px, 600 weight
- Color: var(--color-primary)
- Uppercase
- Margin-bottom: 16px

Headline:
- Font: 32px, 700 weight (desktop) / 24px (mobile)
- Color: text-primary
- Line-height: 1.2
- Margin-bottom: 32px

Section Grid (2 columns):
- Gap: 24px
- Each column: 48% width
- Responsive: Stack on tablet/mobile

Section Card Structure:
┌──────────────────────┐
│ Icon (32×32)         │ Accent blue
│ Margin-bottom: 16    │
│                      │
│ TITLE (16px)         │ 700 weight, text-primary
│ "Challenge"          │ 12px margin-bottom
│                      │
│ Content (14px)       │ 400 weight, text-secondary
│ Line-height: 1.6     │
│ "ORRY had outgrown..."│
│                      │
└──────────────────────┘

Outcome Section (Full Width):
- Same structure as section cards
- Background: var(--color-white)
- Padding: 32px
- Border: 1px solid var(--color-border)
- Border-radius: 8px

Outcome List:
- Bullet points (•)
- 14px, text-secondary
- Line-height: 1.8
- 12px margin between items
```

**Secondary Case Studies**
```
Element: .secondary-case-study
Display: grid (2 columns desktop, 1 mobile)
Gap: 24px
Margin-top: 48px

Card:
- Padding: 32px
- Background: white
- Border: 1px solid var(--color-border)
- Border-radius: 8px

Compact Structure:
- Client name + type (12px, accent)
- Challenge heading (18px)
- Challenge summary (14px, text-secondary)
- Arrow "→"
- Outcome summary (14px, text-secondary)
- CTA: "View case study" (inline, accent blue)
```

### Interaction Patterns

**On Scroll:**
- Featured case fades in + slideUp (500ms)
- Section cards stagger in (100ms between)
- Secondary cases fade in + scale (300ms)

**Hover (Desktop):**
- Secondary case cards: Lift + shadow (like outcome cards)
- CTA links: Underline + color change
- All transitions: 200ms ease-out

---

## 08 — HOW WE WORK (5-Stage Methodology)

### Layout Specs

**Desktop Layout:**
```
┌──────────────────────────────────────────────────┐
│ SECTION TITLE (32px, centered)                   │
│ "Our methodology. Proven. Transparent. Human."   │
│                                                  │
│     ↓ 24px ↓                                     │
│                                                  │
│ INTRO TEXT (16px, centered)                      │
│ "We follow a clear five-stage process."          │
│                                                  │
│     ↓ 64px ↓                                     │
│                                                  │
│ Timeline Visualization:                          │
│                                                  │
│  ①─────②─────③─────④─────⑤                      │
│ DISC  DESIGN BUILD VAL  IMPROVE                 │
│                                                  │
│   ↓ 48px ↓                                       │
│                                                  │
│ Stage 1: DISCOVER                                │
│ ┌──────────────────────────────────────────┐    │
│ │ Duration: 2-4 weeks                      │    │
│ │ Purpose: Clarity                         │    │
│ │                                          │    │
│ │ What Happens:                            │    │
│ │ • Immerse in your business               │    │
│ │ • Map workflows & pain points            │    │
│ │ • Interview stakeholders                 │    │
│ │                                          │    │
│ │ Deliverable: Clear understanding         │    │
│ │ that becomes the foundation.             │    │
│ │                                          │    │
│ │ Human-Centered:                          │    │
│ │ We ask questions because listening       │    │
│ │ matters...                               │    │
│ │                                          │    │
│ └──────────────────────────────────────────┘    │
│                                                  │
│ [Repeats for stages 2-5]                        │
│                                                  │
└──────────────────────────────────────────────────┘

Background: White
Padding: 96px
```

### Component Specifications

**Timeline Header**
```
Element: .methodology-timeline
Display: flex
Justify-content: space-between
Align-items: center
Max-width: 800px
Margin: 0 auto
Height: 80px
Margin-bottom: 48px

① ─── ② ─── ③ ─── ④ ─── ⑤

Circle Elements:
- Width/Height: 48px
- Background: var(--color-primary)
- Color: white
- Border: 2px solid var(--color-primary)
- Border-radius: 50%
- Font: 20px, 700 weight
- Display: flex, justify-content center, align-items center

Connecting Lines:
- Height: 2px
- Background: var(--color-primary)
- Flex: 1 (fills space between circles)
- Display: block between each circle

Label (below circle):
- Font: 12px, 600 weight
- Uppercase
- Color: text-primary
- Margin-top: 8px
- Text-align: center
```

**Stage Card**
```
Element: .methodology-stage
Padding: 40px
Background: white
Border: 2px solid var(--color-gray-medium)
Border-radius: 12px
Margin-bottom: 32px
Transition: all 300ms ease-out

Active/Focused State:
- Border-color: var(--color-primary)
- Box-shadow: var(--shadow-lg)
- Background: var(--color-blue-light)

Card Content:
┌────────────────────────┐
│ Duration (12px, accent)│ "2-4 weeks"
│ Purpose (12px, accent) │ "Clarity"
│ Margin-bottom: 24px    │
│                        │
│ What Happens (14px)    │ 700 weight, text-primary
│ Bullet list:           │ 14px, text-secondary
│ • Point 1 (each 12px)  │ • Format
│ • Point 2              │ 8px margin between
│ • Point 3              │ Margin-bottom: 24px
│                        │
│ Deliverable (14px)     │ Text-secondary
│ Explanation text       │ Line-height: 1.6
│ that summarizes        │ Margin-bottom: 24px
│ outcome                │
│                        │
│ Human-Centered (14px)  │ Bold heading
│ Explanation of why     │ "Human-Centered:"
│ this matters           │ Italic body text
│                        │ Line-height: 1.6
│                        │
└────────────────────────┘
```

**Stage Transitions**
```
Between each stage card:
- Subtle arrow pointing down (↓)
- "Next Stage" text (optional)
- 16px margin between cards
- Arrow animation: pulse effect
```

### Interaction Patterns

**On Scroll:**
- Each stage card fades in + slideDown (400ms)
- Staggered: 150ms between each stage
- Timeline appears first

**Hover (Desktop):**
- Card border becomes primary color
- Background becomes light blue
- Card lifts slightly (translateY -4px)
- Box-shadow increases
- All transitions: 300ms ease-out

**Mobile:**
- Cards stack vertically
- Timeline becomes vertical (modified layout)
- No hover effects (touch-only)

---

## 09 — INSIGHTS & KNOWLEDGE HUB

### Layout Specs

**Desktop Layout:**
```
┌──────────────────────────────────────────┐
│ SECTION TITLE (32px)                     │
│ "Learn how organizations transform."     │
│                                          │
│    ↓ 24px ↓                              │
│                                          │
│ INTRO TEXT (16px)                        │
│ "We share what we learn through..."      │
│                                          │
│    ↓ 64px ↓                              │
│                                          │
│ FEATURED ARTICLE (Highlighted)           │
│ ┌────────────────────────────────────┐   │
│ │ [Article Image - 400×250]          │   │
│ │                                    │   │
│ │ Category Badge (12px, accent)      │   │
│ │ "AI & Automation"                  │   │
│ │                                    │   │
│ │ Title (20px, 700 weight)           │   │
│ │ "Why AI Projects Fail..."          │   │
│ │                                    │   │
│ │ Excerpt (14px, text-secondary)     │   │
│ │ "Understanding the patterns..."    │   │
│ │                                    │   │
│ │ [Read More] → (accent blue)        │   │
│ └────────────────────────────────────┘   │
│                                          │
│    ↓ 64px ↓                              │
│                                          │
│ FILTER TABS (Category Filter)            │
│ All | AI & Automation | Digital Transf... │
│                                          │
│    ↓ 32px ↓                              │
│                                          │
│ ARTICLE GRID (3 columns)                 │
│ ┌────┐  ┌────┐  ┌────┐                   │
│ │Art │  │Art │  │Art │                   │
│ │ 2  │  │ 3  │  │ 4  │                   │
│ └────┘  └────┘  └────┘                   │
│                                          │
│ [Load More] button (centered)            │
│                                          │
└──────────────────────────────────────────┘

Background: Warm gray
Padding: 96px
```

### Component Specifications

**Featured Article Card**
```
Element: .featured-article
Display: grid
Grid-template-columns: 1fr 1.2fr (image : content)
Gap: 32px
Background: white
Padding: 0 (image extends to edge on desktop)
Border-radius: 12px
Overflow: hidden
Box-shadow: var(--shadow-md)

Featured Image:
- Width: Auto
- Height: 400px (object-fit: cover)
- Object-fit: cover

Content Area:
- Padding: 40px
- Display: flex
- Flex-direction: column

Category Badge:
- Font: 12px, 600 weight
- Color: var(--color-primary)
- Uppercase
- Margin-bottom: 12px

Title:
- Font: 20px, 700 weight
- Color: text-primary
- Line-height: 1.3
- Margin-bottom: 16px

Excerpt:
- Font: 14px, 400 weight
- Color: text-secondary
- Line-height: 1.6
- Margin-bottom: 24px
- Flex: 1 (grows)

Read More Link:
- Font: 14px, 600 weight
- Color: var(--color-primary)
- Text-decoration: none
- With arrow: "Read More →"
- Hover: Underline + color shift
```

**Article Card (Grid)**
```
Element: .article-card
Display: flex
Flex-direction: column
Background: white
Border: 1px solid var(--color-border)
Border-radius: 8px
Overflow: hidden
Transition: all 200ms ease-out
Height: 100% (equal height)

Hover State (Desktop):
- Border-color: var(--color-primary)
- Box-shadow: var(--shadow-lg)
- Transform: translateY(-4px)

Image:
- Width: 100%
- Height: 200px
- Object-fit: cover

Content (Padding: 24px):
- Flex: 1

Category:
- Font: 11px, 600 weight
- Color: var(--color-primary)
- Uppercase
- Margin-bottom: 8px

Title:
- Font: 16px, 700 weight
- Color: text-primary
- Line-height: 1.3
- Margin-bottom: 12px

Excerpt:
- Font: 13px, 400 weight
- Color: text-secondary
- Line-height: 1.5
- Margin-bottom: auto

Read More:
- Font: 12px, 600 weight
- Color: var(--color-primary)
- Margin-top: 16px
- Text-decoration: none
```

**Filter Tabs**
```
Element: .filter-tabs
Display: flex
Justify-content: center
Gap: 16px
Margin: 48px 0
Flex-wrap: wrap

Tab Button:
- Padding: 8px 16px
- Border: 1px solid var(--color-border)
- Background: white
- Border-radius: 20px (pill shape)
- Font: 14px, 600 weight
- Color: text-primary
- Cursor: pointer
- Transition: all 200ms ease-out

Active Tab:
- Background: var(--color-primary)
- Color: white
- Border-color: var(--color-primary)

Hover (Inactive):
- Border-color: var(--color-primary)
- Background: var(--color-blue-light)
```

### Interaction Patterns

**On Scroll:**
- Featured article fades in + slideUp (500ms)
- Article grid items fade in + scale (300ms, staggered 100ms)

**Filter Tabs:**
- Click to filter articles
- Animate opacity change (200ms)
- New articles fade in

**Hover (Desktop):**
- Article cards lift + shadow increases
- Category text color intensifies
- All transitions: 200ms ease-out

**Load More:**
- Button centered
- "Load More Articles"
- Style: Primary button
- On click: Load more items with animation

---

## 10 — DISCOVERY SESSION CTA

### Layout Specs

**Full-Page Modal (Overlay) OR Dedicated Page**

```
┌────────────────────────────────────────────────┐
│ MODAL/PAGE BACKGROUND                          │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │                                          │  │
│  │         HEADLINE (32px, centered)        │  │
│  │  "Ready to rethink how your business    │  │
│  │   works?"                                │  │
│  │                                          │  │
│  │         ↓ 16px ↓                         │  │
│  │                                          │  │
│  │      SUBHEADING (16px, centered)         │  │
│  │   "Let's start with a conversation."     │  │
│  │                                          │  │
│  │         ↓ 48px ↓                         │  │
│  │                                          │  │
│  │  FORM INTRO (14px, text-secondary)       │  │
│  │  "Tell us about yourself and..."         │  │
│  │                                          │  │
│  │         ↓ 32px ↓                         │  │
│  │                                          │  │
│  │  ┌────────────────────────────────────┐  │  │
│  │  │ FORM                               │  │  │
│  │  │                                    │  │  │
│  │  │ Your Name                          │  │  │
│  │  │ [Input field] (44px height)        │  │  │
│  │  │                                    │  │  │
│  │  │ Company Name                       │  │  │
│  │  │ [Input field]                      │  │  │
│  │  │                                    │  │  │
│  │  │ Email Address                      │  │  │
│  │  │ [Input field]                      │  │  │
│  │  │                                    │  │  │
│  │  │ Phone (Optional)                   │  │  │
│  │  │ [Input field]                      │  │  │
│  │  │                                    │  │  │
│  │  │ Your Challenge                     │  │  │
│  │  │ [Textarea - 120px height]          │  │  │
│  │  │                                    │  │  │
│  │  │ Preferred Time                     │  │  │
│  │  │ [Dropdown / Radio buttons]         │  │  │
│  │  │                                    │  │  │
│  │  │     [Book Discovery Session]       │  │  │
│  │  │     (Primary button, full width)   │  │  │
│  │  │                                    │  │  │
│  │  │   Privacy: We take privacy... [Link]│  │  │
│  │  │                                    │  │  │
│  │  └────────────────────────────────────┘  │  │
│  │                                          │  │
│  │  [Close button X] (top right, modal)     │  │
│  │                                          │  │
│  └──────────────────────────────────────────┘  │
│                                                │
└────────────────────────────────────────────────┘

Modal:
- Width: 600px (desktop), 90% (tablet), 95% (mobile)
- Background: white
- Border-radius: 12px
- Box-shadow: var(--shadow-xl)
- Padding: 48px

Modal Backdrop:
- Background: rgba(0, 0, 0, 0.5)
- Backdrop-filter: blur(4px)
- Smooth fade-in (300ms)
```

### Component Specifications

**Form Structure**
```
Element: .discovery-form
Display: flex
Flex-direction: column
Gap: 24px

Form Title:
- Font: 32px, 700 weight (desktop) / 24px (mobile)
- Color: text-primary
- Text-align: center
- Line-height: 1.2
- Margin-bottom: 16px

Form Subheading:
- Font: 16px, 400 weight
- Color: text-secondary
- Text-align: center
- Margin-bottom: 48px

Form Intro:
- Font: 14px, 400 weight
- Color: text-secondary
- Margin-bottom: 0

Form Field:
- Display: flex
- Flex-direction: column
- Gap: 8px

Label:
- Font: 14px, 600 weight
- Color: text-primary

Input / Textarea:
- Font: 14px, 400 weight
- Padding: 12px 16px
- Border: 1px solid var(--color-border)
- Border-radius: 8px
- Height: 44px (input) / 120px (textarea)
- Background: white
- Transition: border-color 200ms ease-out

Input Focus:
- Border: 2px solid var(--color-primary)
- Box-shadow: var(--shadow-focus)
- Outline: none

Placeholder:
- Color: var(--color-graphite)
- Font-style: italic
```

**Submit Button**
```
Element: button[type="submit"]
Width: 100%
Height: 44px
Padding: 12px 24px
Background: var(--color-primary)
Color: white
Border: none
Border-radius: 8px
Font: 16px, 600 weight
Cursor: pointer
Transition: all 200ms ease-out
Margin-top: 16px

Hover:
- Background: #1d4ed8 (darker)
- Box-shadow: var(--shadow-md)

Active:
- Background: #1e40af (even darker)

Disabled:
- Background: var(--color-graphite)
- Cursor: not-allowed
- Opacity: 0.6
```

**Privacy Footer**
```
Element: .form-privacy
Font: 12px, 400 weight
Color: text-secondary
Text-align: center
Margin-top: 24px
Line-height: 1.6

Format: "We take privacy seriously. 
[Your information is only used...] 
[Link to privacy policy]"
```

### Interaction Patterns

**Modal Open:**
- Backdrop fades in (300ms)
- Modal scales up (300ms, from 0.9 to 1)
- Form fields have staggered fadeIn (100ms between)
- Focus on first input field (auto-focus)

**Form Submission:**
- Button shows loading state ("Sending...")
- Disabled during submission
- On success: 
  - Modal closes (fade out 300ms)
  - Success message appears (toast or page update)
  - Form resets
- On error:
  - Error message displays inline
  - Fields highlight in error color
  - Focus returns to first error field

**Form Validation:**
- Real-time validation (on blur)
- Email format validation
- Required field indicators (*)
- Error messages below fields (red text)

**Mobile Adjustments:**
- Modal takes 95% width with 12px margin
- No backdrop blur (performance)
- Keyboard appears/disappears smoothly
- Bottom margin for keyboard space

---

## 11 — NAVIGATION & FOOTER

### Navigation Bar

**Desktop Layout:**
```
┌────────────────────────────────────────┐
│  Logo  |  Home  Work  Insights  Book   │
│        |  (Right-aligned nav)          │
└────────────────────────────────────────┘

Height: 64px
Background: white
Border-bottom: 1px solid var(--color-border)
Padding: 0 60px
Display: flex
Justify-content: space-between
Align-items: center
Position: sticky (top: 0, z-index: 100)
Transition: all 200ms ease-out

Logo:
- Font: 18px, 700 weight
- Color: text-primary
- Letter-spacing: 0.05em
- "MARCUZ"

Nav Links:
- Font: 14px, 500 weight
- Color: text-secondary
- Hover: Color becomes primary
- Gap: 32px
- List: Flex layout

Book Button:
- Style: Button primary
- Text: "Book Discovery"
- Padding: 12px 24px
- Margin-left: 32px
```

**Mobile Navigation:**
```
Hamburger menu (≡ icon)
- 32×32 px
- Color: text-primary
- Cursor: pointer

Mobile Menu (Overlay):
- Full-screen
- Slides in from top
- Backdrop blur
- Stack: Logo, Nav links, Book button
- Padding: 40px 24px
- Nav links: Full width buttons
```

### Footer

**Layout Specs:**
```
┌──────────────────────────────────────────────────┐
│                                                  │
│  FOOTER CONTENT (4 columns)                      │
│                                                  │
│  ┌─────────┬─────────┬─────────┬──────────┐     │
│  │ About   │ Services│ Learn   │ Connect  │     │
│  │         │         │         │          │     │
│  │ Marcuz  │ Digital │ Blog    │ Email:   │     │
│  │         │ Transform         │          │     │
│  │ Helping │         │ AI &    │ [email]  │     │
│  │ orgs... │ Workflow│ Autom   │          │     │
│  │         │ Design  │         │ Phone:   │     │
│  │         │         │ Digital │ [phone]  │     │
│  │         │ AI &    │ Transf  │          │     │
│  │         │ Autom   │         │ [Social] │     │
│  │         │         │ Industry│          │     │
│  │         │ Systems │ Insights│          │     │
│  │         │ Integr  │         │          │     │
│  │         │         │Subscribe          │     │
│  │         │         │ to updates       │     │
│  └─────────┴─────────┴─────────┴──────────┘     │
│                                                  │
│     ↓ 48px whitespace ↓                          │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ Copyright © 2026 Marcuz. All rights       │ │
│  │ reserved.                                 │ │
│  │ [Link: Privacy] [Link: Terms]             │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Background: Graphite (dark)                    │
│  Padding: 64px                                  │
│  Text-align: left (except centered footer)      │
│                                                  │
└──────────────────────────────────────────────────┘

Columns: 4 (desktop), 2 (tablet), 1 (mobile)
Gap: 48px
```

**Footer Components:**
```
Column Headline (14px, 700 weight, white)
Column Links (14px, 400 weight, light gray)
Column Links Hover: Color becomes white

Copyright Text (12px, light gray, centered)
Links: Inline with vertical separator (|)

Color Scheme:
- Background: #1A1A1A (var(--color-black-soft))
- Text: #F5F5F5 (light)
- Links: Lighter gray, hover → white
- Divider: 30% opacity
```

---

## 🎬 ANIMATION LIBRARY

### Standard Animations

**Fade In**
```
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
Duration: 300ms
Easing: ease-out
```

**Slide Up**
```
@keyframes slideUp {
  from { transform: translateY(16px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
Duration: 300ms
Easing: ease-out
```

**Slide Down**
```
@keyframes slideDown {
  from { transform: translateY(-12px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
Duration: 300ms
Easing: ease-out
```

**Scale In**
```
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
Duration: 300ms
Easing: ease-out
```

**Pulse (For CTAs)**
```
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
Duration: 2s
Iteration: infinite
```

### Reduced Motion Support
```
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

---

## ✅ HIFI CHECKLIST

- [x] Responsive grid system (desktop/tablet/mobile)
- [x] All 10 sections with detailed layouts
- [x] Component specifications
- [x] Interaction patterns
- [x] Animation library
- [x] Accessibility considerations
- [x] Color tokens applied
- [x] Typography system applied
- [x] Spacing system applied
- [x] Touch targets (44px minimum)
- [x] Focus states defined
- [x] Hover states (desktop only)
- [x] Mobile optimization
- [x] Performance considerations

**Status**: Ready for development in Next.js
