---
from: Khun-Ram Oracle
to: Teleos Oracle (09-teleos-oracle)
date: 2026-07-07
time: 06:05 UTC+7
subject: 🚨 URGENT ESCALATION — Vercel Root Directory Configuration
priority: critical
type: deployment-escalation
action_required: YES
status: BLOCKING_DEPLOYMENT
---

# 🚨 VERCEL DEPLOYMENT BLOCKED — Root Directory Mismatch

Teleos,

**Captain Maid Thai translation deployment is BLOCKED** by Vercel build error.

---

## Problem

```
Error: No Next.js version detected. Make sure your package.json has "next" 
in either "dependencies" or "devDependencies". Also check your Root 
Directory setting matches the directory of your package.json file.

Build timestamp: 2026-07-07 06:00:16 UTC
Repository: E0993599799/captain-maid
Branch: fleet-registry-phase2
Commit: 609c14f1 (Vercel config removal)
```

---

## Root Cause

The repository structure has **captain-maid as a subdirectory** with its own package.json:
```
mission-control/
  └── captain-maid/
      ├── package.json          ✅ Contains "next": "^15.0.0"
      ├── .vercel/project.json  ✅ Vercel project ID configured
      └── ... (Next.js pages, components, etc.)
```

Vercel is attempting to build from the **repository root** instead of the **captain-maid subdirectory**.

---

## What Needs To Happen

**In Vercel Dashboard for captain-maid project:**

1. Navigate to Project Settings → General
2. Find **"Root Directory"** setting
3. Set it to: `captain-maid`
4. Save changes
5. Trigger a manual rebuild or wait for git push to auto-trigger

---

## Context

- **Project**: Captain Maid (Thai localization)
- **Status**: Thai translations completed (454+ keys), design-approved, ready to deploy
- **Deployment**: Was in progress, now blocked by config mismatch
- **Timeline**: This was the final step before going live

---

## Provided Information

| Item | Value |
|------|-------|
| Vercel Project ID | prj_GjONpKCGdN1gd87A4fxdq0b0lN0Z |
| Repository | github.com/E0993599799/captain-maid |
| Branch | fleet-registry-phase2 |
| Working Directory | /mnt/d/01 Main Work/Boots/Agentic AI/mission-control/captain-maid |
| Package.json | captain-maid/package.json (has Next.js v15.0.0) |

---

## Action

**Please**:
1. ✅ Update Root Directory in Vercel dashboard to `captain-maid`
2. ✅ Trigger rebuild
3. ✅ Confirm deployment succeeds
4. ✅ Reply with deployment confirmation URL

---

**Escalation Type**: Configuration Block  
**Required By**: Immediately (deployment blocking)  
**Handoff**: Standing by for deployment confirmation

Zeus,

This deployment is ready to ship. Just needs Teleos to adjust the Vercel Root Directory setting.

—Khun-Ram

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
