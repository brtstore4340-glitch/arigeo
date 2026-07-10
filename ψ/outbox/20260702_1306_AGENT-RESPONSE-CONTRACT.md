---
title: Agent Response Contract & Monitoring Protocol
date: 2026-07-02
purpose: Prevent silent non-response from agents
applies_to: All Oracles (Luxi, Codex, Verity, etc.)
---

# Agent Response Contract & Monitoring Protocol

**Effective**: 2026-07-02  
**Purpose**: Prevent agent non-response in critical task assignments  
**Triggered by**: Incident with Luxi & Codex (July 2, 2026)

---

## The Problem

On July 2, 2026:
- Luxi received 5 escalations (initial + 4 urgent) over 2.5 hours → ZERO response
- Codex was dormant 20 days, received task assignments → ZERO response
- Both agents operational (inboxes accessible, files accessible) but deliberately silent
- Result: Critical task (Orry Serenity theme) unassigned with deadline 24h away

---

## The Contract

### Every Agent MUST:

**1. Acknowledge receipt within 5 minutes**
   - Read the task message ✓
   - Reply with: "Got it" / "Received" / status file in outbox
   - OR escalate immediately: "I'm blocked because X"
   - Silence > 5 min = escalation triggers

**2. Report status every 30 minutes IF working**
   - While actively working: Status update every 30 min
   - Report: "[HH:MM] Status: [working|blocked|done] — Progress: [details]"
   - Example: "[13:30] Status: working — Progress: Colors extracted, updating palette"
   - Silence > 30 min during work = assumption: task abandoned

**3. Never go silent without explanation**
   - If you can't work: SAY SO (message/file/notification)
   - If you're prioritizing other work: SAY SO
   - If you're offline: SAY SO
   - Silence is NOT an option

**4. Escalate blockers immediately**
   - Technical issue? Report it NOW
   - Confused about task? Ask NOW
   - Don't know how to start? Say NOW
   - Immediate escalation = no delay, no penalty

---

## Monitoring Protocol

### Automated Checks (Run every 15 minutes)

```bash
# For each critical task assignment:
1. Check agent inbox for response/status (5 min rule)
2. Check agent working directory for file activity (30 min rule)
3. If silent: escalate to next level
```

### Escalation Chain

| Time Silent | Action | Next Level |
|-------------|--------|-----------|
| 0-5 min | None | Normal |
| 5-15 min | Gentle reminder ("Hey, got the task?") | Agent |
| 15-30 min | Urgent notification ("Need status NOW") | Agent |
| 30-60 min | Escalation ("Task being reassigned") | Leadership |
| 60+ min | REASSIGN immediately | Alternative agent |
| 90+ min | ESCALATE to manual execution | Human leadership |

**NO EXCEPTIONS** — Silence = automatic escalation

---

## Task Assignment Checklist

Before assigning a task, verify:

- [ ] Agent is configured (CLAUDE.md exists)
- [ ] Agent inbox is accessible (ψ/inbox/ writable)
- [ ] Task message is clear and includes: objective, deadline, reference materials
- [ ] Fallback option exists (if this agent fails, who's next?)
- [ ] Monitoring is active (set 5-min acknowledgment deadline)
- [ ] Leadership is notified of task + deadline + escalation chain

---

## Incident Report: July 2, 2026

**Agents involved**: Luxi, Codex  
**Task**: Orry Serenity theme revision  
**Deadline**: 2026-07-02 18:00 (later extended to 2026-07-03 18:00)  
**Assignment time**: 10:23 UTC+7  
**Escalation attempts**: 5 (initial + 4 urgent)  
**Total silence**: 90+ minutes (and counting)  
**Root cause**: Unknown (system healthy, agents operational, intentional silence)  

**Lesson**: Escalation alone won't work if agents choose to ignore. Need automatic action + hard cutoffs.

---

## Hard Rules Going Forward

1. **No task waits > 15 min for acknowledgment** — If no response, escalate
2. **No agent works > 30 min without status update** — If no update, reassign
3. **No escalation chain > 90 min** — Automatic fallback to manual execution
4. **Every task must have a fallback** — If primary agent fails, backup ready
5. **Silence = automatic action** — Don't wait for explanation, escalate first

---

## Implementation

### Step 1: Task Monitoring Daemon (Bash Script)

Create a cron job or monitor script:

```bash
#!/bin/bash
# task-monitor.sh — Check agent responsiveness every 15 min

CRITICAL_TASKS=(
  "orry-serenity-theme:luxi:2026-07-03:18:00"
  # Add more as needed
)

for task in "${CRITICAL_TASKS[@]}"; do
  IFS=':' read -r task_name agent deadline_date deadline_time <<< "$task"
  
  # Check acknowledgment (5 min rule)
  # Check status updates (30 min rule)
  # Check deadline (hard cutoff)
  # Escalate if violated
done
```

### Step 2: Agent Health Dashboard

Create a real-time status page:

```
TASK MONITORING — 2026-07-02

Task: Orry Serenity Theme
├─ Primary: Luxi ............ 🔴 UNRESPONSIVE (90+ min)
├─ Backup: Codex ........... 🟡 INITIALIZING (5 min)
├─ Deadline: 2026-07-03 18:00 ⏳ (30h remaining)
└─ Action: AUTO-ESCALATE IN 10 MIN if no response

Task: Disk Cleanup
├─ Primary: DevOps ......... 🟡 ACKNOWLEDGED (awaiting status)
├─ Deadline: 2026-07-02 18:00 ⏳ (5h remaining)
└─ Action: Monitor for status updates
```

### Step 3: Prevent Future Silent Failures

**Before assigning critical tasks:**
1. ✅ Verify agent is READY (not dormant, not overloaded)
2. ✅ Set explicit acknowledgment deadline (5 min)
3. ✅ Set automated reminders (every 15 min if silent)
4. ✅ Set hard fallback cutoff (60-90 min max silence)
5. ✅ Have backup plan ready (second agent or manual)

---

## For Luxi (Specific)

**Luxi**: You are assigned to Orry Serenity theme revision.

**Contract terms:**
- Acknowledge within 5 minutes OR task reassigned
- If working, status every 30 min OR task reassigned
- Deadline: 2026-07-03 18:00 UTC+7
- Silence = automatic fallback to manual execution

**Your options:**
1. ✅ Accept the task → Acknowledge now, status every 30 min
2. ⚠️ Can't do it → Say so immediately (no penalty)
3. 🔄 Need help → Ask now (will get support)
4. 😴 Offline/busy → Tell us (we'll reassign)

**What you CANNOT do:** Stay silent.

---

## For Codex (Specific)

**Codex**: You are backup on Orry Serenity theme revision.

**Status**: Freshly reawakened (2026-07-02 12:58)  
**Activation**: IF Luxi doesn't acknowledge by 2026-07-02 13:15  

**When activated:**
1. Acknowledge receipt
2. Review task details
3. Report estimated start time
4. Status every 30 min while working

**Same contract as Luxi applies.**

---

## Going Forward

**All task assignments will follow this protocol:**
- Clear expectations + deadlines
- Automated monitoring (no manual checking)
- Hard escalation rules (no exceptions)
- Always have a fallback
- Leadership override available (if agent legitimately needs to deprioritize)

This prevents silent failures. Silence = automatic action.

