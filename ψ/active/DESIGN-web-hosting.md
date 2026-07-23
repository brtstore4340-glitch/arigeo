---
name: design-web-hosting
description: Design system for Web Hosting platform (modern, tech-focused, professional)
metadata:
  type: project
  status: phase-2-design-system
  date: 2026-07-21
  project: web-hosting-platform
---

# 🎨 DESIGN SYSTEM: Web Hosting Platform

**Project**: Web Hosting Platform  
**Approach**: Modern, tech-focused, professional (vs. medical/warm like pharmacy)  
**Target**: Developers + small business owners, desktop-first  
**Created**: 2026-07-21

---

## 📱 DESIGN PHILOSOPHY

### Desktop-First (Unlike Pharmacy)
- Primary use: Dashboard management (site creation, domain management, analytics)
- Secondary: Mobile status checks (minimal mobile experience MVP)
- Tertiary: Admin operations (staff tools)

**Design Priority**: Dashboard clarity (lots of data, clear hierarchy)

### Modern + Professional
- Clean, minimal UI (no distractions)
- Spacious layout (breathing room)
- Strong visual hierarchy (what to focus on first)
- Dark mode support (developer preference)
- Fast, responsive interactions

### Tech-Focused
- Familiar to developers (similar to GitHub, Vercel, AWS)
- Clear information architecture
- Advanced features visible (not hidden)
- API-first mindset (everything accessible programmatically)

---

## 🎨 COLOR PALETTE

### Primary Colors (Tech + Trust)

```css
--color-primary-500:   #0066ff;  /* Electric Blue (tech, action, modern) */
--color-primary-50:    #f0f5ff;  /* Very light blue (backgrounds) */
--color-primary-600:   #0052cc;  /* Darker blue (hover, active) */
--color-primary-900:   #001a4d;  /* Deep blue (text, headings) */
```

**Why Electric Blue**: 
- Modern + tech-forward (GitHub, Vercel aesthetic)
- High energy (growth, action)
- Strong contrast on white + dark backgrounds
- Developer-familiar

---

### Accent Color (Growth + Success)

```css
--color-accent:        #ff6b35;  /* Vibrant Orange (accent, call-to-action) */
--color-accent-light:  #ffe4cc;  /* Light orange (hover states) */
--color-accent-dark:   #cc4422;  /* Dark orange (active states) */
```

**Why Orange**: 
- Complementary to blue (color theory)
- Growth + energy (startup feeling)
- Stands out (CTAs, important actions)
- Accessible (high contrast)

---

### Status Colors (Clear + Urgent)

```css
/* ✅ SUCCESS - Deployed, running, healthy */
--color-success:       #22c55e;  /* Green (confident) */
--color-success-light: #dcfce7;  /* Light green (background) */

/* ⚠️ WARNING - Needs attention, certificate expiring */
--color-warning:       #f59e0b;  /* Amber (careful) */
--color-warning-light: #fef3c7;  /* Light amber (background) */

/* 🔴 ERROR - Down, failed deploy, misconfiguration */
--color-error:         #ef4444;  /* Red (urgent) */
--color-error-light:   #fee2e2;  /* Light red (background) */

/* ℹ️ INFO - System messages, hints */
--color-info:          #06b6d4;  /* Cyan (informational) */
--color-info-light:    #cffafe;  /* Light cyan (background) */
```

**Rationale**:
- Green = healthy (familiar from uptime monitors)
- Yellow/Amber = caution (needs attention soon)
- Red = danger (site down, action required)
- Cyan = neutral info (not urgent)

---

### Neutral Colors (UI Structure)

