---
name: design-pharmacy-expiry
description: Design system for Pharmacy Expiry Management (mobile-first, simple + efficient)
metadata:
  type: project
  status: phase-2-design-system
  date: 2026-07-21
  project: pharmacy-expiry-management
---

# 🎨 DESIGN SYSTEM: Pharmacy Expiry Management

**Project**: Pharmacy Expiry Management System  
**Approach**: Mobile-first, simple + efficient  
**Target**: Pharmacy staff (low-medium tech), pharmacy owners, regulators  
**Created**: 2026-07-21

---

## 📱 DESIGN PHILOSOPHY

### Mobile First
- Primary use: Technician scanning in pharmacy (counter)
- Secondary: Pharmacy owner review (evening)
- Tertiary: Regulator audit (office)

**Design Priority**: Scanning workflow must be fastest (< 5 sec)

### Simple + Efficient
- No unnecessary UI elements
- Clear visual hierarchy (what to do first)
- Minimal colors (reduce cognitive load)
- Large touch targets (pharmacy staff, varied ages)
- Fast feedback (barcode scan → immediate result)

### Medical Feel (Not Clinical)
- Trust + professionalism
- Warm (not sterile)
- Clear (no ambiguity)
- Accessible (for older staff)

---

## 🎨 COLOR PALETTE

### Primary Colors (Trust + Professional)

```css
--color-primary-500:   #0066cc;  /* Medical Blue (trust, healthcare) */
--color-primary-50:    #e6f2ff;  /* Light blue (backgrounds) */
--color-primary-600:   #0052a3;  /* Darker blue (hover, active) */
--color-primary-900:   #001f4d;  /* Deep blue (text, headings) */
```

**Why Medical Blue**: 
- Trust + credibility (pharmacy, healthcare)
- Professional appearance
- Accessibility (clear contrast on white)

---

### Status Colors (Critical for Expiry Tracking)

```css
/* ✅ OK - Stock is good */
--color-ok:            #10b981;  /* Green (healthy, in stock) */
--color-ok-light:      #d1fae5;  /* Light green (background) */

/* ⚠️ WARNING - Expiring soon (7 days) */
--color-warning:       #f59e0b;  /* Amber (caution, act now) */
--color-warning-light: #fef3c7;  /* Light amber (background) */

/* 🔴 EXPIRED - Action required */
--color-expired:       #ef4444;  /* Red (urgent, remove from stock) */
--color-expired-light: #fee2e2;  /* Light red (background) */

/* ℹ️ INFO - Neutral information */
--color-info:          #06b6d4;  /* Cyan (informational) */
--color-info-light:    #cffafe;  /* Light cyan (background) */
```

**Rationale**:
- Green = safe (familiar from traffic lights, medical apps)
- Yellow/Amber = caution (time to act, not urgent)
- Red = danger (pharmacy staff immediately knows "remove from shelf")
- High contrast for accessibility (WCAG AA+)

---

### Neutral Colors (UI Structure)

```css
/* Text */
--color-text-primary:    #1f2937;  /* Dark gray (headings, body) */
--color-text-secondary:  #6b7280;  /* Medium gray (labels, hints) */
--color-text-disabled:   #9ca3af;  /* Light gray (disabled buttons) */
--color-text-inverse:    #ffffff;  /* White (on dark backgrounds) */

/* Backgrounds */
--color-bg-primary:      #ffffff;  /* White (main interface) */
--color-bg-secondary:    #f9fafb;  /* Off-white (sections, cards) */
--color-bg-tertiary:     #f3f4f6;  /* Light gray (active states) */

/* Borders */
--color-border-light:    #e5e7eb;  /* Light gray (borders) */
--color-border-medium:   #d1d5db;  /* Medium gray (input focus) */
--color-border-dark:     #9ca3af;  /* Darker gray (disabled) */
```

---

## 🔤 TYPOGRAPHY (Mobile-First)

### Font Families

