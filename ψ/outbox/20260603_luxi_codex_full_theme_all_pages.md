---
from: luxi-oracle
to: codex (luxi-dashboard-redesign pane)
date: 2026-06-03
subject: FULL UI overhaul — ALL pages, ALL components, NO exceptions
ref: feat/theme-ultra-dark (continue on same branch or new branch feat/theme-all-pages)
priority: CRITICAL
---

# Full UI Overhaul — Every File, Every Page

## Design System (already established in feat/theme-ultra-dark)

```
--bg-base:        #0D0D0F   (page background)
--bg-surface:     #141416   (card bg)
--bg-elevated:    #1C1C20   (active/featured card)
--bg-input:       #1A1A1E   (inputs, dropdowns)
--border-subtle:  rgba(255,255,255,0.06)
--border-default: rgba(255,255,255,0.10)
--text-primary:   #FFFFFF
--text-secondary: #8A8A9A
--text-muted:     #555560
--accent-gold:    #C9A84C
--accent-blue:    #4A7FD4
--accent-teal:    #00BFA5
--accent-rose:    #E05C5C
--radius-card:    16px  (rounded-2xl)
```

---

## PHASE 1 — Shared UI Components (7 files, cascade to ALL pages)

### `components/ui/Card.tsx`

```tsx
export function Card({ children, className, header, footer }: CardProps) {
  return (
    <div className={`bg-[#141416] border border-white/[0.06] rounded-2xl ${className || ''}`}>
      {header && (
        <div className="px-5 py-4 border-b border-white/[0.06]">
          {header}
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
      {footer && (
        <div className="px-5 py-4 border-t border-white/[0.06] bg-[#0D0D0F]/30 rounded-b-2xl">
          {footer}
        </div>
      )}
    </div>
  );
}
```

---

### `components/ui/Button.tsx`

Replace `variantClasses`:
```tsx
const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-[#4A7FD4] hover:bg-[#5A8FE4] text-white',
  secondary: 'bg-[#1C1C20] hover:bg-[#242428] text-white border border-white/10',
  success:   'bg-[#00BFA5]/15 hover:bg-[#00BFA5]/25 text-[#00BFA5] border border-[#00BFA5]/25',
  danger:    'bg-[#E05C5C]/15 hover:bg-[#E05C5C]/25 text-[#E05C5C] border border-[#E05C5C]/25',
  warning:   'bg-[#C9A84C]/15 hover:bg-[#C9A84C]/25 text-[#C9A84C] border border-[#C9A84C]/25',
  ghost:     'bg-transparent hover:bg-[#1C1C20] text-[#8A8A9A] hover:text-white border border-white/[0.06]',
};
```

Replace `baseClasses`:
```tsx
const baseClasses = 'font-medium rounded-xl transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-1 focus:ring-offset-[#0D0D0F]';
```

---

### `components/ui/Table.tsx`

Replace className strings:

```tsx
// Table wrapper
<div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
  <table className={`w-full border-collapse ${className || ''}`}>

// TableHead
<thead className="bg-[#0D0D0F] border-b border-white/[0.06]">

// TableHeader (th)
className={`px-5 py-3 text-left text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em] ${className || ''}`}

// TableBody row — add to <tr>:
className="border-b border-white/[0.04] hover:bg-[#1A1A1E] transition-colors duration-100"

// TableCell (td)
className={`px-5 py-3.5 text-sm text-[#8A8A9A] ${className || ''}`}
```

---

### `components/ui/Badge.tsx`

Replace `variantClasses`:
```tsx
const variantClasses: Record<BadgeVariant, string> = {
  default:  'bg-white/[0.06] text-[#8A8A9A]',
  success:  'bg-[#00BFA5]/10 text-[#00BFA5] border border-[#00BFA5]/20',
  warning:  'bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20',
  danger:   'bg-[#E05C5C]/10 text-[#E05C5C] border border-[#E05C5C]/20',
  info:     'bg-[#4A7FD4]/10 text-[#4A7FD4] border border-[#4A7FD4]/20',
  pending:  'bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20',
  approved: 'bg-[#00BFA5]/10 text-[#00BFA5] border border-[#00BFA5]/20',
  rejected: 'bg-[#E05C5C]/10 text-[#E05C5C] border border-[#E05C5C]/20',
};
```

Replace `baseClasses`:
```tsx
const baseClasses = 'inline-flex items-center gap-1.5 font-medium rounded-full';
```

---

### `components/ui/Input.tsx`

Replace `baseClasses`:
```tsx
const baseClasses = 'w-full px-4 py-2.5 bg-[#1A1A1E] border border-white/[0.08] rounded-xl text-white placeholder:text-[#555560] text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A7FD4]/30 focus:border-[#4A7FD4]/50 disabled:bg-[#0D0D0F] disabled:cursor-not-allowed disabled:text-[#555560]';
```

Replace label:
```tsx
<label className="text-[10px] font-medium text-[#555560] uppercase tracking-[0.10em]">{label}</label>
```

---

### `components/ui/Modal.tsx`

Read the file, then update:
- Overlay: `bg-[#0D0D0F]/80 backdrop-blur-sm`
- Panel: `bg-[#141416] border border-white/[0.08] rounded-2xl shadow-2xl`
- Header: `px-6 py-4 border-b border-white/[0.06] text-white`
- Close button: `text-[#555560] hover:text-white`

---

### `components/ui/SearchInput.tsx`

Read the file, then update:
- Same as Input but with `rounded-full` + search icon color `text-[#555560]`
- Wrapper: `bg-[#1A1A1E] border border-white/[0.08] rounded-full`

---

## PHASE 2 — Dashboard Widgets (10 files)

For each file in `components/Dashboard/widgets/`:

### Pattern to apply to ALL widgets:
- Card container: `bg-[#141416] border border-white/[0.06] rounded-2xl p-5`
- Section label: `text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em] mb-4`
- Value text: `text-2xl font-light text-white`
- Secondary text: `text-sm text-[#8A8A9A]`
- Dividers: `border-white/[0.06]`

**Files to update:**
1. `KPICard.tsx` — already done in feat/theme-ultra-dark
2. `KPIGrid.tsx` — grid gap: `gap-4`
3. `SalesPanel.tsx` — already done
4. `PendingApprovalQueue.tsx` — card + table rows
5. `LowStockAlert.tsx` — card + badge colors
6. `TopProducts.tsx` — card + list items
7. `RecentActivity.tsx` — card + timeline items
8. `RecentActivityFeed.tsx` — feed items: `border-white/[0.06]`, timestamp: `text-[#555560]`
9. `WarehouseMovement.tsx` — card + progress bars: `bg-[#4A7FD4]` on `bg-white/[0.06]`
10. `ApprovalsCard.tsx` — card + status badges

---

## PHASE 3 — Module Components (all files in components/modules/)

Apply to every component:

### `components/modules/ModuleTemplate.tsx`
- Page wrapper: `min-h-screen`
- Section header: `text-2xl font-light text-white mb-1` + `text-[#555560] text-sm`

### Sales Orders (4 files)
`OrdersList.tsx`, `OrderForm.tsx`, `OrderStats.tsx`, `SalesOrderDetail.tsx`, `SalesOrderForm.tsx`, `SalesOrdersList.tsx`, `SalesOrderListSkeleton.tsx`, `StatusWorkflow.tsx`
- All card containers → `bg-[#141416] border border-white/[0.06] rounded-2xl`
- Status colors: use Badge variantClasses above
- Form fields: use Input styles above
- Status workflow steps: active = `bg-[#C9A84C]/10 border-[#C9A84C]/30 text-[#C9A84C]`

### Products (5 files)
`ProductsList.tsx`, `ProductForm.tsx`, `ProductDetail.tsx`, `ProductTable.tsx`, `ProductDetailPanel.tsx`, `InventoryAnalytics.tsx`, `LowStockAlerts.tsx`, `WarehouseLocationTracker.tsx`, `ProductListSkeleton.tsx`
- Same card/table/input/badge pattern
- Analytics charts: dark bg, accent-teal line

### Customers (4 files)
`CustomersList.tsx`, `CustomerForm.tsx`, `CustomerDetail.tsx`, `CustomerListSkeleton.tsx`

### Vendors (4 files)
`VendorsList.tsx`, `VendorForm.tsx`, `VendorDetail.tsx`, `VendorListSkeleton.tsx`

### Purchase Orders (2 files)
`PurchaseOrdersList.tsx`, `PurchaseOrderDetail.tsx`

### Accounts (2 files)
`JournalEntriesList.tsx`, `JournalEntryDetail.tsx`

### Settings (6 files)
`BranchSection.tsx`, `CompanyProfileSection.tsx`, `DocumentNumberSection.tsx`, `FiscalYearSection.tsx`, `PaymentTermsSection.tsx`, `TaxCodeSection.tsx`
- Section cards: `bg-[#141416] border border-white/[0.06] rounded-2xl p-5`
- Section title: `text-sm font-medium text-white mb-4`

---

## PHASE 4 — All Page Files (inline styles)

For every `page.tsx` under `app/[locale]/(app)/`:

### Page header pattern (apply to ALL pages):
```tsx
<div className="mb-6">
  <h1 className="text-2xl font-light text-white tracking-tight">[Page Title]</h1>
  <p className="text-[#555560] text-xs uppercase tracking-[0.10em] mt-1">[Subtitle]</p>
</div>
```

### Pages to check for hardcoded slate/gradient colors:
- `accounting/page.tsx` + `accounting/new/page.tsx`
- `accounts/page.tsx`
- `approvals/page.tsx`
- `customers/**`
- `dashboard/page.tsx`
- `inventory/**`
- `invoices/**`
- `logistics/**`
- `payments/**`
- `products/**`
- `purchase/**`
- `reports/page.tsx`
- `sales-orders/**`
- `settings/page.tsx`
- `users/page.tsx`
- `vendors/**`

Replace ALL occurrences of:
- `bg-slate-800` → `bg-[#141416]`
- `bg-slate-900` → `bg-[#0D0D0F]`
- `bg-slate-700` → `bg-[#1C1C20]`
- `border-slate-700` → `border-white/[0.08]`
- `border-slate-800` → `border-white/[0.06]`
- `text-slate-300` → `text-[#8A8A9A]`
- `text-slate-400` → `text-[#8A8A9A]`
- `text-slate-500` → `text-[#555560]`
- `rounded-lg` → `rounded-2xl` (on cards/panels only, not buttons/badges)
- `bg-gradient-to-r from-blue-600` → `bg-[#4A7FD4]`

---

## Reports Page (`reports/page.tsx`) — Special Notes

The reports page has:
- KPI grid (4 cards) — apply card pattern + font-light values
- ORRY Advantage callout: `bg-[#4A7FD4]/10 border border-[#4A7FD4]/20 rounded-2xl p-4 text-sm text-[#8A8A9A]`
- Monthly sales table — use Table component styles
- Remove any `bg-emerald-900/20` etc. → use new badge colors

---

## Execution

```bash
# If feat/theme-ultra-dark still open, continue on it
# Otherwise:
git checkout -b feat/theme-all-pages

# Execute phases in order:
# 1. components/ui/*.tsx (7 files) — highest impact
# 2. components/Dashboard/widgets/*.tsx (10 files)
# 3. components/modules/**/*.tsx (all module files)
# 4. app/[locale]/(app)/**/page.tsx (all 30 pages)

bun run build  # TypeScript check before commit

git add -A
git commit -m "feat(theme): full ultra-dark overhaul — all 30 pages, all components, no exceptions"
git push
gh pr create ...
```

## Done Signal
```
✅ full theme done — PR #[N] open
pages: 30/30 ✅  components: all ✅  build: clean ✅
```

[luxi-oracle]
