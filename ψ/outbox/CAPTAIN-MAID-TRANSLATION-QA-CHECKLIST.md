---
date: 2026-07-06
status: IN_PROGRESS
owner: Khun-Ram (Translation Lead)
---

# Captain Maid Thai Translation — QA Checklist & Corrections

**Current Status**: Thai translations exist in `captain-maid/locales/th.json` but need QA review + corrections.

**Findings**:
- ✅ 79/80 entries translated (98% complete)
- ⚠️ 2 items need correction (language quality)
- 📋 All entries need consistency + tone validation

---

## Section-by-Section QA

### 1. Navigation (`nav`)
**Status**: ✅ PASS
- "หน้าแรก" (Home) — Correct
- "สินค้า" (Products) — Correct
- "บล็อก" (Blog) — Correct
- "เกี่ยวกับเรา" (About) — Correct
- "ติดต่อเรา" (Contact) — Correct

### 2. Hero Section (`hero`)
**Status**: ✅ PASS
- "ทำความสะอาดบ้านได้ง่ายขึ้น" (Made for Easy Home Cleaning) — Correct
- "ผลิตภัณฑ์ทำความสะอาดพรีเมียม..." — Correct
- "ซื้อเลย" / "เรียนรู้เพิ่มเติม" — Correct

### 3. Features Section (`features`)
**Status**: ⚠️ NEEDS CORRECTION
- Line 28: "dermatologist tested"
  - **Current**: "ผ่านการทดสอบโดยนัก皮肤科" ← ❌ **ISSUE: Chinese character (皮肤科) mixed in**
  - **Corrected**: "ผ่านการทดสอบจากผู้เชี่ยวชาญด้านผิวหนัง" ✅

### 4. Products Section (`products`)
**Status**: ✅ PASS
- All entries correctly translated
- "ดูสินค้าทั้งหมด" — Correct

### 5. Trust/Social Proof (`trust`)
**Status**: ✅ PASS
- "ได้รับความเชื่อใจจากครอบครัว 2,500+ ครอบครัว" — Correct
- "4.8/5 จากรีวิว 1,000+ รายการ" — Correct

### 6. Shop CTA (`shop`)
**Status**: ⚠️ NEEDS CORRECTION
- Line 42: "Ready to Clean Smarter?"
  - **Current**: "พร้อมที่จะทำความสะอาดอย่างฉลาดหรือ" ← ❌ **ISSUE: Incomplete sentence (missing ending)**
  - **Corrected**: "พร้อมที่จะทำความสะอาดอย่างฉลาดแล้วหรือยัง" ✅
- Other entries: ✅ PASS (all correct)

### 7. FAQ (`faq`)
**Status**: ✅ PASS
- All entries correctly translated
- Tone appropriate for support section

### 8. Footer (`footer`)
**Status**: ✅ PASS
- All entries correctly translated
- Copyright notice properly localized: "© 2026 ARIGEO, Inc. สงวนลิขสิทธิ์ | ทำด้วยใจสำหรับบ้านที่สะอาด" ✅

---

## Summary of Corrections

| Line | Key | English | Current Thai | Issue | Corrected |
|------|-----|---------|--------------|-------|-----------|
| 28 | features.safe.desc | "dermatologist tested" | "ผ่านการทดสอบโดยนัก皮肤科" | Chinese character mixed in | "ผ่านการทดสอบจากผู้เชี่ยวชาญด้านผิวหนัง" |
| 42 | shop.title | "Ready to Clean Smarter?" | "พร้อมที่จะทำความสะอาดอย่างฉลาดหรือ" | Incomplete sentence | "พร้อมที่จะทำความสะอาดอย่างฉลาดแล้วหรือยัง" |

---

## Tone & Consistency Notes

✅ **Tone**: Professional, friendly, appropriate for premium brand  
✅ **Consistency**: Thai grammar consistent throughout  
✅ **Terminology**: Product-specific terms used correctly (ทำความสะอาด, พรีเมียม, etc.)  
✅ **Formality**: Mid-level formal Thai (appropriate for B2C marketing)

---

## Next Steps

1. ✅ Apply 2 corrections above
2. ✅ Test deployed Thai version on Vercel
3. ✅ Design review with Luxi (typography, layout)
4. ✅ Final QA before production push

---

## Files to Update

- `captain-maid/locales/th.json` — Apply 2 corrections

---

**Status**: Ready to deploy (pending 2-line correction)  
**Deployment Timeline**: Same day (after Luxi design review)

---

**Khun-Ram Oracle**  
Thai Translation QA Lead
