# DHEVA Mission — ORRY Frontend Quality Review
**Date:** 2026-06-04  
**Reviewed by:** UAT Oracle / Claude (Tham dispatch)  
**Scope:** `/orry/src/app/(protected)/` — Next.js 15 + React 19 ERP frontend  
**Framework:** Next.js App Router, Server Components, custom CSS (no Tailwind in pages)

---

## 🔴 CRITICAL — Loading States

**Severity: HIGH | All 14 protected routes affected**

- **ZERO** `loading.tsx` files exist under any `(protected)/` route
- All pages use `export const dynamic = "force-dynamic"` with async Server Components
- Every page fetch (inventory, products, contacts, documents, billing) blocks the full render — user sees blank white until DB responds
- No `<Suspense>` wrappers anywhere in page trees
- No Skeleton UI components used in any page
- Only `forge-omega/loading.tsx` exists (non-ERP utility page)

**Impact:** On slow connections or large datasets, users see a blank white screen for 2–5+ seconds with zero feedback.

**Fix needed:**
- Add `loading.tsx` to each `(protected)/[route]/` directory
- Add Skeleton component in `src/components/ui/` and use in key data-heavy pages

---

## 🔴 CRITICAL — Error States

**Severity: HIGH | All 14 protected routes affected**

- **ZERO** `error.tsx` files under `(protected)/`
- Page-level data functions (`getProductModuleData`, `listAccountingDocuments`, `getContacts`, etc.) have NO `.catch()` handlers
- If any DB call throws, Next.js renders its generic default error (no branding, no Thai language)
- Only partial protection found:
  - `accounting-document-page.tsx:95` — `.catch(() => [])` for branches only
  - `accounting-document-page.tsx:138` — `notFound()` for missing document by ID ✅

**Fix needed:**
- Add `error.tsx` to `(protected)/layout.tsx` level or per-route
- Wrap critical data fetches in try/catch or `.catch()` with user-friendly fallback

---

## 🟡 WARNING — Empty States

**Severity: MEDIUM | Most list pages affected**

**Missing empty states (blank table renders):**
| Page | File | Issue |
|------|------|-------|
| Document list | `accounting-document-page.tsx:74` | Empty DataTable rendered with no message |
| Products | `products/page.tsx:24` | Empty DataTable if no products |
| Inventory | `inventory/page.tsx:14` | Empty DataTable if no items |
| Contacts list | `contacts/page.tsx:71` | Empty table section (no message) |
| Billing, Catalog, Receipts | all use `AccountingDocumentListPage` | Same issue as document list |

**Partial empty states (good examples to copy):**
- `accounting-document-page.tsx:377` — `<span className="empty-state">ไม่มีรายการบรรทัด</span>` ✅
- `accounting-document-page.tsx:420` — `<p className="empty-state">ยังไม่มีประวัติ</p>` ✅
- `admin/approvals/page.tsx` — has empty state check ✅

**Root issue:** `DataTable` component (`src/components/data-table/data-table.tsx`) has no empty state renderer. When `rows.length === 0`, it renders an empty `<tbody>` with no feedback.

**Fix needed:**
- Add empty state prop to `DataTable` component
- Default: "ไม่พบข้อมูล" with a subtle icon
- Each list page can override with context-specific message

---

## 🟡 WARNING — Mobile Responsiveness

**Severity: MEDIUM | Functional but poor UX below 1100px**

**What exists:**
- CSS breakpoints at 1240px, 1100px, 860px (in `globals.css:852`)
- `table-wrap` has `overflow-x: auto` + `min-width: 640px` table → horizontal scroll works ✅
- `content-grid.two-up` collapses to 1-column at 1240px ✅
- At 860px: padding reduces, metrics grid collapses ✅

**Issues:**

1. **No mobile navigation** — At ≤1100px, sidebar collapses (`position: static`) but remains fully visible as a tall block stacked above content. There is no hamburger menu, no drawer, no toggle. Users on mobile must scroll past the entire nav to reach content.
   - File: `app-shell.tsx` — `<aside className="sidebar ...">` has no mobile collapse

2. **No breakpoint below 860px** — Phones at 320–640px (common in Thailand: small Android budget devices) have no dedicated styles. The min-width 580px table still overflows the viewport.

3. **Topbar meta overflow** — `topbar-meta` flex row has `justify-content: space-between` but no wrapping on small screens. On ≤400px, chips and buttons may clip.

4. **`lang="en"` on html element** — `src/app/layout.tsx:6` — should be `lang="th"` for Thai-first app (affects screen readers, spell check, text selection behavior on mobile browsers)

---

## 🔴 CRITICAL — Thai Heading Line-Height (Diacritic Clipping)

**Severity: HIGH | All headings on every protected page**

Thai script has tone marks and vowel diacritics above/below the baseline (`่ ้ ๊ ๋ ํ ะ า`). These require `line-height ≥ 1.4` minimum.

