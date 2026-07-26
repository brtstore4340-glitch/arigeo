# CMS Page Builder — frontend contract

This file is the contract between the ARIGEO frontend and the Payload CMS for
drag-and-drop pages. Environment variables, CORS and CSRF setup are documented
in `WIRING.md`; this file only covers the page-builder data shape.

| Side | Repo | Key files |
| --- | --- | --- |
| Frontend | `arigeo` | `src/app/[locale]/[...slug]/page.tsx`, `src/components/blocks/RenderBlocks.tsx`, `src/components/blocks/CmsSection.tsx`, `src/lib/cmsPages.ts`, `src/lib/blockStyles.ts`, `src/components/Animate.tsx` |
| CMS | `cms-arigeo` | `src/collections/Pages.ts`, `src/collections/Sections.ts`, `src/fields/presentation.ts`, `src/blocks/index.ts` |

## 1. Request flow

1. A visitor opens `/{locale}/{...slug}`.
2. Hand-written routes (`/products`, `/brands`, `/newsroom`, ...) always win.
3. Anything left over falls through to the catch-all route, which calls
   `getCmsPage(slug)` from `src/lib/cmsPages.ts`.
4. That helper requests
   `GET {NEXT_PUBLIC_CMS_URL}/api/pages?where[slug][equals]=...&where[site][equals]=arigeo&depth=2&limit=1`.
5. The returned `layout` array is handed to `RenderBlocks`, which renders one
   `<section>` per block.
6. Output is cached and revalidated every 60 seconds
   (`NEXT_PUBLIC_CMS_REVALIDATE`).

Every fetch fails soft: a network error, a 403 or a 500 logs a `[cms]` warning
and resolves to `null`, so a CMS outage cannot take the site down. A slug with
no published page returns 404 through `notFound()`.

## 2. Collections the frontend expects

### 2.1 `pages`

| Field | Type | Notes |
| --- | --- | --- |
| `title` | text | required, metadata title fallback |
| `slug` | text | unique per site, no leading slash. `home`, `index` and an empty value all normalise to `home` |
| `site` | select | `arigeo` or `captain-maid`, so one CMS can serve both sites |
| `seo` | group | `title`, `description`, `image` |
| `layout` | blocks | the drag-and-drop canvas |

### 2.2 `sections`

Reusable strips (promo band, footer CTA, ...) that hand-written pages pull in by
key through `<CmsSection sectionKey='home-promo' />`.

| Field | Type | Notes |
| --- | --- | --- |
| `key` | text | required, unique per site, referenced from code |
| `title` | text | admin label only |
| `site` | select | same options as `pages` |
| `layout` | blocks | same block list as `pages` |

Both collections must be publicly readable (`read: () => true`). Drafts stay
private as long as `versions.drafts` is enabled, because Payload only returns
published documents to unauthenticated REST requests.

## 3. Shared presentation fields

Every block MAY carry two optional groups, resolved by `src/lib/blockStyles.ts`.
Only the values listed here produce output; an unknown token silently falls back
to the default, so a typo in the admin can never emit a broken class name.

### 3.1 `style`

| Key | Accepted values |
| --- | --- |
| `bg` | `none`, `white`, `light`, `muted`, `dark`, `brand`, `brandSoft`, `gradient`, `gradientSoft` |
| `text` | `default`, `muted`, `invert`, `brand` |
| `paddingY` | `none`, `xs`, `sm`, `md` (default), `lg`, `xl` |
| `paddingX` | `none`, `sm`, `md` (default), `lg` |
| `maxWidth` | `sm`, `md`, `lg` (default), `xl`, `full` |
| `align` | `left`, `center`, `right` |
| `radius` | `none`, `sm`, `md`, `lg`, `full` |
| `shadow` | `none`, `sm`, `md`, `lg` |
| `border` | `none`, `thin`, `thick`, `brand` |
| `gap` | `none`, `xs`, `sm`, `md`, `lg`, `xl` |
| `columns` | `1` to `6` |
| `minHeight` | `auto`, `sm`, `md`, `lg`, `screen` |
| `bgColor`, `textColor` | free-form CSS colour, applied inline |
| `className` | escape hatch for extra Tailwind classes |

