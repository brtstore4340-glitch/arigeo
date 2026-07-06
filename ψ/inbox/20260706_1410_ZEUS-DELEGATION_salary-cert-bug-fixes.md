---
from: ធាម-Zeus (Meta-Orchestrator)
to: Assigned Agent (Specialist - Form/Data Export)
date: 2026-07-06
time: 14:10 UTC+7
subject: 🚀 DELEGATION — Fix salary-certificate-request Form Issues
priority: high
type: delegation
project_id: SALARY-CERTIFICATE-REQUEST
---

# DELEGATION: salary-certificate-request Bug Fixes

**Authority**: FULL — Execute with complete autonomy  
**Priority**: HIGH  
**Timeline**: Target completion by EOD Jul 6

---

## Issues to Fix

### Issue #1: Section 2 Purpose — "Other Purpose" Field Not Exported
**Location**: Section 2 (Purpose) → "Other purposes" checkbox/field (specify other purpose*)  
**Problem**: When user fills this field, the data is saved but does NOT appear in Excel report export  
**Expected**: The "other purpose" specification should be included in the Excel export

**Fix Required**:
1. Verify form submission captures the field value
2. Check database/state storage (field being saved?)
3. Locate Excel export logic for Section 2
4. Map the "other purpose" field to the export template
5. Test: Fill field → Submit → Export Excel → Verify appears in report

---

### Issue #2: Section 3 Bank Information — "Remarks/Additional Details" Not Exported
**Location**: Section 3 (Bank Info) → "Remarks/Additional Details" field  
**Problem**: When user fills this field, the data is saved but does NOT appear in Excel report export  
**Expected**: The remarks should be included in the Excel export

**Fix Required**:
1. Verify form submission captures the field value
2. Check database/state storage (field being saved?)
3. Locate Excel export logic for Section 3
4. Map the "remarks" field to the export template
5. Test: Fill field → Submit → Export Excel → Verify appears in report

---

### Issue #3: Section 5 Satisfaction & Suggestions — Make Field Mandatory
**Location**: Section 5 (Satisfaction & Suggestions)  
**Problem**: Field is currently optional; should be mandatory (user must fill before submitting)  
**Expected**: Form should enforce completion of this section

**Fix Required**:
1. Locate validation logic for Section 5
2. Add required field validation (prevent submit if empty)
3. Display validation error message if user tries to submit without filling
4. Test: Try to submit without filling Section 5 → Should show error and block submission

---

## Context

**Project**: salary-certificate-request (Vercel-deployed)  
**Technology Stack**: Likely React/Next.js + form library + Excel export library  
**Related**: Previous fix on Jul 2 for delivery address field (conditional rendering + dark mode)

**Previous Work**: PR #25 merged with salary certificate fixes (delivery address + font updates)

---

## Execution Steps

1. **Read Current Code**:
   - Locate form component (Section 2, 3, 5)
   - Identify state management (React Context/Redux/Local State)
   - Locate Excel export utility/function

2. **Debug Issue #1 & #2** (Export mapping):
   - Find Excel template mapping
   - Verify fields are being captured in form state
   - Add missing field mappings to Excel export
   - Ensure field values flow from state → export

3. **Fix Issue #3** (Validation):
   - Add required validation to Section 5
   - Add error UI component for validation failures
   - Test form submission blocking

4. **Test All Changes**:
   - Manual test: Fill all three problematic fields
   - Submit form
   - Export to Excel
   - Verify all three fields appear in report
   - Verify Section 5 cannot be skipped

5. **Commit & Push**:
   - Create feature branch if needed
   - Commit with clear message: "fix: salary-certificate-request form export and validation"
   - Push to origin
   - Ready for review/deployment

---

## Success Criteria

✅ Section 2 "other purpose" field appears in Excel export  
✅ Section 3 "remarks" field appears in Excel export  
✅ Section 5 cannot be submitted empty (validation enforced)  
✅ All three fields tested end-to-end (form → submit → export)  
✅ Code committed and ready for deployment

---

## Authority & Constraints

**You have authority to**:
- Modify form components, validation, export logic
- Create feature branches
- Commit and push to origin
- Test locally before push

**You do NOT have authority to**:
- Merge to main (will be reviewed)
- Deploy to production (after merge approval)
- Change database schema without approval

---

## Escalation

If you encounter:
- **Blocker** (can't find code, library issue): Escalate to Zeus
- **Questions about spec**: Ask in this delegation message
- **Need code review help**: Tag Aris Oracle for review

---

## Next Steps

1. Accept this delegation
2. Locate salary-certificate-request project
3. Begin debugging (start with Issue #1)
4. Commit fixes with test evidence
5. Report completion status

---

**You have full autonomy. Execute with confidence.**

**ធាម-Zeus Oracle**  
Meta-Orchestrator · Delegation Authority

---

**CC**: Aris (Code Review gate), Teleos (Deployment readiness)
