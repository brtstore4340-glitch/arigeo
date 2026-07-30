---
name: multi-agent-orchestration-checklist
description: Pre-flight and in-flight checklist to prevent bottlenecks like Khun-Ram lag (2026-06-14)
metadata:
  type: feedback
  pattern: Systematic bottleneck prevention in multi-agent sessions
  source: RCA session 2026-06-14
---

# Multi-Agent Orchestration Checklist

Use this checklist every time you spawn 2+ agents in parallel.

---

## 🚀 PRE-SESSION (Before Spawning Agents)

**Time**: 10 minutes  
**Goal**: Identify bottleneck risks + set up monitoring

### Step 1: Map the Critical Path
```
□ List all work items each agent must complete
□ Identify dependencies (A must finish before B starts)
□ Mark items on critical path (delay → overall delay)

Example:
- Aeimathes: Phase 12 audit (999 records) — independent, ~3h
- Khun-Ram: Challenge 2 + GitHub Pages — serial, Challenge 2 blocks GitHub Pages
  - Challenge 2: Oracle School module, ~4-6h (CRITICAL PATH)
  - GitHub Pages: 0.5h (blocked by Challenge 2)
- Codex-01: vitest run — independent, ~1-2h, depends on Aeimathes baseline
```

### Step 2: Estimate Effort + Identify Bottleneck
```
□ For each critical-path item, estimate hours:
  Aeimathes Challenge 2: 4-6 hours ← LONGEST
  Khun-Ram GitHub Pages: 0.5 hours
  Codex-01 vitest: 1-2 hours
  
□ Bottleneck agent: _____________ (expected slowest)
□ Bottleneck duration: _____________ hours
□ Buffer required: +50% = _____________ hours total
□ **Session time budget**: _____________ hours
```

### Step 3: Set Monitoring Cadence
```
□ Create 1-hour timer (e.g., phone alarm, calendar reminder)
□ Cadence: Check `maw peek all` at each hour mark
□ First check: 1h after spawn
□ Last check: 30 min before deadline

Timeline example (start 20:00):
- 20:00: Spawn agents
- 21:00: First check ← cadence starts
- 22:00: Check
- 23:00: Check
- 00:00: Check
- 01:00: Check
- 02:00: Check
- 03:00: Check + decision point
```

### Step 4: Pre-Brief Agents on Expectations
```
□ Aeimathes: "Phase 12 audit, 999 records, ~3h, CRITICAL PATH"
□ Khun-Ram: "Challenge 2 is large (4-6h), might be bottleneck — surface blockers every 1h"
□ Codex-01: "Wait for Aeimathes baseline before starting vitest — don't idle"

Message: `maw hey [agent] "You're on critical path for [reason]. Flag blockers every 1h."`
```

### Step 5: Define Decision Options
```
□ Option A: Wait (if bottleneck on track for ETA)
□ Option B: Interrupt & diagnose (if bottleneck stalled)
□ Option C: Parallel unblock (redirect resources)
□ Option D: Escalate (escalate to human for decision)
□ Decision timeout: 5 minutes after bottleneck detected
```

---

## ⏱️ IN-SESSION (Every 1 Hour)

**Time**: 5 minutes per check  
**Goal**: Detect + escalate bottleneck before pressure

### Step 1: Check Status at 1h Marks
```bash
# At each 1-hour mark (21:00, 22:00, 23:00, etc.):
maw peek all

# Compare to previous hour:
# - Is any agent in the SAME state as 1 hour ago?
# - YES → BOTTLENECK DETECTED ⚠️  (jump to Step 2)
# - NO → Continue. Everything on track ✓
```

### Step 2: If Bottleneck Detected
```
□ Agent: _____________
□ Last state (from 1h ago): _____________
□ Current state: _____________
□ Duration stuck: _____________ hours:minutes
□ Root cause guess: _____________
  (context exhausted? external blocker? logic error?)

Action: Jump to Step 3 (Surface options)
```

### Step 3: Surface Options (Template)
```
⚠️  BOTTLENECK DETECTED (HH:MM)

Agent: [Name]
State: [Last activity, e.g., "Challenge 2 in progress"]
Duration stuck: [X hours Y min]
Last update: [HH:MM]

Possible causes:
- Context exhaustion (tokens near limit?)
- External blocker (waiting on another agent?)
- Logic error (got stuck in a loop?)

Options:
A) Wait 30 more min (total ___ min allowed)
B) Interrupt & diagnose: ask directly "what's blocking you?"
C) Parallel unblock: have different agent work on dependency
D) Escalate to human: surface options + current status

Decision timeout: 5 minutes
```

### Step 4: Monitor While Awaiting Decision
```
□ If decision is "Wait 30 min": set follow-up check at +30min
□ If decision is "Interrupt": send `maw hey [agent] "Status check: what's blocking Challenge 2?"`
□ If decision is "Parallel unblock": identify alternative work path
□ If decision is "Escalate": surface options + blockers to human immediately
```

---

## 🎯 SPECIAL SIGNALS (Thai Directives)

### When You Receive Thai Directive

Apply this translation map immediately:

| Signal | Action |
|--------|--------|
| "fix all three people urgently" | ⚠️  At least one stuck. Run bottleneck check NOW (don't wait for 1h cadence) |
| "speed up" | Run capacity check: which agent is slowest? Surface the bottleneck. |
| "choose, do fast" | Stop monitoring. Make binary decision in 5 min. Escalate if ambiguous. |
| "what to do next" | Run status check. Surface decision options. |

**Example** (from 2026-06-14):
- Signal received (21:29): "fix all three people urgently"
- Action: Run bottleneck check immediately
- Result: Khun-Ram Challenge 2 at 68 min (unusual) → surface immediately
- Expected: Escalate at 21:30 (instead of 02:08)

---

## 🚨 ESCALATION RULES

### Proactive Escalation (Don't Wait for User Pressure)

When you detect bottleneck:

1. **Surface immediately** (don't wait for "what are we waiting for?")
2. **Include context** (duration stuck, possible causes, options)
3. **Set decision timeout** (5 min; if no response, assume B: interrupt & diagnose)
4. **Don't re-ping** repeatedly; wait for decision

### Escalation Signs (Automatic Triggers)

```
□ Any agent stuck >60 min in same state → Surface bottleneck
□ Session >50% complete but critical-path agent not done → Surface ETA breach
□ Thai signal "fix all three urgently" → Run check immediately
□ vitest/build loop >20 min with no output → Interrupt & diagnose
□ Time to session deadline <30 min AND critical path not done → Escalate to human
```

---

## ✅ POST-SESSION (When Wrapping Up)

### Step 1: Verify All Agents Ready
```
□ Run `maw peek all` final time
□ All agents confirm readiness? YES → proceed to Step 2
□ Any agent still working? NO → Surface remaining blockers, re-run decision loop
```

### Step 2: Document Bottlenecks
```
In retrospective:
□ Agent name: _____________
□ Duration bottleneck lasted: _____________ hours
□ Detection delay: _____________ hours (should be <1h)
□ Root cause: _____________
□ Prevention: What would catch this next time?
```

---

## 📋 Quick Reference (Session at a Glance)

Print this and keep visible during multi-agent sessions:

```
PRE-SESSION (10 min)
├─ Critical path? (what's the slowest agent?)
├─ Effort estimate? (how long?)
├─ Bottleneck risk? (which agent?)
└─ Monitoring cadence? (every 1h)

IN-SESSION (every 1h, 5 min)
├─ `maw peek all` — any agent stuck same state as last hour?
├─ YES → bottleneck detected
│  ├─ Surface options (A/B/C/D)
│  ├─ Decision timeout: 5 min
│  └─ Execute decision
└─ NO → continue

SPECIAL SIGNALS
└─ "fix all three urgently" → bottleneck check NOW (not at 1h mark)

POST-SESSION
└─ Document bottleneck duration + detection delay
```

---

## Applied to 2026-06-14 (What Should Have Happened)

**PRE-SESSION (20:00)**:
- Critical path: Khun-Ram Challenge 2 (4-6h estimate) ← BOTTLENECK RISK
- Monitoring: 1h cadence starting 21:00
- Options pre-defined: A=wait, B=interrupt, C=parallel, D=escalate

**IN-SESSION**:
- 21:00: Khun-Ram Challenge 2 at ~30 min. No lag ✓
- 22:00: Khun-Ram Challenge 2 at ~60 min. Lag +30min ⚠️
  - Surface: "Khun-Ram 60min on Challenge 2 (expected 4-6h total). Continue or interrupt?"
  - Decision: Wait 30 more min
- 23:00: Khun-Ram Challenge 2 at ~120 min. Lag confirmed ⚠️
  - Surface: "Khun-Ram still on Challenge 2 (2h elapsed, 2-4h remaining). Interrupt & diagnose?"
  - Decision: Interrupt, ask directly about blocker

**ACTUAL (2026-06-14)**:
- Pre-session: No capacity planning. Assumed parallel 3x speedup
- In-session: No 1h cadence. Sporadic `maw peek` calls
- 02:08: User asks "what are we waiting for" ← forced escalation
- 03:12: Bottleneck finally surfaced (4h+ late)

**Improvement**: 3.5-4.5 hours saved with systematic monitoring.

---

## Gotchas

| Gotcha | Prevention |
|--------|-----------|
| 1h cadence interrupted by overnight break | Set phone alarm (not just mental reminder) |
| Agent says "still working" but is actually blocked | When checking, ask for concrete progress (commit count, lines changed, not just "in progress") |
| Multiple agents all waiting on same external dependency | Pre-identify dependencies in pre-session step; surface earlier |
| Signal ignored because it "sounds motivational" | Use translation map; treat all Thai signals as diagnostic (not just motivational) |
| Escalation delayed because you want to "avoid false alarms" | False alarm cost: 0. Missed bottleneck cost: hours. Always escalate early. |

---

## Template (Copy for Next Session)

```
═══════════════════════════════════════════════════════════════
SESSION: [DATE] [TIME]
Agents: [NAME1], [NAME2], [NAME3]
═══════════════════════════════════════════════════════════════

PRE-SESSION CAPACITY PLAN:
Critical path: _______________
Bottleneck agent: _______________
Bottleneck ETA: _______________
Monitoring cadence: Every 1h starting ___:00

HOURLY CHECKS:
[01:00] Status: _______________ Lag? ✓/⚠️
[02:00] Status: _______________ Lag? ✓/⚠️
[03:00] Status: _______________ Lag? ✓/⚠️

BOTTLENECK DETECTED? [YES / NO]
If YES:
- Agent: _______________
- Duration stuck: _______________
- Escalated at: _______________
```

---

## Next Steps for Implementation

1. **This week**: Print checklist. Memorize steps 1-3
2. **Next multi-agent session**: Run PRE-SESSION (10 min)
3. **During session**: Use 1h cadence + bottleneck detection
4. **Post-session**: Document detection delay in retrospective
5. **Iterate**: Update checklist based on what you learn

**Goal**: Detect bottleneck within 1 hour. Escalate proactively. Zero forced pressure escalations.