**Found in `globals.css`:**
- `line 186/354`: `.brand-block h1` and `.page-header h1` → `line-height: 0.95` ← **diacritics will clip**
- `dashstack-dashboard.module.css line 119`: `.overviewCopy h1` → `line-height: 0.95` ← same issue

Every page header title (`title` prop passed to `PageHeader`) uses `h1` with `line-height: 0.95`. Since virtually all page titles are Thai text (e.g. "ผู้ติดต่อ", "สินค้าและบริการ", "คลังสินค้า"), tone marks and above-baseline vowels will be clipped visually.

**Fix needed:** Increase to minimum `line-height: 1.15` for `h1.page-header-title`, or `line-height: clamp(1.1, 1.15, 1.2)`.

---

## 🔴 ADDENDUM — Error Handling in Data Layer (Partial Mitigation)

Agent review found that `src/lib/repository.ts` has comprehensive try-catch blocks that **return fallback demo data** instead of throwing on DB errors. This partially mitigates the lack of `error.tsx` — some pages won't blank-crash, they'll show stale demo data silently. This is a hidden risk (silent data corruption from user's perspective).

Also found: `admin/users/page.tsx` and `admin/approvals/page.tsx` have feedback banner components for server action results (success/error after form submit) — better pattern than other pages.

---

## 🟢 GOOD — Thai Language Support

**Severity: LOW (minor issues only)**

**What's done well:**
- `Noto_Sans_Thai` loaded via `next/font/google` with correct `["latin", "thai"]` subsets ✅
- Weights 400/500/600/700/800 all loaded ✅
- Font mapped to `--font-sans`, `--font-display`, `--font-prompt` CSS variables ✅
- Extensive Thai content: `thaiCanonicalTerms`, `thaiNavItems`, `thaiRoleLabels`, `thaiContactTypeLabels` — well-structured ✅
- Thai date formatting: `Intl.DateTimeFormat("th-TH", { dateStyle: "long" })` ✅
- All form labels, column headers, status labels, and page descriptions in Thai ✅
- Thai placeholder text in all inputs ✅
- No aggressive truncation on Thai text fields ✅
- No `maxLength` restrictions on Thai content inputs ✅

**Minor issues:**

1. **`<html lang="en">`** — `layout.tsx:13` should be `lang="th"` (affects screen readers, spellcheck, mobile browser behavior)
2. **`globals.css` CSS variable stale** — `--font-sans: "Plus Jakarta Sans"` hardcoded at line 3 (overridden by Next.js font variable but creates confusion in dev tools)
3. **Table line-height** — `table td/th` CSS has no explicit `line-height`. Thai words may feel cramped. Recommend `line-height: 1.7` for table cells.
4. **Long Thai text in table cells** — No `max-width` + `text-overflow: ellipsis` on `td`. Long company/product names will expand columns.

---

## Summary Score

| Area | Score | Status |
|------|-------|--------|
| Loading States | 0/10 | 🔴 Critical |
| Error States | 2/10 | 🔴 Critical (repo fallback mitigates somewhat) |
| Empty States | 4/10 | 🟡 Partial |
| Mobile Responsiveness | 5/10 | 🟡 Acceptable but no mobile nav |
| Thai Language — Font/Content | 8/10 | 🟢 Good |
| Thai Language — Line-Height | 1/10 | 🔴 Critical (clipping diacritics) |

---

## Recommended Fix Priority

1. **[P0]** Fix `line-height: 0.95` → `1.15` on `.page-header h1` and `.brand-block h1` — Thai diacritics clipping in every page title
2. **[P0]** Add `loading.tsx` to all protected routes — 30 min effort, huge UX win
3. **[P0]** Add `error.tsx` at `(protected)/layout.tsx` level — single file covers all routes
4. **[P1]** Add empty state to `DataTable` component — single change fixes 8+ pages
5. **[P1]** Mobile sidebar: add hamburger toggle with `input[type=checkbox]` + CSS or small JS toggle
6. **[P2]** Fix `<html lang="en">` → `lang="th"` in `layout.tsx`
7. **[P2]** Add `line-height: 1.7` to `.table td, .table th` for Thai text readability
8. **[P3]** Add 480px breakpoint for very small phones (320–479px)

---

## Evidence Files Reviewed

- `orry/src/app/(protected)/` — all 14 route directories
- `orry/src/app/layout.tsx` — html lang, font wiring
- `orry/src/app/fonts.ts` — font config (Noto Sans Thai confirmed)
- `orry/src/app/globals.css` — breakpoints, table CSS, responsive rules
- `orry/src/components/app-shell/app-shell.tsx` — sidebar/nav structure
- `orry/src/components/data-table/data-table.tsx` — table component
- `orry/src/components/documents/accounting-document-page.tsx` — main document flow
- `orry/src/app/(protected)/contacts/page.tsx`
- `orry/src/app/(protected)/products/page.tsx`
- `orry/src/app/(protected)/inventory/page.tsx`
