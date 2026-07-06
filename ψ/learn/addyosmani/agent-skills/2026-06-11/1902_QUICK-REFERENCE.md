# Agent Skills — Quick Reference Guide

## What Is This?

**Agent Skills** is a production-grade collection of 24 engineering workflows and best practices for AI coding agents (Claude Code, Cursor, Copilot, Gemini CLI, etc.). It packages the kind of opinionated, process-driven guidance that senior engineers use when building reliable software — ensuring AI agents follow consistent quality gates across every phase of development (spec → plan → build → test → review → ship).

---

## Installation

### Claude Code (Recommended)

**From marketplace:**
```bash
/plugin marketplace add addyosmani/agent-skills
/plugin install agent-skills@addy-agent-skills
```

**SSH key error?** Use HTTPS instead:
```bash
/plugin marketplace add https://github.com/addyosmani/agent-skills.git
/plugin install agent-skills@addy-agent-skills
```

**Local development:**
```bash
git clone https://github.com/addyosmani/agent-skills.git
claude --plugin-dir /path/to/agent-skills
```

### Other Tools

- **Cursor:** Copy `skills/*.md` files into `.cursor/rules/`
- **Antigravity CLI:** `agy plugin install https://github.com/addyosmani/agent-skills.git`
- **Gemini CLI:** `gemini skills install ./agent-skills/skills/`
- **Windsurf:** Add skill contents to Windsurf rules configuration
- **OpenCode:** Uses skill-driven execution via `skill` tool
- **GitHub Copilot:** Use agent definitions from `agents/` as personas

---

## Key Features & Capabilities

### 7 Slash Commands (Lifecycle Stages)

| Command | Stage | Purpose |
|---------|-------|---------|
| `/spec` | Define | Write specifications before coding |
| `/plan` | Plan | Break specs into small, atomic tasks |
| `/build` | Build | Implement incrementally with tests |
| `/test` | Verify | Prove the code works (red-green-refactor) |
| `/review` | Review | Quality gates before merging |
| `/code-simplify` | Review | Reduce complexity while preserving behavior |
| `/ship` | Ship | Deploy with confidence and monitoring |
| `/webperf` | Verify | Specialist web performance audit |

**Advanced mode:** `/build auto` generates the plan AND implements all tasks in one approved pass (still test-driven, still atomic commits).

### 24 Skills Organized by Phase

#### Define (3 skills)
- **interview-me** — Extract actual requirements via one-question-at-a-time dialogue
- **idea-refine** — Divergent/convergent thinking to turn rough ideas into concrete proposals
- **spec-driven-development** — Write PRDs covering objectives, structure, testing, boundaries

#### Plan (1 skill)
- **planning-and-task-breakdown** — Decompose specs into small, verifiable tasks with acceptance criteria

#### Build (7 skills)
- **incremental-implementation** — Thin vertical slices with safe defaults and rollback-friendly changes
- **test-driven-development** — Red-green-refactor, test pyramid (80/15/5), DAMP over DRY
- **context-engineering** — Feed agents the right information at the right time
- **source-driven-development** — Ground decisions in official framework/library documentation
- **doubt-driven-development** — Adversarial fresh-context review of high-stakes decisions
- **frontend-ui-engineering** — Component architecture, design systems, WCAG 2.1 AA accessibility
- **api-and-interface-design** — Contract-first design, Hyrum's Law, error semantics, boundary validation

#### Verify (2 skills)
- **browser-testing-with-devtools** — Chrome DevTools MCP for runtime inspection (DOM, console, network, perf)
- **debugging-and-error-recovery** — Five-step triage: reproduce, localize, reduce, fix, guard

#### Review (4 skills)
- **code-review-and-quality** — Five-axis review, change sizing (~100 lines), severity labels, splitting strategies
- **code-simplification** — Chesterton's Fence, Rule of 500, preserve exact behavior
- **security-and-hardening** — OWASP Top 10 prevention, auth patterns, secrets, dependency auditing
- **performance-optimization** — Core Web Vitals targeting, profiling workflows, bundle analysis

