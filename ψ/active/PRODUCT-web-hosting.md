---
name: product-web-hosting
description: Product requirements for Web Hosting platform
metadata:
  type: project
  status: phase-1-understand
  date: 2026-07-21
  project: web-hosting-platform
---

# 📋 PRODUCT DEFINITION: Web Hosting Platform

**Phase**: 1 (Understand)  
**Owner**: Ekkarat (พี่เอก)  
**Status**: Draft — Awaiting vision details  
**Created**: 2026-07-21

---

## 🎯 ONE-LINE VISION

> [YOUR VISION HERE]  
> Example: "Simplified web hosting for small businesses and developers — no cPanel complexity, serverless-first, Thailand-based, affordable"

---

## 👥 PERSONAS

### Persona 1: Small Business Owner
**Name**: [Your choice]  
**Age**: 30-50  
**Tech Level**: Low-to-medium (uses apps, not comfortable with servers)  
**Pain Points**:
- Doesn't understand hosting (cPanel, FTP, databases confusing)
- Wants simple website (no tech complexity)
- Worried about downtime
- Wants to keep costs low
- Needs email support

**Goals**:
- Launch website quickly (same day)
- No technical knowledge needed
- Affordable monthly cost
- Good customer support
- SSL certificate automatically included

---

### Persona 2: Developer/Freelancer
**Name**: [Your choice]  
**Age**: 22-40  
**Tech Level**: High (comfortable with CLI, code, APIs)  
**Pain Points**:
- Tired of Shared hosting limitations
- Want to deploy own apps (Node.js, Python, etc.)
- Tired of customer support delays
- Want automation (CI/CD, webhooks)
- Need control + flexibility

**Goals**:
- Deploy code instantly (git push → live)
- Serverless or containerized (auto-scaling)
- Full API access (programmatic)
- Custom domains + SSL
- Good performance (fast load times)

---

### Persona 3: Agency/Reseller
**Name**: [Your choice]  
**Age**: 35-55  
**Tech Level**: Medium (manages multiple clients)  
**Pain Points**:
- Managing 50+ websites manually is exhausting
- Resellers margins too thin
- Want to white-label (brand as own)
- Client onboarding slow
- Billing/invoicing manual

**Goals**:
- Bulk management (dashboard for all clients)
- White-label solution (own branding)
- Automated provisioning
- Reseller pricing/margins
- Automated billing

---

## 🎪 MARKET CONTEXT

### Thailand Web Hosting Market
- **Market Size**: ~50,000 small businesses needing websites
- **Average Monthly Spend**: 300–1,000 THB per business
- **Pain Point**: Existing hosts (Thai and international) are either too cheap (unreliable) or too complex (cPanel)
- **Opportunity**: "Simple + Reliable + Affordable" gap
- **Growth**: SME digitalization accelerating post-COVID

### Competitive Landscape

| Competitor | Strength | Weakness | Price | Notes |
|-----------|----------|----------|-------|-------|
| Thai Hosts (Thnic, Thaiweb) | Local, cheap | Slow support, old UI | 100-300 THB/mo | Mass market |
| Shared Hosting (Bluehost, SiteGround) | Simple, global | Slow performance on shared, expensive | 300-800 THB/mo | Beginner-friendly |
| VPS (Linode, AWS) | Powerful, scalable | Too complex, requires tech knowledge | 1,000+ THB/mo | Developer-focused |
| **Our Niche** | Simple + serverless + Thailand | Need to build | 500-1,500 THB/mo | Target gap |

### Customer Acquisition
- Direct: Small business directories, Facebook groups
- Partner: Freelancer networks, agencies
- Content: Startup blogs, tutorials (Thai + English)
- Ads: Google Ads + Facebook (Thai SME segment)

---

## 📊 KEY METRICS

### Business Metrics
| Metric | Target | Timeline |
|--------|--------|----------|
| Websites hosted | 1,000 | Month 12 |
| Monthly recurring revenue | 500,000 THB | Month 12 |
| Churn rate | < 5% | Month 3 |
| NPS score | > 50 | Month 6 |
| Customer acquisition cost | < 1,000 THB | Month 6 |

### Product Metrics
| Metric | Target | Why |
|--------|--------|-----|
| Site deployment time | < 5 minutes | Customer happiness |
| Uptime | 99.9% | Reliability promise |
| Page load time | < 2 seconds | SEO + UX |
| Support response | < 2 hours | Competitive edge |
| One-click app install | 50+ apps | Ease of use |

---

## 🚀 PHASED ROLLOUT

### Phase 1 (MVP — Weeks 1-8)
**Goal**: Static sites + basic app hosting

- [ ] Domain registration (Thai TLDs + .com)
- [ ] Static site hosting (HTML/CSS/JS)
- [ ] One-click CMS (WordPress, Drupal)
- [ ] Node.js app deployment
- [ ] SSL certificates (auto-renew)
- [ ] Basic analytics
- [ ] Email forwarding
- [ ] Support (email + chat)

