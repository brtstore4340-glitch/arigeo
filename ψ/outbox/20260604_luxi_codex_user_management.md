---
from: luxi-oracle
to: codex (luxi-dashboard-redesign pane)
date: 2026-06-04
subject: Full User Management — Admin-only create, roles, edit, archive
priority: high
---

# User Management System

## Overview

Build a complete user management system for orry-serenity ERP:
- Admin creates users (no self-register)
- 3 roles: Admin, Management, Staff
- Actions: Add, Edit, Archive
- Edit: personal detail, email, password (admin reset)

---

## Branch
```bash
cd orry-serenity
git checkout main && git pull
git checkout -b feat/user-management
```

---

## Database Context

Existing tables (already in schema):
```sql
roles (id, company_id, code, name, description, is_system_role, is_active)
users (id, email, phone, company_id, branch_id, role_id, first_name, last_name, is_active)
```

---

## Step 1: Seed Roles via Supabase Migration

Create `supabase/migrations/20260604000001_seed_system_roles.sql`:
```sql
-- Seed system roles for all existing companies
INSERT INTO roles (company_id, code, name, description, is_system_role, is_active)
SELECT 
  c.id,
  r.code,
  r.name,
  r.description,
  TRUE,
  TRUE
FROM companies c
CROSS JOIN (VALUES
  ('admin',      'ผู้ดูแลระบบ',    'Full access to all modules and settings'),
  ('management', 'ผู้จัดการ',       'Access to reports, approvals, and operations'),
  ('staff',      'พนักงาน',         'Access to daily operations only')
) AS r(code, name, description)
ON CONFLICT (company_id, code) DO NOTHING;
```

Run: `npx supabase db push` or apply manually via Supabase SQL editor.

---

## Step 2: API Routes (4 routes, all use SUPABASE_SERVICE_ROLE_KEY)

### `app/api/admin/users/route.ts` — GET list + POST create

```ts
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const adminClient = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// GET — list all users with role info
export async function GET() {
  const supabase = adminClient()
  const { data, error } = await supabase
    .from('users')
    .select(`
      id, email, phone, first_name, last_name, is_active, created_at, last_login,
      roles(id, code, name)
    `)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ users: data })
}

// POST — create new user (admin only, no self-register)
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, password, first_name, last_name, phone, role_id, company_id } = body

  if (!email || !password || !company_id) {
    return NextResponse.json({ error: 'email, password, company_id required' }, { status: 400 })
  }

  const admin = adminClient()

  // 1. Create auth user
  const { data: authUser, error: authErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // skip email confirmation
  })
  if (authErr) return NextResponse.json({ error: authErr.message }, { status: 400 })

  // 2. Insert into users table
  const { error: dbErr } = await admin.from('users').insert({
    id: authUser.user.id,
    email,
    phone: phone || null,
    first_name: first_name || null,
    last_name: last_name || null,
    company_id,
    role_id: role_id || null,
    is_active: true,
  })

  if (dbErr) {
    // Rollback: delete auth user
    await admin.auth.admin.deleteUser(authUser.user.id)
    return NextResponse.json({ error: dbErr.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, user_id: authUser.user.id })
}
```

### `app/api/admin/users/[id]/route.ts` — PATCH edit + DELETE archive

```ts
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const adminClient = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// PATCH — edit user (personal detail, email, role, password)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const body = await req.json()
  const { first_name, last_name, phone, email, role_id, password } = body

  const admin = adminClient()

  // Update auth user (email / password)
  const authUpdates: Record<string, string> = {}
  if (email) authUpdates.email = email
  if (password) authUpdates.password = password
  if (Object.keys(authUpdates).length > 0) {
    const { error } = await admin.auth.admin.updateUserById(id, authUpdates)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Update users table
  const dbUpdates: Record<string, any> = {}
  if (first_name !== undefined) dbUpdates.first_name = first_name
  if (last_name !== undefined) dbUpdates.last_name = last_name
  if (phone !== undefined) dbUpdates.phone = phone
  if (email !== undefined) dbUpdates.email = email
  if (role_id !== undefined) dbUpdates.role_id = role_id

  if (Object.keys(dbUpdates).length > 0) {
    const { error } = await admin.from('users').update(dbUpdates).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}

// DELETE — archive user (soft delete: is_active=false + ban in auth)
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const admin = adminClient()

  // Ban in auth (prevents login)
  await admin.auth.admin.updateUserById(id, { ban_duration: '876000h' }) // ~100 years

  // Soft delete in users table
  const { error } = await admin.from('users').update({ is_active: false }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ success: true })
}
```