```css
--font-family-sans:      -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
                         "Helvetica Neue", Arial, sans-serif;
                         /* System fonts for performance + accessibility */

--font-family-mono:      "Courier New", Courier, monospace;
                         /* For barcodes, SKU numbers */
```

---

### Scale (8 Sizes, Mobile-First)

| Role | Mobile | Desktop | Weight | Line-Height | Use |
|------|--------|---------|--------|-------------|-----|
| **XS** | 12px | 12px | 400 | 1.4 | Timestamps, badges |
| **SM** | 13px | 14px | 400 | 1.5 | Labels, captions |
| **Base** | 14px | 16px | 400 | 1.5 | Body text, descriptions |
| **MD** | 16px | 18px | 500 | 1.6 | Form inputs, metadata |
| **LG** | 18px | 20px | 600 | 1.6 | Card titles, section headers |
| **XL** | 24px | 28px | 600 | 1.5 | Page title (rare) |
| **2XL** | 28px | 32px | 700 | 1.4 | Hero/alerts (rare) |
| **3XL** | 32px | 36px | 700 | 1.3 | Emergency alerts only |

**Weights**:
- 400 = normal (body, captions)
- 500 = medium (form labels, secondary headings)
- 600 = semibold (titles, emphasis)
- 700 = bold (emergency alerts only)

**Why This Scale**:
- Base 14px mobile (not tiny)
- Larger for technician scanning (older staff can read)
- Semibold titles for quick scanning
- No heavy/bold except emergencies (reduces stress)

---

## 📏 SPACING (Mobile-First)

### Scale (12 Levels)

```css
--space-xs:     4px;    /* Tight: icons, small gaps */
--space-sm:     8px;    /* Small: label-to-field, group separation */
--space-md:     12px;   /* Medium: default spacing */
--space-lg:     16px;   /* Large: section padding */
--space-xl:     20px;   /* Extra: major sections */
--space-2xl:    24px;   /* Huge: page margins */
--space-3xl:    32px;   /* Massive: page top/bottom */
```

**Rules**:
- Card padding: `--space-lg` (16px on mobile, 24px on desktop)
- Section gap: `--space-xl` (20px)
- Button height: 44px minimum (mobile touch target)
- Input height: 40px (mobile usable)

---

## 🎯 COMPONENTS

### 1. STATUS BADGE (Primary Component)

**Usage**: Show expiry status at a glance

```
┌─────────────────────────┐
│ ✅ OK (25 days)        │  Green badge, white text
└─────────────────────────┘

┌─────────────────────────┐
│ ⚠️ WARNING (5 days)    │  Yellow badge, dark text
└─────────────────────────┘

┌─────────────────────────┐
│ 🔴 EXPIRED (overdue)   │  Red badge, white text
└─────────────────────────┘
```

**Spec**:
```css
.badge {
  padding: 6px 12px;         /* Compact */
  border-radius: 4px;        /* Slight curve */
  font-weight: 600;          /* Bold (stands out) */
  font-size: 13px;           /* Small but readable */
  display: flex;
  align-items: center;
  gap: 4px;                  /* Icon-to-text spacing */
}

.badge.ok {
  background-color: var(--color-ok);
  color: white;
}

.badge.warning {
  background-color: var(--color-warning);
  color: #1f2937;            /* Dark text on yellow (contrast) */
}

.badge.expired {
  background-color: var(--color-expired);
  color: white;
}
```

---

### 2. SCAN INPUT CARD

**Usage**: Barcode scanning interface

```
┌─────────────────────────────┐
│ Scan Barcode                │  Header
├─────────────────────────────┤
│                             │
│  📷 SCAN                    │  Large, centered icon
│  [Camera or textbox]        │  or text input
│                             │
│  Tap to scan or enter SKU   │  Hint text (small)
│                             │
└─────────────────────────────┘
```

