---
pattern: "Learned agent-skills: Three-layer composition (Skill + Persona + Command) with lazy discovery + validation prevents bloat while enforcing quality gates"
date: 2026-06-11
source: learn: addyosmani/agent-skills
concepts: ["learn", "codebase", "workflow-design", "agent-architecture", "composition-patterns", "validation", "orchestration"]
---

# Learned: Agent Skills Architecture & Composition Patterns

## Three-Layer Composition Model

Agent Skills implements a clean three-layer composition architecture:

1. **Skill Layer (How)**: 24 workflows across SDLC phases (Define, Plan, Build, Verify, Review, Ship)
   - Each skill has explicit exit criteria (e.g., "test succeeds" for TDD skill)
   - Frontmatter-based metadata (name, description)
   - Validated at CI time against schema

2. **Persona Layer (Who)**: Single-perspective specialists
   - Code Reviewer: five-axis framework (correctness, readability, architecture, security, performance)
   - Test Engineer, Security Auditor, Web Performance Auditor
   - Each persona applies one viewpoint, never delegates to another persona (hard rule)

3. **Command Layer (When)**: User-facing orchestrators
   - `/build`: incremental single-task mode
   - `/build auto`: plan-once, execute-all with verification gates
   - `/ship`: fan-out three personas in parallel, merge results in main context
   - Never let commands call each other directly

## Key Design Insights

### Lazy Discovery + On-Demand Loading
- Plugin discovers all 24 skill metadata at startup (minimal cost)
- Full skill content only loaded when invoked
- Prevents bloat while keeping full capability available
- Validation happens at CI time, not runtime

### Explicit Composition Rules
- Commands orchestrate (top-level entry points)
- Personas invoke skills (single perspective)
- Personas never delegate to other personas (enforced on Claude Code subagents)
- This prevents composition ambiguity and circular dependencies

### Validation Infrastructure
- `validate-skills.js` runs in CI
- Checks: frontmatter presence, section completion, cross-reference validity
- Errors block CI; warnings are logged
- Prevents silent failures (e.g., typos in skill names break composition)

### Autonomous Execution with Quality Gates
- `/build auto` mode: plan phase creates all tasks, then executes them sequentially
- Each task has verification gate (tests must pass, code review must approve)
- Hard guards prevent shipping broken code even in autonomous mode
- Removes human stepping between tasks while maintaining safety

## Patterns Worth Stealing

1. **Vertical Slicing**: End-to-end per feature, not horizontal layers (Define→Plan→Build→Verify→Review→Ship)
2. **Process Over Prose**: Explicit workflows with testable exit criteria
3. **Anti-Rationalization Tables**: Documented excuses + counters prevent self-deception
4. **Frontmatter for Discovery**: Simple YAML in skill headers, parsed with regex (no external deps)
5. **Schema-Driven Validation**: Rules enforced at CI time, not runtime

## Implementation Highlights

- **Platform-agnostic**: Skills are Markdown-based, work across Claude Code, Cursor, Gemini CLI, Antigravity, Windsurf, OpenCode
- **No external runtime**: Validation uses Node.js + regex, no heavy dependencies
- **Modular extensibility**: Add new skills by following schema; validation catches errors automatically
- **Composition guarantees**: Hard rules (commands orchestrate, personas invoke) enforced in schema + documentation

## How This Applies Elsewhere

This architecture would work well for:
- Multi-agent systems where personas need strict composition boundaries
- Workflow engines with explicit phase transitions (state machines)
- Plugin systems that need lazy loading + validation
- Quality gates where execution must maintain safety invariants

The three-layer model prevents the common trap of agents calling agents recursively. By making orchestration explicit (Commands) and specialization explicit (Personas), the system stays understandable and maintainable even with 24+ skills.
