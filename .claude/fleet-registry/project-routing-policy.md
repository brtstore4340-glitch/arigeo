---
title: Fleet Project Routing Policy
status: draft
last_edited_utc: 2026-07-09T12:44:52Z
last_verified_utc: 2026-07-09T12:44:52Z
scope: mission-control / fleet-registry
owner: agis-oracle
---

# Fleet Project Routing Policy

## Purpose

Define how work is routed when a primary lane, director, reviewer, or executor is unavailable.

This policy is designed to keep the fleet moving during outages without losing ownership, auditability, or state continuity.

## Routing principles

1. Keep the queue moving.
2. Preserve registry state.
3. Never drop a task silently.
4. Write every ownership change to the ledger.
5. Restore primaries only after explicit health checks.
6. Treat fallbacks as temporary.

## Fallback ladder

### Level 1
- Retry the primary lane briefly.
- If the failure is transient, keep ownership with the primary lane.

### Level 2
- Open the circuit for a cooldown window.
- Promote a fallback lane.
- Record the reason and TTL.

### Level 3
- If the fallback also fails, escalate to the coordinator/director lane.
- Keep the task visible in the registry and board.

### Level 4
- If no lane can execute safely, mark the task blocked.
- Preserve the evidence and request human intervention.

## Routing matrix

| Task type | Primary | Fallback | Notes |
|---|---|---|---|
| Review / critique / second opinion | Claude review lane | Gemini reviewer | Best default fallback path |
| Research / comparative analysis | Claude research lane | Gemini reviewer or Hermes researcher | Use Gemini for synthesis, Hermes for repo-local context |
| Execution / code changes | Claude builder lane | Hermes builder / Codex runner | Prefer the lane that can still write safely |
| Coordination / routing | Claude director / Zeus | Hermes lead / Agis | Keep the queue moving |
| Verification / drift check | Claude verifier | Agis + Hermes verifier role | Reconcile against live files and ledger |

## Required fields for fallback events

Any fallback activation event should include:
- `project_id`
- `primary_owner`
- `fallback_owner`
- `fallback_reason`
- `circuit_breaker_state`
- `degraded_until` if known
- `last_health_check` if known
- `related_task_id` if known
- `timestamp_utc`

## Recovery rule

Do not hand a task back to the primary lane until:
- a health check succeeds, and
- the primary has been marked available again, and
- the handback is written to the ledger.

[MARCUZ:Khun-Ram]
