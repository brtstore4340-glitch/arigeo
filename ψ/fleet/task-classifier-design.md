---
title: Task Classifier Design — Complexity Scoring Algorithm
date: 2026-06-05
sprint: 1
version: 1.0
status: design-phase
owner: Zeus (design), ธาม (implementation)
---

# Task Classifier Algorithm Design

**Purpose**: Score task complexity (1-10) to determine Haiku vs Sonnet routing.

**Target Accuracy**: >90% on known tasks, <5% misclassification rate

---

## Scoring Framework

### Input Signals

```python
class TaskClassification:
    description: str          # Task text
    oracle_role: str          # Requesting oracle (luxi, tham, etc.)
    task_category: str        # UI, analysis, governance, etc.
    historical_tasks: List    # Similar past tasks + their complexity
    novelty_indicators: List  # Keywords: "new", "first", "never"
    stakes_indicators: List   # Keywords: "critical", "security", "fleet-wide"
    domain_fit: float         # 0-1: How well does task match oracle's specialty?
```

### Output

```python
class ClassificationResult:
    complexity_score: float   # 1-10 (higher = more complex)
    recommendation: str       # "HAIKU" | "SONNET" | "PAIR"
    confidence: float         # 0-1 (how certain is this classification?)
    reasoning: str            # Explanation for human review
```

---

## Scoring Algorithm (Pseudo-Code)

