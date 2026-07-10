---
name: handoff-currency-verification
description: Always verify handoff claims against current reality before serving pending lists
date: 2026-06-10
pattern: Handoff written at Phase 3, reality at Phase 9 — stale claims break user trust
source: rrr session 8d689b82 (Input Triage & Priority Surface)
concepts: [handoff, verification, trust, stale-state]
---

# Handoff Currency Is Not Status

## The Problem

A handoff written at Phase 3 (01:10 GMT+7) claimed:
- Phase 3 at 2/5 tasks complete
- Tasks 3–5 queued for execution
- 45K tokens remaining (token crisis)

**Reality** (6 hours later): Phase 9 shipped. All Phase 3–9 delivered.

**Impact**: User received a pending list that was fiction. Surfacing it as-is would have broken trust ("Why are you asking me about Phase 3 when Phase 9 is done?").

---

## Why This Happens

1. **Handoff is a snapshot**, written when previous session ended
2. **Work continues unseen** — agents executing in parallel, other sessions active
3. **Point-in-time claims don't age well** — within 2 hours, a pending list can become half-finished or irrelevant
4. **Humans expect handoffs to be current** — when a handoff says "pending," humans trust it's still pending

---

## The Rule

**Before surfacing any "pending" list to a user:**

1. **Verify ≥50% of items** against current reality:
   - `ls path/file` — does the file exist?
   - `gh pr view N --json state` — is the PR still open?
   - `git log main..branch` — are there commits?
   - `grep pattern file` — was the pattern applied?

2. **If >30% of pending items are done:**
   - Show a **correction table**:
     ```
     | Item | Handoff said | Reality |
     | Copy cache/ | pending | DONE (Apr 20) |
     | PR #4 | open | MERGED |
     ```
   - Don't serve stale pending as truth

3. **If handoff is >2 hours old**, add a timestamp note: "Handoff from HH:MM; verified at HH:MM"

---

## When to Apply This

- ✅ Surfacing pending lists to users
- ✅ Starting a new session from a previous handoff
- ✅ Making recommendations based on pending work
- ❌ NOT needed for internal notes or draft status (those are ephemeral)

---

## Pattern Connection

Mirrors **Agent Watchdog Lesson** — agents go silent without human triggers. Work happens unseen. Recovery requires explicit sync via `/dig` or `/recap --now deep` to resurface reality.

Handoff staleness is the written equivalent: the document went silent, but work didn't stop.

---

## Example Fix

**Before** (serves stale state):
```
Pending: Phase 3 Tasks 3–5, context compression, federation setup
```

**After** (verified):
```
Pending (verified 08:00 GMT+7):
| Item | Status | Since |
| Phase 3 Task 3 | DONE | 02:15 |
| Phase 3 Task 4 | DONE | 03:30 |
| Phase 3 Task 5 | DONE | 05:45 |
| Federation setup | DONE (Phase 9 shipped) | 07:39 |

**Actually pending**: Phase 9 deployment status unknown — run /recap to verify.
```

---

**Author**: Tham (oracle-tham-node)  
**Session**: 8d689b82 (Input Triage & Priority Surface)  
**Decision**: Always verify, even when handoff looks authoritative.
