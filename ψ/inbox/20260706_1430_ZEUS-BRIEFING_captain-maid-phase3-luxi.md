---
from: ធាម-Zeus (Meta-Orchestrator)
to: Luxi Oracle
date: 2026-07-06
time: 14:30 UTC+7
subject: 🎨 BRIEFING: Captain Maid Thai Phase 3 — Design Co-Lead Role
priority: high
type: project-briefing
project_id: captain-maid-phase3-thai
---

# PROJECT BRIEFING: Captain Maid Thai Phase 3 — Design Lead

Luxi,

You and Khun-Ram are approved to lead the Captain Maid Thai MVP sprint. Your role is to ensure all Thai translations integrate seamlessly with the design system without visual regressions.

---

## THE MISSION

**Project**: Captain Maid — Thai Language Market Expansion  
**Co-Lead**: Khun-Ram Oracle (Translation + Content Lead)  
**Your Role**: UI/UX Design Lead + Sign-Off Authority  
**Timeline**: 3 days (Jul 6–9, EOD)  
**Success Criteria**: Design approved + Thai layout verified on all devices

---

## YOUR RESPONSIBILITIES

### 1. Translation Design Review (Daily)

As Khun-Ram translates components, you review for:

| Check | Standard | Impact |
|-------|----------|--------|
| **Text overflow** | No Thai text extends beyond button/card | 🔴 BLOCKER |
| **Line height** | Thai text reads clearly (line-height sufficient) | 🟡 Important |
| **Button fit** | CTA buttons accommodate Thai text | 🔴 BLOCKER |
| **Mobile layout** | All text readable on 320px screens | 🔴 BLOCKER |
| **Visual hierarchy** | Translation maintains design intent | 🟡 Important |
| **Brand voice** | Thai tone matches brand personality | 🟡 Important |

### 2. Component-by-Component Sign-Off

For each component Khun-Ram delivers:

**You check**:
```
Navigation:
  ☐ Menu items fit without wrapping (desktop)
  ☐ Mobile menu collapse works
  ☐ Brand name/logo position maintained
  ☐ CTA buttons readable
  → APPROVE / REQUEST CHANGES

Hero Section:
  ☐ Headline readable (font size adequate)
  ☐ Subheadline fits (2-3 lines max)
  ☐ CTA button accommodates text
  ☐ Background imagery unobstructed
  → APPROVE / REQUEST CHANGES

Product Cards:
  ☐ Product name fits one line
  ☐ Price display clear
  ☐ "More Detail" button readable
  ☐ 3-column grid maintained on desktop
  ☐ 1-column stack on mobile
  → APPROVE / REQUEST CHANGES

[... similar for FAQ, Footer, Metadata]
```

### 3. Responsive Testing (Jul 8–9)

**On Jul 8**, test all components across devices:

| Device | Breakpoint | Your Check |
|--------|------------|-----------|
| Mobile | 320px | ✅ All text readable, no horizontal scroll |
| Tablet | 768px | ✅ Grid layout correct, spacing proportional |
| Desktop | 1024px+ | ✅ Full layout displays as intended |
| Desktop XL | 1280px+ | ✅ No weird spacing or alignment |

**Verification checklist**:
- [ ] Visit site on personal phone (Thai text loads)
- [ ] Test in browser dev tools (inspect all devices)
- [ ] Check images load (no missing SVG/PNG)
- [ ] Verify color contrast (WCAG AA minimum)
- [ ] Test form inputs if present

---

## COMMUNICATION SLA

**Critical Response Time**: 5 minutes (for blockers)

When Khun-Ram sends:
- ✅ "Button text too long?" → You respond within 5 min
- ✅ "Design looks OK?" → You respond within 5 min
- ✅ "Mobile layout approved?" → You respond within 5 min

**Non-critical feedback**: Within 1 hour

---

## DELIVERABLES BY DATE

### Today: Jul 6 (by 18:00 UTC+7)
- [ ] Acknowledge briefing + confirm 5-min SLA
- [ ] Coordinate with Khun-Ram on first component
- [ ] Review first translation batch (navigation/hero)
- [ ] Provide design feedback (same day)

### Jul 7 (by 09:00 UTC+7)
- [ ] Review ~60% of translated components
- [ ] Approve/request changes on each
- [ ] Test responsive layouts on tablet
- [ ] Summarize feedback for Khun-Ram

### Jul 8 (by 09:00 UTC+7)
- [ ] Review remaining 35% of components
- [ ] Full mobile device testing
- [ ] Color/contrast verification
- [ ] Final design polish suggestions

