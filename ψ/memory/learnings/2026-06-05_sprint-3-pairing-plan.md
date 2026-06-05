---
title: SPRINT 3 Plan — Asymmetric Oracle Pairing for Complex Reasoning
date: 2026-06-05
sprint: 3
duration: 4-6 weeks
sequence: After Sprint 2 completion
lead: Zeus (orchestration) + ธาม (coordination)
status: preview-planning
---

# SPRINT 3: Asymmetric Oracle Pairing

**Objective**: Enable oracle pairs (Haiku + Sonnet) to collaborate on complex problems, improving quality while reducing cost.

**Problem Solved**: Some problems benefit from two perspectives — one fast (breadth) and one deep (depth). Current approach: use Sonnet solo (expensive). Better: Haiku explores breadth → Sonnet refines depth.

**Expected Outcome**:
- 15% additional token savings on paired tasks (45% + 15% = 60% cumulative)
- +3-5% quality improvement (two perspectives, validated reasoning)
- Faster resolution of novel problems (parallel exploration)

---

## Why Asymmetric Pairing?

### Problem: Complex Research Task

**Task**: "Research best-practice governance for multi-oracle fleet"

#### Approach A: Solo Sonnet
```
Sonnet (deep approach):
- Explores 10 angles thoroughly
- 45 minutes, 4000 tokens
- Hits depth but maybe missed breadth
- Alone, so 1 perspective

Result: Deep but narrow, 4000 tokens
```

#### Approach B: Asymmetric Pair (New)
```
Haiku (fast breadth):
- Scans 10 angles quickly, identifies 5 promising ones
- 2 minutes, 500 tokens
- "Here are 5 angles worth exploring"

Sonnet (deep refinement):
- Takes Haiku's 5 angles, deep-dives on best 2
- 8 minutes, 1500 tokens
- Validates + expands on those 2

Total: 10 minutes, 2000 tokens (50% savings)
Quality: Actually BETTER (two perspectives)
```

---

## Phase 1: Pairing Framework Design (Weeks 1-2)

### 1.1 Pairing Taxonomy

Define which task types benefit from pairing:

```markdown
# Pairing Candidates (40% of fleet work)

## Research Tasks (80% pairing fit)
- "Investigate 5 approaches to X problem" → Haiku explores, Sonnet refines
- "Find best practice for Y" → Haiku surveys, Sonnet validates
- "RCA of system issue" → Haiku diagnoses, Sonnet explains

## Design Tasks (60% pairing fit)
- "Explore UI patterns for new feature" → Haiku brainstorms, Sonnet refines
- "Propose architecture for scaling" → Haiku outlines, Sonnet details

## Decision Tasks (50% pairing fit)
- "Decide between 3 approaches" → Haiku evaluates options, Sonnet picks best

## NOT Pairing Candidates
- Simple bug fixes (Haiku solo)
- Code documentation (Haiku solo)
- Status reporting (Haiku solo)
- Routine refactoring (Haiku solo)

# Pairing Rules

Task requires pairing IF:
- Complexity ≥ 7/10 (from Sprint 1 classifier)
- AND novelty_level ≥ "medium" (new for this oracle)
- AND stakes ≥ "medium" (affects system)
- AND oracle_confidence < 80% ("unsure about this")
```

**Deliverable**: `ψ/fleet/pairing-taxonomy.md`

**Effort**: 4-6 hours

---

### 1.2 Pairing Protocol

Define **how pairs collaborate**:

```markdown
# Asymmetric Oracle Pairing Protocol

## Phase 1: Haiku Exploration (5-10 min)

**Haiku's Role**: Fast, broad perspective
- Task: "Explore 5-10 possible solutions to X"
- Constraints: 
  - 400-600 tokens max
  - ~5-10 min clock time
  - Output: structured list of options
- Depth: Low (1-2 sentence explanation per option)
- Goal: "What are all the angles I haven't considered?"

**Haiku Output Format**:
```
## Option 1: [Approach]
Brief rationale: [why this works]

## Option 2: [Approach]
Brief rationale: [why this works]

[... 3-8 more options]

## My Assessment
Promising angles: [1, 3, 5, 7]
Unlikely angles: [2, 4, 6, 8]
Unknown angles: [anything missing?]
```

## Phase 2: Sonnet Refinement (10-15 min)

**Sonnet's Role**: Deep, focused perspective
- Input: Haiku's option list
- Task: "Deep-dive on the promising angles"
- Constraints:
  - 1200-1500 tokens max
  - Focus on top 2-3 options
  - Output: detailed analysis + recommendation
- Depth: High (full reasoning for each option)
- Goal: "What's the BEST choice and why?"

**Sonnet Output Format**:
```
## Deep Analysis of Promising Options

