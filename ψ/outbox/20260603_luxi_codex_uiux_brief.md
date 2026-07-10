---
from: luxi-oracle
to: codex (luxi-dashboard-redesign pane)
date: 2026-06-03
subject: UI/UX Revision — orry-serenity B2B ERP
priority: high
aesthetic: luxury/refined dark
---

# UI/UX Revision Brief — orry-serenity

## Aesthetic Direction: **luxury/refined dark**

ไม่ blend, commit สุด:
- Dark surfaces: `slate-900 / slate-950 / black`
- Accent: gold `#C9A84C` + rose `#E05C5C` (existing tokens)
- Typography: **Sarabun** (Thai body) + **DM Serif Display** (headings)
- Motion: one orchestrated entrance per page, `stagger 0.05s`, no random micro-interactions
- No: emoji icons, purple gradients, Inter/Roboto, generic card outlines

---

## Scope (3 files, surgical)

### 1. `orry-serenity/components/Sidebar/Sidebar.tsx`

**Problem**: emoji icons (🏠📦🏭) — not professional, not accessible

**Fix**: Replace all emoji with Lucide React icons

| Nav item | Lucide icon |
|---|---|
| Dashboard | `LayoutDashboard` |
| Products | `Package` |
| Inventory | `Warehouse` |
| Sales Orders | `ShoppingCart` |
| Purchase | `ShoppingBag` |
| Vendors | `Building2` |
| Customers | `Users` |
| Invoices | `FileText` |
| Payments | `CreditCard` |
| Accounts & Finance | `Landmark` |
| Approvals | `CheckSquare` |
| Transport | `Truck` |
| Reports | `BarChart3` |
| Users | `UserCog` |
| Settings | `Settings` |

Also add `import { ... } from 'lucide-react'` at top.

Nav item active state: `bg-white/5 border-l-2 border-[#C9A84C] text-white` (gold left border)
Nav item default: `text-slate-400 hover:text-white hover:bg-white/5`

Add icon to JSX:
```tsx
<Icon className="w-4 h-4 shrink-0" />
<span>{label}</span>
```

---

### 2. `orry-serenity/components/Dashboard/widgets/KPIGrid.tsx`

**Problem**: generic card layout — no visual hierarchy, no luxury feel

**Fix**: upgrade card style

Each KPI card:
```tsx
className="relative overflow-hidden rounded-xl border border-white/8 bg-slate-900/80 p-5 backdrop-blur-sm"
```

Add subtle gold top-border accent on first card (revenue):
```tsx
className="... before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#C9A84C]/60 before:to-transparent"
```

KPI value: `text-2xl font-bold text-white tracking-tight`
KPI label: `text-xs font-medium text-slate-400 uppercase tracking-widest`
KPI delta (positive): `text-emerald-400`
KPI delta (negative): `text-rose-400`

---

### 3. `orry-serenity/components/Dashboard/widgets/SalesPanel.tsx`

**Problem**: chart area likely has default recharts styling — needs refinement

**Fix**:
- Chart container: `bg-slate-900/60 rounded-xl border border-white/8 p-5`
- Section label: `text-xs text-slate-400 uppercase tracking-widest mb-4`
- Chart colors: primary line `#C9A84C` (gold), secondary `#E05C5C` (rose)
- Remove default recharts grid lines or set `stroke="#ffffff10"`
- Tooltip: `bg-slate-800 border border-white/10 rounded-lg text-sm`

---

## Technical Constraints

- Repo: `orry-serenity/` submodule in mission-control
- Stack: Next.js 14, TypeScript, Tailwind CSS, ShadCN UI
- Lucide React: already in package.json (used in approvals)
- Do NOT change: routing, API calls, data fetching, auth logic
- Do NOT add new packages
- Branch: create `fix/orry-uiux-polish` before starting

---

## Execution Order

1. `git checkout -b fix/orry-uiux-polish` (inside orry-serenity)
2. Sidebar emoji → Lucide icons
3. KPIGrid card upgrade
4. SalesPanel chart style
5. Commit: `feat(ui): replace emoji icons + upgrade KPI cards + refine sales chart`
6. Push + PR to orry-serenity main

---

## Done Signal

Reply to luxi-oracle pane with:
```
✅ orry-uiux-polish done — PR #[N] open
files: Sidebar.tsx, KPIGrid.tsx, SalesPanel.tsx
```

[luxi-oracle]
