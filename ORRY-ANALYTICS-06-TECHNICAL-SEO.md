# ORRY Thailand Analytics Setup
## Part 6: Technical SEO Monitoring & Page Speed

**Document Version:** 1.0  
**Created:** 2026-07-03  
**Timeline:** 30 minutes setup + ongoing monitoring  
**Owner:** Technical Team

---

## PHASE 1: Core Web Vitals Monitoring

### Step 1.1: Understand Core Web Vitals

**Three metrics Google uses for search ranking:**

#### LCP (Largest Contentful Paint)
- **What:** How fast does main content load?
- **Target:** < 2.5 seconds (Good)
- **Warning:** 2.5-4 seconds (Needs improvement)
- **Poor:** > 4 seconds (Critical)
- **Impact:** 25% of ranking factor

#### FID (First Input Delay)
- **What:** How responsive is the page to user clicks?
- **Target:** < 100 milliseconds (Good)
- **Warning:** 100-300 ms (Needs improvement)
- **Poor:** > 300 ms (Critical)
- **Impact:** 5% of ranking factor
- **Note:** Being replaced by INP in 2024

#### CLS (Cumulative Layout Shift)
- **What:** Does the page layout jump around while loading?
- **Target:** < 0.1 (Good - stable)
- **Warning:** 0.1-0.25 (Needs improvement)
- **Poor:** > 0.25 (Critical - very jumpy)
- **Impact:** 5% of ranking factor

### Step 1.2: Check Core Web Vitals in GSC

1. **Go to Google Search Console**
2. **Click: Core Web Vitals** (left menu)
3. **View three reports:**

| Metric | Your Site | Target | Status |
|---|---|---|---|
| LCP | 2.1s | < 2.5s | ✅ Good |
| FID | 85ms | < 100ms | ✅ Good |
| CLS | 0.08 | < 0.1 | ✅ Good |

4. **Check URL Status**
   - Green (Good) / Yellow (Needs improvement) / Red (Poor)

### Step 1.3: Weekly Core Web Vitals Checklist

**Every Monday: Check Core Web Vitals**

```
CORE WEB VITALS - WEEKLY CHECK
Week of: [Date] | Checker: [Name]

LCP (Page Load Time)
├─ Homepage: _____ ms (Target: <2.5s)
├─ Product pages: _____ ms (Target: <2.5s)
├─ Blog posts: _____ ms (Target: <2.5s)
└─ Status: ✅ Good / ⚠️ Needs work / ❌ Poor

FID (Responsiveness)
├─ Overall: _____ ms (Target: <100ms)
├─ Mobile: _____ ms (higher is normal)
└─ Status: ✅ Good / ⚠️ Needs work / ❌ Poor

CLS (Layout Stability)
├─ Overall: 0.____ (Target: <0.1)
├─ Mobile: 0.____ (usually higher)
└─ Status: ✅ Good / ⚠️ Needs work / ❌ Poor

Issues Found: _________________________
Actions: _________________________
```

---

## PHASE 2: Page Speed Optimization

### Step 2.1: Audit Page Speed with Tools

**Free Tools:**

1. **Google PageSpeed Insights**
   - URL: pagespeed.web.dev
   - Shows: LCP, FID, CLS metrics
   - Recommendations: Specific optimizations

2. **GTmetrix**
   - URL: gtmetrix.com
   - Shows: Waterfall (detailed load), Lighthouse score
   - Recommendations: Priority-ordered improvements

3. **WebPageTest**
   - URL: webpagetest.org
   - Shows: Detailed performance filmstrip
   - Use: Complex performance debugging

### Step 2.2: Page Speed Optimization Checklist

**For improving LCP (Page Load):**

- [ ] **Image Optimization**
  - Use WebP format (smaller file sizes)
  - Compress images (75% quality)
  - Size images for device (no oversized images)
  - Lazy load images below the fold

- [ ] **Critical CSS**
  - Inline critical above-the-fold CSS
  - Defer non-critical CSS
  - Minify all CSS

- [ ] **JavaScript Optimization**
  - Minify JavaScript
  - Defer non-critical JS
  - Use async for third-party scripts (Google Analytics, etc.)
  - Remove unused JavaScript