### Option [Haiku's #1]
Detailed pros/cons: [...]
Implementation feasibility: [...]
Quality score: 8/10

### Option [Haiku's #3]
Detailed pros/cons: [...]
Implementation feasibility: [...]
Quality score: 9/10

## Recommendation
Option [#3] is best because [...]

## Implementation Notes
[How to execute the chosen option]
```

## Phase 3: Oracle Decision (2-5 min)

**Oracle's Role**: Choose and act
- Review both perspectives
- Pick best recommendation
- Decide: implement or escalate

**Total Time**: 20-30 min vs 45 min solo Sonnet
**Total Cost**: 2000 tokens vs 4000 tokens solo Sonnet
**Quality**: Often better (two perspectives, higher confidence)
```

**Deliverable**: `ψ/fleet/pairing-protocol.md` (full specification)

**Effort**: 6-10 hours

---

### 1.3 Pair Matching Algorithm

Define how to match oracles into pairs:

```python
def find_pairing(task_input):
    """
    Match oracle to best pairing partner (if pairing needed)
    """
    
    if not should_pair(task_input):
        return None  # Route solo
    
    requesting_oracle = task_input.oracle_role
    
    # Find oracle with complementary expertise
    pair_matches = {
        "luxi": ["stratum", "dheva"],        # UI pairs with architecture/backend
        "lens": ["tham", "stratum"],         # Analytics pairs with governance/arch
        "tham": ["dheva", "lens"],           # Governance pairs with implementation
        "dheva": ["stratum", "tham"],        # ERP pairs with architecture
        "stratum": ["luxi", "dheva"],        # Architecture pairs with implementation
        "verity": ["tham", "stratum"],       # Verification pairs with governance
        "omega": ["tham", "stratum"],        # Operations pairs with governance
    }
    
    candidates = pair_matches.get(requesting_oracle, [])
    
    # Score candidates by availability + expertise fit
    best_pair = None
    best_score = 0
    
    for candidate in candidates:
        availability = get_oracle_availability(candidate)
        expertise_fit = calculate_expertise_fit(
            task_input.category,
            candidate
        )
        
        score = availability * 0.4 + expertise_fit * 0.6
        
        if score > best_score:
            best_score = score
            best_pair = candidate
    
    return best_pair
```

**Deliverable**: `ψ/fleet/pairing-matching.md` (algorithm + examples)

**Effort**: 4-6 hours

---

## Phase 2: Pairing Infrastructure (Weeks 2-3)

### 2.1 Build Pairing Coordinator

Create tool that orchestrates pairings:

```python
# In ທาም's dispatch logic
def dispatch_complex_task(task_input):
    
    # Check if pairing makes sense
    if should_pair(task_input):
        pair_oracle = find_pairing(task_input)
        
        if pair_oracle:
            # Create pair work queue
            work_1 = {
                "oracle": task_input.oracle_role,
                "role": "explorer",  # Haiku role
                "prompt": format_exploration_prompt(task_input),
                "max_tokens": 600,
            }
            
            work_2 = {
                "oracle": pair_oracle,
                "role": "refiner",   # Sonnet role
                "prompt": None,  # Will be set after work_1
                "max_tokens": 1500,
                "depends_on": work_1,  # Sequential
            }
            
            # Execute work_1, get Haiku's options
            haiku_output = execute_work(work_1)
            
            # Format work_2 with Haiku's output
            work_2.prompt = format_refinement_prompt(
                task_input,
                haiku_output
            )
            
            # Execute work_2
            sonnet_output = execute_work(work_2)
            
            # Return combined result to oracle
            return combine_results(haiku_output, sonnet_output)
    
    # Fallback: solo routing (from Sprint 1)
    return route_solo(task_input)
```

**Deliverable**: Pairing coordinator implementation + integration

**Effort**: 8-12 hours

---

### 2.2 Monitoring & Feedback

Track pairing effectiveness:

```
Metrics to log per pairing:
- Oracle pair (e.g., Luxi + Stratum)
- Task complexity
- Haiku exploration time/cost
- Sonnet refinement time/cost
- Total cost (vs solo Sonnet baseline)
- Quality rating (1-10, oracle feedback)
- Outcome: accepted recommendation? escalated?
- Time savings: (solo_time - pair_time) / solo_time
```

**Deliverable**: Pairing analytics dashboard (in watchdog reports)

**Effort**: 4-6 hours

---

## Phase 3: Pilot Pairing (Weeks 3-4)

### 3.1 Select High-Value Pairing Candidates

Choose 3-5 oracle pairs to pilot:

1. **Lens + Tham** (Analytics + Governance)
   - Task type: "Analyze fleet health, recommend governance changes"
   - Frequency: Weekly (built-in testing)
   - Expected benefit: High (complementary perspectives)

2. **Dheva + Stratum** (ERP + Architecture)
   - Task type: "Design new ERP workflow within fleet architecture"
   - Frequency: As-needed (complex integrations)
   - Expected benefit: High (implementation + design)

3. **Luxi + Stratum** (UI + Architecture)
   - Task type: "Design scalable UI component library"
   - Frequency: Monthly (design reviews)
   - Expected benefit: Medium (both creative, but similar domains)

### 3.2 Pilot Metrics

Track pairing quality:

| Metric | Target | Method |
|--------|--------|--------|
| Cost savings (vs solo) | 35-50% | Compare solo baseline |
| Quality (1-10 score) | 8-9/10 | Oracle feedback |
| Time savings | 25-40% | Clock wall-time |
| Recommendation acceptance | 70-80% | Oracle follows guidance |
| Pair chemistry | Positive | Oracle comfort with partner |

**Deliverable**: Pilot results report

**Effort**: 2-3 weeks (pilot duration)

---

## Phase 4: Rollout & Refinement (Weeks 4-6)

### 4.1 Expand to All Oracles

Deploy pairing coordinator fleet-wide:
- Auto-detect pairing opportunities
- Let oracles opt-in to pairings
- Track all pairings, monitor quality
- Refine pairing matching if needed

### 4.2 Establish Pairing SLA

Define when pairing is expected:

```
Pairing SLA:
- Complexity >= 8/10: RECOMMENDED (default to pairing)
- Complexity 6-7/10 + high stakes: OPTIONAL (offer option)
- Complexity <= 5/10: NOT RECOMMENDED (solo routing)

Pairing overhead: +10-15 min wall-time (acceptable for high-value tasks)
Pairing cost: 2000-2200 tokens (vs 4000+ solo Sonnet)
```

---

## Success Criteria

| Metric | Target | Status |
|--------|--------|--------|
| Pairing adoption | 40% of complex tasks | To measure |
| Cost savings (paired) | 35-50% vs solo | To measure |
| Quality improvement | +3-5% on paired tasks | To measure |
| Pair chemistry | 70%+ satisfaction | To measure |
| Fleet-wide deployment | 100% after 4-6 weeks | To measure |

---

## Timeline

```
Week 9 (Jul 22-28) — Sprint 2 completion, S3 design prep

Week 10 (Jul 29 - Aug 4) — SPRINT 3 Week 1:
  Pairing taxonomy + protocol finalization
  Pairing matching algorithm design

Week 11 (Aug 5-11) — SPRINT 3 Week 2:
  Build pairing coordinator
  Integrate into ທาม dispatch logic
  Monitoring + analytics setup

Week 12 (Aug 12-18) — SPRINT 3 Week 3:
  Select pilot pairs (Lens+Tham, Dheva+Stratum, Luxi+Stratum)
  Run 3-5 pilot pairings per pair
  Collect feedback + metrics

Week 13 (Aug 19-25) — SPRINT 3 Week 4:
  Analyze pilot results
  Refine pairing matching if needed
  Fleet-wide rollout prep

Week 14-15 (Aug 26 - Sep 8) — SPRINT 3 Weeks 5-6:
  Gradual rollout to all oracles
  Monitoring + troubleshooting
  Establish SLA + maintenance cadence
```

**Go-Live**: ~Aug 26 (soft launch with pilots)  
**Full Deployment**: ~Sep 8 (all oracle pairs enabled)

---

## Cumulative Impact (All 3 Sprints)

```
Sprint 1 (Routing):      35% token savings
Sprint 2 (Pooling):    + 10% token savings  
Sprint 3 (Pairing):    + 15% token savings
─────────────────────────────────
Cumulative:              60% token savings total

Plus:
+ Fleet coherence improvements
+ Faster onboarding (Sprint 2 pool)
+ Higher quality on complex tasks (Sprint 3 pairing)
+ Knowledge retention (Sprint 2 pool)
```

---

**Document Status**: ✅ COMPLETE — Preview plan  
**Date**: 2026-06-05  
**Owner**: Zeus (design), ธาม (orchestration)

**Next Review**: After Sprint 1-2 completion (~late July)