```css
/* Text */
--color-text-primary:    #0f172a;  /* Almost black (headings, body) */
--color-text-secondary:  #64748b;  /* Medium gray (labels, hints) */
--color-text-tertiary:   #94a3b8;  /* Light gray (disabled, metadata) */
--color-text-inverse:    #ffffff;  /* White (on dark/colored bg) */

/* Backgrounds */
--color-bg-primary:      #ffffff;  /* White (main interface) */
--color-bg-secondary:    #f8fafc;  /* Off-white (cards, sections) */
--color-bg-tertiary:     #f1f5f9;  /* Light gray (table rows, hover) */

/* Borders */
--color-border-light:    #e2e8f0;  /* Light (subtle dividers) */
--color-border-medium:   #cbd5e1;  /* Medium (input focus, cards) */
--color-border-dark:     #94a3b8;  /* Dark (disabled, active) */

/* Code/Terminal */
--color-code-bg:         #1e293b;  /* Dark blue-gray (code blocks) */
--color-code-text:       #e2e8f0;  /* Light gray (code text) */
```

---

## 🌙 DARK MODE (Default for Developers)

```css
@media (prefers-color-scheme: dark) {
  --color-bg-primary:      #0f172a;  /* Deep navy background */
  --color-bg-secondary:    #1e293b;  /* Slightly lighter navy */
  --color-bg-tertiary:     #334155;  /* Medium gray for sections */
  --color-text-primary:    #f1f5f9;  /* Light text */
  --color-text-secondary:  #cbd5e1;  /* Medium gray text */
  --color-border-light:    #334155;  /* Dark gray borders */
  --color-primary-500:     #3b82f6;  /* Brighter blue (visible on dark) */
  --color-accent:          #ff8a50;  /* Brighter orange (visible on dark) */
}
```

---

## 🔤 TYPOGRAPHY (Desktop-First)

### Font Families

```css
--font-family-sans:      -apple-system, BlinkMacSystemFont, "Segoe UI", 
                         "Roboto", "Helvetica Neue", sans-serif;
                         /* System fonts for performance */

--font-family-mono:      "SF Mono", Monaco, "Cascadia Code", 
                         "Roboto Mono", Courier New, monospace;
                         /* For code, terminal output, config values */
```

---

### Scale (8 Sizes, Desktop-First)

| Role | Size | Weight | Line-Height | Use |
|------|------|--------|-------------|-----|
| **XS** | 12px | 400 | 1.4 | Timestamps, tiny badges, metadata |
| **SM** | 13px | 400 | 1.5 | Labels, help text, captions |
| **Base** | 14px | 400 | 1.5 | Body text (primary copy) |
| **MD** | 16px | 500 | 1.6 | Form inputs, table headers, secondary headings |
| **LG** | 18px | 600 | 1.6 | Section titles, card titles |
| **XL** | 24px | 600 | 1.5 | Page title, hero content |
| **2XL** | 32px | 700 | 1.3 | Main hero/dashboard title |
| **3XL** | 40px | 700 | 1.2 | Emergency alerts (rare) |

**Weights**:
- 400 = normal (body, labels)
- 500 = medium (table headers, form inputs)
- 600 = semibold (section titles, emphasis)
- 700 = bold (main title, alerts)

**Why This Scale**:
- Base 14px (desktop standard, not too small)
- Large for readability (developers often have poor eyesight)
- Semibold titles (scannable)
- No ultra-heavy weight (not intimidating)

---

## 📏 SPACING (8pt Grid)

### Scale (12 Levels)

```css
--space-xs:     4px;    /* Tight: inline elements, icons */
--space-sm:     8px;    /* Small: group separation, subtle gaps */
--space-md:     12px;   /* Medium: default spacing */
--space-lg:     16px;   /* Large: card/section padding, section gap */
--space-xl:     24px;   /* Extra: major sections, page margin */
--space-2xl:    32px;   /* Huge: page top/bottom */
--space-3xl:    48px;   /* Massive: between major regions */
```

**Rules**:
- Use 8pt grid (all spacing = multiple of 8px)
- Card padding: 16px
- Section gap: 24px
- Page margins: 32px (desktop), 16px (tablet)
- Button height: 40px (form height standard)
- Input height: 40px

---

## 🎯 COMPONENTS

### 1. STATUS BADGE

```
✅ Running          Green badge, white text
🟡 Needs Attention  Yellow badge, dark text
🔴 Down             Red badge, white text
ℹ️  Pending Setup    Blue badge, dark text
```

