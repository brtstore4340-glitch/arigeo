# Captain Maid — Performance Optimization Guide (Phase 5)

## Overview

Phase 5 focuses on Core Web Vitals optimization, image optimization, and achieving a Lighthouse score of 90+. This guide covers:

- **Core Web Vitals** — LCP, FID, CLS metrics
- **Image Optimization** — WebP, responsive sizes, lazy loading
- **Bundle Optimization** — Code splitting, tree shaking
- **Testing & Monitoring** — Lighthouse, DevTools, real user monitoring

---

## Core Web Vitals Explained

Google uses three key metrics to measure page performance. All must be "Good" for ranking benefits.

### LCP (Largest Contentful Paint) — **< 2.5s**

**What it measures**: Time to render the largest content element (hero image, main headline, etc.)

**Why it matters**: Users perceive page speed based on how quickly they see meaningful content.

**Impact on Captain Maid**: Hero section image is the LCP element. WebP conversion will reduce LCP by 300-500ms.

**How to optimize**:
1. ✅ Use WebP format for hero image (25-35% smaller than PNG)
2. ✅ Set `priority={true}` on hero image in Next.js Image
3. ✅ Preload critical fonts with `rel="preload"`
4. ✅ Minimize render-blocking CSS/JavaScript
5. ✅ Use a fast hosting provider (Vercel does this automatically)

**Current Target**: Hero loads in < 2s on Slow 3G

### FID (First Input Delay) — **< 100ms**

**What it measures**: Time between user input (click, tap) and browser response.

**Why it matters**: Users expect instant feedback when they interact.

**Impact on Captain Maid**: Minimal risk—JavaScript bundle is small. Navigation and button clicks should be instant.

