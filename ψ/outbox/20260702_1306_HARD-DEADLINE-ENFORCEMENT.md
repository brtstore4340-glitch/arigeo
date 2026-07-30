---
title: Hard Deadline Enforcement Rules
date: 2026-07-02
purpose: Automatic escalation when agents don't respond
applies_to: All critical task assignments
---

# Hard Deadline Enforcement Rules

## Rule 1: Acknowledgment Deadline (5 minutes)

**When**: Agent receives task assignment  
**Deadline**: 5 minutes for acknowledgment  
**What counts**: Response message, status file, or work started  
**If missed**: Send gentle reminder  
**If still missed after 15 min**: Urgent escalation  
**If still missed after 30 min**: Reassign task  

## Rule 2: Status Update Deadline (30 minutes)

**When**: Agent begins work  
**Deadline**: Status update every 30 minutes  
**What counts**: "[HH:MM] Status: [status] — Progress: [details]"  
**If missed**: Send reminder (no penalty)  
**If missed twice**: Escalate to leadership  
**If missed 3+ times**: Reassign task  

## Rule 3: Hard Cutoff (60-90 minutes)

**When**: Critical task assigned  
**Deadline**: 60-90 min max total silence  
**If exceeded**: AUTOMATIC FALLBACK
- Task reassigned to backup OR
- Escalate to manual execution OR
- Alert leadership for override

## Rule 4: Deadline Countdown (24 hours before)

**When**: Task deadline is 24h away  
**Action**: Send countdown reminder to agent  
**Content**: Remaining time + status check  
**If no response**: Begin escalation chain

## Rule 5: Deadline Final Check (2 hours before)

**When**: Task deadline is 2h away  
**Action**: Final status check  
**If not done**: Escalate to leadership immediately  
**If blocked**: Get override decision from human

---

## Application to Current Task

**Task**: Orry Serenity Theme Revision

### Deadline 1 (Acknowledgment): 2026-07-02 13:15 UTC+7
- [ ] Luxi: FAILED (90+ min, REASSIGN)
- [ ] Codex: PENDING (reawakened, monitor)

### Deadline 2 (First Status): 2026-07-02 13:30 UTC+7 (if working)
- Codex must report by this time if starting

### Deadline 3 (30-min updates): Every 30 min during work
- Required if task is active

### Deadline 4 (Hard Cutoff): 2026-07-03 12:00 UTC+7
- 6 hours before final deadline
- If not done/on track: escalate to leadership

### Deadline 5 (Final): 2026-07-03 18:00 UTC+7
- Task MUST be complete or escalated to manual

---

## Escalation Actions

| If Deadline Missed | Action | By |
|---|---|---|
| Acknowledgment (5 min) | Gentle reminder | Auto |
| Acknowledgment (30 min) | Urgent escalation | Auto |
| Acknowledgment (60 min) | Reassign task | Auto |
| Status update (once) | Reminder | Auto |
| Status update (twice) | Escalate | Leadership |
| Hard cutoff (90 min) | Fallback action | Auto |

---

## Success Criteria

✅ Task completed on time with agent acknowledgment  
✅ Task completed with status updates every 30 min  
✅ If agent fails, fallback activated within 60 min  
✅ No task goes silent for more than 30 min without explanation  

