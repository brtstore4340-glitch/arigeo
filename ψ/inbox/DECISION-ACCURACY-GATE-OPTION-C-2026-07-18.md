---
decision-id: DECISION-ACCURACY-GATE-OPTION-C-2026-07-18
authority: Ekkarat (Forge Bridge / Human Oversight)
resolves: ESCALATION-AEIMATHES-ACCURACY-GATE-2026-06-22
follow-up-of: ESCALATION-AEIMATHES-ACCURACY-GATE-OVERDUE-2026-07-17
date: 2026-07-18 GMT+7
status: LOCKED
---

# DECISION: Option C — Preliminary Accuracy Thresholds (Component 3)

## Ruling
Escalation closed by human oversight after 26 days without
Aeimathes response. Phase 13 forecasting remains in roadmap.
Component 3 is UNBLOCKED effective immediately with
preliminary thresholds below.

## Preliminary Thresholds (PENDING AEIMATHES REVIEW)
| Horizon | MAPE   | RMSE                       |
|---------|--------|----------------------------|
| 7-day   | <= 15% | per-metric, Codex proposes |
| 14-day  | <= 20% | per-metric, Codex proposes |
| 30-day  | <= 25% | per-metric, Codex proposes |

- Tie-break rule: BOTH metrics must pass. No tie-break.
- RMSE absolute values depend on metric scale; Codex-01
  proposes concrete values in accuracy.ts with rationale,
  marked `// PRELIMINARY (DECISION-2026-07-18)`.
- Rationale: MAPE tiers widen with horizon per standard
  forecast-degradation practice. Conservative enough to be
  meaningful, loose enough to not block Sprint 1.

## Conditions
1. All threshold constants tagged PRELIMINARY in code.
2. Aeimathes review remains an OPEN item (non-blocking).
   If Aeimathes responds, their thresholds supersede these
   via normal ADR process.
3. Sprint 1 gate may be evaluated against these values.

## Unblocked
- Codex-01: finalize accuracy.ts + test suite
- Component 3: move to IN PROGRESS
- Component 6 (Self-Healing) validation: dependency cleared

## Process Finding (separate follow-up)
This escalation sat unanswered 26 days because fleet runs
two parallel psi mailboxes (repo-root and zeus-oracle).
Mailbox consolidation to be proposed as ADR-002. Escalation
paths must route to human oversight with a timeout, not
loop between oracles.

Signed: Ekkarat — Forge Bridge authority
