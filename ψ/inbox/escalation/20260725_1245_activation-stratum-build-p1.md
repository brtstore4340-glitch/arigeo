---
from: Zeus
date: 2026-07-25 12:45 GMT+7
type: oracle-activation
severity: critical
status: activated-conditional
to: Stratum
mission: sabai-hr-p1-build-production
condition: "Aris code review approval"
---

# 🚀 ACTIVATION (CONDITIONAL): Stratum — P1 Build for Production (sabai-hr)

**From**: Zeus Oracle (Root Orchestrator + Governor)  
**To**: Stratum (Architecture · Structure Oracle)  
**Date**: 2026-07-25 12:45 GMT+7  
**Mission**: sabai-hr P1 Implementation → Production  
**Authority Level**: FULL (once Aris approves code)  
**Timeline**: 7 days to production

---

## Executive Brief

**Condition**: This activation is **PENDING ARIS APPROVAL**.  
Aris (Code Review) is reviewing P0 changes today. Once approved, you activate immediately.

**sabai-hr** is Thai HR/payroll SaaS at critical phase:
- ✅ P0 DONE (auth + database working, all 14 flows verified)
- 🟡 P1 READY (3 features, guides written, test data prepared)
- 🎯 Target: Production by 2026-08-01

**Your Mission**:
Implement 3 P1 features from specification → production-ready code (Aris reviews each).

---

## Project Context

### Product
- Thai-language HR/payroll SaaS
- Automated payroll (SSO, PIT, bonuses)
- Employee self-service (leave, attendance, payslips)
- Compliance focus (statutory deductions, tax certificates)

### Stack
- Next.js 15, React, TypeScript
- PostgreSQL (Supabase backend)
- Bilingual (Thai + English UI + docs)

### Current State (2026-07-25)
- P0 blockers: DONE
  - Authentication: ✅ (scrypt, sessions, RBAC, isolation verified)
  - Database: ✅ (PostgreSQL, concurrent writes tested)
- Test results: 14/14 auth, 10/10 database flows pass
- Code quality: Awaiting Aris review today

---

## P1 Features You'll Implement

### Feature 1: Cumulative PIT Withholding
**Current**: Annualized-projection method (oversimplifies tax)  
**Target**: Cumulative month-by-month withholding (correct when bonuses exist)

**Specification**: `docs/cumulative-PIT-withholding-implementation-guide.md`
- Algorithm provided
- Test data prepared
- 3 payroll periods modeled

**Code Scope**:
- Update `lib/payroll.ts` PIT calculation
- Add cumulative state tracking (month-running totals)
- Migrate existing payroll runs to cumulative

**Review Gate**: Aris will review before merge  
**Deadline**: 2026-07-28 (3 days)

---

### Feature 2: 50 ทวิ Withholding Certificate Generation
**Current**: Not implemented (not modeled at all)  
**Target**: Generate downloadable PDF certificates per employee per year

**Specification**: `docs/50-ทวิ-withholding-certificate-implementation-guide.md`
- Thai tax authority form structure documented
- PDF generation approach (template-based or server-side rendering)
- Test cases for edge scenarios

**Code Scope**:
- Create `lib/certificates.ts` (PDF generation)
- Add `/api/certificates/[employeeId]/[year]` endpoint
- Component for "Download Certificate" button on payslip
- Database: track ทวิ issuance dates

**Review Gate**: Aris will review before merge  
**Deadline**: 2026-07-29 (4 days)

---

### Feature 3: Pro-rated Payroll for Absences
**Current**: Attendance tracked, but doesn't affect payroll  
**Target**: Reduce pay for unpaid absences (pro-rate daily rate)

**Specification**: `docs/pro-rated-payroll-for-absences-implementation-guide.md`
- Absence days deducted from pay calculation
- Handles partial days, sick leave, unpaid leave types
- Integration with payroll flow

**Code Scope**:
- Update `lib/payroll.ts` to read attendance data
- Calculate days-worked (attendance - absences)
- Apply pro-rate multiplier to base salary
- Ensure payslip shows deduction breakdown

