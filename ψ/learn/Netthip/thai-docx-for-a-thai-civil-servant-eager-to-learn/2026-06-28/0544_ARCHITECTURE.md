# Thai DOCX — Architecture Analysis

**Project**: thai-docx-for-a-thai-civil-servant-eager-to-learn  
**Version**: 2.1.0  
**Language**: Python 3.8+  
**Purpose**: Create Thai language Word documents with proper line breaking, font rendering, and government document formatting  
**Analysis Date**: 2026-06-28

---

## Executive Summary

**Thai DOCX** is a Python utility that solves two critical problems in Thai-language document generation:

1. **Thai text line breaking** — Thai has no word spaces, so generic Word generators break lines prematurely, creating narrow rightmost columns. Solution: inject Zero-Width Spaces (U+200B) between words using language segmentation.

2. **Thai font rendering** — The `python-docx` library only sets ASCII/hAnsi font properties, ignoring the Complex Script (cs) attribute that Thai actually uses. Solution: set font properties at the XML level for all four text properties (ascii, hAnsi, cs, eastAsia).

The system supports 10 government-approved Thai fonts, three page layout presets (government document, report, book), and rich document structures (TOC, page numbers, tables, images, headings).

---

## Directory Structure & File Organization

```
origin/
├── scripts/
│   ├── thai_docx.py          [693 lines] Core module — document creation, font handling, markdown parsing
│   └── install_fonts.py       Helper script for installing bundled fonts system-wide
│
├── examples/
│   ├── example_report.py      Demonstration of programmatic API usage
│   └── sample_input.md        Example markdown input file
│
├── fonts/                     10 Thai government fonts (4 variants each = 40 .ttf files)
│   ├── national/              TH Sarabun, Krub, KoHo, Niramit AS, Kodchasal, Baijam, Chakra Petch, Fahkwang, K2D July8, Mali Grade6
│   ├── it9-variant/           IT9-compatible variants (for Thai numerals)
│   └── LICENSE-NATIONAL-FONTS.txt
│
├── README.md                  User-facing documentation (Thai language)
├── SKILL.md                   Skill registry metadata for Claude Code
├── CHANGELOG.md               Version history
├── LICENSE                    MIT License
└── requirements.txt           Dependencies: python-docx >= 1.0.0, pythainlp >= 4.0.0
```

---

## Core Modules & Abstractions

### 1. **Font Management Layer** (`thai_docx.py: lines 47-89`)

**Purpose**: Normalize font names and resolve aliases across multiple naming conventions.

**Components**:
- `BUNDLED_FONTS` — Registry mapping short keys to font family names (e.g., `"krub"` → `"TH Krub"`)
- `_FONT_ALIASES` — Handles common misspellings (e.g., `"th sarabun new"` → `"TH Sarabun New"`)
- `resolve_font(name)` — Converts user input (short key, full name, alias) to canonical font name
- `list_bundled_fonts()` — Returns available fonts for CLI `--list-fonts` command

**Key Design**: Single point of truth for font names. Users can specify fonts three ways:
1. Short key: `--font krub`
2. Full name: `--font "TH Krub"`
3. Common alias: `--font "sarabun new"`

All resolve to the same internal font family name that Word recognizes.

---

### 2. **Thai Text Processing Layer** (`lines 130-145`)

**Purpose**: Insert word-boundary hints into Thai text without changing visual appearance.

**Components**:
- `ZWS` — Constant: `U+200B` (Zero-Width Space)
- `_THAI_RUN` — Regex pattern matching Thai Unicode blocks (฀–๿)
- `insert_zwsp(text, engine="newmm")` — Core function:
  1. Split text into Thai and non-Thai runs
  2. For Thai runs only: tokenize words using `pythainlp.word_tokenize()`
  3. Join tokens with ZWS between them
  4. Return reassembled text (unchanged visual appearance, but Word can break at ZWS points)

