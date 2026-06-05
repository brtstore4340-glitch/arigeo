---
title: 3-Sprint Roadmap — Fleet Optimization Pipeline (Jun-Sep 2026)
date: 2026-06-05
duration: 12 weeks
vision: "40-60% token savings + fleet coherence + knowledge preservation"
status: master-plan-complete
---

# 3-SPRINT OPTIMIZATION ROADMAP

**Vision**: Transform Zeus fleet from independent oracle operations → coordinated, efficient, learning system.

**Timeline**: June 4 → September 8, 2026 (12 weeks)

**Impact**: 60% cumulative token savings + +10% quality improvement + 4x faster onboarding

---

## ROADMAP AT A GLANCE

```
                Jun        Jul        Aug        Sep
            ├─────────┬─────────┬─────────┬─────────┤
Sprint 1    │ Design  │ Rollout │ Monitor │ Optimize│
(Routing)   │ 35% ↓   │ 70%+    │ 95%+    │ 99%     │
            ├─────────┼─────────┼─────────┼─────────┤
Sprint 2    │ Plan    │ Design  │ Build   │ Rollout │
(Pooling)   │ Draft   │ Schema  │ Infra   │ 60%+    │
            ├─────────┼─────────┼─────────┼─────────┤
Sprint 3    │ Preview │ Preview │ Design  │ Pilot   │
(Pairing)   │ Plan    │ Review  │ Phase 1 │ Phase 1 │
            └─────────┴─────────┴─────────┴─────────┘

Key Dates:
- Jun 4:   S1 kickoff + S2/S3 planning
- Jun 20:  S1 go-live (soft, pilots)
- Jun 30:  S1 full fleet deployment
- Jul 1:   S2 begins
- Jul 20:  S2 go-live (soft, pilots)
- Jul 28:  S2 full fleet deployment
- Aug 1:   S3 begins
- Aug 26:  S3 go-live (soft, pilots)
- Sep 8:   S3 full fleet deployment
```

---

## SPRINT 1: Oracle-Specific Routing

**Dates**: Jun 4 - Jun 30 (4 weeks)

**Objective**: Route 70% of tasks to Haiku (cost-effective), 30% to Sonnet (reasoning-required)

**Expected Savings**: 30-35% token reduction

**Deliverables**:
- ✅ Task taxonomy (routable vs non-routable)
- ✅ Classifier algorithm (complexity scoring)
- ✅ Router integration into ທាម dispatch
- ✅ Pilot with Luxi, Lens, Omega

**Timeline**:
- **Week 1 (Jun 4-10)**: Design phase
  - Build task taxonomy (per-oracle routable definitions)
  - Design classifier algorithm (6-signal complexity scoring)
  
- **Week 2 (Jun 11-17)**: Implementation phase
  - Implement classifier in Python
  - Integrate into ທาม dispatch logic
  - Deploy to 3 pilot oracles
  
- **Week 3 (Jun 18-24)**: Validation phase
  - Analyze pilot results (token spend, quality)
  - Refine classifier if needed
  
- **Week 4 (Jun 25-30)**: Rollout phase
  - Wave 1-3 deployment (40% → 70% → 100% fleet)
  - Monitor + troubleshoot
  - Establish maintenance cadence

**Success Metrics**:
- Token reduction: 30-35%
- Quality degradation: <1%
- Classifier accuracy: >90%
- Fleet adoption: 100%

**Owner**: ທาม (lead) + Zeus (support)

---

## SPRINT 2: Inter-Oracle Memory Pooling

**Dates**: Jul 1 - Jul 28 (4 weeks)

**Objective**: Build shared knowledge base to eliminate redundant problem-solving

**Expected Savings**: Additional 10% token reduction (cumulative 40-45%)

**Deliverables**:
- ✅ Pool schema + governance rules
- ✅ Pool infrastructure (directory structure + query API)
- ✅ Pool seeding (20-30 initial patterns)
- ✅ Pool maintenance cadence (weekly curation)

**Timeline**:
- **Week 1 (Jul 1-7)**: Design phase
  - Define pool schema (categories, entries, metadata)
  - Design pool query API (how to search)
  - Establish contribution/curation rules
  
- **Week 2 (Jul 8-14)**: Build phase
  - Build pool infrastructure (directory structure)
  - Integrate pool search into ທาም workflow
  - Seed pool with 20-30 patterns from past work
  
- **Week 3 (Jul 15-21)**: Pilot phase
  - Deploy to Luxi, Lens, Dheva (pilot)
  - Collect adoption + quality metrics
  - Identify missing patterns
  