#### Ship (6 skills)
- **git-workflow-and-versioning** — Trunk-based development, atomic commits, commit-as-save-point pattern
- **ci-cd-and-automation** — Shift Left, feature flags, quality gate pipelines, feedback loops
- **deprecation-and-migration** — Code-as-liability mindset, compulsory/advisory patterns, zombie code removal
- **documentation-and-adrs** — Architecture Decision Records, API docs, document the *why*
- **observability-and-instrumentation** — Structured logging, RED metrics, OpenTelemetry, symptom-based alerting
- **shipping-and-launch** — Pre-launch checklists, staged rollouts, rollback procedures, monitoring

#### Meta (1 skill)
- **using-agent-skills** — Maps incoming work to the right skill and defines shared operating rules

### 4 Specialist Personas

| Agent | Role | Use Case |
|-------|------|----------|
| **code-reviewer** | Senior Staff Engineer | Five-axis review with "would a staff approve?" standard |
| **test-engineer** | QA Specialist | Test strategy, coverage analysis, the Prove-It pattern |
| **security-auditor** | Security Engineer | Vulnerability detection, threat modeling, OWASP assessment |
| **web-performance-auditor** | Web Perf Engineer | Core Web Vitals audit, metric-honesty rule, Quick/Deep modes |

---

## Usage Patterns & Examples

### Pattern 1: Single Slash Command (User Entry Point)

```bash
# User asks: "I need to build a notification system"
/spec
→ Agent interviews user, writes PRD
→ User approves
→ Agent suggests next step: /plan
```

### Pattern 2: Full Lifecycle (Explicit)

```bash
/spec      # Define requirements, write PRD
# User reviews & approves
/plan      # Break into tasks (design API, write tests, implement, etc.)
# User reviews & approves
/build     # Implement first task incrementally
/test      # Run tests, verify
/review    # Code review (five-axis)
/ship      # Pre-flight checklist, stage rollout, monitor
```

### Pattern 3: Autonomous Build (`/build auto`)

```bash
/spec      # Define & get approval
/plan      # Define & get approval
/build auto
→ Implements all planned tasks in sequence
→ Each task: write spec → write test → implement → commit → verify
→ Pauses on failures or risky steps for human approval
→ No human stepping *between* tasks (only between phases)
```

### Pattern 4: Specialist Reviews

```bash
# Parallel async reviews before shipping
→ code-reviewer (staff engineer perspective)
→ security-auditor (vulnerability detection)
→ test-engineer (coverage analysis)
→ Synthesized report to human
```

### Pattern 5: Refactoring Workflow

```bash
# Code exists but needs cleanup
/code-simplify
→ Identifies complexity via Chesterton's Fence
→ Preserves exact behavior (tests must pass)
→ Applies reuse/efficiency improvements
```

### Pattern 6: Web Performance Audit

```bash
/webperf
→ Core Web Vitals scan
→ Frontend and backend checklists
→ Metric-honesty verification
→ Quick mode (surface issues) or Deep mode (thorough diagnosis)
```

---

## How to Run / Deploy

### For Claude Code Users

1. Install plugin (see Installation section above)
2. Open or create a code repo
3. Type `/spec` (or any slash command) and press Enter
4. Agent follows the structured workflow and asks for approval at each phase
5. Each step produces verified output before proceeding

### For Cursor Users

1. Copy skill markdown files into `.cursor/rules/`
2. Reference them in cursor instructions or trigger rules
3. Cursor will follow the same lifecycle workflows

### For Other Tools

Each tool has setup documentation in `docs/`:
- `docs/antigravity-setup.md`
- `docs/gemini-cli-setup.md`
- `docs/windsurf-setup.md`
- `docs/copilot-setup.md`
- `docs/opencode-setup.md`

---

## Important Concepts to Understand

### 1. **Skill Anatomy**
Every skill has the same structure:
- **Frontmatter** — YAML `name` and `description`
- **Overview** — What the skill does
- **When to Use** — Triggering conditions
- **Process** — Step-by-step workflow (the actual work)
- **Rationalizations** — Common excuses to skip steps + rebuttals
- **Red Flags** — Signs something's wrong
- **Verification** — Evidence requirements (not "seems right")

### 2. **Anti-Rationalization Tables**
Every skill includes a table of common shortcuts (e.g., "I'll add tests later") with documented counter-arguments. This prevents agents from skipping critical steps.

### 3. **Verification is Non-Negotiable**
Every skill ends with *evidence requirements* — tests passing, build output, runtime data, metrics. "Seems right" is never sufficient.

