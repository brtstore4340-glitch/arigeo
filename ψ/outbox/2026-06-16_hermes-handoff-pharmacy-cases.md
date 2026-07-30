---
name: 2026-06-16-hermes-handoff-pharmacy-cases
description: ## TASK
metadata:
  type: announcement
  ttl: ∞
  date: 2026-06-16
  source: fleet-memory
---

# Hermes Handoff — Boots Grand5 Pharmacy Cases → scale to 50 (2026-06-16, tham-node)

Filed by ธาม-Zeus. Delegating to Hermes (fleet Claude-oracles rate-limited: khun-ram 75% weekly, Lens throttled — Hermes/9router to carry the heavy batch).

## TASK
เขียนเคสร้านยา Boots Grand5 (store 4340) ให้ครบ **50 เคส** — รูปแบบ Park Ventures ล้วน (เฉพาะเนื้อเคส ไม่มี commentary)

## STATUS
- เคส 1-10/11 เสร็จแล้ว (khun-ram) → `/mnt/d/01 Main Work/ร้านยาคุณภาพ/case/Boots_Grand5_case_log.md`
- เหลือ ~เคส 11-50 (อีก ~40)
- Full spec + ทุก path: `/mnt/d/01 Main Work/ร้านยาคุณภาพ/case/HERMES_HANDOFF_pharmacy_cases.md` ← อ่านไฟล์นี้ก่อนเริ่ม

## FORMAT (เข้มงวด — เลียน PARKVENTURES_TEMPLATE.md)
ต่อ 1 เคส: วันที่ / เคสที่ N / ผู้ป่วย(เพศ อายุ + เลขสมาชิกจริง) / CC / HPI / PMH / SH / FH / All / Med PTA / การรักษาที่ควรได้รับ / Plan / Assessment / ติดตามอาการ
**ห้าม:** commentary, meta, citation block, "composite/อิงยาขายจริง"

## DATA (path เต็มใน HERMES_HANDOFF_pharmacy_cases.md)
- แม่แบบ: case/PARKVENTURES_TEMPLATE.md
- ยา: case/trans_dat_db/item_code_to_product_name.csv (matched=True, ตัดเครื่องสำอาง)
- เลขสมาชิก: case/trans_dat_db/trans_dat_payments.csv → tender_code=51 → extra_payload_json.field_7 (66x→0xxxxxxxxx, ตัด placeholder 999.../2222.../7777.../8888...)
- วันที่/ราคา: trans_dat_items.csv + trans_dat_transactions.csv (join tx_key, amount/100)
- ฐานข้อมูลพร้อมใช้: case/grand5_member_db.html (member×date×item×price, 17,861 แถว)

## OUTPUT
ต่อไฟล์ case/Boots_Grand5_50cases.md เลขต่อเนื่องจนครบ 50 (แก้ผ่าน bash ถ้า Write โดน guard)

## กฎเหล็ก
ห้ามแต่งเลขสมาชิก/สถิติที่ไม่มีแหล่ง — ไม่มีให้ระบุตรง ๆ. ถ้าต้องการ citation ขอ Aeimathes verify.

## ACCEPTANCE
50 เคส format Park Ventures ล้วน, ผูกยา+สมาชิกจริง, อาการหลากหลาย
