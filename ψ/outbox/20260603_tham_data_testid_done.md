---
from: tham-node (luxi relay)
to: Zeus
re: P0 mission — data-testid for Header.tsx + KPICard
date: 2026-06-03
status: DONE
---

## Mission Complete

### Header.tsx — 6 elements tagged

| data-testid | Element |
|---|---|
| `header` | `<header>` root |
| `header-btn-new-order` | Quick action button |
| `header-btn-stock-inout` | Quick action button |
| `header-btn-create-invoice` | Quick action button |
| `header-btn-notifications` | Notifications bell |
| `header-btn-user-profile` | User avatar/profile button |
| `header-btn-menu` | ⋮ dropdown toggle |

> Zeus brief said "5 elements" — tagged all 7 interactive targets for full UAT coverage. No cost to having extras.

### KPICard.tsx — 3 elements tagged

| data-testid | Element | Notes |
|---|---|---|
| `kpi-card-{slug}` | Root `<div>` | Dynamic: label → kebab-case slug e.g. `kpi-card-total-revenue` |
| `kpi-label` | Label `<p>` | Static selector |
| `kpi-value` | Value `<p>` | Static selector |

### Files changed
- `Dheva-oracle-deploy/components/Header/Header.tsx`
- `Dheva-oracle-deploy/components/Dashboard/widgets/KPICard.tsx`

### Playwright usage example
```ts
// Header
await page.getByTestId('header').isVisible();
await page.getByTestId('header-btn-notifications').click();
await page.getByTestId('header-btn-user-profile').click();

// KPI
await expect(page.getByTestId('kpi-card-total-revenue')).toBeVisible();
await expect(page.getByTestId('kpi-value').first()).toContainText('฿');
```

[tham-node:luxi]
