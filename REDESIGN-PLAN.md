# ARIGEO Redesign Plan — Handoff Document
Target: ปรับ landing page ให้ตรง reference image (`picture/` หรือ arigeo_draft_web_01.png)
Repo: D:\01 Main Work\Boots\Agentic AI\mission-control\arigeo-project
Stack: Next.js 14.2.35 (App Router) + next-intl 4.13.1 + Tailwind 3.4 + lucide-react

---

## 0. CRITICAL HISTORY — อ่านก่อนแตะอะไร

- โปรเจกต์นี้**เพิ่งกู้คืนจาก Vercel deployment** หลัง source หายทั้งชุด (ไม่มี git มาก่อน)
- **ห้าม**: scaffold ใหม่, rewrite ทั้งไฟล์, ลบไฟล์ที่ไม่รู้จัก, รัน create-next-app
- **ต้อง**: commit ก่อนเริ่ม (ถ้ายังไม่มี git ให้ init + commit baseline ทันที), commit ทีละ section
- แก้ไฟล์แบบ targeted edit (str_replace) เท่านั้น
- Path มี `[locale]` — PowerShell ต้องใช้ `-LiteralPath` เสมอ ไม่งั้น `[ ]` โดนตีความเป็น wildcard
- `recovery/` และ `_claude-draft-components/` เป็น read-only reference ห้ามลบ

## 1. CONTENT DECISION (FINAL — ยืนยันโดย Ekkarat 15/7/2026)

**ตาม brief ทั้งหมด**: ARIGEO นำเสนอเป็นแบรนด์ household & skincare FMCG
ตาม reference image ทุกส่วน — ทั้ง layout และเนื้อหา copy

- Category cards = "Household" / "Skincare" ตาม ref ตรงๆ
- Copy อ้างอิงข้อความใน reference image เป็นหลัก (Elevating Everyday Life,
  Smart solutions..., Thoughtfully formulated... ฯลฯ) แล้วแปลไทยให้ครบคู่
- **messages เดิม (ยา/เกษตร) จะถูกแทนที่** — ก่อนเขียนทับ ให้ copy
  src/messages/en.json + th.json ไปเก็บที่ src/messages/_legacy/ แล้ว commit แยก
  (เนื้อหาธุรกิจเดิมอาจต้องใช้อ้างอิงภายหลัง ห้ามทิ้ง)
- Component เดิมที่ผูกกับเนื้อหายา/เกษตร (BusinessSection, QualitySection ฯลฯ)
  ถ้าไม่อยู่ใน section spec ของ ref ให้ย้ายเข้า _legacy/ ไม่ลบ
## 2. STATE MAP

- `src/app/[locale]/page.tsx` — ยังไม่ได้อ่าน (dump รอบก่อน fail เพราะ wildcard)
  **งานแรก: อ่านไฟล์นี้** เพื่อรู้ว่า render component ชุดไหน
- มี component ซ้ำซ้อน 2 ยุค:
  - `Hero.tsx` — ใช้ next-intl (useTranslations) ✔ pattern ที่ถูกต้อง แต่ visual เก่า (dark bg + Unsplash)
  - `HeroSection.tsx` — hardcode ภาษาไทย ✘ pattern ผิด แต่ layout ใกล้ ref กว่า
  - Header.tsx ปัจจุบัน hardcode ไทย ✘ ต้อง migrate เข้า useTranslations('Navigation') ซึ่ง key มีครบแล้วใน messages
- `_claude-draft-components/` มี HeroCarousel (a11y ครบ: reduced-motion, aria, pause-on-hover),
  NewsletterSection (validation + states) — **port ได้แต่ต้องแปลง**: hardcoded copy → t(),
  CSS vars → arigeo-* Tailwind tokens, next/link ตาม locale routing
- Assets จริงมีแล้ว: `public/images/domo/asset-*.png, img-*.png`, `public/images/logos/arigeo.png`

## 3. DESIGN TOKENS (แก้ใน tailwind.config.ts — extend ไม่ใช่แทนที่)