---

## Step 3: Users List Page

Replace `app/[locale]/(app)/users/page.tsx` entirely:

```tsx
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { createClient as serverClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

const roleColor: Record<string, string> = {
  admin:      'bg-[#E05C5C]/10 text-[#E05C5C] border border-[#E05C5C]/20',
  management: 'bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20',
  staff:      'bg-[#4A7FD4]/10 text-[#4A7FD4] border border-[#4A7FD4]/20',
}

export default async function UsersPage() {
  const supabase = await serverClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch users + roles from DB
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: users = [] } = await admin
    .from('users')
    .select('id, email, phone, first_name, last_name, is_active, created_at, roles(id, code, name)')
    .order('created_at', { ascending: false })

  const activeCount = users?.filter((u: any) => u.is_active).length ?? 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-light text-white tracking-tight">User Management</h1>
          <p className="text-[#555560] text-xs uppercase tracking-[0.10em] mt-1">จัดการผู้ใช้งาน — Admin creates users only</p>
        </div>
        <Link
          href="./users/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#4A7FD4] hover:bg-[#5A8FE4] text-white text-sm font-medium rounded-xl transition-all"
        >
          + เพิ่มผู้ใช้
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#141416] border border-white/[0.06] rounded-2xl p-5">
          <p className="text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em] mb-2">ผู้ใช้ทั้งหมด</p>
          <p className="text-2xl font-light text-white">{users?.length ?? 0}</p>
        </div>
        <div className="bg-[#141416] border border-white/[0.06] rounded-2xl p-5">
          <p className="text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em] mb-2">Active</p>
          <p className="text-2xl font-light text-[#00BFA5]">{activeCount}</p>
        </div>
        <div className="bg-[#141416] border border-white/[0.06] rounded-2xl p-5">
          <p className="text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em] mb-2">Archived</p>
          <p className="text-2xl font-light text-[#555560]">{(users?.length ?? 0) - activeCount}</p>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-[#141416] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-medium text-white">ผู้ใช้งานทั้งหมด</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0D0D0F] border-b border-white/[0.06]">
              <tr>
                <th className="text-left px-5 py-3 text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em]">ชื่อ / Email</th>
                <th className="text-left px-5 py-3 text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em]">Role</th>
                <th className="text-left px-5 py-3 text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em]">เบอร์โทร</th>
                <th className="text-left px-5 py-3 text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em]">สถานะ</th>
                <th className="text-right px-5 py-3 text-[10px] font-medium text-[#555560] uppercase tracking-[0.12em]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!users || users.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-[#555560] text-sm">ยังไม่มีผู้ใช้</td></tr>
              ) : users.map((u: any) => (
                <tr key={u.id} className={`border-b border-white/[0.04] transition-colors ${u.is_active ? 'hover:bg-[#1A1A1E]' : 'opacity-50'}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/20 flex items-center justify-center text-xs text-[#C9A84C] font-medium flex-shrink-0">
                        {(u.first_name || u.email).charAt(0).toUpperCase()}
                      </span>
                      <div>
                        {(u.first_name || u.last_name) && (
                          <p className="text-sm text-white">{[u.first_name, u.last_name].filter(Boolean).join(' ')}</p>
                        )}
                        <p className="text-xs text-[#8A8A9A]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {u.roles ? (
                      <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-medium ${roleColor[u.roles.code] || 'bg-white/5 text-[#8A8A9A]'}`}>
                        {u.roles.name}
                      </span>
                    ) : <span className="text-[#555560] text-xs">—</span>}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#8A8A9A]">{u.phone || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium ${u.is_active ? 'bg-[#00BFA5]/10 text-[#00BFA5] border border-[#00BFA5]/20' : 'bg-white/5 text-[#555560]'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-[#00BFA5]' : 'bg-[#555560]'}`} />
                      {u.is_active ? 'Active' : 'Archived'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href={`./users/${u.id}/edit`} className="text-xs text-[#4A7FD4] hover:underline mr-3">แก้ไข</Link>
                  </td>
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

---

## Step 4: Create User Page

Create `app/[locale]/(app)/users/new/page.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function NewUserPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string || 'th'

  const [form, setForm] = useState({
    email: '', password: '', first_name: '', last_name: '',
    phone: '', role_code: 'staff',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const roleOptions = [
    { code: 'admin',      label: 'ผู้ดูแลระบบ (Admin)' },
    { code: 'management', label: 'ผู้จัดการ (Management)' },
    { code: 'staff',      label: 'พนักงาน (Staff)' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Get company_id + role_id first
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          company_id: '00000000-0000-0000-0000-000000000001', // TODO: get from session
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create user')
      router.push(`/${locale}/users`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-light text-white tracking-tight">เพิ่มผู้ใช้ใหม่</h1>
        <p className="text-[#555560] text-xs uppercase tracking-[0.10em] mt-1">Create User — Admin only</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#141416] border border-white/[0.06] rounded-2xl p-6 space-y-5">
        {error && (
          <div className="bg-[#E05C5C]/10 border border-[#E05C5C]/20 rounded-xl p-3 text-sm text-[#E05C5C]">{error}</div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-[#555560] uppercase tracking-[0.10em]">ชื่อ</label>
            <input value={form.first_name} onChange={e => setForm(f => ({...f, first_name: e.target.value}))}
              className="w-full px-4 py-2.5 bg-[#1A1A1E] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-[#555560] focus:outline-none focus:border-[#4A7FD4]/50"
              placeholder="ชื่อจริง" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-[#555560] uppercase tracking-[0.10em]">นามสกุล</label>
            <input value={form.last_name} onChange={e => setForm(f => ({...f, last_name: e.target.value}))}
              className="w-full px-4 py-2.5 bg-[#1A1A1E] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-[#555560] focus:outline-none focus:border-[#4A7FD4]/50"
              placeholder="นามสกุล" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-[#555560] uppercase tracking-[0.10em]">Email *</label>
          <input type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
            className="w-full px-4 py-2.5 bg-[#1A1A1E] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-[#555560] focus:outline-none focus:border-[#4A7FD4]/50"
            placeholder="email@company.com" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-[#555560] uppercase tracking-[0.10em]">รหัสผ่าน *</label>
          <input type="password" required minLength={8} value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))}
            className="w-full px-4 py-2.5 bg-[#1A1A1E] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-[#555560] focus:outline-none focus:border-[#4A7FD4]/50"
            placeholder="อย่างน้อย 8 ตัวอักษร" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-[#555560] uppercase tracking-[0.10em]">เบอร์โทรศัพท์</label>
          <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
            className="w-full px-4 py-2.5 bg-[#1A1A1E] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-[#555560] focus:outline-none focus:border-[#4A7FD4]/50"
            placeholder="0812345678" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-[#555560] uppercase tracking-[0.10em]">Role *</label>
          <select required value={form.role_code} onChange={e => setForm(f => ({...f, role_code: e.target.value}))}
            className="w-full px-4 py-2.5 bg-[#1A1A1E] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-[#4A7FD4]/50">
            {roleOptions.map(r => <option key={r.code} value={r.code}>{r.label}</option>)}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 bg-[#4A7FD4] hover:bg-[#5A8FE4] text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50">
            {loading ? 'กำลังสร้าง...' : 'สร้างผู้ใช้'}
          </button>
          <a href={`/${locale}/users`}
            className="px-6 py-2.5 bg-[#1C1C20] hover:bg-[#242428] text-[#8A8A9A] hover:text-white text-sm font-medium rounded-xl transition-all border border-white/[0.06]">
            ยกเลิก
          </a>
        </div>
      </form>
    </div>
  )
}
```

---

## Step 5: Edit User Page

Create `app/[locale]/(app)/users/[id]/edit/page.tsx`:

```tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string || 'th'
  const userId = params.id as string

  const [tab, setTab] = useState<'detail' | 'password'>('detail')
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', role_code: 'staff' })
  const [passwordForm, setPasswordForm] = useState({ password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/users/${userId}`)
      .then(r => r.json())
      .then(d => {
        if (d.user) setForm({
          first_name: d.user.first_name || '',
          last_name: d.user.last_name || '',
          email: d.user.email || '',
          phone: d.user.phone || '',
          role_code: d.user.roles?.code || 'staff',
        })
      })
      .finally(() => setLoading(false))
  }, [userId])

  const roleOptions = [
    { code: 'admin',      label: 'ผู้ดูแลระบบ (Admin)' },
    { code: 'management', label: 'ผู้จัดการ (Management)' },
    { code: 'staff',      label: 'พนักงาน (Staff)' },
  ]

  const handleSaveDetail = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError(null); setSuccess(null)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      setSuccess('บันทึกสำเร็จ')
    } catch (err: any) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.password !== passwordForm.confirm) { setError('รหัสผ่านไม่ตรงกัน'); return }
    setSaving(true); setError(null); setSuccess(null)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordForm.password }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      setSuccess('เปลี่ยนรหัสผ่านสำเร็จ')
      setPasswordForm({ password: '', confirm: '' })
    } catch (err: any) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handleArchive = async () => {
    if (!confirm('Archive user นี้ใช่ไหม? User จะไม่สามารถ login ได้')) return
    setSaving(true)
    try {
      await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
      router.push(`/${locale}/users`)
    } catch (err: any) { setError(err.message); setSaving(false) }
  }

  const inputClass = "w-full px-4 py-2.5 bg-[#1A1A1E] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-[#555560] focus:outline-none focus:border-[#4A7FD4]/50"

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-light text-white tracking-tight">แก้ไขผู้ใช้</h1>
          <p className="text-[#555560] text-xs uppercase tracking-[0.10em] mt-1">Edit User</p>
        </div>
        <button onClick={handleArchive} disabled={saving}
          className="px-4 py-2 bg-[#E05C5C]/10 hover:bg-[#E05C5C]/20 text-[#E05C5C] text-sm rounded-xl border border-[#E05C5C]/20 transition-all disabled:opacity-50">
          Archive User
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#0D0D0F] rounded-xl p-1 w-fit">
        {[['detail', 'ข้อมูลส่วนตัว'], ['password', 'เปลี่ยนรหัสผ่าน']] .map(([key, label]) => (
          <button key={key} onClick={() => { setTab(key as any); setError(null); setSuccess(null) }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? 'bg-[#1C1C20] text-white' : 'text-[#555560] hover:text-white'}`}>
            {label}
          </button>
        ))}
      </div>

      {error && <div className="bg-[#E05C5C]/10 border border-[#E05C5C]/20 rounded-xl p-3 text-sm text-[#E05C5C]">{error}</div>}
      {success && <div className="bg-[#00BFA5]/10 border border-[#00BFA5]/20 rounded-xl p-3 text-sm text-[#00BFA5]">{success}</div>}

      {loading ? (
        <div className="bg-[#141416] border border-white/[0.06] rounded-2xl p-10 text-center text-[#555560] text-sm">กำลังโหลด...</div>
      ) : tab === 'detail' ? (
        <form onSubmit={handleSaveDetail} className="bg-[#141416] border border-white/[0.06] rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-[#555560] uppercase tracking-[0.10em]">ชื่อ</label>
              <input value={form.first_name} onChange={e => setForm(f => ({...f, first_name: e.target.value}))} className={inputClass} placeholder="ชื่อจริง" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-[#555560] uppercase tracking-[0.10em]">นามสกุล</label>
              <input value={form.last_name} onChange={e => setForm(f => ({...f, last_name: e.target.value}))} className={inputClass} placeholder="นามสกุล" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-[#555560] uppercase tracking-[0.10em]">Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-[#555560] uppercase tracking-[0.10em]">เบอร์โทร</label>
            <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} className={inputClass} placeholder="0812345678" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-[#555560] uppercase tracking-[0.10em]">Role</label>
            <select value={form.role_code} onChange={e => setForm(f => ({...f, role_code: e.target.value}))} className={inputClass}>
              {roleOptions.map(r => <option key={r.code} value={r.code}>{r.label}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#4A7FD4] hover:bg-[#5A8FE4] text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50">
              {saving ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
            <a href={`/${locale}/users`} className="px-6 py-2.5 bg-[#1C1C20] hover:bg-[#242428] text-[#8A8A9A] hover:text-white text-sm font-medium rounded-xl transition-all border border-white/[0.06]">ยกเลิก</a>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSavePassword} className="bg-[#141416] border border-white/[0.06] rounded-2xl p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-[#555560] uppercase tracking-[0.10em]">รหัสผ่านใหม่ *</label>
            <input type="password" required minLength={8} value={passwordForm.password} onChange={e => setPasswordForm(f => ({...f, password: e.target.value}))} className={inputClass} placeholder="อย่างน้อย 8 ตัวอักษร" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-[#555560] uppercase tracking-[0.10em]">ยืนยันรหัสผ่าน *</label>
            <input type="password" required value={passwordForm.confirm} onChange={e => setPasswordForm(f => ({...f, confirm: e.target.value}))} className={inputClass} placeholder="กรอกรหัสผ่านอีกครั้ง" />
          </div>
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#4A7FD4] hover:bg-[#5A8FE4] text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50">
            {saving ? 'กำลังบันทึก...' : 'เปลี่ยนรหัสผ่าน'}
          </button>
        </form>
      )}
    </div>
  )
}
```

---

## Step 6: GET single user API route

Add to `app/api/admin/users/[id]/route.ts` (GET method):
```ts
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = adminClient()
  const { data, error } = await admin
    .from('users')
    .select('id, email, phone, first_name, last_name, is_active, roles(id, code, name)')
    .eq('id', params.id)
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ user: data })
}
```

---

## Files to create/modify

| File | Action |
|---|---|
| `supabase/migrations/20260604000001_seed_system_roles.sql` | CREATE |
| `app/api/admin/users/route.ts` | CREATE |
| `app/api/admin/users/[id]/route.ts` | CREATE |
| `app/[locale]/(app)/users/page.tsx` | REPLACE |
| `app/[locale]/(app)/users/new/page.tsx` | CREATE |
| `app/[locale]/(app)/users/[id]/edit/page.tsx` | CREATE |

---

## Commit & Deploy

```bash
git add -A
git commit -m "feat(users): full user management — roles, create, edit, archive, password reset"
git push -u origin feat/user-management
gh pr create --title "feat(users): admin-only user management with roles" --base main --body "Full user management: Admin/Management/Staff roles, create/edit/archive users, password reset. No self-register."
gh pr merge <N> --merge --delete-branch
git checkout main && git pull
vercel --prod --yes
```

## Done Signal
```
✅ user management done — deployed
routes: /users, /users/new, /users/[id]/edit ✅
API: GET/POST /api/admin/users, GET/PATCH/DELETE /api/admin/users/[id] ✅
roles seeded ✅
```

[luxi-oracle]
