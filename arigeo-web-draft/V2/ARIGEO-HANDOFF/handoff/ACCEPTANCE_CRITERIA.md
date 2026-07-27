# Acceptance Criteria

## A. Desktop homepage visual

Test viewport: 1440×auto, device scale 1.

- Header has approved ARIGEO wordmark, full menu, language selector and search
- Hero follows target 2-column geometry with a solid red circle behind product still life
- Headline line breaks and red emphasis match target intent
- CTA and slider indicators match target hierarchy
- Household and Skincare cards are equal height and use image-led split/overlay treatment
- Trust panel is one bordered container with three columns and separators
- News section has four equal cards
- Newsletter is horizontal on desktop
- Footer is light with a separate black legal strip
- No section from the old deployed Thai page appears unless it is intentionally relocated to a dedicated brief-approved page

## B. Responsive

Widths: 1280, 1024, 768, 390, 360.

- No horizontal scrolling
- Navigation is operable by touch and keyboard
- Hero circle never covers essential copy
- Cards stack in a logical order
- Minimum touch target approximately 44×44px
- Text does not clip or overflow
- Images retain intended focal point

## C. Routing and content

- All sitemap routes in `DIFF.md` resolve
- `/en` contains English only; `/th` contains Thai only except proper nouns
- Brand and product pages are linked from homepage/category routes
- Product filters are shareable through URL parameters
- Empty/no-result states are present

## D. CMS

- Editor can manage localized homepage modules
- Editor can create brands, categories, products and news
- Draft/preview works before publish
- Media requires alt text except explicitly decorative media
- Product relationships and related products work
- SEO fields are editable per locale

## E. Forms and analytics

- Each form validates server-side
- Spam/rate limiting is active
- Success and failure states are visible and accessible
- Recipient routing is configurable without frontend deploy
- GA4/GTM events fire once with no PII in event payload

## F. Quality gates

- Lint passes
- Typecheck passes
- Production build passes
- No browser console errors on main flows
- No client bundle secrets
- WCAG 2.2 AA target
- Lighthouse targets documented in `DIFF.md`