### Jul 9 (by 18:00 UTC+7) — **FINAL APPROVAL**

**SUBMIT**:
- [ ] Written approval email/message: "Design approved ✅"
- [ ] Sign-off includes: "Thai layout verified on mobile/tablet/desktop"
- [ ] Any final refinements documented

**If any blockers**: Escalate to Zeus immediately (no delays past 18:00)

---

## WHAT COUNTS AS "APPROVED"

You can approve a component when:

✅ **No text overflow** on any device  
✅ **Readability maintained** (font size, contrast, line height)  
✅ **Visual hierarchy intact** (matches original design intent)  
✅ **Responsive at all breakpoints** (320px, 768px, 1024px+)  
✅ **Brand voice preserved** (tone, style, professionalism)  

You should **REQUEST CHANGES** if:

🔴 Text overflows buttons or cards  
🔴 Mobile layout breaks (horizontal scroll appears)  
🔴 Thai text too small to read comfortably  
🔴 Visual hierarchy lost (headline looks like body text)  
🔴 CTA buttons don't stand out  

---

## TOOLS & ACCESS

### Design Resources
- **Live Site**: https://captain-maid.vercel.app/th (if deployed)
- **Local Dev**: `npm run dev` in captain-maid/ directory
- **Figma**: (if design file exists — coordinate with Khun-Ram)
- **Browser DevTools**: Test responsive at all breakpoints

### Quick Testing
```bash
cd captain-maid
npm run dev          # Start dev server
# Open http://localhost:3000/th in browser
# Test with browser DevTools (F12) → Device Emulation
```

---

## COLLABORATION WITH KHUN-RAM

### Communication Channels
1. **Quick feedback**: Discord/Slack (5-min SLA)
2. **Detailed review**: Send screenshots + markup in message
3. **Component handoff**: Khun-Ram sends "Ready for review" → you test + approve same day

### If Translation Doesn't Fit
**Example blocker**:
- Khun-Ram: "Button text: 'ดูรายละเอียดเพิ่มเติม' (too long?)"
- You: "Yes, overflows on mobile. Suggest: 'ดูรายละเอียด' or 'เพิ่มเติม'. Test either?"
- Khun-Ram: "Testing alternate now..."
- You: Review + approve within 5 min

---

## ESCALATION

### If Khun-Ram Goes Silent
- **No response for 30 minutes**: Notify Tham
- **No response for 1 hour**: Escalate to Zeus
- **Critical blocker unresolved**: Zeus intervenes

### If You Find Major Design Issues
- **Text too small**: Escalate to Zeus (scope change)
- **Layout broken**: Escalate to Zeus (engineering)
- **Brand inconsistency**: Discuss with Zeus + Khun-Ram

---

## SUCCESS LOOKS LIKE

By Jul 9 18:00:
- ✅ All 6 components translated + designed
- ✅ Thai text fits perfectly on all devices
- ✅ No visual regressions
- ✅ Mobile responsive confirmed
- ✅ You've signed off: "Design approved ✅"
- ✅ Code merged to main and ready for production

---

## YOUR COMMITMENT

```
I, Luxi, commit to:
[ ] Respond to Khun-Ram within 5 minutes (blockers)
[ ] Review components daily (no delays)
[ ] Test responsive layouts (3 device sizes)
[ ] Provide clear design feedback (not just "looks good")
[ ] Submit final written approval by Jul 9 18:00
```

---

## BONUS: Design System Reference

**Current Design System**:
- **Colors**: Navy (#1a3a4d) + Teal (#17a2b8)
- **Typography**: Professional sans-serif (Tailwind defaults)
- **Spacing**: 8px grid (4px, 8px, 16px, 24px, 32px)
- **Responsive**: Mobile-first (320px → 1280px+)
- **Accessibility**: WCAG AAA (aim for)

**Thai-Specific Considerations**:
- Thai font typically wider than English (allow 20% more width)
- Thai diacritics need proper line-height
- Numbers should use Thai numerals (๐, ๑, ๒, ...) if brand-appropriate
- Mobile is critical market in Thailand (ensure mobile-first is tight)

---

## WEEKLY SYNC

**When**: Thursday, Jul 10 (time TBD)  
**Who**: Tham + Khun-Ram + Luxi + Zeus  
**Topic**: Phase 3 retrospective + Phase 2 kickoff planning

---

**You've got this. Clear, fast decisions. ดีได้นะ!**

---

**ធាម-Zeus Oracle**  
Meta-Orchestrator

**CC**: Tham (oversight), Khun-Ram (co-lead), agis-oracle (monitoring)
