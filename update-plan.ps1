$root = "D:\01 Main Work\Boots\Agentic AI\mission-control\arigeo-project"
$plan = Get-Content "$root\REDESIGN-PLAN.md" -Raw

# ---- แทนที่ข้อ 1: content decision ----
$old1 = $plan -match '(?s)(## 1\. CONTENT DECISION.*?)(?=## 2\. STATE MAP)'
$oldBlock = $Matches[1]
$newBlock = @"
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

"@
$plan = $plan.Replace($oldBlock, $newBlock)

# ---- แก้ 4.3 และ 4.4 ที่เคยชี้ไปเนื้อหาธุรกิจเดิม ----
$plan = $plan -replace "— เนื้อหาตาม CONTENT DECISION ข้อ 1", "— copy ตาม ref: Household = `"Smart solutions for a clean, safe and comfortable home`" / Skincare = `"Thoughtfully formulated skincare for healthy, beautiful skin`" + แปลไทย"
$plan = $plan -replace "— เนื้อหา map จาก WhyChoose keys ที่มีอยู่ \(เลือก 3 จาก 4\)", "— เนื้อหาตาม ref: Innovation for Better Living / Sustainability for the Future / Safety & Quality You Can Trust (สร้าง Values keys ใหม่ ไม่ใช้ WhyChoose เดิม)"

# ---- เพิ่มบันทึกท้ายไฟล์ ----
$plan += @"

---
## DECISION LOG
- 15/7/2026: Content = full brief (household & skincare FMCG). เนื้อหายา/เกษตรเดิม
  ย้ายเข้า _legacy ทั้ง messages และ components ที่ไม่ได้ใช้ต่อ
- 15/7/2026: Vercel token ที่ใช้กู้ไฟล์ถูก revoke แล้ว
- ค้างตัดสิน: สีแดงหลัก — คง #d32f2f หรือปรับเป็นโทนสดตาม ref (~#E60013)
  → agent เสนอเทียบ 2 ตัวเลือกบน Hero จริงให้ Ekkarat เลือกก่อน apply ทั้งเว็บ
"@

$plan | Set-Content -Encoding UTF8 "$root\REDESIGN-PLAN.md"
Write-Host "REDESIGN-PLAN.md updated" -ForegroundColor Green
