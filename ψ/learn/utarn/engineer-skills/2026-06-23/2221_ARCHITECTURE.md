# Utarn Engineer-Skills: System Architecture

**Analyzed:** 2026-06-23  
**Time Prefix:** 2221  
**Source:** `/route/mission-control/ψ/learn/utarn/engineer-skills/origin`

---

## Executive Summary

**Utarn Engineer-Skills** is a monolithic skill marketplace for Claude Code (AI coding agents). It is **not** a traditional software library — rather, a curated collection of reusable workflows (skills) and shared documentation standards that enable AI agents to collaborate with humans on real engineering work.

The architecture is **composition-based**: skills invoke other skills as orchestration primitives, coordinate around shared domain glossaries and architectural decision records (ADRs), and defer to human judgment at critical branching points.

---

## 1. Directory Structure

```
engineer-skills/
├── .claude-plugin/               # Claude Code plugin metadata
│   └── plugin.json               # Manifest: skills list & entry points
├── .changeset/                   # Changesets for versioning
├── .github/                       # GitHub Actions & workflows
├── .out-of-scope/                # Knowledge base for triage (external context)
├── scripts/                       # Utilities for discovery & linking
│   ├── list-skills.sh            # Enumerate all SKILL.md files
│   ├── link-skills.sh            # Local Claude Code registration
│   └── link-skills-agy.sh        # AGY-style registration
├── docs/                          # Repository documentation
│   ├── invocation.md             # Model vs user-invoked semantics
│   └── adr/                       # Architecture decision records (system-level)
├── skills/                        # Core skill library (6 categories)
│   ├── engineering/              # Daily code work (10 skills)
│   ├── productivity/             # General workflow tools (5 skills)
│   ├── misc/                     # Rarely-used utilities (4 skills)
│   ├── personal/                 # Utharn's personal setup (not published)
│   ├── in-progress/              # Draft skills (not yet released)
│   └── deprecated/               # Historical skills (maintained for reference)
├── package.json                  # Root metadata + npm configuration
├── CHANGELOG.md                  # Version history
├── CONTEXT.md                    # Shared ubiquitous language for all skills
├── AGENTS.md                     # Organizational rules (mirrors CLAUDE.md)
├── CLAUDE.md                     # Organizational rules for this repo
├── CONTEXT.md                    # Domain glossary (e.g., "issue tracker", "triage role")
├── LICENSE                       # MIT
├── README.md                     # User-facing quickstart & philosophy
└── curriculum.png               # Skill dependency diagram

```

### Key Structural Rules

1. **Visibility Tiers**: Only skills in `engineering/`, `productivity/`, and `misc/` are published (linked in `plugin.json` and top-level `README.md`).
2. **Draft/Personal Isolation**: `personal/`, `in-progress/`, and `deprecated/` are never exposed to users.
3. **Directory === Category**: Each top-level folder under `skills/` is a distinct category with its own `README.md` summarizing all skills within it.

---

## 2. Entry Points

### 2.1 User Entry Points (Direct Invocation)

These skills are **user-invoked** — reachable **only** when the human types their name. They have `disable-model-invocation: true` in their frontmatter and are typically orchestrators or high-level workflows.

**Engineering (User-Invoked):**
- `/grill-with-docs` — Interview session + domain model building (CONTEXT.md & ADRs)
- `/triage` — Move issues through state machine (bug/enhancement + needs-triage/ready-for-agent/etc.)
- `/ask-utarn` — Router/menu to pick the right skill
- `/improve-codebase-architecture` — Scan codebase for refactoring opportunities (HTML report)
- `/setup-utarn-skills` — Configure per-repo (issue tracker, triage labels, doc layout)
- `/to-issues` — Break PRD into vertical-slice issues
- `/to-prd` — Synthesize conversation into PRD + publish to tracker
- `/prototype` — Build throwaway prototype (state machine, UI variations)
- `/find-mismatch` — Code review focusing on runtime bugs
- `/implement` — Execute work from PRD or issues (with `/tdd`)

