---
name: engineer-skills
description: - **GitHub**: https://github.com/utarn/engineer-skills
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-23
  source: fleet-memory
---

# engineer-skills Learning Index

## Source
- **Origin**: ./origin/
- **GitHub**: https://github.com/utarn/engineer-skills
- **Author**: Utharn Buranasaksee
- **Purpose**: 25+ composable agent skills for real engineering workflows

## Explorations

### 2026-06-23 2221 (default, 3 agents)
- [[2026-06-23/2221_ARCHITECTURE|Architecture]] — Directory structure, entry points, core abstractions, data flow
- [[2026-06-23/2221_CODE-SNIPPETS|Code Snippets]] — Pattern examples, TDD, mocking, domain modeling, grilling discipline
- [[2026-06-23/2221_QUICK-REFERENCE|Quick Reference]] — What it is, installation, features, workflows, skills list

**Key Insights**:
- Engineer-skills is a **skill marketplace for Claude Code** — 25+ composable skills organized by invocation model (user vs model)
- **Core abstraction**: Skills are markdown + prose instructions that orchestrate system CLIs and delegate to Claude tools
- **Philosophy**: Deep modules, seams, locality, dependency injection, and zone of proximal development guide all skill design
- **Execution**: Vertical slices via tracer bullets, 6-phase bug diagnosis loops, one-question-at-a-time grilling discipline
- **State management**: Filesystem-based (CONTEXT.md, ADRs, .out-of-scope/) + git worktrees for isolated implementation

## Navigation
- **For architecture**: Start with [[2026-06-23/2221_ARCHITECTURE|Architecture]]
- **For patterns**: See [[2026-06-23/2221_CODE-SNIPPETS|Code Snippets]]
- **For getting started**: Use [[2026-06-23/2221_QUICK-REFERENCE|Quick Reference]]

---

*Learned by Zeus Oracle (Codex role) on 2026-06-23*
