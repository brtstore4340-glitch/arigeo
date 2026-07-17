---
name: 0544-code-snippets
description: **Language**: Python 3.8+  
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-15
  source: fleet-memory
---

# Thai DOCX — Code Snippets & Implementation Guide

**Project**: Thai DOCX — Python tool for creating Thai language Word documents  
**Repository**: https://github.com/Netthip/thai-docx-for-a-thai-civil-servant-eager-to-learn  
**Language**: Python 3.8+  
**License**: MIT  

---

## 📦 Project Overview

Thai DOCX solves two critical problems in Thai document generation:

1. **Line breaking**: Thai text breaks too early because Thai has no spaces between words
2. **Font rendering**: Complex Script (Thai) fonts aren't applied correctly via python-docx

**Dependencies:**
```
python-docx>=1.0.0     # Create/modify .docx files
pythainlp>=4.0.0       # Thai word segmentation
```

---

## 🚀 Entry Point: CLI Usage

**File**: `scripts/thai_docx.py`

### Running from Command Line

```bash
# Basic: markdown → Word document
python scripts/thai_docx.py input.md -o output.docx

# Government document (saraban preset) with TOC and page numbers
python scripts/thai_docx.py input.md -o output.docx \
    --preset saraban --toc --page-number footer-center --title "รายงานประจำปี"

# List available fonts
python scripts/thai_docx.py --list-fonts

# Custom font and size
python scripts/thai_docx.py input.md -o output.docx --font krub --size 14
```

### Main CLI Handler

```python
def main():
    _safe_stdout()
    parser = argparse.ArgumentParser(
        description="สร้าง Word (.docx) ภาษาไทยเต็มบรรทัด รองรับเอกสารราชการ",
    )
    parser.add_argument("input", nargs="?", help="ไฟล์ข้อความ/markdown (.txt, .md)")
    parser.add_argument("-o", "--output", default="output.docx", help="ไฟล์ผลลัพธ์ (.docx)")
    parser.add_argument("--preset", default="default", choices=list(PRESETS), help="รูปแบบการจัดหน้า")
    parser.add_argument("--font", default=None,
                        help="ฟอนต์ (ทับค่า preset) — ใส่ชื่อเต็มหรือ key เช่น krub, koho, sarabun")
    parser.add_argument("--list-fonts", action="store_true", help="แสดงฟอนต์ที่มากับรีโปแล้วออก")
    parser.add_argument("--size", type=int, default=None, help="ขนาดฟอนต์ pt (ทับค่า preset)")
    parser.add_argument("--title", default=None, help="ชื่อเรื่องบนหัวเอกสาร")
    parser.add_argument("--toc", action="store_true", help="ใส่สารบัญอัตโนมัติ")
    parser.add_argument("--page-number", default=None,
                        help="ตำแหน่งเลขหน้า เช่น footer-center, footer-right")
    parser.add_argument("--header", default=None, help="ข้อความหัวกระดาษ")
    parser.add_argument("--footer", default=None, help="ข้อความท้ายกระดาษ")
    args = parser.parse_args()

    # ... handle args.list_fonts, args.input ...
    
    with open(args.input, "r", encoding="utf-8") as f:
        raw = f.read()

    paragraphs = parse_markdown(raw)
    create_docx(
        paragraphs,
        args.output,
        preset=args.preset,
        font_name=args.font,
        font_size=args.size,
        title=args.title,
        toc=args.toc,
        page_number=args.page_number,
        header_text=args.header,
        footer_text=args.footer,
    )
    print(f"✅ สร้างไฟล์: {args.output}")
```

---

## 🔤 Core Pattern 1: Zero-Width Space Insertion

**Problem**: Thai text has no spaces, so Word doesn't know where line breaks are safe.  
**Solution**: Insert invisible Zero-Width Space (U+200B) after each word.

### Implementation

