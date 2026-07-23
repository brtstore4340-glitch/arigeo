---
name: project-wishlist
description: Future projects in development pipeline — Ekkarat's vision for gradual expansion
metadata:
  type: project
  ttl: ∞
  date: 2026-07-21
  status: planning
---

# 📋 Project Wishlist — Future Development Pipeline

**Owner**: Ekkarat (พี่เอก)  
**Created**: 2026-07-21  
**Status**: Planning & Gradual Rollout  
**Authority**: Human-driven (Ekkarat designs, fleet executes)

---

## Overview

Three projects planned for gradual development. Each will use the Design Governance framework (.ai/), Agent coordination system, and Zeus Oracle fleet support.

---

## 1. 🌐 Web Hosting

### Summary
**Type**: Infrastructure / SaaS Platform  
**Purpose**: Simplified web hosting for small businesses and developers  
**Complexity**: Medium-High  
**Estimated Timeline**: 8-12 weeks

### Vision
- Simplified hosting interface (vs. cPanel, Plesk complexity)
- One-click deployment for common apps (WordPress, Node.js, Python, etc.)
- Serverless-first architecture (auto-scaling, pay-per-use)
- Thailand-based data centers (local compliance)

### Key Features (Phase 1)
- [ ] Domain registration + management
- [ ] Static site hosting (HTML/CSS/JS)
- [ ] Node.js + Python app deployment
- [ ] Database provisioning (PostgreSQL, MySQL)
- [ ] SSL certificates (auto-renew)
- [ ] Backup automation
- [ ] Analytics dashboard

### Technology Stack (Planned)
- Frontend: React (Luxi design) → Captain-Maid blue + gold theme
- Backend: Node.js + Express
- Database: PostgreSQL
- Infrastructure: Vercel (frontend) + AWS Lambda (backend)
- DNS: Route53
- Status: Planned

### Design Requirements
- **Brand**: Professional, trustworthy, simple
- **Audience**: Small business owners (non-technical)
- **Tone**: Clear, helpful, not intimidating
- **Colors**: TBD (recommend: Trust + Professional — similar to Orry template)

### Fleet Roles
- **Luxi**: Design system, UI/UX
- **Stratum**: Architecture, API design
- **Teleos**: Deployment pipeline (Vercel)
- **Aris**: Code quality, testing

### Next Step
> Ekkarat designs feature list + wireframes. Fleet awaits design docs.

---

## 2. 🏠 Smart Home

### Summary
**Type**: IoT Platform / Home Automation  
**Purpose**: User-friendly smart home control system  
**Complexity**: High  
**Estimated Timeline**: 12-16 weeks

### Vision
- Thai-language first (primary UI)
- Integration with common devices (Tuya, Zigbee, WiFi)
- Mobile-first (Android + iOS)
- Thailand market focus (local appliances, Thai utilities)
- Affordable (vs. Apple HomeKit, Google Home pricing)

### Key Features (Phase 1)
- [ ] Device discovery + pairing (QR code)
- [ ] Room-based organization (เตียง, ห้องครัว, ห้องนั่งเล่น)
- [ ] Automation rules (if-this-then-that)
- [ ] Real-time monitoring (power usage, temperature)
- [ ] Mobile app (iOS + Android)
- [ ] Voice control (Thai language — pending)
- [ ] Energy savings dashboard

### Technology Stack (Planned)
- Frontend Mobile: React Native (cross-platform)
- Frontend Web: React + Luxi design
- Backend: Node.js + Socket.io (real-time)
- Database: Firebase or PostgreSQL
- IoT Protocol: MQTT + REST API
- Status: Planned

### Design Requirements
- **Language**: Thai first, English second
- **Audience**: Thai homeowners (25-55 years old)
- **Tone**: Simple, helpful, trustworthy
- **Colors**: TBD (recommend: Warm + Accessible — similar to Captain-Maid warmth)
- **Accessibility**: WCAG 2.2 AA (Thai text clarity critical)

### Fleet Roles
- **Luxi**: Mobile UI/UX, Thai design localization
- **Stratum**: IoT architecture, device integration
- **Teleos**: CI/CD for mobile + backend
- **Aris**: Testing, device compatibility
- **Khun-Ram**: Thai language authority, localization

### Challenges
- Thai character rendering in mobile apps
- Device compatibility matrix (100+ devices)
- Real-time synchronization across devices
- Battery life optimization for mobile

### Next Step
> Ekkarat defines device scope + priority list. Fleet awaits requirements.

---

## 3. 💊 Pharmacy Expiry Management System

### Summary
**Type**: SaaS / Inventory Management  
**Purpose**: Track medication expiry dates + automate ordering  
**Complexity**: Medium  
**Estimated Timeline**: 6-10 weeks

