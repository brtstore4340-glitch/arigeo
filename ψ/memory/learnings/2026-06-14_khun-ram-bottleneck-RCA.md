---
name: khun-ram-bottleneck-RCA
description: Root-cause analysis and prevention framework for the +4h Khun-Ram bottleneck (2026-06-14 session)
metadata:
  type: reference
  incident: 2026-06-14 03:41 Session — Khun-Ram Challenge 2 + GitHub Pages lag
  severity: operational (8h session, 4h wasted on suboptimal routing)
---

# Root-Cause Analysis: Khun-Ram Bottleneck (2026-06-14)

## The Incident

**Timeline**:
- 20:13 — Khun-Ram woken (3rd agent to spawn)
- 21:17 — Status check: "Khun-Ram in progress Challenge 2"
- 21:29 — Thai signal: "fix all three urgently" ← **Signal missed**
- 21:55 — Pattern obvious (4h into session, Challenge 2 still incomplete) ← **Detection fail**
- 02:08 — User pressure: "what are we waiting for" ← **Forced escalation**
- 03:12 — GitHub Pages fix applied directly
- 03:37 — Khun-Ram finally confirmed ready

**Cost**: ~4 hours of suboptimal resource allocation (Aeimathes + Codex-01 waiting).

---

## Root Causes (5 Levels Deep)

### Level 1: Symptom
Khun-Ram didn't advance on Challenge 2 for 4+ hours. Status remained "in progress" from 21:17 to 02:08.

### Level 2: Detection Failure
I checked status sporadically (20:09, 21:17, 02:09) rather than every 1 hour. Gaps between checks:
- 20:09 → 21:17: 68 min (missed 21:17 status report clearly showing lag)
- 21:17 → 02:09: 4h 52m ← **Critical gap**

**Why**: No enforced monitoring cadence. I relied on "feeling stuck" rather than algorithmic +1h lag detection.

### Level 3: Signal Interpretation
At 21:29, Thai directive: "fix all three people urgently" (Thai: "fix all three people urgently").

I interpreted this as:
- "All three agents need attention" → generic pressure signal
- Not: "At least one agent is clearly blocked and needs immediate help"

**Why**: I treated it as motivational ("go faster") rather than diagnostic ("someone is stuck").

### Level 4: Capacity Planning Absence
I never estimated Khun-Ram's Challenge 2 effort before spawning. I assumed:
- All three agents would move at similar pace
- Parallel execution = 3x speedup with minimal overhead
- No single-threaded bottleneck possible

**Why**: Pre-session capacity planning was skipped. I jumped to execution without asking "how long is Challenge 2?"

### Level 5: Escalation Mechanism
I had no proactive escalation rule. I waited for:
1. User pressure ("what are we waiting for?")
2. Or my own frustration after many `maw peek` calls

Instead of:
1. Detecting +1h lag automatically
2. Surfacing ETA + blocker status proactively
3. Suggesting resource reallocation or parallel unblock

---

## Prevention Framework (4 Mechanisms)

### Mechanism 1: Bottleneck Detection (Mandatory +1h Cadence)

**Rule**: At every 1-hour mark, run `maw peek all` and check if any agent is stuck in the same state as 1 hour ago.

**Implementation**:
```bash
# At each 1-hour check (01:00, 02:00, 03:00):
LAST_STATUS=$(cat /tmp/maw-status-1h-ago.txt 2>/dev/null || echo "")
CURRENT_STATUS=$(maw peek all)
if [ "$LAST_STATUS" = "$CURRENT_STATUS" ]; then
  echo "⚠️  BOTTLENECK: No progress in last hour. Escalate."
  echo "$CURRENT_STATUS" > /tmp/maw-status-bottleneck.txt
  # Signal for proactive escalation (see Mechanism 2)
fi
cp <(echo "$CURRENT_STATUS") /tmp/maw-status-1h-ago.txt
```

**Trigger**: First detection at 21:55 (5h into session) would have been caught at 22:00 (exact 1h mark).

**Cost**: 30 seconds per hour = negligible.

---

### Mechanism 2: Proactive Escalation (Surface Before Pressure)

**Rule**: When bottleneck detected, surface it immediately with:
1. **What**: Agent name + last state
2. **When**: How long stuck (hours:minutes)
3. **Why guess**: Possible causes (context exhaustion, external blocker, logic error)
4. **Options**: (A) Give more time + resources, (B) Escalate to human, (C) Redirect to different work

**Example**:

```
⚠️  BOTTLENECK DETECTED (22:00)

Agent: Khun-Ram
State: Challenge 2 in progress (last update 21:17)
Duration stuck: 43 minutes

Possible causes:
- Challenge 2 is harder than estimated (Oracle School module C2 complex)
- Context exhaustion (Khun-Ram accumulated >90% tokens)
- External blocker (GitHub Pages wait, or dependency on Aeimathes)

Options:
A) Wait 30 more minutes (total 75 min allowed for Challenge 2)
B) Interrupt Khun-Ram, diagnose exact blocker via direct message
C) Parallel-unblock: have Codex-01 stub out Challenge 2 skeleton, let Khun-Ram focus on GitHub Pages
D) Escalate to human for decision

Decision timeout: 5 minutes (if no response, assume B)
```

**Trigger**: Would have surfaced at 22:00 (versus user asking at 02:08).

---

### Mechanism 3: Pre-Session Capacity Planning

**Rule**: Before spawning N agents, estimate effort for each critical path item.