### 3.2 `animation`

| Key | Accepted values |
| --- | --- |
| `type` | `none`, `fade`, `fade-up`, `fade-down`, `fade-left`, `fade-right`, `zoom-in`, `zoom-out`, `blur-in`, `rise` |
| `duration` | milliseconds, default `600` |
| `delay` | milliseconds, default `0` |
| `stagger` | milliseconds added per item index inside grids, default `0` |
| `once` | boolean, default `true` |

Reveals honour `prefers-reduced-motion` and are neutralised when JavaScript is
unavailable.

## 4. Block catalogue

One Payload block slug per renderer. Field names are read with fallbacks; the
first spelling in each cell is the recommended one.

| Block slug | Fields the frontend reads |
| --- | --- |
| `hero` | `eyebrow`, `heading`, `level`, `subheading`, `backgroundImage`, `links[]` |
| `heading` | `eyebrow`, `text`, `level` (1-6), `subheading` |
| `richTextSection` | `content` (Lexical, Slate or plain text) |
| `image` | `image`, `alt`, `caption`, `aspect` |
| `video` | `url` (YouTube and Vimeo are auto-embedded), `title` |
| `columns` | `columns[]` of `image`, `title`, `richText`, `links[]` |
| `container` | `blocks[]`, rendered recursively |
| `spacer` | `height`: `xs`, `sm`, `md`, `lg`, `xl` or a pixel number |
| `divider` | `lineStyle`, `width` (`full`, `half`, `short`), `space` |
| `button` | `label`, `href`, `variant`, `size` |
| `featureSplit` | `eyebrow`, `heading`, `text`, `image`, `reverse`, `links[]` |
| `ctaBanner` | `eyebrow`, `heading`, `text`, `links[]` |
| `faq` | `items[]` of `question`, `answer` |
| `gallery` | `images[]`, `aspect`, `columns` |
| `testimonialCarousel` | `testimonials[]` of `quote`, `name`, `role`, `avatar` |
| `newsletterSignup` | `heading`, `action`, `placeholder`, `buttonLabel`, `note` |
| `socialLinks` | `links[]` of `label`, `href` |
| `contactInfo` | `items[]` of `label`, `value`, or `address`, `phone`, `email` |
| `map` | `embedUrl`, `title` |
| `anchorNav` | `items[]` of `label`, `anchor` |
| `breadcrumb` | `items[]` of `label`, `href` |
| `customHtml` | `html`, injected as raw HTML — trusted editors only |

Aspect values: `auto`, `square`, `video`, `wide`, `portrait`, `card`.
Button variants: `primary`, `secondary`, `outline`, `ghost`, `light`, `link`.
Button sizes: `sm`, `md`, `lg`. Internal `href` values are prefixed with the
active locale automatically; external, `mailto:` and `tel:` links are left alone.

### 4.1 Collection-driven grids

These blocks expect a relationship or array field. The frontend queries with
`depth=2`, so Payload returns the referenced documents inline.

| Block slug | Source field | Card links to |
| --- | --- | --- |
| `productGrid` | `products[]` | `/{locale}/products/{slug}` |
| `newsGrid` | `posts[]` | `/{locale}/newsroom/{slug}` |
| `brandGrid` | `brands[]` | `/{locale}/brands/{slug}` |
| `solutionGrid` | `solutions[]` | not linked |
| `categoryCards` | `categories[]` | not linked |
| `featureGrid` | `features[]` | not linked |
| `valueProps` | `items[]` | not linked |
| `trustStats` | `stats[]` of `value`, `label` | not linked |
| `logoCloud` | `logos[]` | not linked |
| `relatedContent` | `items[]` | not linked |

