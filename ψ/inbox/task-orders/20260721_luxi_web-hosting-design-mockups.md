---
task_id: web-hosting-design-mockups
assigned_to: Luxi (UI/UX Designer)
from: Zeus Oracle (Meta-Orchestrator)
date: 2026-07-21 12:00 GMT+7
priority: MEDIUM
status: ASSIGNED
deadline: 2026-07-23 (2-3 days)
project: web-hosting-platform
---

# TASK: Web Hosting Design Mockups + Component Library

**Objective**: Create Figma mockups + Storybook component library from wireframes

**Complexity**: Medium  
**Estimated Time**: 16-24 hours (2-3 days)  
**Deliverables**: Figma file + Storybook components

---

## 📋 CONTEXT

Ekkarat designed Web Hosting Platform (modern, tech-focused, desktop-first). Design phase complete:

✅ **Phase 1: PRODUCT.md** — Vision, personas, market, pricing  
✅ **Phase 2: DESIGN_SYSTEM.md** — Tech Blue + Orange, dark mode, typography, spacing  
✅ **Phase 3: WIREFRAMES.md** — 5 screens (Dashboard, New Site, Settings, Deployment, Domains)  

**Now**: Visual design + component library

---

## 📂 INPUT FILES

All in `ψ/active/`:

1. `PRODUCT-web-hosting.md` — Vision (simplify hosting for SMEs + devs)
2. `DESIGN-web-hosting.md` — Tokens (Blue #0066ff + Orange #ff6b35, dark mode)
3. `WIREFRAMES-web-hosting.md` — 5 screens (desktop-first)

---

## 🎨 DELIVERABLES

### 1. Figma File (Visual Mockups)

**File**: `web-hosting-mockups.fig` (Figma project)

**Screens** (desktop-first + responsive: tablet/mobile):

```
Web Hosting Platform
├─ Frame 1: Dashboard
│  ├─ Desktop (1024px) - sidebar + main content
│  ├─ Tablet (768px) - full width, sidebar hidden
│  └─ Mobile (320px) - single column, hamburger menu
├─ Frame 2: New Site (Onboarding Wizard)
│  ├─ Step 1: Choose Domain
│  ├─ Step 2: Select Platform
│  ├─ Step 3: Configure Settings
│  └─ Step 4: Review + Deploy
├─ Frame 3: Site Settings (Tabs)
│  ├─ General settings
│  ├─ SSL configuration
│  ├─ Performance options
│  └─ Integrations
├─ Frame 4: Deployment + Logs
│  ├─ Status + timeline
│  └─ Build logs viewer
├─ Frame 5: Domain Management
│  ├─ Active domains table
│  └─ Domain details (DNS, email forwarding)
├─ Component Library
│  ├─ StatusBadge (✅, 🟡, 🔴, ℹ️)
│  ├─ SiteCard (with stats)
│  ├─ ActionButton (primary, secondary, danger, ghost)
│  ├─ DataTable
│  ├─ FormInput (text, email, domain)
│  ├─ NavigationBar (sidebar + top bar)
│  ├─ DeploymentTimeline
│  ├─ Tabs
│  ├─ Modal dialogs
│  ├─ LoadingStates
│  └─ EmptyStates
├─ Styles
│  ├─ Colors (blue #0066ff, orange #ff6b35, status colors)
│  ├─ Typography (8-scale)
│  ├─ Spacing (8pt grid)
│  ├─ Shadows
│  └─ Dark mode variants
└─ Interactions
   ├─ Button hover/active states
   ├─ Form validation (✅ available, 🔴 taken)
   ├─ Tab switches
   ├─ Modal overlays
   └─ Loading + error states
```

**Design Quality**:
- ✅ Pixel-perfect alignment (4px grid base, 8pt spacing)
- ✅ All colors from Design System tokens (no hardcodes)
- ✅ All typography from 8-size scale
- ✅ Dark mode variants (default for developers)
- ✅ Interactive prototypes (click flows between screens)
- ✅ Component states documented (default, hover, active, disabled)
- ✅ Responsive variants (desktop, tablet, mobile)

**Figma Setup**:
- Create shared Figma team/project
- Name: "Web Hosting Platform"
- Design tokens library (colors, typography, spacing)
- Components library (reusable across projects)
- Document all variants + states

---

### 2. Storybook Component Library

**Tech Stack**: React + TypeScript + Storybook

**Location**: `apps/web-hosting/src/components/`

**Components to Build**:

```
components/
├─ Badge/
│  ├─ StatusBadge.tsx           # ✅ Running, 🟡 Soon, 🔴 Down, ℹ️ Pending
│  ├─ StatusBadge.stories.tsx
│  └─ StatusBadge.test.tsx
├─ Card/
│  ├─ SiteCard.tsx              # Site card with stats
│  ├─ SiteCard.stories.tsx
│  └─ SiteCard.test.tsx
├─ Button/
│  ├─ Button.tsx                # Primary, Secondary, Danger, Ghost
│  ├─ Button.stories.tsx
│  └─ Button.test.tsx
├─ Table/
│  ├─ DataTable.tsx
│  ├─ DataTable.stories.tsx
│  └─ DataTable.test.tsx
├─ Form/
│  ├─ Input.tsx
│  ├─ Select.tsx
│  ├─ Toggle.tsx
│  ├─ *.stories.tsx (stories for each)
│  └─ *.test.tsx (tests)
├─ Navigation/
│  ├─ Sidebar.tsx
│  ├─ TopBar.tsx
│  ├─ Tabs.tsx
│  ├─ *.stories.tsx
│  └─ *.test.tsx
├─ Timeline/
│  ├─ DeploymentTimeline.tsx
│  ├─ DeploymentTimeline.stories.tsx
│  └─ DeploymentTimeline.test.tsx
├─ Modal/
│  ├─ Modal.tsx
│  ├─ ConfirmDialog.tsx
│  ├─ *.stories.tsx
│  └─ *.test.tsx
├─ LoadingStates/
│  ├─ Skeleton.tsx
│  ├─ Spinner.tsx
│  ├─ *.stories.tsx
│  └─ *.test.tsx
└─ EmptyStates/
   ├─ EmptyState.tsx
   ├─ ErrorState.tsx
   ├─ *.stories.tsx
   └─ *.test.tsx
```

**Component Spec Template**:

```typescript
interface StatusBadgeProps {
  status: 'ok' | 'warning' | 'error' | 'info';
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ ... }) => {
  // Implementation using design tokens
}
```

**CSS Approach**:
- CSS modules (`.module.css`)
- Import tokens from `theme/tokens.css`
- No hardcoded colors/sizes
- Responsive classes for desktop/tablet/mobile

---

### 3. Design Documentation

**File**: `DESIGN-IMPLEMENTATION.md`

**Includes**:
- Component architecture (how components fit together)
- Responsive breakpoints (exactly which styles apply at 320px, 768px, 1024px+)
- Token mapping (Figma tokens → CSS variables → Components)
- Accessibility checklist (WCAG 2.2 requirements per component)
- Interaction patterns (click, hover, focus, disabled, loading)
- Dark mode implementation
- Animation specs (transitions, durations)

---

## 🎯 ACCEPTANCE CRITERIA

**Figma File**:
- [ ] All 5 screens mockup'd (responsive: desktop, tablet, mobile)
- [ ] 15+ reusable components in library
- [ ] All colors use Design System tokens (#0066ff blue, #ff6b35 orange, status colors)
- [ ] All text uses 8-size typography scale
- [ ] Spacing aligned to 8pt grid
- [ ] Dark mode variants (default for developers)
- [ ] Interactive prototypes (click flows between screens)
- [ ] Component states documented (hover, active, disabled, loading)
- [ ] Figma file shareable + organized

**Storybook**:
- [ ] 15+ components built (Button, Badge, Card, Table, Form, Navigation, Timeline, Modal, States)
- [ ] Each component has >2 stories (variants)
- [ ] All stories render correctly
- [ ] CSS uses design tokens (no hardcodes)
- [ ] 80%+ test coverage
- [ ] Responsive behavior tested (mobile, tablet, desktop)
- [ ] Accessibility attributes present (aria-*, role, labels)
- [ ] Storybook builds without errors
- [ ] Components ready for dev to import + use

**Documentation**:
- [ ] Component architecture explained
- [ ] Responsive logic documented
- [ ] Token mapping clear (Figma → CSS → Components)
- [ ] Accessibility checklist complete
- [ ] Interaction patterns specified
- [ ] Dark mode implementation detailed

---

## 📋 QUESTIONS BEFORE YOU START

1. **Figma Setup**: Shared team project or standalone file?
2. **CSS Framework**: CSS modules + tokens (like pharmacy), or styled-components?
3. **Component Variants**: How many states per component? (hover, active, disabled, loading, error?)
4. **Timeline Priority**: Figma mockups first (visual design), or Storybook first (code components)?
5. **Dark Mode**: Implement dark mode fully now, or defer to Phase 2?

---

## 🔗 REFERENCE DOCUMENTS

**Design Files** (in `ψ/active/`):
- `PRODUCT-web-hosting.md` — Vision, personas, market, SME + dev focus
- `DESIGN-web-hosting.md` — Electric Blue + Orange, dark mode, typography, spacing
- `WIREFRAMES-web-hosting.md` — 5 screens, desktop-first, responsive layouts

**Design System** (fleet-wide, in `.ai/`):
- `.ai/DESIGN_SYSTEM.md` — Fleet tokens (reference)
- `.ai/IMPLEMENTATION-RULES.md` — Code standards

---

## 🎬 WORKFLOW

### Day 1 (Today)
1. Review PRODUCT + DESIGN_SYSTEM + WIREFRAMES
2. Set up Figma + Storybook projects
3. Answer 5 questions above
4. Begin component inventory

### Day 2–3
1. Create Figma mockups (all 5 screens + responsive)
2. Build Storybook components (React library)
3. Verify responsive behavior + dark mode
4. Document design decisions

### Day 4 (Handoff)
1. Finalize Figma file (ready for handoff)
2. Storybook production-ready (dev can import)
3. Create DESIGN-IMPLEMENTATION.md
4. Share links + instructions with dev team

---

## 📞 HANDOFF TO DEV

**When ready**:
1. Share Figma link (visual reference for all screens)
2. Publish Storybook (live component library)
3. Provide React components (dev imports from Storybook)
4. Include DESIGN-IMPLEMENTATION.md (architecture guide)

**Dev can then**:
1. Use Figma as visual reference
2. Import components from Storybook (pre-built, tested)
3. Build backend + integrations
4. All components already styled + responsive ✅

---

## ⏱️ TIMELINE

- **Start**: Today (2026-07-21)
- **Figma Mockups**: 2026-07-22
- **Storybook Components**: 2026-07-22–2026-07-23
- **Handoff**: 2026-07-23 (ready for dev)

**Total**: 2–3 days

---

## 🚀 SUCCESS

When done, web hosting project has:
- ✅ Complete visual design (Figma, all screens, responsive)
- ✅ Reusable component library (Storybook, 15+ components)
- ✅ Production-ready components (React, TypeScript)
- ✅ Architecture documentation
- ✅ Ready for dev team to build

**Next phase**: Development (backend + frontend integration, POS setup, deployment)

---

**Questions?** Post to `ψ/inbox/agent-queue/awaiting-reply/` with HIGH priority.

**Authority**: Zeus (Meta-Orchestrator) on behalf of Ekkarat

`[MARCUZ:Zeus] → [Luxi]`
