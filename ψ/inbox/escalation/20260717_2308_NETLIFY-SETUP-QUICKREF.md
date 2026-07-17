---
title: Netlify Setup Quick Reference
for: Tham (Governor)
date: 2026-07-17 23:08 GMT+7
urgency: IMMEDIATE
---

# ⚡ NETLIFY SETUP — 5-Minute Quick Reference

**Time limit**: 5 minutes to complete  
**Expected result**: cms-arigeo building on Netlify  
**Success**: Build completes in 3-5 min after setup

---

## STEP 1: Create Netlify Site (2 min)

```
1. Go to → https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Select repo: E0993599799/cms-arigeo
4. Branch: main
5. Click "Deploy site"

Result: Get Netlify site URL
Example: https://cms-arigeo-xyz.netlify.app
```

---

## STEP 2: Generate Netlify Token (2 min)

```
1. Go to → https://app.netlify.com/user/applications/personal-access-tokens
2. Click "New access token"
3. Name: "GitHub Actions Deploy"
4. Copy token (save securely)

Token format: long string starting with eyJ...
```

---

## STEP 3: Get Site ID (1 min)

```
1. Netlify dashboard → Your site → Settings → General
2. Find "Site details" section
3. Copy "Site ID"

Site ID format: abc1234def-xyz123...
```

---

## STEP 4: Add GitHub Secrets (2 min)

```
1. Go to → https://github.com/E0993599799/cms-arigeo/settings/secrets/actions
2. Click "New repository secret"
   Name: NETLIFY_AUTH_TOKEN
   Value: [paste token from STEP 2]
   Click "Add secret"

3. Click "New repository secret"
   Name: NETLIFY_SITE_ID
   Value: [paste site ID from STEP 3]
   Click "Add secret"
```

---

## STEP 5: Trigger Build (Automatic)

```
Push to main (auto-triggers):

  git commit --allow-empty -m "trigger: activate Netlify fallback"
  git push origin main

Or wait — next push to main auto-triggers.
```

---

## MONITOR BUILD

```
GitHub Actions:
  https://github.com/E0993599799/cms-arigeo/actions
  → Look for "Deploy to Netlify" job
  → Should see: ✅ Install → ✅ Build → ✅ Deploy

Netlify:
  https://app.netlify.com → Your site → Deploys
  → Should see deployment in progress
  → When complete: "Published" status ✅
```

---

## EXPECTED TIMELINE

```
23:08  → Setup begins
23:13  → Setup complete (5 min)
23:13  → GitHub Actions triggers
23:18  → Build complete (3-5 min)
23:20  → Deploy to Netlify (2 min)
23:23  → cms-arigeo LIVE ✅
```

---

## WHAT HAPPENS AFTER

Once Netlify deployment succeeds:

1. ✅ cms-arigeo accessible at Netlify URL
2. ✅ captain-maid can fetch CMS content
3. ✅ Luxi deployment can proceed
4. ✅ Fleet recovery timeline ON TRACK

---

## IF SETUP FAILS

| Error | Fix |
|-------|-----|
| "Invalid Netlify token" | Regenerate token from Netlify dashboard |
| "Site ID not found" | Copy exact Site ID (no spaces, exact format) |
| "Build fails" | Check GitHub Actions logs for build error |
| "Deploy fails" | Check Netlify deploy logs (usually env variables) |

---

## CRITICAL URLS

Save these:

- **Netlify dashboard**: https://app.netlify.com
- **GitHub secrets**: https://github.com/E0993599799/cms-arigeo/settings/secrets/actions
- **GitHub Actions**: https://github.com/E0993599799/cms-arigeo/actions
- **Netlify tokens**: https://app.netlify.com/user/applications/personal-access-tokens

---

## CHECKLIST

- [ ] Netlify site created (have URL)
- [ ] Auth token generated (saved)
- [ ] Site ID copied (saved)
- [ ] GitHub secrets added (both)
- [ ] Push to main triggered
- [ ] GitHub Actions running (check Actions tab)
- [ ] Build complete (3-5 min)
- [ ] cms-arigeo LIVE on Netlify ✅

---

**Once complete**: Reply with the Netlify deployment URL, and we proceed to Luxi decision.

`[MARCUZ:Teleos]`
