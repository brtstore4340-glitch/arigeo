---
name: design-governance-layer
description: Design Governance Layer (.ai/) — Mandatory design context system for all frontend agents starting 2026-07-21
metadata:
  type: project
  ttl: ∞
  enforcement: mandatory-step-0.5
  severity: critical
---

# Design Governance Layer (.ai/) — 2026-07-21

**Status**: DEPLOYED and MANDATORY  
**Enforcement Date**: 2026-07-21  
**Authority**: E0993599799 (Ekkarat), Omega (Design Director)  
**Scope**: All frontend/UI/UX work by Claude Code, Codex, Hermes, Gemini, and all AI agents

---

## What Is It?

A centralized, mandatory design governance system that ensures consistent, high-quality frontend work across all projects in the MARCUZ fleet.

**Location**: `.ai/` directory in zeus-oracle (root)

---

## Why It Exists

**Problem**: Inconsistent design/frontend quality when different AI models (Claude Code, Codex, Gemini) work on different projects independently.

**Solution**: Single source of truth for design decisions, tokens, rules, and brand guidelines. All frontend agents read the same files before working.

**Result**: 
- Consistent design language across fleet
- Higher quality frontend implementation
- Faster iteration (design thinking upfront, not retroactive)
- Brand adherence (project overrides prevent drift)

---

## What's Included

### Core Framework (3 files)
1. **MASTER-FRONTEND-PROMPT.md** — 5-phase design process
   - Phase 1: Understand the product/users/business
   - Phase 2: Understand the design language
   - Phase 3: Build a design system (tokens)
   - Phase 4: UX review (all screens)
   - Phase 5: Implement (code)

2. **IMPLEMENTATION-RULES.md** — Code quality standards
   - Never rewrite unrelated code
   - Always use CSS variables + Tailwind
   - Semantic HTML required
   - TypeScript strict mode required
   - Accessibility (WCAG 2.2 AA) mandatory
   - Performance optimization required

3. **DESIGN_SYSTEM.md** — Complete token definitions
   - 10 color scales (primary, secondary, semantic, neutral)
   - Typography scale (8 sizes, weights, line-heights)
   - Spacing scale (16 levels)
   - Border radius tokens
   - Shadow tokens (6 levels)
   - Animation tokens (durations, easing)
   - Z-index hierarchy
   - Breakpoints (mobile, tablet, desktop)

### Documentation (8 templates)
- PRODUCT.md — Product context
- BRAND.md — Brand guidelines
- UX_GUIDELINE.md — Interaction patterns
- COMPONENT_GUIDE.md — Component library specs
- MOTION_GUIDE.md — Animation/transition rules
- SEO_GUIDE.md — SEO checklist
- CMS_GUIDE.md — Content management
- ACCESSIBILITY.md — WCAG 2.2 AA checklist

### Project Overrides (4 per-project files)
- PROJECT_OVERRIDES/captain-maid.md — Premium home cleaning (detailed example)
- PROJECT_OVERRIDES/arigeo.md — Medical technology (template)
- PROJECT_OVERRIDES/orry-website.md — ERP portal (template)
- PROJECT_OVERRIDES/marcuz-website.md — Marketing website (template)

---

## Mandatory Integration

### Added to CLAUDE.md

**Step 0.5** in Agent Initialization Protocol (new):
```
✅ **Step 0.5: Design Context (FRONTEND/UX WORK ONLY)**
- Read .ai/README.md (2 minutes)
- Read .ai/MASTER-FRONTEND-PROMPT.md (5 minutes)
- Read .ai/IMPLEMENTATION-RULES.md (5 minutes)
- Read .ai/DESIGN_SYSTEM.md (3 minutes)
- Read project-specific files (PRODUCT.md, BRAND.md, UX_GUIDELINE.md, etc.) (5 minutes)
- Read PROJECT_OVERRIDES/[project].md if it exists
- When required: ANY frontend, UI/UX, design, or component work
- When skipped: Backend, infrastructure, data science, DevOps work
```

