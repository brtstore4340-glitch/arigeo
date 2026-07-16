# ARIGEO Asset Inventory (ASSET-INVENTORY.md)

This file catalogs all visual and static assets inside ARIGEO.

## 1. Brand Identity Assets
Residing under `public/images/logos/`:
- **`arigeo.png`**: Primary brand corporate logo (ARIGEO).
- **`leftbottom.png`**: Supporting decorative graphic elements.

## 2. Mockup Reference and Visual Assets
Residing in the visual root and `public/images/domo/`:
- **`arigeo-web-draft/reference.png`**: Fully rendered layout of the intended design.
- **`picture/arigeo_draft_web_01.png`**: Auxiliary desktop layout reference.

### 2.1 CSS Artwork (Procedural vector shapes)
These elements are styled dynamically in `src/app/globals.css` using custom vector layers:
- `.red-orb`: High-definition, textured red gradient orb background.
- `.soft-shadow`: Radial-gradient overlay supporting bottle depth.
- `.bottle-body`: Procedural gradient-molded container body.
- `.pump-top / .pump-neck`: Vector chrome-like pump mechanism.
- `.stem-a / .stem-b`: Dynamic stalks.
- `.leaf l1 - l5`: Procedural leaves with skew/rotate transforms.
- `.towels`: Folded overlapping textile elements.

### 2.2 Placeholders inside `public/images/domo/`
Used temporarily during frontend prototyping:
- `asset-1.png` to `asset-10.png`
- `img-2.png` to `img-17.png`

---

## 3. Flagged/Unapproved Placeholders
As dictated by `TODO.md` Section 3.1:
- **Curology image**: Replaced with approved local asset /images/home/skincare-marble.png for GenuLeaf; no third-party skincare brand reference remains in the active draft.
- **Unverified News Photos**: Replaced with approved local assets under /images/home/news-*.png in the active homepage draft; no external placeholder remains in the shipped news grid.