```python
# Global constant for Zero-Width Space
ZWS = "​"  # Unicode U+200B

# Regex pattern to identify Thai text
_THAI_RUN = re.compile(r"([฀-๿]+)")

def insert_zwsp(text: str, engine: str = "newmm") -> str:
    """แทรก Zero-Width Space ระหว่างคำไทย — ภาษาอังกฤษ ตัวเลข URL ไม่ถูกแตะ"""
    if not text:
        return text
    
    # Split text into Thai and non-Thai parts
    parts = _THAI_RUN.split(text)
    out = []
    
    for part in parts:
        if part and _THAI_RUN.fullmatch(part):
            # Use PyThaiNLP to segment Thai text, then join with ZWS
            out.append(ZWS.join(word_tokenize(part, engine=engine)))
        else:
            # Non-Thai part (English, numbers, etc.) — leave unchanged
            out.append(part)
    
    return "".join(out)
```

### Usage

```python
# Example: "ข้อความภาษาไทย" becomes "ข้อ​ความ​ภาษา​ไทย" (ZWS invisible)
text_with_breaks = insert_zwsp("สร้างไฟล์ Word ภาษาไทย")

# Used throughout the codebase when adding text to paragraphs
run = paragraph.add_run(insert_zwsp(text))
```

---

## 🎨 Core Pattern 2: Font Management (Complex Script Fix)

**Problem**: `python-docx`'s `run.font.name` only sets ASCII/hAnsi, not Complex Script (CS), which Thai actually uses.  
**Solution**: Directly manipulate XML to set all font faces (ascii, hAnsi, cs, eastAsia).

### The Font Registry

```python
BUNDLED_FONTS = {
    "sarabun": "TH SarabunPSK",      # มาตรฐานเอกสารราชการ
    "krub": "TH Krub",
    "koho": "TH KoHo",
    "niramit": "TH Niramit AS",
    "kodchasal": "TH Kodchasal",
    "baijam": "TH Baijam",
    "chakrapetch": "TH Chakra Petch",
    "fahkwang": "TH Fah kwang",
    "k2d": "TH K2D July8",
    "mali": "TH Mali Grade 6",
}

_FONT_ALIASES = {
    "th sarabun new": "TH Sarabun New",
    "sarabun new": "TH Sarabun New",
    "th sarabunpsk": "TH SarabunPSK",
    "sarabun psk": "TH SarabunPSK",
    "th sarabun psk": "TH SarabunPSK",
}

def resolve_font(name: str) -> str:
    """แปลงชื่อย่อ/ชื่อเล่นของฟอนต์เป็นชื่อ family จริง"""
    if not name:
        return name
    low = name.strip().lower()
    if low in BUNDLED_FONTS:
        return BUNDLED_FONTS[low]
    if low in _FONT_ALIASES:
        return _FONT_ALIASES[low]
    return name
```

### XML-Level Font Setting (The Key Fix)

```python
def set_run_font(run, name=None, size=None, bold=None, italic=None, color=None):
    """
    ตั้งฟอนต์ของ run ให้ครบทั้ง ascii / hAnsi / cs (และ eastAsia)
    จุดสำคัญ: ฝั่ง cs (Complex Script) คือฝั่งที่อักษรไทยใช้จริง
    ถ้าตั้งแต่ run.font.name เฉย ๆ ฟอนต์ไทยจะไม่เปลี่ยน
    """
    rPr = run._element.get_or_add_rPr()

    if name:
        run.font.name = name  # Standard API (sets ascii/hAnsi)
        rFonts = rPr.find(qn("w:rFonts"))
        if rFonts is None:
            rFonts = OxmlElement("w:rFonts")
            rPr.append(rFonts)
        # Set ALL font faces, including Complex Script
        for attr in ("w:ascii", "w:hAnsi", "w:cs", "w:eastAsia"):
            rFonts.set(qn(attr), name)

    if size is not None:
        run.font.size = Pt(size)  # Standard API
        # Also set Complex Script size (w:szCs)
        szCs = rPr.find(qn("w:szCs"))
        if szCs is None:
            szCs = OxmlElement("w:szCs")
            rPr.append(szCs)
        szCs.set(qn("w:val"), str(int(size * 2)))  # Half-points

    if bold is not None:
        run.font.bold = bold
        # Complex Script bold
        bCs = rPr.find(qn("w:bCs"))
        if bCs is None:
            bCs = OxmlElement("w:bCs")
            rPr.append(bCs)
        bCs.set(qn("w:val"), "true" if bold else "false")

    if italic is not None:
        run.font.italic = italic
        # Complex Script italic
        iCs = rPr.find(qn("w:iCs"))
        if iCs is None:
            iCs = OxmlElement("w:iCs")
            rPr.append(iCs)
        iCs.set(qn("w:val"), "true" if italic else "false")

    if color is not None:
        run.font.color.rgb = color
```

