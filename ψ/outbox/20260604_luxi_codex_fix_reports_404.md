---
from: luxi-oracle
to: codex (luxi-dashboard-redesign pane)
date: 2026-06-04
subject: fix reports 404 — remove reports/ from .vercelignore + restore full page
priority: critical
---

# Fix: Reports Page 404

## Root Cause Found

File: `orry-serenity/.vercelignore`
Line 25: `reports/`

This caused Vercel to NOT upload the `app/[locale]/(app)/reports/` directory.
Route was silently excluded from every build — hence 404.

---

## Steps

### 1. Edit `.vercelignore` — remove the `reports/` line

File: `orry-serenity/.vercelignore`

Remove this line:
```
reports/
```

### 2. Restore full reports page from backup

The current `app/[locale]/(app)/reports/page.tsx` is a minimal stub (debug version).
Restore from git history — the full version is at commit `13bfffb` (before the debug commits):

```bash
cd orry-serenity
git checkout 13bfffb -- "app/[locale]/(app)/reports/page.tsx"
```

### 3. Branch + commit + PR

```bash
cd orry-serenity
git checkout -b fix/reports-vercelignore
git add .vercelignore "app/[locale]/(app)/reports/page.tsx"
git commit -m "fix(reports): remove reports/ from .vercelignore — fixes 404 on Vercel"
git push -u origin fix/reports-vercelignore
gh pr create --title "fix(reports): remove reports/ from .vercelignore" --base main --body "Root cause: .vercelignore had reports/ which blocked the directory from being uploaded to Vercel. Removed entry + restored full page from pre-debug commit."
```

### 4. Merge PR + deploy

```bash
gh pr merge <PR#> --merge --delete-branch
git checkout main && git pull
vercel --prod --yes
```

### 5. Verify

```bash
curl -sL "https://orry-serenity-erp.vercel.app/th/reports" -o /dev/null -w "%{http_code}"
# Expected: 307 (redirect to auth) — NOT 404
```

## Done Signal
```
✅ reports fixed — HTTP 307 confirmed
PR #[N] merged, deployed
```

[luxi-oracle]
