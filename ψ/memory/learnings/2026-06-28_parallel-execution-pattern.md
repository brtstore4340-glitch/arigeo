---
name: parallel-execution-pattern
description: "Multi-team skeleton docs enable parallel work while specs converge"
metadata:
  type: learnings
  date: 2026-06-28
  source: "dashboard-redesign-phase-1"
  concepts: ["documentation", "team-coordination", "parallel-execution"]
---

# Parallel Execution Pattern: Skeleton Docs + (FILL:...)

**Pattern**: When multiple teams depend on interconnected specs, don't wait to write complete documentation. Create skeleton docs with (FILL: ...) placeholders for each team's domain. Teams fill in their section while consuming (but not blocking on) other sections.

**Why This Works**:
- Unblocks 5 teams from day 1 instead of waiting for complete specs
- Skeleton docs clarify *structure* even if *content* is incomplete
- Teams can start parallel work (components, APIs, metrics) without serialization
- Placeholders make it obvious where specs are needed, forcing clarity
- Total time: spec writing happens alongside implementation, not before

**When to Apply**:
- Multi-team projects with interdependent but independent-domain work
- Specs that will evolve as teams collaborate (better to draft + iterate than perfect on day 1)
- High-velocity environments where waiting 1 week for perfect specs costs 7 days of execution

**Real Example** (this session):
- Created 8 skeleton docs (2,466 lines) with (FILL: ...) placeholders
- Each team owns one document: Luxi (Components), ธาม (Metrics), Build (Architecture), Dev (APIs), QA (Testing)
- Teams started working same day while main team monitored + validated
- Specs converged through collaboration, not top-down delivery

**Tradeoff**:
- Requires careful handoff: each team must understand their section ownership
- Skeleton docs can create false sense of progress if placeholders aren't filled
- Needs active monitoring to ensure no team is blocked waiting for dependencies

**Rule for Future Use**: Use skeleton pattern for any project with 3+ teams and 2+ weeks of parallel work. For smaller projects or shorter timelines, complete specs first.