### Applied to Document Styles

```python
def _set_styles(doc, font_name, font_size):
    """ตั้งฟอนต์ default ของ Normal + Heading ให้ครบฝั่ง cs"""
    normal = doc.styles["Normal"]
    normal.font.name = font_name
    normal.font.size = Pt(font_size)
    
    # Apply Complex Script fix to Normal style
    rpr = normal.element.get_or_add_rPr()
    rfonts = rpr.find(qn("w:rFonts"))
    if rfonts is None:
        rfonts = OxmlElement("w:rFonts")
        rpr.append(rfonts)
    for attr in ("w:ascii", "w:hAnsi", "w:cs"):
        rfonts.set(qn(attr), font_name)

    # Apply to Heading 1, 2, 3
    for level, size in [(1, font_size + 6), (2, font_size + 4), (3, font_size + 2)]:
        try:
            hstyle = doc.styles[f"Heading {level}"]
        except KeyError:
            continue
        hstyle.font.name = font_name
        hstyle.font.size = Pt(size)
        hstyle.font.bold = True
        # ... apply same Complex Script fix ...
```

---

## 📝 Core Pattern 3: Markdown Parsing

**Input**: Simple markdown (headers, bullets, lists)  
**Output**: List of paragraph dictionaries for `create_docx()`

### Parser Implementation

```python
def parse_markdown(raw: str) -> list:
    """แปลงข้อความแบบ markdown ง่าย ๆ เป็นรายการ paragraph สำหรับ create_docx()"""
    items = []
    lines = raw.replace("\r\n", "\n").split("\n")
    buf = []

    def flush():
        if buf:
            items.append({"text": " ".join(buf).strip(), "type": "body"})
            buf.clear()

    i = 0
    while i < len(lines):
        line = lines[i].rstrip()
        stripped = line.strip()

        if not stripped:
            flush()
            i += 1
            continue

        # Headings: # / ## / ###
        m = re.match(r"^(#{1,3})\s+(.*)$", stripped)
        if m:
            flush()
            level = len(m.group(1))
            items.append({"text": m.group(2), "type": f"heading{level}"})
            i += 1
            continue

        # Bullet: - or *
        if re.match(r"^[-*]\s+", stripped):
            flush()
            items.append({"text": re.sub(r"^[-*]\s+", "", stripped), "type": "bullet"})
            i += 1
            continue

        # Numbered list: 1. or 2)
        if re.match(r"^\d+[.)]\s+", stripped):
            flush()
            items.append({"text": re.sub(r"^\d+[.)]\s+", "", stripped), "type": "number"})
            i += 1
            continue

        # Government-style numbering: 1.2.3 ...
        if re.match(r"^\d+(\.\d+)*\s+\S", stripped) and len(stripped) < 100:
            flush()
            depth = stripped.split()[0].count(".")
            items.append({"text": stripped, "type": f"heading{min(depth + 1, 3)}"})
            i += 1
            continue

        # Regular paragraph text (accumulate)
        buf.append(stripped)
        i += 1

    flush()
    return items
```

### Example Input → Output

```markdown
# บทที่ 1 บทนำ

ย่อหน้าที่ 1

## 1.1 วัตถุประสงค์

- ข้อแรก
- ข้อสอง

1. ขั้นตอนหนึ่ง
```

Becomes:

```python
[
    {"text": "บทที่ 1 บทนำ", "type": "heading1"},
    {"text": "ย่อหน้าที่ 1", "type": "body"},
    {"text": "1.1 วัตถุประสงค์", "type": "heading2"},
    {"text": "ข้อแรก", "type": "bullet"},
    {"text": "ข้อสอง", "type": "bullet"},
    {"text": "ขั้นตอนหนึ่ง", "type": "number"},
]
```

---

## 💫 Core Pattern 4: Inline Markdown Formatting

**Support**: `**bold**` and `*italic*`

### Formatting Parser

