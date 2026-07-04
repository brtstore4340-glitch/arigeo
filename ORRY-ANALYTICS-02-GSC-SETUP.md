# ORRY Thailand Analytics Setup
## Part 2: Google Search Console (GSC) Configuration

**Document Version:** 1.0  
**Created:** 2026-07-03  
**Timeline:** 1-2 hours implementation  
**Owner:** Implementation Team

---

## PHASE 1: Domain Verification

### Step 1.1: Add Property in GSC

1. **Go to Google Search Console**
   - URL: search.google.com/search-console
   - Log in with Google account

2. **Add New Property**
   - Click "+" → "Add property"
   - Choose: **URL prefix** (not domain property)
   - Enter: `https://orrytheailand.com/`
   - Click "Continue"

### Step 1.2: Verify Domain Ownership

Choose ONE verification method:

#### Method A: HTML File Upload (RECOMMENDED)

1. **Download verification file**
   - GSC provides: `google########.html`
   - Contains verification code

2. **Upload to website root**
   - Web dev uploads file to: `https://orrytheailand.com/google########.html`
   - File must be accessible and match exactly

3. **Verify in GSC**
   - Click "Verify" in GSC
   - Shows confirmation within seconds

#### Method B: Meta Tag (Alternative)

1. **Copy meta tag**
   - GSC provides: `<meta name="google-site-verification" content="..." />`

2. **Add to website `<head>`**
   - Web dev adds meta tag to homepage `<head>` section
   - Must be on every page or homepage only

3. **Verify in GSC**
   - Click "Verify"
   - GSC crawls site to find meta tag

#### Method C: DNS TXT Record (If domain access available)

1. **Copy DNS record**
   - GSC provides TXT record value

2. **Add to domain DNS settings**
   - Depends on registrar (GoDaddy, Cloudflare, etc.)
   - Add TXT record to domain root

3. **Verify in GSC**
   - Wait 15-30 minutes for DNS propagation
   - Click "Verify" when ready

**STATUS:** ✅ Choose Method A (HTML) - fastest and most reliable

---

## PHASE 2: Sitemap Submission

### Step 2.1: Create Sitemap

#### If using Sitemap Generator:

1. **Generate XML Sitemap**
   - Use free tool: xml-sitemaps.com
   - Enter: `https://orrytheailand.com`
   - Generate sitemap.xml
   - Download file

2. **Upload to Website**
   - Save as: `/sitemap.xml` in website root
   - Verify at: `https://orrytheailand.com/sitemap.xml`

#### If using CMS (WordPress, Shopify, etc.):

**WordPress:** Install "Yoast SEO" or "All in One SEO" plugin
- Auto-generates sitemap.xml
- Location: https://site.com/sitemap.xml

**Shopify:** Automatic sitemap at `https://store.myshopify.com/sitemap.xml`

### Step 2.2: Submit Sitemap to GSC

1. **Open GSC Property**
   - In left menu → "Sitemaps"

2. **Add New Sitemap**
   - Paste: `https://orrytheailand.com/sitemap.xml`
   - Click "Submit"
   - Shows status: Success/Error

3. **Check Status**
   - GSC will show:
     * Submitted URLs
     * Indexed URLs
     * Excluded (if any)

**Expected:** Should see 20-50+ URLs indexed within 24 hours

---

## PHASE 3: Monitor Search Performance

### Step 3.1: Access Performance Report

1. **In GSC left menu**
   - Click: "Performance"

2. **View Metrics**
   - **Total Clicks:** How many users clicked your link in search
   - **Impressions:** How many times your site appeared in search
   - **Average CTR:** Click-through rate (clicks ÷ impressions)
   - **Average Position:** Average ranking position (1-100+)

### Step 3.2: Analyze Search Queries

The report shows:

| Query | Clicks | Impressions | CTR | Position |
|---|---|---|---|---|
| orry thailand lip balm | 12 | 45 | 26.7% | 4 |
| natural lip care thai | 8 | 92 | 8.7% | 12 |
| whisper hydration lip | 5 | 38 | 13.2% | 7 |
| best lip balm asia | 3 | 120 | 2.5% | 23 |

**Strategy:**
- **High impressions, low clicks:** Improve title/meta description
- **No impressions:** Page not ranking; build more links
- **High position, low clicks:** Title/description may be unappealing
- **Good CTR, low volume:** Content is good; needs more links for higher ranking

### Step 3.3: Search Appearance Features

Check what appears for your site:

- **Rich Results** (star ratings, product info)
- **Enhanced Results** (featured snippets, knowledge panels)
- **Mobile Usability** (mobile-friendly indicators)

---

## PHASE 4: Check Indexing Status

### Step 4.1: Monitor Index Coverage

1. **In GSC left menu**
   - Click: "Coverage"

2. **Check Status**
   - **Green (Valid):** Pages indexed correctly
   - **Yellow (Valid with warnings):** Indexed but has issues
   - **Red (Error):** Pages NOT indexed - needs fix
   - **Gray (Excluded):** Intentionally not indexed (robots.txt, noindex)

### Step 4.2: Common Indexing Issues

**If pages show Red (Error):**

| Error | Solution |
|---|---|
| Crawled but not indexed | Create better content, add more links |
| Soft 404 | Fix page content (make it more substantial) |
| Server error (5xx) | Contact web host, check server logs |
| Submitted URL marked as noindex | Remove noindex tag from page |
| Robots.txt blocked | Remove blocking rule from robots.txt |

**Action:** Click error → click URL → "Inspect URL" → get recommendations

---

## PHASE 5: Core Web Vitals Monitoring

### Step 5.1: Check Core Web Vitals Report

1. **In GSC left menu**
   - Click: "Core Web Vitals"

