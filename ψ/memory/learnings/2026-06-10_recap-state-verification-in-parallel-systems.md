---
pattern: Treat tool outputs as hypothesis, not gospel. Verify critical state independently in parallel execution environments.
date: 2026-06-10
source: rrr: mission-control
concepts: [background-jobs, async-execution, state-verification, governor-role]
---

# Recap State Verification in Parallel Systems

## Problem

In background jobs with idle time between sprint cycles, tool outputs (like `/recap`, status checks, file listings) are **snapshots in time**, not live ground truth. Systems with parallel execution (25 Oracles running Phases 6-9 simultaneously) change state faster than tools can report.

**Symptom**: Trusted `/recap` output showing branch `feat/phm-v2-phase2-2026-06-07` and "4 modified oracle pointers" — but within minutes, `git status` showed branch `chore/oracle-sync-2026-06-09` with "1 modified file (type annotation)". The tool wasn't wrong; the world had moved on while I was reading its output.

## Root Cause

In **sequential execution** (typical session): Tools can report fresh state because between tool calls, nothing changes.

In **parallel execution** (this session): Multiple Oracles are running Phases 6-9 simultaneously. The `.jsonl` files, git state, file system, and phase completion summaries are all being written by background processes. A tool snapshot taken at 14:16 is already stale by 14:21.

## The Fix

**Always spot-check critical state independently after any tool output that claims to show "current" status.**

For Oracles:
- After `/recap`, immediately run: `git status --short` (one-liner, <200ms)
- After `/dig`, cross-check with: `git log --oneline` (verify commit is actually there)
- After "check for file X", run: `ls -la /path/to/X` (don't trust tool output)

**Cost**: +0.5s per tool call. **Benefit**: Prevent wrong assumptions that cascade downstream.

## Implementation

Add a verification prompt to the session workflow:

```
After high-level status check:
[ ] Tool said: _______________
[ ] Reality check: _______________
[ ] Match? Yes / No
If No → re-evaluate plan before proceeding.
```

## Generalization

**For any Oracle working in federated/parallel systems:**

1. **Assume state is ≤5 min stale** after any tool output
2. **Verify before trusting** for critical decisions (branch state, file existence, phase completion)
3. **Spot-check thresholds**:
   - If change impacts git/commits: verify with `git status`
   - If change impacts phases/completion: verify with `ls -la` for summary files
   - If change impacts tool output: re-run the tool (drift detection)

## Metrics

- **Decision errors prevented**: 1 (would have assumed stale branch state)
- **Extra verification time**: <1 min total
- **Friction points reduced**: 1 (recap cache lag surfaced and handled)

## Related Lessons

- [[phase5-phase6-handoff]] (2026-06-10) — specificity in handoffs enables async verification
- [[one-line-fixes-are-low-friction]] (2026-06-10) — type fixes don't need batching; ship immediately

---

**Author**: Tham (ธาม)  
**Source Session**: 2026-06-10 14:14-14:25 (Phase 6-9 cascade monitoring)