**Fallback**: If `pythainlp` not installed, returns text unchanged (still functional, but line breaking may not be optimal).

**Key Design**: Non-invasive — ZWS is invisible, zero-width, doesn't alter font metrics or line height. Purely informational for the layout engine.

---

### 3. **Font XML Layer** (`lines 151-196`)

**Purpose**: Bypass `python-docx` limitations by setting all font properties at the XML element level.

**Components**:
- `set_run_font(run, name, size, bold, italic, color)` — Manipulates `run._element.rPr` (run properties) directly:
  - Sets `w:rFonts` element with all four attributes: `w:ascii`, `w:hAnsi`, `w:cs`, `w:eastAsia`
  - Sets `w:sz` (normal size, half-points) and `w:szCs` (Complex Script size, same unit)
  - Sets `w:b` / `w:bCs` (bold/bold Complex Script)
  - Sets `w:i` / `w:iCs` (italic/italic Complex Script)

**Why Needed**: The `python-docx` library's `run.font.name` only sets `w:ascii` and `w:hAnsi`. Thai text uses `w:cs` (Complex Script), which remains untouched. Result: font changes don't apply on some machines.

**Key Design**: Low-level XML manipulation ensures complete font control. Used throughout the pipeline whenever text is added to a paragraph.

---

### 4. **Markdown Styling Layer** (`lines 199-243`)

**Purpose**: Parse inline Markdown-style markup (`**bold**`, `*italic*`) into styled runs.

**Components**:
- `_BOLD` / `_ITALIC` — Regex patterns to detect bold/italic markers
- `_add_formatted_runs(paragraph, text, font_name, font_size)` — Tokenization + rendering:
  1. Parse text into segments: `[(style, text), ...]`
  2. For each segment, call `insert_zwsp()` and create a run
  3. Apply bold/italic via `set_run_font()` with appropriate flags

**Key Design**: Preserves styling during Thai text processing. The ZWS insertion happens at the run level, preserving styling boundaries.

---

### 5. **Page Layout Presets** (`lines 93-125`)

**Purpose**: Encapsulate document formatting configurations for common use cases.

**Three Presets**:

| Preset | Font | Size | Top/Bottom/L/R Margins | Line Spacing | First-Line Indent | Use Case |
|--------|------|------|----------------------|--------------|-------------------|----------|
| `saraban` | TH Sarabun New | 16pt | 2.5/2.0/3.0/2.0 cm | 1.0 | 1.25 cm | Government documents (official form) |
| `default` | TH Sarabun New | 14pt | 2.54 cm all | 1.5 | — | General reports |
| `book` | TH Sarabun New | 16pt | 2.54/2.54/3.0/2.54 cm | 1.3 | 1.25 cm | Articles/books |

**Key Design**: Preset = dict of config → user can override any value individually. Preset acts as a template, not a constraint.

---

### 6. **Document Field Helpers** (`lines 248-299`)

**Purpose**: Insert Word field codes (page numbers, TOC) that update dynamically in Word.

**Components**:
- `_add_field(paragraph, instr, font_name, font_size)` — Low-level field insertion:
  - Creates field structure: `<w:fldChar type="begin">` + `<w:instrText>` + `<w:fldChar type="end">`
  - Applies font properties to the field run
- `_add_page_number(paragraph, fmt, font_name, font_size, align)` — Page number formatter:
  - Tokenizes format string by `{n}` (current page) and `{total}` (total pages)
  - For each token: insert field code or plain text with ZWS
  - Examples: `"หน้า {n}"` → "หน้า " + PAGE field; `"{n}/{total}"` → PAGE + "/" + NUMPAGES
- `_add_toc(doc, font_name, font_size, title)` — TOC insertion:
  - Adds title (centered, larger)
  - Inserts TOC field with options: `\o "1-3" \h \z \u`
  - Adds help text (gray, italic) instructing user to update field (Ctrl+A, F9)

**Key Design**: Fields are live in Word — automatically update when document is opened or refreshed. TOC title and notes are static.

