# ARIGEO Corporate Website — Implementation Handoff

แพ็กเกจนี้สร้างจาก source ZIP ที่ส่งมา และเป็นฐานโค้ดสำหรับพัฒนาให้ตรงกับ:

1. `handoff/references/target-red-circle.png` — visual target หลัก
2. `handoff/references/Arigeo-Brief.pptx` — business/content/UX scope หลัก
3. `handoff/references/current-deployed-2026-07-16.png` — deployed page ปัจจุบันเพื่อเทียบความต่าง

## Start here

อ่านตามลำดับ:

1. `DIFF.md`
2. `todo.md`
3. `HANDOFF.md`
4. `handoff/ACCEPTANCE_CRITERIA.md`
5. `handoff/CMS_CONTENT_MODEL.md`
6. `handoff/ASSET_MANIFEST.md`
7. `handoff/QA_CHECKLIST.md`

## Mandatory architecture rule

**ห้ามใช้หรือเพิ่ม Base44 กลับเข้ามาในโปรเจกต์นี้**

แพ็กเกจ handoff นี้ลบรายการต่อไปนี้แล้ว:

- Base44 SDK และ Vite plugin
- Base44 config directory และ client stub
- Base44 environment/app parameter code
- Auth gate และหน้า login/register/reset ที่ผูกกับ Base44
- Base44 legacy documentation และ export metadata

ผู้พัฒนาต้องคง frontend ให้เป็น React + Vite แบบอิสระ และเชื่อม Payload CMS ผ่าน API ที่กำหนดใหม่เท่านั้น

## Baseline status

- Frontend: React 18 + Vite + Tailwind CSS
- Public homepage เปิดโดยไม่ผ่าน authentication gate
- Base44 runtime/config/dependencies ถูกลบจาก handoff baseline แล้ว
- Source ZIP ไม่มี local image assets; รูปปัจจุบันยังอ้างอิง remote URLs
- ยังต้องรัน clean install, lint, typecheck และ production build ใน environment ของผู้พัฒนา

## Non-negotiable target

- Desktop homepage ต้องยึดภาพ `target-red-circle.png` เป็น visual source of truth
- Brand identity: ARIGEO white / red / black; ใช้ soft neutral และ green เป็นเพียง cue รอง
- IA/UX inspired by Kao Global แต่ห้ามทำให้ ARIGEO สูญเสีย brand identity
- ระบบต้องรองรับ TH/EN, product/category discovery, SEO, forms, analytics และ Payload CMS
- Public corporate pages ห้ามถูกบังคับ login
- ห้ามเพิ่ม Base44 dependency, import, config, env variable, API call หรือ deployment workflow กลับมา

## First validation commands

```bash
npm install
npm run lint
npm run typecheck
npm run build
npm run dev
```

ห้ามเริ่มปรับ pixel UI ก่อนยืนยัน baseline build และ screenshot จาก source นี้
