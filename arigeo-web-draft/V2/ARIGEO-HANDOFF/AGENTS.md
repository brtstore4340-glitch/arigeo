# AGENTS.md — ARIGEO Handoff Contract

## Mission

พัฒนา source นี้ให้เป็น ARIGEO corporate website ตาม `handoff/references/target-red-circle.png` และ `handoff/references/Arigeo-Brief.pptx` โดยใช้ `DIFF.md` และ `todo.md` เป็น work order

## Required reading order

1. `README.md`
2. `DIFF.md`
3. `todo.md`
4. `HANDOFF.md`
5. เอกสารทั้งหมดใน `handoff/`

## Mandatory: Base44 must remain removed

- ห้ามติดตั้ง `@base44/sdk`, `@base44/vite-plugin` หรือ Base44 CLI
- ห้ามสร้าง `base44/`, `base44Client`, Base44 auth context หรือ `VITE_BASE44_*` variables
- ห้ามเรียก Base44 API, hosted backend, analytics, visual editor หรือ deployment workflow
- ห้ามนำ auth gate เดิมกลับมาครอบ public corporate routes
- ถ้าพบ Base44 reference ใน source/runtime ให้ลบและรายงาน changed files ทันที
- CMS ปลายทางคือ Payload CMS; frontend ต้องเชื่อมผ่าน explicit typed API boundary

## Hard rules

- Evidence-first: ห้ามเดาเมื่อมีไฟล์อ้างอิงจริง
- แก้เป็น batch เล็ก ย้อนกลับได้ และระบุ changed files ทุกครั้ง
- Performance > Readability > Speed
- ห้ามทำ public corporate site ให้ต้อง login
- ห้ามฝัง secrets หรือ service credentials ใน client
- ห้ามใช้ remote generated-image URL เป็น production source of truth
- ห้ามเปลี่ยน target composition หลักของ desktop mockupโดยไม่มีเหตุผลจาก brief
- ทุก batch ต้องผ่าน lint, typecheck และ build ก่อนส่งต่อ
- ระบุ root cause, blast radius และ regression checks สำหรับ bug fix

## Architecture direction

- Preserve React + Vite frontend initially
- Keep the public frontend vendor-independent
- Add Payload CMS as the launch-ready content system
- CMS integration must support TH/EN, preview/draft, SEO fields, brands, products, categories, news, banners and form routing
- Keep Vercel-compatible deployment boundaries

## Source-of-truth precedence

1. PPTX business requirements
2. Target red-circle mockup for homepage visual layout
3. `todo.md` acceptance criteria
4. Existing code only where it does not conflict with 1–3

## Completion report format

- Summary
- Changed files
- Root cause / decisions
- Validation evidence
- Remaining UNKNOWN items
- Rollback note