---

### 7. **Paragraph Builders** (`lines 352-390`)

**Purpose**: Render different content types (tables, images, text blocks) into document elements.

**Components**:
- `_add_table(doc, item, font_name, font_size)` — Table rendering:
  - Create table from row array
  - Apply font to all cells, with bold for header row
  - Center-align header, left-align data
  - Each cell text gets `insert_zwsp()`
- `_add_image(doc, item, font_name, font_size)` — Image + caption:
  - Add image centered
  - If width specified, resize to width in cm
  - Add italic caption text below (gray, smaller font)

**Key Design**: Each builder receives the full item dict and extracts required fields. Consistent font/styling applied uniformly.

---

### 8. **Document Creation Pipeline** (`lines 395-564`)

**Purpose**: Main orchestrator that ties all layers together.

**Function**: `create_docx(paragraphs, output_path, **config)`

**Input**: List of paragraph dicts, each with `type` (body, heading1-3, title, subtitle, bullet, number, quote, caption, table, image, pagebreak) and optional metadata.

**Config**: Preset name, or individual overrides (font_name, font_size, margins, line_spacing, etc.)

**Processing Steps**:
1. **Load preset or defaults** → merge with user overrides
2. **Create document** → set default styles (Normal, Heading 1-3) at XML level for full font control
3. **Apply page setup** — margins, page size (A4/Letter)
4. **Add header/footer** — optional text, page numbers with field codes
5. **Add title** — centered, large, bold (if provided)
6. **Add TOC** — if `toc=True`, insert table of contents with pagebreak
7. **Add paragraphs** — iterate through items:
   - **body**: left-aligned, line spacing, optional first-line indent, ZWS-processed
   - **title/subtitle**: centered, bold/italic, larger font
   - **heading1-3**: uses `doc.add_heading()` style, bold, sized appropriately
   - **bullet/number**: uses Word list styles, supports nested levels
   - **quote**: left-indented, italic, gray color
   - **caption**: centered, italic, smaller
   - **table**: calls `_add_table()`
   - **image**: calls `_add_image()`
   - **pagebreak**: `doc.add_page_break()`
8. **Save** → `doc.save(output_path)`

**Returns**: output_path (for confirmation/chaining)

**Key Design**: Functional decomposition — each paragraph type has isolated logic. Table/image handling delegates to specialized builders. Font + ZWS applied consistently.

---

### 9. **Markdown Parser** (`lines 570-627`)

**Purpose**: Convert plain-text markdown into structured paragraph list for API consumption.

**Input**: Raw markdown string with optional formatting.

**Syntax Recognized**:
- `# Heading1`, `## Heading2`, `### Heading3` → heading type
- `- item` or `* item` → bullet
- `1. item` or `1) item` → number
- `1.2.3 text` (numeric outline) → heading, depth = dots + 1, capped at 3
- Blank lines → paragraph break
- Inline `**bold**` / `*italic*` → preserved as-is in text field (parsed by `_add_formatted_runs`)

**Output**: List of dicts with `type` and `text` keys, ready for `create_docx()`.

**Key Design**: Simple state machine (buffer + flush pattern). Does not parse inline formatting; leaves that to `_add_formatted_runs()`.

---

### 10. **CLI Entry Point** (`lines 641-692`)

**Purpose**: Command-line interface for batch document generation.

**Arguments**:
- `input` — markdown/text file path
- `-o/--output` — output .docx file (default: `output.docx`)
- `--preset` — layout template (saraban | default | book)
- `--font` — font name or key (overrides preset)
- `--size` — font size in pt (overrides preset)
- `--title` — document title on first page
- `--toc` — include table of contents
- `--page-number` — page number placement (footer-center, footer-right, header-right)
- `--header` — header text
- `--footer` — footer text
- `--list-fonts` — show available fonts and exit

