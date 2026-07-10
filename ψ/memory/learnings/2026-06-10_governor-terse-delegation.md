---
pattern: Governor role shines in terse handoffs + parallel execution
date: 2026-06-10
source: rrr: phase5-phase6-handoff session
concepts: ["governor", "delegation", "terse-communication", "parallel-execution", "multi-team"]
---

# Lesson: Governor Terse Delegation Pattern

## Core Insight

When you remove explanation and trust the executor's context, both parties move faster. A 16-line Phase 6 seed (5 tasks, scope, "Execute") was sufficient for Codex to start work without clarification.

## The Pattern

**Governor-to-Executor communication should be**:
1. Terse (no fluff, no context dump)
2. Scoped (what, not why)
3. Trusting (assume executor knows project)
4. Unblocking (don't wait for acknowledgment before next task)

**Codex started Phase 6 immediately without asking for detail.**

## Why It Works

- **Executors have context**: Phases 1-5 are known; the executor doesn't need re-briefing
- **Token efficiency**: 16 lines << 200 lines of elaboration
- **Velocity**: No interpretation overhead, no back-and-forth
- **Scalability**: This pattern works for 1 executor or 25 (federation)

## Anti-Pattern (What NOT to do)

❌ "Phase 6: Here's the context from Phase 1, here's why we chose this approach, here are the risks, here's what Tham might need, here's the optional backoff plan..."

✅ "Phase 6: Bridge integration + lease-based failover. Tasks: [5]. Execute."

## When to Apply

- Multi-agent teams where executor has full project context
- Governor role (architecture authority, not implementation)
- Phases advancing in sequence (executor already knows the narrative)
- Token budgets are tight

## When NOT to Apply

- New executor joining (fresh context needed)
- Highly experimental work (need discussion first)
- Significant architecture change (needs approval before execution)
- Executor has doubts (always ask before proceeding)

## Related

[[feedback-tham-role-boundary]] — Governor + Observer + Coordinator (never executor)
[[feedback-oracle-no-execute-rule]] — Hard rule: Oracle can't execute, must delegate
[[oracle-family-status-2026-06-09]] — 25 oracles requiring delegation at scale

---

## Session Context

Phase 5-6 handoff session (2026-06-10). Codex executing Phases 1-5 autonomously. Tham-Codex parallel-team bridge approved. Phase 6 (multi-team orchestration) seeded with 16-line brief. No follow-up questions. Codex started immediately.

**Lesson applied immediately and verified in real-time.**
