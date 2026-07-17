---
name: rtk
description: - **GitHub**: https://github.com/rtk-ai/rtk
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-10
  source: fleet-memory
---

# RTK (Return To Knowledge) Learning Index

## Source
- **Origin**: ./origin/ (symlink to ghq repository)
- **GitHub**: https://github.com/rtk-ai/rtk
- **What is RTK**: High-performance CLI proxy reducing LLM token consumption by 60-90%

---

## Explorations

### 2026-06-10 0100 (Default Mode — 3 Agents)

**Documentation Files**:
- [Architecture](./2026-06-10/0100_ARCHITECTURE.md) — System design, 130+ files, 8 core modules, 3-tier parsing strategy
- [Code Snippets](./2026-06-10/0100_CODE-SNIPPETS.md) — Implementation details, patterns, configs, token tracking
- [Quick Reference](./2026-06-10/0100_QUICK-REFERENCE.md) — Installation, usage, troubleshooting, features guide

---

## Key Insights

1. **Architecture**: RTK uses a 3-tier parsing strategy (Full → Degraded → Passthrough) to guarantee no silent data loss. Trait-based StreamFilter pattern enables 50+ language/tool-specific handlers.

2. **Token Optimization**: Conservative 1 token per 4 characters estimation. Real-world savings: 60-90% via intelligent output filtering (stripping boilerplate, comments, test failures). SQLite-based analytics tracks savings per command.

3. **Security Model**: SHA-256 hook verification, TOML-based project-local filters with trust model, no `unwrap()` calls. Designed for integration with Claude Code, Cursor, Gemini CLI, Copilot, Hermes agents.

---

## Use Case: Why This Matters

RTK is the **token reduction engine** used in mission-control's Self-Optimization Doctrine. Understanding RTK's 3-tier parsing, filter architecture, and analytics enables:
- Minimum token consumption, maximum output (per oracle rules)
- Intelligent command filtering (context-aware)
- Per-oracle token budgets (60-95% reduction targets)
- Integration with agent federation (Phase 3+ work)

---

## File Reference

| Document | Purpose | Size |
|----------|---------|------|
| ARCHITECTURE.md | System design, modules, patterns, security, extension points | ~400 lines |
| CODE-SNIPPETS.md | Real code examples, patterns, token tracking, error handling | 1,071 lines |
| QUICK-REFERENCE.md | Installation, usage, troubleshooting, features, pro tips | 425 lines |

---

## Learning Metadata

- **Mode**: Default (3 agents)
- **Agents Used**: Haiku 4.5 (cost-effective exploration)
- **Total Lines**: ~1,900 lines of documentation
- **Token Cost**: ~95K tokens (agents) vs. ~250K+ tokens if read directly
- **Time**: ~4 minutes for full exploration
- **Efficiency**: 3x token reduction via agent-based learning vs. direct reading

---

## Related

- **Mission-Control Project**: Uses RTK for oracle token optimization
- **Self-Optimization Doctrine**: Targets min token, max output
- **Headroom Integration**: Complementary compression for federation responses
- **Phase 3**: Federation bootstrap uses RTK principles for query compression

---

**Learning Complete**: 2026-06-10 01:05 GMT+7  
**Hub Created**: `/route/mission-control/ψ/learn/rtk-ai/rtk/rtk.md`
