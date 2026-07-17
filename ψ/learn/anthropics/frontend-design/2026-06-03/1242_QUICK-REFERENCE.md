---
name: 1242-quick-reference
description: 
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-03
  source: fleet-memory
---

# Quick Reference — frontend-design Plugin

**Source**: anthropics/claude-plugins-official/plugins/frontend-design
**Date**: 2026-06-03 12:42

---

## What It Does

Official Anthropic plugin that makes Claude generate **distinctive, production-grade** frontend interfaces — actively avoiding "AI slop" aesthetics (generic fonts, purple gradients, predictable layouts).

## Install

```bash
# Via Claude Code plugin system
# Add to .claude/plugins/ or install from Claude Plugin Hub
```

## Key Principle

> "Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work — the key is **intentionality**, not intensity."

## Quick Design Cheat Sheet

| Category | Do | Don't |
|----------|-----|-------|
| Fonts | Distinctive display + refined body pair | Inter, Roboto, Arial, Space Grotesk |
| Colors | Dominant + sharp accent, CSS vars | Purple gradient on white |
| Motion | One orchestrated load animation | Scattered micro-interactions everywhere |
| Layout | Asymmetry, overlap, diagonal flow | Predictable grid patterns |
| BG | Textures, meshes, grain overlays | Solid colors |

## Aesthetic Directions Available

```
brutally minimal    │ maximalist chaos    │ retro-futuristic
organic/natural     │ luxury/refined      │ playful/toy-like
editorial/magazine  │ brutalist/raw       │ art deco/geometric
soft/pastel         │ industrial/utilitarian
```

## Implementation Stack Support

- HTML / CSS / JS (pure)
- React (with Motion library for animations)
- Vue

## Learn More

[Frontend Aesthetics Cookbook](https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb) — detailed prompting guide by Anthropic.

## Key Insight for orry-serenity / ERP

When building ERP UI (dashboard, forms, tables):
- Don't default to shadcn defaults — pick a clear aesthetic direction first
- `luxury/refined` or `editorial/magazine` suits B2B Thai ERP well
- Use distinctive Thai-compatible fonts (e.g., Sarabun for body, distinctive display for headers)
- One well-orchestrated page load animation > motion everywhere
