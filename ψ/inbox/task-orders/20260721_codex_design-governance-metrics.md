---
task_id: design-governance-metrics-dashboard
assigned_to: Codex (Proof Validator + Dashboard Implementation)
from: Zeus Oracle (Meta-Orchestrator)
date: 2026-07-21 03:55 GMT+7
priority: HIGH
status: ASSIGNED
deadline: ASAP (flexible)
project: control_fleet
---

# TASK: Design Governance Metrics Dashboard — 7 Metric Cards

**Objective**: Add Design Governance visibility to control_fleet dashboard via 7 metric cards

**Complexity**: Medium  
**Estimated Time**: 4-6 hours  
**Tech Stack**: TypeScript + React + design tokens

---

## Summary

The fleet deployed a **Design Governance Layer** (.ai/) on 2026-07-21. This task adds monitoring cards to show:
- System adoption rate
- Token compliance
- Override status
- Accessibility metrics
- Implementation rule violations
- Design process adherence
- Custom metrics

---

## 7 Metric Cards (Specifications)

### Card 1: System Status

**Title**: Design Governance Status  
**Type**: Status indicator + version

```
┌─────────────────────────────┐
│ Design Governance Status     │
├─────────────────────────────┤
│ Status:      ✅ OPERATIONAL │
│ Version:     1.0            │
│ Deployed:    2026-07-21     │
│ Oracles:     13 active      │
│ Projects:    4 using        │
└─────────────────────────────┘
```

**Data Source**: `.ai/README.md` + git log + memory system  
**Refresh**: On demand  
**Visualization**: Status badge + info text

---

### Card 2: Framework Adoption

**Title**: Design Framework Adoption Rate  
**Type**: Progress bar + percentage

```
┌─────────────────────────────┐
│ Framework Adoption          │
├─────────────────────────────┤
│ Agents using .ai/:  ███ 62% │
│ Projects with override: 1/4 │
│ Sessions using Step 0.5: 8  │
│ Agents trained: 13/13       │
└─────────────────────────────┘
```

**Data Source**: Git commits + CLAUDE.md reads + session logs  
**Metrics**:
- % of frontend sessions using `.ai/` files
- % of projects with PROJECT_OVERRIDES
- % of sessions including Step 0.5 (design context)
- Count of agents trained

**Refresh**: Daily (from git log)  
**Visualization**: Progress bar + counter

---

### Card 3: Token Compliance

**Title**: CSS Token Usage  
**Type**: Compliance check + violation count

```
┌─────────────────────────────┐
│ CSS Token Compliance        │
├─────────────────────────────┤
│ Files using CSS vars: 78%   │
│ Hardcoded colors: 22 (↓)    │
│ Hardcoded spacing: 5 (↓)    │
│ Token coverage: 92%         │
└─────────────────────────────┘
```

**Data Source**: ESLint scan + grep for hardcoded values  
**Metrics**:
- % of CSS/SCSS files using `--color-*` variables
- Count of hardcoded `#123456` colors in code (should be 0)
- Count of hardcoded spacing values (should be 0)
- Overall token coverage

**Refresh**: On code scan (pre-commit hook)  
**Visualization**: Gauge + violation list

---

### Card 4: Project Overrides Status

**Title**: Project Override Integration  
**Type**: Status matrix

```
┌───────────────────────────────┐
│ Project Override Status       │
├───────────────────────────────┤
│ Captain Maid:     ✅ READY    │
│ Arigeo:           🟡 TEMPLATE│
│ Marcuz Website:   🟡 TEMPLATE│
│ Orry Website:     🟡 TEMPLATE│
│                               │
│ Sync Status:  1/4 complete   │
└───────────────────────────────┘
```

