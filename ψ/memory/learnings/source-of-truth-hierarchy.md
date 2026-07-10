---
pattern: Source-of-truth hierarchy for fleet continuity and reset-safe execution
date: 2026-06-14
source: mission-control doctrine consolidation
concepts: [source-of-truth, continuity, fleet-state, verification, reset-safety]
---

# Source-of-Truth Hierarchy

## Related doctrine
- Foundation map: `docs/plans/2026-06-14-claude-fable-to-hermes-constitution-map.md`
- Fleet index: `docs/agents/fleet-doctrine-index.md`
- Hermes operator runtime doctrine: `docs/agents/hermes-operator-doctrine.md`
- Role doctrines: `docs/agents/tham-lead-doctrine.md`, `docs/agents/zeus-constitution.md`, `docs/agents/codex-constitution.md`, `docs/agents/khun-ram-constitution.md`, `docs/agents/aeimathes-constitution.md`, `docs/agents/lens-constitution.md`, `docs/agents/aris-constitution.md`

## Why this exists

In a multi-agent fleet, confusion rarely comes from lack of data.
It comes from mixing different kinds of truth:
- remembered truth
- current repo truth
- runtime truth
- handoff truth
- inferred truth

When these are mixed without priority, agents drift, status claims become unreliable, and resets destroy context.

This hierarchy defines what wins when sources disagree.

---

## The hierarchy

### 1. Live repo truth
This is the highest source of truth for implementation and artifact claims.

Examples:
- current file contents
- git diff/status/history
- test output
- build output
- manifests and imports
- generated artifacts that can be inspected directly

Use for:
- code claims
- file claims
- implementation status
- validation status

Rule:
- if the claim is about code or artifacts, inspect the repo first

---

### 2. Live runtime / fleet truth
This is the highest source of truth for execution and coordination claims.

Examples:
- tmux panes
- process state
- active ports/endpoints
- kanban ownership/comments
- current worktree state
- service health checks

Use for:
- whether an agent is active
- whether a service is up
- who owns a task right now
- whether a route/process/session is actually live

Rule:
- if the claim is about something running now, inspect runtime state first

---

### 3. Durable continuity surfaces
This is the highest source of truth for reset-safe project memory and handoff state.

Examples:
- `ψ/inbox/handoff/...`
- decision notes
- retrospectives
- doctrine docs
- shared checkpoint files
- structured handoff manifests

Use for:
- why a decision was made
- what the next action should be after reset
- what another agent needs to continue safely
- what context must survive provider/model changes

Rule:
- if the state matters after reset, it must be written here or it does not reliably exist

---

### 4. Durable personal memory
This is for stable facts, not mutable runtime state.

Examples:
- user preferences
- stable environment quirks
- durable role conventions
- recurring workflow expectations

Use for:
- communication preferences
- persistent environment facts
- durable conventions that are painful to rediscover

Do not use for:
- current git state
- current process state
- current blockers
- current task progress
- mutable product facts

Rule:
- memory stores stable facts, not the live world

---

### 5. Session recall / past conversation context
This is useful but lowest-priority truth.

Examples:
- recalled summaries
- old handoff text in chat
- remembered discussion outcomes
- session_search results before live verification

Use for:
- orientation
- locating likely files or decisions
- reconstructing intent before checking live state

Rule:
- conversation recall is a lead, not final proof

---

## Decision rule when sources conflict

If two sources disagree:
1. prefer the higher layer
2. verify live if the higher layer is mutable
3. write the resolved state back to the proper durable surface if others will need it

Example:
- chat summary says service is up
- health check says connection refused
- truth = health check wins

Example:
- memory says a branch was clean yesterday
- `git status` shows modifications now
- truth = git wins

Example:
- a prior handoff says Codex owns the task
- kanban shows reassigned to another owner
- truth = kanban/runtime ownership wins

---

## Role-specific usage

### Zeus
- starts from continuity surfaces
- verifies repo/runtime state before dispatching or summarizing
- writes checkpoints before reset risk

### Tham
- starts from live coordination state plus continuity surfaces
- routes work based on verified ownership, scope, and current fleet conditions
- keeps operational governance explicit for the lead profile

### Codex
- starts from repo truth
- verifies with tests/build/runtime checks before saying done
- escalates when architecture truth is missing or conflicting

### Khun-Ram
- curates continuity surfaces
- separates durable memory from active execution state
- preserves provenance when turning runtime facts into recorded history

### Aeimathes
- starts from design/problem truth
- checks live implementation/runtime only when needed to validate architectural claims

### Lens
- starts from live repo/runtime/task state to frame the current decision scene
- separates observed state from inferred state before recommending a path

### Aris
- starts from the actual diff, files, and validation output
- treats prior review memory as secondary to direct code and proof

---

## Anti-drift rules

- Mutable facts require live verification before synthesis.
- If state must survive reset, write it outside the active chat window now.
- Artifact-based handoffs beat transcript replay.
- Do not let remembered summaries outrank current files/processes.
- Do not store live task state in durable personal memory.

## Hermes-specific read order

When the task is about Hermes runtime behavior rather than generic fleet governance:
1. check live repo truth for the relevant source/config/profile files
2. check live runtime truth for gateway, adapter, socket, and reply-loop state
3. check the Hermes operator doctrine for session/profile/auth/bridge rules
4. only then synthesize architectural conclusions or migration advice

Reason:
- Hermes failures often look like prompt or model issues when they are actually session-key, profile-isolation, auth-lifecycle, or bridge-readiness problems

---

## Compact doctrine

If the claim is about code, check the repo.
If the claim is about something running, check runtime state.
If the claim must survive reset, write it to a continuity surface.
If the claim is only remembered from chat, treat it as a lead until verified.
