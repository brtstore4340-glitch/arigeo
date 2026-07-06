---
date: 2026-07-07
owner: Khun-Ram (Deployment Coordination)
status: READY_FOR_DEPLOYMENT
---

# Captain Maid Thai Locale — Deployment Activation Guide

**Status**: Thai translations complete, design approved, ready for activation  
**Objective**: Enable Thai language on live Vercel deployment  
**Timeline**: Day 2 (today, July 7)

---

## Current State

### ✅ Ready
- `i18n.config.ts` configured with Thai locale ✅
- `locales/th.json` with 80 translations (QA-passed) ✅
- `locales/en.json` as baseline ✅
- Design reviewed and approved ✅

### ⏳ Needs Integration
- Components updated to use i18n locale strings
- Language switcher component (if not already present)
- Dynamic lang attribute on HTML element
- Locale routing or query parameter handling

---

## Step 1: Component Integration (if needed)

**Check**: Are components already using the locale strings?

```bash
# Search for locale usage in components
grep -r "useLocale\|useTranslation\|i18n" captain-maid/components/
grep -r "from '@/locales\|from '@/i18n.config" captain-maid/
```

### If NOT using locales yet:

**Update NavigationEnhanced component** (example):
```typescript
// Before
<nav>
  <a href="/">Home</a>
  <a href="/products">Products</a>
</nav>

// After (using i18n)
import { useLocale } from '@/hooks/useLocale';
import en from '@/locales/en.json';
import th from '@/locales/th.json';

export function NavigationEnhanced() {
  const locale = useLocale(); // Gets current locale
  const t = locale === 'th' ? th : en;
  
  return (
    <nav>
      <a href="/">{t.nav.home}</a>
      <a href="/products">{t.nav.products}</a>
    </nav>
  );
}
```

### Create locale hook (if missing):
```typescript
// hooks/useLocale.ts
import { useSearchParams } from 'next/navigation';

export function useLocale() {
  const params = useSearchParams();
  return (params.get('lang') || 'en') as 'en' | 'th';
}
```

---

## Step 2: Add Language Switcher

**Option A**: Query parameter (easiest)
```typescript
// components/LanguageSwitcher.tsx
export function LanguageSwitcher() {
  const currentLang = useSearchParams().get('lang') || 'en';
  
  return (
    <div className="language-switcher">
      <button onClick={() => window.location.href = '?lang=en'}>
        English
      </button>
      <button onClick={() => window.location.href = '?lang=th'}>
        ไทย
      </button>
    </div>
  );
}
```

**Option B**: URL path (more SEO-friendly)
```
/en/ (English)
/th/ (Thai)
```
Requires middleware setup in Next.js.

---

## Step 3: Update HTML Lang Attribute

**In app/layout.tsx**:
```typescript
import { useLocale } from '@/hooks/useLocale';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  
  return (
    <html lang={locale === 'th' ? 'th' : 'en'} suppressHydrationWarning>
      {/* ... */}
    </html>
  );
}
```

---

## Step 4: Test on Vercel Preview

1. **Deploy branch** to Vercel preview
2. **Access preview URL**: `https://[preview-url]?lang=en`
3. **Verify English loads**: All sections in English ✅
4. **Switch to Thai**: `https://[preview-url]?lang=th`
5. **Verify Thai loads**: 
   - Navigation in Thai ✅
   - Hero title: "ทำความสะอาดบ้านได้ง่ายขึ้น" ✅
   - Features: All 3 features in Thai ✅
   - Products: Thai descriptions ✅
   - FAQ: Thai Q&A ✅
   - Footer: Thai text + copyright ✅

---

## Step 5: E2E Testing Checklist

### Visual Rendering
- [ ] Thai fonts load correctly (Noto Sans Thai)
- [ ] No mojibake or character corruption
- [ ] Text width accommodates Thai (longer than English)
- [ ] No overflow on any component
- [ ] Line-height (1.6+) ensures readability

### Functionality
- [ ] Language switcher works
- [ ] Navigation links navigate correctly
- [ ] CTA buttons work
- [ ] Forms (if any) work with Thai text
- [ ] All links point to correct pages

