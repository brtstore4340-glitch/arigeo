---
title: SPRINT 2 Plan — Inter-Oracle Memory Pooling Architecture
date: 2026-06-05
sprint: 2
duration: 4 weeks
sequence: After Sprint 1 completion
lead: Zeus (design) + ธาม (orchestration) + Stratum (architecture)
status: planning-phase
---

# SPRINT 2: Inter-Oracle Memory Pooling

**Objective**: Build shared knowledge base across fleet to eliminate redundant problem-solving and improve fleet coherence.

**Problem Solved**: Currently each oracle solves problems independently. When 3 oracles face similar challenges, they repeat work. With pooling, solve once, learn fleet-wide.

**Expected Outcome**: 
- 10% additional token savings (45% cumulative with Sprint 1)
- +5-10% quality improvement (better patterns, less reinvention)
- Fleet coherence metric improves
- New oracle onboarding 2x faster (can read fleet playbook)

---

## Context: Why Sprint 2?

### Current State (No Pooling)
```
Luxi solves UI accessibility issue (400 tokens)
↓ [Time passes]
Lens solves similar accessibility issue in data table (400 tokens)
↓ [Time passes]
Omega solves accessibility issue in log viewer (400 tokens)

Total: 1200 tokens spent on same problem (3x cost)
Coherence: Low (3 different solutions, no consistency)
```

### With Sprint 2 (Pooling)
```
Luxi solves UI accessibility issue (400 tokens)
↓ Contribution: "Accessibility pattern for form controls" → pool
↓ [Luxi's pattern cached in shared pool]

Lens faces similar issue in data table
↓ Query pool: "accessibility patterns" → finds Luxi's pattern
↓ Applies existing pattern (50 tokens, vs 400 new)

Omega faces similar issue in log viewer
↓ Query pool: "accessibility" → finds both patterns
↓ Chooses best fit (30 tokens)

Total: 480 tokens (60% savings on repeated problem)
Coherence: High (consistent patterns across fleet)
```

---

## Phase 1: Pool Architecture Design (Week 1)

### 1.1 Pool Schema Definition

Design the shared memory pool structure:

```yaml
# ψ/memory/fleet/pool.yml
pool:
  name: "Fleet Knowledge Pool"
  version: "1.0"
  last_updated: 2026-06-05
  
  categories:
    - name: "accessibility-patterns"
      description: "UI/UX accessibility solutions"
      owner: "luxi"  # Original contributor
      
    - name: "evm-errors"
      description: "EVM error handling + recovery"
      owner: "dheva"
      
    - name: "governance-precedents"
      description: "Past governance decisions + rationale"
      owner: "tham"
      
    - name: "performance-tuning"
      description: "Optimization techniques by domain"
      owner: "stratum"
      
    - name: "token-budgets"
      description: "Token allocation heuristics"
      owner: "lens"
  
  entries:
    - id: "acc-001"
      category: "accessibility-patterns"
      title: "ARIA labels for dynamic form controls"
      problem: "Form fields added dynamically need accessible labels"
      solution: "Use aria-label + aria-labelledby + role=region"
      tags: ["aria", "forms", "wcag2.1"]
      origin_oracle: "luxi"
      date_added: 2026-05-28
      times_reused: 2
      quality_score: 9/10  # Feedback from users
      
    - id: "evm-002"
      category: "evm-errors"
      title: "Handling EVM revert with custom error codes"
      problem: "EVM transaction reverted, need human-readable error"
      solution: "Decode error code using ABI, map to message"
      tags: ["evm", "error-handling", "defi"]
      origin_oracle: "dheva"
      date_added: 2026-06-01
      times_reused: 1
      quality_score: 8/10
```

**Deliverable**: `ψ/memory/fleet/pool-schema.md` + example pool structure

**Effort**: 6-8 hours (design + examples)

---

### 1.2 Pool Query Language

Define how oracles **find** patterns in pool:

```python
# Query examples
query = PoolQuery(
    category="accessibility",
    keywords=["forms", "aria"],
    complexity_level="beginner",  # Simple solutions first
    origin_oracle="luxi",  # Optional: prefer one oracle's style
    min_quality_score=8.0,  # Only high-quality patterns
    max_results=5
)

results = pool.search(query)
# Returns: [most relevant patterns ranked by similarity + quality]

# Suggest similar past solutions
query = PoolQuery(
    problem_description="Need to optimize SQL query for 1M rows",
    similarity_threshold=0.7
)

# Find patterns no one has documented yet
query = PoolQuery(
    gap_analysis=True,  # "What have we NOT solved yet?"
    category="governance"
)
```

**Deliverable**: `ψ/memory/fleet/pool-query-api.md` (pseudo-API + examples)

**Effort**: 4-6 hours (API design + documentation)

---

### 1.3 Contribution & Curation Rules

Define **how oracles add** to pool (governance):

```markdown
# Pool Contribution Rules

## For Oracle Contributors

**When to contribute?**
- You solved a problem that took >100 tokens
- Solution is general (reusable by other oracles)
- Problem likely to recur (not one-off)
- You have a few minutes to document it

**How to contribute?**
1. Write 50-200 word summary: problem + solution
2. Tag 2-3 keywords for searchability
3. Add to ψ/memory/fleet/contributions/[date]_[oracle]_[topic].md
4. ธาม reviews weekly (Thursday) for curation

**Curation Rules** (ธาม decides):
- ✅ Accept: Clear, reusable, matches quality bar (8+/10)
- ✅ Request changes: Vague, needs more detail
- ❌ Reject: Too specific, outdated, duplicates existing pattern

## For Pool Consumers

**When to query pool?**
- You're facing a problem similar to something you've seen
- You have >5 min to search before asking Sonnet
- Task is non-urgent (pool queries add ~50 tokens setup cost)

**How to query?**
1. `PoolQuery(category="X", keywords=[...])` in your mind
2. Browse ψ/memory/fleet/pool/ or ask ธาม to search
3. If match found: apply existing pattern (saves 200-400 tokens)
4. If no match: solve it, contribute back (close the loop)

## Quality Feedback Loop

After using a pool pattern:
- Log: "Pattern acc-001 worked for my task"
- Pool entry quality_score increases
- Bad patterns (score <6) are flagged for review/removal
```

**Deliverable**: `ψ/memory/fleet/pool-governance.md`

**Effort**: 4-6 hours (governance design + examples)

---

## Phase 2: Pool Implementation (Week 2)

### 2.1 Build Pool Infrastructure

Create the actual pool directory structure:

```
ψ/memory/fleet/
├── pool-schema.md              # Pool design
├── pool-governance.md           # Contribution rules
├── pool-index.md               # Searchable index
└── categories/
    ├── accessibility/
    │   ├── aria-labels.md
    │   ├── keyboard-navigation.md
    │   └── color-contrast.md
    ├── evm-errors/
    │   ├── revert-codes.md
    │   └── gas-optimization.md
    ├── governance/
    │   ├── oracle-roles.md
    │   ├── decision-precedents.md
    │   └── conflict-resolution.md
    ├── performance/
    │   ├── sql-optimization.md
    │   ├── cache-strategies.md
    │   └── token-budgets.md
    └── misc/
        └── [other patterns]
```

**Deliverable**: Full pool directory + 10-15 seed patterns (from past solved problems)

**Effort**: 8-12 hours (setup + seeding + organization)

---

### 2.2 Pool Query Tool Integration

Integrate pool searching into ธาม's workflow:

```python
# In ธาม's task dispatch logic
def dispatch_task(task_input):
    # Check if pool has relevant patterns
    pool_matches = search_pool(task_input)
    
    if pool_matches and high_quality(pool_matches):
        # Suggest pool pattern to oracle
        oracle.send_message(f"""
        Pool suggests similar pattern: {pool_matches[0].title}
        Source: {pool_matches[0].origin_oracle}
        Quality: {pool_matches[0].quality_score}/10
        
        Link: {pool_matches[0].path}
        """)
        # Oracle can use it or continue with Sonnet
    
    # Continue with normal routing (Haiku/Sonnet)
    route_task(task_input, oracle)
```

