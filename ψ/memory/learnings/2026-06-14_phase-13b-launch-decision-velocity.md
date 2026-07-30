---
pattern: Decision velocity is meta-performance in high-stakes sessions
date: 2026-06-14
source: rrr: /route/mission-control
concepts: [leadership, execution, time-management, parallel-execution]
---

# Decision Velocity as Meta-Performance

## The Lesson

In high-stakes parallel sessions (multiple critical decisions, multiple teams waiting), the ability to present options → recommend → move on the user's signal is more valuable than perfecting any single task.

This session locked Phase 13b AND approved Hermes transition AND briefed three oracles in 75 minutes because decision-making was fast and clear. Each time I said "Option A: [choice], Option B: [choice] — recommend A" and Tham said "yes," we moved to the next decision without rehashing.

Contrast: Vitest debugging loop. When I hit a blocker (worktree isolation), I cycled on solutions for 30 minutes instead of escalating immediately to user with "skip or fix?" That loop burned time without moving toward launch.

## Rule to Apply

When you hit a blocker and the task is non-critical-path:
- Do NOT cycle on solutions expecting the blocker to resolve
- Escalate to user immediately (< 5 min) with binary or ternary choice
- User picks → you execute → move on

In parallel-execution scenarios (multiple teams waiting, multiple decisions pending), user decision velocity multiplies your throughput. Protect that velocity by surfacing choices fast.

## Why It Matters

Phase 13b was critical: launch is Mon 09:00, sync is Thu 15:00, team is waiting. Every decision delay cascades. By making choices explicit and quick, Tham could give final sign-off in one session instead of asking for follow-up calls.

Similarly, Hermes transition could have been three separate meetings (audit, plan, approval). Instead: one session, all three locked.

## Counter-Example: Vitest

Spent 30 minutes trying to fix failing tests in-place (blocked by worktree, attempted multiple approaches) when the decision should have been: "These tests fail, Phase 13b is non-blocking on them, Mon launch is critical — skip tests now and fix next week?"

I should have offered that choice within 5 minutes of first failure.

## How to Recognize You're Stuck in Loop

- You've tried the same approach 2+ times and it's still not working
- The task is not critical path (if it were, you'd feel pressure to fix it)
- The user hasn't explicitly asked you to keep trying
- You're justifying the loop ("just one more attempt")

→ Stop. Ask the user for a decision.

## Application to Hermes Transition

Phase 1–3 is 12 weeks of work. It's parallel to Phase 13b. If I encounter blockers in Phase 1 (e.g., Tham is too busy to draft ORACLE_ROLES.md), the right move is NOT to try to draft it myself — it's to surface it as a decision: "Tham, do you want to own ORACLE_ROLES.md, or delegate to Khun-Ram?"

This lesson is about protecting decision velocity in parallel execution.
