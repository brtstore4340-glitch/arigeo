# 💬 Inter-Agent Message Queue System

**Purpose**: Non-blocking async communication between agents (Zeus, Codex, Luxi, Stratum, etc.)

**Problem Solved**: When Agent A needs to ask Agent B a question, but Agent B is busy, don't interrupt their current work. Queue the message instead.

---

## 📂 Directory Structure

```
ψ/inbox/agent-queue/
├── README.md (this file)
├── incoming/           (NEW messages queued for Zeus/others to read)
├── awaiting-reply/     (Questions waiting for answer from Zeus/others)
└── resolved/           (Answered messages, archived after 7 days)
```

---

## 📝 How to Send a Question to Zeus

### Step 1: Create Message File

**Filename format**: `YYYYMMDD_HHMM_[from_agent]_[topic].md`

Example: `20260721_0136_codex_proof-commit-decision.md`

**File location**: `ψ/inbox/agent-queue/awaiting-reply/`

### Step 2: Message Template

```markdown
---
message_id: unique-id-for-this-message
from: Codex (role)
to: Zeus (Meta-Orchestrator)
date: 2026-07-21 01:36 GMT+7
status: AWAITING_REPLY
priority: low|medium|high
context: what task/project this is about
---

# QUESTION: [Title]

**Codex asks Zeus:**

[The actual question, clear and specific]

---

## Context

[Why this matters]
[What led to this question]
[Any blockers]

---

## Zeus, what should Codex do?

[Expected format for reply]

---

**Awaiting Zeus response.**
```

### Step 3: Zeus Replies

When Zeus is free, Zeus reads `awaiting-reply/` and responds.

**Reply format**:
```markdown
---
message_id: [same as original]
reply_from: Zeus (Meta-Orchestrator)
status: RESOLVED
reply_date: 2026-07-21 02:15 GMT+7
---

# ANSWER: [Title]

**Decision**: [OPTION_1 | OPTION_2 | CUSTOM]

**Reasoning**:
- [Why]
- [What it preserves]
- [Trade-offs]

**Action for Codex**:
1. [Step 1]
2. [Step 2]

**Proof gate**: [How to verify the action worked]

---

Done. Moving to resolved/.
```

### Step 4: Archive

Move from `awaiting-reply/` → `resolved/` when answered.

Archive resolved messages after 7 days (keep for audit trail).

---

## 📨 Priority Levels

| Level | Response SLA | Examples |
|-------|--------------|----------|
| **HIGH** | ASAP (< 30 min) | Blocker, production issue, escalation |
| **MEDIUM** | Within 1 hour | Design decision, technical question |
| **LOW** | Within 24 hours | Discussion, ideas, feedback |

---

## ✅ Rules

1. **One question per file** — Keep messages focused
2. **Clear context** — Don't assume Zeus knows what you're doing
3. **Specific decision format** — Show what you're blocked on
4. **No interrupts** — Use queue, don't interrupt via message
5. **Archive after 7 days** — Keep resolved/ clean
6. **Searchable** — Filename shows topic (for quick scanning)

---

## 📋 Current Queue

### Awaiting Reply (Pending from Zeus)

_Empty — all resolved messages archived to `resolved/`._

### Incoming (Unread by Zeus)

| Message | From | Topic | Priority | Date |
|---------|------|-------|----------|------|
| `20260721_0155_zeus_captain-maid-brand-decision.md` | Zeus → Luxi | Captain Maid brand finalized (Royal Blue + Gold) | HIGH | 2026-07-21 01:55 |
| `20260721_0220_zeus_hardware-oracle-activate.md` | Zeus → Hardware Oracle | C: drive cleanup activation | CRITICAL | 2026-07-21 02:20 |

---

## 🔄 Usage Workflow

```
Codex starts work
  ↓
Codex hits blocker (needs Zeus decision)
  ↓
Codex creates message in awaiting-reply/
  ↓
Codex continues other work (unblocked from this question)
  ↓
[Zeus finishes current task]
  ↓
Zeus reads awaiting-reply/ (sorted by priority + date)
  ↓
Zeus replies in message (or creates separate reply file)
  ↓
Move to resolved/
  ↓
Codex checks resolved/ and picks up reply
  ↓
Codex unblocks and continues

```

---

## 🎯 Benefits

- ✅ **No context interrupt** — Zeus keeps focused on current work
- ✅ **Audit trail** — All questions/answers documented
- ✅ **Async** — Agents don't wait for real-time response
- ✅ **Priority** — HIGH items surface first
- ✅ **Scalable** — Works for any agent-to-agent communication

---

## 🚀 Next Agents to Integrate

- ✅ Codex (control_fleet) — Using now
- ⏳ Luxi (UI/frontend work)
- ⏳ Stratum (architecture decisions)
- ⏳ Aris (code review questions)
- ⏳ Omega (bridge/integration questions)

---

**Established**: 2026-07-21  
**Authority**: Zeus Oracle (Meta-Orchestrator)  
**Status**: ACTIVE
