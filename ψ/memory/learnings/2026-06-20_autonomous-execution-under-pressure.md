---
name: autonomous-execution-under-pressure
description: Under time pressure, prioritize paths requiring zero external coordination
metadata:
  type: feedback
  date: 2026-06-20
  source: Phase 13b ledger decision session
---

# Autonomous Execution Paths Win Under Pressure

Of multiple options, the one requiring **zero external coordination** is the best default when time is short or a deadline has passed.

## Rule

**When choosing between equivalent-outcome paths under time pressure:**
- **Path A** (requires external actor: cluster admin, team coordination, approval)
- **Path B** (internal/autonomous: no external dependencies, can execute now)
- **Path C** (requires external actor + specific person: Aeimathes availability)

**→ Choose Path B (autonomous).** It's not the most ambitious. It's the most resilient.

## Why

External dependencies introduce risk:
- Coordination delays
- Availability gaps (person not online, busy)
- Information gaps (cluster metrics may have gaps, data quality unknown)
- Fallback complexity (if Path A fails mid-execution, you scramble)

Autonomous paths trade some peak quality for reliability:
- Path A: 85%+ accuracy Week 1, but depends on cluster admin coordination
- Path B: 60% accuracy Week 1, but Codex-01 executes now with zero coordination
- Week 2+: Both paths improve to 85%+ as real data accumulates

The outcome converges; the risk diverges.

## How to Apply

When presented with decision options:
1. Identify which require external coordination (dependencies on other people, systems, availability)
2. Identify which are autonomous (self-contained, can run now)
3. Under time pressure or past deadline: choose autonomous first
4. Only choose external-dependency paths if:
   - Dependency is confirmed available NOW (not "should be available")
   - Quality gap is material (not marginal)
   - Time isn't the constraint (schedule is relaxed)

## Example from This Session

**Phase 13b Prophet forecasting ledger** (30+ days of demand signal data needed):

| Path | Quality | External Dependencies | Time-to-Value |
|---|---|---|---|
| **A (Backfill)** | 85%+ Week 1 | Dheva/Hephaestus (cluster admins) | 24–48h coordination + export |
| **B (Synthetic)** | 60% Week 1 → 85%+ Week 2 | None | Immediate (Codex-01 executes now) |
| **C (Hybrid)** | 50% Week 1 → 75%+ Week 2 | Aeimathes (calibration) | Immediate start + multi-day availability |

**Deadline context**: 2026-06-19 EOD (already passed by 12h). Monday kickoff non-negotiable.

**Decision**: Path B (autonomous). Quality converges to 85%+ by Week 2; risk profile is safest under pressure.

## Pattern Recognition

This is a **system design principle** that applies beyond software:
- Infrastructure: prefer automation over manual ops
- Incident response: prefer self-healing over page-on-call
- Escalations: prefer resolved-state fallbacks over committee-decision paths

Autonomous > coordinated under pressure. Coordination is a luxury you take when you have time.

## Related Lessons

- [[past-deadline-path-selection]] — When deadline < now, autonomy is mandatory
- [[role-clarity-execute-vs-consult]] — Your role is to execute the chosen path, not debate paths
