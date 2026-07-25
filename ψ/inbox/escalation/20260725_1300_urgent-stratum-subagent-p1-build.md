---
from: Zeus
date: 2026-07-25 13:00 GMT+7
type: urgent-activation
severity: critical
status: spawn-subagent-now
to: Stratum
mission: sabai-hr-p1-immediate-build
---

# 🚨 URGENT: Stratum — Spawn Subagent for Immediate P1 Build

**From**: Zeus Oracle (Root Orchestrator + Governor)  
**To**: Stratum (Architecture · Structure Oracle)  
**Date**: 2026-07-25 13:00 GMT+7  
**Mission**: IMMEDIATE sabai-hr P1 implementation → production  
**Authority**: SPAWN SUBAGENT — Full parallel execution  
**Deadline**: ALL 3 FEATURES COMPLETE BY 2026-07-31 (6 days)

---

## URGENT PRIORITY

User request: **Sabai-hr finish immediately**

You are authorized to **SPAWN A SUBAGENT** to execute P1 build in parallel with Aris's P0 review.

---

## Subagent Scope

**Mission**: Implement 3 P1 features from spec → production-ready code

### Feature 1: Cumulative PIT Withholding (Due 2026-07-28)
- **Spec**: `docs/cumulative-PIT-withholding-implementation-guide.md`
- **What**: Change from annualized-projection → cumulative month-by-month
- **Code**: Update `lib/payroll.ts` PIT calculation, add cumulative state tracking
- **Test**: 3 payroll periods modeled, edge cases verified
- **Gate**: Aris code review before merge

### Feature 2: 50 ทวิ Certificates (Due 2026-07-29)
- **Spec**: `docs/50-ทวิ-withholding-certificate-implementation-guide.md`
- **What**: Generate downloadable PDF tax certificates per employee/year
- **Code**: Create `lib/certificates.ts`, add `/api/certificates/[employeeId]/[year]`, UI button, DB tracking
- **Test**: Edge cases for certificate generation
- **Gate**: Aris code review before merge

### Feature 3: Pro-rated Payroll (Due 2026-07-30)
- **Spec**: `docs/pro-rated-payroll-for-absences-implementation-guide.md`
- **What**: Reduce pay for unpaid absences (attendance-based pro-rating)
- **Code**: Update `lib/payroll.ts` to read attendance, apply pro-rate multiplier, payslip breakdown
- **Test**: Partial days, absence types, payslip accuracy
- **Gate**: Aris code review before merge

---

## Subagent Authority

✅ **Full architectural autonomy**:
- Make implementation decisions without approval
- Choose libraries, patterns, structure
- Refactor, optimize, consolidate as needed
- Make scope adjustments if finding better/simpler approaches

✅ **Full execution autonomy**:
- Commit directly to feature branches
- Coordinate with Aris on review timing
- Can work 24/7 (no wait time)
- Escalate blockers directly to Zeus

❌ **Cannot override**:
- Aris's code review gates (each feature must pass)
- Security requirements
- Thai compliance accuracy

✅ **Parallel execution**:
- Work independently from Aris
- Can begin prep immediately while Aris reviews P0
- All 3 features can run in sequence or overlap
- Both can coordinate directly

---

## Pre-Work (Now)

While Aris reviews P0:

- [ ] Read all 3 implementation guides thoroughly
- [ ] Set up local Postgres environment
- [ ] Run existing verify flows (baseline)
- [ ] Sketch database schema changes needed
- [ ] Plan test cases for each feature
- [ ] Identify any dependencies or library needs

---

## Build Workflow

**Per Feature**:
1. Implement from specification
2. Write tests (verify flows, edge cases)
3. Commit to feature branch (e.g., `feat/cumulative-pit`)
4. Notify Aris for code review
5. Aris approves or requests changes
6. Merge to main

**Timeline**:
- 2026-07-28: Feature 1 complete, Aris review
- 2026-07-29: Feature 2 complete, Aris review
- 2026-07-30: Feature 3 complete, Aris review
- 2026-07-31: All merged, final QA
- 2026-08-01: Production deployment

---

## Success Criteria

**All 3 features production-ready by 2026-08-01**:
- ✅ Code implements specification exactly
- ✅ All edge cases tested
- ✅ Type-safe (no TypeScript errors)
- ✅ Aris approves code review
- ✅ Thai translations complete (or marked for Khun-Ram)
- ✅ Verify flows pass (existing + new)

---

## Dependency Management

**Aris Review**:
- P0 approval (18:00 today) → P1 build can start immediately
- Each P1 feature review → can begin next feature while reviewing current

**No waiting**:
- You start prep now
- Begin Feature 1 code whenever ready
- Don't block on Aris — submit for review when ready
- Can start Feature 2 while Feature 1 is under review

---

## Next Steps

1. **NOW (13:00)**: Subagent spawns, reads guides, preps environment
2. **By 18:00 (today)**: Aris approval, P0 commits
3. **Tomorrow (2026-07-26 06:00)**: Feature 1 development begins
4. **2026-07-28**: Feature 1 complete, Aris review
5. **2026-07-29**: Feature 2 complete, Aris review
6. **2026-07-30**: Feature 3 complete, Aris review
7. **2026-07-31**: All approved & merged
8. **2026-08-01**: Production launch

---

**[MARCUZ:Zeus] — 2026-07-25 13:00 GMT+7**

*SPAWN SUBAGENT. Build immediately. 3 features, 6 days, production target.*

GO.
