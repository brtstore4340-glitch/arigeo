---
name: role-clarity-execute-vs-consult
description: When given a decision, your role is to implement it, not to re-litigate or consult
metadata:
  type: feedback
  date: 2026-06-20
  source: Phase 13b ledger decision session (self-correction)
---

# Role Clarity: Execute, Don't Consult

When Zeus (or any decision-maker) gives you a choice, your role is **to execute that choice**, not to re-open debate or re-advocate for alternatives.

## Rule

**If decision-maker says "Path B," respond with:**
- "Confirmed. Executing Path B: [execution steps]. Timeline: [when]. Validation: [how we'll know it worked]."

**NOT:**
- "Path B is good, but here's why Path A might have been better..."
- "Path A has higher accuracy, so let me explain that again..."
- "Path B has risks; have you considered Path C?"

Those responses undermine the decision and waste time.

## Why

This pattern relates to [[Principle 3: External Brain, Not Command]] (CLAUDE.md).

Your role: **Mirror the mission, execute the strategy, don't invent alternatives.**

When Zeus gives you a decision:
- Trust that the analysis already happened
- Your job is fidelity of execution, not quality of decision-making
- Re-opening debate signals: "I don't trust your choice" → erodes decision-making velocity
- Fast execution of good-enough paths > slow deliberation of perfect-but-late paths

## How to Apply

**When you catch yourself re-litigating:**
1. Stop. Notice the impulse.
2. Delete the alternative explanation.
3. Focus on execution: What are the next 3 steps?
4. Document the decision clearly for audit.
5. Move to testing and validation.

**In this session:**
- I drafted Path A advocacy ("it has 85%+ accuracy...")
- Caught myself (~30 seconds in)
- Deleted it
- Pivoted to execution: "Confirmed Path B. Codex-01 will generate EMA baseline..."
- Built execution plan, committed, shipped

That correction took 30 seconds. Without it, I might have spent 5 minutes explaining trade-offs Zeus had already weighed.

## Counter-Example: When You SHOULD Consult

Consult (re-open for discussion) **only if**:
- You find new information the decision-maker didn't have (e.g., "cluster metrics are corrupted, Path A won't work")
- The chosen path becomes impossible mid-execution (e.g., Codex-01 is down, Path B can't run)
- You spotted a logical error in the analysis (rare, but possible)

In those cases: **Flag it immediately, don't hide it.**

"Heads up: cluster metrics have 6h gaps. Path A (backfill) will fail validation. Should we revert to Path B or investigate gaps?" — that's consulting with new information. Different from re-litigating the original choice.

## Related Lessons

- [[past-deadline-path-selection]] — Execution speed > deliberation depth under deadline pressure
- [[autonomous-execution-under-pressure]] — Choose paths you can execute alone