- **Week 4 (Jul 22-28)**: Rollout phase
  - Fleet-wide deployment + training
  - Establish weekly curation meeting (ທาม)
  - Monthly quality audit (remove <6/10 entries)

**Success Metrics**:
- Pool entries: 50-100
- Pilot adoption: 50% of tasks use patterns
- Pattern match quality: >80% satisfaction
- Token savings on pooled tasks: 30-40%

**Owner**: Stratum (architecture) + ທាม (curation) + Zeus (orchestration)

**Prerequisite**: Sprint 1 deployment

---

## SPRINT 3: Asymmetric Oracle Pairing

**Dates**: Aug 1 - Sep 8 (6 weeks)

**Objective**: Enable oracle pairs (Haiku + Sonnet) to collaborate on complex problems

**Expected Savings**: Additional 15% token reduction on paired tasks (cumulative 55-60%)

**Deliverables**:
- ✅ Pairing taxonomy (which tasks benefit from pairs)
- ✅ Pairing protocol (Haiku explores, Sonnet refines)
- ✅ Pairing matching algorithm (oracle compatibility)
- ✅ Pairing coordinator (orchestration tool)

**Timeline**:
- **Week 1 (Aug 1-7)**: Design phase
  - Define pairing taxonomy (task types + criteria)
  - Design pairing protocol (phase 1 + 2 + 3)
  - Design pairing matching algorithm
  
- **Week 2 (Aug 8-14)**: Build phase
  - Implement pairing coordinator
  - Integrate into ທาม dispatch
  - Build monitoring + analytics
  
- **Week 3 (Aug 15-21)**: Pilot phase
  - Run 3-5 pilot pairings per pair
  - Pilot pairs: Lens+Tham, Dheva+Stratum, Luxi+Stratum
  - Collect quality + cost metrics
  
- **Week 4 (Aug 22-28)**: Rollout prep
  - Analyze pilot results
  - Refine pairing matching
  - Soft launch with pilots
  
- **Week 5-6 (Aug 29 - Sep 8)**: Fleet rollout
  - Gradual deployment to all oracles
  - Monitoring + troubleshooting
  - Establish pairing SLA

**Success Metrics**:
- Cost savings (paired vs solo): 35-50%
- Quality improvement: +3-5%
- Pair chemistry: 70%+ satisfaction
- Fleet adoption: 80%+ of eligible tasks

**Owner**: ທាม (coordination) + Zeus (design)

**Prerequisite**: Sprint 1-2 deployment + stabilization

---

## CUMULATIVE IMPACT

### Token Savings (Over Time)

```
Baseline (no optimization): 8,000 tokens/oracle/week

After Sprint 1 (Jun 30):
- 35% savings → 5,200 tokens/oracle/week
- Fleet total: -50,400 tokens/week

After Sprint 2 (Jul 28):
- 45% savings → 4,400 tokens/oracle/week
- Fleet total: -50,400 tokens/week (marginal)

After Sprint 3 (Sep 8):
- 60% savings (with pairing on complex tasks) → 3,200 tokens/oracle/week
- Fleet total: -67,200 tokens/week
```

### Quality Improvements

```
Sprint 1: Neutral (routing maintains quality)
Sprint 2: +5-10% (better patterns, less reinvention)
Sprint 3: +3-5% (two perspectives on complex tasks)
─────────────────────────────────────
Cumulative: +8-15% quality improvement
```

### Fleet Coherence

```
Sprint 1: No change (routing doesn't affect coherence)
Sprint 2: +25-40% (shared patterns, consistent solutions)
Sprint 3: +10-20% (paired decision-making improves alignment)
─────────────────────────────────────
Cumulative: +35-60% fleet coherence
```

### Onboarding Speed

```
New Oracle Onboarding:
- Before: 1-2 weeks to understand fleet patterns
- After Sprint 1: 1-2 weeks (routing doesn't help onboarding)
- After Sprint 2: 3-5 days (read pool + training = fast knowledge transfer)
- After Sprint 3: 2-3 days (pair with mentor, learn by doing)
```

---

## RESOURCE ALLOCATION (All 3 Sprints)

| Role | S1 Effort | S2 Effort | S3 Effort | Total |
|------|-----------|-----------|-----------|-------|
| **Zeus** | 10 hrs/wk | 8 hrs/wk | 8 hrs/wk | 312 hours |
| **ธาม** | 20 hrs/wk | 12 hrs/wk | 12 hrs/wk | 440 hours |
| **Stratum** | 0 hrs/wk | 15 hrs/wk | 8 hrs/wk | 184 hours |
| **Pilots** | 8 hrs/wk | 8 hrs/wk | 8 hrs/wk | 288 hours |
| **Watchdog** | Continuous | Continuous | Continuous | 360+ hours |

