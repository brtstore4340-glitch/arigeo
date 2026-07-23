---
name: wireframes-pharmacy-expiry
description: Mobile-first wireframes for Pharmacy Expiry Management System (5 key screens)
metadata:
  type: project
  status: phase-3-wireframes
  date: 2026-07-21
  project: pharmacy-expiry-management
---

# 🖼️ WIREFRAMES: Pharmacy Expiry Management

**Phase**: 3 (Build Tokens & Wireframes)  
**Approach**: Mobile-first (320px base), responsive to tablet/desktop  
**Created**: 2026-07-21

---

## SCREEN 1: SCAN (Primary Workflow)

### Purpose
Technician scans medication barcodes. Primary interaction. Must be **fast** (<5 sec per scan).

### Mobile Layout (320px)

```
┌─────────────────────────────┐ 
│  11:45  ●●●●●●●●●●●●●●●●●●│ ← Status bar
├─────────────────────────────┤
│                             │
│  Pharmacy Expiry Scanner    │ ← Header (title + status)
│  📍 Nana Pharmacy           │
│  ✅ Ready to scan           │ ← Status (green)
│                             │
├─────────────────────────────┤
│                             │
│   📷 SCAN BARCODE           │ ← Large camera icon
│                             │
│   ┌───────────────────────┐ │
│   │ [___________________] │ │ ← Text input (or camera)
│   │ Scan or type SKU      │ │
│   └───────────────────────┘ │
│                             │
│   Last scan: 2h ago         │ ← Meta (small, secondary)
│                             │
├─────────────────────────────┤
│  🔔 ALERTS (if any)         │ ← Section header
│                             │
│  ⚠️  5 items expiring       │ ← Alert card (amber)
│      within 7 days          │
│                             │
│  🔴 1 item expired          │ ← Alert card (red)
│      Remove from stock      │
│                             │
├─────────────────────────────┤
│  📊 TODAY'S ACTIVITY        │ ← Section header
│                             │
│  📦 Scanned: 12 items       │ ← Stat (12 = prominent)
│  ✅ OK: 8                   │ ← Sub-stat
│  ⚠️  Warning: 3             │
│  🔴 Expired: 1              │
│                             │
└─────────────────────────────┘
```

### Tablet Layout (600px+)

```
┌──────────────────────────────────────────┐ 
│  SCAN (left, 55%)    │  ALERTS (right, 45%)│
├──────────────────────────────────────────┤
│                     │                    │
│  📷 SCAN BARCODE    │  🔔 ALERTS         │
│  [____input____]    │  ⚠️  5 expiring   │
│                     │  🔴 1 expired      │
│  Status: Ready      │                    │
│  Last: 2h ago       │  📊 ACTIVITY       │
│                     │  Scanned: 12       │
│                     │  OK: 8 / Warn: 3   │
│                     │                    │
└──────────────────────────────────────────┘
```

### Component Spec

**Header**:
- Logo + pharmacy name + status
- Status: Green ✅ (ready), Yellow ⚠️ (syncing), Red 🔴 (error)
- Font: 18px semibold

