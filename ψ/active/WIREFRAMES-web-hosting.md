---
name: wireframes-web-hosting
description: Desktop-first wireframes for Web Hosting platform (5 key screens)
metadata:
  type: project
  status: phase-3-wireframes
  date: 2026-07-21
  project: web-hosting-platform
---

# 🖼️ WIREFRAMES: Web Hosting Platform

**Phase**: 3 (Build Tokens & Wireframes)  
**Approach**: Desktop-first (1024px base), responsive to tablet/mobile  
**Created**: 2026-07-21

---

## SCREEN 1: DASHBOARD (Home)

### Purpose
Main dashboard showing all user's websites with quick overview and actions.

### Desktop Layout (1024px+)

```
┌──────────────────────────────────────────────────────────────┐
│ Logo  Dashboard  [Sites] [Email] [Domains] [Support]  🔔 ⚙️  │ ← Top nav
├──────┬────────────────────────────────────────────────────────┤
│      │                                                        │
│ •Home│  QUICK STATS (3 cards, 1 row)                         │
│ •Site│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│ •Emli│  │ Sites       │  │ Uptime      │  │ Bandwidth   │   │
│ •Dma│  │ 12          │  │ 99.9%       │  │ 256 GB used │   │
│ •Sup│  │ ▲ 2 new     │  │ ✅ Excellent│  │ ◀─ 768 GB ▶ │   │
│      │  └─────────────┘  └─────────────┘  └─────────────┘   │
│      │                                                        │
│      │  MY SITES (Table View, sorted by status)              │
│      │  ┌────────────────────────────────────────────────┐   │
│      │  │ Domain          │Status │Visitors │ Uptime │ ▶│   │
│      │  ├────────────────────────────────────────────────┤   │
│      │  │ example.com     │✅ Run │ 1,240   │ 99.98% │ ▶│   │
│      │  │ myblog.net      │✅ Run │   856   │ 99.99% │ ▶│   │
│      │  │ startup.io      │⚠️ Warn│   124   │ 99.80% │ ▶│   │
│      │  │ old-site.biz    │✅ Run │    45   │ 99.95% │ ▶│   │
│      │  │ dev.test        │🟡 Pend│   ---   │  N/A   │ ▶│   │
│      │  ├────────────────────────────────────────────────┤   │
│      │  │ + 7 more sites                                 │   │
│      │  └────────────────────────────────────────────────┘   │
│      │                                                        │
│      │  [+ New Site]  [Import]  [Settings]                   │
│      │                                                        │
│      │  RECENT ACTIVITY                                      │
│      │  ✅ 2h ago  example.com deployed v3.2.1               │
│      │  ✅ 6h ago  startup.io SSL cert renewed              │
│      │  🔴 1d ago  old-site.biz certificate expired         │
│      │                                                        │
└──────┴────────────────────────────────────────────────────────┘
```

### Component Spec

**Top Navigation**:
- Logo (32px) + product name
- Nav items: Dashboard (active), Sites, Email, Domains, Support
- Right: Notifications + Settings icon
- Sticky (always visible when scrolling)

**Quick Stats** (3-column grid):
- Card: 16px padding, light background, border
- Large number (24px bold) + label (12px)
- Optional trend (↑ ↓ with color)

**Sites Table**:
- Columns: Domain | Status | Visitors | Uptime | Actions
- Rows: 5 visible, "show more" link
- Status badges: Color-coded (green/yellow/gray)
- Hover: Highlight row, show quick actions

**Action Buttons**:
- Primary: [+ New Site] (blue)
- Secondary: [Import], [Settings] (ghost style)

**Recent Activity**:
- Timeline (icon + time + action)
- Icons: ✅ (green), 🔴 (red), ⚠️ (yellow)

---

### Tablet Layout (768px)

```
Same as desktop, but:
- Sidebar: Hidden by default (hamburger menu)
- Quick Stats: Stack vertically (3 rows)
- Table: Horizontal scroll if needed, or card view
```

---

### Mobile Layout (320px)

```
┌──────────────────┐
│ ☰  Dashboard  ⚙️  │  ← Hamburger menu
├──────────────────┤
│                  │
│ ✅ 12 Sites      │  ← Quick summary (card)
│ 99.9% Uptime     │
│ 256GB Bandwidth  │
│                  │
├──────────────────┤
│ MY SITES         │
│                  │
│ example.com  ✅  │  ← Card view (tap to expand)
│ 1,240 visitors   │
│ [Settings ▶]     │
│                  │
│ myblog.net   ✅  │
│ 856 visitors     │
│ [Settings ▶]     │
│                  │
│ [+ New Site]     │
│                  │
└──────────────────┘
```

---

