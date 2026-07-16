# Phase 5 — Image Integration Guide

This guide walks you through adding optimized images to Captain Maid, completing the optimization phase.

---

## Overview

**Status**: Images configured in data layer, but actual image files not yet added.

**What's done**:
- ✅ Image paths defined in `lib/products.ts` and `lib/blog.ts`
- ✅ OptimizedImage component built
- ✅ Performance utilities created
- ✅ Lighthouse optimization configured

**What's needed**:
- ⏳ Actual image files (WebP + PNG)
- ⏳ Verification with Lighthouse
- ⏳ Deployment & monitoring

---

## Step 1: Prepare Image Files

### 1.1 Create directories

```bash
mkdir -p public/products
mkdir -p public/blog
mkdir -p public/images
```

### 1.2 Add product images

Place images in `public/products/`:

| Product | Filename | Dimensions | Format |
|---------|----------|-----------|--------|
| Floor Cleaner | `floor-cleaner.webp` + `floor-cleaner.png` | 600×400px | WebP + PNG |
| Glass Cleaner | `glass-cleaner.webp` + `glass-cleaner.png` | 600×400px | WebP + PNG |
| Fabric Freshener | `fabric-freshener.webp` + `fabric-freshener.png` | 600×400px | WebP + PNG |

**File sizes target**:
- WebP: 30–40 KB each
- PNG: 60–80 KB each

### 1.3 Add blog images

Place images in `public/blog/`:

| Blog Post | Filename | Dimensions | Format |
|-----------|----------|-----------|--------|
| Natural Ingredients | `natural-ingredients.webp` + `.png` | 800×400px | WebP + PNG |
| Home Safe | `home-safe-kids.webp` + `.png` | 800×400px | WebP + PNG |
| Deep Clean | `deep-clean.webp` + `.png` | 800×400px | WebP + PNG |
| Thai Tiles | `thai-tiles.webp` + `.png` | 800×400px | WebP + PNG |
| Mold Prevention | `mold-prevention.webp` + `.png` | 800×400px | WebP + PNG |
| Sustainable | `sustainable.webp` + `.png` | 800×400px | WebP + PNG |

**File sizes target**:
- WebP: 30–50 KB each
- PNG: 60–100 KB each

---

## Step 2: Optimize Images

### Using Squoosh (Free, Web-Based)

1. Go to **squoosh.app**
2. Drag image in
3. Right panel → "WebP" format
4. Quality: **85** (good balance)
5. Download → `image.webp`
6. Switch to "PNG" format for fallback
7. Quality: **80**
8. Download → `image.png`

### Using cwebp (CLI)

```bash
# Convert JPG to WebP (quality 85)
cwebp -q 85 floor-cleaner.jpg -o public/products/floor-cleaner.webp

# Keep PNG fallback
cp floor-cleaner.png public/products/floor-cleaner.png

# Verify file size
du -h public/products/floor-cleaner.webp
```

### Using ImageOptim (macOS)

1. Open ImageOptim
2. Drag images in
3. Converts automatically
4. Move optimized files to `public/products/` or `public/blog/`

---

## Step 3: Update Data Layer

### 3.1 Verify image paths in lib/products.ts

Already configured:

```typescript
// lib/products.ts
image: '/products/floor-cleaner.jpg',  // → Change to .webp
```

**Update each product**:

```typescript
'all-surface-floor-cleaner': {
  // ... other fields ...
  image: '/products/floor-cleaner.webp',  // ✅ Update path
},

'glass-surface-cleaner': {
  image: '/products/glass-cleaner.webp',  // ✅ Update path
},

'fabric-upholstery-freshener': {
  image: '/products/fabric-freshener.webp',  // ✅ Update path
},
```

### 3.2 Verify image paths in lib/blog.ts

Blog posts don't currently have images, but if adding:

```typescript
'natural-ingredients-homemade-cleaners': {
  // ... other fields ...
  emoji: '🪴',  // Keep emoji as fallback if no image
  image: '/blog/natural-ingredients.webp',  // Optional: add image
},
```

---

## Step 4: Use OptimizedImage Component

### 4.1 Hero image (above fold)

In `app/page.tsx`:

```tsx
import OptimizedImage from '@/components/OptimizedImage'

export default function Home() {
  return (
    <section className="w-full">
      <OptimizedImage
        src="/images/hero.webp"
        alt="Captain Maid hero section"
        width={1200}
        height={630}
        priority={true}  // Preload this
        className="w-full"
      />
    </section>
  )
}
```

### 4.2 Product images (below fold)

In `app/products/[slug]/page.tsx`:

```tsx
import OptimizedImage from '@/components/OptimizedImage'

export default function ProductDetail({ product }: Props) {
  return (
    <section>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product image */}
        <div>
          <OptimizedImage
            src={product.image}
            alt={product.name}
            width={600}
            height={400}
            priority={false}  // Lazy load
          />
        </div>

        {/* Product details */}
        <div>{/* ... */}</div>
      </div>
    </section>
  )
}
```

### 4.3 Blog images

In `app/blog/[slug]/page.tsx`:

```tsx
import OptimizedImage from '@/components/OptimizedImage'

export default function BlogPost({ post }: Props) {
  return (
    <article>
      {/* Featured image */}
      <OptimizedImage
        src={post.image || `/blog/${post.slug}.webp`}
        alt={post.title}
        width={800}
        height={400}
        priority={false}  // Lazy load
      />

      {/* Article content */}
      <div>{/* ... */}</div>
    </article>
  )
}
```