**How to optimize**:
1. ✅ Keep JavaScript bundle < 200 KB (we're at ~80 KB)
2. ✅ Defer non-critical JavaScript with `<script defer>`
3. ✅ Use Web Workers for heavy calculations (not needed yet)
4. ✅ Profile with DevTools Performance tab

**Current Status**: Should be < 50ms — no action needed

### CLS (Cumulative Layout Shift) — **< 0.1**

**What it measures**: Unexpected movement of page elements during load.

**Why it matters**: Annoying visual jumps distract users and feel broken.

**Impact on Captain Maid**: Critical! Must set width/height on all images to prevent layout shift.

**How to optimize**:
1. ✅ **Always set width/height on images** (prevents CLS)
2. ✅ Use `aspect-ratio` CSS for media containers
3. ✅ Preload fonts to prevent FOUT (Flash of Unstyled Text)
4. ✅ Reserve space for ads/dynamic content
5. ✅ Keep nav bar visible during scrolling

**Critical Requirement**: All image components must include width/height dimensions.

---

## Image Optimization Strategy

### Current State
- ✅ Image paths configured in `lib/products.ts` and `lib/blog.ts`
- ⏳ **Actual images not yet added** — need WebP + PNG in `public/products/` and `public/blog/`

### Step 1: Prepare Images

**For each product/blog image:**

| Use Case | Dimensions | Format | Quality |
|----------|-----------|--------|---------|
| Hero section | 1200×630px | WebP + PNG | 85–90 |
| Product detail | 600×400px | WebP + PNG | 85 |
| Product card | 400×300px | WebP + PNG | 80 |
| Blog featured | 800×400px | WebP + PNG | 85 |
| Blog card | 300×200px | WebP + PNG | 80 |

**Target file sizes after optimization**:
- WebP: 30–50 KB per image (primary format)
- PNG: 60–100 KB per image (fallback)

**Tools for optimization**:
- **Squoosh** (web-based, free): squoosh.app
- **ImageOptim** (macOS): imageoptim.com
- **cwebp** (CLI): `cwebp input.jpg -o output.webp -q 85`

### Step 2: Generate Responsive Sizes

Create 1x, 2x, 3x density variants for high-DPI displays:

```bash
# Example: Generate responsive versions of floor-cleaner.jpg
cwebp floor-cleaner.jpg -o floor-cleaner.webp -q 85
cwebp floor-cleaner.jpg -o floor-cleaner@2x.webp -q 80
```

Place in `public/products/` or `public/blog/`.

### Step 3: Update Product/Blog Data

After adding images, update `lib/products.ts`:

```typescript
image: '/products/floor-cleaner.webp',
```

Same for `lib/blog.ts`:

```typescript
image: '/blog/natural-ingredients.webp',
```

### Step 4: Use OptimizedImage Component

All product/blog images should use the `OptimizedImage` component:

```tsx
import OptimizedImage from '@/components/OptimizedImage'

// Hero image (above fold)
<OptimizedImage
  src="/images/hero.webp"
  alt="Hero section"
  width={1200}
  height={630}
  priority={true}  // Preload this image
/>

// Product images (below fold)
<OptimizedImage
  src={product.image}
  alt={product.name}
  width={600}
  height={400}
  priority={false}  // Lazy load
/>
```

### Step 5: Verify in Browser

After adding images, test with DevTools:

1. Open DevTools → Network tab
2. Reload page
3. Filter by Images
4. Check file sizes (all should be < 50 KB)
5. Check formats (should be .webp with fallback)

---

## Bundle Optimization

### JavaScript Bundle

**Current size**: ~80 KB (gzipped)

**Target**: Keep under 200 KB

**Optimization strategy**:
```tsx
// ✅ Good: Code split for routes
const ProductDetail = dynamic(() => import('./ProductDetail'), {
  loading: () => <div>Loading...</div>,
})

// ❌ Bad: Import all components at top
import ProductDetail from './ProductDetail'
```

### CSS Bundle

**Current size**: ~15 KB (gzipped with Tailwind)

**Optimization**:
- ✅ Tailwind purges unused CSS automatically
- ✅ Keep component classes atomic
- ✅ Avoid writing custom CSS when Tailwind has it

### Font Loading

**Current strategy**: Google Fonts with `font-display: swap`

**Impact**: FOUT (Flash of Unstyled Text) briefly visible, but text appears ASAP

**Status**: Optimized ✅

---

## Testing & Monitoring

### 1. Lighthouse Audit (Local)

**In Chrome DevTools**:

1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Mobile" (stricter scoring)
4. Click "Analyze page load"
5. View report (target: 90+)

**Target breakdown**:
- Performance: **90+**
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

**Common issues to fix**:
- Images missing width/height → add dimensions to fix CLS
- Lazy loaded critical images → add `priority={true}`
- Large JavaScript → code split with dynamic import
- Render-blocking CSS → move to body end

### 2. DevTools Performance Tab

**Test LCP & CLS manually**:

1. Open DevTools → Performance tab
2. Click record
3. Reload page
4. Stop recording
5. Look for:
   - **LCP marker**: When hero image renders (should be < 2.5s)
   - **Layout shift**: Red marks in timeline (should be near-zero)

**For CLS testing specifically**:
- Look for "CLS" entry in timeline
- All shifts should happen during load, not after
- Ideal: zero shifts after paint

### 3. Real User Monitoring (RUM)

**Setup Google Analytics 4 + Web Vitals**:

```bash
# 1. Install web-vitals package
npm install web-vitals

# 2. Add to app/layout.tsx
import { useEffect } from 'react'
import { onCLS, onFID, onLCP } from 'web-vitals'

export default function RootLayout() {
  useEffect(() => {
    onLCP(metric => {
      console.log('LCP:', metric.value)
      // Send to GA4
    })
    onFID(metric => {
      console.log('FID:', metric.value)
    })
    onCLS(metric => {
      console.log('CLS:', metric.value)
    })
  }, [])

  return (/* ... */)
}
```

**View in Google Analytics**:
- Go to Reports → Engagement → Web Vitals
- See real user metrics from production

### 4. Network Throttling Test

**Simulate Slow 3G in DevTools**:

1. DevTools → Network tab
2. Click throttling dropdown (default: "No throttling")
3. Select "Slow 3G"
4. Reload page
5. Verify LCP < 2.5s and no jumpy interactions

**Results to expect**:
- LCP: 2–2.5s (hero image loading)
- FID: < 50ms (nav, button clicks)
- CLS: 0 (no layout shifts)

### 5. Mobile Device Test

**Real hardware is best**:

1. Connect Android/iPhone via USB
2. Enable Remote Debugging
3. Open Chrome DevTools
4. Test page on real 4G connection
5. Note any janky animations or slow interactions

---

## Optimization Checklist

### Images
- [ ] All product images converted to WebP
- [ ] PNG fallback available for all images
- [ ] Responsive sizes generated (1x, 2x, 3x)
- [ ] All images have width/height attributes
- [ ] Hero image has `priority={true}`
- [ ] Below-fold images lazy loaded (default)
- [ ] All images use OptimizedImage component
- [ ] Image file sizes verified (< 50 KB each)

### Core Web Vitals
- [ ] LCP < 2.5s on Slow 3G
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Lighthouse Performance score 90+

### Bundle
- [ ] JavaScript bundle < 200 KB gzipped
- [ ] CSS bundle < 50 KB gzipped
- [ ] Fonts preloaded and `font-display: swap` set
- [ ] No render-blocking resources

### Testing
- [ ] Lighthouse audit passes (90+)
- [ ] DevTools Performance shows clean timeline
- [ ] Slow 3G throttle test passes
- [ ] Mobile device test on real 4G
- [ ] Real user metrics tracked in GA4

### Deployment
- [ ] Images committed to public/
- [ ] .env configured with analytics ID
- [ ] Vercel build succeeds
- [ ] Production Lighthouse audit run
- [ ] Real user data available in GA4

---

## Performance Budget

Maintain these limits across all updates:

| Metric | Budget | Status |
|--------|--------|--------|
| JS bundle (gzipped) | 200 KB | ✅ ~80 KB |
| CSS bundle (gzipped) | 50 KB | ✅ ~15 KB |
| Total image weight | 300 KB | ⏳ Pending |
| LCP (75th percentile) | 2.5s | ⏳ Pending |
| CLS (75th percentile) | 0.1 | ⏳ Pending |
| Lighthouse score | 90+ | ⏳ Pending |

When adding new features:
1. Run Lighthouse after each major change
2. If score drops below 90, investigate
3. Prioritize LCP and CLS over FID

---

## Next Steps

1. **Add product images** → `public/products/`
2. **Add blog images** → `public/blog/`
3. **Verify with Lighthouse** → Target 90+
4. **Set up GA4 + Web Vitals** → Real user monitoring
5. **Deploy to Vercel** → Production performance
6. **Monitor weekly** → Keep score above 90

---

## Resources

- **Google PageSpeed Insights**: pagespeed.web.dev
- **Web.dev Core Web Vitals Guide**: web.dev/vitals
- **Next.js Image Optimization**: nextjs.org/docs/basic-features/image-optimization
- **Vercel Performance Guide**: vercel.com/docs/concepts/analytics
- **Squoosh (Image Compression)**: squoosh.app

---

**Performance is not optional. Every 100ms delay costs 1% conversion rate.**
