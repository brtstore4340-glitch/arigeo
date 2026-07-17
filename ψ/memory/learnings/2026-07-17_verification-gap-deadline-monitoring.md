---
name: verification-gap-deadline-monitoring
description: Critical deadlines require proactive status checks, not passive inbox monitoring
metadata:
  type: feedback
  ttl: ∞
  source: rrr:2026-07-17 Luxi escalation
---

# Verification Gap: Deadline Monitoring Pattern

**Pattern**: Critical handoffs with hard deadlines are treated as set-and-forget, instead of requiring proactive status checks at T−30m.

**Why This Matters**: Luxi activation at 06:49 with deadline 08:49 (2 hours). No proactive check at 08:30. Result: found silent failure at 21:43 (13+ hours late). By then, only escalation possible; course-correction window closed.

This is the **third appearance** of the "verification gap" pattern in 14 days:
- Jun 19: Overconfidence in proximity (copied pattern without checking execution context)
- Jul 6: Assumed untrack = delete without confirming intent
- Jul 16: Reported hook "confirmed working" from manual script with hand-set env var, not real execution
- Jul 17: **Assumed silence = work in progress, didn't verify deadline status**

**Root Cause**: Trusting a proxy signal (proximity, silence, manual test) instead of checking the real target (actual commits, live behavior, deadline status).

---

## The Rule

**For any multi-oracle handoff with a hard deadline:**

1. At T−30m (30 minutes before deadline), proactively check status
   - Is recipient responding? Any updates?
   - Are they reporting blockers or need for extension?
   - If silent: escalate 30 minutes early, not after deadline passes

2. Do not rely on "no news = work in progress"
   - No news could mean: recipient is blocked, didn't receive message, misunderstood scope, is in different timezone, or is offline
   - Check first; assume second

3. Set a /loop or calendar reminder for T−30m
   - Don't wait for user to ask recap
   - Proactive monitoring is part of escalation ownership

**How to Apply**:
- Luxi activation (08:49 deadline) → check at 08:15–08:30
- Any fleet deadline → owner sets reminder for T−30m
- Escalation protocol: "if silent by T−30m, reach out; if still silent at T, escalate"

---

## Why It Matters

**Timing window**: 
- Silent failure at T+0 (08:49): owner can still course-correct (extend, reassign, offer help)
- Silent failure at T+13h (21:43): only option is escalation; no course-correction possible

**Recovery cost**:
- T+30m escalation: "ທาม, Luxi is silent, should we extend?"
- T+13h escalation: "ທาม, Luxi missed deadline 13h ago, what now?"

The earlier escalation is cheaper and leaves options open.

---

## Related Memories

- [[broadcast-first-critical-events]] — Critical events must hit broadcast log in real-time
- [[rtk-protocol-scope-all-agents]] — Verification must happen at real execution path, not proxy
- Session metrics "verification gap" pattern (row 5-7, last 4 sessions)