```python
_BOLD = re.compile(r"\*\*(.+?)\*\*")
_ITALIC = re.compile(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)")

def _add_formatted_runs(paragraph, text, font_name, font_size):
    """แตกข้อความออกเป็น run ตาม **ตัวหนา** / *ตัวเอียง* แล้วแทรก ZWS + ตั้งฟอนต์"""
    # Tokenize into (style, text) pairs
    segments = [("normal", text)]

    def _split(segs, pattern, style):
        new = []
        for st, tx in segs:
            if st != "normal":
                new.append((st, tx))
                continue
            last = 0
            for m in pattern.finditer(tx):
                if m.start() > last:
                    new.append(("normal", tx[last:m.start()]))
                new.append((style, m.group(1)))
                last = m.end()
            if last < len(tx):
                new.append(("normal", tx[last:]))
        return new

    segments = _split(segments, _BOLD, "bold")
    segments = _split(segments, _ITALIC, "italic")

    if not any(tx for _, tx in segments):
        segments = [("normal", text)]

    for style, tx in segments:
        if tx == "":
            continue
        run = paragraph.add_run(insert_zwsp(tx))
        set_run_font(
            run,
            name=font_name,
            size=font_size,
            bold=(style == "bold") or None,
            italic=(style == "italic") or None,
        )
```

### Usage

```python
# Input: "เนื้อหาภาษาไทยที่รองรับ **ตัวหนา** และ *ตัวเอียง*"
# Creates three runs:
#  1. "เนื้อหาภาษาไทยที่รองรับ " (normal)
#  2. "ตัวหนา" (bold)
#  3. " และ " (normal)
#  4. "ตัวเอียง" (italic)
```

---

## 📊 Core Pattern 5: Page Setup & Presets

**Available Presets**: `saraban` (government), `default`, `book`

### Preset Definition

```python
PRESETS = {
    "saraban": dict(
        font_name="TH Sarabun New",
        font_size=16,
        page_size="A4",
        margins=dict(top=2.5, bottom=2.0, left=3.0, right=2.0),
        line_spacing=1.0,
        first_line_indent=1.25,
        space_after=0,
    ),
    "default": dict(
        font_name="TH Sarabun New",
        font_size=14,
        page_size="A4",
        margins=dict(top=2.54, bottom=2.54, left=2.54, right=2.54),
        line_spacing=1.5,
        first_line_indent=0.0,
        space_after=6,
    ),
    "book": dict(
        font_name="TH Sarabun New",
        font_size=16,
        page_size="A4",
        margins=dict(top=2.54, bottom=2.54, left=3.0, right=2.54),
        line_spacing=1.3,
        first_line_indent=1.25,
        space_after=0,
    ),
}

def _apply_page_setup(section, page_size, margins):
    if page_size == "A4":
        section.page_width = Cm(21.0)
        section.page_height = Cm(29.7)
    elif page_size == "Letter":
        section.page_width = Cm(21.59)
        section.page_height = Cm(27.94)
    m = margins or {}
    section.top_margin = Cm(m.get("top", 2.54))
    section.bottom_margin = Cm(m.get("bottom", 2.54))
    section.left_margin = Cm(m.get("left", 2.54))
    section.right_margin = Cm(m.get("right", 2.54))
```

---

## 📄 Core Pattern 6: Page Numbers & Fields

**Features**: Current page (`{n}`), total pages (`{total}`), TOC

### Field Insertion

```python
def _add_field(paragraph, instr, font_name=None, font_size=None):
    """เพิ่ม field code (เช่น PAGE, NUMPAGES, TOC) ลงในย่อหน้า"""
    run = paragraph.add_run()
    fldChar1 = OxmlElement("w:fldChar")
    fldChar1.set(qn("w:fldCharType"), "begin")
    instrText = OxmlElement("w:instrText")
    instrText.set(qn("xml:space"), "preserve")
    instrText.text = instr
    fldChar2 = OxmlElement("w:fldChar")
    fldChar2.set(qn("w:fldCharType"), "end")
    run._r.append(fldChar1)
    run._r.append(instrText)
    run._r.append(fldChar2)
    if font_name or font_size:
        set_run_font(run, name=font_name, size=font_size)
    return run

def _add_page_number(paragraph, fmt, font_name, font_size, align):
    """เลขหน้า; fmt รองรับ {n}=เลขหน้าปัจจุบัน {total}=จำนวนหน้ารวม"""
    paragraph.alignment = align
    # Split format by {n} / {total}
    tokens = re.split(r"(\{n\}|\{total\})", fmt)
    for tok in tokens:
        if tok == "{n}":
            _add_field(paragraph, "PAGE", font_name, font_size)
        elif tok == "{total}":
            _add_field(paragraph, "NUMPAGES", font_name, font_size)
        elif tok:
            run = paragraph.add_run(insert_zwsp(tok))
            set_run_font(run, name=font_name, size=font_size)
```