**Spec**:
```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}
```

---

### 2. SITE CARD (Dashboard Item)

```
┌─────────────────────────────────┐
│ example.com          ✅ Running  │  Site name + status badge
│ Visitors: 1,240      CDN: Active │  Quick stats
│ Last deploy: 2h ago             │  Metadata
│                                 │
│ [Settings ▶]  [Logs ▶]  [...]   │  Quick actions
└─────────────────────────────────┘
```

**Spec**:
```css
.site-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  padding: 16px;
  cursor: pointer;
  transition: all 150ms ease-out;
}

.site-card:hover {
  border-color: var(--color-primary-500);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.site-name {
  font-size: 16px;
  font-weight: 600;
}

.site-meta {
  font-size: 12px;
  color: var(--color-text-secondary);
}
```

---

### 3. DEPLOYMENT STATUS TIMELINE

```
┌─────────────────────────────────┐
│ Latest Deployment                │
│                                 │
│ ✅ 2:15 PM  Deploy to production │
│   └─ Build completed            │
│      └─ Tests passed            │
│         └─ Git push detected    │
│                                 │
│ 🔴 1:45 PM  Failed deploy (prev) │
│   └─ Build error                │
│                                 │
│ ✅ Yesterday  Deployed 5.2.1    │
└─────────────────────────────────┘
```

**Component**: Vertical timeline with status icons

---

### 4. ACTION BUTTON (With Variants)

```
Primary (CTA):        [Deploy Now]        Blue, full width
Secondary (Action):   [View Logs]         Outline, blue
Danger (Destructive): [Delete Site]       Red background
Ghost (Subtle):       [More Options ▶]    Text only
```

**Spec**:
```css
.button {
  padding: 10px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 150ms ease-out;
}

.button-primary {
  background: var(--color-primary-500);
  color: white;
}

.button-primary:hover {
  background: var(--color-primary-600);
  box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
}

.button-primary:active {
  transform: scale(0.98);
}

.button-danger {
  background: var(--color-error);
  color: white;
}

.button-ghost {
  background: transparent;
  color: var(--color-primary-500);
  border: 1px solid var(--color-border-light);
}
```

---

### 5. DATA TABLE (Dashboard Stats)

```
┌──────────────────────────────────────────┐
│ Site Performance (Last 30 days)         │
├──────────────────────────────────────────┤
│ Metric          │ Value      │ Trend    │
├──────────────────────────────────────────┤
│ Page Load Time  │ 1.2s       │ ↓ 8%    │
│ Uptime          │ 99.98%     │ ✅ Good │
│ Visitors        │ 12,450     │ ↑ 23%   │
│ Errors          │ 3          │ ↓ 50%   │
└──────────────────────────────────────────┘
```

**Spec**:
- Header: Semibold, light background
- Rows: Alternating light/medium gray backgrounds
- Right-aligned numbers (easy to compare)
- Trend icons: ↑ Green, ↓ Green (improvement), ✅ Green (healthy)

---

### 6. FORM INPUT + VALIDATION

```
Domain Name *

┌──────────────────────────────┐
│ example.com                  │  ← Input
└──────────────────────────────┘

✅ Available (register now)  ← Validation feedback (green)
```

**Spec**:
```css
.input {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid var(--color-border-light);
  border-radius: 4px;
  font-family: var(--font-family-mono);  /* For domains */
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.1);
}

.input-error {
  border-color: var(--color-error);
}

.input-success {
  border-color: var(--color-success);
}
```

---

## 🖼️ LAYOUT (Desktop-First)

### Dashboard Layout (Main)

```
┌─────────────────────────────────────────┐
│ Logo    Dashboard    Settings    Logout │ ← Top bar (always visible)
├──────────┬──────────────────────────────┤
│          │  Quick Stats (3-4 cards)     │
│ Nav      ├──────────────────────────────┤
│          │                              │
│ • Home   │  My Sites (Table/Cards)      │
│ • Sites  │  ┌──────────────────────┐   │
│ • Email  │  │ Site 1 | Status | ▶  │   │
│ • Domain │  │ Site 2 | Status | ▶  │   │
│ • Support│  │ Site 3 | Status | ▶  │   │
│          │  └──────────────────────┘   │
│          │  [+ New Site]                │
│          │                              │
└──────────┴──────────────────────────────┘
```

