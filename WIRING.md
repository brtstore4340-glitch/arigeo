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

## Production Resilience (Phase 1)

### Circuit Breaker & Timeout

The CMS adapter (`src/lib/cms.ts`) includes automatic resilience:

- **Timeout**: 5 seconds per request (AbortController)
- **Circuit Breaker**: Fails fast after 5 consecutive failures
- **Graceful Degradation**: Pages render with null data if CMS unavailable

### Health Check Endpoint

Verify CMS connectivity before deploy:

```bash
# Local test
npm run build
npm run start
curl http://localhost:3000/api/health | jq '.'
# Expected: { "cmsConnectivity": "ok", ... }

# Production test
curl https://arigeo-project.vercel.app/api/health | jq '.'
```

Status codes:
- `200 OK` — CMS reachable
- `503 Service Unavailable` — CMS down or timeout

### Monitoring

Check Vercel logs for:
- `[cms] circuit breaker open` — CMS failing repeatedly
- `[cms] request failed` — Individual request errors
- `[cms] timeout` — AbortError from 5s timeout

If circuit breaker activates, either:
1. Wait for CMS recovery (counter resets on success)
2. Deploy a rollback version with static fallback data
3. Check `/api/health` endpoint for diagnosis
