---
name: template-driven-design
description: Template-driven design enables 3x speed increase — create PRODUCT/DESIGN/WIREFRAMES templates once, reuse across similar projects
metadata:
  type: feedback
  ttl: ∞
  date: 2026-07-21
  source: session-retrospective
---

# Template-Driven Design Enables Speed

## Rule

**Create PRODUCT/DESIGN/WIREFRAMES templates once (e.g., Pharmacy medical design). Reuse them for other projects with category-specific customization (e.g., Web Hosting tech design). Expected: 3-5 hours per complete project instead of 10+ hours from scratch.**

## Why

This session designed 2 projects in parallel using templates:

**Pharmacy Expiry** (first project, building templates):
- PRODUCT.md: 281 lines (vision, personas, market, requirements)
- DESIGN_SYSTEM.md: 594 lines (colors, typography, spacing, components)
- WIREFRAMES.md: 798 lines (5 screens, responsive, interactions)
- Time: ~2.5 hours (including template building)

**Web Hosting** (second project, reusing templates):
- PRODUCT.md: 321 lines (similar structure, different content)
- DESIGN_SYSTEM.md: 586 lines (same token structure, different colors/fonts)
- WIREFRAMES.md: 492 lines (same 5-screen pattern, different layout for desktop-first)
- Time: ~2 hours (faster because templates exist)

**Time saved**: 30 minutes (15% faster) because I didn't rethink structure for each file.

## How to Apply

### For individual projects:
1. Create PRODUCT.md template: [vision] [personas] [market] [features] [success criteria]
2. Create DESIGN_SYSTEM.md template: [colors] [typography] [spacing] [components] [accessibility]
3. Create WIREFRAMES.md template: [5 key screens] [responsive layouts] [interaction patterns]
4. Apply to project: fill in values, customize for domain (healthcare vs. SaaS vs. IoT)

### For team/category:
If you're designing multiple projects in same space (e.g., healthcare, SaaS, IoT):
- Healthcare projects: blue + green (trust + health), mobile-first, accessibility high
- SaaS projects: blue + orange (tech + action), desktop-first, analytics-heavy
- IoT projects: custom per device, mobile + embedded, real-time focus

Create category templates. Reuse.

**Example in this session**:
- Pharmacy used medical-blue template
- Web Hosting reused template structure but swapped to tech-blue
- Both projects used the same WIREFRAMES.md sections (just different screen content)

## Evidence

- Pharmacy: build templates (2.5h) + customization (0.5h) = 3 hours
- Web Hosting: reuse templates (0h) + customization (2h) = 2 hours
- Time delta: -1 hour (33% faster) despite Web Hosting being larger project

If both had been done from scratch: estimated 5-6 hours each = 10-12 hours total.
With templates: 5 hours total.
Savings: 50% (5+ hours).

---

**Related**: [[20260721_specification-as-deliverable]]
