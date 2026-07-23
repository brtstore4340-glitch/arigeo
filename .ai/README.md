# ⚙️ Design Governance Layer (`.ai/`)

**Purpose**: Centralized design philosophy, tokens, and constraints for all frontend work across the MARCUZ fleet.

**Scope**: Applies to Claude Code, Codex, Gemini, Hermes, and all AI agents doing frontend/UX work.

**Enforcement**: Mandatory read before ANY frontend task. Part of agent initialization protocol.

---

## 📚 Required Reading (In Order)

### For All Frontend Work
1. **MASTER-FRONTEND-PROMPT.md** — Design philosophy (5 phases: understand → design system → UX review → implement)
2. **IMPLEMENTATION-RULES.md** — Code rules (quality, performance, accessibility)
3. **DESIGN_SYSTEM.md** — Design tokens (colors, typography, spacing, etc.)

### Project-Specific Context (Read After General)
4. **PRODUCT.md** — What is the product? Who are users? Business goals?
5. **BRAND.md** — Brand identity, colors, voice
6. **UX_GUIDELINE.md** — Interaction patterns, navigation, feedback
7. **COMPONENT_GUIDE.md** — Reusable component library
8. **ACCESSIBILITY.md** — WCAG 2.2 requirements
9. **SEO_GUIDE.md** — SEO checklist
10. **CMS_GUIDE.md** — Content management patterns
11. **MOTION_GUIDE.md** — Animation/transition language

### Project Overrides (If Available)
- **PROJECT_OVERRIDES/captain-maid.md** — Captain Maid specific overrides
- **PROJECT_OVERRIDES/arigeo.md** — Arigeo specific overrides
- **PROJECT_OVERRIDES/orry-website.md** — Orry specific overrides
- **PROJECT_OVERRIDES/marcuz-website.md** — Marcuz website specific overrides

---

## 🚀 AI Agent Workflow

```
Agent starts frontend task
  ↓
Read .ai/README.md (this file)
  ↓
Read MASTER-FRONTEND-PROMPT.md (philosophy)
  ↓
Read IMPLEMENTATION-RULES.md (code quality)
  ↓
Read DESIGN_SYSTEM.md (tokens)
  ↓
Read project-specific files (PRODUCT, BRAND, etc.)
  ↓
Read PROJECT_OVERRIDES/[project].md (if exists)
  ↓
Confirm understanding (Design Pledge)
  ↓
ONLY THEN: Begin design/implementation
```

---

## ✅ Design Pledge (Agents Must Confirm)

```
✅ [AGENT] Design Context Complete

I have read:
- MASTER-FRONTEND-PROMPT.md ✅
- IMPLEMENTATION-RULES.md ✅
- DESIGN_SYSTEM.md ✅
- PRODUCT.md ✅
- BRAND.md ✅
- [PROJECT_OVERRIDES/project.md if applicable] ✅

I understand:
- 5-phase design process (understand → design system → UX review → implement) ✅
- Design tokens and CSS variables ✅
- Accessibility requirements (WCAG 2.2) ✅
- Implementation quality rules ✅
- Project brand identity ✅

Ready to proceed with: [TASK]
```

---

## 📖 File Descriptions

| File | Purpose | Audience |
|------|---------|----------|
| **MASTER-FRONTEND-PROMPT.md** | Design thinking framework (5 phases) | All frontend agents |
| **IMPLEMENTATION-RULES.md** | Code quality, performance, accessibility rules | Developers/Codex |
| **DESIGN_SYSTEM.md** | Design tokens (colors, spacing, typography, etc.) | Designers/UX/Developers |
| **PRODUCT.md** | Product context, users, goals, competitors | All agents |
| **BRAND.md** | Brand identity, colors, typography, voice | UX/Designers |
| **UX_GUIDELINE.md** | Interaction patterns, navigation, feedback states | UX/Designers |
| **COMPONENT_GUIDE.md** | Reusable component library specs | Developers |
| **ACCESSIBILITY.md** | WCAG 2.2 requirements and checklists | All agents |
| **SEO_GUIDE.md** | SEO best practices, meta tags, structured data | Developers |
| **CMS_GUIDE.md** | Content management, frontmatter, data structures | Developers |
| **MOTION_GUIDE.md** | Animation/transition timing, easing, philosophy | Designers/Developers |
| **PROJECT_OVERRIDES/** | Project-specific brand/design overrides | Project-specific agents |

---

## 🔄 Update Process

1. **When to update `.ai/` files**:
   - Brand changes
   - New design tokens
   - New component patterns
   - Accessibility improvements
   - Performance insights

2. **Who updates**:
   - Omega (Design Director)
   - Aris (Quality Gate)
   - Project leads

3. **How to update**:
   - Modify relevant `.ai/` file
   - Commit with: `docs: Update .ai/[file] — [reason]`
   - Notify fleet via broadcast

4. **Versioning**:
   - Date stamp in file (YYYY-MM-DD)
   - Changelog at top of each file
   - Breaking changes flagged clearly

---

## 🔒 Enforcement

**Part of MANDATORY Agent Initialization Protocol** (CLAUDE.md):

- ✅ Step 0.5 (Design Context) — before Step 1 (Registry) and Step 2 (Coordination)
- ✅ Every agent doing ANY frontend work must read `.ai/` files
- ✅ Violations: Work may be reverted if design rules not followed
- ✅ Non-negotiable

---

## 👥 Ownership

- **Owner**: Omega Oracle (Design Director)
- **Reviewers**: Aris (Quality Gate), Stratum (Architecture)
- **Contributors**: All frontend agents (Claude Code, Codex, Hermes, Gemini)
- **Authority**: E0993599799 (Ekkarat)

---

**Last Updated**: 2026-07-21  
**Version**: 1.0  
**Status**: ACTIVE