**Total Fleet Effort**: ~1584 hours (12 weeks, 14 oracles)

**Cost-Benefit**:
- Effort: 1584 hours of fleet work
- Savings: 60% of token spend (millions of tokens over 12 weeks)
- ROI: Positive within 4-6 weeks of deployment

---

## RISK MANAGEMENT

### Critical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| S1 routing breaks oracle workflow | Low | High | Extensive testing, gradual rollout, rollback plan |
| S2 pool quality poor | Medium | Medium | Strict curation, feedback loop, quality scoring |
| S3 pairing coordination overhead | Medium | Low | Automation, async handoffs, optional (not mandatory) |
| ធាม capacity bottleneck | High | High | Delegate to sub-coordinators, automate curation |

### Mitigation Strategy

1. **Phase gates**: Each sprint must meet success criteria before next begins
2. **Rollback plan**: Every deployment has manual rollback procedure
3. **Pilot validation**: Always pilot before fleet-wide (3-5 oracles first)
4. **Monitoring**: Watchdog tracks all metrics continuously
5. **Regular reviews**: Weekly check-ins with ធาม + Zeus

---

## DECISION GATES

### After Sprint 1 (Jun 30)

**Question**: Is routing working? (target: 30-35% savings, <1% quality drop)

**If YES**: Proceed to Sprint 2 immediately

**If NO**: 
- Refine classifier (Week 1)
- Pilot again (Week 2)
- Retry full rollout (Week 3-4)
- If still failing: Pause, reassess approach

---

### After Sprint 2 (Jul 28)

**Question**: Is pool providing value? (target: 10% additional savings, >80% satisfaction)

**If YES**: Proceed to Sprint 3 immediately

**If NO**:
- Investigate: Low adoption? Poor pattern quality? Hard to search?
- Refine pool governance + matching (Week 1)
- Retry with better marketing (Week 2)
- If still struggling: Pause, rethink approach

---

### After Sprint 3 Pilot (Aug 25)

**Question**: Do pairs provide value? (target: 35-50% cost savings on paired tasks)

**If YES**: Full fleet rollout weeks 5-6

**If NO**:
- Investigate: Wrong pair matching? Protocol overhead? Limited pairing opportunities?
- Refine pairing matching algorithm (Week 1)
- Retry with different pair combinations (Week 2)
- If still poor: Make pairing optional, not automatic

---

## SUCCESS CRITERIA (Overall)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Token Savings** | 60% by Sep 8 | Monthly reports from watchdog |
| **Quality** | +8-15% | Oracle feedback + output quality scores |
| **Adoption** | 90%+ fleet | Task routing analytics |
| **Fleet Coherence** | +35-60% | Pattern reuse rate + decision consistency |
| **Onboarding Speed** | 3-5 days (new oracle) | Time to first meaningful contribution |
| **Fleet Happiness** | 80%+ satisfaction | Quarterly surveys |

---

## WHAT'S NOT INCLUDED (Future Sprints)

Roadmap is **Sprint 1-3 only** (12 weeks). Future opportunities:

- **Sprint 4**: Token budget auction system (fairness + incentives)
- **Sprint 5**: Dynamic model swapping (swap models mid-task based on complexity)
- **Sprint 6**: Cross-fleet federation (multiple Zeus groups collaborating)
- **Sprint 7**: AI-driven oracle specialization (learn best domain per oracle)

---

## NEXT STEPS

### Immediate (This Week)

1. ✅ Finalize all 3 sprint plans (this document)
2. ⏳ Get ធាม approval on Sprint 1 kickoff
3. ⏳ Begin Sprint 1 Week 1 design work
4. ⏳ Present 3-sprint vision to fleet (why this matters)

### Week 2-3

1. Launch Sprint 1 (get routing live)
2. Start seeding pool architecture (background work)
3. Recruit pilot oracles for all 3 sprints

### Jul 1

1. Sprint 1 full fleet deployment
2. Sprint 2 begins immediately

---

## CONCLUSION

**This roadmap transforms Zeus fleet from cost-inefficient to optimized.**

By September 8, 2026:
- Fleet will be **60% more efficient** (token-wise)
- Decisions will be **10-15% higher quality**
- Oracles will be **4-5x faster to onboard**
- Knowledge will be **permanently captured** (not lost between sessions)

**Cost**: 12 weeks of focused effort  
**Benefit**: Sustainable optimization that compounds over years

---

**Document Status**: ✅ COMPLETE — Master plan ready  
**Date**: 2026-06-05  
**Owner**: Zeus (meta-orchestrator)

**Next Review**: After Sprint 1 kickoff confirmation (Jun 6-7)