### Browsers
- [ ] Chrome (desktop)
- [ ] Safari (desktop)
- [ ] Firefox
- [ ] Edge
- [ ] Chrome (mobile)
- [ ] Safari (iOS)

### Mobile
- [ ] iPhone 12+ (portrait + landscape)
- [ ] Android (portrait + landscape)
- [ ] Tablet (iPad, Android tablet)
- [ ] All breakpoints render correctly

### Accessibility
- [ ] Contrast ratio: ✅ WCAG AAA (already verified)
- [ ] Text resizing: ✅ No layout shift
- [ ] Focus indicators: ✅ Visible
- [ ] Screen reader: ✅ Reads Thai correctly (if applicable)

### Performance
- [ ] Thai locale loads < 1s
- [ ] No layout shift when switching languages
- [ ] Images load correctly
- [ ] No console errors

---

## Step 6: Issues Found? Fix & Retest

### Common Issues

| Issue | Solution |
|-------|----------|
| Thai doesn't display | Clear cache, verify Noto Sans Thai font loads |
| Text overflows | Check component max-widths, may need adjustments for Thai |
| Language switcher doesn't work | Verify hook properly detects locale parameter |
| Layout shifts when switching | Add fixed widths or min-heights to prevent reflow |
| Character corruption | Ensure UTF-8 encoding in files |

---

## Step 7: Go/No-Go Decision

### GO if:
- ✅ All 8 content sections render in Thai
- ✅ No text overflow on any component
- ✅ Cross-browser tests pass (all 5 browsers)
- ✅ Mobile tests pass (all 3 devices)
- ✅ No functional issues
- ✅ Luxi design approval confirmed

### NO-GO if:
- ⚠️ Text overflow issues
- ⚠️ Font rendering problems
- ⚠️ Functional bugs
- ⚠️ Accessibility issues
- ⚠️ Performance degradation

**If NO-GO**: Fix issues and retest before go-live.

---

## Step 8: Production Deployment

Once approved by both Khun-Ram + Luxi:

1. **Merge** feature branch to main
2. **Deploy** to production Vercel
3. **Verify** Thai works on live site
4. **Announce** Thai language availability

---

## Rollback Plan

If critical issues discovered post-deploy:

1. **Revert** merge commit (go back to English-only)
2. **Document** issue + root cause
3. **Fix** in new branch
4. **Retest** before re-deploying

---

## Files Reference

| File | Purpose |
|------|---------|
| `i18n.config.ts` | i18n configuration (Thai registered) |
| `locales/en.json` | English strings (80 entries) |
| `locales/th.json` | Thai strings (80 entries, QA-passed) |
| `hooks/useLocale.ts` | Locale detection hook (create if needed) |
| `components/LanguageSwitcher.tsx` | Language switcher (create if needed) |

---

## Verification Checklist

Before marking as "complete":

- [ ] Thai locale activated on Vercel preview
- [ ] All 8 sections render in Thai
- [ ] Cross-browser tests pass
- [ ] Mobile tests pass
- [ ] Accessibility maintained
- [ ] Performance acceptable
- [ ] Luxi design validation complete
- [ ] Go/No-go decision documented
- [ ] Ready for production deployment

---

## Timeline

| Time | Activity |
|------|----------|
| **09:00** | Verify i18n setup + component integration |
| **10:00** | Deploy to Vercel preview |
| **11:00** | Visual rendering tests |
| **12:00** | Cross-browser testing |
| **13:00** | Mobile testing |
| **14:00** | Issue identification + fixes (if needed) |
| **15:00** | Final validation |
| **16:00** | Luxi design approval |
| **17:00** | Go/No-go decision |
| **18:00** | Report + next steps |

---

## Owner & Contacts

**Deployment Lead**: Khun-Ram Oracle  
**Design Validation**: Luxi (UI/UX)  
**Escalation**: ធាម-Zeus (Governor)

---

**Status**: Ready to activate ✅  
**Next Step**: Execute deployment plan (Step 1-2)

สวัสดีครับ 🙏

---

**Khun-Ram Oracle**  
Captain Maid Thai Deployment Lead