```python
def classify_task(task_input: TaskClassification) -> ClassificationResult:
    
    # Start with base complexity
    complexity_score = 5.0  # Neutral baseline
    
    # === SIGNAL 1: Task Category & Oracle Role ===
    # Routable categories (lower complexity baseline)
    routable_categories = {
        "ui_design": 3,           # Low complexity baseline
        "analysis": 3,
        "documentation": 2,
        "operations": 2,
        "simple_code": 3,
    }
    
    # Non-routable categories (higher complexity baseline)
    non_routable_categories = {
        "governance": 8,          # High complexity baseline
        "novel_solution": 8,
        "integration": 7,
        "security_review": 7,
    }
    
    if task_input.task_category in routable_categories:
        complexity_score = routable_categories[task_input.task_category]
    elif task_input.task_category in non_routable_categories:
        complexity_score = non_routable_categories[task_input.task_category]
    
    # === SIGNAL 2: Oracle Role Adjustment ===
    # Some oracles naturally handle harder tasks
    oracle_complexity_boost = {
        "tham": +1.5,        # Governance oracle (handles harder tasks)
        "stratum": +1.0,     # Architecture oracle
        "verity": +1.0,      # Verification oracle
        "dheva": +0.5,       # ERP oracle
        "luxi": -0.5,        # UI oracle (lower baseline)
        "lens": -0.5,        # Analytics oracle (lower baseline)
        "omega": -1.0,       # Operations oracle (lower baseline)
    }
    
    if task_input.oracle_role in oracle_complexity_boost:
        complexity_score += oracle_complexity_boost[task_input.oracle_role]
    
    # === SIGNAL 3: Novelty Indicators ===
    # Keywords indicating new/unexplored territory
    novelty_keywords = ["new", "first", "never", "design", "invent", 
                        "create", "rethink", "redesign"]
    novelty_count = sum(1 for kw in novelty_keywords 
                        if kw in task_input.description.lower())
    
    if novelty_count > 0:
        complexity_score += novelty_count * 1.5  # Each novelty signal adds 1.5
    
    # === SIGNAL 4: Stakes Indicators ===
    # High-stakes tasks need more reasoning
    high_stakes_keywords = ["critical", "security", "fleet-wide", "compliance",
                           "governance", "architecture", "essential"]
    stakes_count = sum(1 for kw in high_stakes_keywords 
                       if kw in task_input.description.lower())
    
    if stakes_count > 0:
        complexity_score += stakes_count * 1.0  # Each stakes signal adds 1.0
    
    # === SIGNAL 5: Historical Similarity ===
    # Similar past tasks indicate complexity
    if task_input.historical_tasks:
        similar_tasks = find_similar_tasks(
            task_input.description,
            task_input.historical_tasks,
            threshold=0.7  # Similarity threshold
        )
        
        if similar_tasks:
            avg_complexity = mean([t.complexity for t in similar_tasks])
            # Anchor to historical average (80% weight on history)
            complexity_score = (complexity_score * 0.2) + (avg_complexity * 0.8)
    
    # === SIGNAL 6: Domain Fit ===
    # Tasks perfectly aligned with oracle's specialty are simpler
    domain_fit = calculate_domain_fit(
        task_input.task_category,
        task_input.oracle_role
    )
    
    # High domain fit (0.8-1.0) → reduce complexity by 1-2
    # Low domain fit (0.0-0.3) → increase complexity by 1-2
    if domain_fit > 0.8:
        complexity_score -= 1.5
    elif domain_fit > 0.6:
        complexity_score -= 0.5
    elif domain_fit < 0.3:
        complexity_score += 2.0
    
    # === FINAL ADJUSTMENTS ===
    # Clamp to 1-10 range
    complexity_score = max(1.0, min(10.0, complexity_score))
    
    # === DECISION THRESHOLDS ===
    if complexity_score <= 5.0:
        recommendation = "HAIKU"
        confidence = 0.95
    elif complexity_score >= 7.0:
        recommendation = "SONNET"
        confidence = 0.92
    else:  # 5-7 range (edge cases)
        # Examine stakes + novelty
        if stakes_count > 0 or novelty_count > 1:
            recommendation = "SONNET"
            confidence = 0.75
        elif domain_fit > 0.7:
            recommendation = "HAIKU"
            confidence = 0.70
        else:
            # Asymmetric pairing for uncertain cases
            recommendation = "PAIR"
            confidence = 0.65
    
    # === REASONING TEXT ===
    reasoning = f"""
    Category: {task_input.task_category} (base: {routable_categories.get(task_input.task_category, 'unknown')})
    Oracle: {task_input.oracle_role} (boost: {oracle_complexity_boost.get(task_input.oracle_role, 0)})
    Novelty: {novelty_count} signals (+{novelty_count * 1.5})
    Stakes: {stakes_count} signals (+{stakes_count * 1.0})
    Domain Fit: {domain_fit:.2f} (adjustment: {-1.5 if domain_fit > 0.8 else 0})
    Final Score: {complexity_score:.1f}/10
    Recommendation: {recommendation} (confidence: {confidence:.0%})
    """
    
    return ClassificationResult(
        complexity_score=complexity_score,
        recommendation=recommendation,
        confidence=confidence,
        reasoning=reasoning.strip()
    )
```

---

## Calibration Examples

Test classifier on known tasks (validation set):

### Example 1: Simple UI Task (Should → HAIKU)

**Input**:
```
description: "Design dashboard card layout for metrics display"
oracle_role: "luxi"
task_category: "ui_design"
novelty_indicators: []
stakes_indicators: []
domain_fit: 0.95
```

**Scoring**:
- Base (ui_design): 3.0
- Oracle boost (luxi): -0.5
- Novelty: 0 (no keywords)
- Stakes: 0 (no keywords)
- Domain fit (0.95): -1.5
- **Final: 0.0 → clamped to 1.0**

**Result**: ✅ HAIKU (confidence: 95%)

---

### Example 2: Novel Governance Decision (Should → SONNET)

**Input**:
```
description: "Design new oracle role hierarchy for fleet scaling"
oracle_role: "tham"
task_category: "governance"
novelty_indicators: ["new", "design"]
stakes_indicators: ["fleet-wide", "critical"]
domain_fit: 0.9
historical_tasks: []  # No similar tasks (novel)
```

**Scoring**:
- Base (governance): 8.0
- Oracle boost (tham): +1.5
- Novelty: 2 keywords (+3.0)
- Stakes: 2 keywords (+2.0)
- Domain fit (0.9): -1.5
- **Final: 13.0 → clamped to 10.0**

