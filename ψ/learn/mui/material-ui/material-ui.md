---
name: material-ui
description: - **GitHub**: https://github.com/mui/material-ui
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-28
  source: fleet-memory
---

# material-ui Learning Index

## Source
- **Origin**: ./origin/ (symlinked to ghq)
- **GitHub**: https://github.com/mui/material-ui
- **Status**: Active, v9.1.2+ (latest)

## Overview
Material-UI is a comprehensive React component library implementing Google Material Design. It provides 157+ production-ready components with extensive theming, accessibility, and customization capabilities.

## Explorations

### 2026-06-28 06:17 (--deep, 5 agents)

**Documentation Files:**
- [[2026-06-28/0617_ARCHITECTURE|Architecture]] — Monorepo structure, entry points, core abstractions, dependencies
- [[2026-06-28/0617_CODE-SNIPPETS|Code Snippets]] — Core patterns, component implementations, styling system
- [[2026-06-28/0617_QUICK-REFERENCE|Quick Reference]] — Installation, features, configuration, usage patterns
- [[2026-06-28/0617_TESTING|Testing & Quality]] — Test structure, utilities, patterns, coverage strategy
- [[2026-06-28/0617_API-SURFACE|API & Integration]] — Public API, extension points, integration patterns

**Key Insights:**
1. **Minimalist Architecture** — Only 4-5 runtime dependencies despite 150+ components (Emotion, Popper, react-transition-group)
2. **Theme-Centric Design** — Entire system anchored to theme object; components derive styling from centralized theme
3. **Advanced Composition** — Uses ownerState pattern, slot system, and override resolver for maximum flexibility
4. **Production-Grade Testing** — Conformance tests ensure consistency across all components; systematic prop combination testing
5. **Modular Monorepo** — Independent package versioning (pnpm + Lerna); each package deployable separately

## Learning Metadata

- **Explored**: 2026-06-28 at 06:17 (+07)
- **Mode**: --deep (comprehensive)
- **Files Generated**: 5 markdown documents (830+ lines total)
- **Agent Effort**: ~16min wall-clock (5 parallel Haiku agents)
- **Focus**: Architecture, patterns, testing, API surface, quick reference

## Next Steps

1. **Review Architectures** first to understand package organization
2. **Study Patterns** in Code Snippets for component implementation idioms
3. **Reference Quick Guide** for installation and common usage
4. **Deep Dive Testing** docs to understand quality assurance approach
5. **API Surface** for customization and extension possibilities

---

*Generated via /learn Material-UI deep dive. Docs committed to ψ/learn/ for future reference.*