2. **Understand the Metrics**

**LCP (Largest Contentful Paint)** - How fast does main content load?
- ✅ Good: < 2.5 seconds
- ⚠️ Needs improvement: 2.5-4 seconds
- ❌ Poor: > 4 seconds

**FID (First Input Delay)** - How responsive is the page?
- ✅ Good: < 100 milliseconds
- ⚠️ Needs improvement: 100-300 ms
- ❌ Poor: > 300 ms

**CLS (Cumulative Layout Shift)** - Does layout jump around?
- ✅ Good: < 0.1
- ⚠️ Needs improvement: 0.1-0.25
- ❌ Poor: > 0.25

### Step 5.2: Improve Core Web Vitals

**For LCP (Page Speed):**
- Optimize images (use WebP format)
- Minify CSS/JavaScript
- Use CDN for content delivery
- Lazy-load below-fold content

**For FID (Interactivity):**
- Reduce JavaScript execution
- Break up long tasks
- Use async loading for non-critical scripts

**For CLS (Visual Stability):**
- Reserve space for images/ads
- Use CSS transforms for animations
- Avoid inserting content above existing content

---

## PHASE 6: Search Query Analysis & Optimization

### Step 6.1: Identify Ranking Opportunities

1. **Query with High Impressions but Low CTR**
   - Example: 200 impressions, 5 clicks, 2.5% CTR
   - Your page ranks but doesn't appeal to searchers
   - **Action:** Improve title tag and meta description

2. **Query with High Impressions but High Position (10+)**
   - Example: 150 impressions, rank #15
   - You're on second page - need more authority
   - **Action:** Build backlinks, create better content

3. **Query with No Impressions**
   - You want to rank for it but don't appear
   - **Action:** Create content targeting this keyword, build links

### Step 6.2: Monitor Competitor Queries

1. **In Performance report**
   - Filter by product: "WHISPER" OR "BREEZE" OR "VELVET"
   - See what queries bring product visitors

2. **Identify keyword gaps**
   - Do you rank for "[Product] + benefits"? 
   - Do you rank for "[Product] + price"?
   - Do you rank for "[Product] + reviews"?

---

## PHASE 7: Submitted and Excluded Items

### Step 7.1: Check Submission Status

1. **In GSC → "Pages"**
   - Lists all discovered pages and their status

2. **Investigate Non-Indexed Pages**
   - Click page → "Inspect URL"
   - See coverage status and reasons why not indexed
   - Common causes:
     * noindex tag present
     * robots.txt blocked
     * Duplicate content
     * Page marked as error in server response

### Step 7.2: Fix Excluded Pages

**If page SHOULD be indexed but is excluded:**

1. Click page in GSC
2. Click "Request indexing"
3. GSC will re-crawl and attempt to index
4. Check status after 1-2 weeks

---

## PHASE 8: Set Up Search Console Email Reports

### Step 8.1: Enable Email Notifications

1. **In GSC Settings** (left menu → gear icon → "Settings")

2. **Search Console email notifications**
   - Enable notifications for:
     * ✅ Coverage issues (new errors)
     * ✅ Core Web Vitals issues
     * ✅ Security issues
     * ✅ Indexing issues

3. **Email address**
   - Add: marketing@orrytheailand.com
   - Add: webmaster@orrytheailand.com

### Step 8.2: Schedule Manual Reviews

1. **Weekly:** Check Performance report
   - Top 10 queries
   - CTR trends
   - Ranking position changes

2. **Monthly:** Check Coverage report
   - New errors
   - Indexed page count trend
   - Excluded pages

---

## PHASE 9: Link Google Analytics 4

### Link GA4 to GSC

1. **In GSC Settings** (left menu → gear icon)

2. **Google Analytics property**
   - Click "Associate property"
   - Select your GA4 property: "ORRY Thailand - Lip Care"
   - Confirm

3. **Benefits:**
   - See search traffic in GA4
   - Create audience of organic search visitors
   - Cross-reference GA4 and GSC data

---

## VERIFICATION CHECKLIST

- [ ] Domain verified in GSC (Method A: HTML upload)
- [ ] Sitemap created and submitted (20+ pages indexed)
- [ ] Performance report reviewed (baseline metrics captured)
- [ ] Coverage report reviewed (no critical errors)
- [ ] Core Web Vitals monitored (all metrics in good range)
- [ ] Email notifications enabled for coverage/Core Web Vitals
- [ ] GA4 linked to GSC property
- [ ] Weekly review schedule established

---

## Monthly Monitoring Tasks

### Week 1: Performance Review
- Check top 10 search queries
- Identify CTR opportunities
- Plan content for low-ranking keywords

### Week 2-4: Technical Audit
- Monitor Core Web Vitals
- Check indexing coverage
- Review any new errors

### Monthly: Optimization
- Improve title/meta for high-impression, low-CTR pages
- Build links to improve ranking for priority keywords
- Create content for new keyword opportunities

---

## Success Metrics

| Metric | Target | Timeline |
|---|---|---|
| Indexed pages | 50+ | Week 1 |
| Organic impressions | 100+/week | Month 1 |
| Organic clicks | 20+/week | Month 2 |
| Average CTR | 3-5% | Month 2-3 |
| Average position | Top 20 | Month 3 |

---

## Document Summary

| Item | Status |
|---|---|
| Domain verified | To do |
| Sitemap submitted | To do |
| Performance baseline | To do |
| Coverage baseline | To do |
| GA4 linked | To do |
| Monitoring setup | To do |

**Next Phase:** Keyword Ranking Tracker (Part 3)

---

**Version:** 1.0 | **Status:** Ready | **Updated:** 2026-07-03
