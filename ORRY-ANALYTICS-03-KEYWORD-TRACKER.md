# ORRY Thailand Analytics Setup
## Part 3: Keyword Ranking Tracker Setup

**Document Version:** 1.0  
**Created:** 2026-07-03  
**Timeline:** 1 hour setup + ongoing tracking  
**Owner:** Marketing Team

---

## PHASE 1: Target Keywords List

### Step 1.1: ORRY Thailand Core Keywords

Based on advertising package and product strategy, target these keywords:

#### WHISPER Keywords (Clear Hydration)
- whisper clear lip balm
- natural lip moisturizer
- hydrating lip balm
- 12 hour lip hydration
- lip balm dry lips
- natural lip care
- clear lip balm thailand

#### BREEZE Keywords (Warm Coral)
- warm coral lip balm
- daytime lip color
- natural lip tint
- lip balm warm undertones
- golden lip color
- best lip balm thailand

#### VELVET Keywords (Deep Red)
- deep red lip balm
- long wear lip color
- luxury lip balm
- 10 hour lip wear
- red lip balm
- premium lip care

#### Brand Keywords
- orry thailand
- orry lip care
- orry beauty
- natural beauty thailand

#### Category Keywords
- lip balm thailand
- natural lip care
- best lip balm asia
- lip care tips
- dry lips solution
- lip balm brands

**Total Target Keywords:** 25-30 keywords (tier 1 + tier 2)

---

## PHASE 2: Ranking Tracker Tools & Methods

### Option A: Free Google Rank Checker Tools

**Tool 1: SE Ranking Free Checker**
- URL: seranking.com/rank-tracker
- Pros: Easy, no account needed for limited checks
- Cons: Limited queries per day (5-10)
- Best for: Weekly manual checks

**Tool 2: Ubersuggest**
- URL: ubersuggest.com/rank-tracker
- Pros: Free tier available, 7-day trial, visual charts
- Cons: Limited projects on free tier
- Best for: Small project monitoring

**Tool 3: Small SEO Tools**
- URL: smallseotools.com/rank-checker
- Pros: Multiple site checks, free
- Cons: One-off checks only, not ongoing tracking
- Best for: Initial baseline snapshot

**Tool 4: Google Search Console (FREE BEST)**
- Already set up in Part 2
- Shows actual search performance
- Tracks: Impressions, Clicks, CTR, Position
- Best for: Real-world keyword performance data

### Option B: Affordable Paid Tools

**Semrush ($99-199/month)**
- Full rank tracking
- Competitor analysis
- Content optimization
- Backlink monitoring
- Best for: Serious SEO work

**Ahrefs ($99-399/month)**
- Rank tracking
- Backlink analysis
- Content explorer
- Keyword research
- Best for: Comprehensive analytics

**Moz ($99-599/month)**
- Rank tracking
- Domain authority monitoring
- Site audits
- Best for: Technical SEO focus

### Option C: Google Sheets + Manual Tracking (RECOMMENDED FOR START)

**Pros:**
- Completely free
- Simple to maintain
- All data in one place
- No learning curve

**Cons:**
- Manual updates required weekly
- Time-consuming for 100+ keywords
- Not automated

**Best for:** Small team with 25-30 keywords

---

## PHASE 3: Google Sheets Tracking Template

### Step 3.1: Create Tracking Spreadsheet

**Spreadsheet Name:** `ORRY Thailand - Keyword Rankings`

**Column Headers (A-H):**

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Keyword | Category | Volume | Week 1 | Week 2 | Week 3 | Week 4 | Trend |

### Step 3.2: Fill in Keywords

**Column A: Keyword**
- whisper clear lip balm
- natural lip moisturizer
- hydrating lip balm
- 12 hour lip hydration
- ... (all 25-30 keywords)

**Column B: Category**
- Product (WHISPER, BREEZE, VELVET)
- Brand
- Category
- Long-tail

**Column C: Volume (Monthly Search Volume)**
- Use Google Keyword Planner or Ubersuggest
- Example: 1,200 / 320 / 50 (rough estimates)

### Step 3.3: Initial Baseline Check

