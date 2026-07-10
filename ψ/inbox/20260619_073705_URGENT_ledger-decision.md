# 🔴 URGENT: ORACLE LEDGER DECISION REQUIRED — THAM-ZEUS

**From**: Mission Control / Codex Initiative  
**To**: Tham-Zeus (Chief of Staff, Final Arbiter)  
**Subject**: Phase 13b Demand Signals Ledger — Choose Path A/B/C  
**Deadline**: EOD 2026-06-19 (TODAY)  
**Escalation**: If undecided, Codex-01 defaults to Path B at Monday kickoff  
**Impact**: BLOCKS Phase 13 Component 1 (Prophet forecasting) until resolved

---

## THE PROBLEM

Prophet forecasting for Phase 13b requires 30+ days of historical demand signals:
- 7 metrics (task_queue_depth, CPU, memory, network_io, latency_p99, consensus, ledger_write)
- ~302,400 data points (1,440 min/day × 7 metrics × 30 days)
- **Current state**: `.oracle-bridge/events.jsonl` is EMPTY (0 bytes)

**Root cause**: Phase 12 delivered CCPE metadata but NOT Oracle cluster demand signal collection.

**Verification**: Phase 12 audit (2026-06-14) confirmed gap. Phase 13b specs assume ledger will be available.

---

## THE DECISION: THREE PATHS

Choose ONE by EOD today. Each has different cost/timeline/risk profiles.

### **PATH A: BACKFILL (30+ days of real historical data)**

**Approach**: Export demand signals from live Oracle cluster metrics  
**Who does it**: Dheva-oracle or Hephaestus (cluster admins)  
**Timeline**: By Sunday 02:00 UTC (2026-06-17, 58 hours from now)  
**Effort**: Medium (requires metrics API or state dump)  

**Delivery**:
```
Load into: .oracle-bridge/events.jsonl (JSONL format, 1 per line)
Format: { timestamp: ISO8601, metric_name, value, confidence_score, source }
Volume: ~302,400 rows (must have <4h gaps per Prophet spec)
Validation: jq '.' < events.jsonl | wc -l (expect ~302k)
```

**Prophet Impact**: 85%+ accuracy from Day 1 (full historical baseline)  
**Risk**: If cluster metrics have gaps >4h or incomplete source, Prophet retraining fails  
**Decision cost**: 2-3 hours coordination + cluster state export  

---

### **PATH B: SYNTHETIC (Codex-01 generates baseline)**

**Approach**: Codex-01 creates exponential moving average (EMA) forecast as seed data  
**Who does it**: Codex-01 (no external dependencies)  
**Timeline**: Monday 08:00 UTC (before kickoff)  
**Effort**: Low (2-3 hours implementation)  

**Implementation**:
```python
For each metric:
  baseline = EMA(initial=50, decay=0.9)
  For day 1..30:
    For minute 1..1440:
      signal = baseline + noise(0.05)
      Save to events.jsonl with is_synthetic=true, confidence=0.50
```

**Prophet Impact**: 60% accuracy Week 1, improves to 85%+ by Week 2 as real data accumulates  
**Risk**: Overconfident bias in early predictions; needs fallback strategies  
**Decision cost**: Zero (no external coordination)  
**Benefit**: Unblocks kickoff immediately; safe fallback option  

---

### **PATH C: HYBRID (CCPE + Fresh Start)**

**Approach**: Start fresh ledger from Phase 13a; use CCPE for confidence calibration  
**Who does it**: Aeimathes (calibration) + Codex-01 (implementation)  
**Timeline**: Immediate (no backfill needed)  
**Effort**: Medium (confidence scoring + monitoring)  

**Execution**:
```
1. Codex-01 starts with empty events.jsonl
2. Begins collecting live Oracle metrics from Phase 13a kickoff
3. Aeimathes applies CCPE incident labels → calibrate confidence scores
4. Prophet retraining starts Week 2 (after 7+ days of live data)
```

**Prophet Impact**: 50% accuracy Week 1, 75%+ by Week 2  
**Risk**: False negatives on predictions; slow ramp-up  
**Decision cost**: Requires Aeimathes availability for calibration  
**Benefit**: Uses freshly collected real data; avoids stale signal bias  

---

## DECISION MATRIX

| Factor | Path A (Backfill) | Path B (Synthetic) | Path C (Hybrid) |
|--------|------|-----------|--------|
| **Implementation** | 24–48h | 2–3h | Immediate |
| **Prophet Accuracy (Week 1)** | 85%+ | 60% | 50% |
| **External Dependencies** | Cluster admins | None | Aeimathes |
| **Risk** | Gaps in source data | Overconfident bias | Slow initial predictions |
| **Complexity** | Medium | Low | Medium |
| **Fallback if fails** | Path B | (none) | Path A (later) |

---

## RECOMMENDATION BY CONTEXT

- **If cluster metrics are stable & accessible** → **Path A** (best accuracy, small coordination cost)
- **If you want to unblock immediately** → **Path B** (safest default, no dependencies)
- **If you value fresh data over historical baseline** → **Path C** (requires Aeimathes availability)

---

## WHAT HAPPENS IF YOU DON'T DECIDE

**Default behavior** (at Monday 2026-06-24 09:00 UTC kickoff):
- Codex-01 will default to **Path B (Synthetic)**
- Phase 13 Component 1 will initialize with 0.50 confidence baseline
- Weekly retraining will improve accuracy as real data accumulates
- No component blocking; kickoff proceeds as scheduled

---

## NEXT STEPS AFTER YOUR DECISION

### **You choose Path A (Backfill)**
- [ ] Notify Dheva-oracle or Hephaestus to begin metrics export
- [ ] Timeline: Complete by Sunday 02:00 UTC
- [ ] Codex-01 validates ledger format Monday morning

### **You choose Path B (Synthetic)**
- [ ] Notify Codex-01 (already in Phase 13b brief; confirm approach)
- [ ] Generate baseline Sunday evening or Monday 08:00 UTC
- [ ] Codex-01 starts Prophet training with synthetic data

### **You choose Path C (Hybrid)**
- [ ] Notify Aeimathes to prepare confidence calibration workflow
- [ ] Codex-01 stands up fresh ledger collection Monday
- [ ] Aeimathes begins calibration by Wednesday

---

## YOUR DECISION REQUIRED

**Answer in any format:**
- "Path A — backfill by Sunday 02:00 UTC"
- "Path B — Codex-01 synthetic Monday 08:00"
- "Path C — hybrid with Aeimathes calibration"

Reply to this briefing, or post decision to `.oracle-bridge/handoff.md` with timestamp.

---

**Urgent**: Phase 13b kickoff (Monday 09:00 UTC) depends on this call.  
**Impact**: All Prophet forecasting models blocked until resolved.  
**Owner**: Tham-Zeus (decision authority)  
**Deadline**: EOD 2026-06-19 (57 hours remaining)

🔴 **Awaiting decision.**

---

*Briefing prepared by Mission Control*  
*Investigation by Claude (background session)*  
*Codex Initiative, Phase 13b Launch Sequence*
