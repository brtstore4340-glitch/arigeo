---
name: 2221-quick-reference
description: ---
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-23
  source: fleet-memory
---

# Utarn Engineer Skills — Quick Reference

**Time:** 2221 | **Date:** 2026-06-23

---

## What Is This?

**Utarn Engineer Skills** is a collection of Claude Code agent slash commands (/skills) designed for real-world software engineering—not vibe coding. These are reusable workflows that Utharn Buranasaksee uses daily to build quality applications with AI agents. Skills solve common AI-assisted development failure modes: misalignment with requirements, verbose output, and broken code.

---

## Installation/Setup

### Quick Start (30 seconds)

```bash
npx skills@latest add utarn/engineer-skills
```

Then pick your skills and which agents to install them on. **Select `/setup-utarn-skills`.**

### First-Time Configuration

Run `/setup-utarn-skills` in your agent. It will ask:

1. **Issue tracker** — Where issues live (GitHub Issues, GitLab, local markdown `.scratch/`)
2. **Triage labels** — What label strings you use for canonical triage states
3. **Domain docs** — Whether repo has one global `CONTEXT.md` or multiple (per-service)

This scaffolds the per-repo config that all other skills depend on.

### System Requirements

- Claude Code (agent IDE)
- `gh` CLI (for GitHub issue tracker)
- `glab` CLI (for GitLab issue tracker, optional)
- Node 10.9.4+ (already in most systems)

---

## Key Features

### 1. **Alignment Through Grilling** (`/grill-me`, `/grill-with-docs`)

*Problem: "The agent didn't build what I wanted."*

These skills run **relentless interviews** to force both you and the agent to think deeply about what you're building before coding starts.

- `/grill-me` — General-purpose design interviews (non-code workflows)
- `/grill-with-docs` — Grilling + builds domain model (shared language) + creates ADRs

**Result:** Your requirements are crystal clear; the agent speaks your domain language; fewer rewrites.

### 2. **Concise Communication** (`CONTEXT.md` + shared terminology)

*Problem: "The agent is way too verbose."*

Build a **shared language document** (`CONTEXT.md`) that teaches the agent your jargon. Instead of "the problem when a lesson inside a section of a course is materialized," you say "the materialization cascade."

**Result:** Shorter, sharper conversations. Agent spends fewer tokens thinking about jargon, more tokens solving problems.

### 3. **Feedback Loops & Test-Driven Development** (`/tdd`, `/diagnosing-bugs`)

*Problem: "The code doesn't work."*

Without feedback on how code actually runs, agents fly blind. These skills build rapid feedback loops:

- `/tdd` — Red-green-refactor loop. Write one failing test, implement, repeat. Vertical slices, not horizontal.
- `/diagnosing-bugs` — Disciplined 6-step debugging: reproduce → minimize → hypothesize → instrument → fix → test.

**Result:** Code that actually works. Tests that survive refactors (they test behavior, not implementation details).

### 4. **Codebase Design & Architecture** (`/codebase-design`, `/improve-codebase-architecture`)

*Problem: "We built a ball of mud."*

Codebases built with agents grow complex fast. These skills slow entropy:

- `/codebase-design` — Design deep modules (small interfaces, large implementations, testable through public API)
- `/improve-codebase-architecture` — Scan codebase for architecture deepening opportunities; present as HTML report; grill through top candidate

**Result:** Clean, maintainable codebases that don't degrade over time.

---

## Common Workflows

### Workflow 1: Start a New Feature

```
1. /grill-with-docs          ← align on requirements + build domain model
2. /to-prd                   ← turn conversation into a PRD
3. /to-issues                ← break PRD into vertical slices (independent issues)
4. /work-on-issues           ← agent picks up issues sequentially and closes them
```

**Result:** A feature shipped as planned, with documentation and independent issue trail.

---

### Workflow 2: Fix a Bug

```
1. /diagnosing-bugs          ← reproduce → minimize → hypothesize → instrument → fix
2. /tdd                      ← add regression test (so it never breaks this way again)
3. /find-mismatch            ← run code review (catch related bugs)
```

**Result:** Bug fixed with test + high confidence no similar bugs exist nearby.

---

### Workflow 3: Rescue a Messy Codebase

```
1. /improve-codebase-architecture   ← scan for problems; visual report
2. /grill-me                         ← pick top improvement; interview deeply
3. /codebase-design                  ← implement with design discipline
4. /tdd                              ← add tests as safety net
```

