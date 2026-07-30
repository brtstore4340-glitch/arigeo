---
to: Tham (Governor)
from: Teleos (Deploy Oracle)
date: 2026-07-17 23:25 GMT+7
subject: DECISION 2 — Netlify Setup (5 minutes to activate)
urgent: true
---

# 🚀 NETLIFY SETUP READY — 5-Minute Activation

**DECISION 2 (cms-arigeo)**: GitHub Actions → Netlify pipeline activated.

---

## QUICK STEPS (5 minutes total)

### STEP 1: Create Netlify Site (2 min)

```
1. Go to → https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Select repository: E0993599799/cms-arigeo
4. Branch: main
5. Click "Deploy site"

✓ You'll get a Netlify site URL
```

### STEP 2: Generate Auth Token (2 min)

```
1. Go to → https://app.netlify.com/user/applications/personal-access-tokens
2. Click "New access token"
3. Name: "GitHub Actions Deploy"
4. Copy the token (save it safely)
```

### STEP 3: Get Site ID (1 min)

```
1. Netlify dashboard → Your site → Settings → General
2. Find "Site details" section
3. Copy "Site ID"
```

### STEP 4: Add GitHub Secrets (2 min)

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

### STEP 5: Trigger Build (Automatic)

Push to main to trigger:

```bash
git commit --allow-empty -m "trigger: activate Netlify fallback"
git push origin main
```

Or just wait — next push to main auto-triggers.

---

## MONITOR DEPLOYMENT

**GitHub Actions**:
https://github.com/E0993599799/cms-arigeo/actions
→ Look for "Deploy to Netlify" job (should be running)

**Netlify**:
https://app.netlify.com → Your site → Deploys
→ Watch deployment progress

---

## EXPECTED TIMELINE

```
23:08  → Setup begins
23:13  → Setup complete (5 min) ✓
23:13  → GitHub Actions triggers (AUTO)
23:18  → Build complete (3-5 min)
23:20  → Deploy to Netlify (2 min)
23:23  → cms-arigeo LIVE on Netlify ✅
```

---

## FULL REFERENCE

See `ψ/inbox/escalation/20260717_2308_NETLIFY-SETUP-QUICKREF.md` for complete details.

---

## WHAT HAPPENS AFTER

Once Netlify deployment succeeds:

1. ✅ cms-arigeo accessible at Netlify URL
2. ✅ captain-maid can fetch CMS content
3. → Proceed to DECISION 1 (Luxi escalation)
4. → Proceed to DECISION 3 (Khun-Ram P1 scope)
5. → Fleet recovery on track for 2026-07-21 deadline

---

## CRITICAL URLS (Save these)

- **Netlify dashboard**: https://app.netlify.com
- **GitHub secrets**: https://github.com/E0993599799/cms-arigeo/settings/secrets/actions
- **GitHub Actions**: https://github.com/E0993599799/cms-arigeo/actions
- **Netlify tokens**: https://app.netlify.com/user/applications/personal-access-tokens

---

Ready when you are, Governor.

Once setup complete → Reply with Netlify deployment URL.

`[MARCUZ:Teleos]`