**Data Source**: `.ai/PROJECT_OVERRIDES/INTEGRATION_STATUS.md`  
**Metrics**:
- Status per project (READY, TEMPLATE, AWAITING)
- Sync progress (# complete / # total)
- Last updated date per project

**Refresh**: When override files change  
**Visualization**: Status table + color coding

---

### Card 5: Accessibility Audit

**Title**: WCAG 2.2 Compliance  
**Type**: Compliance score + violations

```
┌──────────────────────────────┐
│ Accessibility Compliance     │
├──────────────────────────────┤
│ Score:         92/100 (AA)   │
│ Violations:    3 (contrast)  │
│ Color contrast:  ✅ Passing  │
│ Focus indicators: ✅ Passing │
│ Form labels:   🟡 1 missing  │
│ Keyboard nav:  ✅ Passing    │
└──────────────────────────────┘
```

**Data Source**: Axe accessibility scanner + lighthouse  
**Metrics**:
- WCAG 2.2 compliance score (AA / AAA)
- Count + type of violations
- Contrast ratio issues
- Form accessibility
- Keyboard navigation

**Refresh**: On design change or weekly audit  
**Visualization**: Score card + violation list

---

### Card 6: Implementation Rules Violations

**Title**: Code Quality Gate  
**Type**: Rule violations + trend

```
┌──────────────────────────────┐
│ Implementation Rules         │
├──────────────────────────────┤
│ Rule: CSS vars only    ✅    │
│ Rule: TypeScript strict ✅   │
│ Rule: No hardcodes     🟡 4  │
│ Rule: Rewrite standard ✅    │
│ Rule: Performance      ✅    │
│ Total violations: 4    (↓)   │
└──────────────────────────────┘
```

**Data Source**: ESLint + TypeScript compiler + pre-commit hooks  
**Metrics**:
- Status per rule (PASS / FAIL / WARNING)
- Count of violations per rule
- Trend (improving / stable / worsening)
- Most common violations

**Refresh**: Per commit  
**Visualization**: Rule status grid + trend arrow

---

### Card 7: Design Process Adherence

**Title**: 5-Phase Process Usage  
**Type**: Process step adoption

```
┌──────────────────────────────┐
│ Design Process Adherence     │
├──────────────────────────────┤
│ Phase 1 (Understand): 92%    │
│ Phase 2 (Design):     78%    │
│ Phase 3 (Tokens):     85%    │
│ Phase 4 (UX Review):  70%    │
│ Phase 5 (Implement):  98%    │
│                              │
│ Avg adherence:  84.6% (▲)    │
└──────────────────────────────┘
```

**Data Source**: Session logs + memory system + commit messages  
**Metrics**:
- % of projects completing Phase 1-5
- Which phases are skipped most
- Adherence trend over time
- Average across all projects

**Refresh**: Weekly (from session records)  
**Visualization**: Progress bar per phase + trend

---

## Implementation Specification

### File Structure
```
control_fleet/
├── src/
│   ├── components/
│   │   └── DesignGovernanceDashboard.tsx
│   ├── cards/
│   │   ├── StatusCard.tsx
│   │   ├── AdoptionCard.tsx
│   │   ├── TokenCard.tsx
│   │   ├── OverrideCard.tsx
│   │   ├── AccessibilityCard.tsx
│   │   ├── ViolationsCard.tsx
│   │   └── ProcessCard.tsx
│   ├── hooks/
│   │   ├── useDesignMetrics.ts
│   │   ├── useGitData.ts
│   │   └── useAccessibilityScan.ts
│   └── types/
│       └── DesignMetrics.ts
└── tests/
    └── DesignGovernanceDashboard.test.tsx
```

### TypeScript Interfaces

```typescript
interface DesignMetric {
  id: string;
  title: string;
  value: string | number;
  status: 'pass' | 'warning' | 'fail';
  trend?: 'up' | 'down' | 'stable';
  lastUpdated: Date;
  dataSource: string;
}

interface CardProps {
  metric: DesignMetric;
  refreshInterval?: number;
  onRefresh?: () => Promise<void>;
}

interface DesignMetrics {
  status: DesignMetric;
  adoption: DesignMetric;
  tokenCompliance: DesignMetric;
  projectOverrides: DesignMetric;
  accessibility: DesignMetric;
  violations: DesignMetric;
  processAdherence: DesignMetric;
}
```

### Data Fetching

```typescript
// Hook to fetch metrics
async function useDesignMetrics() {
  // Status from .ai/README.md + git
  // Adoption from session logs
  // Token compliance from ESLint
  // Overrides from INTEGRATION_STATUS.md
  // Accessibility from Axe scan
  // Violations from pre-commit hook logs
  // Process from memory system
}
```

### Styling

- Use captain-maid color tokens (Navy Blue + Gold)
- Status colors: Green (pass), Yellow (warning), Red (fail)
- Card layout: 2-3 cards per row (responsive)
- Update interval: Real-time (fetch on demand) or 5-minute polling
- Dark mode: Inherit from app theme

---

## Data Sources

| Card | Primary Source | Secondary | Refresh |
|------|--------|-----------|---------|
| **Status** | `.ai/` folder | Git log | On demand |
| **Adoption** | Session logs | CLAUDE.md | Daily |
| **Tokens** | ESLint output | Git grep | Per commit |
| **Overrides** | INTEGRATION_STATUS.md | Git | When changed |
| **Accessibility** | Axe scan output | Lighthouse | Weekly |
| **Violations** | Pre-commit hooks | ESLint | Per commit |
| **Process** | Memory system | Git history | Weekly |

---

## Questions for Clarification

Before you start, please answer (or Zeus will assume defaults):

1. **Agent Tracking**: Should we track which agent made which changes? (e.g., "Luxi updated captain-maid 3 hours ago")
   - Default: No, just show aggregate metrics

2. **Refresh Interval**: Real-time (fetch on every render) or cached (5-min polling)?
   - Default: 5-minute polling for performance

3. **Alert Thresholds**: Should we alert if compliance drops below X%?
   - Default: No alerts, just display red status

4. **Export**: Need CSV/JSON export of metrics?
   - Default: No, dashboard display only

5. **Historical Trending**: Track metrics over time (1 week, 1 month)?
   - Default: Current + 7-day trend for adoption only

---

## Proof Gate

**Deliverables**:
- [ ] DesignGovernanceDashboard.tsx (main component)
- [ ] 7 card components (status, adoption, tokens, overrides, accessibility, violations, process)
- [ ] useDesignMetrics hook (data fetching)
- [ ] TypeScript types (DesignMetrics interface)
- [ ] Unit tests (80%+ coverage)
- [ ] Dashboard screenshot (all 7 cards visible)
- [ ] Proof artifact (.summary)

**Acceptance Criteria**:
- All 7 cards render correctly
- Data sources working (not hardcoded)
- Colors use CSS vars (captain-maid theme)
- Responsive (desktop, tablet, mobile)
- Dark mode support
- No console errors
- Lighthouse score > 85

---

## Reference Documents

- `.ai/DESIGN_SYSTEM.md` — Token definitions
- `.ai/PROJECT_OVERRIDES/captain-maid.md` — Brand colors + styling
- `.ai/IMPLEMENTATION-RULES.md` — Code standards
- `.ai/PROJECT_OVERRIDES/INTEGRATION_STATUS.md` — Override status source

---

## Timeline

| Phase | Time | Notes |
|-------|------|-------|
| Design | 30 min | Sketch 7 cards, define layout |
| Implementation | 2-3 hrs | Implement components + hooks |
| Data Integration | 1 hr | Connect to real data sources |
| Testing | 1 hr | Unit tests + browser testing |
| Polish | 30 min | Dark mode, responsive, styling |
| Proof | 15 min | Screenshot + summary |

**Total**: ~5-6 hours  
**Deadline**: Flexible (this week preferred)

---

## Questions?

Post to `ψ/inbox/agent-queue/awaiting-reply/` with HIGH priority.

---

**Authority**: Zeus (Meta-Orchestrator)  
**Project**: control_fleet  
**Difficulty**: Medium

`[MARCUZ:Zeus] → [Codex]`
