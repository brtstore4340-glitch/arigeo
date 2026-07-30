# ARIGEO Project — Thai Localization Specification

**Requested by**: พี่เอก (Ekkarat)  
**For**: Khun-Ram (Documentation · Thai Language Authority)  
**Date**: 2026-07-28  
**Status**: Ready for Thai Version Implementation

---

## Executive Summary

Create a complete Thai-language version of the ARIGEO ERP project (ORRY Serenity). This includes:

- ✅ Main dashboard (Thai UI)
- ✅ Navigation menu (Thai labels)
- ✅ All admin screens (Thai content)
- ✅ Data tables (Thai headers)
- ✅ Forms & dialogs (Thai labels + help text)
- ✅ Error messages (Thai translation)
- ✅ Documentation (Thai guides)

---

## Project Overview

**ARIGEO Project**: ORRY Serenity ERP (Oracle: Dheva)  
**Current Language**: English  
**Target**: Full Thai support  
**Scope**: Admin dashboard + all features

---

## Scope: Thai Translation Package

### 1. Main Navigation Menu

**Menu Items to Translate**:
```
Dashboard → แดชบอร์ด
Products → สินค้า
Inventory → คลังสินค้า
Orders → คำสั่งซื้อ
Customers → ลูกค้า
Reports → รายงาน
Settings → การตั้งค่า
Users → ผู้ใช้งาน
```

### 2. Dashboard Sections

**Key Screens**:
```
Overview → ภาพรวม
Sales Metrics → เมตริกการขาย
Inventory Status → สถานะคลังสินค้า
Recent Orders → คำสั่งซื้อล่าสุด
Top Products → สินค้ายอดนิยม
Customer Analytics → วิเคราะห์ลูกค้า
```

### 3. Data Tables

**Table Headers & Labels**:
```
Product Name → ชื่อสินค้า
SKU → รหัสสินค้า
Price → ราคา
Stock Quantity → จำนวนคลัง
Status → สถานะ
Date Created → วันที่สร้าง
Last Modified → แก้ไขล่าสุด
Action → การกระทำ
```

### 4. Forms & Dialogs

**Common Form Fields**:
```
Full Name → ชื่อ-สกุล
Email Address → ที่อยู่อีเมล
Phone Number → เบอร์โทรศัพท์
Address → ที่อยู่
City → เมือง
Province → จังหวัด
Postal Code → รหัสไปรษณีย์
Country → ประเทศ
Notes → หมายเหตุ
```

### 5. Buttons & Actions

**Standard Actions**:
```
Save → บันทึก
Cancel → ยกเลิก
Delete → ลบ
Edit → แก้ไข
Add New → เพิ่มใหม่
Search → ค้นหา
Filter → กรอง
Export → ส่งออก
Import → นำเข้า
Close → ปิด
OK → ตกลง
```

### 6. Status Messages

**System Messages**:
```
Loading → กำลังโหลด
Saving → กำลังบันทึก
Saved Successfully → บันทึกเรียบร้อยแล้ว
Error Occurred → เกิดข้อผิดพลาด
Confirmation Required → ต้องการยืนยัน
Are you sure? → แน่ใจหรือ?
Yes → ใช่
No → ไม่
```

### 7. Error Messages

**Common Errors**:
```
Invalid Input → ข้อมูลไม่ถูกต้อง
Required Field → จำเป็นต้องกรอก
Duplicate Entry → ข้อมูลซ้ำ
Access Denied → ไม่มีสิทธิ์
Not Found → ไม่พบ
Server Error → เกิดข้อผิดพลาดจากเซิร์ฟเวอร์
Connection Failed → การเชื่อมต่อล้มเหลว
```

### 8. Documentation

**Files to Create**:
- `docs/th/USER-GUIDE.md` — User manual (Thai)
- `docs/th/ADMIN-GUIDE.md` — Admin guide (Thai)
- `docs/th/REPORTS.md` — Reports guide (Thai)
- `docs/th/FAQ.md` — Frequently asked questions (Thai)
- `docs/th/TROUBLESHOOTING.md` — Troubleshooting (Thai)

---

## Implementation Details

### 1. Translation Keys Structure

```typescript
// src/locales/th.json
{
  "nav": {
    "dashboard": "แดชบอร์ด",
    "products": "สินค้า",
    "inventory": "คลังสินค้า",
    "orders": "คำสั่งซื้อ",
    ...
  },
  "dashboard": {
    "overview": "ภาพรวม",
    "salesMetrics": "เมตริกการขาย",
    "inventoryStatus": "สถานะคลังสินค้า",
    ...
  },
  "tables": {
    "productName": "ชื่อสินค้า",
    "sku": "รหัสสินค้า",
    "price": "ราคา",
    ...
  },
  "forms": {
    "fullName": "ชื่อ-สกุล",
    "email": "ที่อยู่อีเมล",
    ...
  },
  "messages": {
    "saved": "บันทึกเรียบร้อยแล้ว",
    "error": "เกิดข้อผิดพลาด",
    ...
  }
}
```

