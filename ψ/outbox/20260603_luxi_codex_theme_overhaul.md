---
from: luxi-oracle
to: codex (luxi-dashboard-redesign pane)
date: 2026-06-03
subject: Full Theme Overhaul — orry-serenity → Ultra Dark Minimal
ref-image: weather-dashboard design (analyzed)
priority: high
---

# Theme Overhaul Brief — orry-serenity

## Design Language (from reference image)

### Core Principles
- **Pure dark base** — not slate-950, almost pure black `#0D0D0F`
- **Cards = barely elevated surfaces** — `#141416`, no gradient, no glass blur, no shadows
- **Borders = ghost** — `rgba(255,255,255,0.06)` only
- **Typography = light weight** — values are `font-light` not `font-bold`
- **Radius = generous** — `rounded-2xl` (16px) everywhere
- **Sidebar = icon-only, narrow** — 56px, no labels
- **Nav = flat, minimal** — search pill center, avatar right, no border-bottom
- **NO**: gradients on nav/sidebar, glassmorphism blur, gold gradient text, heavy borders

### Design Tokens Extracted
```
Background:     #0D0D0F  (near-black, slight warm undertone)
Surface/Card:   #141416  (barely elevated)
Elevated:       #1C1C20  (featured/active card)
Input bg:       #1A1A1E  (search bar)
Border subtle:  rgba(255,255,255,0.06)
Border default: rgba(255,255,255,0.10)
Text primary:   #FFFFFF
Text secondary: #8A8A9A  (labels, secondary)
Text muted:     #555560  (tab inactive, sub-labels)
Accent blue:    #4A7FD4  (chart lines, active pills)
Accent teal:    #00BFA5  (gauge, indicators)
Accent gold:    #C9A84C  (keep for ORRY brand — active sidebar item)
```

---

## Files to Change (5 files)

### 1. `app/globals.css` — Design Token Override

Replace dark mode block entirely:

```css
html.dark {
  color-scheme: dark;

  /* Base surfaces */
  --bg-base:         #0D0D0F;
  --bg-surface:      #141416;
  --bg-elevated:     #1C1C20;
  --bg-input:        #1A1A1E;

  /* Borders */
  --border-subtle:   rgba(255, 255, 255, 0.06);
  --border-default:  rgba(255, 255, 255, 0.10);
  --border-strong:   rgba(255, 255, 255, 0.18);

  /* Text */
  --text-base:       #FFFFFF;
  --text-secondary:  #8A8A9A;
  --text-muted:      #555560;

  /* Accents */
  --accent-gold:     #C9A84C;
  --accent-blue:     #4A7FD4;
  --accent-teal:     #00BFA5;
  --accent-rose:     #E05C5C;

  /* Surface aliases (for backward compat) */
  --surface:         #141416;
  --surface-hover:   #1C1C20;
}
```

Also replace `html.dark body` rule — remove gradient, set flat:
```css
html.dark body {
  background: var(--bg-base);
}
```

Also update `:root` (light still same), but add these new vars so dark-mode classes work:
```css
:root {
  --radius-card: 16px;
  --radius-lg:   20px;
  --radius-sm:   8px;
}
```

---

### 2. `components/Sidebar/Sidebar.tsx` — Icon-Only Slim Sidebar

**Target**: 56px wide, icon-only, flat black, Lucide icons, gold active indicator

Replace entire component:

```tsx
'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import {
  LayoutGrid, LayoutDashboard, Package, Warehouse, ShoppingCart,
  ShoppingBag, Building2, Users, FileText, CreditCard, Landmark,
  CheckSquare, Truck, BarChart3, UserCog, Settings
} from 'lucide-react';

const NAV_ITEMS = [
  { path: 'dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { path: 'products',   icon: Package,         label: 'Products' },
  { path: 'inventory',  icon: Warehouse,        label: 'Inventory' },
  { path: 'sales-orders', icon: ShoppingCart,  label: 'Sales Orders' },
  { path: 'purchase',   icon: ShoppingBag,     label: 'Purchase' },
  { path: 'vendors',    icon: Building2,        label: 'Vendors' },
  { path: 'customers',  icon: Users,            label: 'Customers' },
  { path: 'invoices',   icon: FileText,         label: 'Invoices' },
  { path: 'payments',   icon: CreditCard,       label: 'Payments' },
  { path: 'accounts',   icon: Landmark,         label: 'Accounts' },
  { path: 'approvals',  icon: CheckSquare,      label: 'Approvals' },
  { path: 'logistics',  icon: Truck,            label: 'Transport' },
  { path: 'reports',    icon: BarChart3,        label: 'Reports' },
  { path: 'users',      icon: UserCog,          label: 'Users' },
  { path: 'settings',   icon: Settings,         label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const locale = (params.locale as string) || 'th';

  return (
    <aside className="hidden md:flex w-14 flex-col flex-shrink-0 bg-[#0D0D0F] border-r border-white/[0.06]">
      {/* Logo icon */}
      <div className="flex items-center justify-center h-16 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-lg bg-[#1C1C20] border border-white/10 flex items-center justify-center">
          <LayoutGrid className="w-4 h-4 text-[#C9A84C]" />
        </div>
      </div>

      {/* Nav icons */}
      <nav className="flex-1 flex flex-col items-center gap-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const href = `/${locale}/${path}`;
          const active = pathname.includes(`/${path}`);
          return (
            <Link
              key={path}
              href={href}
              title={label}
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 group ${
                active
                  ? 'bg-[#1C1C20] text-white'
                  : 'text-[#555560] hover:text-white hover:bg-[#1A1A1E]'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r bg-[#C9A84C]" />
              )}
              <Icon className="w-4 h-4" />
              {/* Tooltip */}
              <span className="absolute left-full ml-3 px-2 py-1 rounded-md bg-[#1C1C20] border border-white/10 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

---

### 3. `components/Header/Header.tsx` — Minimal Top Nav

**Target**: flat dark, search pill center, notification + theme toggle + avatar right, no border

Replace the header container + search area. Key changes:
- `bg-[#0D0D0F]` (not surface/slate-900)
- Remove border-bottom (or `border-b border-white/[0.04]` barely visible)
- Add search bar: `<input>` with `rounded-full bg-[#1A1A1E] border border-white/10 px-4 py-2 text-sm placeholder:text-[#555560]`
- Logo: remove text span "Serenity ERP", keep `<img>` only, smaller `h-6`
- Avatar: `w-8 h-8 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/30 text-[#C9A84C] text-xs font-medium`

Outer header className:
```tsx
className="bg-[#0D0D0F] border-b border-white/[0.05] flex-shrink-0"
```

Inner container height: `h-14` (not h-16, slightly slimmer)

Add search between logo and right section:
```tsx
<div className="flex-1 max-w-xs mx-6">
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555560]" />
    <input
      type="text"
      placeholder="ค้นหา..."
      className="w-full pl-9 pr-4 py-2 rounded-full bg-[#1A1A1E] border border-white/[0.08] text-sm text-white placeholder:text-[#555560] focus:outline-none focus:border-white/20 transition-colors"
    />
  </div>
</div>
```

---

### 4. `components/Dashboard/widgets/KPICard.tsx` — Card Overhaul

**Target**: deeper dark, light-weight value, no bold, larger radius, subtle icon

Replace entire component:

```tsx
interface KPICardProps {
  label: string;
  value: string | number;
  icon: string;
  color: 'rose' | 'gold' | 'blue' | 'slate';
  trend?: string;
  featured?: boolean;
}

function getTrendColor(trend: string): string {
  if (trend.startsWith('+') || trend.startsWith('▲')) return 'text-[#00BFA5]';
  if (trend.startsWith('-') || trend.startsWith('▼')) return 'text-[#E05C5C]';
  return 'text-[#555560]';
}

export function KPICard({ label, value, icon, color: _color, trend, featured }: KPICardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:border-white/15 ${
        featured
          ? 'bg-[#1C1C20] border-white/10'
          : 'bg-[#141416] border-white/[0.06]'
      }`}
    >
      {featured && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em] mb-3">
            {label}
          </p>
          <p className="text-2xl font-light text-white tracking-tight leading-none tabular-nums">
            {value}
          </p>
          {trend && (
            <p className={`text-xs mt-2.5 font-medium ${getTrendColor(trend)}`}>{trend}</p>
          )}
        </div>
        <div className="text-2xl opacity-70 flex-shrink-0">{icon}</div>
      </div>
    </div>
  );
}
```

---

### 5. `app/[locale]/(app)/layout.tsx` — Layout Container

Update outer wrapper:
```tsx
<div className="flex h-screen bg-[#0D0D0F]">
```

Update `<main>` padding:
```tsx
<div className="p-5 md:p-6">{children}</div>
```

---

## Execution Order

```bash
git checkout -b feat/theme-ultra-dark  # inside orry-serenity/
```

1. `app/globals.css` — tokens + body override
2. `components/Sidebar/Sidebar.tsx` — full replace
3. `components/Header/Header.tsx` — targeted changes (container, search, avatar)
4. `components/Dashboard/widgets/KPICard.tsx` — full replace
5. `app/[locale]/(app)/layout.tsx` — bg class update

**TypeScript**: check `bun run build` dry — fix any missing import (Search from lucide-react needed in Header)

## Commit message
```
feat(theme): ultra-dark minimal redesign — icon sidebar, slim nav, refined KPI cards
```

## Done Signal
```
✅ theme-ultra-dark done — PR #[N] open
screenshots: sidebar, dashboard KPI cards, header
```

[luxi-oracle]