- [ ] **CDN & Caching**
  - Use Content Delivery Network (Cloudflare, etc.)
  - Set long cache expiration (1 month+)
  - Enable gzip compression

- [ ] **Server Response**
  - Upgrade hosting if TTFB > 600ms
  - Use HTTP/2 (faster multiplexing)
  - Monitor server load

**For improving FID (Responsiveness):**

- [ ] Break up long JavaScript tasks
- [ ] Reduce JavaScript execution time
- [ ] Use Web Workers for heavy tasks
- [ ] Prioritize user interactions

**For improving CLS (Visual Stability):**

- [ ] Reserve space for images/ads (set dimensions)
- [ ] Use CSS transforms for animations (not position changes)
- [ ] Avoid inserting content above fold
- [ ] Set font-display: swap

### Step 2.3: ORRY Specific Optimizations

**For ORRY Thailand site:**

**Critical:**
1. Optimize product images (WHISPER, BREEZE, VELVET)
   - Convert to WebP
   - Compress to <100KB each
   - Size for mobile (< 800px width)

2. Minify CSS/JS
   - Use build tool (webpack, rollup)
   - Minify all files

3. Lazy load product gallery images

**Important:**
4. Set up CDN for image delivery
5. Enable gzip compression
6. Set proper cache headers

---

## PHASE 3: Mobile Usability Monitoring

### Step 3.1: Check Mobile Usability in GSC

1. **Go to Google Search Console**
2. **Click: Mobile Usability** (left menu)
3. **Check for issues:**

| Issue | Impact | Fix |
|---|---|---|
| Text too small | Poor UX | Use 12px+ font size |
| Clickable elements too close | Poor UX | Space buttons 48px apart |
| Viewport not configured | No mobile display | Add viewport meta tag |

### Step 3.2: Mobile Testing

**Test on actual mobile devices:**

1. **Open site on mobile (iOS + Android)**
2. **Check:**
   - [ ] Text readable without zoom
   - [ ] Buttons are 48x48px minimum
   - [ ] No horizontal scrolling
   - [ ] Images scale properly
   - [ ] Tap links work (not hover menus)
   - [ ] Forms are mobile-optimized

### Step 3.3: Mobile Optimization Checklist

- [ ] Viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- [ ] Responsive design (no fixed widths)
- [ ] Touch-friendly buttons (48x48px minimum)
- [ ] Mobile fonts (12px+ readable size)
- [ ] Readable text contrast (WCAG AA)
- [ ] Mobile menu (hamburger icon)

---

## PHASE 4: Backlink Monitoring

### Step 4.1: Check Backlinks in GSC

1. **Go to Google Search Console**
2. **Click: Links** (left menu)
3. **View:**
   - **Top linking sites** - Which domains link to you
   - **Top linked pages** - Which of your pages get linked
   - **Top linking text** - What anchor text is used

### Step 4.2: Backlink Quality Assessment

**Good backlinks:**
✅ From relevant sites (beauty, skincare blogs)
✅ From established sites (high domain authority)
✅ From many different domains
✅ Using keyword-rich anchor text
✅ Natural linking patterns

**Bad backlinks to avoid:**
❌ From spam sites
❌ Paid backlinks (violates Google policy)
❌ Over-optimized anchor text (exact match keywords)
❌ All backlinks from single domain
❌ Sudden spike in backlinks

### Step 4.3: Build Quality Backlinks Strategy

**Earn backlinks from:**
1. Beauty bloggers (PR outreach)
2. Lifestyle magazines
3. Sustainability blogs (natural ingredients)
4. Bangkok/Thailand travel blogs
5. Community partners (local beauty shops)
6. Press releases (news sites)

**Monthly backlink target:** 2-3 quality links from relevant sites

---

## PHASE 5: Indexation Monitoring

### Step 5.1: Monitor Pages Indexed

1. **In GSC → Coverage report**
2. **Check each week:**

| Category | Count | Status |
|---|---|---|
| Valid | 45+ | ✅ Indexed |
| Valid with warnings | <5 | ⚠️ Investigate |
| Error | 0 | ❌ Fix immediately |
| Excluded (by design) | <5 | ✅ OK if intentional |

