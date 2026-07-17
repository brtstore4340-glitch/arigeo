---
name: 1242-code-snippets
description: 
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-03
  source: fleet-memory
---

# Code Snippets — frontend-design Plugin

**Source**: anthropics/claude-plugins-official/plugins/frontend-design
**Date**: 2026-06-03 12:42

---

## SKILL.md Frontmatter

```yaml
---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality.
  Use this skill when the user asks to build web components, pages, or applications.
  Generates creative, polished code that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---
```

## Design Thinking Framework (from SKILL.md)

Before writing any code, Claude must answer these 4 questions:

```
Purpose     → What problem does this interface solve? Who uses it?
Tone        → Pick an extreme: brutally minimal | maximalist chaos |
              retro-futuristic | organic/natural | luxury/refined |
              playful/toy-like | editorial/magazine | brutalist/raw |
              art deco/geometric | soft/pastel | industrial/utilitarian
Constraints → Technical requirements (framework, performance, accessibility)
Differentiation → What makes this UNFORGETTABLE?
```

## 5 Aesthetic Pillars

```
1. TYPOGRAPHY
   ✓ Pair distinctive display font + refined body font
   ✗ Never: Arial, Inter, Roboto, system fonts

2. COLOR & THEME
   ✓ CSS variables, dominant color + sharp accent
   ✗ Never: purple gradients on white, timid palettes

3. MOTION
   ✓ CSS-only for HTML, Motion library for React
   ✓ One well-orchestrated page load > scattered micro-interactions
   ✓ Staggered reveals via animation-delay

4. SPATIAL COMPOSITION
   ✓ Asymmetry, overlap, diagonal flow, grid-breaking, generous negative space
   ✗ Never: predictable grid layouts

5. BACKGROUNDS & VISUAL DETAILS
   ✓ Gradient meshes, noise textures, geometric patterns,
     layered transparencies, dramatic shadows, grain overlays
   ✗ Never: solid color backgrounds
```

## Usage Examples (from README)

```
"Create a dashboard for a music streaming app"
"Build a landing page for an AI security startup"
"Design a settings panel with dark mode"
```

## Anti-Pattern Blacklist

```
Fonts to NEVER use:   Inter, Roboto, Arial, Space Grotesk, system fonts
Color to NEVER use:   purple gradient on white background
Layouts to NEVER use: predictable/cookie-cutter component patterns
```