**Flow**:
1. Parse arguments
2. If `--list-fonts`, print font registry and exit
3. Otherwise, open input file, call `parse_markdown()`, then `create_docx()` with CLI args
4. Warn if `pythainlp` not installed (ZWS insertion still works, but line breaking suboptimal)
5. Print success message with output path

**Key Design**: CLI wraps the Python API cleanly. All CLI options map directly to `create_docx()` parameters.

---

## Dependency Map

```
Thai DOCX
├── python-docx >= 1.0.0
│   └── [XML manipulation, document structure, styles, fields]
│
├── pythainlp >= 4.0.0 (optional, graceful fallback)
│   └── word_tokenize(text, engine="newmm")
│       └── [Word segmentation for Thai language]
│
└── Standard Library
    ├── re              [Regex for Thai text detection, markdown parsing]
    ├── sys             [argv, stdout encoding]
    ├── argparse        [CLI argument parsing]
    └── docx submodules [Pt, Cm, RGBColor, enums, XML namespaces]
```

**Optional Dependency**: `pythainlp` is imported with try/except. If missing, `word_tokenize()` falls back to identity function (returns text as single token). Document still renders, but ZWS injection is limited.

---

## Design Patterns

### 1. **Facade Pattern**
- `create_docx()` abstracts away XML manipulation, font handling, field codes
- Users see clean dict-based paragraph API

### 2. **Strategy Pattern**
- Presets (saraban, default, book) = different formatting strategies
- User can swap preset or override individual settings

### 3. **Builder Pattern**
- `_add_table()`, `_add_image()` are specialized builders for complex content types
- Each builder receives item dict and config, returns nothing (mutates doc in-place)

### 4. **Adapter Pattern**
- `resolve_font()` adapts multiple naming conventions to canonical font names
- `set_run_font()` adapts python-docx's limited API to full XML capabilities

### 5. **Registry Pattern**
- `BUNDLED_FONTS` and `_FONT_ALIASES` are lookup registries
- Enable flexible font selection without hardcoding values

### 6. **Graceful Degradation**
- `pythainlp` optional — if missing, system still works (just with coarser ZWS insertion)
- `_THAI_RUN` regex still identifies Thai text even if word tokenization unavailable

---

## Data Flow Diagram

```
User Input (CLI or Python API)
    ↓
[Preset + Overrides] → Config Dict
    ↓
paragraphs: List[Dict]
    ↓
┌─────────────────────────────────────────────┐
│ create_docx() Orchestrator                  │
├─────────────────────────────────────────────┤
│ 1. Create Document + Set Styles (XML level) │
│ 2. Apply Page Setup (margins, size)         │
│ 3. Add Header/Footer/Page Numbers (fields)  │
│ 4. Add Title (if provided)                  │
│ 5. Add TOC (if requested)                   │
│ 6. For each paragraph:                      │
│    └─ Text → insert_zwsp() → set_run_font() │
│    └─ Table/Image → specialized builders    │
│ 7. Save to .docx                            │
└─────────────────────────────────────────────┘
    ↓
Output: .docx file
```

**Text Processing Sub-Pipeline**:
```
Raw Thai Text
    ↓
_add_formatted_runs()
    ├─ Parse **bold** / *italic* → segments
    ├─ For each segment:
    │   ├─ insert_zwsp() 
    │   │   ├─ Identify Thai runs via _THAI_RUN regex
    │   │   ├─ word_tokenize() (or fallback)
    │   │   └─ Join with ZWS (U+200B)
    │   └─ create run + set_run_font()
    │       └─ Set XML: w:rFonts, w:sz, w:szCs, w:b, w:bCs, etc.
    └─ Result: paragraph with styled runs, full font control
```

---

## Entry Points

### Python API
```python
from thai_docx import create_docx

paragraphs = [...]
create_docx(paragraphs, "output.docx", preset="saraban", toc=True)
```

### CLI
```bash
python scripts/thai_docx.py input.md -o output.docx --preset saraban --toc
```