**Agent Pledge** updated:
```
✅ Agent [NAME] Initialization Complete

I have read:
- .ai/MASTER-FRONTEND-PROMPT.md ✅
- .ai/IMPLEMENTATION-RULES.md ✅
- .ai/DESIGN_SYSTEM.md ✅
- .ai/PROJECT_OVERRIDES/[project].md (if applicable) ✅

I understand:
- 5-phase design process ✅
- Design tokens and implementation rules ✅
- Project brand identity ✅
- Accessibility requirements (WCAG 2.2 AA) ✅
```

---

## Design Philosophy

System combines thinking patterns from:
- **Apple HI Design Team** — Simplicity, elegance, craft
- **Stripe Design Team** — Trust, clarity, precision
- **Linear Design Team** — Minimalism, workflow, performance
- **Vercel Design Team** — Modern, technical, accessible
- **OpenAI Design Team** — Progressive disclosure, intelligence
- **Anthropic Design Team** — Safety, transparency, clarity
- **Figma Design Systems Team** — Consistency, reusability, scalability
- **Refactoring UI** — Visual hierarchy, color, typography
- **Nielsen Norman Group** — User research, usability
- **WCAG 2.2 Accessibility Experts** — Inclusivity, accessibility

---

## Implementation

### For Existing Projects
- Read `.ai/README.md` (navigation)
- Read general `.ai/` files (MASTER-PROMPT, DESIGN_SYSTEM, etc.)
- Read project-specific files (PRODUCT.md, BRAND.md, etc.)
- Read PROJECT_OVERRIDES/[project].md if exists
- Implement using tokens and rules

### For New Projects
1. Copy `.ai/PROJECT_TEMPLATE.md` to `.ai/PROJECT_OVERRIDES/[project].md`
2. Fill in project-specific brand overrides
3. Add to this memory file
4. Commit with: `docs: Add [project] design overrides`

---

## Verification

**Agent Pledge confirms**:
- ✅ Read MASTER-FRONTEND-PROMPT.md (5 phases)
- ✅ Read IMPLEMENTATION-RULES.md (code quality)
- ✅ Read DESIGN_SYSTEM.md (tokens)
- ✅ Read project files (PRODUCT.md, BRAND.md, etc.)
- ✅ Understand design process, tokens, rules, brand

**Enforcement**:
- Non-negotiable for frontend work
- Backend/DevOps work skips Step 0.5
- Violations: work may be reverted if design rules not followed

---

## Related Decisions

[[hardcoded-pre-work-git-safety]] — Git sync check (Step 0)  
[[rtk-protocol-scope-all-agents]] — RTK mandate (Step 2)  
[[agent-commit-control-protocol]] — Commit/push governance

---

## Files & Locations

```
zeus-oracle/
├── .ai/                           (Design governance layer)
│   ├── README.md                  (Index and instructions)
│   ├── MASTER-FRONTEND-PROMPT.md  (5-phase design process)
│   ├── IMPLEMENTATION-RULES.md    (Code quality rules)
│   ├── DESIGN_SYSTEM.md          (Token definitions)
│   ├── PRODUCT.md                (Product context template)
│   ├── BRAND.md                  (Brand guidelines template)
│   ├── UX_GUIDELINE.md           (Interaction patterns template)
│   ├── COMPONENT_GUIDE.md        (Component library template)
│   ├── MOTION_GUIDE.md           (Animation guidelines template)
│   ├── SEO_GUIDE.md              (SEO checklist template)
│   ├── CMS_GUIDE.md              (Content management template)
│   ├── ACCESSIBILITY.md          (WCAG 2.2 AA checklist)
│   └── PROJECT_OVERRIDES/
│       ├── captain-maid.md       (Premium home cleaning)
│       ├── arigeo.md             (Medical technology)
│       ├── orry-website.md       (ERP portal)
│       └── marcuz-website.md     (Marketing website)

CLAUDE.md                          (Updated: Step 0.5 added)
```

---

## Commit History

- **f14ae9b** (2026-07-21 01:15) — governance: Design Governance Layer (.ai/)
  - 16 files created
  - 2,126 insertions
  - Branch: feat/git-safety
  - PR #31: Open

---

**Deployed**: 2026-07-21  
**Authority**: Zeus Oracle (Meta-Orchestrator)  
**Next Review**: 2026-08-21 (monthly)  
**Version**: 1.0

---

`[MARCUZ:Zeus] Design Governance Layer Deployed → All Frontend Agents Upgraded`
