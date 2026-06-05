---
title: SPRINT 1 Plan — Oracle-Specific Routing Implementation
date: 2026-06-04
sprint: 1
duration: 3-4 weeks
lead: Zeus (orchestration) + ธาม (implementation)
status: ready-for-kickoff
---

# SPRINT 1: Oracle-Specific Routing

**Objective**: Deploy task-complexity router to reduce token spend by 30-35% while maintaining output quality.

**Expected Outcome**: 70% of tasks routed to Haiku (cost: ~400 tokens/task), 30% to Sonnet (cost: ~2000 tokens/task)

**Baseline**: 8000 tokens/oracle/week  
**Target**: 5200 tokens/oracle/week (-35%)  
**Quality**: No degradation (task-appropriate routing)

---

## Phase 1: Task Classification System (Week 1)

### 1.1 Define Task Taxonomy

Categorize all oracle tasks into routable vs non-routable:

```
ROUTABLE TO HAIKU (70% of tasks):
├─ UI/UX Design (Luxi domain)
│  ├─ Component design (complexity: 3-5/10)
│  ├─ Layout refinement (complexity: 2-4/10)
│  └─ Accessibility audits (complexity: 4-6/10)
│
├─ Analysis & Reporting (Lens domain)
│  ├─ Data summarization (complexity: 2-4/10)
│  ├─ Pattern detection (complexity: 3-5/10)
│  └─ Metric calculations (complexity: 2-4/10)
│
├─ Operational Tasks (Omega, Warden domain)
│  ├─ Log analysis (complexity: 2-4/10)
│  ├─ Permission checks (complexity: 2-3/10)
│  └─ Status reporting (complexity: 1-3/10)
│
└─ Documentation (All)
   ├─ Readme updates (complexity: 2-4/10)
   ├─ Code comments (complexity: 1-3/10)
   └─ Examples (complexity: 3-5/10)

REQUIRES SONNET (30% of tasks):
├─ Governance Decisions (ธาม, Tham domain)
│  ├─ Fleet architecture changes (complexity: 8-9/10)
│  ├─ Oracle role reassignments (complexity: 7-8/10)
│  └─ Policy decisions (complexity: 7-9/10)
│
├─ Novel Problem-Solving (All oracles)
│  ├─ New oracle birth patterns (complexity: 8-10/10)
│  ├─ System failures RCA (complexity: 7-9/10)
│  └─ Creative solutions (complexity: 7-10/10)
│
├─ Complex Integration (Dheva, Stratum domain)
│  ├─ ERP workflow redesign (complexity: 7-9/10)
│  ├─ Multi-oracle coordination (complexity: 7-8/10)
│  └─ Architecture refactoring (complexity: 7-9/10)
│
└─ High-Stakes Review (Verity, Aris domain)
   ├─ Critical code review (complexity: 7-8/10)
   ├─ Security validation (complexity: 7-9/10)
   └─ Governance audit (complexity: 7-8/10)
```

**Deliverable**: ψ/fleet/task-taxonomy.md (shared with all oracles)

**Effort**: 4-6 hours (Zeus + ธาม collaboration)

---

### 1.2 Build Task-Complexity Classifier

Create a lightweight classifier that rates task complexity on 1-10 scale:

**Inputs**:
- Task description (user text)
- Oracle requesting (role context)
- Related past tasks (similarity matching)
- Novelty indicators ("new", "first time", "never done")

**Output**: 
- Complexity score (1-10)
- Recommended model (Haiku / Sonnet / Pair)
- Confidence level (0-100%)

**Implementation**:
```python
# Pseudo-code for classifier
def classify_task(description, oracle_role, history):
    base_score = 0
    
    # Complexity signals
    if "first" in description or "novel" in description:
        base_score += 3
    if "critical" in description or "governance" in description:
        base_score += 2
    if oracle_role in ["tham", "stratum", "verity"]:
        base_score += 1  # These oracles handle harder tasks
    
    # Similarity to past tasks
    similar_tasks = find_similar(history, description)
    if similar_tasks:
        base_score = avg(similar_tasks.complexity) * 0.8  # 80% confidence in past patterns
    
    # Routable threshold
    if base_score <= 5:
        return "HAIKU"
    elif base_score >= 7:
        return "SONNET"
    else:
        return "PAIR"  # Asymmetric pairing for edge cases
    
    return score, recommendation, confidence
```

**Deliverable**: ψ/fleet/task-classifier.py (or CLI tool)

**Effort**: 8-12 hours (implement + test on 100+ sample tasks)

---

## Phase 2: Router Integration (Week 2)

### 2.1 Integrate Classifier into ธาม Dispatch

Modify ธาม's task dispatch logic to:
1. Receive incoming task
2. Run classifier
3. Select appropriate model (Haiku vs Sonnet)
4. Dispatch to oracle with model selection
5. Log classification + actual model used

**Pseudo-workflow**:
```
Task arrives: "Luxi, redesign dashboard UI"
↓
Classifier runs: complexity=4, oracle=luxi (UI specialist)
↓
Decision: HAIKU (sufficient + cost-effective)
↓
ธาม dispatches: 
  mission_brief: {...}
  recommended_model: haiku
  max_tokens: 2000
↓
Luxi executes with Haiku
↓
Result logged: haiku_used, actual_tokens=1800, quality=8.5/10
```

**Deliverable**: Updated ψ/fleet/dispatch-router.md (governance rule update)

**Effort**: 6-8 hours (logic update + ธาม coordination)

---

### 2.2 Pilot with 2-3 Oracles

