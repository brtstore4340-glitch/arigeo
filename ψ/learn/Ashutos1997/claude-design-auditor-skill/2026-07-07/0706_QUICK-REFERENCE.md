# Design Auditor — Quick Reference Guide

## What It Does

**Design Auditor** is a Claude skill that validates designs against 19 professional design categories, providing scored audits with actionable fixes. It works with Figma files, code (HTML/CSS/React/Vue), screenshots, wireframes, and live URLs. Outputs include severity-ranked issues, before/after code diffs, developer handoff reports, and ethical/accessibility/usability scores. Supports English and Korean.

---

## Installation

### Method 1: From Releases (Easiest)
1. Go to [GitHub Releases](https://github.com/Ashutos1997/claude-design-auditor-skill/releases)
2. Download the latest `design-auditor.skill` file
3. Visit [Claude.ai](https://claude.ai) → **Customize** → **Skills**
4. Click **Upload skill** and select the `.skill` file
5. Done — skill is now active

### Method 2: Manual Upload
- Clone the repository: `git clone https://github.com/Ashutos1997/claude-design-auditor-skill.git`
- Package the `SKILL.md` and `references/` folder as a `.skill` archive
- Upload to Claude as above

### Compatibility
- Works on **Claude (claude.ai)**, Manus, and agents supporting SKILL.md format
- Requires Figma MCP for Figma file audits (optional — code/screenshot audits work without it)

---

## Key Features

1. **19-Category Audit Framework** — Typography, color/contrast, spacing/layout, visual hierarchy, consistency, accessibility (WCAG), forms/inputs, motion/animation, dark mode, responsive design, loading/error states, microcopy, i18n/RTL, elevation/shadows, iconography, navigation, design tokens, ethical design & dark patterns, Nielsen's 10 heuristics

2. **Multi-Input Support** — Figma links (via MCP), live URLs, GitHub repos/files, code (HTML/CSS/React/Vue), screenshots, wireframes, written descriptions

3. **Intelligent Scoring** — Overall score (0–100), plus breakdowns: Accessibility Score, Ethics Score, Usability Score; severity tiers (🚫 Blocker, 🔴 Critical, 🟡 Warning, 🟢 Tip)

4. **Code Superpowers** — Framework detection (MUI, Chakra, shadcn/ui, Ant Design, Radix, Bootstrap); color blindness risk annotation; SVG accessibility checks; Auto Layout detection; before/after code diffs

5. **Interactive Widgets** — Type Scale Stack, Contrast Checker, 8pt Grid Visualizer, States Coverage Map, Issue Priority Matrix; all bidirectional

6. **Design System Detection** — Auto-identifies framework conventions and system-specific fixes (e.g., MUI token patterns vs. Chakra)

7. **Figma MCP Integration** — Direct Figma file audit; Code Connect mapping; design system rules generation; safe editing with rollback support

8. **Developer Handoff Report** — CSS spec table, accessibility checklist, critical fixes, Code Connect mapping, dev-ready format

9. **Wireframe-to-Spec Mode** — Converts wireframes into annotated specs with layout, spacing, typography, components, copy placeholders, interaction notes

10. **Ethical Design Audit** — 22 dark patterns across 6 groups (deceptive interface, coercive flows, consent, false urgency, emotional manipulation, regulatory compliance baseline)

---

## Usage Examples

### Example 1: Audit a Figma Design
```
"Check my design"
→ Paste Figma link
→ Skill prompts: Full / Quick / Custom scope
→ Outputs: Overall score, per-category breakdown, issue severity matrix, developer handoff
```

### Example 2: Accessibility-Focused Code Review
```
"Is this accessible? Here's my React form:"
[Paste React component]
→ Skill auto-detects React, runs Cat 6/7/16 focus
→ Outputs: WCAG compliance score, color contrast fails, keyboard navigation gaps, label audit
```

### Example 3: Ethical Design Check
```
"Are there any dark patterns here?"
[Upload screenshot of pricing page]
→ Skill runs Cat 18 (Ethics) deep dive
→ Outputs: Ethics Score, dark pattern flags (confirmshaming, decoy pricing, false urgency), regulatory compliance baseline
```

### Example 4: Wireframe to Dev Spec
```
"Wireframe to spec" + [upload wireframe]
→ Skill detects greyscale/box fidelity
→ Offers Spec mode before audit
→ Outputs: Layout & dimensions, spacing, typography (with defaults), components required, interaction notes, open questions
```

### Example 5: Live URL Audit
```
"Check this website: https://example.com"
→ Skill fetches via web_fetch, treats as code input
→ Sets confidence 🟡 Medium (non-rendered states not assessed)
→ Outputs: Overall audit + multi-page offer
```

---

## Configuration & Customization

### Audit Scope Selection
Users can choose three levels:
- **Full** — All 19 categories (30–40 minutes)
- **Quick** — Priority categories only (10–15 minutes, typically Cat 1–10)
- **Custom** — Select specific categories

### Language
- Auto-detects language from user message
- Responds entirely in detected language (English or Korean)
- Full Korean terminology support for all categories and output templates

### Confidence Levels
Reports include confidence badges:
- 🟢 **High** — Figma file or code inspection
- 🟡 **Medium** — Live URL, screenshot, or partial data
- 🔴 **Low** — Description-only input (rare; skill requests visuals)

### Figma MCP Options
- `get_design_context()` — Retrieve page structure and frame info
- `get_design_pages()` — List all pages in file (mandatory first step)
- `get_code_connect_suggestions()` — AI-suggested component mappings
- `create_design_system_rules()` — Generate enforcement rules (requires confirmation)

### Output Formats
Users can request:
- **Scored Audit Report** (default) — structured with issues ranked by severity
- **Developer Handoff Report** — CSS specs, a11y checklist, critical fixes, handoff format
- **Wireframe Spec** — annotated dev-ready spec
- **Markdown Export** — ready for Notion, Linear, Jira
- **Canva Visual Report** — stakeholder-friendly score cards

---

## API Highlights

### Main Audit Function Flow
```
1. Language Detection & Beginner Check
   → Detect language, gauge user experience level
   
2. Input Gathering (Figma MCP / URL / Code / Screenshot)
   → get_design_pages() (Figma only)
   → web_fetch() (URLs only)
   → Framework detection (code only)
   
3. Scope & Stage Selection
   → Full / Quick / Custom audit scope
   
4. Run 19-Category Audit
   → Per-category scoring function
   → Issue deduplication
   → Severity ranking (Blocker > Critical > Warning > Tip)
   
5. Generate Report
   → Scoring formula always shown
   → Per-category score + mini bar chart
   → Overall score + confidence level
   → Before/after diffs (code input)
   → Interactive widgets (Contrast, Grid, Matrix, etc.)
   
6. Offer Next Steps
   → Re-audit, Explain an issue, Developer Handoff, Wireframe to Spec, Export, Fix All Loop
```

### Key Function Reference

| Function | Purpose | Returns |
|---|---|---|
| `score_category(category_id, issues)` | Calculate per-category score | Score 0–10, issue list |
| `calculate_overall_score()` | Apply scoring formula | 100 − (blockers×12) − (criticals×8) − (warnings×4) − (tips×1) |
| `detect_framework()` | Identify code framework | Framework name + version (React, Vue, etc.) |
| `detect_design_system()` | Identify design system | System name (MUI, Chakra, shadcn/ui, etc.) + system-specific fixes |
| `check_wcag_contrast()` | Validate color pair | Pass/fail + ratio + color blindness risk (Deuteranopia, Protanopia, Tritanopia) |
| `audit_figma_auto_layout()` | Detect manual positioning | Frame IDs using manual pos where Auto Layout should be |
| `get_code_connect_suggestions()` | Figma→code mappings | Component mappings + unmapped components |
| `generate_dev_handoff()` | Create handoff doc | CSS specs, a11y checklist, critical fixes, Code Connect table |
| `export_to_markdown()` | Export report | Report in Markdown format |

### Scoring Formula
```
Overall Score = 100 − (Blockers × 12) − (Criticals × 8) − (Warnings × 4) − (Tips × 1)

Accessibility Score = 100 − (Cat 2/6/7/15/16 issues × weight)
Ethics Score = 100 − (Deceptive × 15) − (Questionable × 7)
Usability Score = 100 − (Nielsen H1/H2/H3/H6/H7/H10 failures × weight)
```

### Severity Definitions
- **🚫 Blocker (−12pts)** — Legal/compliance violations (WCAG AA, GDPR, PECR). Examples: contrast < 4.5:1, keyboard inaccessible, missing alt text, pre-checked consent
- **🔴 Critical (−8pts)** — Usability failures. Examples: missing form labels, broken navigation, unreachable elements
- **🟡 Warning (−4pts)** — Experience degradation. Examples: off-grid spacing, icon-only nav without labels, poor error messages
- **🟢 Tip (−1pt)** — Polish improvements. Examples: unused component instances, inconsistent corner radius, non-aligned elements

### Reference Files (15 Categories)
Each reference file contains:
- **Detection signals** — How to identify issues in Figma and code
- **Code superpowers** — CSS/HTML patterns, framework-specific checks
- **Severity mapping** — When to flag as Blocker/Critical/Warning/Tip
- **Fix examples** — Before/after code, Figma component updates
- **Context notes** — Why each rule matters (plain-language explanations)

**File structure:**
```
references/
├── typography.md       — Font hierarchy, pairing, sizing, line height
├── color.md            — WCAG contrast formula, palette consistency, semantics
├── spacing.md          — 8-point grid, proximity, alignment, whitespace
├── corner-radius.md    — Nested radius, scale, pill shapes
├── elevation.md        — Shadow scale, hierarchy, dark mode depth
├── iconography.md      — Families, sizing, touch targets, meaning
├── navigation.md       — Tabs, breadcrumbs, back buttons, mobile nav
├── tokens.md           — Design tokens, semantic naming, dark mode swapping
├── figma-mcp.md        — MCP workflow, Code Connect, safe editing
├── heuristics.md       — Nielsen's 10 Usability Heuristics (H1–H10)
├── states.md           — Loading, empty, error, success states
├── microcopy.md        — Button labels, error messages, tone, per-role audit
├── animation.md        — Easing, duration, reduced motion support
├── i18n.md             — RTL support, locale formatting, font support
└── ethics.md           — 22 dark patterns, ethical design, compliance baseline
```

---

## Common Workflows

### For Developers
1. Upload screenshot or paste code
2. Run **Quick scope** for priority issues
3. Request **Developer Handoff Report** with CSS specs + a11y checklist
4. Fix Critical issues first, then Warnings

### For Designers
1. Share Figma link (requires Figma MCP)
2. Run **Full scope** or **Custom** (focus on Cat 1–5, 9, 14)
3. Get **before/after Figma fixes** for top issues
4. Export **Markdown Report** for team review

### For Product/Founders
1. Share live URL or screenshot
2. Run **Ethics audit** (Cat 18: dark patterns) + **Accessibility** (Cat 6/7)
3. Request **Canva Visual Report** for stakeholder sharing
4. Review **Regulatory Compliance Baseline** section

### For Auditors
1. Collect design artifacts (Figma + code + screenshots)
2. Run **Full scope** audit
3. Export **Markdown Report** for documentation
4. Track re-audit delta (before/after comparison across iterations)

---

## Limitations & Edge Cases

- **Figma Non-Rendered States** — Cannot see hover, focus, error states without code
- **Authenticated Pages** — Live URL audits can't access login-protected content
- **Dynamic Content** — JS-rendered content may be incomplete in URL audits
- **Wireframes Only** — Sketch/Adobe XD not supported; Figma is primary vector format
- **Large Files** — Figma files with 1000+ frames may timeout (skill offers scope reduction)
- **Partial Audits** — Some issues require cross-file consistency checks (detected per-Figma file, not multi-file)

---

## Quick Triggers (Natural Language)

### English
- "Check my design" / "Review my UI" / "Audit my layout"
- "Is this accessible?" / "WCAG check" / "A11y audit"
- "Color contrast check" / "Dark mode review"
- "Dark patterns" / "Is this GDPR compliant?" / "Is this manipulative?"
- "Pixel perfect" / "Figma audit" / "CSS check"
- "Wireframe to spec" / "Heuristic review" / "Nielsen audit"

### Korean
- "디자인 검토해줘" / "UI 검토해줘" / "접근성 확인해줘"
- "색상 대비 확인해줘" / "다크 모드 검토"
- "다크 패턴 확인" / "GDPR 준수 확인"
- "와이어프레임 스펙 출력" / "휴리스틱 검토"

---

## Resources

- **GitHub:** https://github.com/Ashutos1997/claude-design-auditor-skill
- **Releases:** [Latest .skill file](https://github.com/Ashutos1997/claude-design-auditor-skill/releases)
- **License:** MIT
- **Built with:** Claude API + Skill format by Anthropic

---

**Last Updated:** v1.2.13 (2026-07-07)  
**Language:** English & Korean  
**For:** Developers, designers, product managers, founders, auditors

