# ORRY Thailand Analytics Setup
## Part 4: Conversion & Goal Tracking Setup

**Document Version:** 1.0  
**Created:** 2026-07-03  
**Timeline:** 1-2 hours setup  
**Owner:** Implementation Team

---

## PHASE 1: Define ORRY Conversion Goals

### Step 1.1: Primary Conversions (Revenue-Generating)

| Goal | Value | Priority | Trigger |
|---|---|---|---|
| Product Purchase | Transaction value (THB) | ⭐⭐⭐ | purchase event (GA4) |
| Email Signup | $5-10 (LTV estimate) | ⭐⭐⭐ | sign_up event (GA4) |
| Product Add to Cart | $2-3 (interest) | ⭐⭐ | add_to_cart event (GA4) |
| Product Page View | $0.50 (awareness) | ⭐⭐ | view_item event (GA4) |

### Step 1.2: Secondary Conversions (Engagement)

| Goal | Value | Priority | Trigger |
|---|---|---|---|
| Blog Post Read | $0.10 (content value) | ⭐ | page_view + 30 sec on page |
| Social Link Click | $0 (tracking) | ⭐ | engagement event |
| Contact Form Submit | $10 (inquiry value) | ⭐⭐ | lead event (GA4) |
| CTA Button Click | $0.50 (interest) | ⭐ | engagement event |
| Download Lead Magnet | $5 (lead value) | ⭐⭐ | lead event (GA4) |

---

## PHASE 2: Configure GA4 Conversion Goals

### Step 2.1: Mark Events as Conversions

1. **Open GA4 Property**
   - Go: analytics.google.com
   - Select: ORRY Thailand property

2. **Navigate to Admin → Conversion Events**
   - Click: "Admin" (left sidebar)
   - Click: "Conversion Events"
   - Click: "New Conversion Event"

3. **Create Conversion: Purchase**
   - Event Name: `purchase`
   - Description: "Product purchase completed"
   - Category: E-commerce
   - Click: "Create"

4. **Create Conversion: Email Signup**
   - Event Name: `sign_up`
   - Description: "Newsletter email subscription"
   - Category: Lead Generation
   - Click: "Create"

5. **Create Conversion: Add to Cart**
   - Event Name: `add_to_cart`
   - Description: "Product added to shopping cart"
   - Category: E-commerce
   - Click: "Create"

6. **Create Conversion: Product View**
   - Event Name: `view_item`
   - Description: "Product page viewed"
   - Category: E-commerce
   - Click: "Create"

7. **Create Conversion: Contact Form**
   - Event Name: `lead`
   - Description: "Contact/inquiry form submitted"
   - Category: Lead Generation
   - Click: "Create"

---

## PHASE 3: Ecommerce Transaction Tracking

### Step 3.1: Track Purchase Details

**In GTM Tag for purchase event, include:**

```javascript
gtag('event', 'purchase', {
  "transaction_id": "T12345678",        // Unique order ID
  "affiliation": "ORRY Thailand",        // Affiliate/brand
  "value": 54.99,                        // Total order value
  "currency": "THB",
  "tax": 4.39,
  "shipping": 0,
  "coupon": "WHISPER20",
  "items": [
    {
      "item_id": "sku_whisper_001",
      "item_name": "WHISPER - Hydration Lock",
      "affiliation": "ORRY Thailand",
      "price": 24.99,
      "quantity": 2,
      "item_category": "Lip Care",
      "item_category2": "Clear Shade"
    }
  ]
});
```

### Step 3.2: Set Up Ecommerce Tracking in GA4

1. **Go to Admin → Data Streams**
2. **Select your web stream**
3. **Click: "Configure tag settings"**
4. **Enable:**
   - ✅ Enhanced ecommerce
   - ✅ Google Analytics 4

### Step 3.3: View Purchase Data in GA4

1. **Left menu → Monetization → Ecommerce Purchases**
   - Shows: Purchase value by product, source, date
   - Tracks: Revenue, quantity, AOV (average order value)

2. **Left menu → Monetization → Product Performance**
   - Shows: Which products sell most
   - Tracks: WHISPER vs BREEZE vs VELVET sales

3. **Left menu → Monetization → Shopping Behavior**
   - Shows: How users navigate to purchase
   - Tracks: Product views → adds to cart → purchases

