# Asset Manifest

## Supplied references

| File | Purpose | Production use |
|---|---|---|
| `references/target-red-circle.png` | Homepage visual target | Reference only |
| `references/current-deployed-2026-07-16.png` | Current-state comparison | Reference only |
| `references/Arigeo-Brief.pptx` | Business/UX/content brief | Reference only |

## Existing source asset status

`src/lib/siteData.js` references remote generated images. The ZIP contains no local production assets.

## Required approved assets

Suggested stable filenames:

```text
public/brand/arigeo-logo-black-red.svg
public/brand/arigeo-mark-red.svg
public/home/hero-products-desktop.webp
public/home/hero-products-tablet.webp
public/home/hero-products-mobile.webp
public/home/category-household.webp
public/home/category-skincare.webp
public/news/news-corporate.webp
public/news/news-product.webp
public/news/news-sustainability.webp
public/news/news-lifestyle.webp
```

Brand/CMS media should use semantic IDs rather than generated random filenames.

## Image requirements

- Provide source master at sufficient resolution
- Generate AVIF/WebP plus safe fallback where needed
- Store width, height and focal point
- Meaningful alt text per locale
- Product labels/logos must be accurate and approved
- No invented certification seals or claims
- Keep image licensing/source metadata

## Hero art direction

- Same product packshot family across responsive variants
- Solid ARIGEO red circle, not a soft blur
- Clean white/neutral surface
- Plant/towels are secondary props
- Reserve left safe area for copy on desktop
- On mobile, crop around products without hiding labels
