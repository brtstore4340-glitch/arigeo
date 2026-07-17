---
name: 0706-architecture
description: **Repository:** https://github.com/Ashutos1997/claude-design-auditor-skill
metadata:
  type: handoff
  ttl: ∞
  date: 2026-07-07
  source: fleet-memory
---

# Claude Design Auditor Skill — Architecture Documentation

**Version:** 1.2.13  
**Created:** 2026-07-07  
**Repository:** https://github.com/Ashutos1997/claude-design-auditor-skill

---

## Table of Contents

1. [Directory Structure](#directory-structure)
2. [Entry Points](#entry-points)
3. [Core Abstractions](#core-abstractions)
4. [Dependencies & Tool Calls](#dependencies--tool-calls)
5. [Design Patterns](#design-patterns)
6. [Data Flows](#data-flows)
7. [Scoring & Deduction Model](#scoring--deduction-model)
8. [Extensibility Points](#extensibility-points)

---

## Directory Structure

```
claude-design-auditor-skill/
├── SKILL.md                              # Main skill definition (2,770 lines)
│                                         # - 19 audit categories
│                                         # - 5 workflow steps (0-4)
│                                         # - Figma MCP integration
│                                         # - Scoring & reporting templates
│
├── README.md                             # User-facing overview & changelog (v1.2.13)
├── README_KR.md                          # Korean version of README
│
└── references/                           # Supporting documentation (7 files)
    ├── typography.md                     # Cat 1: Font hierarchy, type scale, line height rules
    ├── color.md                          # Cat 2: WCAG contrast, luminance formula, color blindness
    ├── spacing.md                        # Cat 3: 8pt grid, layout, z-index, margin rules
    ├── corner-radius.md                  # Cat 5: Radius scale, nested radius rule, pill shapes
    ├── elevation.md                      # Cat 14: Shadow scale, elevation hierarchy
    ├── iconography.md                    # Cat 15: Icon families, touch targets, SVG a11y
    ├── navigation.md                     # Cat 16: Tabs, breadcrumbs, mobile nav patterns
    ├── tokens.md                         # Cat 17: Design tokens, semantic naming, dark mode
    ├── figma-mcp.md                      # Figma MCP workflow details & safe editing rules
    ├── heuristics.md                     # Cat 19: Nielsen's 10 Usability Heuristics mapping
    ├── states.md                         # Cat 11: Loading, empty, error, success states
    ├── microcopy.md                      # Cat 12: Button labels, error messages, tone
    ├── animation.md                      # Cat 8: Easing curves, duration, reduced motion
    ├── i18n.md                           # Cat 13: RTL, locale formatting, text expansion
    └── ethics.md                         # Cat 18: Dark patterns, regulatory compliance
```

### File Purposes

| File | Lines | Purpose | Key Concepts |
|------|-------|---------|--------------|
| **SKILL.md** | ~2,770 | Core skill logic & workflow | 5 steps, 19 categories, Figma/code/screenshot paths |
| **README.md** | ~200 | User entry point & overview | Installation, usage examples, feature summary |
| **references/*** | ~200 each | Deep-dive category rules | Formulas, thresholds, code detection patterns |

---

## Entry Points

### 1. User Message Triggers

All entry points are natural-language based. The skill detects trigger phrases and routes to the appropriate workflow:

#### Audit Triggers (Major)
- **"check my design"** → Full audit (all 19 categories)
- **"is this accessible?"** → Accessibility-focused (Cat 2, 6, 7, 15, 16)
- **"review my form"** → Form-focused (Cat 7, Accessibility, Microcopy, States)
- **"does this follow WCAG?"** → Contrast & accessibility (Cat 2, 6)
- **"check my Figma file: [URL]"** → Figma MCP audit
- **"audit my layout"** → Spacing & layout (Cat 3, 4, 10)
- **"design review"** → Full audit
- **"any dark patterns here?"** → Ethics-focused (Cat 18)
- **"wireframe to spec"** → Wireframe-to-spec mode (Step 4)
- **"Nielsen audit"** → Usability heuristics (Cat 19)

#### Input Type Detection
User provides one of:
- **Figma URL/link** → `resolve_shortlink` + Figma MCP workflow
- **Live website URL** (https://..., *.vercel.app, *.netlify.app) → `web_fetch` + live URL path
- **GitHub URL** (file or repo) → Convert to raw URL + `web_fetch` + code path
- **CodeSandbox/StackBlitz URL** → Platform API + code path
- **Storybook URL** → Detect story path + code path
- **Screenshot/image** → Visual assessment path
- **Code (HTML/CSS/React/Vue)** → Direct code path
- **Written description only** → Ask for visuals

### 2. Figma MCP Workflow Entry (Special Case)

When Figma URL is detected:

```
F0: Check MCP Availability
  ↓
F1: resolve_shortlink (if shortlink)
  ↓
F1.5: get_design_pages (file structure)
  ↓
F2: get_design_context (layer data)
  ↓
F3: get_screenshot (visual reference)
  ↓
F3.5: get_variable_defs (token data for Cat 17 & 2)
  ↓
F3.6: get_code_connect_suggestions (optional, for Cat 5)
  ↓
F4: Run audit (Steps 1-3)
  ↓
F5: Fix loop (if user requests)
  ↓
F5.5: create_design_system_rules (optional)
```

---

## Core Abstractions

### 1. The 19 Audit Categories

Each category is a distinct rule set with its own:
- **Trigger conditions** (when to run)
- **Rule checks** (what to test)
- **Widget triggers** (visual tools offered to user)
- **Code detection patterns** (automatic checks in HTML/CSS/React)
- **Severity mapping** (Blocker/Critical/Warning/Tip per stage)

#### Category Reference Table

| # | Name | WCAG? | Figma | Code | Screenshot | Key Rules |
|---|------|-------|-------|------|------------|-----------|
| 1 | **Typography** | Yes | ✅ | ✅ | ✅ | Hierarchy, font count (≤2), size (≥14px), line-height (1.4–1.6), contrast (4.5:1) |
| 2 | **Color & Contrast** | Yes | ✅ | ✅ | ✅ | WCAG AA/AAA ratios, color-only meaning, palette consistency, color blindness risk |
| 3 | **Spacing & Layout** | Yes | ✅ | ✅ | 🟡 | 8pt grid, proximity, padding consistency, breathing room, alignment, margins |
| 4 | **Visual Hierarchy & Focus** | No | ✅ | ✅ | ✅ | Primary action clarity, reading patterns, size/contrast mapping, overchoice paradox |
| 5 | **Consistency** | No | ✅ | ✅ | 🟡 | Component reuse, icon families, corner radius scale, nested radius rule, interaction states |
| 6 | **Accessibility (WCAG)** | Yes | ✅ | ✅ | 🟡 | Touch targets (44×44px), focus states, alt text, form labels, keyboard nav, reading order |
| 7 | **Forms & Inputs** | Yes | ✅ | ✅ | 🟡 | Labels, sizing, validation timing, error placement, submit states, success confirmation |
| 8 | **Motion & Animation** | Yes | ✅ | ✅ | 🔴 | Purpose, duration, easing, reduced-motion support (prefers-reduced-motion) |
| 9 | **Dark Mode** | No | ✅ | ✅ | 🟡 | Not inverted, surface elevation, saturation, icon legibility, token swapping |
| 10 | **Responsive & Adaptive** | Yes | ✅ | ✅ | 🟡 | Breakpoints, overflow handling, touch targets, type scaling, viewport units |
| 11 | **Loading, Empty & Error States** | No | ✅ | ✅ | 🟡 | Skeletons, empty state anatomy, error levels, success confirmation, Peak-End Rule, Goal Gradient |
| 12 | **Content & Microcopy** | No | ✅ | ✅ | ✅ | Button labels, error messages, tone consistency, terminology, placeholders vs. labels |
| 13 | **Internationalization & RTL** | Yes | ✅ | ✅ | 🟡 | Text expansion, RTL mirroring, locale-aware formatting, font support |
| 14 | **Elevation & Shadows** | No | ✅ | ✅ | 🟡 | Shadow scale, elevation hierarchy, dark mode depth, CSS shadow audit |
| 15 | **Iconography** | Yes | ✅ | ✅ | 🟡 | Icon families, optical sizing, touch targets (44×44px), meaning consistency, SVG a11y (aria-hidden, role="img") |
| 16 | **Navigation Patterns** | Yes | ✅ | ✅ | 🟡 | Tabs, breadcrumbs, back buttons, mobile nav, active states, skip links |
| 17 | **Design Tokens & Variables** | No | ✅ | ✅ | 🔴 | Semantic naming, hardcoded vs. tokenized values, dark mode token swapping, coverage % |
| 18 | **Ethical Design & Dark Patterns** | Yes* | ✅ | ✅ | 🟡 | Confirmshaming, false urgency, pre-checked consent, CTA hierarchy, privacy zuckering, regulatory compliance |
| 19 | **Nielsen's 10 Usability Heuristics** | No | ✅ | ✅ | ✅ | H1–H10 mapping; covers system feedback, user control, error prevention, aesthetic design, error recovery |

**Legend:**
- ✅ = Full support · 🟡 = Partial/estimated · 🔴 = Not supported · Yes* = Legal compliance only

### 2. Input Type Abstraction

All inputs funnel through a unified path. The system detects input type and adjusts behavior:

```typescript
type InputType = 
  | "figma_file"           // Figma URL → Figma MCP
  | "live_url"             // https://... → web_fetch
  | "github_file"          // GitHub blob URL → raw URL + web_fetch
  | "github_repo"          // GitHub repo URL → browse key files
  | "codesandbox"          // codesandbox.io/s/...
  | "stackblitz"           // stackblitz.com/edit/...
  | "codepen"              // codepen.io/.../pen/...
  | "storybook"            // Storybook URL
  | "code_direct"          // Pasted HTML/CSS/React/Vue
  | "screenshot"           // Image file
  | "description_only"     // Text description (ask for visuals)

type Confidence = "🟢 High" | "🟡 Medium" | "🔴 Low"

// Figma = High, GitHub file = High, live URL = Medium, screenshot = Medium, description = Low
```

### 3. Framework Detection Abstraction

Runs automatically on code inputs to customize audit:

```typescript
type DetectedFramework = 
  | "react"         // import React, JSX
  | "vue"           // <template>, script setup, .vue files
  | "svelte"        // Svelte component syntax
  | "angular"       // @Component, ng-*
  | "plain_html"    // Raw HTML/CSS only
  | "tailwind"      // @tailwind, class="", arbitrary values
  | "shadcn"        // "from shadcn/ui"
  | "mui"           // MUI theme, styled-components
  | "chakra"        // @chakra-ui/react
  | "ant"           // antd
  | "radix"         // @radix-ui
  | "bootstrap"     // bootstrap classes
  | "unknown"

type DesignSystem = 
  | "material"      // MUI
  | "chakra"        // Chakra UI
  | "shadcn"        // shadcn/ui
  | "ant"           // Ant Design
  | "radix"         // Radix Primitives
  | "bootstrap"     // Bootstrap
  | "custom"        // Custom or no DS
```

### 4. Audit Scope Abstraction

User can request different depths:

```typescript
type AuditScope = "full" | "quick" | "custom"

// Full: all 19 categories
// Quick: 5 smart-selected categories (varies by input type)
// Custom: user picks specific categories

type AuditStage = "early_concept" | "dev_handoff" | "production"

// Early concept: relaxed severity, accepts placeholder content
// Dev handoff: strict on states, tokens, naming (strictest safe default)
// Production: strictest on all fronts, blockers emphasized
```

### 5. Issue Severity & Deduction Model

```typescript
type IssueSeverity = "🚫 Blocker" | "🔴 Critical" | "🟡 Warning" | "🟢 Tip"

type ScoreDeduction = {
  blocker:  -12,  // Violates external legal standard (WCAG AA, GDPR, PECR, consumer law)
  critical: -8,   // Breaks usability/accessibility for significant user population
  warning:  -4,   // Degrades experience
  tip:      -1    // Polish-level improvement
}

// Floor is always 0 — score never goes negative
```

### 6. Scoring Tiers (4 composite scores)

```typescript
type ScoreTier = 
  | "overall"       // 100 − sum(deductions) from all 19 categories
  | "accessibility" // 100 − deductions from Cat 2, 6, 7, 15, 16 (WCAG-relevant)
  | "ethics"        // Custom formula from Cat 18 (Deceptive −15, Questionable −7)
  | "usability"     // Derived from Cat 19 (H1, H2, H3, H6, H7, H10)

type ScoringBand = 
  | "90–100" → WCAG AA compliant, production-ready
  | "70–89"  → Minor gaps, no blockers
  | "50–69"  → Significant gaps, likely has blockers
  | "< 50"   → Failing, legal risk
```

---

## Dependencies & Tool Calls

### 1. MCP Tool Calls (Figma)

These are the explicit tool calls the skill makes:

| Tool | Input | Output | When Used | Category |
|------|-------|--------|-----------|----------|
| `resolve_shortlink(link)` | Figma shortlink | File key + node ID | Step F1 | Figma MCP |
| `get_design_pages(fileKey)` | File key | Page list with names | Step F1.5 | Figma MCP |
| `get_design_context(nodeId)` | Node ID | Layer tree, typography, colors, spacing, components | Step F2 | Figma MCP |
| `get_screenshot(nodeId)` | Node ID | PNG image of rendered design | Step F3 | Figma MCP |
| `get_variable_defs(fileKey)` | File key | Token definitions (colors, spacing, etc.) | Step F3.5 | Figma MCP, Cat 17 |
| `get_code_connect_suggestions(nodeId)` | Node ID | Suggested Figma→code component mappings | Step F3.6 | Figma MCP, Cat 5 |
| `get_code_connect_map(fileKey)` | File key | Confirmed Code Connect mappings | Step F3.6 | Figma MCP, Cat 5 |
| `perform_editing_operations(nodeId, ops)` | Node ID + operation list | Success/error | Step F5 | Figma MCP fix loop |
| `create_design_system_rules(fileKey)` | File key | Generated design system rules | Step F5.5 | Optional system generation |

### 2. Utility Tool Calls (Non-Figma)

| Tool | Input | Output | When Used |
|------|-------|--------|-----------|
| `web_fetch(url)` | Live website URL | Rendered HTML/CSS | Step 1: Live URL, GitHub repo, CodeSandbox, etc. |
| `ask_user_input(question, type, options)` | Widget config | User selection | Smart defaults; scope/stage selection if inference fails |

### 3. Visualizer Widgets (Output Only)

These are offered to the user to interactively explore issues:

| Widget | Trigger | Input | Output | Category |
|--------|---------|-------|--------|----------|
| **Type Scale Stack** | Any typography issue found | Font sizes from Figma/code | Visual hierarchy of type scale | Cat 1 |
| **Contrast Checker** | Any color contrast issue found | Foreground hex + background hex | Live WCAG pass/fail, nearest passing color | Cat 2 |
| **8pt Grid Visualizer** | Any off-grid spacing found | Offending value (px) | Ruler with grid, snap suggestions | Cat 3 |
| **Radar Chart** | End of audit | Issue counts per category | Visual score distribution | Scoring |
| **Issue Priority Matrix** | End of audit | Issues with effort/impact | 2D plot: effort vs. impact | Scoring |
| **Issue Filter** | Full report | Issue list + filter options | Severity, category, fixability filters | Reporting |

---

## Design Patterns

### 1. Layered Detection Pattern

The skill uses a **cascading detection strategy** to infer missing data:

```
Step 1b: Smart Defaults (Inference before asking)
  ├─ Infer SCOPE (full/quick/custom) from user message
  ├─ Infer STAGE (early/dev/prod) from design cues (wireframe → early, polished → dev)
  ├─ Infer WCAG level (AA default, ask only for AAA/legal context)
  └─ Only ask if inference fails → show single combined widget

Result: Minimize questions, maximize inference
```

### 2. Deduplication Pattern

When the same issue appears across multiple nodes:

```
Pattern: If root_cause affects N nodes → one entry, not N entries

Format:
  🔴 [Issue name] — affects N nodes
  Nodes: [id1], [id2], [id3] (+N more if >5)
  Fix: [single fix that resolves all]

Benefit: Keeps reports scannable and actionable
```

### 3. Language-Aware Adaptation Pattern

The skill automatically detects user language and adapts **all output**:

```
Step 0: Language Detection
  → Detect language from user message
  → Respond entirely in that language
  → All labels, explanations, fixes in detected language
  
Supported:
  ✅ English (default)
  ✅ Korean (한국어)
  
Example:
  English: "🔴 Critical Issues (−8pts each)"
  Korean:  "🔴 심각한 문제 (각 −8점)"
```

### 4. Component-Type Routing Pattern

Different UI types skip different categories:

```
Detected Type → Priority Categories → Skipped Categories

Form → [Accessibility, States, Microcopy, Spacing, Typography] → [i18n, Navigation, Responsiveness]
Navigation → [Navigation, Accessibility, States, Responsiveness, Hierarchy] → [Elevation, Corner Radius]
Card/List → [Typography, Spacing, Hierarchy, Consistency, Radius] → [Navigation, i18n, Responsiveness]
Full Page → All 19 → Nothing
```

### 5. Confidence-Based Behavior Adaptation Pattern

Confidence levels drive **audit behavior changes** (not just labels):

```
Confidence Level → Audit Behavior

🟢 High (Figma MCP / GitHub file)
  → Full audit, all deductions apply, exact values cited
  → All 19 categories eligible
  → Highest severity applied

🟡 Medium (Live URL / screenshot)
  → Cannot assess non-rendered states (hover, focus, error)
  → Note in header: "Live URL — non-rendered states not assessed"
  → Some categories downgraded or skipped

🔴 Low (Description only)
  → Ask for visuals — descriptions miss too much
  → Cannot run audit without visual input
```

### 6. Figma MCP Safety Pattern

When fixing Figma files directly:

```
F5: Fix Loop Safety Checks
  ├─ Pre-flight: Node ID exists, not inside instance, operation matches type
  ├─ Execute: perform_editing_operations
  ├─ Verify: get_screenshot to confirm change applied
  └─ Failure recovery: Identify failure type, report clearly, skip to next fix
  
Never stop loop on one failure → continue remaining fixes
```

---

## Data Flows

### Happy Path: Code Input → Audit → Report

```
User: "Check my design" + React component file
  ↓
Step 0: Language Detection
  → Detect English/Korean
  ↓
Step 1: Gather the Design
  ├─ Framework Detection: detect React
  ├─ Design System Detection: detect shadcn/ui
  ├─ Code Extraction:
  │  ├─ Typography: extract all font-size, font-weight, font-family
  │  ├─ Colors: extract all color values, inline vs. tokenized
  │  ├─ Spacing: extract padding, margin, gap → check 8pt grid
  │  ├─ Components: map component reuse, detect one-offs
  │  └─ States: detect hover/active/disabled/focus states present
  ├─ Smart Defaults:
  │  ├─ Infer scope: Full audit (no signal → default)
  │  ├─ Infer stage: Dev handoff (polished code → default)
  │  ├─ Infer WCAG: AA (default)
  │  └─ Skip ask: all inferred → proceed with "Full audit · Dev handoff · WCAG AA"
  ├─ Component Type Detection:
  │  └─ Detect: "Full page" → don't skip any categories
  └─ Confidence: 🟢 High (code input)
  ↓
Step 1.6: Code Input Extraction (parallel checks)
  ├─ Cat 1 (Typography):
  │  ├─ Collect all font-size values
  │  ├─ Check: body ≥ 14px? ✅/❌
  │  ├─ Check: font count ≤ 2? ✅/❌
  │  └─ Trigger: Type Scale Stack widget
  ├─ Cat 2 (Color):
  │  ├─ Extract all color values (hex, rgb, var-name)
  │  ├─ Identify text/bg pairs
  │  ├─ Compute contrast ratio (formula in color.md)
  │  ├─ Check: ≥ 4.5:1? ✅/❌
  │  └─ Trigger: Contrast Checker widget if fail
  ├─ Cat 3 (Spacing):
  │  ├─ Extract padding, margin, gap
  │  ├─ Check: divisible by 8? ✅/❌
  │  ├─ Tailwind: p-[13px] → 🟡 (arbitrary)
  │  └─ Trigger: 8pt Grid widget if fail
  ├─ Cat 17 (Tokens):
  │  ├─ Check: hardcoded vs. var() / $token
  │  ├─ Count tokenized %: e.g. "60% colors tokenized"
  │  └─ Flag hardcoded values → 🟡/🔴
  └─ ... (continue for all 19 categories)
  ↓
Step 2: Run the Design Audit
  ├─ For each of 19 categories:
  │  ├─ Apply category rules (see SKILL.md Cat 1–19)
  │  ├─ Detect issues
  │  ├─ Assign severity (Blocker/Critical/Warning/Tip)
  │  ├─ Apply stage severity mapping (early/dev/prod)
  │  ├─ Deduplicate across nodes (one entry per root cause)
  │  └─ Flag color blindness risk (Cat 2 only)
  └─ Collect all issues into flat list
  ↓
Step 3: Score & Report
  ├─ Scoring:
  │  ├─ Overall: 100 − sum(deductions)
  │  ├─ Accessibility: 100 − sum(deductions from Cat 2, 6, 7, 15, 16)
  │  ├─ Ethics: custom formula (Cat 18)
  │  ├─ Usability: from Cat 19
  │  └─ Show math: 100 − (1 × 🚫 12) − (2 × 🔴 8) − (3 × 🟡 4) − (1 × 🟢 1) = X/100
  ├─ Generate Report:
  │  ├─ REPORT HEADER: input, type, framework, confidence, scope, design system, token coverage
  │  ├─ SCORES: 4 score rows with bar charts + brief summary
  │  ├─ ISSUES: grouped by severity, deduplicated
  │  │  └─ Format: [Issue name] — [explanation] → Fix: [action]
  │  ├─ POSITIVES: min 2, max 4 (things done right)
  │  ├─ CROSS-FRAME INCONSISTENCIES: if 2+ frames
  │  ├─ RE-AUDIT DELTA: if 2nd audit in session
  │  └─ REPORT FOOTER: next steps, offer to fix, export options
  └─ Visualizations:
     ├─ Radar Chart: score distribution across 19 categories
     └─ Issue Priority Matrix: effort vs. impact 2D plot
  ↓
Step 3b: Radar Chart Visualization
  ├─ Render 19-sided radar with score per category
  ├─ Color by severity (green = good, red = bad)
  └─ Offer: "Want to dive into any category?"
  ↓
Step 4: Offer to Fix
  ├─ If code input:
  │  └─ Offer before/after code diffs
  ├─ If Figma input:
  │  └─ Offer "Fix in Figma" button → Step F5 loop
  └─ Ask: "Which issues to tackle first?"
  ↓
Done

User reads report + chooses fixes
```

### Figma MCP Path: Figma File → Audit → Fix Loop

```
User: "Check my Figma file: [URL]"
  ↓
Step 0: Language Detection (same as code path)
  ↓
Step 1: Gather the Design (Figma variant)
  ├─ F0: Check MCP Availability
  │  └─ Attempt get_design_context
  │  └─ If unavailable: "I don't have Figma MCP access — could you export a screenshot?"
  ├─ F1: resolve_shortlink (if URL is shortlink)
  │  └─ get link → file key + node ID
  ├─ F1.5: get_design_pages (file key)
  │  ├─ Returns: page list, names, count
  │  ├─ If 1 page: proceed to F2
  │  ├─ If 2–5 pages: list pages, ask which to audit
  │  └─ If 6+ pages: widget: "Which pages to audit?"
  ├─ F2: get_design_context (node ID)
  │  ├─ Returns: layer tree, typography, colors, spacing, components
  │  ├─ Component Health Scan (automatic):
  │  │  ├─ Count named components vs. total layers
  │  │  ├─ Flag if < 30% → 🔴 Low coverage
  │  │  ├─ Count detached instances → 🟡 if > 0
  │  │  └─ Count unnamed layers → 🟡 if > 20%
  │  └─ Auto-Layout Compliance Scan (automatic):
  │     ├─ Detect frames with manual positioning (no layoutMode)
  │     ├─ Flag if should be Auto Layout → 🟡
  │     └─ Count: "X% using Auto Layout, Y manual-position frames"
  ├─ F3: get_screenshot (node ID)
  │  └─ Returns: PNG image
  ├─ F3.5: get_variable_defs (file key)
  │  ├─ Returns: token definitions (color, spacing, etc.)
  │  ├─ Cat 17: tokenized % calculation
  │  ├─ Cat 2: compute contrast from token pairs programmatically
  │  └─ Confidence upgrade: 🟡 → 🟢 High if color tokens available
  ├─ F3.6: get_code_connect_suggestions (node ID)
  │  ├─ Returns: suggested Figma→code mappings
  │  ├─ get_code_connect_map (file key)
  │  │  └─ Returns: confirmed mappings
  │  └─ Cat 5: flag naming divergence or unmapped components
  ├─ Smart Defaults (same inference as code)
  └─ Confidence: 🟢 High (Figma MCP)
  ↓
Step 2: Run the Design Audit
  (same 19 categories as code path, but data sourced from Figma)
  ↓
Step 3: Score & Report
  (same reporting template)
  ├─ REPORT HEADER: includes
  │  ├─ Component health: "68% coverage · 4 detached · 12 unnamed"
  │  ├─ Auto Layout: "85% using Auto Layout · 3 manual frames"
  │  └─ Code Connect: "8 mapped · 3 unmapped" (if available)
  └─ (rest identical to code path)
  ↓
Step 4: Offer to Fix
  ├─ Button: "Fix all Critical" or "Fix this issue"
  └─ If selected: → Step F5 loop
  ↓
F5: Fix Loop (Figma-specific)
  ├─ For each confirmed fix:
  │  ├─ Pre-flight check:
  │  │  ├─ Node ID exists in context data ✅
  │  │  ├─ Not inside component instance ✅
  │  │  └─ Operation matches node type ✅
  │  ├─ Call: perform_editing_operations (node ID, [operations])
  │  ├─ Verify: get_screenshot (same node)
  │  ├─ Show: before/after screenshots
  │  ├─ Confirm: ✅ or "Fix failed"
  │  └─ Failure recovery:
  │     ├─ Identify failure type (node not found, instance, permissions, etc.)
  │     ├─ Report to user in detected language
  │     ├─ Log failed fix in summary
  │     └─ Continue to next fix (never stop loop)
  └─ Show summary: "N fixed ✅ · N need manual attention"
  ↓
F5.5: Generate Design System Rules (optional)
  ├─ Offer when:
  │  ├─ Cat 17 score < 70% (significant hardcoding)
  │  ├─ Component health < 50%
  │  └─ User asks "generate design system"
  └─ Call: create_design_system_rules (file key)
     └─ Returns: enforcement rules for connected codebase
  ↓
Done
```

### Live Website URL Path: Screenshot → Audit

```
User: "Check my website: https://example.com/checkout"
  ↓
Step 1: Gather the Design (Live URL variant)
  ├─ web_fetch(url)
  │  └─ Returns: rendered HTML/CSS (visual snapshot)
  ├─ Confidence: 🟡 Medium (can't assess non-rendered states)
  ├─ Limitations note:
  │  └─ "Cannot assess: hover states, focus states, error states, loading, authenticated pages"
  └─ Note in header: "Live URL — non-rendered states not assessed"
  ↓
Step 2: Run the Design Audit
  ├─ Categories downgraded:
  │  ├─ Cat 5 (States): reduced coverage (no interactive states)
  │  ├─ Cat 8 (Motion): cannot assess
  │  ├─ Cat 11 (Error/Loading): cannot assess
  │  └─ Others: normal coverage
  ↓
Step 3: Score & Report
  (same template with Medium confidence noted)
  ↓
Step 4: Offer to Fix
  ├─ If code available (HTML/CSS found):
  │  └─ Offer code diffs
  ├─ Offer: "Want me to audit other pages on this site?"
  └─ Suggest: "Share code or Figma for a higher-confidence audit"
  ↓
Done
```

### Wireframe → Spec Mode (Step 4)

```
User uploads wireframe (greyscale, boxes, lorem ipsum)
  ↓
Smart Defaults detects: "Early concept stage"
  ↓
Offer: "This looks like a wireframe — want a dev spec instead of an audit?"
  ↓
If yes → Step 4: Wireframe to Spec mode
  ├─ Input: wireframe image/file
  ├─ Output: annotated spec with:
  │  ├─ Dimensions & spacing (in px)
  │  ├─ States required (hover, active, disabled, loading, error)
  │  ├─ Copy placeholders ("Button label", "Form field hint")
  │  ├─ Component suggestions ("Use Button primary", "Card secondary")
  │  └─ Color/typography placeholders
  ├─ Format: Markdown or exportable to Figma/design tool
  └─ Done
  ↓
If no → Run standard audit at "Early concept stage"
  └─ (severity reduced for stage)
```

---

## Scoring & Deduction Model

### Overview

```
START: 100 points
  ↓
Deduct for each issue:
  - Blocker (🚫):   −12 pts (legal/compliance violations)
  - Critical (🔴):  −8 pts (usability breaks)
  - Warning (🟡):   −4 pts (degrades experience)
  - Tip (🟢):       −1 pt (polish improvement)
  ↓
FLOOR: 0 (never negative)
  ↓
RESULT: [0–100] score
```

### Severity Assignment Rules

| Issue Type | Criteria | Early Concept | Dev Handoff | Production |
|---|---|---|---|---|
| **Contrast fail (Cat 2)** | WCAG < AA | 🟡 Warning | 🚫 Blocker | 🚫 Blocker |
| **Missing hover/focus (Cat 5)** | No visual state | 🟢 Tip | 🟡 Warning | 🔴 Critical |
| **Placeholder content (Cat 12)** | Lorem ipsum present | 🟢 Tip | 🔴 Critical | 🔴 Critical |
| **Off-grid spacing (Cat 3)** | Not divisible by 8 | 🟢 Tip | 🟡 Warning | 🟡 Warning |
| **Missing alt text (Cat 6)** | Meaningful image untagged | 🟡 Warning | 🚫 Blocker | 🚫 Blocker |
| **Touch target too small (Cat 6)** | < 44×44px | 🟡 Warning | 🔴 Critical | 🔴 Critical |
| **Hardcoded tokens (Cat 17)** | No var() / $token | 🟢 Tip | 🟡 Warning | 🔴 Critical |

### Composite Scores (4 tiers)

```
1. Overall Score (all 19 categories)
   = 100 − Σ(deductions)
   
2. Accessibility Score (Cat 2, 6, 7, 15, 16 only)
   = 100 − Σ(deductions from these 5 categories)
   Label: "Accessibility Score: X/100" + "⚠️ Contains legal compliance failures" if Blockers
   
3. Ethics Score (Cat 18 only)
   Special formula: Deceptive −15, Questionable −7, Noted 0 (different from standard)
   = 100 − Σ(custom deductions)
   
4. Usability Score (Cat 19: Nielsen H1, H2, H3, H6, H7, H10 only)
   = 100 − Σ(deductions from these 6 heuristics)
   Note: H4 Consistency→Cat 5, H5 Error Prevention→Cat 7, H8 Aesthetics→Cat 4, H9 Recovery→Cat 11/12
```

### Deduplication Rules

```
Rule: If the same root cause affects N nodes → count as ONE issue, not N

Format:
  🔴 [Issue Name] — affects N nodes
  Nodes: [id1], [id2], [id3] (+ N more if > 5)
  Fix: [single fix that resolves all]

Scoring: The deduplicated issue counts as 1 deduction, not N deductions

Exception: If each instance requires a different fix (different values, different components),
           list as separate but group visually
```

### Scoring Bands

| Range | Status | Meaning |
|-------|--------|---------|
| 90–100 | ✅ Excellent | WCAG AA compliant, production-ready |
| 70–89 | 🟡 Good | Minor gaps, no blockers, ship-safe |
| 50–69 | ⚠️ Fair | Significant gaps, likely has blockers, review before shipping |
| < 50 | 🔴 Poor | Failing, legal risk, do not ship |

---

## Extensibility Points

### 1. Adding a New Audit Category

To add Category 20:

1. **Add SKILL.md section** (after Cat 19):
   ```
   ### CATEGORY 20: [Name]
   *Full rules → `references/[name].md`*
   
   - [ ] Rule 1
   - [ ] Rule 2
   ...
   ```

2. **Create reference file** `references/[name].md` with:
   - Deep-dive rules
   - Code detection patterns
   - Severity thresholds
   - Examples

3. **Add to category detection** (Step 1.6):
   - Define extraction logic for code inputs
   - Define widget trigger (if applicable)
   - Define Figma checks (if applicable)

4. **Add to scoring** (Step 3):
   - Add deduction entries
   - Assign to one of 4 composite scores (Overall, Accessibility, Ethics, Usability)

5. **Test across input types**:
   - Figma audit
   - Code audit (React/Vue/HTML)
   - Screenshot audit

### 2. Adding a New Design System Detection

To detect a new framework (e.g., Pico CSS):

1. **Add signature patterns** in Step 1.6:
   ```
   "pico_css": [
     "from 'pico/css'",
     "@import 'pico.min.css'",
     'class="pico-'
   ]
   ```

2. **Add custom audit rules** in relevant categories:
   - Cat 3 (Spacing): Pico uses 1rem baseline, adjust grid checks
   - Cat 14 (Elevation): Pico has preset shadow system
   - Cat 17 (Tokens): Pico CSS variables to extract

3. **Add to reference guide** (new file or extend existing):
   - System-specific fixes
   - Common mistakes

### 3. Adding a New Input Type

To support a new platform (e.g., Webflow):

1. **Add to input detection** (Step 1):
   ```
   "webflow": webflow.com/...
   ```

2. **Define fetch strategy**:
   - API endpoint or web scraping
   - What data can be extracted
   - Confidence level estimate

3. **Map to existing paths**:
   - Webflow → "code" path (HTML/CSS output)
   - Or → "live URL" path (rendered site)

4. **Test coverage**:
   - All 19 categories should work
   - Note any limitations

### 4. Adding a New Widget

To offer interactive tools:

1. **Define trigger** (when to show):
   - Cat X issue found → trigger widget
   - Always on Figma audits → widget Y

2. **Define input/output**:
   - Pre-populate with extracted values
   - What calculation/visualization to show

3. **Add to Step 3 reporting**:
   - Mention widget in issue explanation
   - Example: "Use the Contrast Checker widget to test fixes"

### 5. Adding a New Language

To support a new language (e.g., Spanish):

1. **Update Step 0** (language detection):
   ```
   Supported languages: English, Korean, Spanish
   ```

2. **Translate all user-facing strings**:
   - Issue labels, explanations, fix suggestions
   - Report headers, footers
   - Widget text
   - Inline helpers

3. **Translate references** (optional):
   - Create `references/*_ES.md` or extend existing files

4. **Test full audit** in new language:
   - All 19 categories
   - All input types
   - All severity levels

---

## Key Interfaces & Contracts

### Category Interface (Each of 19 categories)

```typescript
interface Category {
  id: number              // 1–19
  name: string            // "Typography"
  wcagRelevant: boolean   // true if contributes to Accessibility Score
  rules: Rule[]           // Checkpoints for this category
  codeChecks?: (code: SourceCode) => Issue[]
  figmaChecks?: (context: FigmaContext) => Issue[]
  screenshotChecks?: (image: Image) => Issue[]
  widgetTrigger?: WidgetConfig
  references?: string     // URL to detailed rules
}

interface Rule {
  name: string
  description: string
  severity: (stage: AuditStage) => IssueSeverity
  detector: (data: any) => Issue | null
}

interface Issue {
  categoryId: number
  ruleName: string
  severity: IssueSeverity
  message: string
  fix: string
  nodeIds?: string[]      // For Figma/code: affected nodes
  confidence: Confidence
  colorBlindnessNote?: string  // Cat 2 only
}
```

### Report Interface

```typescript
interface DesignAuditReport {
  header: ReportHeader
  scores: Scores
  issues: Issue[]           // Deduplicated, grouped by severity
  positives: string[]       // 2–4 things done right
  crossFrameInconsistencies?: CrossFrameIssue[]
  reAuditDelta?: ReAuditDelta
  footer: ReportFooter
  visualizations: {
    radarChart: RadarData
    priorityMatrix: MatrixData
  }
}

interface Scores {
  overall: number           // 0–100
  accessibility: number     // 0–100 (Cat 2, 6, 7, 15, 16)
  ethics: number           // 0–100 (Cat 18, custom formula)
  usability: number        // 0–100 (Cat 19)
  formula: string          // "100 − (1 × 🚫 12) − (2 × 🔴 8) ..."
}
```

---

## System Characteristics

| Aspect | Design |
|--------|--------|
| **Modularity** | 19 independent categories, each with rules, code patterns, and severity mapping |
| **Reusability** | Single audit engine handles Figma, code, screenshots, live URLs |
| **Extensibility** | New categories, frameworks, languages, and input types can be added without rewiring core |
| **Transparency** | Scoring formula visible to users; every issue has a reason; all deductions shown |
| **Language-aware** | Full UI adaptation based on user language (English/Korean → Spanish/others) |
| **Confidence-first** | Audit behavior adapts based on input confidence; Medium confidence notes limitations |
| **Compliance-focused** | Blocker tier separates legal violations (WCAG, GDPR) from design quality issues |
| **Stage-aware** | Severity of same issue varies by lifecycle stage (early concept → production) |
| **Deduplication** | Same root cause across multiple nodes = 1 issue, not N |
| **Safe Figma edits** | Pre-flight checks before editing; failure recovery; never stops mid-loop |

---

## Summary

This skill is architected as a **modular, rule-based audit engine** with:

- **19 independent audit categories** each with extraction, detection, and severity logic
- **Input abstraction** that normalizes Figma, code, screenshots, and URLs into a unified audit pipeline
- **Smart inference** that minimizes user questions and adapts to context
- **Composite scoring** (overall, accessibility, ethics, usability) with deduction-based calculation
- **Language & stage awareness** that changes output and severity based on detected language and design lifecycle
- **Figma MCP integration** for direct inspection of design layer data and safe in-place fixes
- **Deduplication** to keep reports scannable (one entry per root cause, not per node)
- **Extensibility** at every layer: new categories, design systems, input types, languages

The system prioritizes **transparency** (show the math, explain the why), **safety** (pre-flight checks, failure recovery), and **clarity** (one primary action per screen, plain-language explanations, beginner-friendly tone).

---

**Document Version:** 1.0  
**Last Updated:** 2026-07-07  
**Next Review:** After v1.3 release