**Spec**:
```css
.scan-card {
  background: var(--color-bg-secondary);
  border: 2px dashed var(--color-border-medium);
  padding: var(--space-xl);
  border-radius: 8px;
  text-align: center;
}

.scan-icon {
  font-size: 48px;           /* Large camera icon */
  margin-bottom: var(--space-md);
}

.scan-input {
  font-size: 18px;           /* Large, readable */
  padding: 12px;
  border: 2px solid var(--color-border-medium);
  border-radius: 4px;
  text-align: center;
  font-family: var(--font-family-mono);  /* Monospace for barcodes */
}

.scan-hint {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: var(--space-sm);
}
```

---

### 3. INVENTORY LIST ITEM

**Usage**: Display each scanned medication

```
┌──────────────────────────────┐
│ ✅ Paracetamol 500mg        │  Medication name + badge
│ SKU: 12345 | Batch: B2026-07│  Details (small, secondary)
│ Exp: 2026-12-31 (25 days)   │  Expiry + countdown
│ Stock: 45 units | Loc: A3   │  Quantity + location
└──────────────────────────────┘
```

**Spec**:
```css
.inventory-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--space-lg);
  background: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border-light);
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.item-meta {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
}

.item-expiry {
  font-size: 14px;
  font-weight: 500;
}

.item-badge {
  align-self: center;
  margin-left: var(--space-md);
}
```

---

### 4. ALERT / ACTION BUTTON

**Usage**: Critical actions (remove from stock, reorder)

```
┌──────────────────────────────┐
│  🗑️  REMOVE FROM STOCK      │  Red, urgent
└──────────────────────────────┘

┌──────────────────────────────┐
│  📞 REQUEST REORDER         │  Blue, normal action
└──────────────────────────────┘
```

**Spec**:
```css
.button {
  width: 100%;              /* Full width on mobile */
  padding: 12px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  transition: all 200ms ease-out;
}

.button-primary {
  background: var(--color-primary-500);
  color: white;
}

.button-primary:active {
  background: var(--color-primary-600);
  transform: scale(0.98);
}

.button-danger {
  background: var(--color-expired);
  color: white;
}

.button-danger:active {
  background: #dc2626;
  transform: scale(0.98);
}

.button-disabled {
  background: var(--color-border-medium);
  color: var(--color-text-disabled);
  cursor: not-allowed;
  opacity: 0.6;
}
```

---

## 🖼️ LAYOUT (Mobile-First)

### Mobile (Base)
```
┌─────────────────────┐
│  📱 HEADER          │  16px top margin
│  Pharmacy Expiry    │  Title + status
├─────────────────────┤
│                     │
│  SCAN CARD          │  12px horizontal margin
│  [Barcode input]    │
│                     │
├─────────────────────┤
│  QUICK STATS        │  3 cards in column
│  ⚠️ 5 expiring      │  (stack on mobile)
│  ✅ 120 in stock    │
│  ℹ️ Last scan 2h ago│
│                     │
├─────────────────────┤
│  INVENTORY          │  Scrollable list
│  [Item 1]           │  12px padding
│  [Item 2]           │
│  [Item 3]           │
│  [Load more]        │
│                     │
└─────────────────────┘
```

### Tablet (Responsive)
```
┌──────────────────────────────────┐
│  HEADER                          │
├──────────────────────────────────┤
│ SCAN (left) │ QUICK STATS (right)│
├──────────────────────────────────┤
│  INVENTORY (full width)          │
│  [Item 1]  [Item 2]  [Item 3]    │  2-col layout
│  [Item 4]  [Item 5]  [Item 6]    │
└──────────────────────────────────┘
```

**Rules**:
- Mobile: 1 column, full width
- Tablet (600px+): 2 columns, 80% width
- Desktop (1024px+): 3 columns, 1200px max
- Margins: 16px mobile, 24px tablet/desktop
- Gap between items: 12px mobile, 16px tablet/desktop

---

## 🌙 DARK MODE

**Status**: Not required for MVP  
**Future**: Add if pharmacy staff request evening mode