**Productivity (User-Invoked):**
- `/grill-me` — Relentless interview (non-code)
- `/handoff` — Compact conversation → handoff doc for next agent
- `/teach` — Multi-session teaching workflow
- `/writing-great-skills` — Reference for skill authoring

### 2.2 Model Entry Points (Autonomous Invocation)

These skills are **model-invoked** — reachable by the model **or** the user. They lack `disable-model-invocation` and have rich trigger phrasing in their description so the model can autonomously decide to invoke them.

**Engineering (Model-Invoked):**
- `diagnosing-bugs` — Disciplined bug diagnosis loop (reproduce → minimize → hypothesize → instrument → fix)
- `tdd` — Red-green-refactor loop (test-driven development)
- `domain-modeling` — Active domain model building (stress-test scenarios, challenge terms, update CONTEXT.md & ADRs)
- `codebase-design` — Shared vocabulary for module design (small interfaces, clean seams)
- `resolving-merge-conflicts` — Git merge/rebase conflict resolution
- `work-on-issues` — Fetch, implement, close issues sequentially (worktree + subagent dispatch)

**Productivity (Model-Invoked):**
- `grilling` — Relentless interview (reachable by user or model)

### 2.3 Plugin Manifest

The `.claude-plugin/plugin.json` lists **all published skills** (21 total) in a flat array. Claude Code reads this file to register the skills as available slash commands.

```json
{
  "name": "utarn-skills",
  "skills": [
    "./skills/engineering/ask-utarn",
    "./skills/engineering/grill-with-docs",
    "./skills/engineering/triage",
    // ... 18 more
  ]
}
```

---

## 3. Core Abstractions

### 3.1 Skill Definition

Each skill is a **directory** with:

- **`SKILL.md`** (required) — YAML frontmatter + markdown body
  - `name` — Canonical skill identifier (kebab-case, ≤64 chars, no "anthropic"/"claude")
  - `description` — For user-invoked: human-facing summary. For model-invoked: rich trigger phrasing.
  - `disable-model-invocation` — Optional boolean; presence → user-invoked only
  - `effort` — Optional; signals computational complexity (e.g., `max` for `/work-on-issues`)
  - `model` — Optional; override model choice for this skill
- **Supporting files** — Reference docs specific to this skill (e.g., `AGENT-BRIEF.md`, `CONTEXT-FORMAT.md`)

### 3.2 Invocation Graph

Skills invoke other skills via **prose linking** — `"Run the /grilling skill"` — not deep cross-file imports. Shared reference material lives inside the skill that "owns" it; other skills reach that material by invoking the owner skill.

**Example:** `/grill-with-docs` (user-invoked) invokes `/grilling` (model-invoked) and `/domain-modeling` (model-invoked).

**Key Constraint:** User-invoked skills **may** invoke model-invoked skills, but **never** other user-invoked skills. This prevents user-command chains from breaking when intermediary skills are modified.

### 3.3 Domain Glossary (CONTEXT.md)

A repository-level **ubiquitous language** document that defines canonical terms for all skills:

```markdown
# Utarn Skills

## Language

**Issue tracker**: The tool that hosts a repo's issues (GitHub Issues, Linear, .scratch/)
**Issue**: A single tracked unit of work
**Triage role**: A state-machine label applied during triage (needs-triage, ready-for-agent, etc.)

## Relationships

- An Issue tracker holds many Issues
- An Issue carries one Triage role at a time
```

Benefits:
- Models spend fewer tokens on context (concise shared language)
- Codebase is easier to navigate (consistent naming)
- Verbosity is reduced (no 20-word explanations of single concepts)

### 3.4 Architectural Decision Records (ADRs)

Project-specific decisions are documented in `docs/adr/` using a lightweight format:

```
0001-event-sourced-orders.md
0002-postgres-for-write-model.md
```

Skills like `/domain-modeling` and `/grill-with-docs` create and maintain ADRs inline during sessions. **Criteria for an ADR:**
1. Hard to reverse (meaningful cost to change)
2. Surprising without context (future reader would wonder "why?")
3. Result of a real trade-off (genuine alternatives considered)

