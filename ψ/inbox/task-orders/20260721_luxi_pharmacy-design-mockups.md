---
task_id: pharmacy-expiry-design-mockups
assigned_to: Luxi (UI/UX Designer)
from: Zeus Oracle (Meta-Orchestrator)
date: 2026-07-21 04:10 GMT+7
priority: MEDIUM
status: ASSIGNED
deadline: 2026-07-23 (2-3 days)
project: pharmacy-expiry-management
---

# TASK: Pharmacy Expiry Design Mockups + Component Library

**Objective**: Create Figma mockups + Storybook component library from wireframes

**Complexity**: Medium  
**Estimated Time**: 16-24 hours (2-3 days)  
**Deliverables**: Figma file + Storybook components

---

## 📋 CONTEXT

Ekkarat designed Pharmacy Expiry Management System (mobile-first, simple + efficient). Design phase complete:

✅ **Phase 1: PRODUCT.md** — Vision, personas, market, goals  
✅ **Phase 2: DESIGN_SYSTEM.md** — Colors (Medical Blue + Status), Typography, Spacing, Components  
✅ **Phase 3: WIREFRAMES.md** — 5 screens (Scan, Inventory, Detail, Dashboard, Settings)  

**Now**: Visual design + component library

---

## 📂 INPUT FILES

All in `ψ/active/`:

1. `PRODUCT-pharmacy-expiry.md` — Vision + personas + market + metrics
2. `DESIGN-pharmacy-expiry.md` — Tokens + component specs + accessibility
3. `WIREFRAMES-pharmacy-expiry.md` — 5 screen layouts + flows + responsive

---

## 🎨 DELIVERABLES

### 1. Figma File (Visual Mockups)

**File**: `pharmacy-expiry-mockups.fig` (Figma project)

**Screens** (all responsive: mobile + tablet + desktop):

```
Pharmacy Expiry Management System
├─ Frame 1: Scan Screen
│  ├─ Mobile (320px)
│  ├─ Tablet (600px)
│  └─ Desktop (1024px)
├─ Frame 2: Inventory List
│  ├─ Mobile
│  ├─ Tablet (2-column)
│  └─ Desktop (3-column)
├─ Frame 3: Item Detail
│  ├─ Mobile (full screen)
│  ├─ Tablet (side-by-side)
│  └─ Desktop (expanded)
├─ Frame 4: Owner Dashboard
│  ├─ Mobile (card stack)
│  ├─ Tablet (2-col grid)
│  └─ Desktop (3-col grid)
├─ Frame 5: Settings
│  ├─ Mobile (full screen)
│  ├─ Tablet (2-column)
│  └─ Desktop (sidebar + content)
├─ Component Library
│  ├─ StatusBadge (OK, Warning, Expired)
│  ├─ ScanCard
│  ├─ InventoryItem
│  ├─ ActionButton (Primary, Danger)
│  ├─ StatCard
│  ├─ AlertCard
│  ├─ NavigationTabs
│  └─ Forms (Input, Toggle, Dropdown)
├─ Styles
│  ├─ Colors (all tokens from DESIGN_SYSTEM.md)
│  ├─ Typography (8-scale)
│  ├─ Spacing (12-level)
│  └─ Shadows (if used)
└─ Interactions
   ├─ Button hover states
   ├─ Tab switches
   ├─ Modal overlays
   └─ Loading states
```

**Design Quality**:
- ✅ Pixel-perfect alignment
- ✅ Consistent spacing (use 4px grid)
- ✅ All colors from Design System tokens
- ✅ All typography from 8-size scale
- ✅ Dark mode variants (if Phase 2)
- ✅ Interactive prototypes (click flows)
- ✅ Component states documented (default, hover, active, disabled)

**Figma Setup**:
- Create shared Figma team/project
- Name: "Pharmacy Expiry Management"
- Include design tokens library (colors, typography)
- Add components to Figma library (reusable)
- Document component variants

---

### 2. Storybook Component Library

**Tech Stack**: React + TypeScript + Storybook

**Location**: `apps/pharmacy-expiry/src/components/`

**Components to Build**:

```
components/
├─ Badge/
│  ├─ StatusBadge.tsx           # OK, Warning, Expired variants
│  ├─ StatusBadge.stories.tsx   # Storybook demo
│  └─ StatusBadge.test.tsx      # Unit tests
├─ ScanCard/
│  ├─ ScanCard.tsx
│  ├─ ScanCard.stories.tsx
│  └─ ScanCard.test.tsx
├─ InventoryItem/
│  ├─ InventoryItem.tsx
│  ├─ InventoryItem.stories.tsx
│  └─ InventoryItem.test.tsx
├─ Button/
│  ├─ Button.tsx                # Primary, Danger variants
│  ├─ Button.stories.tsx
│  └─ Button.test.tsx
├─ StatCard/
│  ├─ StatCard.tsx
│  ├─ StatCard.stories.tsx
│  └─ StatCard.test.tsx
├─ AlertCard/
│  ├─ AlertCard.tsx
│  ├─ AlertCard.stories.tsx
│  └─ AlertCard.test.tsx
├─ Navigation/
│  ├─ Tabs.tsx
│  ├─ Tabs.stories.tsx
│  └─ Tabs.test.tsx
└─ Forms/
   ├─ Input.tsx
   ├─ Toggle.tsx
   ├─ Dropdown.tsx
   └─ (stories + tests for each)
```

**Component Spec Template** (each component):