### Step 5.2: Maintain Good Indexation

**Prevent pages from being excluded:**

- [ ] Don't add `<meta name="robots" content="noindex">` by accident
- [ ] Check robots.txt isn't blocking important pages
- [ ] Remove duplicate content (or use canonical tags)
- [ ] Fix broken pages (404 errors)
- [ ] Ensure sufficient quality content (200+ words)

### Step 5.3: Request Indexing

If page not indexed but should be:

1. **In GSC → Pages report**
2. **Click page → "Inspect URL"**
3. **Click: "Request indexing"**
4. **GSC will crawl and attempt to index**
5. **Check status after 1 week**

---

## PHASE 6: Structured Data (Schema Markup)

### Step 6.1: Implement Rich Product Schema

Add to product pages (WHISPER, BREEZE, VELVET):

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "WHISPER - Hydration Lock Clear Lip Balm",
  "image": "https://orrytheailand.com/images/whisper.jpg",
  "description": "12-hour hydration lock with natural ingredients",
  "brand": {
    "@type": "Brand",
    "name": "ORRY Thailand"
  },
  "offers": {
    "@type": "Offer",
    "price": "24.99",
    "priceCurrency": "THB",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "42"
  }
}
```

### Step 6.2: Add Review Schema

If you have customer reviews:

```json
{
  "@type": "Review",
  "author": {
    "@type": "Person",
    "name": "Sarah M."
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "5"
  },
  "reviewBody": "Best lip balm I've used! Stays hydrated for hours."
}
```

### Step 6.3: Verify Schema in Google Search Console

1. **Go to: Rich Results Test**
   - URL: search.google.com/test/rich-results
2. **Enter page URL**
3. **Verify:** Schema shows without errors
4. **See preview:** How Google displays rich results

---

## PHASE 7: Monthly Technical SEO Checklist

```
TECHNICAL SEO AUDIT - MONTHLY
Month: [     ] | Auditor: [Name] | Date: [     ]

CORE WEB VITALS
└─ LCP: ___ms (Target: <2.5s) - Status: ✅ ⚠️ ❌
└─ FID: ___ms (Target: <100ms) - Status: ✅ ⚠️ ❌
└─ CLS: 0.____ (Target: <0.1) - Status: ✅ ⚠️ ❌

INDEXATION (GSC Coverage Report)
├─ Valid pages: _____ (Target: 50+)
├─ Pages with warnings: _____ (Target: <5)
├─ Error pages: _____ (Target: 0)
└─ Review errors: _______________________

MOBILE USABILITY
├─ Test on: [iOS device], [Android device]
├─ Viewport tag present: ✅ ❌
├─ Mobile fonts readable: ✅ ❌
├─ Touch elements properly sized: ✅ ❌
└─ Issues found: _______________________

BACKLINKS
├─ Total backlinks: _____
├─ New backlinks this month: _____
├─ Backlink sources reviewed: [Date]
└─ Quality issues: _______________________

SEO ISSUES FOUND
├─ Issue 1: _____________ (Priority: High/Med/Low)
├─ Issue 2: _____________ (Priority: High/Med/Low)
└─ Issue 3: _____________ (Priority: High/Med/Low)

ACTION ITEMS
├─ [ ] Action 1: _________________________
├─ [ ] Action 2: _________________________
└─ [ ] Action 3: _________________________

Overall Site Health: ✅ Healthy / ⚠️ Needs Work / ❌ Critical
```

---

## PHASE 8: Quarterly Technical Audit

### Q3 2026 Example

```
ORRY THAILAND - Q3 2026 TECHNICAL AUDIT
Audit Date: September 30, 2026 | Auditor: [Name]

PERFORMANCE SUMMARY
LCP: 2.1 seconds (Excellent - no action needed)
FID: 85 milliseconds (Excellent - no action needed)
CLS: 0.08 (Excellent - no action needed)

PAGE SPEED TREND
├─ July: 2.3s average LCP
├─ August: 2.2s average LCP
└─ September: 2.1s average LCP (Improving!)

