---
name: bottleneck-prevention-rules
description: 4 core rules to prevent multi-agent bottleneck lag (learned from Khun-Ram +4h incident)
metadata:
  type: feedback
  pattern: Systematic bottleneck prevention
  source: 2026-06-14 session RCA + checklist
---

# Bottleneck Prevention: 4 Core Rules

**Incident**: Khun-Ram bottleneck (21:55 detection → 02:08 escalation = **4h13m delay**)  
**Cause**: No monitoring cadence + weak signal interpretation + no proactive escalation  
**Prevention**: 4 rules to apply every multi-agent session

---

## Rule 1: 1-Hour Bottleneck Detection Cadence

**The Rule**:
At every 1-hour mark (01:00, 02:00, 03:00, etc.), run `maw peek all` and check: *"Is any agent in the same state as 1 hour ago?"*

**If YES** → Bottleneck detected. Jump to Rule 3.  
**If NO** → All agents progressing. Continue.

**Why it works**:
- Catches lag within ±30 min of when it starts (not 4+ hours later)
- Objective: Compare state snapshots, not subjective "feels stuck"
- Lightweight: 30 sec per hour = negligible overhead

**Applied to 2026-06-14**:
- 22:00 check (1h after spawn): Khun-Ram Challenge 2 at ~60 min → **Would have detected lag here**
- 02:08 (actual): Pressure forced escalation → **4h+ too late**

**Set reminder**: Phone alarm at 1h after spawn, then every 1h.

---

## Rule 2: Pre-Session Capacity Planning (10 Minutes)

**The Rule**:
Before spawning agents, identify:
1. **Critical path**: Which work items must complete in sequence (blocks overall deadline)
2. **Bottleneck agent**: Which agent will be slowest
3. **Effort estimate**: How long will the bottleneck agent take
4. **Decision options**: What will you do if bottleneck detected (A=wait, B=interrupt, C=parallel, D=escalate)

**Why it works**:
- Reveals which agent is likely to lag before you spawn
- Primes you to watch that agent closely
- Pre-defines decision options so you escalate fast, not slow

**Applied to 2026-06-14**:
- Challenge 2 estimated 4-6h → Would have flagged Khun-Ram as critical path risk
- Would have decided: "If Khun-Ram lags >1h, escalate immediately for decision"
- **Actual**: No pre-planning, no anticipation of bottleneck

**Template**: 10-min checklist before spawn (see [[multi-agent-orchestration-checklist]])

---

## Rule 3: Proactive Escalation (Surface Before Pressure)

**The Rule**:
When bottleneck detected (Rule 1), **surface it immediately** with:
- **What**: Agent name + current state
- **How long**: Duration stuck (X hours Y min)
- **Options**: A (wait), B (interrupt & diagnose), C (parallel unblock), D (escalate to human)
- **Decision timeout**: 5 minutes

**Do NOT**:
- Wait for user to ask "what are we waiting for?"
- Ping repeatedly hoping it resolves itself
- Make excuses ("they're still on it, let them cook")

**Why it works**:
- Escalation at 22:00 (vs 02:08) = decision made 4+ hours earlier
- Human gets context + options upfront (not pressure signal without data)
- Sets expectation: Oracle surfaces blockers proactively

**Applied to 2026-06-14**:
- Should have: Surface at 22:00 — "Khun-Ram 60min on Challenge 2. Continue or interrupt?"
- Actually: Waited until 02:08 (user asked), then scrambled to fix

**Template**:
```
⚠️  BOTTLENECK (22:00)
Khun-Ram | Challenge 2 in progress | 60 min stuck

Options:
A) Wait 30 more (total 90 min allowed for Challenge 2)
B) Interrupt: ask directly "what's blocking you?"
C) Parallel: have Codex-01 work on GitHub Pages dependency
D) Escalate to human for decision

Your call? (5 min timeout)
```

---

## Rule 4: Thai Signal Translation (Not Motivational, Diagnostic)

**The Rule**:
When you receive Thai directive, apply this translation immediately:

