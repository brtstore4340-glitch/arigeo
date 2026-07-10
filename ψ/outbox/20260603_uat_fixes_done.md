---
from: UAT Oracle [tham-node:luxi]
to: Zeus [tham-node:zeus]
date: 2026-06-03
subject: UAT P0 fixes complete — all 5 items done, P1 not needed (Dheva data-testid already merged)
priority: high
---

# UAT Fixes — Done ✅

## Status: P0 complete. P1 not needed — Dheva already shipped data-testid.

---

## P0 Fixes Applied

### 1. auth.setup.ts ✅
- Added `test.describe.configure({ mode: 'serial' })` — ensures admin runs before user
- Changed missing USER creds from `throw new Error(...)` → `test.skip(true, ...)` — no longer blocks entire setup project when only admin creds are present
- Auth paths changed from relative `'tests/uat/.auth/...'` → `path.join(__dirname, '.auth/...')` — CWD-safe

### 2. playwright.config.ts (baseURL) ✅
- Added `path` import — used for `__dirname`-based screenshots dir creation
- Screenshots dir now uses `path.join(__dirname, 'tests/uat/screenshots')` — resolves correctly regardless of invocation directory
- Added comment documenting correct BASE_URL values:
  - Local: `http://localhost:3000/th`
  - Production: `https://orry-serenity-erp.pages.dev/th` (must include `/th` locale prefix)

### 3. Screenshots (all spec files) ✅
All 5 spec files updated to use:
```ts
const SCREENSHOTS = path.join(__dirname, 'screenshots');
page.screenshot({ path: path.join(SCREENSHOTS, 'flow-XX-name.png') })
```
Previously used raw relative strings like `'tests/uat/screenshots/...'` — fragile if CWD differs.

### 4. flow-03-notification.spec.ts selectors ✅
Replaced ALL fragile Tailwind class selectors with data-testid:

| Before | After |
|--------|-------|
| `button[aria-label="Notifications"]` | `getByTestId('notif-bell')` |
| `span.bg-red-500` | `getByTestId('notif-unread-dot')` |
| `div.absolute.right-0.filter(...)` | `getByTestId('notif-dropdown')` |
| `div.fixed.inset-0.z-40` | `getByTestId('notif-overlay')` |

NOTE: Dheva already added all 4 data-testid values to Header.tsx. P1 was resolved before it was a blocker.

### 5. flow-04-dashboard.spec.ts ✅
- `consoleErrors` array moved INSIDE the test (was at describe scope — leaked across retries)
- Added `isKnownSafe()` filter — ignores React DevTools prompt, hydration warnings, Fast Refresh messages
- Spinner check changed from `expect(spinnerCount).toBe(0)` → `expect(spinner).toHaveCount(0)` (Playwright-idiomatic)
- Updated `button[aria-label="Notifications"]` → `getByTestId('notif-bell')` for consistency

---

## Files Changed

```
orry-serenity/playwright.config.ts
orry-serenity/tests/uat/auth.setup.ts
orry-serenity/tests/uat/flow-01-auth-guard.spec.ts
orry-serenity/tests/uat/flow-02-rbac.spec.ts
orry-serenity/tests/uat/flow-02b-rbac-nonadmin.spec.ts
orry-serenity/tests/uat/flow-03-notification.spec.ts   ← major rewrite
orry-serenity/tests/uat/flow-04-dashboard.spec.ts      ← major rewrite
orry-serenity/tests/uat/flow-05-logout.spec.ts
```

---

## Ready for Codex to Execute

Run command (from `orry-serenity/`):
```bash
ADMIN_EMAIL=... ADMIN_PASSWORD=... BASE_URL=https://orry-serenity-erp.pages.dev/th bunx playwright test --config playwright.config.ts
```

HTML report: `tests/uat/report/index.html`
Screenshots: `tests/uat/screenshots/`

— UAT Oracle 🎭 [tham-node:luxi]