**Go-to-market**: Launch to friends + Thai dev community

---

### Phase 2 (Expansion — Weeks 9-16)
**Goal**: Serverless functions + database

- [ ] Serverless functions (Node.js, Python)
- [ ] Managed database (PostgreSQL, MySQL)
- [ ] CI/CD (GitHub integration)
- [ ] API management
- [ ] CDN (global fast delivery)
- [ ] Scheduled jobs (cron)
- [ ] Webhooks

**Go-to-market**: Expand to freelancers + agencies (reseller program)

---

### Phase 3 (Scale — Future)
**Goal**: White-label + advanced

- [ ] White-label platform (resellers)
- [ ] Advanced monitoring + alerting
- [ ] Load balancing
- [ ] Auto-scaling
- [ ] Advanced security (WAF, DDoS)
- [ ] API marketplace

**Go-to-market**: 10,000+ websites, established brand

---

## 💡 FEATURE PRIORITIES

**P1 (Must Have — MVP)**:
- [ ] Domain registration + management
- [ ] Static site hosting
- [ ] One-click WordPress
- [ ] SSL certificates
- [ ] Basic analytics

**P2 (Should Have — Phase 2)**:
- [ ] Node.js app deployment
- [ ] Managed database
- [ ] CI/CD integration
- [ ] Custom email
- [ ] Advanced support

**P3 (Nice to Have — Later)**:
- [ ] Serverless functions
- [ ] API marketplace
- [ ] White-label option
- [ ] Advanced monitoring
- [ ] Mobile app

---

## 🎨 DESIGN VISION

### Tone & Feel
**Describe in your words**:
- Simple or feature-rich?
- Modern or traditional?
- Playful or professional?
- Tech-focused or business-focused?

**Example**: "Simple + professional. Modern without being trendy. Clear + trustworthy. Business-focused but accessible to non-tech."

---

### Color Palette (Preliminary)
**Suggest colors** (or I recommend):
- Primary: [Color] (trust, tech, action)
- Accent: [Color] (call-to-action, growth)
- Alert colors: Green (success), Yellow (warning), Red (error)

**Recommendation**: Tech Blue + Orange accent (similar to modern SaaS pattern)

---

### Target Users' Devices
- Desktop (main): Mac/Windows browsers (setup)
- Mobile (secondary): Check status, simple actions
- Tablet (occasional): Manage multiple sites

**Priority Device**: Desktop (complex dashboard)

---

## 📋 SUCCESS CRITERIA

**At MVP Launch** (Week 8):
- [ ] 100 beta users
- [ ] 50+ WordPress sites hosted
- [ ] 99.9% uptime
- [ ] < 5 min deployment time
- [ ] Support response < 2 hours
- [ ] User satisfaction > 4/5

**At Month 3**:
- [ ] 500 paying customers
- [ ] 1,000 sites hosted
- [ ] Churn rate < 5%
- [ ] NPS > 45
- [ ] Repeat business (renewals)

**At Month 6**:
- [ ] 1,000 customers
- [ ] 5,000+ sites
- [ ] Churn < 3%
- [ ] NPS > 50
- [ ] Revenue: 200K–300K THB/month

**At Month 12**:
- [ ] 2,000+ customers
- [ ] 10,000+ sites
- [ ] Recurring revenue: 500K+ THB/month
- [ ] Market recognition (press, blogs)
- [ ] Reseller program active (50+ partners)

---

## 🤔 OPEN QUESTIONS FOR YOU

**Please answer**:

1. **Core Problem**: What's the #1 pain you're solving?
   - Complexity? Cost? Performance? Support? All?

2. **Primary Market**: Start with Thai SMEs, or global developers, or both?
   - Affects pricing, language, support, marketing

3. **Hosting Infrastructure**: Cloud provider preference?
   - AWS? Vercel? DigitalOcean? In-house?

4. **Pricing Model**: 
   - How much per month per customer?
   - Tiers: Starter/Pro/Enterprise or flat-rate?

5. **Monetization**: 
   - Monthly subscription only, or add-ons (domains, extra storage)?
   - Reseller/affiliate margins?

6. **Competitive Edge**: What makes us different?
   - Cheaper? Simpler? Faster support? Thai-first?

7. **Team**: Who builds this?
   - In-house dev team, or outsource initially?

---

## 🎯 NEXT STEP

**Today**:
1. Answer the 7 open questions above
2. Define pricing model + customer tiers
3. Sketch 3-5 core user flows (register → deploy → manage)

**Tomorrow**:
1. Zeus + Luxi review your vision
2. Move to Phase 2: Design System (colors, typography, layout)
3. Create wireframes (dashboard, deployment, settings)

---

**Status**: Awaiting your vision  
**Owner**: Ekkarat  
**Timeline**: Today's design = Week of dev

Let's build this. 🚀