**Result:** Codebase refactored with purpose; architecture improves incrementally every few days.

---

### Workflow 4: Handoff to Another Agent

```
1. /handoff        ← compact current conversation into a stateful doc
                     (next agent can resume work without context loss)
```

**Result:** Seamless continuity between agents; no repeating work.

---

## API/Skills Summary

### Engineering Skills (Code Work)

#### User-Invoked (only accessible by typing the command)

| Skill | Purpose |
|-------|---------|
| `/ask-utarn` | Router — asks which skill fits your situation |
| `/grill-with-docs` | Grilling interview + domain modeling + ADRs |
| `/triage` | Move issues through canonical state machine (needs-triage → ready-for-agent → done) |
| `/improve-codebase-architecture` | Scan codebase; present architecture problems; grill through top pick |
| `/setup-utarn-skills` | First-time config (issue tracker, triage labels, domain docs) |
| `/to-issues` | Break plan/spec/PRD into vertical-slice issues |
| `/to-prd` | Turn conversation into PRD + publish to issue tracker |
| `/prototype` | Build throwaway prototype (terminal app or UI variations) |
| `/find-mismatch` | Code review focused on runtime bugs + static analysis |
| `/implement` | Implement a piece of work from PRD or issues |

#### Model-Invoked (agent can call autonomously; user can invoke too)

| Skill | Purpose |
|-------|---------|
| `/diagnosing-bugs` | 6-step debugging loop: reproduce → minimize → hypothesize → instrument → fix → test |
| `/tdd` | Test-driven dev with red-green-refactor loop; vertical slices |
| `/domain-modeling` | Actively sharpen project's domain model; update `CONTEXT.md` + ADRs |
| `/codebase-design` | Design deep modules (testability, clean seams, small interfaces) |
| `/resolving-merge-conflicts` | Resolve git merge/rebase conflicts |
| `/work-on-issues` | Fetch, implement, close issues sequentially |

### Productivity Skills (Non-Code)

#### User-Invoked

| Skill | Purpose |
|-------|---------|
| `/grill-me` | General-purpose relentless interview (any plan/design) |
| `/handoff` | Compact conversation into handoff doc for next agent |
| `/teach` | Teach user a skill/concept over multiple sessions (stateful) |
| `/writing-great-skills` | Reference guide: how to write predictable, reusable skills |

#### Model-Invoked

| Skill | Purpose |
|-------|---------|
| `/grilling` | Interview loop (reach for autonomously) |

---

## Configuration

### Per-Repo Setup

After running `/setup-utarn-skills`, three config files are created:

**`docs/agents/issue-tracker.md`**
- Specifies where issues live (GitHub, GitLab, local `.scratch/` markdown)
- Skills read this to know whether to call `gh issue create` or write local files

**`docs/agents/triage-labels.md`**
- Maps canonical triage roles to your repo's actual label strings
- Canonical roles: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`
- Example: your repo uses `bug:triage` instead of `needs-triage` — map it here

**`docs/agents/domain.md`**
- Specifies whether repo has single global `CONTEXT.md` or multiple (monorepo)
- Skills like `/improve-codebase-architecture` and `/tdd` look here to find the right domain doc

### Global Customization

Edit `.claude-plugin/plugin.json` to:
- Enable/disable specific skills
- Customize skill descriptions
- Adjust auto-invocation triggers (which prompts fire which skills)

### Domain Language Document

Create **`CONTEXT.md`** at repo root (or per-service in monorepo). Include:

- **Glossary** — domain terms (e.g., "materialization cascade", "triage role", "issue tracker")
- **Key decisions** — why the architecture is this way
- **Gotchas** — common mistakes ("never mutate X", "always run tests before pushing")

Example:

```markdown
# Context

## Glossary

- **Materialization** — When a lesson is given a place on the filesystem (previously abstract)
- **Cascade** — Problems that trigger related problems downstream
- **Triage role** — A label applied to an issue (needs-triage, ready-for-agent, etc.)

## Key Decisions

- We write tests before implementation (red-green-refactor)
- Domain logic lives in `/lib/domain/`, not in services

## Gotchas