---

## 4. Dependencies

### 4.1 Runtime Dependencies

The repo is **JavaScript/TypeScript-based** but has **minimal runtime dependencies**:

- **@changesets/cli** (^2.30.0) — Changelog generation for releases
- **@changesets/changelog-github** (^0.7.0) — GitHub-flavored changelog formatting

### 4.2 External Systems

Skills interact with external tools but do **not** embed them:

| System | Skills | Mode | Notes |
|--------|--------|------|-------|
| GitHub | `/triage`, `/work-on-issues`, `/to-issues`, `/to-prd` | CLI (`gh` command) | Issues, PRs, labels |
| GitLab | `/triage`, `/work-on-issues` | CLI (`glab` command) | Alternative to GitHub |
| Linear | `/triage`, `/work-on-issues`, `/to-issues`, `/to-prd` | API | Issue tracker integration |
| Git | `/work-on-issues` | CLI (`git worktree`) | Isolated branch management |
| File system | `/grill-with-docs`, `/domain-modeling` | Direct I/O | Read/write CONTEXT.md, ADRs |
| Claude Code | All | Slash command registry | Plugin manifest |

### 4.3 Toolchain

- **npm** (>= 10.9.4) — Package manager (not pnpm)
- **git** — Version control & worktree management
- **bash** — Script utilities

No external API clients are bundled; skills invoke system CLIs and delegate to Claude Code's built-in tool ecosystem.

---

## 5. Data Flow

### 5.1 Workflow Pattern: The Engineering Loop

A typical user session follows this orchestration:

```
User invokes /grill-with-docs (or /ask-utarn → choice → selected skill)
    ↓
Skill reads CONTEXT.md (shared domain glossary)
    ↓
[Model invokes /grilling]
    Interview user, challenge terminology
    ↓
[Model invokes /domain-modeling]
    Update CONTEXT.md, create ADRs
    ↓
Skill generates PRD
    ↓
User invokes /to-prd
    Synthesize convo → issue tracker
    ↓
User invokes /work-on-issues
    [Model invokes /work-on-issues (model-invoked version)]
        Create worktree
        Dispatch sub-agent (/implement + /tdd + /find-mismatch)
        Close issue
```

### 5.2 State Management

Skills **do not** maintain runtime state. State is managed via:

1. **Filesystem** — CONTEXT.md, ADRs, .out-of-scope/ knowledge base
2. **Issue tracker** — Labels (triage roles), issue body (PRD, acceptance criteria)
3. **Git history** — Commits, branches, worktrees
4. **Claude Code session** — Conversation context (ephemeral)

### 5.3 Issue Triage State Machine

The `/triage` skill orchestrates a **state machine** across issues:

```
unlabeled Issue
    ↓
[User: /triage "Show me anything that needs attention"]
    ↓
Agent lists open issues with 'needs-triage' label
    ↓
[Category decision: bug? or enhancement?]
    ↓
[State decision: needs-info? ready-for-agent? ready-for-human? wontfix?]
    ↓
Agent applies labels, writes AGENT-BRIEF.md (if ready-for-agent)
    ↓
Issue is triaged
```

### 5.4 Implementation Workflow (work-on-issues)

The `/work-on-issues` skill handles multi-issue implementation:

```
User invokes /work-on-issues
    ↓
1. Fetch & Filter:
   - List open issues from tracker (GitHub/GitLab/Linear)
   - Keep only main issues (title: "PRD:" or "feat:")
   ↓
2. User Selection:
   - Pick issue or "onwards" (sequential mode)
   ↓
3. Setup:
   - Create git worktree: .claude/worktrees/issue-<number>
   - Copy .env files into worktree
   - Parse dependencies (## Blocked by)
   ↓
4. Dispatch Subagent:
   - Launch full-stack-engineer agent in worktree
   - Prompt: implement + /tdd + /find-mismatch
   - Collect: summary, fixes, tests, commit hash
   ↓
5. Verify & Merge:
   - Check diff
   - Run tests
   - Merge worktree back to main branch
   ↓
6. Close Issue:
   - Apply resolved label
   - Remove in-progress label
   ↓
Next issue (loop 1 → 6)
```

