# Payload CMS Content Model

## Globals

### `site-settings`

- localized site name/tagline
- logo, favicon
- default SEO
- contact address, phone, email, map URL
- social links
- legal links
- GA/GTM configuration references (IDs via environment, not secrets)

### `header`

- localized navigation items
- language options
- search enabled
- announcement field optional

### `footer`

- localized columns and links
- description
- social links
- legal text

### `homepage`

- localized hero slides
- category gateway cards
- trust/value items
- featured news selection
- newsletter copy
- module ordering and visibility

## Collections

### `users`

- admin/editor roles
- least-privilege access
- MFA/SSO according to deployment capabilities

### `media`

- file
- localized alt text
- caption
- focal point
- licensing/source note
- usage tags

### `brands`

- name
- slug per locale or stable slug strategy
- business type: household/skincare/derma-skincare
- logo/key visual
- story
- benefit focus
- categories
- hero products
- theme overrides within ARIGEO system
- SEO
- publish state

### `product-categories`

- localized name/description
- slug
- parent category optional
- business type
- icon/image
- sort order

### `concerns`

- localized name
- slug
- business type
- description

### `collections`

- localized launch collection name
- slug
- start/end dates optional
- related products

### `products`

- localized product name
- slug
- brand relationship
- category relationships
- concern relationships
- product type
- launch collection
- size/variants
- key benefit
- overview
- usage
- ingredients/technology
- safety/quality claims
- gallery
- related products
- contact CTA
- SEO
- publish state

### `news-categories`

- localized name
- slug

### `news`

- localized title/slug/excerpt/body
- category
- hero image
- publish date
- author optional
- related brands/products optional
- SEO
- publish state

### `pages`

For About, Innovation, Sustainability, Careers, Contact and legal pages.

- localized title/slug
- modular content blocks
- hero
- SEO
- publish state

### `redirects`

- from path
- to path
- status code
- locale optional

### `form-submissions`

- form type
- sanitized fields
- consent timestamp
- status/routing
- source page
- retention/expiry metadata

Avoid storing sensitive data beyond business need.

## Reusable blocks

- Hero
- Rich text
- Image/text split
- Stat/proof points
- Brand grid
- Product grid
- Category cards
- Value/trust panel
- CTA
- FAQ
- News grid
- Contact details/map

## Localization rules

- Required primary locale must be explicit
- Missing translation must not silently mix locale on the same page
- Slug/canonical/hreflang strategy must be deterministic
- Proper nouns may remain shared

## Access control

- Public: published documents only
- Editor: create/edit drafts and media
- Publisher/Admin: publish/unpublish and manage settings
- Form submissions: restricted to authorized roles
