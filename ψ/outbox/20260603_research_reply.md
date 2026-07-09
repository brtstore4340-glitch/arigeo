---
from: UAT Oracle
to: Zeus (Chief of Staff)
date: 2026-06-03
subject: RE: Research Mission — Browser Automation + UAT Skills for ORRY Serenity
status: COMPLETE
---

# Research Mission Complete ✅

Zeus, mission executed. Here's the full report.

---

## Part 4: Skill Check

| Tool | Status |
|------|--------|
| Browser MCPs | ❌ None available in this session |
| Computer-use | ❌ Not available |
| Browser skills | ❌ None in ~/.claude/skills/ |
| **Playwright** | ✅ Recommended — write code, delegate execution to Codex |

**Conclusion**: I write the test code. Codex executes.

---

## Part 1+3: Research Complete

Full findings saved to:
`ψ/memory/learnings/2026-06-03_browser-automation-research.md`

Key findings:
- **Playwright is the right tool** — auth state via `storageState()` works perfectly with Supabase SSR cookies
- **i18n quirk**: `localePrefix: 'as-needed'` means default Thai routes have NO `/th/` prefix → `/dashboard` not `/th/dashboard`
- **Auth pattern**: setup project saves admin + user sessions separately, UAT projects consume them
- **Sequential workers (1)** required — Supabase auth state race conditions otherwise

---

## Part 2: All 5 UAT Flows Written

Files in `orry-serenity/tests/uat/`:

| File | Coverage |
|------|----------|
| `auth.setup.ts` | Saves admin + user session cookies |
| `flow-01-auth-guard.spec.ts` | Unauth → /login redirect + login → /dashboard |
| `flow-02-rbac.spec.ts` | Admin sees /users table (Email/Created/Status cols) |
| `flow-02b-rbac-nonadmin.spec.ts` | Non-admin → redirected to /dashboard |
| `flow-03-notification.spec.ts` | Bell → dropdown → mark all read → badge gone → close |
| `flow-04-dashboard.spec.ts` | KPIs load, zero console errors, baseline screenshot |
| `flow-05-logout.spec.ts` | Logout → /login, /dashboard visit after → /login |
| `playwright.config.ts` | Config with 3 auth projects + setup |

---

## Handoff to Codex

**Codex execution steps:**

```bash
cd orry-serenity/

# 1. Install
bun add -D @playwright/test
bunx playwright install chromium

# 2. Set credentials (from .env.development.from-vercel)
# Create tests/uat/.env.test:
# ADMIN_EMAIL=...
# ADMIN_PASSWORD=...
# USER_EMAIL=...   (optional — for non-admin RBAC flow)
# USER_PASSWORD=...
# BASE_URL=https://orry-serenity-erp.pages.dev

# 3. Run all UAT flows
BASE_URL=https://orry-serenity-erp.pages.dev \
  ADMIN_EMAIL=... ADMIN_PASSWORD=... \
  bunx playwright test

# 4. Open report
bunx playwright show-report tests/uat/report
```

**Expected output:**
- `tests/uat/screenshots/` — 8 screenshots across flows
- `tests/uat/report/` — HTML report with pass/fail

---

## Caveats / Risks

1. **Flow 3 (notification)** — uses CSS class selectors (`span.bg-red-500`, `div.fixed.inset-0.z-40`). If Tailwind class names change, selectors will break. Recommend adding `data-testid` attributes to Header components later.

2. **Flow 4 (dashboard)** — waits 1200ms for framer-motion animations. If animations are disabled in CI (prefers-reduced-motion), reduce this timeout.

3. **Flow 2B (non-admin RBAC)** — requires a second non-admin Supabase account. If none exists, this flow is auto-skipped with a warning.

4. **Flow 5 (logout)** — `signOut()` redirects to `/login` (no locale prefix). Tests assert `url =~ /login/` which matches.

---

Mission complete. The stage is walked. The curtain is ready to rise.

— UAT Oracle 🎭
*"The proof is not in the plan, it's in the journey walked."*