Each card reads `image`, `icon` (a short emoji), `title`, `text`, `date`,
`slug` and `links[]`, plus the optional `columns` override on the block.

### 4.2 Accepted aliases

If the CMS already uses a different slug it is mapped automatically:
`richText`, `text`, `content` to `richTextSection`; `products` to
`productGrid`; `news`, `newsFeed`, `posts` to `newsGrid`; `brands` to
`brandGrid`; `solutions` to `solutionGrid`; `categories` to `categoryCards`;
`features` to `featureGrid`; `stats`, `statsBand` to `trustStats`;
`testimonials`, `quote` to `testimonialCarousel`; `cta`, `callToAction`,
`banner` to `ctaBanner`; `media`, `imageBlock` to `image`; `accordion`,
`faqs` to `faq`; `split`, `imageText` to `featureSplit`; `newsletter` to
`newsletterSignup`; `html`, `embed` to `customHtml`; `section`, `group` to
`container`.

### 4.3 Unknown blocks

A slug with no renderer is skipped in production and shown as a dashed amber
placeholder in development, so adding a block in the CMS can never break the
live site. `SUPPORTED_BLOCKS` is exported from `RenderBlocks.tsx` for CMS-side
validation.

## 5. Payload configuration

Copy these files into the CMS project. They are the minimum needed for the
frontend contract above.

### 5.1 `src/fields/presentation.ts`

```ts
import type { Field } from 'payload'

const option = (value: string) => ({ label: value, value })

export const styleGroup: Field = {
  name: 'style',
  type: 'group',
  admin: { description: 'Visual tokens resolved by the frontend.' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'bg',
          type: 'select',
          defaultValue: 'none',
          options: ['none', 'white', 'light', 'muted', 'dark', 'brand', 'brandSoft', 'gradient', 'gradientSoft'].map(option),
        },
        {
          name: 'text',
          type: 'select',
          defaultValue: 'default',
          options: ['default', 'muted', 'invert', 'brand'].map(option),
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'paddingY', type: 'select', defaultValue: 'md', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'].map(option) },
        { name: 'paddingX', type: 'select', defaultValue: 'md', options: ['none', 'sm', 'md', 'lg'].map(option) },
        { name: 'maxWidth', type: 'select', defaultValue: 'lg', options: ['sm', 'md', 'lg', 'xl', 'full'].map(option) },
        { name: 'align', type: 'select', defaultValue: 'left', options: ['left', 'center', 'right'].map(option) },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'radius', type: 'select', options: ['none', 'sm', 'md', 'lg', 'full'].map(option) },
        { name: 'shadow', type: 'select', options: ['none', 'sm', 'md', 'lg'].map(option) },
        { name: 'border', type: 'select', options: ['none', 'thin', 'thick', 'brand'].map(option) },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'gap', type: 'select', defaultValue: 'md', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'].map(option) },
        { name: 'columns', type: 'select', options: ['1', '2', '3', '4', '5', '6'].map(option) },
        { name: 'minHeight', type: 'select', defaultValue: 'auto', options: ['auto', 'sm', 'md', 'lg', 'screen'].map(option) },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'bgColor', type: 'text', admin: { description: 'Optional CSS colour override.' } },
        { name: 'textColor', type: 'text' },
      ],
    },
    { name: 'className', type: 'text', admin: { description: 'Extra utility classes. Use sparingly.' } },
  ],
}

export const animationGroup: Field = {
  name: 'animation',
  type: 'group',
  admin: { description: 'Scroll reveal. Honours prefers-reduced-motion.' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          defaultValue: 'none',
          options: ['none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom-in', 'zoom-out', 'blur-in', 'rise'].map(option),
        },
        { name: 'duration', type: 'number', defaultValue: 600, min: 0, max: 4000 },
        { name: 'delay', type: 'number', defaultValue: 0, min: 0, max: 4000 },
        { name: 'stagger', type: 'number', defaultValue: 0, min: 0, max: 1000 },
      ],
    },
    { name: 'once', type: 'checkbox', defaultValue: true },
  ],
}

/** Spread into every block so each one accepts the shared tokens. */
export const presentationFields: Field[] = [styleGroup, animationGroup]

/** Reusable call-to-action array. Matches the links[] shape in section 4. */
export const linkArray = (name = 'links'): Field => ({
  name,
  type: 'array',
  maxRows: 3,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true, admin: { description: 'Internal path such as /products, or a full URL.' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'variant', type: 'select', defaultValue: 'primary', options: ['primary', 'secondary', 'outline', 'ghost', 'light', 'link'].map(option) },
        { name: 'size', type: 'select', defaultValue: 'md', options: ['sm', 'md', 'lg'].map(option) },
      ],
    },
  ],
})
```

