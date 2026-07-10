# claude-design-auditor-skill Learning Hub

**A professional design auditing skill for Claude that validates designs across 19 dimensions with severity-ranked issues and intelligent scoring.**

## Source

- **Repository**: [github.com/Ashutos1997/claude-design-auditor-skill](https://github.com/Ashutos1997/claude-design-auditor-skill)
- **Cloned**: 2026-07-07 07:05 UTC+7
- **Origin**: ./origin/ (symlink to ghq)

## Quick Summary

The Design Auditor is a sophisticated design validation system that:
- **Multi-format Input**: Accepts Figma, code, URLs, screenshots, and wireframe descriptions
- **19-Dimension Auditing**: Typography, color, spacing, accessibility, ethics, compliance, and more
- **Framework-Aware**: Auto-detects React, Vue, MUI, Chakra, shadcn/ui, Ant Design, Radix, Bootstrap
- **Psychology-Informed**: Incorporates Peak-End Rule, Goal Gradient Theory, Overchoice Paradox detection
- **Transparent Scoring**: Evidence-based severity calculation with confidence levels (🟢 High / 🟡 Medium / 🔴 Low)
- **Interactive Tools**: Contrast checker, grid visualizer, issue priority matrix, dark pattern detection (22 patterns)
- **Bilingual Support**: English + Korean with cultural terminology
- **Figma Integration**: MCP-based design system extraction and component auditing
- **Ethical Focus**: Detects dark patterns, regulatory compliance, and accessibility violations

## Explorations

### 2026-07-07 0706 (Standard: 3 parallel agents)

| Document | Size | Focus | Key Content |
|----------|------|-------|-------------|
| **[Architecture](2026-07-07/0706_ARCHITECTURE.md)** | 36KB | System Design | 17-file structure, 8,825 line codebase, 19 audit categories, polymorphic input abstraction, 6 design patterns, Figma MCP workflow, extensibility |
| **[Code Snippets](2026-07-07/0706_CODE-SNIPPETS.md)** | 45KB | Implementation | SKILL.md entry point, URL/code/image decision trees, WCAG contrast calculation, framework detection cascades, psychology heuristics (Peak-End, Goal Gradient, Overchoice), error handling, scoring formula |
| **[Quick Reference](2026-07-07/0706_QUICK-REFERENCE.md)** | 13KB | Usage Guide | What it does, installation methods, 10 key features, 5 concrete recipes, configuration options, API reference, workflows for developers/designers/PMs/auditors |

## Key Insights

### 1. Sophisticated Behavior Adaptation
Not a static checklist tool—behavior scales based on **user skill level, design stage, and input confidence**. Audit weight shifts by component type (form vs. navigation vs. dashboard). Severity deductions vary by design maturity.

### 2. Psychology-Embedded Design Validation
Incorporates three behavioral heuristics directly in audit logic:
- **Peak-End Rule**: Analyzes success screens separately (high recency effect)
- **Goal Gradient Theory**: Detects progress indicators → incomplete gradient violations
- **Overchoice Paradox**: Flags when too many equal-weight UI options appear → decision paralysis

### 3. Polymorphic Input Abstraction
Elegant handler for 5 input types (Figma, GitHub, URL, screenshot, description) with **confidence normalization**. Framework detection cascades: URL → code fetch → React/Vue detection → MUI/Chakra/shadcn pattern matching.

### 4. Transparent Scoring Formula
**Deterministic, evidence-based severity**:
- Blocker: −12 points
- Critical: −8 points
- Warning: −4 points
- Tip: −1 point

Confidence levels affect output mode: 🟢 High → full deductions, 🟡 Medium → 50% penalty for uncertain values, 🔴 Low → descriptive guidance only.

### 5. Extensible Reference Architecture
19 audit categories are modularized as independent sections. Adding new category = adding reference module + detection logic. Framework support (10+ detected) follows the same pattern. **Easy to extend without touching core audit engine.**

### 6. Bilingual Parity + Ethical Priority
English and Korean outputs are feature-parity (not translations). Legal compliance and ethical design patterns prioritized over aesthetics. Detects 22 dark patterns (roach motel, trick questions, disguised ads, etc.) and regulatory baselines (CCPA, GDPR, etc.).

## Files

- **claude-design-auditor-skill.md** (hub file, this document)
- **origin/** (symlink → ghq clone at `/home/user/ghq/github.com/Ashutos1997/claude-design-auditor-skill`)
- **2026-07-07/0706_ARCHITECTURE.md** (System design, patterns, extensibility)
- **2026-07-07/0706_CODE-SNIPPETS.md** (Implementation patterns, psychology heuristics, formulas)
- **2026-07-07/0706_QUICK-REFERENCE.md** (Installation, features, API, workflows)

## Next Steps for Oracle

**If integrating into oracle skills:**
- Review `0706_QUICK-REFERENCE.md` for feature set and configuration options
- Study `0706_CODE-SNIPPETS.md` for scoring logic and framework detection patterns
- Reference `0706_ARCHITECTURE.md` for extensibility (adding new audit categories or design systems)

**If building similar audit systems:**
- Examine polymorphic input abstraction (handles 5+ input types with confidence scoring)
- Learn confidence-based behavior adaptation (changes output mode based on evidence quality)
- Study modular reference architecture (19 independent audit categories)
- Adopt psychology-informed validation (Peak-End, Goal Gradient, Overchoice detection)

---

**Learning Session**: Ashutos1997/claude-design-auditor-skill  
**Cloned**: 2026-07-07 07:05 UTC+7  
**Explored**: 2026-07-07 07:06–07:13 UTC+7 (3 parallel Haiku agents)  
**Status**: ✅ Complete | All 3 docs generated | Hub ready | Ready to commit

**Explored by**: Khun-Ram Oracle  
**Exploration Type**: Standard (3-agent parallel: Architecture + Code Snippets + Quick Reference)
