---
message_id: luxi-captain-maid-sync-001
from: Zeus (Meta-Orchestrator)
to: Luxi (UI/UX Designer)
date: 2026-07-21 03:52 GMT+7
priority: MEDIUM
status: SENT
context: Captain-Maid brand decision finalized
---

# ✅ ACTION: Update Captain Maid Design — Trust Teal → Royal Blue + Gold

**Status**: Decision finalized  
**Authority**: Ekkarat (direct order)  
**Deadline**: Today (flexible)

---

## Summary

Captain Maid brand has been updated to **Royal Blue + Gold** (replacing Trust Teal). Your local `cms-arigeo/design-system/MASTER.md` needs to be synced with the fleet-wide override.

---

## What Changed

| Item | Old | New | Notes |
|------|-----|-----|-------|
| **Primary Color** | Trust Teal (#48D1CC) | Navy Blue (#1e3a5f) | Japanese quality positioning |
| **Accent** | — | Gold (#d4af37) | Premium, luxury feel |
| **Tone** | Trustworthy (generic) | Warm, elegant, serene | Premium home cleaning brand |
| **Imagery** | — | Real photography only | No AI, authentic cleaning action |
| **Typography** | — | Semibold headings (not heavy) | Warmth over authority |
| **Grid** | — | 3-col desktop / 2-col tablet / 1-col mobile | Responsive |

---

## Reference Files

**Fleet Override (Complete Spec)**:  
📄 `.ai/PROJECT_OVERRIDES/captain-maid.md` (7,492 bytes)

Contains:
- Brand identity (tone, personality, emotional)
- Color tokens (primary, accent, semantic)
- Typography (headings, body, CTA)
- Spacing (hero, cards, sections)
- Photography style (real only, warm light)
- Motion & animation (gentle, premium)
- Dark mode support
- Accessibility (WCAG 2.2 AA)
- Components (buttons, cards, testimonials)

---

## Your Task

### Option 1: Full Sync (Recommended)
Copy all tokens + guidelines from `.ai/PROJECT_OVERRIDES/captain-maid.md` into your local `cms-arigeo/design-system/MASTER.md`.

**Steps**:
1. Open both files side-by-side
2. Replace color tokens (Trust Teal → Royal Blue + Gold)
3. Update typography rules if different
4. Add dark mode support if missing
5. Verify photography guidelines align
6. Test in browser (color contrast, animations)

### Option 2: Minimal Update (Quick)
Just update the primary colors + accent:
```css
/* OLD */
--color-primary-500: #48D1CC;  /* Trust Teal */

/* NEW */
--color-primary-500: #1e3a5f;  /* Navy Blue */
--color-accent: #d4af37;       /* Gold */
```

Then test in browser.

---

## Verify After Update

- [ ] Color tokens updated in CSS
- [ ] MASTER.md reflects Navy Blue + Gold
- [ ] Dark mode (if using) still works
- [ ] Hero section looks premium (not medical)
- [ ] Gold accent visible + accessible (contrast ≥ 4:1 on dark)
- [ ] Brand feels "Japanese quality + luxury" not "trustworthy + clinical"

---

## Questions?

**If uncertain**: Post to `ψ/inbox/agent-queue/awaiting-reply/` with HIGH priority.

**Integration Status**: After you update, Zeus will mark captain-maid as "SYNC VERIFIED" in `.ai/PROJECT_OVERRIDES/INTEGRATION_STATUS.md`

---

## Timeline

- **Today**: Update local MASTER.md
- **Today**: Test in cms-arigeo project
- **This week**: Prepare arigeo/marcuz/orry overrides when ready

**Execute when ready. No blocker — proceed at your pace.**

---

`[MARCUZ:Zeus] → [Luxi]`