```typescript
// StatusBadge.tsx
interface StatusBadgeProps {
  status: 'ok' | 'warning' | 'expired';  // Required
  label?: string;                         // Optional
  icon?: React.ReactNode;                 // Optional icon
  className?: string;                     // CSS override
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ ... }) => {
  // Implementation
}

export default StatusBadge;
```

**Storybook Stories**:

```typescript
// StatusBadge.stories.tsx
import { StatusBadge } from './StatusBadge';

export default {
  title: 'Components/StatusBadge',
  component: StatusBadge,
};

export const Ok = () => <StatusBadge status="ok" label="In Stock" />;
export const Warning = () => <StatusBadge status="warning" label="Expiring Soon" />;
export const Expired = () => <StatusBadge status="expired" label="Expired" />;
```

**CSS Approach**:
- Use CSS modules (`.module.css`)
- Import design tokens from `theme/tokens.css`
- No hardcoded colors/sizes
- Responsive classes (e.g., `.button-mobile`, `.button-tablet`)

---

### 3. Design Documentation

**File**: `DESIGN-IMPLEMENTATION.md`

**Includes**:
- Component architecture (how components fit together)
- Responsive breakpoints (exactly which styles apply at 320px, 600px, 1024px)
- Token mapping (Figma tokens → CSS variables → Components)
- Accessibility checklist (WCAG requirements per component)
- Interaction patterns (click, hover, focus, disabled)
- Color contrast verification (link to Figma or separate document)
- Animation specs (if any transitions needed)

---

## 🎯 ACCEPTANCE CRITERIA

**Figma File**:
- [ ] All 5 screens mockup'd (mobile + tablet + desktop)
- [ ] 15+ reusable components in library
- [ ] All colors use Design System tokens (no hardcodes)
- [ ] All text uses 8-size typography scale
- [ ] Spacing aligned to 4px grid
- [ ] Dark mode variants (future-proof)
- [ ] Interactive prototypes (click flows between screens)
- [ ] Component states documented (hover, active, disabled, loading)
- [ ] Figma file shareable + organized

**Storybook**:
- [ ] 15+ components built
- [ ] Each component has >2 stories (variants)
- [ ] All stories render correctly
- [ ] CSS uses design tokens (no hardcodes)
- [ ] 80%+ test coverage
- [ ] Responsive behavior tested (mobile, tablet, desktop)
- [ ] Accessibility attributes present (aria-*, role)
- [ ] Storybook builds without errors
- [ ] Components ready for dev to import + use

**Documentation**:
- [ ] Component architecture explained
- [ ] Responsive logic documented
- [ ] Token mapping clear
- [ ] Accessibility checklist complete
- [ ] Interaction patterns specified

---

## 📋 QUESTIONS BEFORE YOU START

1. **Figma Setup**: Do you have a team Figma project? Or should I set up a shared one?
2. **Storybook Framework**: Use React + TypeScript (matching fleet tech)?
3. **CSS Approach**: CSS modules + design tokens? Or styled-components?
4. **Component Variants**: How many state variants per component? (e.g., button: hover, active, disabled, loading?)
5. **Timeline Priority**: Figma mockups first (visual design) or Storybook first (code components)?
6. **Dark Mode**: Include dark mode variants now, or defer to Phase 2?

---

## 🔗 REFERENCE DOCUMENTS

**Design Files** (in `ψ/active/`):
- `PRODUCT-pharmacy-expiry.md` — Vision, personas, market
- `DESIGN-pharmacy-expiry.md` — Tokens, component specs
- `WIREFRAMES-pharmacy-expiry.md` — 5 screens, flows

**Design System** (fleet-wide, in `.ai/`):
- `.ai/DESIGN_SYSTEM.md` — Fleet tokens (use as fallback)
- `.ai/IMPLEMENTATION-RULES.md` — Code quality standards

---

## 🎬 WORKFLOW

### Day 1 (Today)
1. Review PRODUCT + DESIGN_SYSTEM + WIREFRAMES
2. Ask clarifying questions (5 above)
3. Set up Figma + Storybook projects
4. Begin component inventory (list 15 components)

### Day 2–3
1. Create Figma mockups (all 5 screens)
2. Build Storybook components (React)
3. Verify responsive behavior
4. Document design decisions

### Day 4 (Handoff)
1. Finalize Figma file (ready for handoff)
2. Storybook production-ready (dev can import)
3. Create DESIGN-IMPLEMENTATION.md
4. Share links + instructions with dev team

---

## 📞 HANDOFF TO DEV

**When ready**:
1. Share Figma link (mockups for reference)
2. Publish Storybook (live component library)
3. Provide React components (dev imports from Storybook)
4. Include DESIGN-IMPLEMENTATION.md (architecture guide)

**Dev can then**:
1. Use Figma as visual reference
2. Import components from Storybook (no re-implementing)
3. Build screens + integrate with backend
4. All components already styled + tested ✅

---

## ⏱️ TIMELINE

- **Start**: Today (2026-07-21)
- **Figma Mockups**: 2026-07-22
- **Storybook Components**: 2026-07-22–2026-07-23
- **Handoff**: 2026-07-23 (ready for dev)

**Total**: 2–3 days

---

## 🚀 SUCCESS

When done, pharmacy project has:
- ✅ Complete visual design (Figma)
- ✅ Reusable component library (Storybook)
- ✅ Production-ready components (React)
- ✅ Architecture documentation
- ✅ Ready for dev to build

**Next phase**: Development (Codex/dev team builds backend + integrations)

---

**Questions?** Post to `ψ/inbox/agent-queue/awaiting-reply/` with HIGH priority.

**Authority**: Zeus (Meta-Orchestrator) on behalf of Ekkarat

`[MARCUZ:Zeus] → [Luxi]`