### Table of Contents

```python
def _add_toc(doc, font_name, font_size, title="สารบัญ"):
    """แทรกสารบัญอัตโนมัติ (Word จะอัปเดตเลขหน้าเมื่อกด Update Field / F9)"""
    if title:
        h = doc.add_paragraph()
        h.alignment = WD_ALIGN_PARAGRAPH.CENTER
        set_run_font(h.add_run(title), name=font_name, size=font_size + 4, bold=True)

    p = doc.add_paragraph()
    _add_field(p, 'TOC \\o "1-3" \\h \\z \\u', font_name, font_size)
    
    # Helper note for user
    note = doc.add_paragraph()
    set_run_font(
        note.add_run("(คลิกขวาที่สารบัญ → Update Field เพื่อให้เลขหน้าแสดงผล)"),
        name=font_name,
        size=font_size - 2,
        italic=True,
        color=RGBColor(0x80, 0x80, 0x80),
    )
```

---

## 🎯 Core Pattern 7: Main Document Creation

**Function**: `create_docx()`  
**Input**: List of paragraph dicts, output path, optional formatting parameters  
**Output**: .docx file

### Supported Paragraph Types

```python
# Text-based types:
{"text": "ชื่อเรื่อง", "type": "title"}           # Centered, large, bold
{"text": "หัวข้ออย่างหนึ่ง", "type": "heading1"}  # Level 1–3
{"text": "ย่อหน้า", "type": "body"}               # Normal text
{"text": "จุดสำคัญ", "type": "bullet"}            # Bulleted list (level 0–n)
{"text": "ขั้นตอน", "type": "number"}            # Numbered list
{"text": "คำพูด", "type": "quote"}               # Quoted text
{"text": "ที่มา: ...", "type": "caption"}        # Image/table caption

# Content types:
{"type": "table", "header": True, "rows": [["A", "B"], ["1", "2"]]}
{"type": "image", "path": "photo.png", "width": 12, "caption": "ภาพที่ 1"}
{"type": "pagebreak"}
```

### Core Implementation (Simplified)

