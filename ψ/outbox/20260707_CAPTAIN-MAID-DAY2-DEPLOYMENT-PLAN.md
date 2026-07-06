---
date: 2026-07-07
status: IN_PROGRESS
owner: Khun-Ram (Deployment Lead) + Luxi (Design Validation)
---

# Captain Maid Thai Translation — Day 2 Deployment Plan

**Date**: 2026-07-07 (Day 2 of 3)  
**Status**: ✅ Design approved, ready for activation  
**Goal**: Deploy Thai locale + complete E2E testing

---

## Day 2 Milestones

### Milestone 1: Thai Locale Activation (Morning)
- [ ] Verify i18n configuration in `captain-maid/i18n.config.ts`
- [ ] Enable Thai language switcher (if not already active)
- [ ] Test locale switching: English → Thai → English
- [ ] Verify all 80 locale strings load correctly in Thai

**Success Criteria**:
- ✅ Thai URL works (e.g., `/th` or language selector shows Thai)
- ✅ All navigation items display in Thai
- ✅ No console errors or locale loading failures
- ✅ Switching languages works seamlessly

### Milestone 2: Content Rendering E2E (Midday)
- [ ] Hero section: Title + subtitle + CTAs display in Thai
- [ ] Features section: All 3 features with Thai text + icons
- [ ] Products section: Product cards with Thai descriptions
- [ ] FAQ section: Q&A pairs in Thai
- [ ] Footer: Links + copyright in Thai

**Success Criteria**:
- ✅ No text overflow on any component
- ✅ Typography consistent (Noto Sans Thai)
- ✅ Layout intact (no broken grid/flex)
- ✅ Images/icons align properly with Thai text

### Milestone 3: Cross-Browser Testing (Afternoon)
- [ ] Chrome (Windows/Mac/Linux)
- [ ] Safari (macOS/iOS)
- [ ] Firefox (Windows/Mac)
- [ ] Edge (Windows)

**Success Criteria**:
- ✅ Thai renders correctly in all browsers
- ✅ No font loading issues
- ✅ Text baseline alignment consistent
- ✅ No rendering artifacts

### Milestone 4: Mobile Responsiveness (Late Afternoon)
- [ ] iPhone 12/13/14 (Safari)
- [ ] Android (Chrome)
- [ ] Tablet (iPad, Android tablet)
- [ ] Verify all breakpoints (320px, 768px, 1024px+)

**Success Criteria**:
- ✅ Thai text doesn't break lines unexpectedly
- ✅ Buttons + CTAs remain clickable with Thai text
- ✅ Navigation collapses properly on mobile
- ✅ Footer is readable on small screens

### Milestone 5: Interaction Testing (Evening)
- [ ] Click CTA buttons → verify action works
- [ ] Test form inputs (if applicable)
- [ ] Test dropdown menus (if applicable)
- [ ] Verify links navigate correctly

**Success Criteria**:
- ✅ All interactive elements work in Thai context
- ✅ No JavaScript errors when switching languages
- ✅ State management works (cart, preferences, etc. if applicable)

---

## Testing Checklist

### Rendering Quality
- [ ] No mojibake (character corruption)
- [ ] No missing characters or glyphs
- [ ] Diacritics display correctly (tone marks, vowels)
- [ ] No font-weight issues (bold appears where intended)

### Accessibility
- [ ] Text contrast meets WCAG AAA (already approved by Luxi ✅)
- [ ] Keyboard navigation works in Thai
- [ ] Screen reader reads Thai correctly (if applicable)
- [ ] Focus indicators visible

### Performance
- [ ] Thai locale loads quickly (< 1s)
- [ ] No layout shift when switching languages
- [ ] Images load correctly with Thai text
- [ ] No performance degradation vs English

### Brand Consistency
- [ ] All brand colors match design system
- [ ] Typography hierarchy maintained (H1, H2, body, etc.)
- [ ] Spacing/padding consistent with English version
- [ ] Component styles match across all 8 sections

---

## Deployment Steps

1. **Verify i18n Config**
   ```
   File: captain-maid/i18n.config.ts
   - Check Thai locale is registered
   - Verify locale routing works
   ```

2. **Test on Vercel Preview**
   ```
   - Deploy branch to Vercel preview
   - Access preview URL with ?locale=th or /th path
   - Verify Thai content loads
   ```

3. **Document Findings**
   ```
   - Screenshot all 8 sections in Thai
   - Note any issues or anomalies
   - Confirm approval from Luxi
   ```

4. **Prepare for Production**
   ```
   - If all tests pass: Ready for go-live
   - If issues found: Document + fix + retest
   ```

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Thai doesn't display | Verify Noto Sans Thai font loads correctly |
| Text overflow | Check component max-widths accommodate Thai |
| Mobile layout breaks | Test all breakpoints with Thai text |
| Font rendering artifacts | Clear browser cache, test in incognito |
| Locale not switching | Verify i18n config and routing setup |

---

## Deliverables (EOD July 7)

1. ✅ **Deployment Status Report**
   - Activation successful/failed
   - Test results for all milestones
   - Any issues found + fixes applied

2. ✅ **E2E Test Report**
   - Browser compatibility matrix
   - Mobile responsiveness findings
   - Performance metrics (if applicable)

3. ✅ **Go/No-Go Decision**
   - Ready for production deployment?
   - Any blockers or concerns?

4. ✅ **Production Brief**
   - Steps to activate Thai on live Vercel
   - Rollback plan (if needed)

---

## Timeline (Day 2)

| Time | Activity | Owner |
|------|----------|-------|
| **09:00** | Locale activation | Khun-Ram |
| **10:30** | Content rendering test | Luxi + Khun-Ram |
| **12:00** | Cross-browser testing | Khun-Ram |
| **14:00** | Mobile testing | Khun-Ram |
| **16:00** | Interaction testing | Luxi + Khun-Ram |
| **17:00** | Results compilation | Khun-Ram |
| **18:00** | Final report + go-live decision | Luxi + Khun-Ram |

---

## Success Criteria (Go/No-Go)

**GO** (Deploy to production):
- ✅ All 5 milestones complete
- ✅ No critical issues found
- ✅ Both Khun-Ram + Luxi approve
- ✅ Ready for Day 3 (go-live)

**NO-GO** (Hold for fixes):
- ⚠️ Critical issues found (overflow, rendering, etc.)
- ⚠️ Design approval revoked
- ⚠️ Performance concerns
- 🔄 Schedule retest after fixes

---

## Preparation Checklist

- [ ] Vercel account access confirmed
- [ ] Deployment credentials ready
- [ ] Testing browsers installed/available
- [ ] Mobile device(s) ready for testing
- [ ] Screenshots/documentation tools ready
- [ ] Communication channel open (Khun-Ram + Luxi)

---

**Status**: Ready to execute Day 2  
**Owner**: Khun-Ram (Deployment) + Luxi (Design Validation)  
**Next Report**: EOD July 7

---

**ขอบคุณครับ** 🙏