**Scan Card**:
- Background: Light blue (#e6f2ff)
- Border: 2px dashed (medium gray)
- Icon: 48px camera
- Input: 18px, monospace (for barcodes)
- Hint: 12px secondary text
- Padding: 20px

**Alerts Section**:
- Header: 16px semibold
- Cards: 12px padding, 4px radius
- Colors: Amber (warning), Red (expired)
- Action: Tap card → see full inventory item

**Activity Section**:
- 4 stats in column (mobile) or row (tablet)
- Large number (20px) + label (12px)
- Colors: Neutral, not distracting

### Interaction

1. **Scan**:
   - User focuses input
   - Scans barcode OR types SKU
   - Barcode recognized → **Green pulse** (500ms)
   - Item added to inventory
   - Input clears, ready for next

2. **Error**:
   - Invalid barcode → **Red shake** (300ms)
   - Message: "Barcode not found"
   - User retries

3. **Alert Tap**:
   - Tap card → Scroll to inventory
   - Highlight matching items

---

## SCREEN 2: INVENTORY LIST

### Purpose
Show all scanned medications today with expiry status. Scrollable list sorted by urgency (expired first, then warning, then OK).

### Mobile Layout (320px)

```
┌─────────────────────────────┐ 
│  11:45  ●●●●●●●●●●●●●●●●●●│
├─────────────────────────────┤
│ ← Back    Inventory     ⚙️    │ ← Header (back + title + settings)
├─────────────────────────────┤
│                             │
│ Filter: All | Expiring | OK │ ← Quick filter (tabs)
│                             │
├─────────────────────────────┤
│ 🔴 EXPIRED (1)              │ ← Section header (red)
│                             │
│ ┌───────────────────────┐   │
│ │ 🔴 Paracetamol 500mg  │   │
│ │ SKU: 12345            │   │
│ │ Batch: B2026-06       │   │
│ │ Exp: 2026-06-30       │   │
│ │ (Expired 21 days ago) │   │
│ │ Stock: 120 units      │   │
│ │ Location: A3          │   │
│ │                       │   │
│ │ [🗑️ REMOVE]          │   │ ← Action button (red)
│ └───────────────────────┘   │
│                             │
├─────────────────────────────┤
│ ⚠️  WARNING (3)              │ ← Section header (amber)
│                             │
│ ┌───────────────────────┐   │
│ │ ⚠️  Ibuprofen 400mg   │   │
│ │ SKU: 54321            │   │
│ │ Exp: 2026-07-25       │   │
│ │ (5 days remaining)    │   │
│ │ Stock: 45 units       │   │
│ │ Location: B2          │   │
│ │                       │   │
│ │ [📞 REORDER]          │   │ ← Action button (blue)
│ └───────────────────────┘   │
│                             │
│ ┌───────────────────────┐   │
│ │ ⚠️  Aspirin 325mg     │   │
│ │ SKU: 99876            │   │
│ │ Exp: 2026-07-26       │   │
│ │ (6 days remaining)    │   │
│ │ Stock: 200 units      │   │
│ │ Location: C1          │   │
│ │                       │   │
│ │ [📞 REORDER]          │   │
│ └───────────────────────┘   │
│                             │
├─────────────────────────────┤
│ ✅ OK (8)                   │ ← Section header (green)
│                             │
│ ┌───────────────────────┐   │
│ │ ✅ Cetirizine 10mg    │   │
│ │ SKU: 11223            │   │
│ │ Exp: 2026-12-31       │   │
│ │ (157 days remaining)  │   │
│ │ Stock: 300 units      │   │
│ │ Location: D5          │   │
│ │                       │   │
│ │ (No action needed)    │   │
│ └───────────────────────┘   │
│                             │
│ + 7 more items...           │ ← Load more indicator
│                             │
└─────────────────────────────┘
```

### Tablet Layout (600px+)

```
┌──────────────────────────────────────────┐ 
│ Back    Inventory (12 items)    ⚙️        │
├──────────────────────────────────────────┤
│ Filter: [All] [Expiring] [OK]            │
├──────────────────────────────────────────┤
│                                          │
│  EXPIRED (1)                             │
│  ┌──────────────────┐  ┌──────────────┐ │
│  │ 🔴 Paracetamol   │  │ [Details ▶] │ │
│  │ SKU: 12345       │  │             │ │
│  │ Exp: 2026-06-30  │  │ [🗑️ REMOVE]│ │
│  │ Stock: 120       │  │             │ │
│  └──────────────────┘  └──────────────┘ │
│                                          │
│  WARNING (3)                             │
│  ┌──────────────────┐  ┌──────────────┐ │
│  │ ⚠️  Ibuprofen    │  │ [Details ▶] │ │
│  │ SKU: 54321       │  │             │ │
│  │ Exp: 2026-07-25  │  │ [📞 REORDER]│ │
│  │ Stock: 45        │  │             │ │
│  └──────────────────┘  └──────────────┘ │
│                                          │
│  OK (8)                                  │
│  [List continues...]                     │
│                                          │
└──────────────────────────────────────────┘
```

### Component Spec

**Header**:
- Back button (← icon)
- Title: "Inventory (12 items)"
- Settings icon (gear)

**Filter Tabs**:
- All (default)
- Expiring (7 days)
- OK (>7 days)
- Tabs: 13px, centered, underline active tab

**List Item**:
- Section header: 16px semibold, colored (red/amber/green)
- Card: 12px padding, border-bottom divider
- Medication name: 16px semibold + badge
- Details: 12px secondary (SKU, batch, expiry, stock, location)
- Action button: Full width (mobile), 40px height
- Colors: Red for expired, Blue for reorder, Green for OK

**Empty State** (if no items):
```
┌─────────────────────────────┐
│                             │
│         📭 No items         │
│                             │
│  Scan a barcode to get      │
│  started                    │
│                             │
│      [← Back to Scan]       │
│                             │
└─────────────────────────────┘
```

### Interaction

1. **Filter**:
   - Tap "Expiring" → Show only items 7 days or less
   - Tap "OK" → Show only items >7 days
   - Tap "All" → Show all items

2. **Tap Item**:
   - Expand card OR navigate to detail screen
   - Show full info: batch number, supplier, location, history

3. **Action Button**:
   - [🗑️ REMOVE]: Mark item as removed, archive from active inventory
   - [📞 REORDER]: Create reorder request (integration Phase 2)

---

## SCREEN 3: ITEM DETAIL

### Purpose
Full details for a single medication. Accessed by tapping an inventory item. Show history, batch info, location, reorder status.

### Mobile Layout (320px)

```
┌─────────────────────────────┐ 
│  11:45  ●●●●●●●●●●●●●●●●●●│
├─────────────────────────────┤
│ ← Back    Details       ⋯    │ ← Header (back + title + more)
├─────────────────────────────┤
│                             │
│ 🔴 Paracetamol 500mg        │ ← Medication name + badge
│ (Expired 21 days ago)       │
│                             │
├─────────────────────────────┤
│ 📋 BASIC INFO               │ ← Section
│                             │
│ SKU:        12345           │
│ Batch:      B2026-06        │
│ Supplier:   ABC Pharma      │
│ Purchase:   2024-03-15      │
│                             │
├─────────────────────────────┤
│ 📦 STOCK INFO               │
│                             │
│ Total:      120 units       │
│ Location:   Shelf A3        │
│ Scanned:    120 units       │
│ Removed:    0 units         │
│                             │
├─────────────────────────────┤
│ 📅 EXPIRY INFO              │
│                             │
│ Manufactured:  2024-06-30   │
│ Expires:       2026-06-30   │
│ Status:        🔴 EXPIRED   │
│ Days:          -21 (overdue)│
│                             │
├─────────────────────────────┤
│ 🔐 COMPLIANCE               │
│                             │
│ Last Audit:  2026-07-20     │
│ Approved:    ✅ FDA         │
│ Storage:     Room Temp      │
│                             │
├─────────────────────────────┤
│ 📝 HISTORY                  │
│                             │
│ 2026-07-21  Scanned         │
│ 2026-07-20  Audited (OK)    │
│ 2024-03-15  Received        │
│                             │
├─────────────────────────────┤
│                             │
│  [🗑️ REMOVE FROM STOCK]    │ ← Action (red, full width)
│  [📞 REQUEST REORDER]       │ ← Action (blue, full width)
│                             │
│  [← Back to Inventory]      │
│                             │
└─────────────────────────────┘
```

### Tablet Layout (600px+)

```
┌──────────────────────────────────────────┐ 
│ Back    Item Details        ⋯            │
├──────────────────────────────────────────┤
│                                          │
│  🔴 Paracetamol 500mg                    │
│  (Expired 21 days ago)                   │
│                                          │
│  ┌─────────────────┐  ┌─────────────────┐
│  │ BASIC INFO      │  │ STOCK INFO      │
│  │ SKU: 12345      │  │ Total: 120      │
│  │ Batch: B2026-06 │  │ Location: A3    │
│  │ Supplier: ABC   │  │ Scanned: 120    │
│  │ Purchased: ...  │  │ Removed: 0      │
│  └─────────────────┘  └─────────────────┘
│                                          │
│  ┌─────────────────┐  ┌─────────────────┐
│  │ EXPIRY INFO     │  │ COMPLIANCE      │
│  │ Manufactured:.. │  │ Audit: 2026-07-20
│  │ Expires: ...    │  │ FDA: ✅         │
│  │ Status: EXPIRED │  │ Storage: Room.. │
│  │ Days: -21       │  │                 │
│  └─────────────────┘  └─────────────────┘
│                                          │
│  HISTORY                                 │
│  2026-07-21  Scanned                     │
│  2026-07-20  Audited                     │
│  2024-03-15  Received                    │
│                                          │
│  [🗑️ REMOVE]  [📞 REORDER]              │
│                                          │
└──────────────────────────────────────────┘
```

### Component Spec

**Header**:
- Back button
- Title: "Details"
- More button (⋯) for additional actions

**Sections**:
- Each section has header (14px, semibold) + 12px content
- Divider line between sections (1px gray)
- Padding: 16px per section

**Info Rows**:
- Label: 12px secondary
- Value: 14px primary (or color-coded for status)
- Layout: 2 columns on tablet

**Actions**:
- Full width on mobile
- Side-by-side on tablet
- Colors: Red (remove), Blue (reorder)

**History**:
- Reverse chronological (newest first)
- Compact format: Date + Action
- Colors: Neutral (not a call-to-action)

---

## SCREEN 4: PHARMACY OWNER DASHBOARD

### Purpose
Pharmacy owner view: Summary + trends + reorder requests + compliance status. Accessed via tab or settings.

### Mobile Layout (320px)

```
┌─────────────────────────────┐ 
│  11:45  ●●●●●●●●●●●●●●●●●●│
├─────────────────────────────┤
│ 📊 Dashboard          ⚙️      │ ← Header
│ Nana Pharmacy                │
│ Last sync: 2h ago            │
│                             │
├─────────────────────────────┤
│ 🎯 QUICK STATS              │ ← Section (colorful)
│                             │
│ ┌─────────────────────────┐ │
│ │ ✅ IN STOCK             │ │
│ │   1,240 items           │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ ⚠️  EXPIRING SOON       │ │
│ │   5 items (7 days)      │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ 🔴 EXPIRED              │ │
│ │   1 item (remove ASAP)  │ │
│ └─────────────────────────┘ │
│                             │
├─────────────────────────────┤
│ 📈 MONTHLY WASTE (YTD)      │
│                             │
│ Total Waste: 2,340 THB      │ ← Prominent number
│ Prevented This Month: 5,600 │ ← Savings (green)
│ ROI: 2.4x                   │ ← Efficiency (green)
│                             │
│ Trend: ↓ 15% (improving)    │ ← Positive trend
│                             │
├─────────────────────────────┤
│ 📋 PENDING REORDERS         │
│                             │
│ 3 requests pending          │
│                             │
│ 1. Paracetamol 500mg        │ ← Item + status
│    Requested: 2026-07-21    │
│    Status: Awaiting supplier│ ← Sub-status
│                             │
│ 2. Ibuprofen 400mg          │
│    Requested: 2026-07-20    │
│    Status: Supplier ordered │ ← Different status
│                             │
│ [View all reorders ▶]       │ ← Link
│                             │
├─────────────────────────────┤
│ 🔐 COMPLIANCE STATUS        │
│                             │
│ Overall:    ✅ COMPLIANT    │ ← Green badge
│ FDA:        ✅ Good standing│
│ Last Audit: 2026-07-20      │
│ Next Audit: 2026-07-25 (4d) │
│                             │
│ [View compliance report ▶]  │
│                             │
└─────────────────────────────┘
```

### Tablet Layout (600px+)

```
┌──────────────────────────────────────────┐ 
│ Dashboard                          ⚙️     │
├──────────────────────────────────────────┤
│                                          │
│ QUICK STATS (3-column grid)              │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐│
│ │ IN STOCK │  │ EXPIRING │  │ EXPIRED  ││
│ │ 1,240    │  │ 5 items  │  │ 1 item   ││
│ └──────────┘  └──────────┘  └──────────┘│
│                                          │
│ MONTHLY WASTE        │  COMPLIANCE      │
│ Total: 2,340 THB     │  Status: ✅       │
│ Prevented: 5,600 THB │  FDA: Good        │
│ ROI: 2.4x            │  Last: 2026-07-20│
│ Trend: ↓ 15%         │  Next: 2026-07-25│
│                                          │
│ PENDING REORDERS                         │
│ [Item 1] [Item 2] [Item 3]               │
│                                          │
│ [View all reorders ▶]                    │
│                                          │
└──────────────────────────────────────────┘
```

### Component Spec

**Quick Stats Cards** (Mobile Stack, Tablet 3-col):
- Each card: Background color + icon + number + label
- Colors: Green (OK), Amber (warning), Red (expired)
- Layout: Full width mobile, 1/3 width tablet
- Tap to drill down (optional Phase 2)

**Metrics Section**:
- Large metric (24px, bold): 2,340 THB
- Sub-metrics: 12px secondary
- Trend arrow: ↑ Red (bad), ↓ Green (good)

**Reorders**:
- Title: "3 requests pending"
- List items: Name + request date + status
- Status colors: Gray (awaiting), Blue (in progress), Green (completed)
- Link: "View all" → Full reorder screen

**Compliance**:
- Badge: ✅ Green if compliant, 🔴 Red if issues
- Key dates: Last audit, next audit
- Link: "View report" → Detailed compliance doc

---

## SCREEN 5: SETTINGS

### Purpose
Configuration: Pharmacy info, users, integrations, alerts, API key. Accessed via gear icon.

### Mobile Layout (320px)

```
┌─────────────────────────────┐ 
│  11:45  ●●●●●●●●●●●●●●●●●●│
├─────────────────────────────┤
│ ← Back    Settings      ⋯    │
├─────────────────────────────┤
│                             │
│ 🏥 PHARMACY INFO            │ ← Section
│                             │
│ Name:       Nana Pharmacy   │ ← Edit: Tap to change
│ Address:    123 Sukhumvit.. │
│ Phone:      02-123-4567     │
│ License #:  ABC-12345-XYZ   │
│ Manager:    Somchai         │
│                             │
│ [✏️ Edit info]              │ ← Button
│                             │
├─────────────────────────────┤
│ 👥 USERS & PERMISSIONS      │
│                             │
│ Somchai (Owner)             │ ← Owner badge
│ Niran (Technician)          │ ← Role badge
│ Porn (Technician)           │
│                             │
│ [+ Add user]                │ ← Link
│ [Manage permissions ▶]      │
│                             │
├─────────────────────────────┤
│ 🔔 ALERTS & NOTIFICATIONS   │
│                             │
│ ☑️  SMS alerts              │ ← Toggle
│    (when items expire)      │
│                             │
│ ☑️  Email summary           │
│    (daily at 6 PM)          │
│                             │
│ ☑️  In-app notifications    │
│                             │
│ Alert threshold: 7 days     │ ← Slider/picker
│ [Customize ▶]               │
│                             │
├─────────────────────────────┤
│ 🔗 INTEGRATIONS             │
│                             │
│ POS System:  Not connected  │ ← Status
│ [Connect ▶]                 │
│                             │
│ Email:       not@configured │
│ [Setup ▶]                   │
│                             │
│ API Key:     API-***-***    │ ← Masked
│ [View/Reset ▶]              │
│                             │
├─────────────────────────────┤
│ 📚 HELP & SUPPORT           │
│                             │
│ [📖 User Guide]             │
│ [❓ FAQs]                   │
│ [💬 Contact Support]        │
│ [⚖️ Terms & Privacy]        │
│                             │
├─────────────────────────────┤
│ ℹ️  VERSION                 │
│                             │
│ App Version: 1.0.0          │
│ Last Updated: 2026-07-21    │
│                             │
└─────────────────────────────┘
```

### Tablet Layout (600px+)

```
┌──────────────────────────────────────────┐ 
│ Settings                           ⋯     │
├──────────────────────────────────────────┤
│                                          │
│ PHARMACY INFO (left)  │  USERS (right)   │
│ Name: Nana Pharmacy   │  Somchai (Owner) │
│ Address: 123...       │  Niran (Tech)    │
│ Phone: 02-123-4567    │  Porn (Tech)     │
│ License: ABC-12345    │  [+ Add]         │
│ [✏️ Edit]             │                  │
│                       │  ALERTS          │
│ INTEGRATIONS          │  SMS: ☑️         │
│ POS: Not connected    │  Email: ☑️       │
│ [Connect]             │  In-app: ☑️      │
│ Email: Setup needed   │  [Customize ▶]   │
│ [Setup]               │                  │
│ API: API-***-***      │  HELP            │
│ [View/Reset]          │  [Guide][FAQs]   │
│                       │  [Support][Legal]│
│                                          │
└──────────────────────────────────────────┘
```

### Component Spec

**Section Header**:
- Icon (16px) + Title (16px, semibold)
- Border-bottom divider

**Setting Rows**:
- Label: 14px primary
- Value: 12px secondary (editable items), or toggle/switch
- Padding: 12px per row

**Buttons/Links**:
- Primary action: Blue, full width mobile
- Secondary link: Gray text, right arrow
- Dangerous action: Red (e.g., "Delete account")

**Toggles**:
- iOS-style toggle switches
- Colors: Green (on), Gray (off)

**Edit Flow**:
- Tap row → Modal/sheet with edit form
- Save → Close, show confirmation toast

---

## 🔄 NAVIGATION FLOW

### Primary Flows

```
SCAN SCREEN (home)
├─ Barcode scan → Item added
├─ Tap alert → Scroll to inventory
└─ Tap settings ⚙️ → SETTINGS

INVENTORY (tab)
├─ Tap filter (All/Expiring/OK)
├─ Tap item → ITEM DETAIL
└─ Tap action → Remove or Reorder

ITEM DETAIL
├─ [🗑️ Remove] → Confirm modal
├─ [📞 Reorder] → Create request
└─ ← Back → INVENTORY

DASHBOARD (tab, owner only)
├─ Tap stat card → Drill down (Phase 2)
├─ Tap reorder → REORDER LIST
└─ Tap compliance → COMPLIANCE REPORT

SETTINGS (⚙️ icon)
├─ Tap edit → EDIT FORM
├─ Tap add user → ADD USER FORM
├─ Tap integrations → INTEGRATION SETUP
└─ ← Back → Previous screen
```

### Bottom Navigation (Mobile)

```
┌─────────────────────────────┐
│                             │
│                             │
│                             │
├─────────────────────────────┤
│ 🏠 Scan │ 📦 Inventory │ 📊 │ ← Tabs (mobile)
└─────────────────────────────┘
```

**Tabs**:
1. **Scan** (default, primary) - Barcode input
2. **Inventory** - List of items (technicianview)
3. **Dashboard** - Summary (owner view, hidden if not owner)
4. **Settings** - Configuration (accessible from any screen via ⚙️)

### Top Navigation (Tablet/Desktop)

```
┌─────────────────────────────────────┐
│ Logo  Scan  Inventory  Dashboard  ⚙️ │
└─────────────────────────────────────┘
```

---

## 📐 RESPONSIVE BREAKPOINTS

| Size | Device | Layout |
|------|--------|--------|
| 320–599px | Mobile | 1 column, full width |
| 600–1023px | Tablet | 2 columns, 90% width |
| 1024px+ | Desktop | 3 columns, 1200px max |

**Rules**:
- Mobile: Stack everything vertically, full-width cards
- Tablet: 2-column grid for stats/sections
- Desktop: 3-column grid, sidebar navigation (optional Phase 2)

---

## ✅ WIREFRAME CHECKLIST

- [x] Screen 1: Scan (primary workflow)
- [x] Screen 2: Inventory List (sorted by urgency)
- [x] Screen 3: Item Detail (full information)
- [x] Screen 4: Owner Dashboard (summary + metrics)
- [x] Screen 5: Settings (configuration)
- [x] Navigation flows (tab-based mobile)
- [x] Responsive layouts (mobile, tablet, desktop)
- [x] Component specs (sizing, spacing, colors)
- [x] Interaction patterns (scan, filter, expand)
- [x] Empty states (no items, errors)

---

## 🎨 NEXT: COMPONENT SPECS

**Ready for Phase 4: Detailed Component Specifications**

Each component needs:
- React component signature
- Props interface
- CSS class names (matching tokens)
- Interaction states (hover, active, disabled)
- Accessibility attributes (aria-*, role)

**Components to specify**:
1. StatusBadge
2. ScanCard
3. InventoryItem
4. ActionButton
5. AlertCard
6. StatCard
7. Navigation (tabs)

---

## 👥 HANDOFF TO LUXI

**Ready to create**:
- Figma mockups (visual polish)
- Component library (reusable Storybook)
- Design tokens (Figma to code sync)
- Responsive design verification

**Timeline**: Wireframes → Figma mockups (1 day) → Component specs (1 day) → Dev ready (1 week total)

---

**Status**: Phase 3 Complete ✅  
**Next**: Phase 4 (Detailed Component Specs) or delegate to Luxi for Figma mockups  
**Owner**: Ekkarat → Luxi (visual design) → Dev team  

*Simple. Efficient. Mobile-first. Clear hierarchy. Fast interactions.*