### Utilities (Importable)
```python
from thai_docx import (
    insert_zwsp,           # Inject ZWS into Thai text
    set_run_font,          # Set run properties at XML level
    resolve_font,          # Convert font alias to canonical name
    list_bundled_fonts,    # Get available fonts
    parse_markdown,        # Convert markdown to paragraph list
)
```

---

## Extensibility Points

### 1. **Custom Presets**
Users can create new presets by calling `create_docx()` with individual parameters instead of preset name:
```python
create_docx(paragraphs, "output.docx", 
    font_name="TH Niramit AS", font_size=15, 
    margins={"top": 2, "bottom": 1.5, "left": 2.5, "right": 2},
    line_spacing=1.2, first_line_indent=1.0)
```

### 2. **New Paragraph Types**
Add new `ptype` handler in the `create_docx()` loop (lines 489–561):
```python
elif ptype == "sidebar":
    # Custom handler for sidebar blocks
    p = doc.add_paragraph()
    # ... custom formatting ...
```

### 3. **Font Registry Extension**
Add fonts to `BUNDLED_FONTS` dict (line 50–61):
```python
BUNDLED_FONTS["custom"] = "My Custom Thai Font"
```

### 4. **Custom Markdown Syntax**
Extend `parse_markdown()` to recognize new patterns (lines 592–620).

### 5. **Word Segmentation Engine**
Change `word_tokenize(..., engine="newmm")` to a different engine supported by PyThaiNLP (e.g., "deepcut", "dict_trie"). Just update the `insert_zwsp()` call (line 142).

---

## Critical Implementation Details

### Complex Script Font Problem (The Core Issue)

```xml
<!-- What python-docx does (INCOMPLETE): -->
<w:rFonts w:ascii="TH Krub" w:hAnsi="TH Krub"/>

<!-- What thai_docx does (COMPLETE): -->
<w:rFonts w:ascii="TH Krub" w:hAnsi="TH Krub" w:cs="TH Krub" w:eastAsia="TH Krub"/>
<w:szCs w:val="32"/>  <!-- w:szCs: complex script size, half-points -->
<w:bCs w:val="true"/> <!-- w:bCs: complex script bold -->
<w:iCs w:val="true"/> <!-- w:iCs: complex script italic -->
```

Thai Unicode blocks (฀–๿) are classified as Complex Script in the OpenType specification. Without setting `w:cs`, some Windows systems use a fallback font, making Thai text invisible or wrongly formatted.

### Zero-Width Space Insertion Strategy

```
Original: "ถ้าหากว่าเราทำงานหนักขึ้น"
          (No spaces; Word doesn't know where Thai words begin/end)

After insert_zwsp():
"ถ้า​หาก​ว่า​เรา​ทำ​งาน​หนัก​ขึ้น"
  ↑ ZWS (invisible)
  
Word now sees potential break points without changing visual appearance.
```

### Markdown Inline Formatting Isolation

Bold/italic parsing must not interfere with ZWS injection. The regex patterns are non-greedy and use negative lookahead/lookbehind to avoid matching nested markers:

```python
_BOLD = re.compile(r"\*\*(.+?)\*\*")                  # Match **...** (non-greedy)
_ITALIC = re.compile(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)")  
         # Match *...* (not **...**), avoiding false positives
```

---

## Performance Characteristics

- **Linear complexity** — O(n) for text processing (single pass for ZWS insertion, markdown parsing)
- **No caching** — Each call to `insert_zwsp()` re-tokenizes Thai text (acceptable for typical documents < 100k chars)
- **Memory**: Minimal — document built in-memory, released on save
- **I/O**: Single write to .docx file at end

**Bottleneck**: Word tokenization (pythainlp) on large documents. For documents > 50k Thai characters, consider batching or async processing.

---

## Known Limitations & Trade-offs