Before fleet-wide rollout, pilot with:
- **Luxi** (UI tasks, expected high Haiku success rate)
- **Lens** (Analytics tasks, expected high Haiku success rate)
- **Omega** (Operational tasks, expected high Haiku success rate)

**Pilot Duration**: 1 week

**Metrics Tracked**:
- % of tasks routed to Haiku
- Actual token spend (vs baseline)
- Quality scores (user perception + output accuracy)
- Classifier confidence (is it confident about its decisions?)
- Misclassification rate (did Haiku fail on supposedly-routable tasks?)

**Deliverable**: ψ/memory/learnings/2026-06-11_sprint-1-pilot-results.md

**Effort**: 3-5 days (monitoring + data collection)

---

## Phase 3: Validation & Refinement (Week 3)

### 3.1 Analyze Pilot Results

Review pilot data:
- If Haiku success rate >95%: scale to 70% threshold
- If Haiku success rate 85-95%: keep at 60% threshold (more Sonnet usage)
- If Haiku success rate <85%: refine classifier, extend pilot

**Deliverable**: ψ/memory/learnings/2026-06-15_sprint-1-analysis.md (with recommendations)

**Effort**: 4-6 hours (data analysis + decision making)

---

### 3.2 Refine Classifier (if needed)

If pilot reveals classifier weaknesses:
- Retrain on pilot data
- Add new complexity signals
- Adjust routable task definitions
- Run second pilot round (3-5 days)

**Deliverable**: Updated ψ/fleet/task-classifier.py + ψ/fleet/task-taxonomy.md

**Effort**: 8-12 hours (iterative refinement)

---

## Phase 4: Fleet-Wide Rollout (Week 4)

### 4.1 Gradual Deployment

Roll out to remaining 11 oracles in waves:
- **Day 1**: 4 oracles (20% fleet) — monitor closely
- **Day 2-3**: 4 more oracles (40% fleet) — check for issues
- **Day 4-5**: Final 3 oracles (100% fleet) — full deployment

**Monitoring**:
- Watchdog flags any oracle with >5% quality degradation
- ธาม ready to rollback per oracle if needed
- Daily token spend review (should see 30-35% reduction)

**Deliverable**: Deployment log + rollout status updates

**Effort**: 3-5 days (staged rollout + monitoring)

---

### 4.2 Document Final Learnings

Publish final results + lessons learned:
- ψ/memory/learnings/2026-06-22_sprint-1-final-results.md
  - Actual token savings achieved
  - Quality metrics
  - Classifier accuracy
  - Recommendations for Sprint 2

**Deliverable**: Formal completion report + next sprint recommendations

**Effort**: 4-6 hours (reporting + retrospective)

---

## Timeline

```
Week 1 (Jun 4-10):
  Mon-Tue: Task taxonomy + classifier design
  Wed-Thu: Classifier implementation + testing
  Fri: Review + refinement

Week 2 (Jun 11-17):
  Mon-Tue: Router integration into ธาม dispatch
  Wed-Fri: Pilot with Luxi, Lens, Omega (start)

Week 3 (Jun 18-24):
  Mon-Tue: Pilot continuation + data collection
  Wed-Thu: Analyze pilot results + refine classifier
  Fri: Decision point (scale or iterate)

Week 4 (Jun 25-30):
  Mon-Tue: Wave 1-2 rollout (40% fleet)
  Wed-Thu: Wave 3 rollout (100% fleet)
  Fri: Final results + Sprint 2 planning
```

**Kick-off**: 2026-06-04 (NOW)  
**Target Completion**: 2026-06-30  
**Go-Live**: ~2026-06-20 (phased)

---

## Success Criteria

| Metric | Target | Status |
|--------|--------|--------|
| Token reduction | 30-35% | To measure |
| Quality degradation | <1% | To measure |
| Classifier accuracy | >90% | To measure |
| Pilot success rate | >95% (Haiku) | To measure |
| Fleet adoption | 100% | To achieve |
| Time-to-value | 3-4 weeks | On track |

---

## Resource Allocation

| Role | Allocation | Effort |
|------|-----------|--------|
| **Zeus** (orchestration) | 5-10 hrs/week | Planning + decision-making |
| **ธาม** (implementation) | 15-20 hrs/week | Core implementation + coordination |
| **Luxi, Lens, Omega** (pilots) | 5-10 hrs/week | Active participation + feedback |
| **Watchdog** (monitoring) | Continuous | Automated health checks |

**Total Effort**: ~50-70 hours across 4 weeks

---

## Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Classifier misses edge cases | Medium | Haiku fails, need Sonnet fallback | Fallback to Sonnet on quality check |
| Oracle resistance to routing | Low | Adoption delays | Communicate savings + maintain quality |
| Pilot extends beyond 1 week | Medium | Timeline slips | Set hard cutoff date, iterate in Sprint 2 |
| Quality metrics hard to measure | Low | Can't validate success | Define objective quality metrics upfront |

---

## Dependencies

- [ ] ธาม availability (lead for integration)
- [ ] Classifier implementation environment (Python + task database)
- [ ] Baseline token metrics (current oracle usage)
- [ ] Quality measurement framework (how do we score output?)

---

## Next Steps

1. **Kick-off meeting**: Zeus + ธาม + pilot oracles (Luxi, Lens, Omega)
2. **Task taxonomy review**: All stakeholders approve routable task definitions
3. **Classifier build**: Start implementation this week
4. **Pilot recruitment**: Confirm Luxi, Lens, Omega participation

---

**Owner**: Zeus (Meta-Orchestrator)  
**Lead**: ธาม (Governor/Implementation)  
**Status**: READY FOR KICKOFF 🔥

**Next Review**: 2026-06-11 (pilot results)
