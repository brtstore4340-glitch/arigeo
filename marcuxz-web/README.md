# Marcuxz Web - Premium Website & AI Automation

เว็บไซต์ Landing Page ระดับพรีเมียมสำหรับธุรกิจที่ต้องการเว็บไซต์ประสิทธิภาพสูง รองรับ SEO และพร้อมต่อยอดด้วยระบบ AI

## Tech Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Lucide React (Icons)
- Vercel Deployment

## วิธีการรันบนเครื่อง Local (How to run locally)

1. ติดตั้ง Dependencies:
   ```bash
   npm install
   ```

2. รัน Development Server:
   ```bash
   npm run dev
   ```

3. เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

## วิธีการ Deploy ขึ้น Vercel

โปรเจกต์นี้ถูกปรับแต่งให้พร้อมสำหรับการนำขึ้น Vercel ทันที

### ผ่าน Vercel CLI
1. ติดตั้ง Vercel CLI (ถ้ายังไม่มี):
   ```bash
   npm i -g vercel
   ```
2. ล็อกอินเข้า Vercel:
   ```bash
   vercel login
   ```
3. สั่ง Deploy Production:
   ```bash
   vercel --prod
   ```

### ผ่าน Vercel Dashboard (แนะนำ)
1. Push โค้ดชุดนี้ขึ้น GitHub / GitLab / Bitbucket
2. ล็อกอินเข้า [Vercel Dashboard](https://vercel.com/dashboard)
3. กดปุ่ม **"Add New..." > "Project"**
4. เลือก Repository ที่เพิ่ง push ขึ้นไป
5. Framework Preset จะถูกตั้งเป็น **Next.js** อัตโนมัติ
6. กดปุ่ม **"Deploy"** ระบบจะทำการ Build และ Deploy ให้ทันที

## SEO & Performance (สิ่งที่ทำแล้ว)
- **Core Web Vitals:** ใช้ CSS animations เบาๆ ไม่โหลด JS หนัก, Component ถูกแยกเป็น Server/Client ตามความเหมาะสม
- **SEO Metadata:** ตั้งค่า Title, Description, Open Graph, Twitter Cards อย่างครบถ้วนใน `app/layout.tsx` (พร้อมระบุ `metadataBase`)
- **JSON-LD Schema:** วางโครงสร้าง Schema สำหรับ LocalBusiness, WebSite และ FAQPage ใน `app/page.tsx`
- **Sitemap & Robots:** สร้าง `sitemap.ts` และ `robots.ts` เพื่อให้ Google Bot เข้าถึงได้ง่าย
- **Responsive:** รองรับ Mobile-first ดีไซน์สำหรับมือถือและแท็บเล็ต 100%
