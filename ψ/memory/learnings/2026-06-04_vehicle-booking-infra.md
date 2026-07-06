# Infrastructure Review: Vehicle Booking System
**Date:** 2026-06-04  
**Reviewed by:** Tham (Zeus-node)  
**Scope:** Supabase schema, edge functions, SQL scripts, Cloudflare Pages config, DB indexes

---

## Layer 1: Schema Normalization

**Verdict: 3NF compliant. One redundancy found.**

Tables: `profiles`, `vehicles`, `bookings`, `audit_logs`

| Issue | Severity | Location |
|-------|----------|----------|
| `photo_url` AND `image_url` both added to `vehicles` | HIGH | `20260301000002_admin_enhancements.sql:13-14` |
| `is_active` + `is_deleted` on profiles overlap semantically | LOW | Expected — soft delete sets both, acceptable pattern |

Schema evolution is correct:
- `20260301000001` — re-pointed FK references from `auth.users` → `profiles(user_id)` for PostgREST joins ✓
- `20260302000001/2/3` — soft delete added cleanly ✓

---

## Layer 2: Edge Functions (7 functions)

### `create_booking` — PASS
- JWT verification before service key usage ✓
- Conflict check via `check_booking_conflict` RPC ✓
- Exclusion constraint is final atomic guard ✓
- CORS `*` — acceptable but should be locked to prod domain in future

### `approve_booking` — PASS (minor)
- Re-checks conflict before approving (race condition guard) ✓
- `approved_at: new Date().toISOString()` uses JS clock, not DB `now()` — minor inconsistency

### `cancel_booking` — PASS (minor)
- Fetches booking before auth/role check — one extra DB round-trip on unauthorized requests
- Functional logic is correct ✓

### `checkout_booking` / `checkin_booking` — PASS
- Mileage validation (in >= out) ✓
- Staff/admin role enforced ✓

### `expire_bookings` — TWO BUGS

**BUG 1 — Silent audit log failure (MEDIUM)**
```typescript
// expire_bookings/index.ts:41
await svc.rpc('insert_audit_log', {
  p_actor_id: '00000000-0000-0000-0000-000000000000', // system
  ...
})
```
`audit_logs.actor_id` has FK → `profiles(user_id)` (set in migration 20260301000001).
UUID `00000000-...` does not exist in profiles → FK violation.
supabase-js returns `{ error }` not throw, and there's no error check — failure is silent.
Result: auto-expiry runs but audit trail is NEVER written.

**Fix:** Either (a) seed a system profile with UUID `00000000-...`, or (b) make `actor_id` nullable for system actions, or (c) add error logging.

**BUG 2 — Unauthenticated access when CRON_SECRET not set (HIGH)**
```typescript
// expire_bookings/index.ts:21
const hasSecret = cronSecret ? incomingSecret === cronSecret : true  // ← OPEN when env not set
```
When `CRON_SECRET` env var is absent, `hasSecret = true` always → anyone can trigger expiry.

**Fix:** Make CRON_SECRET required — fail with 500 if not set, or enforce service_role JWT strictly.

### `admin_create_user` — not read (low priority)

---

## Layer 3: SQL Scripts (sql/ directory)

**Verdict: OUT OF SYNC with migrations/ — documentation hazard.**

| File | Status |
|------|--------|
| `sql/001_schema.sql` | Old: `bookings.user_id → auth.users(id)` (pre-fix) |
| `sql/002_rls.sql` | Old: no soft-delete filters |
| `sql/003_functions.sql` | Similar to migration version |
| `sql/004_seed.sql` | Same as migration seed |
| `sql/005_exclusion_constraint.sql` | Correct — btree_gist + exclusion constraint |

Ground truth is **migrations/** not sql/. The sql/ directory is the original scaffolding scripts and has diverged. Risk: a new developer running sql/ directly would create a broken schema that doesn't match the migration state.

**Recommendation:** Label sql/ as "legacy-reference" or delete it. All active DB work should go through migrations/.

---

## Layer 4: Cloudflare Pages Config

**Verdict: CORRECT. No issues.**

| Check | Status |
|-------|--------|
| `public/_redirects` → `/* /index.html 200` | ✓ SPA routing works |
| `vite.config.ts` — manual chunks (react, i18n, ui, supabase) | ✓ Good CDN cache strategy |
| Build: `tsc && vite build` → `dist/` | ✓ Correct |
| `auth.site_url` in `config.toml` | ✓ Points to prod domain |
| Redirect URLs include localhost for dev | ✓ |
| No `_headers` file | LOW — missing security headers (X-Frame-Options, CSP) |

---

## Layer 5: Database Indexes

**Current indexes:**
- `idx_bookings_vehicle_id` ✓
- `idx_bookings_user_id` ✓  
- `idx_bookings_status` ✓
- `idx_bookings_start_at` ✓
- `idx_bookings_pickup_deadline` (partial: where pending/approved) ✓ — excellent for cron
- GiST index implicit from exclusion constraint `booking_no_overlap` ✓ — covers conflict queries

**Missing composite indexes (MEDIUM):**
```sql
-- Staff dashboard: "show me all pending bookings for vehicle X"
CREATE INDEX idx_bookings_vehicle_status ON public.bookings(vehicle_id, status);

-- Member dashboard: "my active bookings"
CREATE INDEX idx_bookings_user_status ON public.bookings(user_id, status);

-- Admin view: "all pending bookings ordered by start date"
CREATE INDEX idx_bookings_status_start ON public.bookings(status, start_at);
```

---

## Prioritized Fix List

| Priority | Issue | File |
|----------|-------|------|
| 🔴 HIGH | `CRON_SECRET` optional → open endpoint | `expire_bookings/index.ts:21` |
| 🟠 MEDIUM | Audit log FK violation → silent failure | `expire_bookings/index.ts:41` |
| 🟠 MEDIUM | Duplicate `photo_url`/`image_url` columns | `20260301000002_admin_enhancements.sql` |
| 🟠 MEDIUM | sql/ out of sync with migrations/ | `src/supabase/sql/` |
| 🟡 LOW | Missing composite indexes for dashboards | new migration needed |
| 🟡 LOW | CORS `*` on all edge functions | all edge function `corsHeaders` |
| 🟡 LOW | No `_headers` for security headers on CF Pages | `public/_headers` (create) |
| 🟢 OK | `_redirects` exists | ✓ |
| 🟢 OK | Exclusion constraint for overlap prevention | ✓ |
| 🟢 OK | RLS enabled on all 4 tables | ✓ |
| 🟢 OK | soft delete consistent | ✓ |

---

## Strengths Worth Noting
- Exclusion constraint + btree_gist = atomic race-condition-safe booking — production-grade pattern
- Partial index on pickup_deadline for cron query — efficient
- JWT verify → service role pattern in all edge functions — correct security model
- Manual Vite chunks for CDN cache optimization — smart
- `get_my_role()` as `security definer stable` — correct for RLS performance