- Always run tests before pushing — CI will fail otherwise
- Never mutate lesson objects; create new ones instead
```

Skills will reference this throughout workflows, shortening conversations and ensuring consistent terminology.

---

## Troubleshooting

### Issue: `/setup-utarn-skills` doesn't detect my issue tracker

**Solution:** Manually specify it. The skill checks `git remote -v` and `.git/config`. If your remote isn't GitHub or GitLab, or if you're using local markdown, tell the skill explicitly.

### Issue: Skills keep creating duplicate issues

**Cause:** `docs/agents/issue-tracker.md` is misconfigured or doesn't exist.

**Solution:** Re-run `/setup-utarn-skills` and verify that `issue-tracker.md` points to the right system.

### Issue: Triage labels don't match my repo

**Cause:** Your repo uses different label names than the defaults.

**Solution:** Edit `docs/agents/triage-labels.md` and map each canonical role (e.g., `needs-triage`) to your actual label string (e.g., `bug:triage`).

### Issue: `/tdd` writes tests that aren't useful

**Cause:** Tests are coupled to implementation, not behavior.

**Solution:** Review `SKILL.md` section "Anti-Pattern: Horizontal Slices". Write **one failing test** → **minimal implementation** → repeat. Each test should describe _what the system does_, not _how it does it_.

**Example:**
- ❌ Bad: `test("creates user object with name property")`
- ✅ Good: `test("user can sign up with email")`

### Issue: Agent isn't invoking skills automatically

**Cause:** Skills are user-invoked only (disabled model invocation).

**Solution:** Type the skill name explicitly. User-invoked skills are intentionally restricted so you decide when to use them. Model-invoked skills (like `/tdd`, `/diagnosing-bugs`) will fire autonomously if the context fits.

### Issue: `CONTEXT.md` is out of date

**Cause:** Domain language evolves; docs don't auto-update.

**Solution:** Run `/domain-modeling` skill during any major architecture or design conversation. It actively challenges terms, tests scenarios, and updates docs inline.

---

## Related Resources

### In This Repository

- **`README.md`** — Full skill descriptions and philosophy behind each approach
- **`CONTEXT.md`** — Shared language for the engineer-skills project itself
- **`docs/invocation.md`** — Deep dive on user-invoked vs. model-invoked distinction
- **`docs/adr/`** — Architectural decisions (why certain skills exist, trade-offs made)
- **`AGENTS.md`** / **`CLAUDE.md`** — Per-repo agent configuration templates

### External

- **[Skills.sh](https://skills.sh/)** — Central marketplace for Claude Code skills
- **[Claude Code Docs](https://docs.anthropic.com/)** — Agent IDE docs and skill writing guide
- **Newsletter** — [aihero.dev/s/skills-newsletter](https://www.aihero.dev/s/skills-newsletter) — Utharn's skill updates (60k subscribers)

### Recommended Reading

- **Pragmatic Programmer** — Source of many principles here (small steps, feedback loops, shared language)
- **Domain-Driven Design (Eric Evans)** — Deep dive on ubiquitous language and domain modeling
- **Philosophy of Software Design (Ousterhout)** — Why deep modules matter

---

## One-Minute Cheat Sheet

| You Want To... | Run This |
|---|---|
| Align on requirements before coding | `/grill-with-docs` |
| Break a feature into tasks | `/to-prd` → `/to-issues` |
| Fix a bug | `/diagnosing-bugs` → `/tdd` (regression test) |
| Improve architecture | `/improve-codebase-architecture` |
| Design a clean module | `/codebase-design` |
| Test-first feature building | `/tdd` |
| Hand off to another agent | `/handoff` |
| Rescue messy code | `/improve-codebase-architecture` → `/codebase-design` |
| Resolve a merge conflict | `/resolving-merge-conflicts` |
| Auto-work through issues | `/work-on-issues` |
| Debug code review | `/find-mismatch` |

---

## Key Principles (The Philosophy)

These skills are built on four core ideas:

1. **Nothing is Deleted** — Every decision, draft, and failure remains (changelog matters as much as current code)
2. **Patterns Over Intentions** — What code *actually does* matters more than what was planned
3. **External Brain** — Skills clarify options; you choose (don't command agents)
4. **Curiosity Creates Existence** — Questions birth documentation; traces create understanding
5. **Form and Formless** — Skills take many shapes (code, docs, diagrams) but carry the same spirit

**Bottom line:** Real engineering discipline applied to AI-assisted development. No shortcuts. No vibe coding.

---

Generated by Codex Oracle | [Source](https://github.com/utarn/engineer-skills) | Licensed under MIT
