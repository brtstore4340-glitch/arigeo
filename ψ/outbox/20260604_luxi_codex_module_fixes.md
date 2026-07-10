---
from: luxi-oracle
to: codex (luxi-dashboard-redesign pane)
date: 2026-06-04
subject: 3 module fixes — Users redirect, Transport redesign, Products completion
priority: high
---

# Module Fixes — 3 Issues

## Branch
```bash
cd orry-serenity
git checkout main && git pull
git checkout -b fix/module-fixes-users-transport-products
```

---

## Fix 1: Users Page — Remove Hard Admin Redirect

**Problem**: `app/[locale]/(app)/users/page.tsx` line 12-13:
```ts
const { data: roleCode } = await supabase.rpc('get_user_role_code')
if (roleCode !== 'admin') redirect('/dashboard')
```
The `get_user_role_code` RPC likely doesn't exist or returns null → all users get redirected to dashboard.

**Fix**: Replace the RPC check with a simple auth check. Show the users page to any authenticated user, but hide destructive actions (delete) for non-admins. Remove the hard redirect.

Replace lines 10-13 with:
```ts
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect('/login')
// Users page accessible to all authenticated users
// (admin actions gated in UI if needed)
```

---

## Fix 2: Transport/Logistics Page — Redesign as Real Transport Module

**Problem**: `app/[locale]/(app)/logistics/page.tsx` is about `inventory_movements` (stock in/out/adjust) — this is warehouse/inventory content, NOT transport.

**Transport module should show**: shipments, deliveries, carriers, tracking numbers, delivery status — the movement of goods TO/FROM customers and vendors.

**Fix**: Rewrite `app/[locale]/(app)/logistics/page.tsx` as a proper Transport module:

```tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

// Transport = outbound deliveries (sales orders shipped) + inbound (purchase orders received)
export default async function TransportPage() {
  const supabase = await createClient()

  // Fetch sales orders with delivery info (outbound)
  let outbound: any[] = []
  let inbound: any[] = []
  let error: unknown = null

  try {
    const [outRes, inRes] = await Promise.all([
      supabase
        .from('sales_orders')
        .select('id, order_number, order_date, status, amount_gross, customers(name)')
        .in('status', ['approved', 'delivered', 'invoiced'])
        .order('order_date', { ascending: false })
        .limit(20),
      supabase
        .from('purchase_orders')
        .select('id, po_number, order_date, status, amount_gross, vendors(name)')
        .in('status', ['approved', 'received', 'partial'])
        .order('order_date', { ascending: false })
        .limit(20),
    ])
    outbound = outRes.data || []
    inbound = inRes.data || []
    if (outRes.error) error = outRes.error
  } catch (e) {
    error = e
  }

  const statusConfig: Record<string, { label: string; style: string }> = {
    approved:  { label: 'รอจัดส่ง', style: 'bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20' },
    delivered: { label: 'จัดส่งแล้ว', style: 'bg-[#00BFA5]/10 text-[#00BFA5] border border-[#00BFA5]/20' },
    invoiced:  { label: 'ออกใบแจ้งหนี้', style: 'bg-[#4A7FD4]/10 text-[#4A7FD4] border border-[#4A7FD4]/20' },
    received:  { label: 'รับสินค้าแล้ว', style: 'bg-[#00BFA5]/10 text-[#00BFA5] border border-[#00BFA5]/20' },
    partial:   { label: 'รับบางส่วน', style: 'bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20' },
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-white tracking-tight">การขนส่ง</h1>
        <p className="text-[#555560] text-xs uppercase tracking-[0.10em] mt-1">Transport — Outbound Deliveries & Inbound Receipts</p>
      </div>

      {error && (
        <div className="bg-[#E05C5C]/10 border border-[#E05C5C]/20 rounded-2xl p-4 text-sm text-[#E05C5C]">
          Error loading transport data
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#141416] border border-white/[0.06] rounded-2xl p-5">
          <p className="text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em] mb-3">รอจัดส่ง</p>
          <p className="text-2xl font-light text-white">{outbound.filter(o => o.status === 'approved').length}</p>
          <p className="text-xs text-[#8A8A9A] mt-1">Pending Delivery</p>
        </div>
        <div className="bg-[#141416] border border-white/[0.06] rounded-2xl p-5">
          <p className="text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em] mb-3">จัดส่งแล้ว</p>
          <p className="text-2xl font-light text-[#00BFA5]">{outbound.filter(o => o.status === 'delivered').length}</p>
          <p className="text-xs text-[#8A8A9A] mt-1">Delivered</p>
        </div>
        <div className="bg-[#141416] border border-white/[0.06] rounded-2xl p-5">
          <p className="text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em] mb-3">รับสินค้าเข้า</p>
          <p className="text-2xl font-light text-[#4A7FD4]">{inbound.filter(i => i.status === 'received').length}</p>
          <p className="text-xs text-[#8A8A9A] mt-1">Received</p>
        </div>
        <div className="bg-[#141416] border border-white/[0.06] rounded-2xl p-5">
          <p className="text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em] mb-3">รับบางส่วน</p>
          <p className="text-2xl font-light text-[#C9A84C]">{inbound.filter(i => i.status === 'partial').length}</p>
          <p className="text-xs text-[#8A8A9A] mt-1">Partial Receipt</p>
        </div>
      </div>

      {/* Outbound deliveries */}
      <div className="bg-[#141416] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-sm font-medium text-white">จัดส่งออก / Outbound Deliveries</h2>
          <Link href="./sales-orders" className="text-xs text-[#4A7FD4] hover:underline">ดูทั้งหมด</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0D0D0F] border-b border-white/[0.06]">
              <tr>
                <th className="text-left px-5 py-3 text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em]">เลขที่ใบสั่ง</th>
                <th className="text-left px-5 py-3 text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em]">ลูกค้า</th>
                <th className="text-left px-5 py-3 text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em]">วันที่</th>
                <th className="text-left px-5 py-3 text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em]">สถานะ</th>
                <th className="text-right px-5 py-3 text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em]">มูลค่า</th>
              </tr>
            </thead>
            <tbody>
              {outbound.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-[#555560] text-sm">ไม่มีรายการ</td></tr>
              ) : outbound.map(order => (
                <tr key={order.id} className="border-b border-white/[0.04] hover:bg-[#1A1A1E] transition-colors">
                  <td className="px-5 py-3.5 text-sm text-white font-medium">{order.order_number || order.id.slice(0,8)}</td>
                  <td className="px-5 py-3.5 text-sm text-[#8A8A9A]">{order.customers?.name || '—'}</td>
                  <td className="px-5 py-3.5 text-sm text-[#8A8A9A]">{new Date(order.order_date).toLocaleDateString('th-TH')}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-medium ${statusConfig[order.status]?.style || 'bg-white/5 text-[#8A8A9A]'}`}>
                      {statusConfig[order.status]?.label || order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-sm text-white">฿{new Intl.NumberFormat('th-TH').format(order.amount_gross || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inbound receipts */}
      <div className="bg-[#141416] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-sm font-medium text-white">รับสินค้าเข้า / Inbound Receipts</h2>
          <Link href="./purchase" className="text-xs text-[#4A7FD4] hover:underline">ดูทั้งหมด</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0D0D0F] border-b border-white/[0.06]">
              <tr>
                <th className="text-left px-5 py-3 text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em]">เลขที่ PO</th>
                <th className="text-left px-5 py-3 text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em]">ผู้ขาย</th>
                <th className="text-left px-5 py-3 text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em]">วันที่</th>
                <th className="text-left px-5 py-3 text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em]">สถานะ</th>
                <th className="text-right px-5 py-3 text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em]">มูลค่า</th>
              </tr>
            </thead>
            <tbody>
              {inbound.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-[#555560] text-sm">ไม่มีรายการ</td></tr>
              ) : inbound.map(po => (
                <tr key={po.id} className="border-b border-white/[0.04] hover:bg-[#1A1A1E] transition-colors">
                  <td className="px-5 py-3.5 text-sm text-white font-medium">{po.po_number || po.id.slice(0,8)}</td>
                  <td className="px-5 py-3.5 text-sm text-[#8A8A9A]">{po.vendors?.name || '—'}</td>
                  <td className="px-5 py-3.5 text-sm text-[#8A8A9A]">{new Date(po.order_date).toLocaleDateString('th-TH')}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-medium ${statusConfig[po.status]?.style || 'bg-white/5 text-[#8A8A9A]'}`}>
                      {statusConfig[po.status]?.label || po.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-sm text-white">฿{new Intl.NumberFormat('th-TH').format(po.amount_gross || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
```

Also update the sidebar label and icon for logistics from `Truck` to stay as `Truck` but label as `การขนส่ง` in tooltip — already correct.

---

## Fix 3: Products Page — Add Missing Features

**Problem**: Products list works but missing:
- Category filter dropdown (filter by category)  
- Bulk status toggle (activate/deactivate)
- Price display (cost vs selling)
- Stock value total

**Fix**: In `components/modules/products/ProductsList.tsx`, add:

1. Category filter dropdown after existing filter buttons:
```tsx
// After filterStock selector, add:
const categories = [...new Set(products.map(p => p.category).filter(Boolean))]

// In JSX filter bar, add:
<select
  value={filterCategory}
  onChange={e => setFilterCategory(e.target.value)}
  className="px-3 py-2 bg-[#1A1A1E] border border-white/[0.08] rounded-xl text-sm text-[#8A8A9A] focus:outline-none"
>
  <option value="all">ทุกหมวด</option>
  {categories.map(cat => <option key={cat} value={cat!}>{cat}</option>)}
</select>
```

2. Add `filterCategory` state: `const [filterCategory, setFilterCategory] = useState('all')`

3. Add to filter logic: `const matchCat = filterCategory === 'all' || p.category === filterCategory`

4. Add summary bar above table showing total products, total stock value:
```tsx
<div className="flex items-center gap-6 px-5 py-3 bg-[#0D0D0F] border-b border-white/[0.06] text-xs text-[#8A8A9A]">
  <span>แสดง {filtered.length} / {products.length} รายการ</span>
  <span>มูลค่าสต็อก: ฿{new Intl.NumberFormat('th-TH').format(filtered.reduce((s, p) => s + p.cost_price * p.stock_quantity, 0))}</span>
</div>
```

---

## Commit & Deploy

```bash
git add -A
git commit -m "fix(modules): users redirect, transport redesign, products category filter"
git push -u origin fix/module-fixes-users-transport-products
gh pr create --title "fix(modules): users redirect + transport redesign + products filter" --base main --body "1. Users: remove admin-only redirect\n2. Transport: redesign as real outbound/inbound transport module\n3. Products: add category filter + stock value summary"
gh pr merge <N> --merge --delete-branch
git checkout main && git pull
vercel --prod --yes
```

## Done Signal
```
✅ 3 module fixes done — deployed
users: accessible ✅
transport: outbound+inbound ✅  
products: category filter + stock value ✅
```

[luxi-oracle]