1. **Word Tokenization Accuracy** — Segmentation quality depends on PyThaiNLP dictionary. Rare words or proper nouns may be split incorrectly.
2. **Fallback Mode** — Without pythainlp, ZWS only inserted at crude boundaries (Thai run start/end), not at word boundaries. Document still usable but line breaks may be suboptimal.
3. **Field Code Updates** — TOC and page numbers are Word field codes; require manual refresh (Ctrl+A, F9 or right-click → Update Field) in Word.
4. **Justified Alignment** — Script always uses left alignment for Thai (Justify or THAI_DISTRIBUTE would stretch text undesirably). Not configurable per paragraph.
5. **No Complex Nesting** — Bullet lists support 3 levels max; deeper nesting not supported.

---

## Testing Entry Points

To verify architecture understanding:

1. **Font handling** — Test `resolve_font()` with various inputs:
   ```python
   assert resolve_font("krub") == "TH Krub"
   assert resolve_font("TH Sarabun New") == "TH Sarabun New"
   ```

2. **ZWS injection** — Check output visually (no visual change) and verify presence of U+200B:
   ```python
   result = insert_zwsp("สวัสดี")
   assert "​" in result  # ZWS is present
   ```

3. **Markdown parsing** — Verify paragraph type detection:
   ```python
   parsed = parse_markdown("# Heading\n- bullet item")
   assert parsed[0]["type"] == "heading1"
   assert parsed[1]["type"] == "bullet"
   ```

4. **E2E document creation** — Generate sample .docx, open in Word, verify:
   - Thai text fills lines completely (no premature wrapping)
   - Font visually consistent across document
   - TOC and page numbers present and updateable

---

## Maintenance & Evolution

### Versioning Strategy
- **Patch (2.1.x)**: Bug fixes, font additions
- **Minor (2.x)**: New features (paragraph types, presets), non-breaking API changes
- **Major (3.x)**: API breaking changes, Python version bump

### Key Maintainability Points
- `BUNDLED_FONTS` registry must stay in sync with `fonts/` directory
- `_FONT_ALIASES` should grow as user feedback reveals common misspellings
- Preset configs are in one place (PRESETS dict) for easy updates
- XML attribute handling (`w:cs`, `w:szCs`, etc.) is DRY in `set_run_font()`

### Testing Recommendations
1. Unit tests for `insert_zwsp()`, `resolve_font()`, `parse_markdown()`
2. Integration tests for document creation with various presets
3. Visual regression tests (generate reference .docx files, compare with new output)
4. Compatibility tests across Word versions (2013, 2016, 2019, Office 365)

---

## Summary Table

| Aspect | Details |
|--------|---------|
| **Language** | Python 3.8+ |
| **LOC (main)** | ~693 lines (scripts/thai_docx.py) |
| **Primary Library** | python-docx 1.0+ |
| **Optional Dep** | pythainlp 4.0+ (gracefully degrades if absent) |
| **Entry Points** | CLI (main), Python API (create_docx), utilities (insert_zwsp, set_run_font) |
| **Core Abstractions** | Font registry, Thai text processor, XML font setter, preset presets, field builders, markdown parser |
| **Paragraph Types** | 12 (body, title, subtitle, heading1-3, bullet, number, quote, caption, table, image, pagebreak) |
| **Supported Fonts** | 10 bundled Thai government fonts + aliases for common misspellings |
| **Page Presets** | 3 (saraban/government, default/report, book/article) |
| **Field Support** | TOC (auto-updating), page numbers with custom format, headers/footers |
| **Markdown Support** | Headings (#–###), bullets (-/*), numbers (1./1)), inline **bold**/*italic* |
| **Key Innovation** | Zero-Width Space injection + complete XML font control = proper Thai rendering |
| **Deployment** | Package distributed via GitHub; install via `pip install -r requirements.txt` |
| **License** | MIT (permissive, can use/modify/redistribute) |

---

**Document Generated by**: Codex Oracle — The Silent Cartographer 🦉  
**Architecture Review Complete**: All layers mapped, dependencies identified, design patterns documented.
