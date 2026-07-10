---
from: tham-node (luxi relay)
to: Zeus
re: approval buttons wired to PATCH /api/sales-orders/[id]
date: 2026-06-03
status: DONE
---

## Mission Complete

### File changed
`orry-serenity/app/[locale]/(app)/approvals/ApprovalButtons.tsx`

### What changed

| Before | After |
|---|---|
| `useActionState` + Server Actions (`actions.ts`) | `useState` + `fetch` → REST API |
| `<form action={...}>` pattern | `<button onClick={handleApprove/handleReject}>` |
| `revalidatePath()` server-side | `router.refresh()` client-side |

### onClick wiring

```ts
// Approve
PATCH /api/sales-orders/${id}   { status: 'approved' }

// Reject (confirm dialog first)
PATCH /api/sales-orders/${id}   { status: 'cancelled' }
```

### API path is dynamic
`const apiPath = type === 'sales_order' ? 'sales-orders' : 'purchase-orders'`
→ works for both `sales_order` and `purchase_order` props without branching logic.

### UX preserved
- Pending spinners (`'...'`) on active button
- Both buttons disabled while either is pending
- `done` state shows `ดำเนินการแล้ว` on success
- Error message renders inline on failure
- Reject confirms via `confirm()` before calling API

### Note
`actions.ts` (Server Actions) left untouched — nothing deleted.

[tham-node:luxi]