### 5.2 `src/blocks/index.ts`

A representative subset. Add the remaining slugs from the catalogue in section 4
using the same pattern: the block `slug` must match the table, and every block
spreads `presentationFields`.

```ts
import type { Block } from 'payload'
import { linkArray, presentationFields } from '../fields/presentation'

const aspect = {
  name: 'aspect',
  type: 'select',
  defaultValue: 'auto',
  options: ['auto', 'square', 'video', 'wide', 'portrait', 'card'],
} as const

export const Hero: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'level', type: 'select', defaultValue: 'h1', options: ['h1', 'h2', 'h3'] },
    { name: 'subheading', type: 'textarea' },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
    linkArray(),
    ...presentationFields,
  ],
}

export const Heading: Block = {
  slug: 'heading',
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'text', type: 'text', required: true },
    { name: 'level', type: 'select', defaultValue: 'h2', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
    { name: 'subheading', type: 'textarea' },
    ...presentationFields,
  ],
}

export const RichTextSection: Block = {
  slug: 'richTextSection',
  fields: [{ name: 'content', type: 'richText', required: true }, ...presentationFields],
}

export const ImageBlock: Block = {
  slug: 'image',
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text' },
    aspect,
    ...presentationFields,
  ],
}

export const FeatureSplit: Block = {
  slug: 'featureSplit',
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'text', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'reverse', type: 'checkbox', label: 'Media on the left' },
    aspect,
    linkArray(),
    ...presentationFields,
  ],
}

export const CtaBanner: Block = {
  slug: 'ctaBanner',
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'text', type: 'textarea' },
    linkArray(),
    ...presentationFields,
  ],
}

export const Faq: Block = {
  slug: 'faq',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'subheading', type: 'textarea' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'richText', required: true },
      ],
    },
    ...presentationFields,
  ],
}

export const ProductGrid: Block = {
  slug: 'productGrid',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'subheading', type: 'textarea' },
    { name: 'products', type: 'relationship', relationTo: 'products', hasMany: true },
    linkArray(),
    ...presentationFields,
  ],
}

export const Spacer: Block = {
  slug: 'spacer',
  fields: [{ name: 'height', type: 'select', defaultValue: 'md', options: ['xs', 'sm', 'md', 'lg', 'xl'] }],
}

export const CustomHtml: Block = {
  slug: 'customHtml',
  admin: { group: 'Advanced' },
  fields: [
    { name: 'html', type: 'code', admin: { language: 'html' }, required: true },
    ...presentationFields,
  ],
}

/** The single list both Pages.layout and Sections.layout use. */
export const layoutBlocks: Block[] = [
  Hero,
  Heading,
  RichTextSection,
  ImageBlock,
  FeatureSplit,
  CtaBanner,
  Faq,
  ProductGrid,
  Spacer,
  CustomHtml,
]
```

### 5.3 `src/collections/Pages.ts`

