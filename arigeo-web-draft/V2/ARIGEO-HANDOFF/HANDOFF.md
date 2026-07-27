# HANDOFF — ARIGEO Corporate Website

## Objective

แก้ source จาก ZIP นี้ให้เป็น corporate website ที่:

- Credible like a corporate site
- Clear like a brand gateway
- Flexible for future launches
- Visually aligned with the red-circle target mockup
- Structured for Payload CMS and TH/EN

## Brief synthesis

ARIGEO มี 3 brand families:

- Captainmaid — Household
- GenuLeaf — Skincare
- CeraTory — Derma skincare

Website ต้องเชื่อม corporate story ไปยัง brand/product discovery โดยไม่กลายเป็น heavy e-commerce site.

## Visual direction

- White space สูง
- Strong black typography
- Confident ARIGEO red signal
- Soft neutral backgrounds
- Green is a supporting nature cue only
- Photography: bright home rituals, clean product still life, skin/nature texture and light lab/science moments
- Interface: calm and organized like Kao-inspired IA, but bolder ARIGEO contrast


## Mandatory removal instruction

Base44 is not a temporary dependency and not an approved fallback. The implementation agent must keep all Base44 packages, plugins, config, environment variables, API calls, auth flows and deployment tooling out of the repository. Any reintroduction is a handoff failure.

## Build strategy

### Stage 1 — Stabilize

ยืนยันว่า baseline ที่ลบ Base44 และ public auth gate แล้วสามารถ install/build ได้ จากนั้น capture baseline screenshots. ห้ามเพิ่ม Base44 กลับมา.

### Stage 2 — Pixel-match homepage

Implement target from top to bottom. Do not parallelize files that share layout tokens until foundations are stable.

Recommended ownership sequence:

1. Design tokens + layout primitives
2. Header + Hero
3. Category cards + Value panel
4. News + Newsletter + Footer
5. Responsive QA

### Stage 3 — Routes and content templates

Create all sitemap pages with fixture data first, then connect CMS.

### Stage 4 — Payload CMS

Model content, localization, preview, media, SEO and forms. Generate types instead of hand-writing duplicate interfaces.

### Stage 5 — Release hardening

Accessibility, visual regression, performance, analytics, forms, security and deployment/rollback.

## File-level implementation map

| Existing file | Planned action |
|---|---|
| `src/App.jsx` | Replace auth-gated tree with public locale routes |
| `src/components/Navigation.jsx` | Rebuild exact header and language/search behavior |
| `src/components/Hero.jsx` | Rebuild red-circle composition and responsive behavior |
| `src/components/ContentSplit.jsx` | Convert to image-overlay category gateways |
| `src/components/ValueProps.jsx` | Convert to one bordered three-column trust panel |
| `src/components/NewsStories.jsx` | CMS-driven bordered editorial cards |
| `src/components/Newsletter.jsx` | Real form integration and horizontal target layout |
| `src/components/Footer.jsx` | Light footer + black legal strip; real routes |
| `src/lib/siteData.js` | Replace hard-coded data with typed fixtures, then CMS client |
| `src/index.css` | Normalize tokens, typography, focus and accessibility utilities |
| `vite.config.js` | Keep React-only Vite config; Base44 plugin is prohibited |
| `package.json` | Keep Base44 packages absent; add only approved web/CMS tooling |
| public route tree | Keep routes public; do not restore the removed Base44 auth gate |

## Suggested new structure

```text
apps/
  web/
    src/
      components/
      features/
      pages/
      routes/
      lib/
      styles/
  cms/
    src/
      collections/
      globals/
      hooks/
      access/
packages/
  content-types/
  ui/
handoff/
```

A full move to monorepo should be one explicit, reversible batch after the existing frontend builds cleanly.

## Content ownership notes from brief

- About/ARIGEO Way: business owner content required
- Brand/product data: graphic/marketing team
- Claims: must have substantiation and approval
- Final contact details: UNKNOWN placeholder in brief; do not publish placeholders

## Required evidence per implementation batch

- Changed file list
- Why each change is necessary
- Screenshot or DOM evidence where visual
- `lint`, `typecheck`, `build` outputs
- Regression notes
- Remaining UNKNOWN inputs
- Rollback instructions

## Handoff package integrity

Base44 runtime, config, auth scaffold and legacy documents were intentionally removed from this handoff. Do not restore them.