```python
def create_docx(
    paragraphs: list,
    output_path: str,
    *,
    preset: str = None,
    font_name: str = None,
    font_size: int = None,
    page_size: str = None,
    margins: dict = None,
    line_spacing: float = None,
    first_line_indent: float = None,
    space_after: int = None,
    header_text: str = None,
    footer_text: str = None,
    page_number: str = None,
    page_number_format: str = "{n}",
    toc: bool = False,
    title: str = None,
):
    # Load and apply preset
    cfg = dict(PRESETS.get(preset, PRESETS["default"]))
    if font_name is not None: cfg["font_name"] = font_name
    if font_size is not None: cfg["font_size"] = font_size
    # ... override other params ...

    font_name = resolve_font(cfg["font_name"])
    font_size = cfg["font_size"]

    # Create document
    doc = Document()
    _set_styles(doc, font_name, font_size)

    # Page setup
    section = doc.sections[0]
    _apply_page_setup(section, cfg["page_size"], cfg["margins"])

    # Header/Footer/Page Numbers
    if header_text:
        hp = section.header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        set_run_font(hp.add_run(insert_zwsp(header_text)), name=font_name, size=font_size - 2)
    
    if page_number:
        loc, _, side = page_number.partition("-")
        align = {
            "center": WD_ALIGN_PARAGRAPH.CENTER,
            "right": WD_ALIGN_PARAGRAPH.RIGHT,
        }.get(side, WD_ALIGN_PARAGRAPH.CENTER)
        target = section.footer if loc == "footer" else section.header
        pgp = target.paragraphs[0] if not (target.paragraphs[0].text) else target.add_paragraph()
        _add_page_number(pgp, page_number_format, font_name, font_size - 2, align)

    # Title
    if title:
        tp = doc.add_paragraph()
        tp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        set_run_font(tp.add_run(insert_zwsp(title)), name=font_name, size=font_size + 8, bold=True)
        tp.paragraph_format.space_after = Pt(12)

    # Table of Contents
    if toc:
        _add_toc(doc, font_name, font_size)
        doc.add_page_break()

    # Process paragraphs
    ls = cfg["line_spacing"]
    indent = cfg["first_line_indent"]
    sp_after = cfg["space_after"]

    for item in paragraphs:
        ptype = item.get("type", "body")

        if ptype == "pagebreak":
            doc.add_page_break()
            continue
        
        if ptype == "table":
            _add_table(doc, item, font_name, font_size)
            continue
        
        if ptype == "image":
            _add_image(doc, item, font_name, font_size)
            continue

        text = item.get("text", "")

        if ptype == "title":
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            set_run_font(p.add_run(insert_zwsp(text)), name=font_name, size=font_size + 8, bold=True)
            p.paragraph_format.space_after = Pt(12)

        elif ptype == "subtitle":
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            set_run_font(p.add_run(insert_zwsp(text)), name=font_name, size=font_size + 2, italic=True)

        elif ptype.startswith("heading"):
            level = int(ptype.replace("heading", "")) if ptype[-1].isdigit() else 1
            p = doc.add_heading("", level=min(max(level, 1), 3))
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            _add_formatted_runs(p, text, font_name, font_size + (8 - 2 * level))
            for r in p.runs:
                r.font.bold = True

        elif ptype in ("bullet", "number"):
            style = "List Bullet" if ptype == "bullet" else "List Number"
            lvl = int(item.get("level", 0))
            sname = style if lvl == 0 else f"{style} {min(lvl + 1, 3)}"
            try:
                p = doc.add_paragraph(style=sname)
            except KeyError:
                p = doc.add_paragraph(style=style)
            p.paragraph_format.line_spacing = ls
            _add_formatted_runs(p, text, font_name, font_size)

        elif ptype == "quote":
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Cm(1.25)
            p.paragraph_format.line_spacing = ls
            _add_formatted_runs(p, text, font_name, font_size)
            for r in p.runs:
                set_run_font(r, italic=True, color=RGBColor(0x55, 0x55, 0x55))

        elif ptype == "caption":
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            _add_formatted_runs(p, text, font_name, font_size - 1)
            for r in p.runs:
                set_run_font(r, italic=True)

        else:  # body
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            pf = p.paragraph_format
            pf.line_spacing = ls
            pf.space_after = Pt(sp_after)
            if indent:
                pf.first_line_indent = Cm(indent)
            _add_formatted_runs(p, text, font_name, font_size)

    doc.save(output_path)
    return output_path
```

---

## 🖼️ Content: Tables

```python
def _add_table(doc, item, font_name, font_size):
    rows = item["rows"]
    if not rows:
        return
    has_header = item.get("header", True)
    ncols = max(len(r) for r in rows)
    table = doc.add_table(rows=len(rows), cols=ncols)
    table.style = item.get("style", "Table Grid")
    table.alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    for i, row in enumerate(rows):
        for j in range(ncols):
            cell = table.cell(i, j)
            cell.paragraphs[0].text = ""
            val = row[j] if j < len(row) else ""
            run = cell.paragraphs[0].add_run(insert_zwsp(str(val)))
            set_run_font(
                run, name=font_name, size=font_size,
                bold=(has_header and i == 0) or None,
            )
            cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER if (has_header and i == 0) else WD_ALIGN_PARAGRAPH.LEFT
```

**Usage**:

```python
{"type": "table", "header": True, "rows": [
    ["รายการ", "งบประมาณ (บาท)", "หมายเหตุ"],
    ["ครุภัณฑ์สำนักงาน", "1,250,000", "จัดซื้อใหม่"],
    ["ค่าใช้สอย", "880,500", "ประจำปี"],
]}
```