**Checklist**:
```
□ Identify critical path items (Phase 12 audit, Challenge 2, vitest)
□ Estimate effort: Challenge 2 = Oracle School module? (4-6 hours typical)
□ Estimate effort: GitHub Pages fix = known issue? (15-30 min typical)
□ Estimate effort: Aeimathes audit = 999 CCPE records = ? per record (2-3 min typical)
□ Identify coupling: does Challenge 2 block anything? (GitHub Pages fix blocks Phase 13 readiness gate)
□ Allocate buffer: add 50% for unknowns

Example:
- Aeimathes audit: 3h (999 × 2 min)
- Khun-Ram Challenge 2: 4-6h (Oracle School module)
- Khun-Ram GitHub Pages: 0.5h (known issue)
- Codex-01 vitest: 1-2h (test suite run)
- **Critical path**: Khun-Ram serial (Challenge 2 → GitHub Pages) = 4.5-6.5h
- **Bottleneck risk**: Khun-Ram will be the slowest, 2+ hours behind Aeimathes/Codex-01

**Decision**: Spawn Codex-01 only after Aeimathes baseline ready (parallel 2/3 instead of 3/3).
```

**Trigger**: Would have flagged Khun-Ram Challenge 2 as high-risk +4h work pre-session.

---

### Mechanism 4: Signal Interpretation (Thai Directives → Resource Actions)

**Translation Map** (Thai directives ↔ resource actions):

| Thai Directive | Meaning | Resource Action |
|---|---|---|
| "fix all three people urgently" | At least one agent is stuck; prioritize unblocking | Run bottleneck detection NOW; escalate if any agent in same state >30min |
| "speed up" | Execution is slower than expected | Run capacity analysis; identify which agent is slowest |
| "choose, do fast" | Make a binary decision now | Set decision timeout 5 min; escalate to human if ambiguous |
| "what to do next" | Awaiting decision point | Run status check; surface decision options + context |

**Applied to 21:29 signal**:
- Thai: "fix all three people urgently"
- Translation: At least one struggling → Run bottleneck check
- Status check result: Challenge 2 at 68 min (unusual), escalate
- **Action taken**: Should have = escalate immediately; **Actually took** = ignored

---

## Implementation (Session Workflow)

### Before Session Starts
1. ✅ Run capacity planning checklist (10 min)
2. ✅ Identify critical path + bottleneck risks
3. ✅ Set monitoring cadence reminders (every 1h)

### During Session (Every 1 Hour)
1. ✅ Run `maw peek all` (30 sec)
2. ✅ Compare to prior hour's status
3. ✅ If any agent stuck >60 min: trigger Mechanism 2 (proactive escalation)
4. ✅ If Thai signal received: apply Mechanism 4 (translate to action)

### When Bottleneck Detected
1. ✅ Surface options (A/B/C/D) with 5-min decision timeout
2. ✅ Don't wait for user to ask "what are we waiting for"
3. ✅ Escalate proactively

---

## Validation Against 2026-06-14 Session

**Scenario**: Run Mechanisms 1-4 on actual session data.

**Mechanism 1** (Bottleneck Detection):
- 1h mark (21:13): Khun-Ram at ~30 min on Challenge 2 → No lag yet ✓
- 2h mark (22:13): Khun-Ram still on Challenge 2 → Lag detected! ⚠️  (missed: I took break)
- **Recovery**: Resume at 02:04, check Khun-Ram: stuck 4h52m → Escalate immediately

**Mechanism 2** (Proactive Escalation):
- At 22:13, would surface: "Khun-Ram 60min on Challenge 2 — unusual"
- User could decide: wait 30 more min, or interrupt + diagnose
- **Outcome**: Decision made at 22:30 (instead of 02:08) = 3.5h saved

**Mechanism 3** (Pre-Session Planning):
- Challenge 2 estimated 4-6h → Would flag as critical path bottleneck
- **Decision**: Don't spawn all 3 in parallel; wait for Aeimathes baseline first
- **Outcome**: Reduced time-waste on Codex-01 waiting

**Mechanism 4** (Signal Interpretation):
- 21:29 Thai signal applied to map → "At least one stuck, check now"
- **Outcome**: Escalated at 21:30 (versus 02:08) = 4.5h saved

---

## Implementation Order

**Priority 1** (This week):
- ✅ Mechanism 1: Set 1h cadence timer on all multi-agent sessions
- ✅ Mechanism 4: Memorize Thai signal translation map

**Priority 2** (Next session):
- ✅ Mechanism 3: 10-min capacity planning before spawning agents
- ✅ Mechanism 2: Write proactive escalation template

**Priority 3** (Polish):
- Hook-based monitoring cadence (automatic reminders every 1h)
- Automated bottleneck detection (bot that runs `maw peek all` every 1h)

---

## Related Memories

- [[agent-watchdog-lesson]] — Agents go silent; need human trigger every 3-5 min
- [[feedback-load-balance]] — 1 task : 1 session; don't overload single agent
- [[phase-13-critical-path-analysis]] — 3 critical gates with blockers + dependencies

---

## Rule Summary

**After 2026-06-14, multi-agent orchestration follows:**

1. **Pre-session**: 10-min capacity planning. Identify bottleneck risks.
2. **Every 1 hour**: Run `maw peek all`. Check for +1h stuck agents.
3. **When bottleneck detected**: Surface options (A/B/C/D) proactively. Don't wait for pressure.
4. **When Thai signal received**: Apply translation map. Treat "fix all three urgently" as "one is stuck — act now."

**Expected outcome**: Bottleneck detected within 1 hour (not 4 hours). Escalation proactive (not forced).