**Deliverable**: Pool search CLI + integration docs

**Effort**: 6-10 hours (implementation + testing)

---

### 2.3 Seed Pool with Existing Knowledge

Mine fleet history for solvable problems:

1. Review past 30 days of fleet work
2. Extract ~15-20 reusable patterns
3. Document each pattern
4. Get original oracle to validate
5. Add to pool

**Examples of patterns to extract**:
- Luxi's accessibility checklist (from dashboard redesign)
- Dheva's EVM error handling (from ORRY integration)
- Tham's governance decision template (from oracle birth decisions)
- Lens's fleet metrics calculation (from weekly reports)
- Stratum's architecture patterns (from scaling work)

**Deliverable**: 20-30 initial pool entries (ready for use)

**Effort**: 10-15 hours (extraction + documentation)

---

## Phase 3: Pilot & Feedback (Week 3)

### 3.1 Pool Pilot with 2-3 Oracles

Deploy pool to pilot group:
- **Luxi** (UI oracle) — benefits from pool of design patterns
- **Lens** (Analytics oracle) — benefits from metrics library
- **Dheva** (ERP oracle) — benefits from integration patterns

**Pilot Goals**:
- 50% of tasks use pool patterns (target adoption)
- >80% satisfaction with pool quality
- 30-40% token savings on tasks using patterns
- Identify missing patterns (gaps to fill)

**Metrics**:
- Pool queries per task
- Pattern match rate (% of queries that found relevant patterns)
- Pattern usage rate (% of matches that were actually used)
- Token savings per pattern used
- Quality feedback (1-10 rating)

**Deliverable**: Pilot results report by end of week

**Effort**: 5-7 days (monitoring + data collection)

---

### 3.2 Refine Pool Based on Feedback

Based on pilot results:
- Add 20-30 new patterns discovered during pilot
- Remove low-quality patterns (<6/10 score)
- Reorganize categories if needed
- Improve search algorithm if match rate low

**Deliverable**: Updated pool with pilot learnings

**Effort**: 3-5 days (analysis + updates)

---

## Phase 4: Fleet-Wide Rollout (Week 4)

### 4.1 Gradual Deployment

Roll out pool to all 14 oracles:
- **Day 1**: Announce pool availability
- **Day 2-3**: Training (how to query pool, how to contribute)
- **Day 4-7**: Monitor adoption, fix issues

**Rollout Materials**:
- Pool quick-start guide (1 page)
- Query examples (copy-paste templates)
- Contribution template (for new patterns)
- FAQ (common questions)

**Deliverable**: Full pool deployment + training materials

**Effort**: 4-6 days (rollout + monitoring)

---

### 4.2 Establish Pool Maintenance Cadence

Long-term pool management:

```
Weekly (Thursday):
- ธาม reviews new contributions
- Accept/request changes/reject
- Update pool-index.md

Monthly (First Monday):
- Quality audit: remove patterns with <6/10 score
- Analyze usage: which patterns are most valuable?
- Identify gaps: what problems are we NOT solving?

Quarterly:
- Pool retrospective: what have we learned?
- Strategy update: evolve pool governance if needed
```

**Deliverable**: Pool maintenance procedures + calendar

**Effort**: 2-3 hours (setup) + ongoing

---

## Success Criteria

| Metric | Target | Status |
|--------|--------|--------|
| Pool entries | 50-100 | To build |
| Pilot adoption rate | 50% tasks use patterns | To measure |
| Pattern match quality | >80% satisfaction | To measure |
| Token savings on pooled tasks | 30-40% | To measure |
| Fleet-wide adoption | 80%+ after 4 weeks | To measure |
| Time-to-value | 3-4 weeks | On track |