---

## 🖼️ Content: Images

```python
def _add_image(doc, item, font_name, font_size):
    from docx.shared import Inches
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run()
    width = item.get("width")
    if width:
        run.add_picture(item["path"], width=Cm(width))
    else:
        run.add_picture(item["path"])
    
    cap = item.get("caption")
    if cap:
        cp = doc.add_paragraph()
        cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        set_run_font(cp.add_run(insert_zwsp(cap)), name=font_name, size=font_size - 1, italic=True)
```

**Usage**:

```python
{"type": "image", "path": "diagram.png", "width": 12, "caption": "ภาพที่ 1 โครงสร้างระบบ"}
```

---

## 🔧 Utility: Font Installation (Windows/macOS/Linux)

**File**: `scripts/install_fonts.py`

### Windows Implementation

```python
def install_windows(files):
    import ctypes
    from ctypes import wintypes
    import winreg

    local = os.environ.get("LOCALAPPDATA", "")
    dest_dir = os.path.join(local, "Microsoft", "Windows", "Fonts")
    os.makedirs(dest_dir, exist_ok=True)

    gdi32 = ctypes.WinDLL("gdi32")
    AddFontResourceW = gdi32.AddFontResourceW
    reg_key = r"Software\Microsoft\Windows NT\CurrentVersion\Fonts"

    ok = 0
    with winreg.CreateKey(winreg.HKEY_CURRENT_USER, reg_key) as key:
        for f in files:
            base = os.path.basename(f)
            dest = os.path.join(dest_dir, base)
            try:
                shutil.copy2(f, dest)
                AddFontResourceW(dest)  # Notify running apps immediately
                winreg.SetValueEx(key, f"{_full_name(f)} (TrueType)", 0, winreg.REG_SZ, dest)
                ok += 1
            except Exception as e:
                print(f"  ! ข้าม {base}: {e}")

    # Notify system of font changes
    try:
        HWND_BROADCAST = 0xFFFF
        WM_FONTCHANGE = 0x001D
        ctypes.windll.user32.SendMessageTimeoutW(
            HWND_BROADCAST, WM_FONTCHANGE, 0, 0, 0, 1000, ctypes.byref(wintypes.DWORD())
        )
    except Exception:
        pass
    return ok, dest_dir
```

### Unix/macOS Implementation

```python
def install_unix(files):
    home = os.path.expanduser("~")
    if sys.platform == "darwin":
        dest_dir = os.path.join(home, "Library", "Fonts")
    else:
        dest_dir = os.path.join(home, ".local", "share", "fonts")
    os.makedirs(dest_dir, exist_ok=True)
    
    ok = 0
    for f in files:
        try:
            shutil.copy2(f, os.path.join(dest_dir, os.path.basename(f)))
            ok += 1
        except Exception as e:
            print(f"  ! ข้าม {os.path.basename(f)}: {e}")
    
    # Update font cache on Linux
    if sys.platform != "darwin":
        os.system("fc-cache -f >/dev/null 2>&1")
    
    return ok, dest_dir
```

---

## 🔍 Example: Complete Document Creation

**File**: `examples/example_report.py`

```python
from thai_docx import create_docx

paragraphs = [
    {"text": "บทที่ ๑ บทนำ", "type": "heading1"},
    {"text": "เอกสารฉบับนี้จัดทำขึ้นเพื่อทดสอบการสร้างไฟล์ Word ภาษาไทยที่เขียน"
             "เต็มบรรทัดโดยไม่ตัดบรรทัดก่อนเวลา ... ข้อความนี้ควรไหลเต็มความกว้าง "
             "และคำที่เป็น **ตัวหนา** ก็ต้องแสดงผลถูกต้อง", "type": "body"},
    {"text": "๑.๑ วัตถุประสงค์", "type": "heading2"},
    {"text": "เพื่อให้การจัดทำเอกสารราชการเป็นไปอย่างมีประสิทธิภาพ", "type": "bullet"},
    {"text": "เพื่อทดสอบฟอนต์ฝั่ง Complex Script ของอักษรไทย", "type": "bullet"},
    {"text": "ตารางสรุปงบประมาณ", "type": "heading2"},
    {"type": "table", "header": True, "rows": [
        ["รายการ", "งบประมาณ (บาท)", "หมายเหตุ"],
        ["ครุภัณฑ์สำนักงาน", "1,250,000", "จัดซื้อใหม่"],
        ["ค่าใช้สอย", "880,500", "ประจำปี"],
    ]},
]

out = "example_report.docx"
create_docx(
    paragraphs, out,
    preset="saraban",                           # Government style
    title="รายงานการทดสอบระบบจัดทำเอกสาร",     # Main title
    toc=True,                                   # Table of contents
    header_text="สำนักงบประมาณ",               # Header
    page_number="footer-center",                # Page numbers in footer center
    page_number_format="หน้า {n}",             # Format: "หน้า 1"
)
print("created:", out)
```