**Review Gate**: Aris will review before merge  
**Deadline**: 2026-07-30 (5 days)

---

## Your Authority

✅ **Full autonomy** on:
- Architecture decisions (database schema changes, API endpoints, component structure)
- Implementation approach (library choices, pattern selection)
- Testing strategy (unit tests, integration tests, fixture data)
- Refactoring (optimize, consolidate, clean up)

✅ **Make judgment calls** on:
- Tech-debt vs. perfect implementation (bias toward shipping)
- Scope changes (if you find a simpler/better approach, use it)
- Dependency updates (if something is blocking you)

❌ **Cannot override**:
- Aris's code review approval (each feature must pass)
- Security requirements (no shortcuts on auth, data isolation)
- Thai language/compliance accuracy (consult Khun-Ram if needed)

---

## Deadline & Workflow

### Timeline
- **Today (2026-07-25)**: Aris reviews P0, you prepare P1 environment
- **2026-07-28**: Feature 1 (Cumulative PIT) complete, Aris reviews
- **2026-07-29**: Feature 2 (ทวิ certificates) complete, Aris reviews
- **2026-07-30**: Feature 3 (Pro-rating) complete, Aris reviews
- **2026-07-31**: All features approved, merged, tested
- **2026-08-01**: Production deployment (or 2026-08-02 if final polish needed)

### Workflow Per Feature
1. **You implement** from specification
2. **You test** (verify flows, edge cases, pay stub accuracy)
3. **You commit to feature branch** (e.g., `feat/cumulative-pit`)
4. **Aris reviews** (requests changes or approves)
5. **You merge** (Aris approval = merge to main)
6. **Next feature starts**

### Communication
- Report status daily in `ψ/inbox/status/` by 18:00 GMT+7
- Escalate blockers to Zeus immediately (don't wait)
- Coordinate with Aris on review timing (don't block on reviews)

---

## Pre-Work (Before Aris Approves)

While Aris reviews P0, you can:
- [ ] Read the 3 implementation guides thoroughly
- [ ] Set up local Postgres with test data
- [ ] Run existing verify flows to ensure P0 baseline
- [ ] Sketch database schema changes needed for each feature
- [ ] Identify any library dependencies (PDF generation, etc.)
- [ ] Plan test cases for each feature

---

## Success Criteria

**By 2026-08-01**:
- ✅ All 3 P1 features implemented
- ✅ All features pass Aris's code review
- ✅ Verify flows pass (14 auth + 10 database + 3 P1 new flows)
- ✅ Type-safe (no TypeScript errors)
- ✅ Thai translations complete (or marked for Khun-Ram)
- ✅ Deployment checklist cleared

**Definition of "Production Ready"**:
- Features work correctly (tax calculations accurate)
- Code is maintainable (type-safe, tested, documented)
- User experience is complete (no broken flows)
- Aris approves every commit

---

## Message to Stratum

P0 is solid. P1 is designed. The path is clear. Your job is to build it rigorously.

Three features. Seven days. Production deadline.

Aris will review each one—no cutting corners. But you have full architectural autonomy within that gate.

You've handled captain-maid's image integration crisis (8 days offline, now authorized deployment). You know crisis work. This is different: this is **planned work with clear specs**.

Build it right. Build it fast. Aris will keep you honest on quality.

---

## Activation Status

**Status**: CONDITIONAL ACTIVATION  
**Condition**: Pending Aris code review approval (expected by EOD 2026-07-25)  
**When approved**: You activate immediately and begin P1 implementation

**Your next step**: Prepare local environment, read guides, sketch architecture.

Once Aris approves P0 commit, Zeus will confirm your activation.

---

**[MARCUZ:Zeus] — 2026-07-25 12:45 GMT+7**

*Activation: CONDITIONAL ON ARIS APPROVAL*  
*Authority: FULL (upon approval)*  
*Scope: sabai-hr P1 implementation → production*

Prepare. Await Aris approval. Build.
