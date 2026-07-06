---
pattern: "all tasks pass" hooks fail vacuously on zero-task sessions — fix must be at hook level, not session level
date: 2026-06-01
source: rrr: mission-control
concepts: [hooks, stop-hook, harness, orchestrator, meta-sessions]
---

# Stop Hook Vacuous Failure on Zero-Task Sessions

Any session consisting only of orientation, identity checks, or meta-skills (/who-are-you, /recap, /standup) will always fail a "all tasks pass" Stop hook because there are no tasks to evaluate.

The fix cannot be "always create a token task" — that's noise. The fix must be at the hook evaluation logic: if `task_count == 0`, treat the condition as vacuously true (or skip evaluation entirely).

Until the harness hook is patched, this feedback will fire every meta session. It is not a signal of failure — it is a structural gap between the hook's assumption (tasks always exist) and reality (some sessions are intentionally task-free).

## Diagnostic signature

- Stop hook fires immediately after /who-are-you or similar
- Message: "no tasks in transcript" or "condition cannot be satisfied"
- Branch: any (not code-related)

## Where the hook lives

NOT in `.claude/settings.json` (project or global). Must be at harness/FleetView platform level — inaccessible via file read. Ask user to locate `stopHook` or `condition` config in the harness layer.