INDEXATION STATUS
├─ Total indexed pages: 52
├─ New pages indexed this quarter: 8
├─ Pages with issues: 1 (duplicate content - fixed)
├─ Robots.txt blocking: 0 (none)
└─ Overall: Healthy

BACKLINK PROFILE
├─ Total referring domains: 12
├─ New high-quality backlinks: 3
  - beauty-blog.co.th (PR: 18)
  - wellness-magazine.com (PR: 25)
  - local-business-directory.co.th
├─ Backlink growth: +3 domains (+33%)
└─ Quality: Good - all from relevant sites

MOBILE USABILITY
├─ Device compatibility: 100%
├─ Screen size optimization: 100%
├─ Usability issues: 0
├─ Mobile crawl errors: 0
└─ Status: Excellent

SECURITY ISSUES
├─ HTTPS: ✅ Enabled on all pages
├─ Mixed content: ❌ None detected
├─ Security certificates: ✅ Valid
└─ Malware: ✅ None detected

STRUCTURED DATA (SCHEMA)
├─ Product schema: ✅ 3 products marked up
├─ Rich results: ✅ Showing in search
├─ Review schema: ⚠️ Not implemented (recommend adding)
├─ Organization schema: ⚠️ Not implemented
└─ Recommendation: Add review schema to boost CTR

CRAWLABILITY
├─ Pages crawled this month: 342
├─ Crawl errors: 0
├─ Redirect chains: 0
├─ Broken links found: 2 (fixed)
├─ Robots.txt issues: None
└─ Sitemap: ✅ Valid, all pages included

RECOMMENDATIONS FOR Q4
1. Add review schema markup (medium effort, high impact)
2. Implement organization schema
3. Monitor backlink growth - continue outreach
4. Test TikTok traffic (considering adding TikTok tracking pixel)
5. Quarterly security scan (maintain HTTPS)

SIGN-OFF
Auditor: [Name]
Date: September 30, 2026
Overall Assessment: ✅ HEALTHY
```

---

## PHASE 9: Monitoring Tools Summary

### Free Tools for Technical SEO

| Tool | Purpose | Frequency |
|---|---|---|
| Google Search Console | Indexing, Core Web Vitals, Backlinks | Daily/Weekly |
| Google PageSpeed Insights | Page speed, recommendations | Weekly |
| GTmetrix | Detailed performance analysis | Monthly |
| Google Mobile-Friendly Test | Mobile usability | Monthly |
| Rich Results Test | Schema markup validation | Monthly |
| Google Core Web Vitals Report | Dashboard view | Daily |

### Recommended Monitoring Schedule

**Daily:**
- Google Search Console (check for errors)
- Google Analytics (traffic dashboard)

**Weekly:**
- Core Web Vitals check
- Google PageSpeed Insights
- Traffic source performance

**Monthly:**
- Full technical audit
- Backlink review
- Mobile usability test
- Keyword ranking check

**Quarterly:**
- Comprehensive technical audit
- Competitor analysis
- Strategy review

---

## Technical SEO Monitoring Checklist

- [ ] Core Web Vitals monitored weekly
- [ ] Page speed optimized (LCP < 2.5s)
- [ ] Mobile usability tested
- [ ] Indexation healthy (50+ pages)
- [ ] Backlinks tracked monthly
- [ ] Structured data implemented (products)
- [ ] HTTPS enabled on all pages
- [ ] Robots.txt configured correctly
- [ ] Sitemap submitted and updated
- [ ] Monthly technical audit scheduled

---

## Document Summary

| Phase | Status | Frequency |
|---|---|---|
| Core Web Vitals | Monitoring | Weekly |
| Page Speed | Optimized | Ongoing |
| Mobile Usability | Green | Monthly checks |
| Backlink Building | In progress | Monthly |
| Indexation | Healthy | Weekly |
| Structured Data | Partial | Expanding |
| Technical Audit | Complete | Quarterly |

**Next Phase:** Complete! All 6 analytics setup documents ready for implementation.

---

**Version:** 1.0 | **Status:** Complete | **Updated:** 2026-07-03
