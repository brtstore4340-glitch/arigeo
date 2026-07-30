---
name: past-deadline-execution
description: When deadlines have passed, default paths become optimal — execute, don't re-litigate
metadata:
  type: feedback
  date: 2026-06-20
  source: Phase 13b ledger decision session
---

# Past Deadlines Eliminate Optionality

When a deadline has already passed and a safe default fallback exists, debating alternatives is academic exercise. The optimal move is execution, not deliberation.

## Rule

**If deadline < current time AND default fallback exists → execute default immediately. Don't re-evaluate alternatives.**

## Why

- Time already spent. Debate cost is dead weight.
- Fallback paths are designed to be safe and autonomous (no external dependencies).
- Re-litigating trades momentum for premature closure (closure = bad; momentum = shipping).
- Under time pressure, the safest path (minimum external coordination) is the best path.

## How to Apply

When you see a multi-path decision where:
1. Deadline has passed (current time > deadline)
2. Default fallback is documented ("if no decision, do X")
3. Options require external coordination (Paths A, C) vs. autonomous execution (Path B)

→ Execute the autonomous default immediately.

**Example from this session:**
- Deadline: 2026-06-19 EOD
- Current: 2026-06-20 15:15 (past deadline by ~12 hours)
- Default fallback: "Path B (Codex-01 synthetic) will trigger Monday if undecided"
- Action: Choose Path B, document, execute → 3 minutes instead of 30 minutes of debate

## Related Lessons

- [[autonomous-execution-under-pressure]] — Paths with zero external dependencies are resilient
- [[role-clarity-execute-vs-consult]] — When given a decision, implement; don't re-open it
