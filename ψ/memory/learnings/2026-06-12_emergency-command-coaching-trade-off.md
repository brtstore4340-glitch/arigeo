---
name: emergency-command-coaching-trade-off
description: Coaching vs. direct commands under time pressure — when to escalate to executable orders
metadata:
  type: feedback
  pattern: oracle-coordination
  date: 2026-06-12
  source: session aa8878a0 (Phase 13 kickoff execution)
---

# Emergency Commands vs. Coaching Under Time Pressure

**Rule**: Coaching-based guidance works for exploratory tasks with flexible timelines. But when:
- Oracle is blocked with multiple pending clarifications
- Hard deadline is approaching (< 20 min remaining)
- Coaching has been deployed but no action taken

Then: **Escalate to emergency direct commands immediately.** Do NOT wait for coaching to "work." Do NOT add more monitoring gates hoping they'll unlock.

**Why**: In this session, both Aeimathes and Codex-01 were stuck in clarification loops (18+ pending items each, waiting for explicit direction). At 21:26, I deployed coaching-style messages ("specify which task to run" / "choose: spin up planning or execute implementation"). By 21:30 status check (21:45 was the midpoint gate), both still had 18+ items pending. Zero progress.

I could have:
- A) Add more coaching and monitoring (waste 5+ minutes)
- B) Escalate to direct executable commands: "Build these 3 files by 21:50. Do NOT ask for clarification" (high-risk but time-aligned)

I chose A at first, then user pushed C (escalate now). When I deployed direct commands at 21:32, both oracles activated within 5 minutes. Deliverables complete by 21:50.

**How to apply**:
1. **Coaching works when**: Oracle has flexibility (no hard deadline) OR clear path to unblock (just needs guidance on next step)
2. **Direct commands work when**: Hard deadline + oracle stuck in clarification loop. Issue is not "I don't understand" but "I'm waiting for explicit direction."
3. **The escalation signal**: If status check shows zero progress after one coaching cycle AND deadline is approaching, escalate immediately. Don't wait for second cycle.
4. **Direct command format**: State the deliverable, deadline, and "Do NOT ask for clarification" (breaks the loop), plus high-priority signal (🚨).

**Related memories**: [[feedback-tham-role-boundary]] (orchestrator vs. executor), [[feedback-proactive-execution]] (Zeus authority to make escalation calls), [[orchestration-trade-off-articulation]] (surface speed-vs-safety trade-off, let human choose)

**Related decision**: The coaching approach failed because it was still conditional — "what do you need?" waits for the oracle to formulate a response. Direct commands ("build X by Y, execute now") skip the formulation step and activate execution.

---

## Escalation Decision Tree

```
Situation: Oracle blocked, unclear task

Is deadline approaching (< 20 min remaining)?
  ├─ YES → Hard deadline + no time for coaching
  │   ├─ Has coaching been deployed?
  │   │   ├─ NO → Deploy coaching (fast cycle, 3-5 min)
  │   │   └─ YES → Check status after 5 min
  │   │       ├─ Progress? → Wait, coaching working
  │   │       └─ No progress → ESCALATE to direct commands NOW
  └─ NO → Flexible timeline
      ├─ Has oracle shown progress on coaching?
      │   ├─ YES → Continue coaching
      │   └─ NO → Escalate or clarify scope
```

**This session's path**: Deadline 21:50 (20 min at 21:30) → Coaching deployed 21:26 → Status check 21:45 (zero progress) → Escalate direct commands 21:32 → Success.

---
