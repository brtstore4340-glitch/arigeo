---
name: product-smart-home
description: Product requirements for Smart Home IoT platform (Thai market, affordable automation)
metadata:
  type: project
  status: phase-1-understand
  date: 2026-07-21
  project: smart-home-platform
---

# 📋 PRODUCT DEFINITION: Smart Home Platform

**Phase**: 1 (Understand)  
**Owner**: Ekkarat (พี่เอก)  
**Status**: Draft — Awaiting vision details  
**Created**: 2026-07-21

---

## 🎯 ONE-LINE VISION

> [YOUR VISION HERE]  
> Example: "Make smart home affordable and accessible for Thai homeowners — no technical knowledge required, proven reliability, Thai language first"

---

## 👥 PERSONAS

### Persona 1: Homeowner (30-55 years old)
**Name**: [Your choice]  
**Tech Level**: Low-to-medium (uses smartphone, not comfortable with servers)  
**Pain Points**:
- Wants convenience (remote control, automation)
- Worried about cost (expensive apps + devices)
- Scared of complexity (setup, maintenance)
- Concerned about privacy (data leaks)
- Needs Thai language support

**Goals**:
- Turn lights/AC on/off remotely
- Automation schedules (come home routine, sleep mode)
- Lower electricity bill
- Reliable (works 99% of the time)
- Easy setup (no technician needed)

---

### Persona 2: Installer/Technician (25-40 years old)
**Name**: [Your choice]  
**Tech Level**: Medium (comfortable with WiFi, Zigbee setup)  
**Pain Points**:
- Manual setup for each customer (time-consuming)
- Device compatibility issues (different brands)
- After-sales support burden (customers call with questions)
- Profit margin too thin

**Goals**:
- Quick installation (30-60 min)
- Reliable devices (minimal callbacks)
- Dashboard to manage customer systems
- Recurring revenue (maintenance, monitoring)

---

### Persona 3: Developer (Smart Home Enthusiast)
**Name**: [Your choice]  
**Tech Level**: High (comfortable with APIs, automation)  
**Pain Points**:
- Vendor lock-in (Google Home, Alexa only)
- Limited customization
- Expensive ($50-100+ per app)
- Closed APIs

**Goals**:
- Custom automation logic
- Full API access (local + cloud)
- Integrate own devices
- Build on open protocol

---

## 🎪 MARKET CONTEXT

### Thailand Smart Home Market
- **Market Size**: ~50,000 potential households (Bangkok metro area, medium+ income)
- **Growth**: 15-20% YoY (accelerating post-COVID)
- **Pain Point**: High cost (devices 200-500 THB each, setup fee 1,000-3,000 THB)
- **Opportunity**: "Affordable + Thai" gap (under 100 THB/month, Thai UI)
- **Competition**: Google Home + Alexa dominate, but localization poor (English-heavy)

### Current Solutions in Thailand
| Solution | Cost | Pros | Cons | Language |
|----------|------|------|------|----------|
| Google Home | 1,500-3,000 THB + subscription | Global ecosystem | English UI, privacy issues | English |
| Alexa | 1,000-2,500 THB + subscription | Voice control | Limited device support Thailand | English |
| Local installers | Custom pricing | Local support | No self-service, expensive | Thai |
| **Our Niche** | 50-100 THB/month | Thai first, affordable, proven | Need to build | Thai |

---

## 📊 KEY METRICS

### Business Metrics
| Metric | Target | Timeline |
|--------|--------|----------|
| Households on platform | 1,000 | Month 12 |
| Monthly recurring revenue | 50,000-100,000 THB | Month 6 |
| Churn rate | < 5% | Month 3 |
| NPS score | > 50 | Month 6 |
| Installer partnerships | 50+ | Month 12 |

### Product Metrics
| Metric | Target | Why |
|--------|--------|-----|
| Setup time | < 30 minutes | Customer satisfaction |
| Device uptime | 99.5%+ | Reliability = trust |
| Automation reliability | 99%+ | "Never fails" reputation |
| Response time (command) | < 1 second | Feels instant/snappy |
| Mobile app engagement | 5+ times/day | Sticky product |

---

## 🚀 PHASED ROLLOUT

### Phase 1 (MVP — Weeks 1-8)
**Goal**: Core smart home automation (lights, AC, smart plugs)

- [ ] Device pairing (QR code + WiFi setup)
- [ ] Basic control (on/off, brightness for lights)
- [ ] Scheduling (time-based automation)
- [ ] Scene creation (come home, sleep, away)
- [ ] Mobile app (iOS + Android)
- [ ] Local network control (no internet required)
- [ ] Basic analytics (energy usage)
- [ ] Thai + English UI
- [ ] Support (email + phone hotline)

**Target**: 100 households, 5+ installer partners

**Go-to-market**: Pre-sales to installers + early adopters

---

### Phase 2 (Expansion — Weeks 9-16)
**Goal**: Voice control + integration ecosystem

