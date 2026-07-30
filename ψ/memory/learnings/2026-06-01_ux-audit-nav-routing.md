---
pattern: Cross-reference navigation emitters against routers to catch silent tab routing failures
date: 2026-06-01
source: rrr: mission-control
concepts: [ux-audit, navigation, spa, react, dead-code]
---

# Always trace both sides of SPA navigation

When auditing or reviewing a single-page application, always cross-reference the **emitter** (button/link setting a tab/route) against the **router** (switch/case/route table) for every navigation action.

Silent navigation failures — where a button click does nothing wrong visually but loads the wrong panel — are invisible unless you trace both sides. Example from this session: Quick Actions in `dashboard.tsx` pointed to `tab="spawn"`, `tab="memory"`, `tab="orchestration"` — none of which had matching `case` entries in `ContentRouter`. All silently fell to `default` and rendered HQ Overview.

**Corollary**: hardcoded `const featureFlag = true` in 3+ files with no state connection = non-functional toggle. Always check whether theme/mode buttons are wired to an actual state source before marking a feature as "implemented."