**Week 1 (NOW) - July 3, 2026**

For each keyword, check current ranking:

1. **Method 1: Google Incognito Search**
   - Open Google.com in incognito window
   - Search: "[keyword]"
   - Scroll through results
   - Find your domain rank (page 1-3, position 1-100)
   - Record in Column D

2. **Method 2: SE Ranking Free**
   - Go: seranking.com/rank-tracker
   - Enter domain: orrytheailand.com
   - Enter keyword
   - Shows current position for your domain

3. **Method 3: Google Search Console**
   - Go: search.google.com/search-console
   - Check "Performance" report
   - Column "Position" shows average ranking

**Example Data:**

| Keyword | Category | Volume | Week 1 |
|---|---|---|---|
| whisper clear lip balm | Product | 480 | 18 |
| natural lip moisturizer | Category | 320 | 32 |
| orry thailand | Brand | 140 | 5 |
| lip balm thailand | Category | 890 | NR |
| hydrating lip balm | Product | 560 | 45 |

*NR = Not Ranking (outside top 100)*

---

## PHASE 4: Weekly Tracking Process

### Every Friday: Update Rankings

**Time Required:** 30 minutes

1. **Open Spreadsheet**
   - Go to Google Sheets
   - Open: `ORRY Thailand - Keyword Rankings`

2. **Check Each Keyword**
   - For each row:
     * Open incognito window
     * Search the keyword
     * Note current position (1-100, or NR)
     * Update appropriate week column

3. **Complete Tracking**
   - Move last week's column data forward
   - Add new week column
   - Calculate trend

**Example Update (Week 2 - July 10):**

| Keyword | Week 1 | Week 2 | Trend |
|---|---|---|---|
| whisper clear lip balm | 18 | 16 | ↑ +2 |
| natural lip moisturizer | 32 | 28 | ↑ +4 |
| orry thailand | 5 | 4 | ↑ +1 |
| lip balm thailand | NR | 67 | ↑ Entry! |
| hydrating lip balm | 45 | 42 | ↑ +3 |

---

## PHASE 5: Advanced Tracking Features

### Step 5.1: Add Trend Indicator

**Column I: Trend (Formula)**

```
=IF(D1="", "", IF(ISNUMBER(D1), IF(E1="", "", 
  IF(E1="NR", "❌", IF(D1>E1, "↑ +"&D1-E1, "↓ "&E1-D1))
)))
```

This shows:
- ↑ +5 = Ranking improved 5 positions
- ↓ 3 = Ranking dropped 3 positions
- ❌ = Started ranking (was NR, now ranked)

### Step 5.2: Monthly Summary

Create separate tab: "Monthly Summary"

| Month | Keywords Ranking | Top 10 Keywords | Top 20 Keywords | Avg Position | Trend |
|---|---|---|---|---|---|
| July 2026 | 18/30 (60%) | 5 | 12 | 28 | Baseline |
| August 2026 | 22/30 (73%) | 7 | 15 | 24 | ↑ +4 |
| September 2026 | 25/30 (83%) | 9 | 18 | 20 | ↑ +4 |

---

## PHASE 6: Actionable Insights

### Step 6.1: Analyze Rankings Monthly

**Every month, review:**

1. **Keywords Moved to Top 10**
   - Are these converting?
   - Can we optimize title/meta to improve CTR?
   - Can we improve content to rank higher?

2. **Keywords in 11-20 Range**
   - These are "close" - small boost could help
   - Strategy: Build 1-2 quality backlinks
   - Optimize content for better keyword density

3. **Keywords Still Not Ranking (NR)**
   - Do we have content targeting this keyword?
   - If yes: Content may be weak; improve it
   - If no: Create new page/blog post for this keyword

4. **Keywords Dropping Rank**
   - Check if page was changed recently
   - Compare with competitor content
   - Identify why competitor ranks higher

### Step 6.2: Create Action Items

**Example Template:**

