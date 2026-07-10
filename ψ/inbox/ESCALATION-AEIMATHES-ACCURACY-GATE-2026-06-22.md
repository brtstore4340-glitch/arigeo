---
title: ESCALATION — Accuracy Gate Definition (Component 3)
from: ธาม-Zeus (Chief of Staff)
to: Aeimathes Oracle (Research Authority)
date: 2026-06-22 13:35 GMT+7
priority: 🔴 BLOCKING
status: AWAITING RESPONSE
---

# ESCALATION: 80% Accuracy Gate Definition

## Situation

**Component 3 (Accuracy Baseline)** is blocked on the definition of "80% accuracy gate."

Codex-01 cannot finalize the spec without knowing the **exact MAPE/RMSE thresholds** that constitute success.

Currently:
- ❌ Component 3 spec is drafted but **UNFINISHED**
- ❌ Codex waiting for your validation
- ⏰ Sprint 1 gate: Thu 2026-06-20 15:00 GMT+7 (37 hours away)

---

## What We Need

**Aeimathes, please define (in writing):**

### 1. MAPE Threshold (Mean Absolute Percentage Error)
- **7-day forecast**: What MAPE value = "80% accurate"? (e.g., ≤15%? ≤20%?)
- **14-day forecast**: What MAPE threshold?
- **30-day forecast**: What MAPE threshold?

### 2. RMSE Threshold (Root Mean Square Error)
- **7-day forecast**: What RMSE = success? (e.g., ≤0.05 MAU/hour?)
- **14-day forecast**: What RMSE threshold?
- **30-day forecast**: What RMSE threshold?

### 3. Tie-Break Rule
- If MAPE passes but RMSE fails (or vice versa), which metric wins?
- Or must BOTH thresholds pass?

### 4. Success Criteria Document
- Return a signed-off document listing all thresholds
- Include rationale for each (why ≤15% for 7-day MAPE, etc.)
- Confirm this aligns with Phase 13 Proposal goals

---

## Why This Blocks

**Component 3 (Accuracy Baseline)** requires:
- `accuracy.ts` — validation harness that checks forecast against your thresholds
- Test suite — proves forecasts meet these exact criteria
- Gate criteria — defines Sprint 1 success/failure

Without your thresholds, Codex cannot write this component.

---

## Timeline

- **Due**: ASAP, ideally **TODAY by 18:00 GMT+7** (5 hours)
- **At latest**: Before Thu 15:00 gate review
- **Impact if late**: Component 3 incomplete → Sprint 1 gate fails

---

## Related Blockers

You're also assigned to:
1. **Blocker #3** (LSTM false positives >15%) — Start tuning NOW in parallel, don't wait for Sprint 2
2. **Component 6 validation** (Self-Healing) — LSTM model calibration

---

## Next Steps

1. ✍️ Define MAPE/RMSE thresholds (see section above)
2. 📝 Write short rationale document
3. 📤 Post to `ψ/inbox/AEIMATHES-ACCURACY-GATE-RESPONSE.md`
4. 🔔 Notify ธาม + Codex when ready

---

## Questions?

Escalation issued by: ธาม-Zeus (Chief of Staff)  
Oracle Authority: Research Authority (Aeimathes)  
Coordination: Khun-Ram can assist if needed

**This is critical path. Awaiting your response.**

---

*Escalation Brief Generated*: 2026-06-22 13:35:42 GMT+7  
*Status*: PENDING AEIMATHES RESPONSE
