# Wiring the ARIGEO frontend to the Payload CMS

This document explains how the ARIGEO frontend (arigeo.vercel.app) connects to
the Payload CMS (cms-arigeo.vercel.app) and the manual steps required to make the
connection work in production.

## Overview

| Piece    | URL                           | Repo                   |
| -------- | ----------------------------- | ---------------------- |
| Frontend | https://arigeo.vercel.app     | E0993599799/arigeo     |
| CMS      | https://cms-arigeo.vercel.app | E0993599799/cms-arigeo |

The frontend reads content through the Payload REST API using the adapter in
`src/lib/cms.ts` (`getProducts`, `getProductBySlug`, `getBrands`). Those helpers
map CMS documents back to the existing `Product` / brand shapes, so pages can
switch from the static `src/data/*` files to live CMS data without changing their
rendering logic.

## Required environment variables

### 1. Frontend project (arigeo)

Set in **Vercel > arigeo project > Settings > Environment Variables**, and in
`.env.local` for local development (see `.env.example`):

```
NEXT_PUBLIC_CMS_URL=https://cms-arigeo.vercel.app
```

### 2. CMS project (cms-arigeo)

The CMS must allow the frontend origin, otherwise browser requests are blocked by
CORS and authenticated actions fail CSRF checks. Set in **Vercel > cms-arigeo
project > Settings > Environment Variables**:

```
PAYLOAD_CORS_ORIGIN=https://arigeo.vercel.app
PAYLOAD_CSRF_ORIGIN=https://arigeo.vercel.app
```

For multiple origins (e.g. a future custom domain or local dev), use a
comma-separated list:

```
PAYLOAD_CORS_ORIGIN=https://arigeo.vercel.app,http://localhost:3000
PAYLOAD_CSRF_ORIGIN=https://arigeo.vercel.app,http://localhost:3000
```

> Confirm the exact variable names against the CMS `payload.config.ts`. Payload
> reads CORS/CSRF from the config; these env names are the convention used by this
> project. If the config hard-codes the values instead, update them there.

After changing environment variables on either project, **redeploy** so the new
values take effect.

## Verifying the wire

Once both projects are redeployed, open the browser console on
https://arigeo.vercel.app and run:

```js
fetch('https://cms-arigeo.vercel.app/api/products?limit=1')
  .then(r => r.json())
  .then(d => console.log('products:', d.totalDocs))
```

A number (not a CORS error) confirms the connection is live.

## Switching pages to live data

The adapter is additive — nothing breaks until a page opts in. To move a page
from static data to the CMS, replace the static import, e.g.:

```ts
// Before
import products from '@/data/products'

// After (server component)
import { getProducts } from '@/lib/cms'
const products = await getProducts()
```

Client components should fetch in a server parent (or a route handler) and pass
the data down, since `getProducts` runs on the server.


## Page builder (CMS-authored pages)

Beyond products and brands, the frontend can render whole pages that editors
assemble by drag and drop in the Payload admin. Two extra frontend variables
control it (both optional, see `.env.example`):

```
NEXT_PUBLIC_CMS_SITE=arigeo
NEXT_PUBLIC_CMS_REVALIDATE=60
```

On the CMS side the page builder needs a `pages` and a `sections` collection,
both publicly readable. The full field-by-field contract, the list of supported
blocks and copy-paste Payload configuration live in
`docs/CMS-PAGE-BUILDER.md`.

Quick check once the collections exist and both projects are redeployed:

```js
fetch('https://cms-arigeo.vercel.app/api/pages?limit=1')
  .then(r => r.json())
  .then(d => console.log('pages:', d.totalDocs))
```

Then open the slug of a published page, for example `/th/sandbox`. Hand-written
routes always win over CMS pages, so this addition cannot change any existing
URL.