| Keyword | Current Rank | Target Rank | Action | Timeline |
|---|---|---|---|---|
| natural lip moisturizer | 28 | Top 10 | Improve blog post SEO + build 2 backlinks | 2 weeks |
| lip balm thailand | NR | Top 20 | Create new blog post targeting this | 3 weeks |
| whisper clear lip balm | 16 | Top 5 | Update product page + get 3 press mentions | 4 weeks |

---

## PHASE 7: Using Google Search Console Data

### Step 7.1: Compare GSC vs Rank Tracker

**Google Search Console shows:**
- Actual impressions from search
- Actual clicks from search
- Real user engagement

**Rank Tracker shows:**
- Theoretical ranking position
- Potential organic traffic

**How to Use Together:**

| Scenario | Action |
|---|---|
| High rank (#5) but low impressions (GSC) | Title/meta description is unappealing; rewrite it |
| High impressions (GSC) but low rank in tracker | Verify ranking method (regional differences?) |
| Low rank but high clicks in GSC | Your content is good; make it even better |
| Rank improved but GSC traffic declined | Competitor may have launched better content |

---

## PHASE 8: Competitive Benchmarking

### Step 8.1: Track Competitor Rankings

**Optional:** Add competitor domains to tracking

Create tab: "Competitor Tracking"

| Keyword | ORRY | Competitor A | Competitor B | Opportunity |
|---|---|---|---|---|
| natural lip balm | 28 | 8 | 15 | Need 15+ quality links |
| orry thailand | 4 | NR | NR | Strong position |
| lip care tips | 42 | 3 | 12 | Competitor dominating; need better content |

---

## PHASE 9: Automated Tracking (Advanced)

### If Budget Allows: Use Ubersuggest

**Cost:** Free 7-day trial, then $12-99/month

1. Sign up: ubersuggest.com
2. Add project: orrytheailand.com
3. Add 25 keywords
4. Set tracking: Automated weekly checks
5. Receive email reports with rankings

**Benefit:** Saves 30 min/week on manual tracking

---

## Summary: 4-Week Tracking Template

Create this as your tracking sheet:

```
ORRY Thailand Keyword Rankings - July 2026

Keyword | Category | Volume | Jul 3 | Jul 10 | Jul 17 | Jul 24 | Trend | Notes
whisper clear lip balm | Product | 480 | 18 | 16 | 14 | 12 | ↑↑↑ | Good progress
natural lip moisturizer | Category | 320 | 32 | 28 | 25 | 22 | ↑↑↑ | On track
orry thailand | Brand | 140 | 5 | 4 | 4 | 4 | Stable | Already strong
lip balm thailand | Category | 890 | NR | 67 | 52 | 38 | ↑↑↑ | Big wins
hydrating lip balm | Product | 560 | 45 | 42 | 39 | 36 | ↑↑↑ | Trending up
natural lip care | Category | 410 | 28 | 26 | 23 | 20 | ↑↑↑ | Good momentum
```

---

## Keyword Ranking Tracker Checklist

- [ ] Target 25-30 keywords identified
- [ ] Baseline rankings captured (Week 1)
- [ ] Google Sheets tracking template created
- [ ] Weekly check schedule set (every Friday)
- [ ] Competitor benchmarking sheet created (optional)
- [ ] Monthly review process established
- [ ] Team knows how to update rankings
- [ ] Monthly reporting template created

---

## Key Metrics to Track

| Metric | Baseline | Month 1 | Month 2 | Month 3 |
|---|---|---|---|---|
| Keywords Ranking (Top 100) | 18/30 | 22/30 | 25/30 | 28/30 |
| Keywords Top 10 | 2 | 4 | 6 | 8 |
| Keywords Top 20 | 8 | 11 | 14 | 17 |
| Average Position | 42 | 37 | 32 | 28 |
| New Keywords Ranking | - | 4 | 3 | 3 |

---

## Document Summary

| Item | Status |
|---|---|
| 25-30 target keywords identified | Ready |
| Baseline rankings captured | Week 1 |
| Tracking method chosen | Google Sheets + GSC |
| Weekly review process | Every Friday |
| Monthly analysis plan | Established |

**Next Phase:** Conversion Tracking Setup (Part 4)

---

**Version:** 1.0 | **Status:** Ready | **Updated:** 2026-07-03
