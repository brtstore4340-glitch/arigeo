# Agent Skills — Architecture Analysis

**Project:** addyosmani/agent-skills  
**Last Updated:** 2026-06-11  
**Type:** Skill and Agent Plugin for AI Coding Agents  
**Language:** Markdown, Bash, Node.js  
**Author:** Addy Osmani  
**License:** MIT

---

## Table of Contents

1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Core Concepts](#core-concepts)
4. [Module Organization](#module-organization)
5. [Skill Lifecycle](#skill-lifecycle)
6. [Persona System](#persona-system)
7. [Command Architecture](#command-architecture)
8. [Dependencies & Integrations](#dependencies--integrations)
9. [Entry Points](#entry-points)
10. [Data Flow](#data-flow)

---

## Overview

**Agent Skills** is a production-grade collection of engineering workflows and quality gates packaged as reusable instructions for AI coding agents. It encodes senior engineer practices across the entire software development lifecycle — from specification through shipping — in a format that can be consumed by Claude Code, Cursor, Gemini CLI, and other AI agent platforms.

### Philosophy

- Skills are **mandatory workflows**, not optional suggestions
- The system is **skill-driven**: intent maps to skills; skills invoke workflows
- **Personas** are specialist roles with single perspectives (code reviewer, security auditor)
- **Commands** are user-facing entry points that orchestrate skills and personas
- **Composition is explicit**: users or commands orchestrate, never persona-to-persona calls

---

## Directory Structure

```
agent-skills/
├── .claude/                          # Claude Code integration layer
│   └── commands/                     # Slash command definitions (/spec, /plan, /build, etc.)
│       ├── spec.md
│       ├── plan.md
│       ├── build.md
│       ├── test.md
│       ├── review.md
│       ├── code-simplify.md
│       ├── ship.md
│       └── webperf.md
│
├── .claude-plugin/                   # Plugin metadata & marketplace config
│   ├── plugin.json                   # Marketplace definition
│   └── marketplace.json
│
├── .gemini/                          # Gemini CLI integration
│   └── commands/                     # Gemini-specific commands
│
├── agents/                           # Specialist personas (not orchestrators)
│   ├── README.md                     # Persona design rules
│   ├── code-reviewer.md              # 5-axis code review persona
│   ├── security-auditor.md           # OWASP/threat model persona
│   ├── test-engineer.md              # Test coverage & TDD persona
│   └── web-performance-auditor.md    # Core Web Vitals persona
│
├── skills/                           # Core workflow library (24 skills)
│   ├── spec-driven-development/      # Specification-first workflow
│   │   └── SKILL.md
│   │
│   ├── planning-and-task-breakdown/  # Task decomposition
│   │   └── SKILL.md
│   │
│   ├── incremental-implementation/   # Thin-slice delivery
│   │   └── SKILL.md
│   │
│   ├── test-driven-development/      # RED→GREEN→REFACTOR cycle
│   │   └── SKILL.md
│   │
│   ├── code-review-and-quality/      # Quality gates before merge
│   │   └── SKILL.md
│   │
│   ├── code-simplification/          # Clarity and reuse optimization
│   │   └── SKILL.md
│   │
│   ├── shipping-and-launch/          # Production readiness checklist
│   │   └── SKILL.md
│   │
│   ├── git-workflow-and-versioning/  # Atomic commits, branching strategy
│   │   └── SKILL.md
│   │
│   ├── ci-cd-and-automation/         # Continuous integration setup
│   │   └── SKILL.md
│   │
│   ├── context-engineering/          # Managing agent context window
│   │   └── SKILL.md
│   │
│   ├── source-driven-development/    # Reading existing code patterns
│   │   └── SKILL.md
│   │
│   ├── debugging-and-error-recovery/ # Proving root cause
│   │   └── SKILL.md
│   │
│   ├── doubt-driven-development/     # High-risk/irreversible decisions
│   │   └── SKILL.md
│   │
│   ├── api-and-interface-design/     # API contract & surface design
│   │   └── SKILL.md
│   │
│   ├── frontend-ui-engineering/      # UI component design workflow
│   │   └── SKILL.md
│   │
│   ├── performance-optimization/     # Profiling & optimization
│   │   └── SKILL.md
│   │
│   ├── observability-and-instrumentation/ # Logging, metrics, tracing
│   │   └── SKILL.md
│   │
│   ├── deprecation-and-migration/    # Safe breaking changes
│   │   └── SKILL.md
│   │
│   ├── documentation-and-adrs/       # Architecture decision records
│   │   └── SKILL.md
│   │
│   ├── browser-testing-with-devtools/ # Chrome DevTools MCP integration
│   │   └── SKILL.md
│   │
│   ├── security-and-hardening/       # OWASP Top 10, auth/crypto
│   │   └── SKILL.md
│   │
│   ├── interview-me/                 # Project onboarding interview
│   │   └── SKILL.md
│   │
│   ├── idea-refine/                  # Ideation & refinement (divergent/convergent)
│   │   ├── SKILL.md
│   │   └── scripts/
│   │       └── idea-refine.sh
│   │
│   ├── using-agent-skills/           # Meta-skill: skill routing guide
│   │   └── SKILL.md
│   │
│   └── [21 more skill directories]
│
├── references/                       # Supplementary checklists (not skills)
│   ├── accessibility-checklist.md
│   ├── performance-checklist.md
│   ├── security-checklist.md
│   ├── testing-patterns.md
│   └── orchestration-patterns.md
│
├── docs/                            # Setup guides for different platforms
│   ├── cursor-setup.md
│   ├── gemini-cli-setup.md
│   ├── antigravity-setup.md
│   └── [platform-specific guides]
│
├── hooks/                           # Lifecycle hooks
│   ├── hooks.json                   # Hook registration
│   └── session-start.sh             # Session initialization
│
├── commands/                        # Additional command definitions
│   └── [extra commands]
│
├── scripts/                         # Utility & validation scripts
│   └── validate-skills.js           # YAML frontmatter validator
│
├── plugin.json                      # Base plugin metadata
├── .claude-plugin/plugin.json       # Claude Code plugin definition
├── CLAUDE.md                        # This project's CLAUDE.md instructions
├── AGENTS.md                        # Agent integration rules & patterns
├── README.md                        # User-facing documentation
├── CONTRIBUTING.md                  # Contributor guidelines
└── LICENSE                          # MIT License
```

---

## Core Concepts

### 1. **Skills**

A skill is a **mandatory workflow** with documented steps, exit criteria, and verification conditions. Each skill addresses a single practice across the development lifecycle.

**Anatomy of a SKILL.md:**

```yaml
---
name: {kebab-case-name}
description: {One-sentence what + trigger conditions}
---

# {Title}

## Overview
[Why this matters and what it solves]

## When to Use
[Trigger conditions and applicability]

## Common Rationalizations
[What developers tell themselves to skip this]

## Red Flags
[Signs you're doing this wrong]

## Verification
[How to know you've done it right]
```

**Example triggers:**
- New feature → `spec-driven-development` → `planning-and-task-breakdown` → `incremental-implementation` + `test-driven-development`
- Bug report → `debugging-and-error-recovery` (Prove-It pattern)
- API design → `api-and-interface-design`
- UI component → `frontend-ui-engineering`
- Pre-merge review → `code-review-and-quality`

**Key properties:**
- **Mandatory**: If intent matches, the skill must be invoked (no "this is too small" rationalizations)
- **Workflow-focused**: Steps and exit criteria, not just advice
- **Composable**: Skills reference other skills; can be chained
- **Verifiable**: Clear definition of "done"

### 2. **Personas** (Specialist Roles)

A persona is a **single-perspective specialist** with a defined role, domain authority, and output format. Personas are NOT orchestrators — they execute workflows, possibly invoking skills, but never call other personas.

**Four core personas:**

| Persona | Role | Domain | Output Format |
|---------|------|--------|---------------|
| `code-reviewer` | Senior Staff Engineer | 5-axis review | Critical/Important/Suggestion categories |
| `security-auditor` | Security Engineer | Vulnerability detection, OWASP | Audit report with threat/CVE findings |
| `test-engineer` | QA Engineer | Test strategy & coverage | Gap analysis + coverage report |
| `web-performance-auditor` | Perf Engineer | Core Web Vitals, LCP/FID | Performance audit with metrics |

**Rules:**
- One role, one perspective
- Output is a report (not a directive)
- May invoke skills (the "how")
- **Never** calls another persona
- On Claude Code: subagents only report back; Agent Teams enable peer communication

### 3. **Commands** (Entry Points)

Slash commands are user-facing orchestration points that map to phases of the development lifecycle.

**Seven canonical commands:**

| Command | Phase | Skill | Purpose |
|---------|-------|-------|---------|
| `/spec` | DEFINE | `spec-driven-development` | Write structured specification |
| `/plan` | PLAN | `planning-and-task-breakdown` | Decompose spec into tasks |
| `/build` | BUILD | `incremental-implementation` + `test-driven-development` | Implement one task (or all with `auto`) |
| `/test` | VERIFY | `test-driven-development` + `browser-testing-with-devtools` | Prove behavior with tests |
| `/review` | REVIEW | `code-review-and-quality` | 5-axis quality gate |
| `/code-simplify` | REVIEW | `code-simplification` | Optimize clarity and reuse |
| `/ship` | SHIP | `shipping-and-launch` | Parallel fan-out to specialists |
| `/webperf` | AUDIT | `performance-optimization` | Web-specific audit |

**Command structure:**

```yaml
---
description: What the user is doing
---

Invoke the agent-skills:{skill-name} skill.

[Detailed workflow steps]
```

### 4. **Intent → Skill Mapping**

The system is **demand-driven**: user intent automatically triggers the appropriate skills.

```
User intent                  → Skill chain
─────────────────────────────────────────────────────────
"Build a new feature"        → /spec → /plan → /build auto
"Fix a bug"                  → debugging-and-error-recovery (Prove-It)
"Code review PR"             → code-review-and-quality
"Design an API"              → api-and-interface-design
"Optimize performance"       → performance-optimization
"Deploy to production"       → shipping-and-launch
"Simplify this code"         → code-simplification
```

---

## Module Organization

### Skill Phases (By Development Lifecycle)

#### **DEFINE Phase** (Ideation → Specification)
- `interview-me` — Structured project onboarding questions
- `idea-refine` — Divergent/convergent ideation workflow
- `spec-driven-development` — Specification-first approach

#### **PLAN Phase** (Decomposition)
- `planning-and-task-breakdown` — Break spec into atomic tasks with dependencies

#### **BUILD Phase** (Implementation)
- `incremental-implementation` — Thin vertical slices
- `test-driven-development` — RED→GREEN→REFACTOR
- `context-engineering` — Managing agent token budgets
- `source-driven-development` — Reading existing code patterns
- `doubt-driven-development` — High-risk decision workflow
- `frontend-ui-engineering` — React/Vue component workflow
- `api-and-interface-design` — Contract-first API design

#### **VERIFY Phase** (Testing & Debugging)
- `browser-testing-with-devtools` — Chrome DevTools MCP
- `debugging-and-error-recovery` — Root cause proof workflow

#### **REVIEW Phase** (Quality Gates)
- `code-review-and-quality` — 5-axis review framework
- `code-simplification` — Clarity & reuse optimization
- `security-and-hardening` — OWASP & threat modeling
- `performance-optimization` — Profiling & optimization

#### **SHIP Phase** (Production Readiness)
- `git-workflow-and-versioning` — Atomic commits & branching
- `ci-cd-and-automation` — Pipeline setup & orchestration
- `deprecation-and-migration` — Safe breaking changes
- `documentation-and-adrs` — Docs & architecture records
- `observability-and-instrumentation` — Logging, metrics, tracing
- `shipping-and-launch` — Pre-launch checklist & rollback

#### **Meta/Cross-Cutting**
- `using-agent-skills` — Routing guide (OpenCode integration)

### Persona Composition

```
Main Agent / User
      │
      ├─→ /ship (orchestrator)
      │      ├─→ code-reviewer (parallel)
      │      ├─→ security-auditor (parallel)
      │      └─→ test-engineer (parallel)
      │           ↓
      │      [merge phase in main agent]
      │      ↓
      │      go/no-go decision
      │
      └─→ /review (single persona)
             └─→ code-reviewer
```

---

## Skill Lifecycle

### How a Skill Executes

1. **Intent Recognition** (by user or command)
   - User says "Build a feature" → `/build` command triggered
   - Command looks up its skill: `incremental-implementation`

2. **Skill Invocation**
   - Agent loads SKILL.md from disk
   - Reads frontmatter (name, description) + workflow steps
   - Frontmatter fields: `name` (kebab-case), `description` (what + triggers)

3. **Workflow Execution**
   - Agent follows documented steps in order
   - May invoke other skills (e.g., `incremental-implementation` calls `test-driven-development`)
   - Stops at **exit criteria** (spec approved, task passing, etc.)

4. **Verification**
   - Agent checks the "Verification" section
   - Confirms "done" criteria met
   - Returns control to orchestrator (command or user)

### Skill Chaining

Skills reference each other explicitly:

```markdown
For bug fixes, use the `debugging-and-error-recovery` skill.
For large features, follow `incremental-implementation` + `test-driven-development`.
Then continue with `code-review-and-quality`.
```

Cross-skill references are validated by `scripts/validate-skills.js`.

---

## Persona System

### Persona Invocation Models

#### **Direct Invocation** (Single Perspective)
```
User: "Review this PR for correctness"
  ↓
code-reviewer (one context window, one report)
  ↓
User sees: Critical/Important/Suggestion findings
```

#### **Slash Command Wrapper** (Single Persona)
```
User: /review
  ↓
command maps to skill: code-review-and-quality
  ↓
skill invokes persona: code-reviewer
  ↓
persona runs review workflow (may call other skills)
```

#### **Orchestrator Fan-Out** (Multiple Personas, Parallel)
```
User: /ship
  ↓
shipping-and-launch skill
  ↓
[parallel]
  ├─→ code-reviewer     → critical/important findings
  ├─→ security-auditor  → vulnerability list
  └─→ test-engineer     → coverage gaps
       ↓
  [merge phase, main agent only]
       ↓
  go/no-go decision + rollback plan
```

### Persona Output Format

Each persona produces a standardized report:

**code-reviewer:**
```markdown
## Review Summary
**Verdict:** APPROVE | REQUEST CHANGES

### Critical Issues
- [file:line] [issue] [fix]

### Important Issues
[...]

### Suggestions
[...]

### What's Done Well
[positive observation]

### Verification Story
- Tests: yes/no, observations
- Build: verified
```

**security-auditor:**
```markdown
## Security Audit
**Risk Level:** CRITICAL | HIGH | MEDIUM | LOW

### Findings
- [CVE/OWASP Top 10 category] [file] [issue]
- [Auth/authz concern]
- [Secrets/config exposure]

### Remediation Steps
[...]
```

### Claude Code Integration

Personas work as:
- **Subagents**: `Agent` tool with `subagent_type: "code-reviewer"`
  - Fresh context window per persona
  - Returns report to main session
  - Cannot spawn other subagents
  
- **Agent Teams teammates**: Referenced by name as peer agents
  - Can message each other (experimental)
  - Share coordination tools
  - Enables competing-hypothesis debugging

---

## Command Architecture

### Command Definition Format

```yaml
---
description: {User-facing description of what this does}
---

Invoke the agent-skills:{skill-name} skill.

{Workflow instructions specific to this command}
```

### Command Execution Flow

**Example: `/build auto`**

```
1. User invokes: /build auto
   ↓
2. Command loads: .claude/commands/build.md
   ↓
3. Parses mode: $ARGUMENTS = "auto"
   ↓
4. If mode = "auto":
     a. Check for SPEC.md (required)
     b. Check git status (must be clean)
     c. Load/generate tasks/plan.md
     d. Get single approval from user
     e. For each task:
        - Invoke incremental-implementation
        - Invoke test-driven-development
        - Run build, test, verify
        - Commit atomically
        - Mark task complete
   ↓
5. Summarize: tasks done, tests added, commits made
```

### Command Dependencies

```
/spec
  ↓ (generates SPEC.md)
/plan
  ↓ (reads SPEC.md, generates tasks/plan.md)
/build [auto]
  ↓ (reads plan, executes tasks)
/test
  ↓ (runs test suite)
/review
  ↓ (reviews latest commits or staged changes)
/code-simplify
  ↓ (simplifies reviewed code)
/ship (parallel)
  ├─→ code-reviewer
  ├─→ security-auditor
  └─→ test-engineer
       ↓ (merge → go/no-go)
```

---

## Dependencies & Integrations

### Platform Support

**Native Integration Points:**

| Platform | Integration Type | Status |
|----------|------------------|--------|
| Claude Code | Plugin (skills + agents) | Primary |
| Cursor | Rules import (`.cursor/rules/`) | Supported |
| Gemini CLI | Skills + commands | Supported |
| Antigravity CLI | Native plugin | Supported |
| OpenCode | Skill-driven execution model | Supported |
| Agent Teams | Personas as teammates | Experimental |

### External Tools & MCPs

- **Chrome DevTools MCP** — For `browser-testing-with-devtools` skill
- **Git** — For `git-workflow-and-versioning` commands
- **Package managers** — npm/yarn/pnpm for build/test
- **Test frameworks** — Jest, Vitest, Playwright, etc. (framework-agnostic skill)

### Validation Infrastructure

**validate-skills.js** checks:
- SKILL.md exists in every skill directory
- Frontmatter has `name` and `description` fields
- Name matches directory name
- Description ≤ 1024 characters
- Required sections present (with exemptions for legacy skills)
- Cross-skill references point to known skills (warning-level)

**Exit codes:** 0 = all clear, 1 = validation errors

---

## Entry Points

### For End Users

1. **Slash Commands** (Claude Code)
   - `/spec` — Begin specification phase
   - `/plan` — Generate plan from spec
   - `/build` or `/build auto` — Implement tasks
   - `/test` — Run tests
   - `/review` — Code review
   - `/code-simplify` — Optimize code
   - `/ship` — Production readiness
   - `/webperf` — Web performance audit

2. **Direct Persona Invocation**
   - "Review this for security" → `security-auditor`
   - "Check test coverage" → `test-engineer`
   - "Audit Core Web Vitals" → `web-performance-auditor`

### For Developers / Integrators

1. **Plugin Installation**
   ```bash
   # Claude Code marketplace
   /plugin marketplace add addyosmani/agent-skills
   /plugin install agent-skills@addy-agent-skills
   
   # Or local
   claude --plugin-dir /path/to/agent-skills
   ```

2. **Skill Invocation** (programmatic)
   ```
   Agent reads: skills/{skill-name}/SKILL.md
   Extracts: frontmatter + workflow steps
   Executes: step-by-step workflow
   ```

3. **Persona Invocation** (subagent model)
   ```
   Agent(
     subagent_type: "code-reviewer",
     description: "Review the PR for correctness"
   )
   ```

### Configuration Points

- **Plugin metadata:** `.claude-plugin/plugin.json`
  - Declares skills directory, agents list, commands path
  
- **Skill metadata:** Each `SKILL.md` frontmatter
  - Name, description, trigger conditions
  
- **Exemptions:** `scripts/validate-skills.js`
  - Per-skill section exemptions documented in code
  
- **Hooks:** `hooks/hooks.json`
  - Lifecycle events (SessionStart, etc.)

---

## Data Flow

### Specification → Execution Pipeline

```
┌─────────────────────────────────────────────────────────┐
│                    USER / CLI COMMAND                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Command Handler     │  (.claude/commands/*.md)
          │  (/spec, /plan,      │
          │   /build, etc.)      │
          └──────────────┬───────┘
                         │
                         ▼
          ┌──────────────────────────────┐
          │  Skill Loader                │  (skills/{name}/SKILL.md)
          │  - Parse frontmatter         │
          │  - Extract workflow steps    │
          │  - Validate structure        │
          └──────────────┬───────────────┘
                         │
                         ▼
          ┌──────────────────────────────┐
          │  Skill Execution Engine      │
          │  - Follow step order         │
          │  - Check exit criteria       │
          │  - Cross-skill references    │
          └──────────────┬───────────────┘
                         │
                         ▼
          ┌──────────────────────────────┐
          │  Optional: Persona Invocation│  (agents/{role}.md)
          │  - Load persona system prompt│
          │  - Run persona workflow      │
          │  - Collect report            │
          └──────────────┬───────────────┘
                         │
                         ▼
          ┌──────────────────────────────┐
          │  Output & Verification       │
          │  - Confirm done criteria     │
          │  - Return to orchestrator    │
          └──────────────────────────────┘
```

### Context Window Lifecycle

```
Session Start
    ↓
Load plugin (skills, agents, commands)
    ↓
User invokes command or skill
    ↓
Skill loaded into context (usually <10KB)
    ↓
Skill executed (steps + exit criteria)
    ↓
If skill calls skill:
  - Load next skill into context
  - Execute nested workflow
  - Return to parent
    ↓
If skill calls persona:
  - (Claude Code) Create subagent with fresh context
  - (Cursor/Gemini) Load persona system prompt into current context
    ↓
Skill completes, context cleaned
    ↓
Control returns to user or orchestrator
```

### Artifact Generation

**During workflow, agents create:**

1. **SPEC.md** — Single source of truth
   - Location: project root or `docs/SPEC.md`
   - Format: Markdown with objective, tech stack, commands, etc.
   
2. **tasks/plan.md** — Task breakdown
   - Location: `tasks/plan.md`
   - Format: Numbered tasks with acceptance criteria & dependencies
   
3. **Test files** — Proof of behavior
   - Location: Per project convention (tests/, spec/, __tests__/)
   - Format: Framework-agnostic (jest, vitest, pytest, etc.)
   
4. **Commits** — Atomic units of work
   - Message format: Conventional commits (feat/fix/docs/etc.)
   - Per-task commits in `/build auto` mode
   
5. **Reports** — Specialist perspectives
   - code-reviewer report (5-axis findings)
   - security-auditor report (CVE/OWASP findings)
   - test-engineer report (coverage gaps)

---

## Summary

**Agent Skills** is a **three-layer composition system**:

| Layer | What | Example | Purpose |
|-------|------|---------|---------|
| **Skill** | Workflow + steps + exit criteria | `test-driven-development` | The *how* — mandatory workflow |
| **Persona** | Single role + perspective | `code-reviewer` | The *who* — produces report |
| **Command** | Entry point + orchestration | `/ship` | The *when* — user-facing interface |

**Key design patterns:**

1. **Skills are mandatory** — if intent matches, the skill runs (no rationalizations)
2. **Personas don't orchestrate** — they play one role, produce one report
3. **Commands are orchestrators** — they compose skills and personas
4. **Composition is explicit** — validated at multiple levels (AGENTS.md, frontmatter, validate-skills.js)
5. **Cross-references are traceable** — skill references checked at validation time
6. **Context is efficient** — skills are small (<10KB), personas get fresh subagents on Claude Code
7. **Output is verifiable** — each workflow has explicit "done" criteria

The architecture enables **skill-driven autonomous execution** (e.g., `/build auto` with no human stepping between tasks) while maintaining **mandatory verification gates** at each phase (spec approval, test passing, review required before merge).