---

## PHASE 4: Email Signup Goal Tracking

### Step 4.1: Add Email Signup Event to Website

**When user submits email on:**
- Homepage popup
- Footer newsletter signup
- Contact page form

**Add code to form submission handler:**

```javascript
// When form is successfully submitted:
window.dataLayer = window.dataLayer || [];
gtag('event', 'sign_up', {
  "method": "newsletter",
  "email_domain": "gmail.com",  // Extracted from email
  "signup_source": "homepage_popup"  // Where they signed up
});
```

### Step 4.2: Track Email List Growth

1. **In GA4 → Events (left menu)**
   - Filter for: `sign_up` event
   - Shows: # of signups per day/week
   - See: Which traffic sources convert best

2. **Set up Dashboard Card**
   - Card: "Email Signups This Week"
   - Metric: Event count (sign_up)
   - Compare: Week over week trend

---

## PHASE 5: Blog Engagement Tracking

### Step 5.1: Set up Blog Scroll Depth Tracking

Add to blog posts only:

```javascript
// Track how far down the page user scrolls
let scrollReported = false;

window.addEventListener('scroll', function() {
  if (scrollReported) return;
  
  let scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  
  if (scrollPercent > 50 && !scrollReported) {  // 50% scroll
    window.dataLayer = window.dataLayer || [];
    gtag('event', 'engagement', {
      "engagement_type": "blog_scroll_50",
      "page_title": document.title,
      "content_type": "blog_post"
    });
    scrollReported = true;
  }
});
```

### Step 5.2: Blog Reading Time Goal

For posts that should be read (15+ min read time):

```javascript
// Track if user spent 3+ minutes on blog post
setTimeout(function() {
  if (document.activeElement !== document.body) {  // Still focused on page
    window.dataLayer = window.dataLayer || [];
    gtag('event', 'engagement', {
      "engagement_type": "blog_engaged",
      "page_title": document.title,
      "time_on_page": "3+ minutes"
    });
  }
}, 180000);  // 3 minutes
```

---

## PHASE 6: Social & External Link Tracking

### Step 6.1: Track Social Platform Clicks

```javascript
// Track clicks to Instagram, TikTok, Facebook
document.querySelectorAll('a[href*="instagram.com"], a[href*="tiktok.com"], a[href*="facebook.com"]').forEach(link => {
  link.addEventListener('click', function(e) {
    let platform = 'unknown';
    if (this.href.includes('instagram')) platform = 'instagram';
    else if (this.href.includes('tiktok')) platform = 'tiktok';
    else if (this.href.includes('facebook')) platform = 'facebook';
    
    window.dataLayer = window.dataLayer || [];
    gtag('event', 'engagement', {
      "engagement_type": "social_click",
      "social_platform": platform,
      "page_location": window.location.href
    });
  });
});
```

### Step 6.2: Analyze Social Traffic

1. **In GA4 → Traffic Source**
   - Shows: Traffic from instagram.com, tiktok.com, etc.
   - Shows: Which social platform has best engagement

2. **In GA4 → Audience → Social Media Traffic**
   - Lists all users coming from social
   - See: Conversion rate from social traffic
   - Identify: Which platform converts best

---

## PHASE 7: Contact Form Conversion Tracking

### Step 7.1: Track Contact Form Submissions

Add to contact form submission handler:

```javascript
// When contact form is successfully submitted:
window.dataLayer = window.dataLayer || [];
gtag('event', 'lead', {
  "lead_type": "contact_inquiry",
  "form_name": "Contact Us",
  "form_location": "/contact",
  "lead_value": 10  // Estimated value in THB (optional)
});

// Alternative for different form types:
gtag('event', 'lead', {
  "lead_type": "wholesale_inquiry",
  "company_size": "small",  // If captured
  "lead_value": 100
});
```

---

## PHASE 8: Set Up Conversion Reporting Dashboard

### Step 8.1: Create Conversion Dashboard

1. **In GA4 → Admin → Create Dashboard**
2. **Name:** `ORRY Thailand - Conversion Overview`

3. **Add these cards:**