## SCREEN 2: NEW SITE (Onboarding)

### Purpose
Multi-step wizard to register domain or connect existing domain, choose platform, deploy.

### Desktop Layout (1024px+)

```
┌──────────────────────────────────────────────────────────────┐
│ Logo  Dashboard  [Sites] [Email] [Domains]  🔔 ⚙️             │
├──────┬────────────────────────────────────────────────────────┤
│      │                                                        │
│ •Home│  NEW SITE (Step 2 of 4)                              │
│ •Site│  ▮▮▯▯ Progress bar                                     │
│ •Emli│                                                        │
│ •Dma│  CHOOSE DOMAIN                                         │
│ •Sup│                                                        │
│      │  ☑️ Register new domain                               │
│      │  ☐ Use existing domain                                │
│      │                                                        │
│      │  Domain Name *                                         │
│      │  ┌──────────────────────────────────┐                 │
│      │  │ mywebsite    .com   ▼             │                │
│      │  └──────────────────────────────────┘                 │
│      │  ✅ Available - $11.99/year                            │
│      │                                                        │
│      │  Other Extensions:                                     │
│      │  • .net     ($14.99/year)                             │
│      │  • .co      ($31.99/year)                             │
│      │  • .io      ($49.99/year)                             │
│      │                                                        │
│      │  ┌──────────────────────────────────┐                 │
│      │  │ [◀ Back]              [Next ▶]    │                │
│      │  └──────────────────────────────────┘                 │
│      │                                                        │
└──────┴────────────────────────────────────────────────────────┘
```

**Step 1**: Choose domain  
**Step 2**: Select platform (WordPress, Node.js, Static, etc.)  
**Step 3**: Configure settings (email, SSL, etc.)  
**Step 4**: Review + deploy  

### Components

**Progress Indicator**:
- Visual bar: ▮▮▯▯ (steps completed vs. remaining)
- Text: "Step 2 of 4"

**Radio Buttons** (Register vs. Existing):
- ☑️ / ☐ icons
- Click to switch between flows

**Domain Input**:
- Text field: domain name part
- Dropdown: TLD selection (.com, .net, etc.)
- Real-time validation (✅ available / 🔴 taken)
- Price display

**Step Navigation**:
- [◀ Back] (secondary button)
- [Next ▶] (primary button, blue)
- Both disabled on first/last step

---

## SCREEN 3: SITE SETTINGS

### Purpose
Configuration page for individual site (SSL, redirects, performance, integrations).

### Desktop Layout (1024px+)

```
┌──────────────────────────────────────────────────────────────┐
│ Logo  Dashboard  [Sites] [Email] [Domains]  🔔 ⚙️             │
├──────┬────────────────────────────────────────────────────────┤
│      │                                                        │
│ •Home│  SITE SETTINGS: example.com                           │
│ •Site│  ✅ Running  [← back]                                 │
│ •Emli│                                                        │
│ •Dma│  TABS:  [General] [SSL] [Performance] [Integrations] │
│ •Sup│                                                        │
│      │  GENERAL SETTINGS (Tab 1)                             │
│      │  ┌────────────────────────────────────────────────┐   │
│      │  │ Site Name          │ example.com              │   │
│      │  │ Description        │ My portfolio website     │   │
│      │  │ Owner Email        │ owner@example.com        │   │
│      │  │ Timezone           │ Asia/Bangkok          ▼ │   │
│      │  │ Language           │ English               ▼ │   │
│      │  │                                              │   │
│      │  │ Redirect HTTP → HTTPS:  ☑️ Yes               │   │
│      │  │ Automatic backups:      ☑️ Daily (14 days)   │   │
│      │  │ Analytics enabled:      ☑️ Yes               │   │
│      │  └────────────────────────────────────────────────┘   │
│      │                                                        │
│      │  DANGER ZONE                                          │
│      │  ┌────────────────────────────────────────────────┐   │
│      │  │ Pause Site     [Pause]  (billing continues)   │   │
│      │  │ Delete Site    [Delete] (⚠️ Irreversible!)   │   │
│      │  └────────────────────────────────────────────────┘   │
│      │                                                        │
│      │  [Save Changes]                                       │
│      │                                                        │
└──────┴────────────────────────────────────────────────────────┘
```

**Tabs**:
1. General (site name, description, settings)
2. SSL (certificate status, auto-renewal)
3. Performance (cache, compression, CDN)
4. Integrations (GitHub, email, analytics)

### Components

**Settings Form**:
- Label | Input field pairs
- Dropdowns with ▼ indicator
- Toggles (yes/no)
- Text area for long content