### 4. **Process > Prose**
Skills are workflows agents *follow*, not reference docs they *read*. Each has checkpoints, exit criteria, and atomic units of work.

### 5. **Change Sizing**
Most skills enforce ~100-line changes. Bigger changes require splitting because they're harder to review, easier to mess up, and slower to land.

### 6. **Six Core Phases**
```
DEFINE (Spec)  →  PLAN (Tasks)  →  BUILD (Implement + Test)
    ↓                 ↓                      ↓
VERIFY (Prove)  →  REVIEW (Gate)  →  SHIP (Deploy)
```
Do not skip phases. Do not proceed to the next phase without validation.

### 7. **Skill Composition**
- User (or slash command) orchestrates
- Slash commands map to lifecycle phases
- Skills are mandatory when their intent matches
- Personas are optional specialists (code-reviewer, test-engineer, etc.)
- Personas do NOT invoke other personas

### 8. **Git Workflow**
Skills enforce:
- Trunk-based development (branches are temporary)
- Atomic commits (one logical change per commit)
- Commit-as-save-point (each commit is production-ready)
- ~100-line changes (reviewable chunks)

### 9. **Best Practices Encoded**
Skills bake in practices from Google's engineering culture and SWE Book:
- **Hyrum's Law** in API design (explicit contracts)
- **Beyonce Rule** in testing ("if you liked it you should have put tests on it")
- **Test Pyramid** (80% unit, 15% integration, 5% e2e)
- **Chesterton's Fence** in simplification (understand *why* before removing)
- **Shift Left** in CI/CD (catch issues early)
- **DAMP over DRY** in testing (descriptive > factored)

---

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| **Agent skips the spec** | Invoke `/spec` explicitly; skills have anti-rationalization tables that prevent shortcuts |
| **Tests fail after implementation** | Red-green-refactor: write failing test first, then implement. TDD skill enforces this. |
| **Code review takes too long** | Change sizing. Split changes at ~100 lines. Five-axis review is fast at that size. |
| **Missing requirements mid-build** | Should not happen. `/spec` phase surfaces assumptions before code. If it does, go back to `/spec` and restart. |
| **Agent claims "I'll refactor later"** | Not allowed. Rationalizations table in every skill explicitly rejects this. Refactor now, safely, with tests. |
| **Unclear what skill applies?** | Read `skills/using-agent-skills/SKILL.md` — it maps intent to skill. |
| **Want to reference a skill directly?** | All skills live in `skills/{skill-name}/SKILL.md`. Load it into your agent context or `.claude` rules. |
| **Need a specialist review?** | Run `/ship` (runs code-reviewer + security-auditor + test-engineer in parallel) or invoke personas individually. |
| **Performance regression after changes?** | Run `/webperf` for Core Web Vitals audit or invoke performance-optimization skill. |
| **Security concern?** | Invoke security-auditor persona or security-and-hardening skill. OWASP Top 10 checklist provided. |

---

## Quick-Start Checklist

- [ ] Install plugin via `/plugin marketplace add` or clone locally
- [ ] Read `README.md` to understand the 7 slash commands
- [ ] Start with `/spec` for any new work (not shortcuts)
- [ ] Follow the gated workflow: spec → plan → build → test → review → ship
- [ ] Use `/build auto` once plan is approved (removes stepping between tasks)
- [ ] Invoke specialist personas (code-reviewer, test-engineer, etc.) before shipping
- [ ] Check `skills/using-agent-skills/SKILL.md` if unsure which skill applies
- [ ] Reference `references/` for testing, security, performance, and accessibility checklists

---

## Resources

- **GitHub:** https://github.com/addyosmani/agent-skills
- **Main README:** `/README.md` (full feature overview)
- **Setup guides:** `/docs/` (per-tool installation)
- **Contributing:** `/CONTRIBUTING.md` (how to add new skills)
- **Skill anatomy:** `/docs/skill-anatomy.md` (format specification)
- **Agent setup:** `/AGENTS.md` (for OpenCode and other platforms)

---

**TL;DR:** Agent Skills is a library of 24 structured workflows that enforce production-grade engineering practices across every phase of software development. Install it, invoke `/spec` to start, and let the skills guide you from idea to ship. Every skill includes verification gates, anti-rationalization tables, and atomic units of work.