| Card | Metric | Description |
|---|---|---|
| Scorecard | Total Conversions | All conversion events |
| Scorecard | Conversion Rate | Conversions ÷ Sessions |
| Scorecard | Revenue | Total transaction value |
| Scorecard | AOV | Average order value |
| Table | Top Converting Pages | Ranked by conversion |
| Time Series | Daily Conversions | Trend over time |
| Pie Chart | Conversion Type | Purchase vs Email vs Lead |
| Table | Traffic Source Conversions | Which channels convert best |

---

## PHASE 9: Monthly Conversion Analysis

### Step 9.1: Weekly Conversion Report (Every Friday)

| Metric | This Week | Last Week | Change |
|---|---|---|---|
| Total Conversions | 42 | 38 | +4 (+10%) |
| Email Signups | 18 | 15 | +3 |
| Purchases | 12 | 10 | +2 |
| Product Views | 287 | 256 | +31 |
| Conversion Rate | 3.2% | 3.1% | +0.1% |
| Revenue (THB) | 8,456 | 7,290 | +1,166 |
| AOV (THB) | 704 | 729 | -25 |

### Step 9.2: Identify Conversion Optimization Opportunities

| Scenario | Action |
|---|---|
| High product views, low add-to-cart | Page may lack compelling CTA or product images |
| High add-to-cart, low purchase | Checkout process may be friction points |
| Low email signup rate | Email capture location or messaging needs improvement |
| High traffic, low conversions | Traffic quality issue or product market fit |
| High conversion rate but low volume | Focus on scaling traffic to top-converting pages |

---

## PHASE 10: Goal Attribution & Funnel Analysis

### Step 10.1: View Conversion Funnel

1. **In GA4 → Analysis → Funnel Exploration**

2. **Create ORRY Funnel:**
   - Step 1: Homepage view
   - Step 2: Product page view (view_item)
   - Step 3: Add to cart (add_to_cart)
   - Step 4: Purchase (purchase)

3. **Analyze drop-offs:**
   - If 100 view products → 30 add to cart (70% drop)
   - Action: Improve product page CTA, pricing, reviews

---

## PHASE 11: Track Discount Code Performance

### Step 11.1: Monitor Coupon Usage

Add coupon code to purchase event:

```javascript
gtag('event', 'purchase', {
  "coupon": "WHISPER20",  // The promo code used
  "value": 19.99,  // Price after discount
  // ... other purchase fields
});
```

### Step 11.2: Analyze Coupon Performance

1. **In GA4 → Monetization → Coupon Analysis**
   - Shows: Which coupons drive most revenue
   - Shows: WHISPER20 vs BREEZEGLOW vs VELVETLUXE

2. **Monthly coupon report:**

| Coupon | Uses | Avg Order Value | Revenue | ROI |
|---|---|---|---|---|
| WHISPER20 | 28 | $14.99 | $420 | Good |
| BREEZEGLOW | 19 | $27.99 | $532 | Better |
| VELVETLUXE | 12 | $30.99 | $372 | Good |

---

## Conversion Tracking Checklist

- [ ] GA4 conversions created (5 main events)
- [ ] Ecommerce tracking enabled
- [ ] Purchase event includes all transaction details
- [ ] Email signup tracking configured
- [ ] Blog engagement events set up
- [ ] Social link tracking implemented
- [ ] Contact form tracking added
- [ ] Conversion dashboard created
- [ ] Weekly review process established
- [ ] Coupon tracking configured

---

## Key Conversion Metrics

| Metric | WHISPER | BREEZE | VELVET | Overall |
|---|---|---|---|---|
| Product Views | 487 | 356 | 289 | 1,132 |
| Add to Cart | 89 | 71 | 58 | 218 |
| Purchases | 42 | 38 | 31 | 111 |
| Conversion Rate | 8.6% | 10.7% | 10.7% | 9.8% |
| AOV (THB) | 589 | 687 | 799 | 695 |

---

## Document Summary

| Item | Status |
|---|---|
| Conversion goals defined | Ready |
| GA4 conversion events created | Setup |
| Ecommerce tracking | Enabled |
| Email tracking | Enabled |
| Dashboard created | Ready |
| Weekly reports | In process |

**Next Phase:** Dashboard & Reporting Templates (Part 5)

---

**Version:** 1.0 | **Status:** Ready | **Updated:** 2026-07-03