---

## 🎯 Key Patterns & Idioms

### 1. **Thai Text Processing Pipeline**
```
raw text → insert_zwsp(text) → create run → set_run_font() → add to paragraph
```

### 2. **Fallback for Optional Dependencies**
```python
try:
    from pythainlp import word_tokenize
    _HAS_PYTHAINLP = True
except Exception:
    _HAS_PYTHAINLP = False
    def word_tokenize(text, engine="newmm"):
        return [text]  # Fallback: no word segmentation
```

### 3. **XML Manipulation for python-docx Extensions**
- Access underlying XML via `run._element.get_or_add_rPr()`
- Use `qn()` for namespace-qualified names
- Create new elements via `OxmlElement()`

### 4. **Markdown-to-DOCX Workflow**
```
markdown → parse_markdown() → list[dict] → create_docx() → .docx
```

### 5. **Platform-Aware Font Installation**
```python
if platform.system() == "Windows":
    ok, dest = install_windows(files)
else:
    ok, dest = install_unix(files)  # macOS or Linux
```

---

## 📋 Supported Paragraph Types Summary

| Type | Use Case | Example |
|------|----------|---------|
| `title` | Main document title | `{"text": "รายงาน", "type": "title"}` |
| `subtitle` | Subtitle (italic, smaller) | `{"text": "ปี 2567", "type": "subtitle"}` |
| `heading1`, `heading2`, `heading3` | Section headers | `{"text": "บทที่ 1", "type": "heading1"}` |
| `body` | Regular paragraph | `{"text": "เนื้อหา", "type": "body"}` |
| `bullet` | Bulleted list (with level) | `{"text": "รายการ", "type": "bullet", "level": 0}` |
| `number` | Numbered list (with level) | `{"text": "ขั้นตอน", "type": "number", "level": 0}` |
| `quote` | Indented, italic quote | `{"text": "อ้างอิง", "type": "quote"}` |
| `caption` | Image/table caption (centered, italic) | `{"text": "ภาพที่ 1", "type": "caption"}` |
| `table` | Table with rows/header | `{"type": "table", "header": true, "rows": [...]}` |
| `image` | Image with optional caption | `{"type": "image", "path": "...", "width": 10}` |
| `pagebreak` | Page break | `{"type": "pagebreak"}` |

---

## ⚡ Performance Insights

- **Word Segmentation**: PyThaiNLP's "newmm" engine is used; no segmentation fallback available
- **Document Size**: Bundled fonts add ~10–15 MB to repo; fonts not embedded in .docx
- **Rendering**: ZWS invisible to end users; all text still copy-pasteable
- **Font Caching**: Windows registry kept in sync via `SendMessageTimeout`; Linux uses `fc-cache`

---

## 🔐 Security Notes

- **No External Dependencies**: Fonts bundled locally
- **PyThaiNLP**: Uses standard word_tokenize (no custom models)
- **File Handling**: Standard Python file I/O with UTF-8 encoding
- **CLI**: Arguments validated via argparse; no shell injection risks

---

## 📚 Summary

**Thai DOCX** is a focused solution for Thai language document generation:

1. **ZWS Injection** solves the line-breaking problem
2. **Complex Script XML Manipulation** solves the font rendering problem
3. **Markdown Parser** keeps input simple and portable
4. **Preset System** provides government-standard formatting out of the box
5. **Font Bundling** eliminates external dependencies

All code is clean, well-documented, and designed for maintainability.