- [ ] Voice control (Thai voice, OK Google / Alexa integration)
- [ ] Third-party device support (Zigbee, Z-Wave, WiFi mesh)
- [ ] IFTTT-style automation (if temp > 28°C, turn on AC)
- [ ] Energy monitoring (real-time consumption per device)
- [ ] Installer dashboard (manage 50+ customer homes)
- [ ] Subscription tiers (free + premium analytics)

**Go-to-market**: Installer partnership program, media coverage

---

### Phase 3 (Scale — Future)
**Goal**: AI-powered automation + market leadership

- [ ] Machine learning (learns usage patterns)
- [ ] Predictive automation (ac before you get home)
- [ ] Smart billing (distribute load during peak hours)
- [ ] Multi-language (Vietnamese, Indonesian, Laos)
- [ ] Hardware reseller program (white-label devices)
- [ ] Enterprise (office automation, hotels)

---

## 💡 FEATURE PRIORITIES

**P1 (Must Have — MVP)**:
- [ ] Device pairing (QR + WiFi)
- [ ] On/off control
- [ ] Time-based scheduling
- [ ] Scene creation (3-4 scenes)
- [ ] Mobile app (primary control)
- [ ] Thai UI

**P2 (Should Have — Phase 2)**:
- [ ] Voice control (Thai voice)
- [ ] Third-party device support
- [ ] Advanced automation (if/then)
- [ ] Energy monitoring
- [ ] Installer dashboard

**P3 (Nice to Have — Phase 3)**:
- [ ] Machine learning
- [ ] Geofencing
- [ ] Multi-home support
- [ ] Enterprise APIs
- [ ] Hardware marketplace

---

## 🎨 DESIGN VISION

### Tone & Feel
**Describe in your words**:
- Simple or feature-rich?
- Modern or accessible?
- Playful or professional?
- Western or local-first?

**Example**: "Simple + accessible. Modern but not trendy. Warm, trust-building tone. Thai-first, not English translated."

---

### Color Palette (Preliminary)
**Suggest colors** (or I recommend):
- Primary: [Color] (home, comfort, trust)
- Accent: [Color] (action, energy, smart)
- Alert colors: Green (OK), Yellow (caution), Red (error)

**Recommendation**: Warm orange + cool blue (comfort + tech), or warm green + purple (nature + smart)

---

### Target Devices
- Mobile (primary): iOS + Android apps (control + setup)
- Tablet (secondary): Dashboard view (monitoring)
- Voice (emerging): Speakers (commands, announcements)

**Priority Device**: Mobile (is the remote control)

---

## 📋 SUCCESS CRITERIA

**At MVP Launch** (Week 8):
- [ ] 100 households on platform
- [ ] 5+ installer partners
- [ ] 99.5%+ uptime
- [ ] < 30 min setup time
- [ ] Thai UI complete
- [ ] User satisfaction > 4/5

**At Month 3**:
- [ ] 300 households
- [ ] 15+ installer partners
- [ ] < 5% churn rate
- [ ] NPS > 45
- [ ] Voice control working

**At Month 6**:
- [ ] 1,000 households
- [ ] 50+ installer partners
- [ ] Monthly recurring revenue: 50K-100K THB
- [ ] NPS > 50
- [ ] Energy monitoring live

**At Month 12**:
- [ ] 3,000+ households
- [ ] 100+ installer partners
- [ ] Monthly recurring revenue: 300K+ THB
- [ ] Market recognition (media coverage)
- [ ] Multi-language support

---

## 🤔 OPEN QUESTIONS FOR YOU

**Please answer**:

1. **Core Value**: What's the #1 reason someone should choose us over Google Home?
   - Affordable? Thai language? Privacy? Local support? All of above?

2. **Primary Market**: Start with Bangkok / Chiang Mai / all Thailand?
   - Affects go-to-market strategy, support language, device availability

3. **Device Ecosystem**: Which devices first?
   - Lights + AC only? Include smart plugs? Smart locks?
   - Our own hardware, or integrate third-party?

4. **Revenue Model**:
   - Free app + subscription (premium analytics)?
   - Installer partnership revenue (commission)?
   - Hardware markup?
   - All three?

5. **Competitive Positioning**: Why not just use Google Home?
   - Cost advantage? Thai support? Privacy? Customization?

6. **Installer vs Direct Sales**: Sell through installers, or direct to consumers?
   - Affects unit economics, marketing strategy

7. **Timeline Flexibility**: Can you launch MVP with just lights + AC in 8 weeks?

---

## 🎯 NEXT STEP

**Today**:
1. Answer the 7 open questions above
2. Define 3-4 core personas in detail
3. Sketch 2-3 key user flows (setup, control, automation)

**Tomorrow**:
1. Zeus + Luxi review your vision
2. Move to Phase 2: Design System (colors, typography, spacing)
3. Create wireframes (mobile app screens)

---

**Status**: Awaiting your vision  
**Owner**: Ekkarat  
**Timeline**: Today's design = Week of dev

---

*ที่บ้านสุข ต้องมีเทคนโลยีที่เข้าใจ*  
*Home comfort requires technology that understands.*