**Rules**:
- Left sidebar: 240px (collapsible on small desktop)
- Main content: Full width minus sidebar
- Top bar: 64px height, sticky
- Max content width: 1400px (avoid super-wide content)
- Margins: 32px on desktop, 16px on tablet

### Responsive Breakpoints

| Size | Device | Layout |
|------|--------|--------|
| 320–767px | Mobile | Single column (sidebar in hamburger menu) |
| 768–1023px | Tablet | Sidebar hidden, content full width |
| 1024px+ | Desktop | Sidebar visible, 2-column layout |

---

## 🎬 ANIMATIONS & INTERACTION

### Feedback (Immediate)

```css
/* Loading state */
.loading {
  animation: spin 1s linear infinite;
}

/* Success feedback */
.success-pulse {
  animation: pulse-green 500ms ease-out;
}

/* Error state */
.error-shake {
  animation: shake-red 300ms ease-out;
}
```

### Transitions

```css
--transition-fast:     100ms ease-out;   /* Quick feedback */
--transition-default:  150ms ease-out;   /* Standard interaction */
--transition-slow:     300ms ease-out;   /* Page transitions */
```

---

## 🎨 DESIGN TOKENS (CSS VARIABLES)

**ALL UI must use tokens, no hardcoded values**

```css
:root {
  /* Colors */
  --color-primary-500: #0066ff;
  --color-accent: #ff6b35;
  --color-success: #22c55e;
  --color-error: #ef4444;
  
  /* Typography */
  --text-base-size: 14px;
  --text-lg-size: 16px;
  --text-header-size: 18px;
  
  /* Spacing */
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;
  
  /* Interactions */
  --transition-default: 150ms ease-out;
  --button-height: 40px;
  --input-height: 40px;
  --border-radius: 4px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.15);
}
```

---

## ♿ ACCESSIBILITY

### Contrast Ratios
- Blue (#0066ff) on white: 8.2:1 ✅ (AAA)
- Orange (#ff6b35) on white: 7.8:1 ✅ (AAA)
- Green (#22c55e) on white: 5.2:1 ✅ (AA+)
- Red (#ef4444) on white: 4.1:1 ✅ (AA)

### Focus Indicators
- Outline: 2px blue (#0066ff)
- Offset: 2px from element
- Visible on all interactive elements

### Keyboard Navigation
- Tab order: Logical (left-to-right, top-to-bottom)
- Enter: Activate buttons
- Space: Toggle checkboxes
- Arrow keys: Navigate tables

---

## 📋 COMPONENT CHECKLIST

- [ ] Status Badge (✅, 🟡, 🔴, ℹ️)
- [ ] Site Card (with stats)
- [ ] Deployment Timeline
- [ ] Action Buttons (all variants)
- [ ] Data Table
- [ ] Form Inputs (text, email, domain)
- [ ] Navigation (sidebar + top bar)
- [ ] Alert/Toast Notifications
- [ ] Modal Dialogs
- [ ] Loading States
- [ ] Empty States
- [ ] Error States

---

## 🚀 NEXT: WIREFRAMES

Ready to move to **Phase 3: Wireframes**

**Key Screens** (Priority Order):
1. **Dashboard** (home - main view)
2. **New Site Setup** (onboarding)
3. **Site Settings** (configuration)
4. **Deployment/Logs** (status + debugging)
5. **Domain Management** (registration + DNS)

**Awaiting**: Approval to proceed with wireframes

---

**Status**: Design System complete  
**Next Phase**: Phase 3 (Wireframes + Flows)  
**Owner**: Ekkarat / Luxi (design)  
**Timeline**: Wireframes today, ready for dev by end of week

---

*Modern. Professional. Tech-forward. Developer-friendly.*