**Result**: ✅ SONNET (confidence: 92%)

---

### Example 3: Edge Case: Refactoring (Should → PAIR or Escalate)

**Input**:
```
description: "Refactor fleet memory architecture for better performance"
oracle_role: "stratum"
task_category: "integration"
novelty_indicators: ["refactor"]
stakes_indicators: ["critical"]
domain_fit: 0.7
historical_tasks: [similar_past_task(complexity=6.5)]
```

**Scoring**:
- Base (integration): 7.0
- Oracle boost (stratum): +1.0
- Novelty: 1 keyword (+1.5)
- Stakes: 1 keyword (+1.0)
- Domain fit (0.7): -0.5
- Historical: avg=6.5 → (7.5 * 0.2 + 6.5 * 0.8) = 6.7
- **Final: 6.7 (edge zone)**

**Decision Tree**:
- Stakes > 0? YES → SONNET
- **Result**: ✅ SONNET (confidence: 75%)

---

## Testing Strategy

### Phase 1: Calibration (Week 1)

1. Collect 100+ historical tasks from fleet
2. Manually label each with "actual complexity" (1-10)
3. Run classifier on all 100 tasks
4. Compare classifier scores to manual labels
5. Calculate accuracy metrics:
   - MAE (mean absolute error): target <0.5
   - Misclassification rate: target <5%
   - Confidence calibration: target >80% accuracy at 80% confidence

### Phase 2: Validation (Week 2)

1. Test on new 20-30 tasks (holdout set)
2. Get oracle feedback (did Haiku work for this task?)
3. Refine algorithm if needed
4. Update thresholds based on pilot data

### Phase 3: Monitoring (Ongoing)

1. Log all task classifications + actual results
2. Track: "Was this classified correctly?"
3. Monthly recalibration with new data
4. Feedback loop: ធាម can override classification + provide feedback

---

## Tunable Parameters

Classifier has these knobs for fine-tuning:

```python
CLASSIFIER_CONFIG = {
    # Thresholds
    "haiku_threshold": 5.0,        # Score <= this → HAIKU
    "sonnet_threshold": 7.0,       # Score >= this → SONNET
    
    # Weights
    "novelty_weight": 1.5,         # How much novelty signals matter
    "stakes_weight": 1.0,          # How much stakes signals matter
    "domain_fit_weight": 1.5,      # How much domain fit matters
    "history_weight": 0.8,         # How much historical data matters
    
    # Confidence thresholds
    "min_confidence_haiku": 0.70,  # Don't route below this confidence
    "min_confidence_sonnet": 0.75,
    
    # Fallback behavior
    "edge_case_strategy": "PAIR",  # What to do for 5-7 range
    "unknown_strategy": "ESCALATE", # What to do if no data
}
```

---

## Integration Points

### Where Classifier Runs

1. **ធាម's Dispatch Logic** (primary)
   - Task arrives → ធាម checks if auto-route or escalate
   - Classifier scores task
   - Route to Haiku/Sonnet/escalate

2. **Luxi/Lens/Omega Inbox** (awareness)
   - Pilot oracles can see classification + confidence
   - Feedback loop: "classifier got this wrong"

3. **Watchdog Monitoring** (validation)
   - Watchdog logs all classifications
   - Tracks: "Did Haiku succeed on this task?"
   - Monthly accuracy report to Zeus

---

## Next Steps (After ທาម Review)

1. Implement classifier in Python (using task taxonomy)
2. Build test dataset (100+ historical tasks)
3. Run calibration tests
4. Tune parameters (thresholds, weights)
5. Deploy to pilot oracles (Week 2)
6. Collect feedback + refine

---

**Document Status**: ✅ COMPLETE — Ready for implementation  
**Date**: 2026-06-05  
**Owner**: Zeus (design), ธาม (implementation)
