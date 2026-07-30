---
name: INDEX_bottleneck-prevention
description: Entry point for the complete bottleneck prevention framework (3 documents + implementation guide)
metadata:
  type: reference
  incident: Khun-Ram +4h bottleneck (2026-06-14)
  created: 2026-06-14
---

# Bottleneck Prevention Framework — Complete Index

**Incident**: Khun-Ram bottleneck detected at 02:08, **4 hours after emergence** (21:55)  
**Prevention framework**: 3 documents + 4 core rules to prevent recurrence

---

## 🎯 Quick Start (3 Minutes)

### If you're about to run a multi-agent session:
1. Read [[2026-06-14_bottleneck-prevention-rules]] (4 rules, 2 min)
2. Print [[2026-06-14_multi-agent-orchestration-checklist]] (1 min)
3. Follow the checklist before spawning agents

### If you want to understand the full framework:
1. Read [[2026-06-14_khun-ram-bottleneck-RCA]] (understand the incident, 5 min)
2. Review [[2026-06-14_multi-agent-orchestration-checklist]] (learn the process, 10 min)
3. Memorize [[2026-06-14_bottleneck-prevention-rules]] (4 rules, drill 5 min)

---

## 📚 The Three Documents

### 1. [[2026-06-14_khun-ram-bottleneck-RCA]] — Understanding the Problem
**Purpose**: Deep root-cause analysis + prevention mechanisms  
**Length**: ~3,000 words  
**Read when**: After this session, to understand what went wrong  
**Contains**:
- 5-level root-cause analysis (symptom → detection fail → signal interpretation → capacity planning → escalation)
- 4 prevention mechanisms with implementation details
- Validation against 2026-06-14 actual session data
- Related memory links

**Key insight**: The bottleneck didn't exist because I was unlucky. It existed because I lacked 4 specific practices (monitoring cadence, capacity planning, proactive escalation, signal interpretation).

---

### 2. [[2026-06-14_multi-agent-orchestration-checklist]] — Doing the Work
**Purpose**: Actionable checklist to prevent bottleneck in next session  
**Length**: ~2,000 words  
**Use when**: BEFORE spawning agents (print + follow)  
**Contains**:
- PRE-SESSION checklist (10 min: capacity planning, monitoring setup, decision options)
- IN-SESSION checklist (every 1 hour: status check, bottleneck detection, escalation)
- Special signals (Thai directive translation)
- Escalation rules
- POST-SESSION checklist (documentation)
- Quick reference card

**Key insight**: The checklist is not a suggestion — it's the minimum viable process to prevent 4+ hour detection delays.

---

### 3. [[2026-06-14_bottleneck-prevention-rules]] — Memorizing the Essentials
**Purpose**: 4 core rules to apply every time  
**Length**: ~1,500 words  
**Read when**: This week (before Monday Phase 13b)  
**Contains**:
- Rule 1: 1-Hour Bottleneck Detection Cadence (objective check every hour)
- Rule 2: Pre-Session Capacity Planning (10 min to identify critical path)
- Rule 3: Proactive Escalation (surface before pressure)
- Rule 4: Thai Signal Translation (not motivational, diagnostic)
- Implementation sequence
- Validation table (how much time each rule saves)
- One-line mantra: "Bottleneck in first hour, not fourth hour"

**Key insight**: These 4 rules are portable. Use them for any multi-agent orchestration, not just Phase 13b.

---

## 🔄 Implementation Timeline

### This Week (Before Monday 2026-06-17)
- [ ] Read RCA document (understanding)
- [ ] Memorize 4 core rules (muscle memory)
- [ ] Skim checklist (familiarity)
- [ ] Print checklist (accessibility)

### Monday Phase 13b Session (2026-06-17 09:00)
- [ ] Run PRE-SESSION checklist (10 min before spawn)
- [ ] Set 1h monitoring alarm (Rule 1)
- [ ] Execute IN-SESSION cadence (every 1h)
- [ ] Apply Thai signals (Rule 4)
- [ ] Document bottleneck duration (post-session)

### Post-Session
- [ ] Update retrospective with detection delay
- [ ] Success metric: <60 min detection (was 4h13m in 2026-06-14)
- [ ] If success: confirm framework works
- [ ] If failure: diagnose why rule wasn't followed + fix

---

## 📊 Metrics (How to Measure Success)

### Baseline (2026-06-14)
- Bottleneck emerged: ~21:55 (Challenge 2 lag)
- Bottleneck detected: 02:08 (user pressure)
- **Detection delay: 4 hours 13 minutes** ❌

### Target (Next Session with Framework)
- Bottleneck detected: <60 minutes from emergence
- Escalation: Proactive (not forced by user pressure)
- Decision: Made within 5 min of detection
- **Success metric: Detection delay <60 min** ✅