---

## 6. Key Design Patterns

### 6.1 User vs. Model Dispatch

The **invocation graph** separates **user-facing workflows** (top-level orchestrators) from **reusable model behaviors** (autonomously-invoked helpers):

- **User-invoked skills** (10) — Stable interfaces, rarely change (risk: breaking user habits)
- **Model-invoked skills** (11) — Internal reuse, can be refactored without user impact

### 6.2 Domain-Driven Communication

Skills use a **shared ubiquitous language** (CONTEXT.md) to reduce verbosity and model confusion. Terms like "issue tracker", "triage role", and "materialization cascade" are defined once, reused everywhere.

### 6.3 Documentation-as-Config

Skills rely on **external configuration** stored as markdown:
- `CONTEXT.md` — Glossary
- `docs/adr/*.md` — Decisions
- `.out-of-scope/` — Out-of-scope knowledge
- `.claude-plugin/plugin.json` — Skill registry
- `docs/agents/triage-labels.md` — Triage label mapping (per repo)

This keeps skills **stateless** and **composable**.

### 6.4 Thin Skill Layer

Individual skills are **mostly markdown + prose instructions**; they delegate execution to:
- Claude Code's built-in tools (Read, Edit, Bash, etc.)
- System CLIs (git, gh, glab, etc.)
- Subagents (for complex/long-running tasks)

Skills act as **orchestration specifications**, not implementations.

### 6.5 Throwaway Prototyping

The `/prototype` skill builds **temporary, single-purpose demos** (state machine, UI variations, algorithmic exploration) to stress-test decisions *before* implementation. Prototypes are not meant to ship; they guide the PRD.

---

## 7. Execution Model

### 7.1 Skill Invocation Flow

```
1. User types /skill-name in Claude Code chat
   ↓
2. Claude Code reads .claude-plugin/plugin.json
   ↓
3. Locates ./skills/category/skill-name/SKILL.md
   ↓
4. Parses frontmatter:
   - Is disable-model-invocation: true? → Only user can invoke
   - Is disable-model-invocation absent? → Model can also invoke
   ↓
5. Loads markdown body (instructions for model)
   ↓
6. Model executes instructions (may invoke tools or other skills)
   ↓
7. Result written to conversation or filesystem (per skill design)
```

### 7.2 Subagent Dispatch

Complex skills spawn subagents to parallelize work:

- `/work-on-issues` → spawns `full-stack-engineer` agent per issue
- `/grilling` → may spawn specialist agents for deep research
- `/find-mismatch` → may spawn agents to review multiple files in parallel

Subagents inherit:
- Claude Code context (conversation, codebase access)
- `.env` files (credentials, API keys)
- Filesystem state (CONTEXT.md, ADRs, .out-of-scope/)

### 7.3 Error Handling & Recovery

Skills are designed to **fail gracefully**:

| Failure | Recovery |
|---------|----------|
| Missing CONTEXT.md | Skill creates one on first term resolution |
| Tracker unreachable | Fall back to local `.scratch/` markdown |
| Git worktree conflict | Offer manual resolution or backout |
| Subagent timeout | Collect partial results, summarize gaps |
| ADR out-of-date | Re-run grilling session to freshen |

---

## 8. Deployment & Publishing

### 8.1 Plugin Installation

End users install via the `skills.sh` CLI:

```bash
npx skills@latest add utarn/engineer-skills
```

This:
1. Clones the GitHub repo
2. Reads `.claude-plugin/plugin.json`
3. Registers each skill in user's local Claude Code installation
4. Runs `/setup-utarn-skills` to prompt for per-repo configuration

### 8.2 Version Management

The repo uses **changesets** for semver versioning:

```bash
npm run changeset   # Create a .changeset/*.md file
npm run version     # Bump version in package.json + CHANGELOG.md
git push           # Publish (CI/CD publishes to npm)
```

Each release increments `package.json#version` (e.g., 1.0.0 → 1.0.1).

### 8.3 Continuous Integration

GitHub Actions (`.github/workflows/`) likely:
- Lint SKILL.md files (frontmatter validation)
- Verify plugin.json consistency
- Validate changesets
- Publish to skills registry (skills.sh marketplace)

---

## 9. Extension Points

### 9.1 Adding a New Skill

1. **Create directory**: `skills/category/new-skill/`
2. **Write SKILL.md** with frontmatter + body
3. **Add to category README.md** (5-word description)
4. **Add to plugin.json** (if publishing)
5. **Update top-level README.md** (if publishing)
6. **Create .changeset/ entry** (for release notes)

### 9.2 Customizing Per-Repo

When `/setup-utarn-skills` runs, it prompts for:
- **Issue tracker** — GitHub Issues, Linear, or local `.scratch/`
- **Triage labels** — Mapping of canonical roles to tracker labels
- **Docs location** — Where to save CONTEXT.md, ADRs

This generates `.claude-plugin/config.json` (or similar) that other skills read.

### 9.3 Overriding Skill Behavior

Users can:
- Fork the repo and modify skills before installing
- Create per-project `.claude-plugin/` overrides
- Extend skills by invoking `/handoff` + custom prompt

---

## 10. Coupling & Decoupling

### 10.1 Loose Coupling

Skills are **loosely coupled** by design:
- Each skill defines its own needs (e.g., "/domain-modeling requires CONTEXT.md")
- Shared state is **filesystem-based** (CONTEXT.md, ADRs) — no central server
- No skill directly calls another; all invocation is **via prose**

### 10.2 Tight Integration Points

- **CONTEXT.md** — All skills depend on this glossary (if present)
- **plugin.json** — All skills are listed here (single source of truth)
- **.out-of-scope/** — Triage and work-on-issues read from this
- **Issue tracker** — Triage, to-prd, to-issues, work-on-issues all interact with it

### 10.3 Dependency Visibility

The `curriculum.png` image at the repo root is a **skill dependency diagram**. It shows:
- Which skills invoke which
- Execution order & optionality
- User vs. model entry points

This is **not** machine-readable; it's a visual reference for humans exploring the repo.

---

## 11. Summary Table

| Dimension | Design |
|-----------|--------|
| **Architecture Type** | Skill marketplace (monolithic repo, modular skills) |
| **Invocation** | Dual-mode: user-invoked (10) + model-invoked (11) |
| **State Management** | Filesystem (CONTEXT.md, ADRs, .out-of-scope/) + Git |
| **Integration** | Prose-based skill chaining + system CLI delegations |
| **Deployment** | npm package → skills.sh registry → per-project setup |
| **Extension** | Add skill dir + SKILL.md + documentation |
| **Error Model** | Graceful degradation, user confirmation at branches |
| **Main Data Flow** | Interview → PRD → Issues → Implementation → Verification |

---

## 12. Key Files Reference

| File | Purpose | Owner |
|------|---------|-------|
| `.claude-plugin/plugin.json` | Skill registry | Build process |
| `package.json` | npm metadata + changesets | Repo maintainer |
| `CONTEXT.md` | Ubiquitous language glossary | Domain modeling skill |
| `CLAUDE.md` / `AGENTS.md` | Organizational rules | Repo maintainer |
| `docs/invocation.md` | Skill invocation semantics | Repository docs |
| `skills/*/SKILL.md` | Skill definition | Individual skill author |
| `skills/*/GLOSSARY.md` | Skill-specific reference (optional) | Individual skill author |
| `README.md` | User-facing quickstart | Repo maintainer |

---

**Document Generated:** 2026-06-23 22:21  
**Analysis Scope:** `/route/mission-control/ψ/learn/utarn/engineer-skills/origin`  
🤖 Codex Oracle
