# Baseline Status Report

Date: 2026-07-16

## Source

- Input ZIP extracted successfully
- React/Vite/Tailwind project
- No local image assets included

## Base44 removal completed in handoff baseline

Removed:

1. `@base44/sdk` and `@base44/vite-plugin`
2. Base44 Vite plugin configuration
3. `base44/` project configuration
4. Base44 client and app parameter utilities
5. Auth context/gate and Base44-dependent authentication pages
6. Base44 legacy documentation and export metadata

The public route tree now renders directly without a Base44 authentication check. Base44 must not be reintroduced.

## Validation attempt

- `npm install --no-audit --no-fund` was attempted in the handoff environment and timed out before creating `node_modules`
- No build-pass claim is made from this environment

## Validation still required

- Run a clean `npm install`
- Run lint, typecheck and production build
- Start the preview server
- Confirm repository and production bundle contain no Base44 runtime references
- Capture responsive baseline screenshots

## Remaining static risks

1. Tailwind config uses CommonJS syntax in an ESM package
2. Homepage imagery depends on remote generated URLs
3. Only `/` route is implemented for the corporate site
4. Pixel match against the red-circle target is not yet validated

No claim is made that the current source builds until the validation commands are completed.

## Input checksums

- Original ZIP SHA-256: `80e46dd212ceb9cc484a37e20910a65f95345fb6cb51193b69cb06cf1484e1b6`
- PPTX SHA-256: `427d8ef354d2234a718ed137a7d13a2c550245ba1b183e9b20bc6037161e94ff`
- Target image SHA-256: `719f7ee9b172a1a2b05cd2baaf890eb7d8e45b437854730731047b7f90b9cd49`
- Current screenshot SHA-256: `2aebff901ac41c2fe93bc7f4c433c5194fc0efbe065c9aca2a5482f6505c85a8`