### Vision
- Solve pharmacy waste (expired meds thrown away)
- Automated expiry alerts (before expiration)
- Integration with POS (point-of-sale) systems
- Thailand pharmacy regulations compliance
- Barcode scanning (batch tracking)

### Key Features (Phase 1)
- [ ] Medication inventory (barcode + manual entry)
- [ ] Expiry date tracking (per batch, per location)
- [ ] Alert system (7 days before expiry, 1 day before)
- [ ] Automated reorder suggestions
- [ ] Batch archival (expired stock removal)
- [ ] Dashboard (expiry timeline, stock levels)
- [ ] POS integration (optional)
- [ ] Reporting (compliance, waste metrics)

### Technology Stack (Planned)
- Frontend: React (desktop dashboard)
- Mobile: React Native (barcode scanner)
- Backend: Node.js + Express
- Database: PostgreSQL
- Barcode: Zebra library or Dynamsoft
- Status: Planned

### Design Requirements
- **Brand**: Professional, medical, organized
- **Audience**: Pharmacy owners, pharmacists, technicians
- **Tone**: Clear, accurate, regulatory-focused
- **Colors**: TBD (recommend: Medical blue + Green accent — professional + trust)
- **Accessibility**: WCAG 2.2 AA (critical for older staff)

### Regulatory Considerations
- Thailand FDA compliance (ส.อ.ท. regulations)
- Batch tracking requirements
- Audit trail (who changed what, when)
- Data retention (2+ years for compliance)

### Fleet Roles
- **Luxi**: Dashboard design, mobile UI
- **Stratum**: Database schema (batch management, audit logs)
- **Teleos**: Integration testing with POS systems
- **Aris**: Compliance verification, testing
- **Dheva**: ORRY ERP integration (if applicable)

### Market Opportunity
- 14,000+ pharmacies in Thailand
- Average pharmacy wastes 5-8% of inventory to expiry
- ROI typically 3-6 months

### Next Step
> Ekkarat defines pharmacy scope (small/medium/chain). Fleet awaits feature prioritization.

---

## 📈 Wishlist Status & Timeline

| Project | Phase | Start | Current | Milestone | Status |
|---------|-------|-------|---------|-----------|--------|
| **Web Hosting** | Planning | TBD | Design | Wireframes → Spec | 🟡 Awaiting |
| **Smart Home** | Ideation | TBD | Vision | Requirements → Architecture | 🟡 Awaiting |
| **Pharmacy Expiry** | Planning | TBD | Scope | Feature list → Database design | 🟡 Awaiting |

---

## 🔄 How Ekkarat Will Work This

> "ผมจะค่อยๆ ทำแล้ว" — I'll gradually do it

**Process**:
1. **Design Phase** (Ekkarat) — Create wireframes, define requirements
2. **Share with Fleet** (Zeus) — Post to agent queue or task orders
3. **Fleet Review** (Luxi, Stratum, etc.) — Suggest architecture, flag issues
4. **Iterate** (Ekkarat) — Refine based on feedback
5. **Greenlight** (Ekkarat) — When ready, signal "start development"
6. **Execute** (Fleet) — Full deployment with Design Governance

---

## 🎯 Fleet Readiness Checklist

Before each project launches:

- [ ] `.ai/PROJECT_OVERRIDES/[project].md` created (brand, colors, tokens)
- [ ] `PROJECT.md` written (goals, personas, requirements)
- [ ] Database schema designed + reviewed
- [ ] API endpoints specified
- [ ] Wireframes + design system approved
- [ ] Testing strategy defined
- [ ] Deployment pipeline ready
- [ ] CLAUDE.md updated with project-specific rules

---

## 🔗 Integration with Design Governance

Each project will use:

✅ **5-Phase Design Process** (MASTER-FRONTEND-PROMPT.md)  
✅ **Fleet Token Definitions** (DESIGN_SYSTEM.md)  
✅ **Implementation Standards** (IMPLEMENTATION-RULES.md)  
✅ **Project Overrides** (PROJECT_OVERRIDES/[project].md)  
✅ **Agent Coordination** (ψ/inbox/agent-queue/)  
✅ **Memory System** (ψ/memory/)  

---

## 📝 Notes

### For Ekkarat
When ready to work on a project:
1. Create `PROJECT.md` with full requirements
2. Post to `ψ/inbox/agent-queue/` if need feedback
3. Signal Zeus when design is ready
4. Fleet handles rest

### For Fleet
- Monitor wishlist for status changes
- Be ready to provide architecture/design feedback
- Don't start development until Ekkarat signals green light
- Use Design Governance for all three projects

---

**Last Updated**: 2026-07-21  
**Next Review**: When Ekkarat starts Phase 1 on first project  
**Authority**: Ekkarat (พี่เอก)

---

*This wishlist captures Ekkarat's vision for future expansion. Each project will be tackled gradually, using the mature Design Governance system and Zeus Oracle fleet.*
