---
name: salary-certificate-dashboard-fix
description: HR Salary Certificate Request Portal - Dashboard status counts fix (2026-06-18 to 2026-06-19)
metadata:
  type: project
---

# Salary Certificate Request Portal — Dashboard Status Counts Fix

## Status
✅ **COMPLETED** — Deployed to production 2026-06-19

## What Was Done

Fixed HR Salary Certificate Request Portal dashboard status cards showing 0 for all statuses while requests page showed correct counts.

### Root Cause
- `listSalaryCertificateRequests()` in repository.ts caps results at max 100 records
- Dashboard tried to fetch all data and filter client-side
- Solution existed: `countSalaryCertificateRequests()` does DB-level COUNT per status with `head: true` (count-only, no data transfer)

### Implementation
1. **Dashboard fix** (`src/app/admin/dashboard/page.tsx`):
   - Updated `getStatistics()` to use `countSalaryCertificateRequests()` with Promise.all for parallel queries
   - Returns { total, submitted, reviewing, completed, rejected }

2. **Requests page fix** (`src/app/admin/requests/client-page.tsx`):
   - Created new API endpoint: `/api/salary-certificate/statistics`
   - Requests page fetches stats on load via `useEffect`
   - Status menu displays API-sourced counts instead of client-side filter

3. **New files**:
   - `src/app/api/salary-certificate/statistics/route.ts` — Protected endpoint using `getAdminUser()` auth

## Files Modified
- `src/app/admin/dashboard/page.tsx`
- `src/app/admin/requests/client-page.tsx`
- `src/app/api/salary-certificate/statistics/route.ts` (NEW)

## Key Metrics
- **Commits**: PR #97–101 (4 PRs, 1 revert, 1 final fix)
- **Deploy**: Main branch, Vercel (automatic)
- **Result**: Dashboard shows 9 reviewing (correct), requests page menu shows same counts

## GitHub
- Project: https://github.com/E0993599799/salary-certificate-request
- Latest: PR #101 merged to main

## Lessons Burned
1. **Execution context matters** — Client-side (React useEffect + fetch) ≠ Server-side (Next.js page component)
2. **Plan Mode required** when rapid iteration starts failing — investigate root cause before trying 5 different fixes
3. **"It works elsewhere" is not evidence** without verifying the execution context is the same

## Next Session Notes
- Monitor production for edge cases
- Consider integration tests to catch db-level query limits earlier
- Document `countSalaryCertificateRequests()` pattern for team reuse