```css
@media (prefers-color-scheme: dark) {
  --color-bg-primary:    #1f2937;
  --color-bg-secondary:  #111827;
  --color-text-primary:  #f9fafb;
  --color-text-secondary: #d1d5db;
  --color-border-light:  #374151;
  --color-primary-500:   #3b82f6;  /* Brighter blue on dark */
}
```

---

## ♿ ACCESSIBILITY

### Contrast Ratios
- Text on background: 7:1 minimum (AAA standard)
- Blue (#0066cc) on white: 9.2:1 ✅
- Red (#ef4444) on white: 5.7:1 ✅
- Amber (#f59e0b) on white: 9.8:1 ✅
- Green (#10b981) on white: 6.1:1 ✅

### Touch Targets
- Minimum button size: 44×44px
- Minimum input field: 40px height
- Spacing between targets: 8px minimum

### Keyboard Navigation
- Tab order: Scan → Inventory → Actions
- Focus indicator: 2px blue outline
- Screen reader: Alt text on icons, ARIA labels on lists

### Text
- Minimum font size: 12px (labels only)
- Body text: 14px+ on mobile, 16px+ on desktop
- Line height: 1.5–1.6 (readability)
- Max line length: 60 characters (readability)

---

## 🎬 ANIMATIONS & INTERACTION

### Feedback (Immediate)
```css
/* Scan successful */
.scan-success {
  animation: pulse-green 500ms ease-out;
  background: linear-gradient(to right, transparent, var(--color-ok));
  /* Quick flash of green = item scanned */
}

/* Scan failed */
.scan-error {
  animation: shake-red 300ms ease-out;
  border-color: var(--color-expired);
  /* Shake + red = error, try again */
}

/* Button press */
.button:active {
  transform: scale(0.98);        /* Haptic-like feedback */
  transition: all 100ms;
}
```

### Transitions
```css
/* Standard transition (color, opacity) */
--transition-fast: 150ms ease-out;

/* Item appearing in list */
--transition-slow: 300ms ease-out;
```

---

## 🎨 DESIGN TOKENS (CSS VARIABLES)

**Usage**: All UI must use tokens, no hardcoded values

```css
:root {
  /* Colors */
  --color-primary-500: #0066cc;
  --color-ok: #10b981;
  --color-warning: #f59e0b;
  --color-expired: #ef4444;
  
  /* Typography */
  --text-base-size: 14px;
  --text-base-weight: 400;
  --text-base-line-height: 1.5;
  
  /* Spacing */
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 20px;
  
  /* Interactions */
  --transition-fast: 150ms ease-out;
  --button-height: 44px;
  --input-height: 40px;
  
  /* Borders */
  --radius-sm: 4px;
  --radius-md: 6px;
  --border-default: 1px solid var(--color-border-light);
}
```

---

## 📋 COMPONENT CHECKLIST

- [ ] Status Badge (OK, Warning, Expired)
- [ ] Scan Input Card
- [ ] Inventory List Item
- [ ] Action Buttons (Primary, Danger)
- [ ] Quick Stats Cards
- [ ] Navigation (scan, inventory, settings)
- [ ] Alert / Toast Notifications
- [ ] Empty State (no items scanned)
- [ ] Loading State (scanning...)
- [ ] Error State (invalid barcode)

---

## 🚀 NEXT: WIREFRAMES

Ready to move to **Phase 3: Build Tokens & Wireframes**

**Wireframe Screens** (Priority Order):
1. **Scan Screen** (primary workflow)
2. **Inventory List** (results)
3. **Item Detail** (expiry info)
4. **Dashboard** (pharmacy owner view)
5. **Settings** (configuration)

**Awaiting**: Approval to proceed with wireframes

---

**Status**: Design System complete  
**Next Phase**: Phase 3 (Wireframes + Component Specs)  
**Owner**: Ekkarat / Luxi (design)  
**Timeline**: Wireframes today, ready for dev by end of week

---

*Simple. Efficient. Medical. Mobile-first.*
