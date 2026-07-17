---
name: agent-skills
description: - **GitHub**: https://github.com/addyosmani/agent-skills
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-11
  source: fleet-memory
---

# Agent Skills Learning Index

## Source
- **Origin**: ./origin/
- **GitHub**: https://github.com/addyosmani/agent-skills
- **Description**: 24 engineering workflows + best practices for AI coding agents, enforcing production-grade quality gates across spec → plan → build → test → review → ship phases.

## Project Overview

**Agent Skills** is a collection of structured workflows designed for AI coding agents (Claude Code, Cursor, Gemini CLI, etc.). It implements best practices across the full software engineering lifecycle:

- **24 Skills** organized by phase: Define (3), Plan (1), Build (7), Verify (2), Review (4), Ship (6), Meta (1)
- **7 Commands**: `/spec`, `/plan`, `/build`, `/test`, `/review`, `/code-simplify`, `/ship`
- **4 Personas**: Code Reviewer, Test Engineer, Security Auditor, Web Performance Auditor
- **Validation Layer**: Automated schema enforcement + CI checks for compliance

## Explorations

### 2026-06-11 19:02 (default)
- [[2026-06-11/1902_ARCHITECTURE|Architecture]] — Directory structure, core abstractions, skill lifecycle, command orchestration, persona system
- [[2026-06-11/1902_CODE-SNIPPETS|Code Snippets]] — Key implementations, skill validation, command patterns, persona composition, error handling
- [[2026-06-11/1902_QUICK-REFERENCE|Quick Reference]] — Installation, features, usage patterns, important concepts, troubleshooting

**Key Insights**:
- **Three-layer composition**: Skill (how) + Persona (who) + Command (when)
- **Lazy discovery + on-demand loading** prevents bloat while keeping full power available
- **Explicit orchestration rules** (commands orchestrate, personas never delegate to each other) enforce clean composition boundaries
- **Validation infrastructure** ensures 24 skills comply with schema rules, preventing silent failures
- **Autonomous execution** (`/build auto`) removes human stepping between tasks while maintaining quality gates

## How to Use This Learning

1. **Getting Started**: Read [Quick Reference](2026-06-11/1902_QUICK-REFERENCE.md) first
2. **Understanding Structure**: Study [Architecture](2026-06-11/1902_ARCHITECTURE.md) for system design
3. **Implementation Details**: Explore [Code Snippets](2026-06-11/1902_CODE-SNIPPETS.md) for how-it-works

## Key Concepts

- **Skills**: Mandatory workflows with explicit exit criteria (e.g., "test succeeds" for test-driven-development skill)
- **Personas**: Single-perspective specialists that validate code from one angle (e.g., code-reviewer checks correctness, security-auditor checks vulns)
- **Commands**: User-facing entry points that orchestrate skills and personas (e.g., `/build` runs BUILD phase skills; `/ship` runs fan-out review)
- **Intent Mapping**: How user input triggers appropriate skill chains
- **Validation**: Automated schema checks ensure skills comply with rules
- **Composition Rules**: Commands orchestrate; personas invoke skills; no persona-to-persona delegation

## Notable Patterns

### Skill Anatomy
- **Frontmatter**: Name, description (YAML)
- **Body**: Markdown-based workflow with exit criteria
- **Schema**: Validated by `validate-skills.js`

### Command Execution
- **Single mode** (`/build`): Incremental, one task at a time, with human review between steps
- **Autonomous mode** (`/build auto`): Plan once, execute all, with verification gates (no human in loop)

### Persona System
- **Code Reviewer**: Five-axis framework (correctness, readability, architecture, security, performance)
- **Test Engineer**: Test coverage, mutation testing, edge cases
- **Security Auditor**: OWASP top 10, vuln scanning, threat modeling
- **Web Performance Auditor**: Core Web Vitals, optimization, metrics

### Design Principles
- **Vertical slicing**: End-to-end per feature, not horizontal layers
- **Process over prose**: Explicit workflows with testable exit criteria
- **Composition over inheritance**: Three layers (skill + persona + command)
- **Lazy discovery**: Avoid loading all 24 skills at startup; load on-demand
- **Validation-first**: Schema checks prevent silent failures

## Integration Points

- **Platform Support**: Claude Code, Cursor, Antigravity, Gemini CLI, Windsurf, OpenCode, Copilot
- **Plugin System**: Loads via plugin.json manifest
- **CI Integration**: `validate-skills.js` runs in GitHub Actions
- **Skill Composition**: Skills reference each other via markdown links, detected at validation time

## Related Concepts

- Spec-Driven Development (SDD)
- Test-Driven Development (TDD)
- Anti-rationalization patterns
- Chesterton's Fence (understand before changing)
- Beyonce Rule (if you liked it you shoulda put a test on it)
- DAMP over DRY (Descriptive And Meaningful Phrases)

## Next Steps

- Extend with custom skills following the schema
- Integrate into your own workflow system
- Adapt personas for your team's expertise areas
- Run validation: `node scripts/validate-skills.js`

---

**Last updated**: 2026-06-11  
**Source**: https://github.com/addyosmani/agent-skills