ปัจจุบัน: arigeo.red #d32f2f / darkred #b71c1c / black #111 / gray #424242 / light #fafafa
เพิ่มตาม ref:
- `arigeo.redtint: "#FDEBEC"` (พื้นหลัง badge/tag)
- `arigeo.surface: "#F7F7F5"` (section สลับ)
- ตัดสินใจสี red หลัก: ref ออกโทนสดกว่า (~#E60013) — เสนอ 2 ตัวเลือกให้ Ekkarat เลือก
  ก่อน apply ทั้งเว็บ ห้ามเปลี่ยนเองเงียบๆ
- Font ปัจจุบัน Kanit (โหลดผ่าน @import ใน globals.css) — **คงไว้** รองรับไทยดีอยู่แล้ว
  แต่ควรย้ายไป next/font/google เพื่อตัด render-blocking (งาน optional ท้ายลิสต์)

## 4. SECTION SPEC (เทียบ reference บน→ล่าง)

4.1 Header — พื้นขาว sticky (มี isScrolled logic แล้ว เก็บไว้), logo ซ้าย,
    nav กลาง (ใช้ Navigation keys จาก messages), ขวา: lang switcher TH/EN
    (ใช้ next-intl Link/useRouter สลับ locale — สำคัญ อย่าใช้ <a> ธรรมดา) + search icon (ทำ UI ก่อน ยังไม่ต้อง function)
4.2 Hero — พื้นขาว/light: ซ้าย = headline ดำ 2 บรรทัด + subline แดง + body + CTA แดง pill
    (+ secondary CTA), ขวา = product/hero image มีวงกลมแดงใหญ่ bleed ขอบขวาบน,
    dot indicators 3 จุดล่างซ้าย (carousel — port จาก _claude-draft-components/HeroCarousel ได้)
    ใช้รูปจาก /images/domo/ ก่อน
4.3 Category cards — 2 ใบใหญ่ radius โต รูปขวา เนื้อหาซ้าย + "Explore Products →" แดง
    + icon วงกลมมุมล่างซ้าย (ตาม ref) — copy ตาม ref: Household = "Smart solutions for a clean, safe and comfortable home" / Skincare = "Thoughtfully formulated skincare for healthy, beautiful skin" + แปลไทย
4.4 Values strip — แถวเดียว 3 คอลัมน์ icon เส้นแดง (lucide) + หัวข้อ + คำอธิบาย + arrow link,
    มีเส้นแบ่งแนวตั้งระหว่างคอลัมน์ — เนื้อหาตาม ref: Innovation for Better Living / Sustainability for the Future / Safety & Quality You Can Trust (สร้าง Values keys ใหม่ ไม่ใช้ WhyChoose เดิม)
4.5 News & Stories — หัว section ซ้าย + "View All News →" ขวา (key News.viewAll มีแล้ว),
    grid 4 ใบ: รูป / tag pill + วันที่ / title / arrow — News keys ใน messages มีแค่ headline1
    ต้องเพิ่ม structure เป็น array (tag, date, title) x4 ทั้ง en/th
4.6 Newsletter band — พื้นเทาอ่อน: หัวข้อ + คำอธิบายซ้าย, input email + ปุ่ม Subscribe แดงขวา
    (port จาก _claude-draft-components/NewsletterSection — ตัด fetch /api/newsletter ออกก่อน
    ให้เป็น success state จำลอง จนกว่าจะมี backend)
4.7 Footer — พื้นดำ: logo + คำอธิบาย + social icons ซ้าย, ลิงก์หลายคอลัมน์,
    bottom bar © + Terms/Privacy/Sitemap — Footer keys มีอยู่แล้ว ขยาย column structure ตาม ref

## 5. i18n RULES

- ห้าม hardcode ข้อความใน component — ทุกอย่างผ่าน useTranslations
- เพิ่ม key ต้องเพิ่ม **ทั้ง en.json และ th.json พร้อมกัน** (missing key = runtime error)
- โครง key ตาม section: Hero, Categories, Values, News, Newsletter, Footer, Navigation

## 6. WORKFLOW ต่อ 1 section

อ่านไฟล์จริง → แก้แบบ targeted → เพิ่ม messages ทั้ง 2 ภาษา → npm run dev เช็ค /th และ /en
→ เช็ค mobile (~390px) → commit "feat(section): ..." → ไป section ถัดไป
ลำดับแนะนำ: Header → Hero → Categories → Values → News → Newsletter → Footer
Component เก่าที่เลิกใช้ (เช่น HeroSection.tsx ถ้าแทนด้วย Hero ใหม่) — อย่าลบ ให้ย้ายเข้า
`src/components/_legacy/` แล้ว commit แยก

## 7. DEFINITION OF DONE

- ทุก section ตรง layout ตาม reference ที่ /th และ /en
- ไม่มี hardcoded copy, ไม่มี missing translation key ใน console
- Kanit ยังทำงานทั้งสองภาษา, ไม่มี CLS จากรูป (ใส่ width/height หรือ next/image)
- git log อ่านเป็นลำดับงานได้, baseline commit อยู่ล่างสุด

## 8. Ekkarat Decisions
- ทุกอย่างให้ตรงตาม breif ทั้งหมด
- **placeholder** — ธุรกิจจริงของ ARIGEO คือ "Household"/"Skincare"
- สี ตาม ref


---
## DECISION LOG
- 15/7/2026: Content = full brief (household & skincare FMCG). เนื้อหายา/เกษตรเดิม
  ย้ายเข้า _legacy ทั้ง messages และ components ที่ไม่ได้ใช้ต่อ
- 15/7/2026: Vercel token ที่ใช้กู้ไฟล์ถูก revoke แล้ว
- 15/7/2026: Palette FINAL — Brick Ember #D50306 (primary), #C50C15 (hover),
  Black #010101, Platinum #F3F3F4 (surface), White #FDFDFD (base)
  → apply แล้วใน tailwind.config.ts เป็น arigeo.* tokens ห้ามใช้ hex ตรงใน component