### 2. Number & Currency Formatting

```typescript
// Thai currency format
const formatter = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  minimumFractionDigits: 2
})

// Examples:
// 1000 → ฿1,000.00
// 50000 → ฿50,000.00
```

### 3. Date & Time Formatting

```typescript
// Thai date format (DD/MM/YYYY)
const dateFormatter = new Intl.DateTimeFormat('th-TH', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
})

// Examples:
// 2026-07-28 → 28/07/2569 (Thai Buddhist calendar)
// Or: 28/07/2026 (Western calendar, recommended for business)
```

### 4. Language Toggle

```typescript
interface LocaleSettings {
  current: 'en' | 'th'
  available: ['en', 'th']
}

// User preference
localStorage.setItem('locale', 'th')
```

---

## Deliverables Checklist

### Phase 1: Core Translation
- [ ] Translation keys file (`src/locales/th.json`)
- [ ] Navigation labels (8 items)
- [ ] Dashboard labels (20+ items)
- [ ] Table headers (15+ items)
- [ ] Form fields (20+ items)
- [ ] Button labels (15+ items)
- [ ] System messages (30+ items)
- [ ] Error messages (20+ items)

### Phase 2: Implementation
- [ ] i18n integration (next-i18next or similar)
- [ ] Language switcher component
- [ ] Thai font support (Tailwind config)
- [ ] Currency formatting (THB)
- [ ] Date formatting (Thai/Western calendar option)
- [ ] Number formatting (Thai locale)

### Phase 3: Data Localization
- [ ] Translate static content
- [ ] Localize all dropdown options
- [ ] Translate status values
- [ ] Translate product categories
- [ ] Translate unit names

### Phase 4: Documentation
- [ ] User guide (Thai)
- [ ] Admin guide (Thai)
- [ ] Reports guide (Thai)
- [ ] FAQ (Thai)
- [ ] Troubleshooting (Thai)

### Phase 5: Testing
- [ ] UI translation verification (all screens)
- [ ] Currency display (THB format)
- [ ] Date/time display
- [ ] Number formatting
- [ ] Font rendering (Thai text)
- [ ] Message display

---

## Thai Language Guidelines

### Typography
- **Font**: Sarabun (Google Fonts, Thai-optimized)
- **Fallback**: Noto Sans Thai
- **Size**: Slightly larger than English (Thai is denser)
- **Line height**: 1.8+ (Thai characters taller)

### Tone
- **Formal**: Admin messages, error messages, system notifications
- **Professional**: User guide, documentation
- **Casual**: Help text, tooltips

### Word Choices
- **Save** → "บันทึก" (standard)
- **Delete** → "ลบ" (standard)
- **Add** → "เพิ่ม" (standard)
- **Edit** → "แก้ไข" (standard)
- **Export** → "ส่งออก" (standard)
- **Import** → "นำเข้า" (standard)

### Calendar System
- **Western**: 28/07/2026 (recommended for business)
- **Thai Buddhist**: 28/07/2569 (optional cultural preference)

### Currency
- **Format**: ฿1,234.56
- **Symbol**: ฿ (Thai Baht)
- **Decimals**: 2 decimal places

---

## Resources & Reference

**Thai Language Guidelines**:
- Thai Unicode Standards
- Google Thai Fonts Guide
- Thai Business Writing Standards

**Translation Memory**:
- Any existing Thai strings in project
- ORRY Serenity documentation
- ERP terminology standards

**Tools**:
- next-i18next (recommended)
- react-i18next
- Thai spell checker

---

## Timeline Estimate

| Phase | Effort | Timeline |
|-------|--------|----------|
| **Phase 1** | 150+ strings → 3-4 days | Week 1 |
| **Phase 2** | Integration → 2-3 days | Week 2 |
| **Phase 3** | Data localization → 2-3 days | Week 2 |
| **Phase 4** | Docs → 3-4 days | Week 3 |
| **Phase 5** | QA → 2-3 days | Week 3 |
| **Total** | ~200 items + 5 docs | 4 weeks |

---

## Contact & Support

**Request Owner**: พี่เอก (Ekkarat)  
**Thai Language Authority**: Khun-Ram  
**Project**: ARIGEO (ORRY Serenity ERP)  
**Oracle**: Dheva

**Questions**:
- Should we use Thai Buddhist calendar or Western calendar?
- Thai numerals (๐๑๒๓) or English numerals (0123)?
- Any existing ARIGEO Thai terminology guide?
- Priority: Dashboard first or complete coverage?

---

## Related Projects

Also being localized:
- **cms-arigeo** — ARIGEO CMS + Builder V2 (3 weeks)
- **arigeo-project** — ARIGEO ERP System (4 weeks)

**Coordination**: Both projects use similar i18n infrastructure

---

**Version**: 1.0  
**Status**: Ready for Khun-Ram Review & Implementation  
**Date**: 2026-07-28