---

## Resource Allocation

| Role | Allocation | Effort |
|------|-----------|--------|
| **Zeus** (orchestration) | 5-10 hrs/week | Planning + decision-making |
| **ธาม** (governance + curation) | 10-15 hrs/week | Pool maintenance + intake |
| **Stratum** (architecture) | 10-15 hrs/week | Pool infrastructure |
| **Pilot Oracles** (Luxi, Lens, Dheva) | 5-10 hrs/week | Active participation |
| **Watchdog** (monitoring) | Continuous | Pool usage tracking |

**Total Effort**: ~50-70 hours across 4 weeks

---

## Timeline

```
Week 5 (Jun 4-10) — Same week as Sprint 1 rollout:
  Parallel with Sprint 1 Week 4:
  Pool design only (low effort)
  ธาม too busy with S1 rollout

Week 6 (Jul 1-7) — SPRINT 2 Week 1:
  Mon-Tue: Pool schema + API finalization
  Wed-Thu: Build pool infrastructure
  Fri: Begin seeding pool with existing patterns

Week 7 (Jul 8-14) — SPRINT 2 Week 2:
  Mon-Tue: Complete pool seeding (20-30 entries)
  Wed-Thu: Tool integration + documentation
  Fri: Pilot recruitment confirmed

Week 8 (Jul 15-21) — SPRINT 2 Week 3:
  Mon-Fri: Pool pilot (Luxi, Lens, Dheva)
  Continuous: Feedback collection + analysis

Week 9 (Jul 22-28) — SPRINT 2 Week 4:
  Mon-Tue: Refine pool based on pilot feedback
  Wed-Thu: Fleet-wide rollout + training
  Fri: Maintenance procedures established

Go-Live: ~Jul 20 (soft launch with pilots)
Full Deployment: ~Jul 28 (all 14 oracles)
```

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Low pool adoption | Medium | Wasted effort | Start with high-value patterns, market to oracles |
| Poor pattern quality | Medium | Wrong solutions spread | Strict curation, quality scoring, feedback loop |
| Pool maintenance overhead | High | Burnout on ธาม | Automate curation, delegate to oracles |
| Patterns become stale | Low | Outdated advice | Monthly quality audit, remove old patterns |
| Pool grows too large | Low | Hard to search | Categorization + search refinement |

---

## Dependencies

- [ ] Sprint 1 completion (routing working, fleet stable)
- [ ] ធាม capacity (needs 10-15 hrs/week for 4 weeks)
- [ ] Stratum availability (infrastructure work)
- [ ] Pilot oracle participation (Luxi, Lens, Dheva)

---

## Expected Outcomes

### Token Savings
- Sprint 1 (routing): 35% savings
- Sprint 2 (pooling): Additional 10% savings
- **Cumulative**: 45% fleet token reduction by late July

### Fleet Coherence
- Before: 14 oracles solving independently
- After: Shared playbook, consistent solutions
- Improvement: +5-10% on metrics like "solution quality" and "consistency"

### Oracle Onboarding
- Before: 1-2 weeks to understand fleet patterns
- After: 2-3 days (read pool + attend training)
- Acceleration: 4-5x faster onboarding

### Knowledge Retention
- Before: Knowledge siloed in oracle's session memory
- After: Documented in pool, permanently available
- Result: Fleet "brain" grows over time

---

## Next Steps (After Sprint 1 Completion)

1. Zeus + ธาม + Stratum: Finalize pool design (Week 4 of Sprint 1)
2. Stratum: Begin pool infrastructure build (Week 1 of Sprint 2)
3. Fleet: Seed pool with existing patterns
4. Pilots: Validate pool quality + adoption
5. All oracles: Adopt pool as standard workflow

---

**Document Status**: ✅ COMPLETE — Ready for review  
**Date**: 2026-06-05  
**Owner**: Zeus (design), ธาม (governance), Stratum (architecture)

**Next Review**: After Sprint 1 completion (~Jun 30)