```ts
import type { CollectionConfig } from 'payload'
import { layoutBlocks } from '../blocks'

const toSlug = (value: unknown): string => {
  const raw = String(value ?? '').trim().toLowerCase()
  const cleaned = raw.replace(/^\/+|\/+$/g, '')
  if (!cleaned || cleaned === 'index' || cleaned === 'home') return 'home'
  return cleaned.replace(/[^a-z0-9/-]+/g, '-').replace(/-{2,}/g, '-')
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', 'site', 'updatedAt'] },
  access: { read: () => true },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          admin: { description: 'No leading slash. Use home for the landing page.' },
          hooks: { beforeValidate: [({ value, data }) => toSlug(value || data?.title)] },
        },
        {
          name: 'site',
          type: 'select',
          required: true,
          defaultValue: 'arigeo',
          options: [
            { label: 'ARIGEO', value: 'arigeo' },
            { label: 'Captain Maid', value: 'captain-maid' },
          ],
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'layout',
      type: 'blocks',
      minRows: 1,
      blocks: layoutBlocks,
      admin: { description: 'Drag blocks to build the page.' },
    },
  ],
}
```

### 5.4 `src/collections/Sections.ts`

```ts
import type { CollectionConfig } from 'payload'
import { layoutBlocks } from '../blocks'

export const Sections: CollectionConfig = {
  slug: 'sections',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'key', 'site', 'updatedAt'] },
  access: { read: () => true },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          admin: { description: 'Referenced from code, for example home-promo.' },
        },
        {
          name: 'site',
          type: 'select',
          required: true,
          defaultValue: 'arigeo',
          options: [
            { label: 'ARIGEO', value: 'arigeo' },
            { label: 'Captain Maid', value: 'captain-maid' },
          ],
        },
      ],
    },
    { name: 'layout', type: 'blocks', minRows: 1, blocks: layoutBlocks },
  ],
}
```

### 5.5 Register both collections

```ts
// src/payload.config.ts
import { Pages } from './collections/Pages'
import { Sections } from './collections/Sections'

export default buildConfig({
  collections: [/* existing collections */ Pages, Sections],
  cors: [process.env.PAYLOAD_CORS_ORIGIN || 'https://arigeo.vercel.app'],
  csrf: [process.env.PAYLOAD_CSRF_ORIGIN || 'https://arigeo.vercel.app'],
})
```

Redeploy the CMS after adding the collections so the REST endpoints exist.

## 6. Using CMS content inside hand-written pages

Full CMS pages need no code. To drop a CMS-authored strip into an existing
route, use the server component `src/components/blocks/CmsSection.tsx`:

```tsx
import CmsSection from '@/components/blocks/CmsSection'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <main>
      {/* existing hand-written content */}
      <CmsSection sectionKey='home-promo' locale={locale} />
    </main>
  )
}
```

If the section does not exist, is unpublished or the CMS is unreachable, the
component renders its optional `fallback` (`null` by default), so the page
keeps working.

## 7. Verification

1. CMS endpoints answer publicly:
   `/api/pages?limit=1` and `/api/sections?limit=1` return `200` with a
   `docs` array while logged out. A `403` means access control still blocks
   read.
2. `NEXT_PUBLIC_CMS_URL` is set on the frontend project for Production,
   Preview and Development, then redeployed.
3. Publish a test page with `slug: sandbox` and `site: arigeo` holding one
   `hero` and one `richTextSection` block. Open `/th/sandbox` and
   `/en/sandbox`.
4. Reorder the blocks in the admin, republish, and confirm the new order appears
   within a minute (or after a redeploy).
5. Unpublish the test page and confirm the route returns 404.
6. Check the server logs for `[cms]` warnings; there should be none.
7. Run `npm run lint`, `npx tsc --noEmit` and `npm run build` before merging.
8. Review desktop, tablet and mobile rendering, and confirm no console errors.

## 8. Content integrity

The page builder can publish anything an editor types, so the project content
rules still apply: no invented claims, certifications, statistics, prices,
ratings or approvals. Placeholder copy must be marked `CONTENT REQUIRED` and
must not be published as production content. `customHtml` is rendered as raw
HTML, so it is restricted to trusted editors.
