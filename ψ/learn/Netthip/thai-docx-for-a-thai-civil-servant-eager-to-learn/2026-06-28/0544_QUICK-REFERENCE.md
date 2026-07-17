---
name: 0544-quick-reference
description: > 🤖 Created with Claude Haiku 4.5
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-15
  source: fleet-memory
---

# Thai DOCX — เอกสาร Word ภาษาไทยที่เต็มบรรทัด ฟอนต์ถูก จัดหน้าสวย 📄🇹🇭

**Quick Reference Guide** — เครื่องมือสร้างไฟล์ Word ภาษาไทยด้วย Python

> 🤖 Created with Claude Haiku 4.5

---

## สารบัญ

1. [ข้อมูลโครงการ](#ข้อมูลโครงการ)
2. [ปัญหาที่แก้](#ปัญหาที่แก้)
3. [ติดตั้ง](#ติดตั้ง)
4. [เริ่มต้นเร็ว](#เริ่มต้นเร็ว-quick-start)
5. [ใช้งาน CLI](#ใช้งาน-cli)
6. [ใช้งาน Python API](#ใช้งาน-python-api)
7. [Preset จัดหน้า](#preset-จัดหน้า)
8. [ชนิดของ Paragraph](#ชนิดของ-paragraph)
9. [ฟอนต์ที่มีให้](#ฟอนต์ที่มีให้)
10. [ตัวอย่างการใช้](#ตัวอย่างการใช้)
11. [คำถามที่พบบ่อย](#คำถามที่พบบ่อย)

---

## ข้อมูลโครงการ

| ข้อมูล | รายละเอียด |
|------|---------|
| **ชื่อ** | Thai DOCX (Thai Document Creator) |
| **ผู้สร้าง** | Netthip (https://github.com/Netthip) |
| **ภาษา** | Python 3.8+ |
| **ลิขสิทธิ์** | MIT (ใช้ฟรี แก้ไข แจกจ่ายได้) |
| **Repository** | github.com/Netthip/thai-docx-for-a-thai-civil-servant-eager-to-learn |
| **ฟอนต์** | รวมฟอนต์ราชการไทย 10 ตระกูล |
| **เป็น Skill** | ใช้ได้เป็น Claude Code skill (`thai-docx`) |

### วัตถุประสงค์

สร้างไฟล์ Word (.docx) ภาษาไทยที่:
- ✅ **เต็มบรรทัด** — ไม่ตัดบรรทัดก่อนเวลา
- ✅ **ฟอนต์ถูกต้อง** — ทำงานบนทุกเครื่อง
- ✅ **ระดับเอกสารราชการ** — preset มาตรฐานสารบรรณ
- ✅ **ยืดหยุ่น** — สารบัญ ตาราง รูป หัวกระดาษ เลขหน้า

---

## ปัญหาที่แก้

### ปัญหา 1: ภาษาไทยตัดบรรทัดก่อนเวลา

**ปัญหา:** Word ไม่รู้จะตัดบรรทัดตรงไหนในภาษาไทย (เพราะไม่มีช่องว่างระหว่างคำ) → บรรทัดสั้น ๆ ขวด

**วิธีแก้:** แทรก **Zero-Width Space (U+200B)** ระหว่างคำไทย
- มองไม่เห็น กว้างศูนย์
- บอก Word ว่า "ตัดบรรทัดตรงนี้ได้"
- ใช้ `PyThaiNLP` เพื่อตัดคำให้ถูก

### ปัญหา 2: ฟอนต์ไทยไม่เปลี่ยนตามที่สั่ง

**ปัญหา:** `python-docx` ตั้งฟอนต์แค่ฝั่ง `w:ascii`/`w:hAnsi` (อังกฤษ) **ไม่ตั้งฝั่ง `w:cs` (Complex Script)** ที่อักษรไทยใช้จริง → บางเครื่องฟอนต์ไทยไม่เปลี่ยน

**วิธีแก้:** ตั้งฟอนต์ผ่าน XML ให้ครบ:
- `w:ascii` / `w:hAnsi` (ละติน)
- **`w:cs` (Complex Script)** — ฝั่งไทยจริง
- ขนาด: `w:szCs`
- ตัวหนา/เอียง: `w:bCs` / `w:iCs`

---

## ติดตั้ง

### 1. Clone Repository

```bash
git clone https://github.com/Netthip/thai-docx-for-a-thai-civil-servant-eager-to-learn.git
cd thai-docx-for-a-thai-civil-servant-eager-to-learn
```

### 2. ติดตั้ง Dependencies

```bash
pip install -r requirements.txt
```

**Dependencies:**
- `python-docx >= 1.0.0` — สร้างไฟล์ Word
- `pythainlp >= 4.0.0` — ตัดคำภาษาไทย

### 3. ติดตั้งฟอนต์แห่งชาติ

```bash
python scripts/install_fonts.py
```

- ติดตั้ง 10 ฟอนต์ราชการไทยลงเครื่อง
- ไม่ต้อง admin
- ใช้ได้ทั้งหน้าต่างและ Linux

### 4. ยืนยันการติดตั้ง

```bash
python scripts/thai_docx.py --list-fonts
```

ผลลัพธ์ (ตัวอย่าง):
```
Available fonts:
  sarabun      → TH SarabunPSK (มาตรฐานราชการ)
  krub         → TH Krub
  koho         → TH KoHo
  niramit      → TH Niramit AS
  ... [6 ตัวเพิ่มเติม]
```

---

## เริ่มต้นเร็ว (Quick Start)

### CLI — 30 วินาที

```bash
# สร้างเอกสารราชการจาก markdown
python scripts/thai_docx.py input.md -o output.docx \
    --preset saraban \
    --toc \
    --page-number footer-center \
    --title "รายงานประจำปี"
```

**ผล:** `output.docx` พร้อมสารบัญ เลขหน้า จัดหน้าตามมาตรฐานราชการ

### Python Code — 2 นาที

```python
from scripts.thai_docx import create_docx

paragraphs = [
    {"text": "รายงานประจำปี", "type": "title"},
    {"text": "บทที่ ๑ บทนำ", "type": "heading1"},
    {"text": "ข้อความภาษาไทยที่จะ **เต็มบรรทัด** โดยอัตโนมัติ", "type": "body"},
    {"text": "ข้อแรก", "type": "bullet"},
    {"text": "ข้อสอง", "type": "bullet"},
]

create_docx(
    paragraphs, "output.docx",
    preset="saraban",
    title="รายงานประจำปี",
    toc=True,
    page_number="footer-center",
)
```

**ผล:** `output.docx` พร้อมใช้

---

## ใช้งาน CLI

### Syntax พื้นฐาน

```bash
python scripts/thai_docx.py INPUT -o OUTPUT [OPTIONS]
```

### ตัวเลือก (Options)

| Option | คำอธิบาย | ตัวอย่าง |
|--------|---------|--------|
| `-o, --output` | ไฟล์ output (บังคับ) | `-o output.docx` |
| `--preset` | การจัดหน้า | `--preset saraban` (default: `default`) |
| `--font` | ชื่อฟอนต์ | `--font krub` |
| `--font-size` | ขนาดฟอนต์ (pt) | `--font-size 16` |
| `--toc` | สารบัญอัตโนมัติ | `--toc` |
| `--page-number` | ตำแหน่งเลขหน้า | `--page-number footer-center` |
| `--page-number-format` | รูปแบบเลขหน้า | `--page-number-format "หน้า {n}"` |
| `--title` | ชื่อบนหัวเอกสาร | `--title "รายงาน"` |
| `--header-text` | ข้อความหัวกระดาษ | `--header-text "สำนักงาน"` |
| `--margins` | ขอบกระดาษ (ซม.) | `--margins "2.5,2.0,3.0,2.0"` |
| `--list-fonts` | แสดงฟอนต์ที่ใช้ได้ | `--list-fonts` |

### ตัวอย่าง CLI

#### 1. เอกสารราชการแบบเต็มรูป

```bash
python scripts/thai_docx.py input.md -o report.docx \
    --preset saraban \
    --title "รายงานการทดสอบระบบ" \
    --header-text "สำนักงบประมาณ" \
    --toc \
    --page-number footer-center \
    --page-number-format "หน้า {n}"
```

#### 2. รายงานเรียบง่าย

```bash
python scripts/thai_docx.py input.md -o simple.docx \
    --preset default \
    --font koho
```

#### 3. บทความ/หนังสือ

```bash
python scripts/thai_docx.py input.md -o book.docx \
    --preset book \
    --font mali \
    --toc
```

---

## ใช้งาน Python API

### ฟังก์ชันหลัก: `create_docx()`

```python
from scripts.thai_docx import create_docx

create_docx(
    paragraphs,                    # list[dict] — โครงสร้าง paragraph
    output_path,                   # str — เส้นทางไฟล์ output
    preset="default",              # str — preset การจัดหน้า
    title=None,                    # str — ชื่อบนหัวเอกสาร
    header_text=None,              # str — ข้อความหัวกระดาษ
    footer_text=None,              # str — ข้อความท้ายกระดาษ
    toc=False,                     # bool — เพิ่มสารบัญ
    page_number=None,              # str — ตำแหน่ง + รูปแบบเลขหน้า
    page_number_format="หน้า {n}", # str — รูปแบบ (ใช้ {n} และ {total})
    font_name=None,                # str — ชื่อฟอนต์ (แทน preset)
    font_size=None,                # int — ขนาดฟอนต์ (แทน preset)
    line_spacing=None,             # float — เว้นบรรทัด (แทน preset)
    margins=None,                  # dict — ขอบกระดาษ (แทน preset)
    first_line_indent=None,        # float — ย่อหน้าแรก (แทน preset)
)
```

### ตัวอย่าง Python API

#### 1. เอกสารราชการ

```python
from scripts.thai_docx import create_docx

paragraphs = [
    {"text": "รายงานการทดสอบระบบ", "type": "title"},
    {"text": "หน่วยงาน: สำนักงบประมาณ", "type": "subtitle"},
    
    {"text": "บทที่ ๑ บทนำ", "type": "heading1"},
    {"text": "ส่วนนำของเอกสาร...", "type": "body"},
    
    {"text": "๑.๑ วัตถุประสงค์", "type": "heading2"},
    {"text": "เพื่อให้การจัดทำเอกสารเป็นไปอย่างมีประสิทธิภาพ", "type": "bullet"},
    {"text": "เพื่อทดสอบโปรแกรม", "type": "bullet"},
    
    {"text": "๑.๒ ขั้นตอน", "type": "heading2"},
    {"text": "ตัวที่ 1", "type": "number"},
    {"text": "ตัวที่ 2", "type": "number"},
]

create_docx(
    paragraphs, "report.docx",
    preset="saraban",
    title="รายงานประจำปี",
    header_text="สำนักงบประมาณ",
    toc=True,
    page_number="footer-center",
)
```

#### 2. รายงานทั่วไป

```python
from scripts.thai_docx import create_docx

paragraphs = [
    {"text": "ผลการศึกษา", "type": "heading1"},
    {"text": "ผลการศึกษาแสดงว่า...", "type": "body"},
    
    {"type": "table", "header": True, "rows": [
        ["รายการ", "ค่า (บาท)"],
        ["งบประมาณ", "1,000,000"],
        ["ค่าใช้สอย", "500,000"],
    ]},
    
    {"type": "image", "path": "chart.png", "width": 12, "caption": "ภาพที่ 1"},
]

create_docx(paragraphs, "result.docx", preset="default", font="koho")
```

#### 3. บทความด้วยคำคม

```python
from scripts.thai_docx import create_docx

paragraphs = [
    {"text": "การสร้างเอกสารที่ดี", "type": "heading1"},
    
    {"text": "ความพิมพ์ที่ชัดเจนคือหัวใจของการสื่อสารที่ดี", "type": "quote"},
    
    {"text": "ในการจัดทำเอกสาร...", "type": "body"},
]

create_docx(paragraphs, "article.docx", preset="book", font="mali")
```

### ฟังก์ชันตัวช่วย

#### `resolve_font(name)`

แปลงชื่อย่อ/ชื่อเล่นเป็นชื่อฟอนต์จริง

```python
from scripts.thai_docx import resolve_font

resolve_font("krub")              # → "TH Krub"
resolve_font("TH Sarabun New")    # → "TH Sarabun New"
resolve_font("sarabun new")       # → "TH Sarabun New"
```

#### `list_bundled_fonts()`

แสดงฟอนต์ที่มากับรีโป

```python
from scripts.thai_docx import list_bundled_fonts

fonts = list_bundled_fonts()
# {
#     "sarabun": "TH SarabunPSK",
#     "krub": "TH Krub",
#     ...
# }
```

#### `insert_zwsp(text, engine="newmm")`

แทรก Zero-Width Space ระหว่างคำไทย (เรียกอัตโนมัติใน `create_docx()`)

```python
from scripts.thai_docx import insert_zwsp

text = "ข้อความภาษาไทยที่ยาว"
result = insert_zwsp(text)  # มีเครื่องหมาย ZWS ระหว่างคำ
```

#### `parse_markdown(raw)`

แปลง markdown/ข้อความเป็นรายการ paragraph (ใช้โดย CLI)

```python
from scripts.thai_docx import parse_markdown

raw = """# หัวเรื่อง
ย่อหน้าแรก

## หัวข้อย่อย
- ข้อแรก
- ข้อสอง
"""

paragraphs = parse_markdown(raw)
```

---

## Preset จัดหน้า

มี 3 preset สำเร็จรูป — ปรับค่าเองได้เมื่อต้องการ

### 1. `saraban` (ราชการ)

เอกสารราชการตามแนวระเบียบงานสารบรรณ

| คุณสมบัติ | ค่า |
|---------|-----|
| ฟอนต์ | TH Sarabun New |
| ขนาด | 16 pt |
| ขอบ | บน 2.5 / ล่าง 2.0 / ซ้าย 3.0 / ขวา 2.0 ซม. |
| เว้นบรรทัด | 1.0 |
| ย่อหน้าแรก | 1.25 ซม. |

```python
create_docx(paragraphs, "out.docx", preset="saraban")
```

### 2. `default` (รายงานทั่วไป)

เหมาะสำหรับรายงาน บทความ ส่วนใหญ่

| คุณสมบัติ | ค่า |
|---------|-----|
| ฟอนต์ | TH Sarabun New |
| ขนาด | 14 pt |
| ขอบ | 2.54 ซม. ทั้งสี่ด้าน |
| เว้นบรรทัด | 1.5 |
| ย่อหน้าแรก | — |

```python
create_docx(paragraphs, "out.docx", preset="default")
```

### 3. `book` (บทความ/หนังสือ)

สำหรับหนังสือ บทความที่มีย่อหน้า

| คุณสมบัติ | ค่า |
|---------|-----|
| ฟอนต์ | TH Sarabun New |
| ขนาด | 16 pt |
| ขอบ | บน 2.54 / ล่าง 2.54 / ซ้าย 3.0 / ขวา 2.54 ซม. |
| เว้นบรรทัด | 1.3 |
| ย่อหน้าแรก | 1.25 ซม. |

```python
create_docx(paragraphs, "out.docx", preset="book")
```

### ปรับค่า Preset

ค่าที่ระบุเองจะทับ preset:

```python
create_docx(
    paragraphs, "out.docx",
    preset="saraban",          # เริ่มจาก saraban
    font_size=14,              # แต่เปลี่ยนเป็น 14 pt (จาก 16)
    margins={"top": 3, "bottom": 2, "left": 3, "right": 2},
)
```

---

## ชนิดของ Paragraph

ระบุ `"type"` ในแต่ละ paragraph เพื่อกำหนดรูปแบบ:

### ข้อความ

| Type | ใช้สำหรับ | ตัวอย่าง |
|------|---------|--------|
| `title` | ชื่อเอกสาร | `{"text": "รายงาน", "type": "title"}` |
| `subtitle` | ชื่อรอง | `{"text": "ประจำปี 2567", "type": "subtitle"}` |
| `heading1` | หัวข้อระดับ 1 | `{"text": "บทที่ ๑", "type": "heading1"}` |
| `heading2` | หัวข้อระดับ 2 | `{"text": "๑.๑ ส่วน", "type": "heading2"}` |
| `heading3` | หัวข้อระดับ 3 | `{"text": "๑.๑.ก รายการ", "type": "heading3"}` |
| `body` | ย่อหน้าธรรมชาติ | `{"text": "ข้อความเนื้อหา", "type": "body"}` |

### รายการ

| Type | ใช้สำหรับ | ตัวอย่าง |
|------|---------|--------|
| `bullet` | Bullet list | `{"text": "ข้อแรก", "type": "bullet"}` |
| `bullet` + `level` | Bullet ลึก | `{"text": "ข้อย่อย", "type": "bullet", "level": 1}` |
| `number` | ลำดับหมายเลข | `{"text": "ขั้นที่ 1", "type": "number"}` |
| `number` + `level` | ลำดับลึก | `{"text": "ขั้นย่อย", "type": "number", "level": 1}` |

### พิเศษ

| Type | ใช้สำหรับ | ตัวอย่าง |
|------|---------|--------|
| `quote` | คำคม/อ้างอิง | `{"text": "คำพูดสำคัญ", "type": "quote"}` |
| `caption` | คำบรรยายภาพ | `{"text": "ภาพที่ 1", "type": "caption"}` |
| `table` | ตาราง | `{"type": "table", "header": True, "rows": [...]}` |
| `image` | รูปภาพ | `{"type": "image", "path": "file.png", "width": 12}` |
| `pagebreak` | หั่นหน้า | `{"type": "pagebreak"}` |

### ตัวอย่าง Paragraph ต่างๆ

```python
paragraphs = [
    # ข้อความธรรมชาติ
    {"text": "รายงานประจำปี", "type": "title"},
    {"text": "บทที่ ๑ บทนำ", "type": "heading1"},
    {"text": "ส่วนนำของเอกสาร...", "type": "body"},
    
    # รายการ (Bullet)
    {"text": "ข้อแรก", "type": "bullet"},
    {"text": "ข้อย่อย", "type": "bullet", "level": 1},
    {"text": "ข้อหลัก", "type": "bullet"},
    
    # ลำดับหมายเลข
    {"text": "ขั้นตอนแรก", "type": "number"},
    {"text": "ขั้นตอนสอง", "type": "number"},
    
    # ตาราง
    {"type": "table", "header": True, "rows": [
        ["หัวคอลัมน์ 1", "หัวคอลัมน์ 2"],
        ["ข้อมูล 1", "ข้อมูล 2"],
    ]},
    
    # รูปภาพ
    {"type": "image", "path": "chart.png", "width": 12, "caption": "ภาพที่ 1"},
    
    # หั่นหน้า
    {"type": "pagebreak"},
    
    # คำคม
    {"text": "การสื่อสารดีเริ่มจากการเขียนที่ชัดเจน", "type": "quote"},
]
```

### Markdown ใน Paragraph

ชนิด `body`, `bullet`, `number`, `caption` รองรับ markdown:

```python
{
    "text": "ข้อความที่มี **ตัวหนา** และ *ตัวเอียง* และ URL",
    "type": "body"
}
```

ผล: **ตัวหนา** + *ตัวเอียง* + URL ปรากฏถูกต้อง

---

## ฟอนต์ที่มีให้

### ฟอนต์รวมในรีโป (10 ตัว)

ทั้งหมดแจกจ่ายต่อได้ตามกฎหมาย — ดู `fonts/LICENSE-NATIONAL-FONTS.txt`

| Key | ชื่อฟอนต์ | ลักษณะ |
|-----|---------|--------|
| `sarabun` | TH SarabunPSK | มาตรฐานเอกสารราชการ (ไม่ติด serif) |
| `krub` | TH Krub | ทั่วไป สะอาด |
| `koho` | TH KoHo | โอเปนซอร์ส สไตล์現代 |
| `niramit` | TH Niramit AS | ระดับสูง มีเสริมา |
| `kodchasal` | TH Kodchasal | นวม ดูเป็นการพิมพ์ |
| `baijam` | TH Baijam | ลายมือ บาง |
| `chakrapetch` | TH Chakra Petch | โอเปนซอร์ส เก่าแก่ |
| `fahkwang` | TH Fah kwang | นุ่มนวล ปิยะ |
| `k2d` | TH K2D July8 | โอเปนซอร์ส สมัยใหม่ |
| `mali` | TH Mali Grade 6 | ลายมือเรียน บาง ทำให้อ่านง่าย |

### เลือกใช้ฟอนต์

**ผ่าน CLI:**
```bash
python scripts/thai_docx.py input.md -o out.docx --font krub
```

**ผ่าน Python:**
```python
create_docx(paragraphs, "out.docx", font_name="koho")
# หรือสั้นๆ
create_docx(paragraphs, "out.docx", font_name="koho")
```

### ฟอนต์อื่นที่รองรับ

หากต้องใช้ฟอนต์ที่ติดตั้งบนเครื่อง:

```python
create_docx(
    paragraphs, "out.docx",
    font_name="Times New Roman"  # ฟอนต์ที่ติดตั้งแล้ว
)
```

เพียงแต่ให้แน่ใจว่า:
- ฟอนต์รองรับภาษาไทย (Complex Script)
- ติดตั้งแล้วบนเครื่อง

---

## ตัวอย่างการใช้

### ตัวอย่าง 1: รายงานราชการแบบเต็มรูป

**Input:** `input.md`
```markdown
# รายงานผลการดำเนินงาน

บทนำของเอกสาร...

## 1 บทนำ

ในปีที่ผ่านมา...

## 1.1 วัตถุประสงค์

- เพื่อเพิ่มประสิทธิภาพ
- เพื่อลดเวลา

## 1.2 ผลการดำเนินงาน

1. ดำเนินการตามแผน
2. ทดสอบระบบ
3. เผยแพร่
```

**Command:**
```bash
python scripts/thai_docx.py input.md -o output.docx \
    --preset saraban \
    --title "รายงานประจำปี 2567" \
    --header-text "สำนักงบประมาณ" \
    --toc \
    --page-number footer-center \
    --page-number-format "หน้า {n}"
```

**Result:** `output.docx` พร้อมใช้
- ฟอนต์ TH Sarabun New 16pt
- ขอบตามมาตรฐานราชการ
- สารบัญอัตโนมัติ
- หัวกระดาษ + เลขหน้า
- ข้อความไทยเต็มบรรทัด

---

### ตัวอย่าง 2: บทความด้วยตารางและรูป

**Code:** `create_article.py`
```python
from scripts.thai_docx import create_docx

paragraphs = [
    {"text": "ผลการศึกษา", "type": "title"},
    
    {"text": "ส่วนนำ", "type": "heading1"},
    {"text": "การศึกษานี้ศึกษาเกี่ยวกับ...", "type": "body"},
    
    {"text": "วิธีการ", "type": "heading1"},
    {"text": "ข้อมูลถูกเก็บรวบรวมโดย...", "type": "body"},
    
    {"text": "ตารางสรุปผล", "type": "heading2"},
    {"type": "table", "header": True, "rows": [
        ["ลำดับ", "ค่า", "ร้อยละ"],
        ["ตัวที่ 1", "45", "30%"],
        ["ตัวที่ 2", "75", "50%"],
        ["ตัวที่ 3", "30", "20%"],
    ]},
    
    {"text": "กราฟแสดงผล", "type": "heading2"},
    {"type": "image", "path": "chart.png", "width": 14, "caption": "รูปที่ 1 กราฟผล"},
    
    {"text": "สรุปผล", "type": "heading1"},
    {"text": "จากการศึกษา พบว่า...", "type": "body"},
    
    {"text": "คำแนะนำ", "type": "heading1"},
    {"text": "ควรจัดทำระบบ...", "type": "bullet"},
    {"text": "ควรติดตามผล...", "type": "bullet"},
]

create_docx(
    paragraphs, "article.docx",
    preset="book",
    font_name="koho",
    toc=True,
    page_number="footer-center",
)
```

**Run:**
```bash
python create_article.py
```

---

### ตัวอย่าง 3: เอกสารธรรมชาติ (ไม่มีสารบัญ)

```python
from scripts.thai_docx import create_docx

create_docx(
    [
        {"text": "จดหมายราชการ", "type": "title"},
        {"text": "วันที่ 28 มิถุนายน 2567", "type": "body"},
        {"text": "เรียน ผู้อำนวยการ", "type": "body"},
        {"text": "เรื่อง ขออนุมัติจัดซื้อครุภัณฑ์สำนักงาน", "type": "body"},
        {"text": "...เนื้อหาจดหมาย...", "type": "body"},
        {"text": "ขอแสดงความนับถือ", "type": "body"},
    ],
    "letter.docx",
    preset="default",
    page_number="footer-right",
)
```

---

### ตัวอย่าง 4: ใช้ Zero-Width Space เพียงอย่างเดียว

หากต้องการแค่แก้ปัญหาตัดบรรทัด:

```python
from scripts.thai_docx import insert_zwsp

text = "ข้อความภาษาไทยที่ยาว"
text_with_zwsp = insert_zwsp(text)
print(text_with_zwsp)  # มี ZWS ระหว่างคำ (มองไม่เห็น)

# ใช้กับ python-docx ปกติ
from docx import Document
doc = Document()
run = doc.add_paragraph(text_with_zwsp).runs[0]
doc.save("output.docx")
```

---

## คำถามที่พบบ่อย

### Q1: ทำไมข้อความไทยยังตัดบรรทัดก่อนเวลา?

**A:** ตรวจสอบ:
1. ติดตั้ง `pythainlp` แล้วหรือยัง?
   ```bash
   pip install pythainlp
   ```
2. ฟอนต์รองรับ Complex Script หรือไม่? (ฟอนต์เดิม ๆ ไม่ทำงาน)

---

### Q2: ฟอนต์ไทยยังไม่เปลี่ยน บนเครื่องบางตัว?

**A:** เป็นเพราะ Word ไม่เปลี่ยนฟอนต์ฝั่ง Complex Script
- ลองใช้ฟอนต์ที่มากับรีโป (ติดตั้งด้วย `install_fonts.py`)
- หรือใช้ฟอนต์ที่คุณติดตั้งแล้ว (ต้องรองรับไทย)

---

### Q3: สารบัญไม่แสดงเลขหน้า?

**A:** สารบัญเป็น field ของ Word — ต้องอัปเดต:
1. เปิดไฟล์ใน Word
2. คลิกขวาที่สารบัญ → **Update Field** (หรือกด F9)
3. เลขหน้าจะแสดง

---

### Q4: ปรับค่าขอบกระดาษได้หรือไม่?

**A:** ได้แน่นอน:

**CLI:**
```bash
python scripts/thai_docx.py input.md -o out.docx --margins "2.5,2.0,3.0,2.0"
```

**Python:**
```python
create_docx(
    paragraphs, "out.docx",
    margins={"top": 2.5, "bottom": 2.0, "left": 3.0, "right": 2.0}
)
```

ลำดับ: `top, bottom, left, right` (ซม.)

---

### Q5: ใช้ฟอนต์ตัวเองได้หรือไม่?

**A:** ได้ — ระบุชื่อฟอนต์เต็มถ้าติดตั้งแล้ว:

```python
create_docx(
    paragraphs, "out.docx",
    font_name="Calibri"  # หรือฟอนต์ใดๆ ที่ติดตั้งแล้ว
)
```

แต่ต้องแน่ใจว่าฟอนต์รองรับภาษาไทย (Complex Script)

---

### Q6: ตัดบรรทัด (page break) ตรงไหน?

**A:** ใช้ `"pagebreak"` type:

```python
paragraphs = [
    {"text": "หน้าแรก...", "type": "body"},
    {"type": "pagebreak"},  # หั่นหน้าตรงนี้
    {"text": "หน้าสอง...", "type": "body"},
]
```

---

### Q7: ใส่รูปภาพได้หรือไม่?

**A:** ได้:

```python
{
    "type": "image",
    "path": "chart.png",      # เส้นทางไฟล์
    "width": 12,              # ความกว้าง (ซม.)
    "caption": "ภาพที่ 1"     # คำบรรยายไฟล์
}
```

---

### Q8: ใส่ตารางได้หรือไม่?

**A:** ได้:

```python
{
    "type": "table",
    "header": True,           # แถวแรกเป็นหัวตาราง
    "rows": [
        ["หัว 1", "หัว 2", "หัว 3"],
        ["ข้อ 1", "ข้อ 2", "ข้อ 3"],
        ["ข้อ 4", "ข้อ 5", "ข้อ 6"],
    ]
}
```

---

### Q9: รองรับเลขไทย (๑๒๓) หรือไม่?

**A:** ได้ — พิมพ์ตรงๆ ก็ทำงาน:

```python
{
    "text": "ตัวหมายเลขที่ ๑๑ และ ๒๒",
    "type": "body"
}
```

หรือใช้ฟอนต์ `mali` ที่มีชุด IT๙ ในรีโป

---

### Q10: ใช้ได้กับ Python เวอร์ชันไหนบ้าง?

**A:** Python 3.8 ขึ้นไป เท่านั้น
- Python 3.8, 3.9, 3.10, 3.11, 3.12 ✅
- Python 2.7, 3.6, 3.7 ❌

---

## ทรัพยากร

### ต้นทาง

- **GitHub:** https://github.com/Netthip/thai-docx-for-a-thai-civil-servant-eager-to-learn
- **License:** MIT

### Dependencies

- [python-docx](https://github.com/python-openxml/python-docx) — สร้างไฟล์ Word
- [PyThaiNLP](https://github.com/PyThaiNLP/pythainlp) — ตัดคำภาษาไทย

### Fonts

- ฟอนต์ 10 ตัวในโฟลเดอร์ `fonts/` — แจกจ่ายต่อได้ตามกฎหมาย

---

## ติดตั้งและรัน (สรุป)

```bash
# 1. Clone
git clone https://github.com/Netthip/thai-docx-for-a-thai-civil-servant-eager-to-learn.git
cd thai-docx-for-a-thai-civil-servant-eager-to-learn

# 2. ติดตั้ง dependencies
pip install -r requirements.txt

# 3. ติดตั้งฟอนต์
python scripts/install_fonts.py

# 4. ลองใช้ CLI
python scripts/thai_docx.py examples/sample_input.md -o test.docx \
    --preset saraban --toc --page-number footer-center

# 5. หรือใช้เป็น Python library
python examples/example_report.py
```

---

## ใช้เป็น Claude Code Skill

ถ้ากำลังใช้ Claude Code (IDE เสมือน):

```bash
# Trigger: ขอให้สร้างเอกสาร Word ภาษาไทย
# Skill: thai-docx
```

จะเรียกโปรแกรมนี้โดยอัตโนมัติเมื่อต้องการสร้างเอกสาร Word ที่มีภาษาไทย

---

**Last Updated:** 28 มิถุนายน 2567  
**Guide Version:** 1.0  
**Status:** ✅ Complete & Ready