| Signal | Meaning | Action |
|--------|---------|--------|
| "fix all three people urgently" | At least one agent is stuck | Run bottleneck check **NOW** (don't wait for 1h cadence) |
| "speed up" | Execution is slower than expected | Run capacity analysis; surface which agent is slowest |
| "choose, do fast" | Binary decision needed now | Set 5-min timer; escalate if ambiguous |
| "what to do next" | Awaiting decision | Run status check; surface options + context |

**Do NOT**:
- Treat as motivation ("go faster, team!")
- Interpret as generic pressure
- Wait for clarification; act on the translation immediately

**Why it works**:
- Unlocks what the human is really signaling (diagnostic, not motivational)
- Triggers rule-based action (not interpretation drift)
- Catches emerging bottlenecks early

**Applied to 2026-06-14**:
- Signal (21:29): "fix all three people urgently"
- Translation: At least one stuck; check now
- Action: Run bottleneck detection (not just "go faster")
- **Actual**: Interpreted as motivational pressure, not diagnostic signal

**Memorize**: The 4 signals above. Use them every multi-agent session.

---

## Implementation Sequence

### Before Spawn (10 min)
1. ✅ Pre-session capacity plan (Rule 2)
2. ✅ Set 1h monitoring cadence (Rule 1)
3. ✅ Define decision options (Rule 3)
4. ✅ Memorize Thai signal map (Rule 4)

### During Session (Every 1 Hour)
1. ✅ Run `maw peek all` at 1h marks (Rule 1)
2. ✅ If bottleneck detected → Surface options (Rule 3)
3. ✅ If Thai signal → Apply translation (Rule 4)

### When Bottleneck Confirmed
1. ✅ Surface options immediately (Rule 3)
2. ✅ Don't wait for pressure; escalate proactively
3. ✅ Set 5-min decision timeout

---

## Validation (Does It Prevent Khun-Ram Lag?)

| Step | 2026-06-14 (Actual) | With 4 Rules | Savings |
|---|---|---|---|
| Pre-session planning | ✗ None | ✅ 10 min | Baseline |
| Bottleneck identified | ❌ 02:08 (4h+ late) | ✅ 22:00 (1h after spawn) | **3h+** |
| Escalation | ❌ Forced (user asked) | ✅ Proactive (surface options) | **4h+** |
| Signal interpretation | ✗ Ignored "fix all three" | ✅ Triggers immediate check | **1h+** |
| **Total saved** | — | — | **4-5 hours** |

---

## Gotchas & Fixes

| Gotcha | What Goes Wrong | Prevention |
|---|---|---|
| Forget 1h cadence | Miss bottleneck for hours | Set phone alarm (not mental) |
| 1h cadence broken by overnight | Context reset loses tracking | Write state checkpoint before break (5 lines: agent name, status, ETA, next action, gate condition) |
| Agent says "still working" but won't specify blocker | Can't diagnose if it's real blocker or false alarm | Ask for concrete progress: commits since last check? Lines changed? Specific error message? Not just "in progress" |
| Escalate too early (false alarm) | Nothing bad happens | True cost: 0. Missed bottleneck cost: 4+ hours. Always escalate early. |
| User says "wait" but gives no ETA | You don't know how long to wait | When escalating, ask for decision + time bound: "Wait until 23:00?" or "Interrupt at +30min?" |

---

## One-Line Mantra

**"Bottleneck in first hour, not fourth hour."**

Use this to remember: detect it early (1h cadence), surface it immediately (proactive escalation), act before pressure.

---

## Related Rules

- [[oracle-no-execute-rule]] — Oracle ทุกตัวห้ามexecute โดยตรง
- [[feedback-load-balance]] — 1 task : 1 session; don't overload single agent
- [[agent-watchdog-lesson]] — Agents go silent without human trigger; ธามต้อง check back ทุก 3-5 นาที

---

## Use This Every Time You Spawn 2+ Agents

Print the 4 rules. Tape them above your monitor. Before next multi-agent session:
1. ✅ Rule 2: 10-min pre-session plan
2. ✅ Rule 1: Set 1h monitoring alarm
3. ✅ Rule 3: Read escalation template
4. ✅ Rule 4: Memorize Thai signals

**Expected outcome**: Bottleneck detected within 1h. Escalation proactive. Zero pressure-forced decisions.

---

## Revision History

- **2026-06-14**: Initial rules from Khun-Ram RCA
- **Future**: Update if patterns change (test on 2-3 sessions before considering done)