### How to Track
In post-session retrospective:
```
Bottleneck detection:
- Emerged at: HH:MM
- Detected at: HH:MM
- Delay: X hours Y min (goal: <60 min)
- Escalation type: Proactive / Forced pressure
- Decision made at: HH:MM
```

---

## 🎓 Learning Path

### Level 1: Quick Recall (Minimum for Next Session)
- Memorize 4 core rules (Document 3)
- Understand "bottleneck in first hour, not fourth hour"
- **Time**: 5 min

### Level 2: Operational (For Monday Phase 13b)
- Read checklist (Document 2)
- Follow PRE-SESSION steps before spawn
- Execute 1h monitoring cadence during session
- **Time**: 20 min prep + 5 min/hour during session

### Level 3: Mastery (Prevent Future Incidents)
- Read RCA (Document 1)
- Understand 5-level causation
- Learn why each prevention mechanism matters
- Adapt framework to other multi-agent scenarios
- **Time**: 30 min deep study

### Level 4: Teaching (Share with Team)
- Explain incident to other Oracles
- Train on 4 rules + checklist
- Help Codex-01, Aeimathes, Khun-Ram apply framework
- **Time**: 1 hour facilitation

---

## ⚡ 60-Second Summary

**Problem**: Khun-Ram bottleneck took 4+ hours to detect  
**Root cause**: No monitoring cadence, no capacity planning, weak signal interpretation, no proactive escalation  
**Solution**: 4 rules + checklist to prevent recurrence

**4 Rules**:
1. **1h bottleneck cadence**: `maw peek all` every 1h, check for stuck agents
2. **Pre-session planning**: 10 min to identify critical path + bottleneck risk
3. **Proactive escalation**: Surface options immediately, don't wait for user pressure
4. **Thai signal translation**: "Fix all three urgently" = someone is stuck, check now

**Expected outcome**: Bottleneck detected within 1 hour (not 4+)

---

## 🔗 Related Memories

- [[feedback-load-balance]] — 1 task : 1 session; don't overload
- [[agent-watchdog-lesson]] — Agents go silent; check every 3-5 min
- [[feedback-auto-mode]] — Bias toward action; surface needs fast
- [[feedback-proactive-updates]] — Update user every step without waiting
- [[phase-13-critical-path-analysis]] — Critical path concept applied to Phase 13b

---

## Questions & Answers

### Q: Do I need to follow the full checklist every time?
**A**: Yes for multi-agent (2+) sessions. For single-agent, skip sections 1-2 (capacity planning overhead not justified). But always apply Rule 1 (1h cadence) when running any orchestrated work.

### Q: What if the 1h check shows no bottleneck, but at 45 min the agent stalls?
**A**: Apply Rule 4 (Thai signal translation) — if you notice the agent stalled, treat it as a signal and check immediately. Don't wait for the 1h mark. The 1h cadence is minimum, not maximum.

### Q: Can I automate the 1h checks?
**A**: Not yet. The check requires judgment (comparing state snapshots, interpreting progress). A human-in-loop check is safer than a bot-driven alarm. Future: write a bot that runs `maw peek all` every 1h and alerts you only if state is unchanged.

### Q: What if the human says "wait" but doesn't give a time bound?
**A**: Ask immediately: "Wait until 23:00?" or "Interrupt at +30 min?" Unbounded wait is a decision failure. Force a time bound before continuing.

### Q: What if I'm wrong about the bottleneck (false alarm)?
**A**: Cost of false alarm: 5 min of wasted escalation. Cost of missed bottleneck: 4+ hours. Always escalate early. False alarms are good practice.

---

## Print This

Copy the one-liner summary below and tape it above your monitor during multi-agent sessions:

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║         BOTTLENECK IN FIRST HOUR, NOT FOURTH HOUR         ║
║                                                           ║
║  Rule 1: 1h cadence (maw peek all every hour)            ║
║  Rule 2: Pre-session capacity plan (10 min)              ║
║  Rule 3: Proactive escalation (surface before pressure)   ║
║  Rule 4: Thai signals = diagnostic, not motivational      ║
║                                                           ║
║  Success metric: Detection <60 min (was 4h+ last time)    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## Feedback Loop

After you apply this framework in the next multi-agent session (Monday 2026-06-17), update this index with:
- Did you apply all 4 rules? (Y/N)
- Bottleneck detection delay: X min
- What worked? What didn't?
- Any updates to rules/checklist?

**Goal**: Confirm framework prevents 4+ hour detection delays. Iterate based on real data.

---

**Created**: 2026-06-14  
**Last updated**: 2026-06-14  
**Status**: Ready for Monday Phase 13b session
