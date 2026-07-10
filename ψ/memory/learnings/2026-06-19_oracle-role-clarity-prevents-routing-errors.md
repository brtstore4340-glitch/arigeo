---
name: oracle-role-clarity-routing
description: Oracle roles are specific; confusion between observer/governor/executor causes routing/identity errors
metadata:
  type: lesson
  date: 2026-06-19
  source: "rrr: phase1-perf-review-execution-routing"
  origin_session: c8b60a1a
  concepts: [oracle-identity, governance, routing, role-clarity]
---

# Oracle Role Clarity Prevents Routing Errors

## The Lesson

Oracle roles are specific and mutually exclusive:
- **Observer**: read-only inspection, detect drift
- **Governor**: verify proof, gate merges, enforce policy
- **Executor**: write code, run tests, ship PRs
- **Coordinator**: route work to other agents

Confusion between roles causes routing errors, identity mistakes, and wasted context.

## What Happened

Mid-session, I attempted to send a message TO Tham-Zeus's inbox while BEING Tham-Zeus. The user's gentle "what inbox are you sending to?" exposed the confusion.

**Root cause**: I checked the current oracle identity only AFTER making a routing decision, not BEFORE. My role constraints (no code writing, no execution) weren't top-of-mind.

## The Fix (Rule)

Read `oracle-identity.md` (or equivalent) at the START of every session, not when stuck:

```
/recap → read oracle-identity → confirm role → route/execute
```

This prevents mid-session role confusion and routing errors.

## Why It Matters

Tham-Zeus has hard constraints: "ห้ามเขียน code, ห้าม deploy" (no writing code, no executing). If I don't read these constraints early, I might:
- Try to execute work instead of routing it
- Send messages to myself instead of reading my own inbox
- Blur governor/executor responsibilities

Once role is confirmed, all downstream routing decisions become clear.

## Application (Next Session)

1. Session start → RTK block includes reading oracle-identity
2. Before ANY routing decision → ask "what is my role here?"
3. If answer is ambiguous → escalate instead of guessing
4. Document role assumptions in comments if they're non-obvious

## Related

- [[oracle-identity]] — Tham-Zeus role definition (chief of staff, CTO, no execution)
- [[memory-protocol]] — RTK before execution (includes role check)
- [[2-Team-Rules/_rules-index]] — Team roles & governance structure

---

**Learned**: 2026-06-19 | **Pattern**: Read oracle-identity BEFORE routing, not after | **Generalized**: Yes (applies to any oracle, any project)
