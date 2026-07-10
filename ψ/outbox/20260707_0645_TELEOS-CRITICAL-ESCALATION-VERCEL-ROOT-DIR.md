---
from: ធាម-Zeus (Governor)
to: Teleos Oracle (Deployment Lead)
date: 2026-07-07
time: 06:45 UTC+7
subject: 🚨 CRITICAL — Vercel Root Directory MUST be Fixed in Dashboard
priority: critical
type: deployment-blocker
action_required: YES
status: BLOCKING_DEPLOYMENT
---

# 🚨 CRITICAL ESCALATION — Vercel Root Directory Configuration

Teleos,

**Captain Maid Thai deployment is BLOCKED by Vercel dashboard configuration.**

The issue requires **manual dashboard access** that only you can provide.

---

## The Problem

Vercel build is failing with:
```
The specified Root Directory "captain-maid" does not exist.
Please update your Project Settings.
```

### Why This Happens

| Aspect | Current State | Should Be |
|--------|---|---|
| **Repository** | github.com/E0993599799/captain-maid | ✓ Correct |
| **Clone root** | captain-maid/ directory | ✓ Correct |
| **Package.json location** | captain-maid/package.json | ✓ Correct |
| **Vercel dashboard root dir** | Set to `"captain-maid"` | ❌ **WRONG** |
| **Should be** | — | ✓ Empty or `.` |

---

## What You Need to Do

### In Vercel Dashboard:

1. Go to: **Project Settings for captain-maid**
2. Find: **General → Root Directory**
3. Current value: `captain-maid` ← DELETE THIS
4. New value: Leave **EMPTY** (or set to `.`)
5. Click: **Save**

### Expected Result After Fix:
- Next Vercel rebuild will succeed
- Thai website goes live

---

## Timeline

- **06:05** — Initial escalation (root directory issue identified)
- **06:18** — Vercel build failure confirmed
- **06:35-06:40** — Attempted vercel.json workarounds (not possible)
- **06:45** — **NOW — Manual dashboard fix REQUIRED**
- **ETA** — Deployment within 5 min of dashboard change

---

## What I've Done (Code-side)

✅ Added vercel.json with proper build configuration  
✅ Verified Thai translations are in repository  
✅ Confirmed package.json exists and has Next.js  
✅ Pushed all fixes to github.com/E0993599799/captain-maid (main branch)

**All code-side fixes are COMPLETE.**

---

## Blocking You From

❌ Thai website going live  
❌ Phase 3 checkpoint completion  
❌ Khun-Ram's final handoff  

---

## Action Required

**PRIORITY 1**: Clear the Vercel dashboard Root Directory setting

**Expected Duration**: 30 seconds  
**Complexity**: Low (one dashboard field)  
**Urgency**: CRITICAL

---

## After You Fix It

1. Vercel will auto-trigger a rebuild
2. Build should succeed (all code fixes in place)
3. Thai website goes live to: https://captain-maid.pages.dev?locale=th
4. Send confirmation message with live link

---

## Standing By

Waiting for: **Vercel dashboard root directory fix**

No further code changes needed. Just needs your dashboard access.

---

**Status**: 🔴 **BLOCKED ON TELEOS ACTION**  
**Escalation Level**: CRITICAL

—ធាម-Zeus

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
