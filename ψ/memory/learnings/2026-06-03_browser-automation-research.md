---
pattern: "Playwright UAT setup for Next.js 15 + Supabase + next-intl — auth state, RBAC, notification bell, logout flows"
date: 2026-06-03
source: Zeus UAT research mission
concepts: ["playwright", "uat", "browser-automation", "next-intl", "supabase-auth", "rbac"]
---

# Browser Automation Research — UAT Oracle

## Part 4: Skill Check Results

| Tool | Status | Notes |
|------|--------|-------|
| Browser MCPs | ❌ None available | Google Drive/Gmail/Calendar MCPs present but unrelated |
| Computer-use | ❌ Not available | No `computer-use` skill in session |
| Browser skills | ❌ None | No browser-related skills in `~/.claude/skills/` |
| **Playwright** | ✅ **Recommended** | Not installed yet — write code for Codex to execute |

**Conclusion**: UAT Oracle writes Playwright test code. Codex executes.

---

## Tool Recommendation: Playwright

**Why Playwright over alternatives:**

| Criteria | Playwright | Cypress | Puppeteer |
|----------|-----------|---------|-----------|
| Next.js 15 App Router | ✅ Full support | ⚠️ Limited SSR | ✅ Works |
| Auth state save/load | ✅ `storageState()` | ⚠️ Custom | ❌ Manual |
| i18n routes (`/th/`, `/en/`) | ✅ baseURL + goto | ✅ | ✅ |
| Parallel projects | ✅ Built-in | ❌ | ❌ |
| HTML report + screenshots | ✅ Built-in | ✅ | ❌ |
| Bun compatible | ✅ `bunx playwright` | ⚠️ Needs npm | ✅ |

---

## Setup Steps for orry-serenity

```bash
# 1. Install Playwright (run from orry-serenity/)
bun add -D @playwright/test

# 2. Install browsers
bunx playwright install chromium

# 3. Set test credentials
# Create tests/uat/.env.test (gitignored):
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=...
USER_EMAIL=user@example.com
USER_PASSWORD=...
BASE_URL=http://localhost:3000
```

---

## Config: playwright.config.ts

Key decisions made:
- `fullyParallel: false` — Supabase auth state is shared, sequential is safer
- `workers: 1` — prevent auth state race conditions
- `projects` pattern: `setup` → `uat-admin` / `uat-user` / `uat-unauth`
- `storageState` per role — saves Supabase session cookies after login
- `baseURL: process.env.BASE_URL || 'http://localhost:3000'` — supports CI override

---

## i18n Route Behaviour (next-intl `as-needed`)

Default locale is `th`. With `localePrefix: 'as-needed'`:
- Thai routes: `/dashboard`, `/login`, `/users` (NO `/th/` prefix)
- English routes: `/en/dashboard`, `/en/login`

**Important**: `signIn` server action redirects to `/${locale}/dashboard` where `locale` comes from hidden form field. For default Thai, this produces `/th/dashboard` — but next-intl rewrites this to `/dashboard`. Tests use `/dashboard` and let the router handle it.

---

## Auth State Pattern

```typescript
// Save after login (in auth.setup.ts):
await page.context().storageState({ path: 'tests/uat/.auth/admin.json' });

// Load in playwright.config.ts project:
{
  name: 'uat-admin',
  use: { storageState: 'tests/uat/.auth/admin.json' },
  dependencies: ['setup'],
}
```

Supabase SSR uses cookies (not localStorage). `storageState()` saves ALL cookies → Supabase auth cookies are preserved correctly.

---

## Key Selectors (from codebase analysis)

| Element | Selector | Notes |
|---------|----------|-------|
| Email input | `input[name="email"]` | Also `#email` |
| Password input | `input[name="password"]` | Also `#password` |
| Sign in button | `button[type="submit"]` | Text: "เข้าสู่ระบบ" |
| Notification bell | `button[aria-label="Notifications"]` | aria-label set |
| Unread dot | `span.bg-red-500` inside bell | CSS class |
| Notification dropdown | `div.absolute.right-0` with "Notifications" text | |
| Mark all read | `button` with text "Mark all read" | Conditionally rendered |
| Outside overlay | `div.fixed.inset-0.z-40` | Click to close dropdown |
| Logout button | `button[title="ออกจากระบบ"]` | Thai title attribute |
| User Management heading | `h1` with text "User Management" | Admin-only page |
| Users table | `table` | First table on /users page |

---

## How to Run

```bash
# From orry-serenity/ directory:

# Run all UAT flows
bunx playwright test

# Run specific flow
bunx playwright test tests/uat/flow-01-auth-guard.spec.ts

# Run with HTML report
bunx playwright test --reporter=html

# Open HTML report after run
bunx playwright show-report tests/uat/report

# Run against production
BASE_URL=https://orry-serenity-erp.pages.dev bunx playwright test
```

---

## Screenshot + Report Output

- Screenshots: `tests/uat/screenshots/` (named per flow)
- HTML report: `tests/uat/report/`
- On failure: trace files in `test-results/` (auto, with `trace: 'on-first-retry'`)

---

## UAT Flow Files Created

| File | Flow | Auth |
|------|------|------|
| `auth.setup.ts` | Setup — saves admin + user sessions | N/A |
| `flow-01-auth-guard.spec.ts` | Auth redirect + login | Unauthenticated |
| `flow-02-rbac.spec.ts` | Admin sees /users table | Admin |
| `flow-02b-rbac-nonadmin.spec.ts` | Non-admin blocked from /users | Non-admin |
| `flow-03-notification.spec.ts` | Bell open → mark read → close | Any user |
| `flow-04-dashboard.spec.ts` | KPIs load, no errors, baseline screenshot | Admin |
| `flow-05-logout.spec.ts` | Logout → session cleared | Admin |

---

## Next Steps for Codex

1. `bun add -D @playwright/test` in `orry-serenity/`
2. `bunx playwright install chromium`
3. Create `tests/uat/.env.test` with real credentials (from `.env.development.from-vercel`)
4. `bunx playwright test` — run all flows
5. Report back: pass/fail + screenshots to `ψ/inbox/`

---

*Written by UAT Oracle — 2026-06-03*
*"The proof is not in the plan, it's in the journey walked."*