---

## Step 5: Verify Image Integration

### 5.1 Check file existence

```bash
# Verify all product images exist
ls -lh public/products/

# Output should show:
# floor-cleaner.webp (30-40 KB)
# floor-cleaner.png (60-80 KB)
# glass-cleaner.webp
# glass-cleaner.png
# fabric-freshener.webp
# fabric-freshener.png

# Verify blog images
ls -lh public/blog/
```

### 5.2 Run dev server

```bash
npm run dev
```

Open http://localhost:3000 and verify:
- ✅ Hero image appears at top
- ✅ Product images load on product pages
- ✅ No layout shifts while images load
- ✅ Images are sharp on high-DPI displays

### 5.3 Check DevTools Network tab

1. Open DevTools → Network tab
2. Filter by Images
3. Verify WebP format is being used (not PNG fallback)
4. Check file sizes (should be 30–50 KB each)

---

## Step 6: Test Performance

### 6.1 Run performance test script

```bash
chmod +x scripts/test-performance.sh
./scripts/test-performance.sh
```

Output will show:
- ✅ Image count and sizes
- ⚠️ Warnings for large files
- 💡 Lighthouse instructions

### 6.2 Run Lighthouse

1. Dev server running: `npm run dev`
2. Open http://localhost:3000
3. DevTools → Lighthouse tab
4. Click "Analyze page load"
5. Target: **Performance 90+**

**If score < 90, likely causes**:
- LCP too high → hero image too large, use WebP
- CLS > 0.1 → missing width/height on images
- FID too high → large JavaScript (unlikely, check)

### 6.3 Test on mobile

```bash
# Get local IP
ifconfig | grep "inet " | head -1

# On mobile device, go to: http://<your-ip>:3000
# Test with DevTools Network throttle: Slow 4G
```

---

## Step 7: Build for Production

### 7.1 Build locally

```bash
npm run build
```

Check output:
- ✅ No build errors
- ✅ Image optimization logs
- ℹ️ Static generation times

### 7.2 Deploy to Vercel

```bash
git add .
git commit -m "feat: Phase 5 — Image optimization + Core Web Vitals"
git push origin main
```

Vercel will:
1. ✅ Build Next.js
2. ✅ Optimize images
3. ✅ Deploy to CDN
4. ✅ Run automatic Lighthouse check

---

## Step 8: Monitor Real User Metrics

### 8.1 Set up Google Analytics 4

1. Go to **analytics.google.com**
2. Create GA4 property
3. Get Measurement ID (format: `G-XXXXXXXXXX`)
4. Add to `.env.local`:

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 8.2 View Web Vitals

After ~24 hours of traffic:

1. GA4 → Reports → Engagement
2. Look for "Web Vitals" report
3. See real user metrics:
   - **LCP**: 75th percentile (target < 2.5s)
   - **FID**: 75th percentile (target < 100ms)
   - **CLS**: 75th percentile (target < 0.1)

### 8.3 Set up performance alerts

```bash
# Optional: Use Chrome UX Report
# https://crux.web.dev/

# Or: Use Vercel Analytics
# Dashboard → Analytics → Web Vitals
```

---

## Troubleshooting

### Images not loading

**Problem**: `403` errors or missing images

**Solution**:
1. Verify files exist: `ls public/products/`
2. Check file names match data layer
3. Rebuild: `npm run build`

### Images loading as PNG instead of WebP

**Problem**: Network tab shows `.png` format

**Solution**:
1. Browser doesn't support WebP (unlikely in modern browsers)
2. Or PNG fallback being used intentionally
3. Verify in `lib/image-utils.ts` → getResponsiveSizes()

### Layout shifts when images load

**Problem**: CLS > 0.1

**Solution**:
1. Add `width` and `height` to all images
2. Use OptimizedImage component (enforces aspect ratio)
3. Pre-allocate space for images in CSS

### Lighthouse score still < 90

**Problem**: Performance issues remain

**Solution**:
1. Check LCP metric → if high, hero image too large
2. Check CLS metric → if high, missing image dimensions
3. Run Chrome DevTools → Performance tab for details
4. Profile with `npm run build` → check bundle size

---

## Deployment Checklist

- [ ] All product images in `public/products/`
- [ ] All blog images in `public/blog/` (if using)
- [ ] WebP + PNG formats for each image
- [ ] Image paths updated in `lib/products.ts`
- [ ] OptimizedImage component used in all pages
- [ ] Dev server test passes (no missing images)
- [ ] Lighthouse score 90+ on desktop
- [ ] Lighthouse score 90+ on mobile (Slow 4G)
- [ ] Production build succeeds (`npm run build`)
- [ ] Vercel deployment successful
- [ ] Real user metrics monitored in GA4
- [ ] Performance budget maintained (< 300 KB total images)

---

## Next Steps

1. **Commit images**: `git add public/ && git commit -m "feat: add optimized product and blog images"`
2. **Deploy**: `git push` → Vercel deploys automatically
3. **Monitor**: Check Lighthouse score in Vercel dashboard
4. **Iterate**: If score < 90, optimize further using PERFORMANCE_GUIDE.md

---

## Resources

- **Image Optimization**: lib/image-utils.ts
- **OptimizedImage Component**: components/OptimizedImage.tsx
- **Performance Guide**: PERFORMANCE_GUIDE.md
- **Next.js Image Docs**: https://nextjs.org/docs/basic-features/image-optimization

---

**Images are now integrated. Run Lighthouse to verify 90+ score, then you're done! 🚀**