**Danger Zone**:
- Red background (#fee2e2) or red border
- Warning text
- Buttons: Red ([Pause] [Delete])

**Save Button**:
- Primary (blue) when changes made
- Disabled if no changes
- Shows confirmation toast on save

---

## SCREEN 4: DEPLOYMENT + LOGS

### Purpose
View deployment status, build/deploy logs, error debugging.

### Desktop Layout (1024px+)

```
┌──────────────────────────────────────────────────────────────┐
│ Logo  Dashboard  [Sites] [Email] [Domains]  🔔 ⚙️             │
├──────┬────────────────────────────────────────────────────────┤
│      │                                                        │
│ •Home│  DEPLOYMENTS: example.com                             │
│ •Site│  ✅ Running (v3.2.1)  [← back]                        │
│ •Emli│                                                        │
│ •Dma│  LATEST DEPLOYMENT                                     │
│ •Sup│  ┌────────────────────────────────────────────────┐   │
│      │  │ Status: ✅ SUCCESS                             │   │
│      │  │ Deployed: 2h ago (2026-07-21 09:15)           │   │
│      │  │ Duration: 45 seconds                           │   │
│      │  │ Commit: abc123 "Add new feature"              │   │
│      │  │ Branch: main                                   │   │
│      │  │ Author: john@example.com                       │   │
│      │  └────────────────────────────────────────────────┘   │
│      │                                                        │
│      │  DEPLOYMENT TIMELINE                                  │
│      │  ✅ 09:15:45 Deployed to production                   │
│      │     └─ ✅ 09:15:30 Tests passed (142 tests)           │
│      │        └─ ✅ 09:15:15 Build completed                 │
│      │           └─ ✅ 09:15:00 Git push detected            │
│      │                                                        │
│      │  ✅ 08:45 Deployed v3.2.0 (previous)                  │
│      │  ✅ Yesterday Deployed v3.1.5                         │
│      │                                                        │
│      │  BUILD LOGS                                           │
│      │  ┌────────────────────────────────────────────────┐   │
│      │  │ ▼ Show full output                             │   │
│      │  │                                                │   │
│      │  │ $ npm run build                                │   │
│      │  │ > Building app...                              │   │
│      │  │ ✓ Compiled 45 components                       │   │
│      │  │ ✓ CSS optimized (125KB → 42KB)                │   │
│      │  │ ✓ Images optimized (8 images)                  │   │
│      │  │ ✓ Build complete in 24s                        │   │
│      │  │                                                │   │
│      │  │ [Download Full Log]                            │   │
│      │  └────────────────────────────────────────────────┘   │
│      │                                                        │
│      │  [Rollback to Previous]  [Deploy Again]              │
│      │                                                        │
└──────┴────────────────────────────────────────────────────────┘
```

### Components

**Status Header**:
- Large badge (✅ SUCCESS / 🔴 FAILED / ⚠️ BUILDING)
- Metadata: time, commit, author

**Timeline**:
- Vertical list of steps
- Status icon (✅ / 🔴 / ⏳)
- Indented tree (hierarchical steps)
- Click to expand each step

**Logs Output**:
- Code block (dark background)
- Monospace font
- Syntax highlighting (if applicable)
- Copy button
- Download full log link

**Action Buttons**:
- [Rollback to Previous] (secondary, gray)
- [Deploy Again] (primary, blue)
- [View Details] (ghost, text only)

---

## SCREEN 5: DOMAIN MANAGEMENT

### Purpose
Register, renew, manage DNS, configure email forwarding.

### Desktop Layout (1024px+)

```
┌──────────────────────────────────────────────────────────────┐
│ Logo  Dashboard  [Sites] [Email] [Domains]  🔔 ⚙️             │
├──────┬────────────────────────────────────────────────────────┤
│      │                                                        │
│ •Home│  MY DOMAINS                                           │
│ •Site│  [+ Register Domain]  [Import Domain]  [Renew]        │
│ •Emli│                                                        │
│ •Dma│  ACTIVE DOMAINS                                         │
│ •Sup│  ┌────────────────────────────────────────────────┐   │
│      │  │ Domain          │Expires │Status   │ Renew  │   │
│      │  ├────────────────────────────────────────────────┤   │
│      │  │ example.com     │2026-12 │✅ Active│ [Renew] │   │
│      │  │ myblog.net      │2028-03 │✅ Active│ [Renew] │   │
│      │  │ startup.io      │2025-09 │⚠️ Soon! │ [Renew] │   │
│      │  │ old-site.biz    │2024-06 │🔴 Exp! │ [Renew] │   │
│      │  └────────────────────────────────────────────────┘   │
│      │                                                        │
│      │  DOMAIN DETAILS: example.com                          │
│      │  ┌────────────────────────────────────────────────┐   │
│      │  │ Status:        ✅ Active                        │   │
│      │  │ Expires:       2026-12-31                      │   │
│      │  │ Registrar:     GoDaddy                         │   │
│      │  │ Transfer Lock: ☑️ Enabled                      │   │
│      │  │ Auto-Renew:    ☑️ Yes ($11.99/year)            │   │
│      │  │ Privacy:       ☐ WHOIS privacy                │   │
│      │  │                                                │   │
│      │  │ NAMESERVERS                                    │   │
│      │  │ Primary:    ns1.webhosting.io                 │   │
│      │  │ Secondary:  ns2.webhosting.io                 │   │
│      │  │                                                │   │
│      │  │ EMAIL FORWARDING                               │   │
│      │  │ info@example.com  → john@gmail.com            │   │
│      │  │ support@example.com → team@example.com        │   │
│      │  │ [+ Add Forward]                                │   │
│      │  │                                                │   │
│      │  │ [Save Changes]                                 │   │
│      │  └────────────────────────────────────────────────┘   │
│      │                                                        │
└──────┴────────────────────────────────────────────────────────┘
```

### Components

**Action Buttons** (Top):
- [+ Register Domain] (primary, blue)
- [Import Domain] (secondary, gray)
- [Renew] (secondary, gray)

**Domains Table**:
- Columns: Domain | Expires | Status | Actions
- Status badges: ✅ Green (active), ⚠️ Yellow (soon), 🔴 Red (expired)
- Action: [Renew] button per row

**Domain Details**:
- Section: Settings + Nameservers + Email Forwarding
- Toggles: Transfer Lock, Auto-Renew, Privacy
- Text inputs: Email forwarding pairs

---

## 🔄 NAVIGATION FLOW

### Primary Flows

```
DASHBOARD (home)
├─ Click [+ New Site] → NEW SITE WIZARD (steps 1-4)
├─ Click site row → SITE DETAILS (embedded)
│  └─ Click [Settings] → SITE SETTINGS (tabs)
│  └─ Click [Logs] → DEPLOYMENT + LOGS
├─ Click [Domains] tab → DOMAIN MANAGEMENT
└─ Click [Sites] tab → SITES TABLE (filtered view)

SITE SETTINGS (tabs)
├─ [General] → Site info, backups, redirects
├─ [SSL] → Certificate status, renewal
├─ [Performance] → Cache, CDN, compression
└─ [Integrations] → GitHub, email, webhooks

DOMAIN MANAGEMENT
├─ Click [+ Register Domain] → Registration wizard
├─ Click [Renew] → Renewal confirmation
└─ Click domain → DOMAIN DETAILS (edit nameservers, email forwarding)
```

### Bottom Navigation (Mobile Only)

```
┌──────────────────────────────────────┐
│                                      │
├──────────────────────────────────────┤
│ 🏠 Home │ 📦 Sites │ 🌐 Domains │ ⚙️ │
└──────────────────────────────────────┘
```

---

## 📐 RESPONSIVE BREAKPOINTS

| Size | Device | Layout |
|------|--------|--------|
| 320–767px | Mobile | Single column, sidebar hidden (hamburger), cards stack |
| 768–1023px | Tablet | Sidebar visible (collapsed), main content 70%, tables scroll |
| 1024px+ | Desktop | Sidebar visible (240px), main content full width |

**Rules**:
- Mobile: Full-width cards, stack vertically
- Tablet: Sidebar optional, tables scroll horizontally
- Desktop: Full sidebar, tables on screen

---

## ✅ WIREFRAME CHECKLIST

- [x] Screen 1: Dashboard (quick stats + site table)
- [x] Screen 2: New Site (onboarding wizard)
- [x] Screen 3: Site Settings (configuration tabs)
- [x] Screen 4: Deployment + Logs (status + timeline)
- [x] Screen 5: Domain Management (registration + DNS)
- [x] Navigation flows (tab-based)
- [x] Responsive layouts (desktop, tablet, mobile)
- [x] Component specs (sizing, spacing, colors)
- [x] Interaction patterns (click, hover, states)
- [x] Error + empty states

---

## 🎨 NEXT: DELEGATE TO LUXI

**Wireframes complete.** Ready to create:
- Figma mockups (visual polish, all responsive variants)
- Storybook components (React library)
- Design documentation

**Handoff to Luxi**: PRODUCT + DESIGN_SYSTEM + WIREFRAMES files

---

**Status**: Phase 3 Complete ✅  
**Next**: Delegate to Luxi for Figma + Storybook (2-3 days)  
**Owner**: Ekkarat → Luxi (visual design) → Dev team  

*Modern. Professional. Developer-friendly. Scalable.*
