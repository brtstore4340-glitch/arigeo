# ORRY Thailand Analytics Setup
## Part 1: Google Analytics 4 (GA4) Configuration Guide

**Document Version:** 1.0  
**Created:** 2026-07-03  
**Timeline:** 2-3 hours implementation  
**Owner:** Implementation Team

---

## PHASE 1: GA4 Property Creation

### Step 1.1: Create GA4 Property

1. **Log in to Google Analytics**
   - Go to: analytics.google.com
   - Use brand account: (tbd - assign after setup)
   - Create new account if needed

2. **Create Property**
   - Click: "Create" → "Property"
   - Property Name: `ORRY Thailand - Lip Care`
   - Reporting Time Zone: `Asia/Bangkok (GMT+7)`
   - Currency: `Thai Baht (THB)` OR `USD` (align with sales region)
   - Industry Category: `Beauty & Cosmetics`

3. **Generate Tracking ID**
   - Once created, property generates: **G-XXXXXXXXXX** (Measurement ID)
   - **SAVE THIS ID** - Required for all tracking

### Step 1.2: Data Stream Setup

1. **Create Web Data Stream**
   - Click: "Data Streams" → "Web"
   - Website URL: `https://orrytheailand.com` (or actual domain)
   - Stream Name: `ORRY Thailand Website`
   - Click: "Create Stream"

2. **Configure Enhanced Ecommerce (Required)**
   - In Data Stream settings → "Configure Tag Settings"
   - Enable: 
     * ✅ Enhanced ecommerce
     * ✅ Google Signals
     * ✅ Ads conversion reporting

3. **Get Installation Instructions**
   - Copy Web Stream ID: **G-XXXXXXXXXX**
   - You'll see implementation options (Google Tag Manager recommended)

---

## PHASE 2: Tracking Code Installation

### Option A: Direct GTM Setup (RECOMMENDED)

#### 2A.1: Google Tag Manager Container Setup

1. **Create GTM Container**
   - Go to: tagmanager.google.com
   - Create Account: `ORRY Thailand`
   - Create Container: `Website`
   - Platform: `Web`
   - Accept terms → Create

2. **Get GTM Container ID**
   - Format: `GTM-XXXXXXXX`
   - **SAVE THIS** - Pass to web dev team

3. **Add GA4 Configuration Tag**
   - Workspace → "New Tag"
   - Tag Type: `Google Analytics: GA4 Configuration`
   - Measurement ID: `[PASTE YOUR G-XXXXXXXX]`
   - Triggering: `All Pages`
   - Save & Name: `GA4 - Config - All Pages`

#### 2A.2: Add to Website Header

Web dev team adds to `<head>` section of ALL pages:

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXXX');</script>
<!-- End Google Tag Manager -->
```

Add to `<body>` immediately after opening tag:

```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

### Option B: Direct Code Installation (If no GTM)

Add to `<head>` section:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## PHASE 3: Event Configuration

### 3.1: Automatic Events (Built-in GA4)

These fire automatically - NO code needed:

| Event | Triggers |
|---|---|
| `page_view` | User loads page |
| `scroll` | User scrolls 90% of page |
| `click` | Any link click |
| `view_search_results` | Search query submitted |

---

### 3.2: Custom Events to Configure

**Event 1: Product Page View** (view_item)
- When: User views WHISPER, BREEZE, or VELVET product page
- Currency: THB
- Track product name, category, price, SKU

**Event 2: Add to Cart** (add_to_cart)
- When: User clicks "Add to Cart" button
- Track item details, quantity, value

**Event 3: Purchase Completion** (purchase)
- When: Order completed successfully
- Track transaction ID, total value, tax, items

**Event 4: Blog Post View** (page_view)
- When: User visits blog article page
- Tag with content_type: blog_post

**Event 5: CTA Click** (engagement)
- When: User clicks Shop/Learn More/Download buttons
- Track CTA text and destination

**Event 6: Email Signup** (sign_up)
- When: User subscribes to newsletter
- Track signup source (popup, form, etc.)

**Event 7: Social Link Click** (engagement)
- When: User clicks Instagram, TikTok, Facebook links
- Track which platform

**Event 8: Contact Form Submit** (lead)
- When: User submits contact/inquiry form
- Track form name and location

---

## PHASE 4: Audience Setup

Create 8 segments in Admin → Audience:

1. **New Visitors (First 7 Days)**
   - First appearance in last 7 days
   - Track new customer acquisition

2. **Product Viewers - No Purchase**
   - Viewed product but did NOT purchase (30 days)
   - For retargeting campaigns

3. **Blog Content Engagers**
   - Viewed page with `/blog/` or content_type: blog_post
   - Track content effectiveness

4. **Cart Abandoners (24h)**
   - add_to_cart event but NO purchase within 24 hours
   - Trigger abandoned cart emails

5. **Purchasers (All-Time)**
   - Completed purchase event
   - VIP tracking and loyalty programs

6. **High-Value Visitors**
   - Time on site > 10 minutes AND viewed products
   - Priority engagement segment

7. **Mobile Users**
   - Device type = mobile
   - Mobile-specific campaigns

8. **Social Traffic**
   - Source contains: instagram, tiktok, facebook
   - Track social channel ROI

---

## PHASE 5: Verification Checklist

- [ ] GA4 Property created (save ID: G-XXXXXXXX)
- [ ] GTM Container created (save ID: GTM-XXXXXXXX)
- [ ] Tracking code installed in website
- [ ] All 8 custom events configured
- [ ] Events tested in GA4 DebugView
- [ ] 8 Audiences created and active
- [ ] Data retention set to 14 months

**Testing:** Load site → check DebugView → perform actions (view product, add to cart, sign up) → verify events fire within 5 seconds

---

## PHASE 6: Dashboard Setup

Create custom dashboard with:
- Total Users (scorecard)
- Sessions (scorecard)
- Conversion Rate (scorecard)
- Revenue THB (scorecard)
- Daily Revenue Trend (time series)
- Traffic Source (pie chart)
- Top Landing Pages (table)
- Top Products (table)
- Users by Country (geo chart)

---

## Document Summary

| Item | Status |
|---|---|
| GA4 Property | To be created |
| GTM Container | To be created |
| Events | 8 configured |
| Audiences | 8 created |
| Dashboard | Ready |

**Next:** Google Search Console Setup (Part 2)

---

**Version:** 1.0 | **Status:** Ready | **Updated:** 2026-07-03
