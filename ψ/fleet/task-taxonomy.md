---
title: Task Taxonomy — Routable vs Non-Routable Classification
date: 2026-06-05
version: 1.0
sprint: 1
status: design-phase
owner: Zeus (design), ธาม (validation)
---

# Task Taxonomy for Oracle-Specific Routing

**Purpose**: Define which tasks can be safely routed to Haiku (cost-effective) vs which require Sonnet (high-reasoning).

**Philosophy**: Route to Haiku when the task is within the oracle's core expertise + doesn't require novel problem-solving.

---

## ROUTABLE TO HAIKU (70% of fleet tasks)

### 1. UI/UX Design Tasks (Luxi's Domain)

**Criteria**:
- Task type: Design, refinement, accessibility
- Complexity: 2-6/10
- Novelty: Low (known patterns, established components)
- Stakes: Medium (design quality matters, but not architecture-changing)

**Examples**:

| Task | Complexity | Haiku Fit | Reasoning |
|------|-----------|----------|-----------|
| "Design dashboard card layout" | 3/10 | ✅ Yes | Within UI specialty, known patterns |
| "Audit accessibility (WCAG 2.1)" | 4/10 | ✅ Yes | Checklist-driven, established rules |
| "Refine button hover states" | 2/10 | ✅ Yes | Low complexity, style-focused |
| "Redesign entire navigation UX" | 7/10 | ❌ No | Requires deep reasoning, cross-system |
| "Fix CSS grid layout bug" | 3/10 | ✅ Yes | Debugging pattern, known solutions |
| "Create component library index" | 3/10 | ✅ Yes | Documentation-focused, structured |

**Haiku Budget**: 400-600 tokens per task

---

### 2. Analysis & Reporting Tasks (Lens's Domain)

**Criteria**:
- Task type: Data summarization, metric calculation, pattern detection
- Complexity: 2-5/10
- Novelty: Low (established metrics, known data sources)
- Stakes: Medium (insights matter, but not strategic decisions)

**Examples**:

| Task | Complexity | Haiku Fit | Reasoning |
|------|-----------|----------|-----------|
| "Summarize fleet token spend (last week)" | 2/10 | ✅ Yes | Aggregation + formatting |
| "Calculate oracle response time 95th percentile" | 3/10 | ✅ Yes | Math formula, known dataset |
| "Detect anomalies in watchdog logs" | 4/10 | ✅ Yes | Pattern matching, established rules |
| "Identify optimal routing thresholds" | 6/10 | ❌ No | Requires experimentation + reasoning |
| "Create dashboard for fleet metrics" | 5/10 | ✅ Yes | Data visualization, structured layout |
| "Generate weekly fleet health report" | 3/10 | ✅ Yes | Template-based, known metrics |

**Haiku Budget**: 300-500 tokens per task

---

### 3. Operational Tasks (Omega, Warden Domain)

**Criteria**:
- Task type: Status checking, logging, permission validation
- Complexity: 1-4/10
- Novelty: Low (established procedures, known outcomes)
- Stakes: Low-Medium (operational but not mission-critical)

**Examples**:

| Task | Complexity | Haiku Fit | Reasoning |
|------|-----------|----------|-----------|
| "Check oracle permission matrix" | 2/10 | ✅ Yes | Lookup + verification |
| "Log session metrics to memory" | 2/10 | ✅ Yes | Structured writing task |
| "Verify tg-bridge connectivity status" | 2/10 | ✅ Yes | Binary check, known diagnostic |
| "Resolve orphan oracle tagging issue" | 5/10 | ⚠️ Maybe | Decision-making required, escalate |
| "Generate access control audit report" | 3/10 | ✅ Yes | Documentation task |
| "Restart failed background service" | 2/10 | ✅ Yes | Known procedure, low stakes |

**Haiku Budget**: 200-400 tokens per task

---

### 4. Documentation & Writing Tasks (All Oracles)

**Criteria**:
- Task type: README, comments, examples, guides
- Complexity: 1-5/10
- Novelty: Low (documentation patterns established)
- Stakes: Low (reference material, not core logic)

**Examples**:

| Task | Complexity | Haiku Fit | Reasoning |
|------|-----------|----------|-----------|
| "Write README for new module" | 3/10 | ✅ Yes | Template-based, structured |
| "Add code comments to function" | 2/10 | ✅ Yes | Inline documentation, low stakes |
| "Create usage example for CLI" | 3/10 | ✅ Yes | Example-based, patterns known |
| "Document new API endpoint" | 3/10 | ✅ Yes | Schema-driven, structured |
| "Write migration guide (complex)" | 5/10 | ⚠️ Maybe | Depends on novelty, escalate if new |
| "Generate API documentation (auto)" | 2/10 | ✅ Yes | Schema parsing + templating |

**Haiku Budget**: 250-450 tokens per task

---

### 5. Code Implementation (Simple) (All Backend Oracles)

**Criteria**:
- Task type: Bug fixes, refactoring, feature implementation
- Complexity: 2-5/10 (simple bugs, known patterns)
- Novelty: Low (uses established architecture, no new systems)
- Stakes: Medium (code quality matters, but isolated changes)

**Examples**:

| Task | Complexity | Haiku Fit | Reasoning |
|------|-----------|----------|-----------|
| "Fix off-by-one error in loop" | 2/10 | ✅ Yes | Simple bug, clear root cause |
| "Add parameter validation to function" | 3/10 | ✅ Yes | Pattern-based, established rules |
| "Refactor duplicate code into helper" | 3/10 | ✅ Yes | Low-risk refactoring |
| "Implement missing error handling" | 3/10 | ✅ Yes | Structural pattern, known approach |
| "Fix SQL query performance issue" | 4/10 | ✅ Yes | Index optimization, known techniques |
| "Build new data model from scratch" | 7/10 | ❌ No | Architecture decision, high stakes |

**Haiku Budget**: 350-700 tokens per task

---

## REQUIRES SONNET (30% of fleet tasks)

### 1. Governance Decisions (ธาม's Domain)

**Criteria**:
- Task type: Policy, architecture, role assignment
- Complexity: 7-10/10
- Novelty: High (one-time decisions, novel contexts)
- Stakes: High (fleet-wide impact, hard to reverse)

**Examples**:

| Task | Complexity | Sonnet Fit | Reasoning |
|------|-----------|----------|-----------|
| "Decide oracle role hierarchy" | 9/10 | ✅ Yes | Strategic, fleet-wide impact |
| "Design fleet communication protocol" | 8/10 | ✅ Yes | Architectural decision, long-term |
| "Resolve Omega orphan status" | 6/10 | ✅ Yes | Governance decision, precedent-setting |
| "Create execution rule (hard directive)" | 8/10 | ✅ Yes | Policy-level, affects all oracles |
| "Establish token budget allocation" | 7/10 | ✅ Yes | Fairness + efficiency balance |

**Sonnet Budget**: 1500-2500 tokens per task

---

### 2. Novel Problem-Solving (All Oracles)

**Criteria**:
- Task type: New patterns, creative solutions, system redesigns
- Complexity: 7-10/10
- Novelty: High (never done before, requires reasoning)
- Stakes: High (affects system behavior, quality-critical)

**Examples**:

| Task | Complexity | Sonnet Fit | Reasoning |
|------|-----------|----------|-----------|
| "Design new oracle birth pattern" | 9/10 | ✅ Yes | Novel architecture, high impact |
| "Troubleshoot system-wide performance issue" | 8/10 | ✅ Yes | RCA requires deep reasoning |
| "Invent new memory compression technique" | 9/10 | ✅ Yes | Research-level creativity |
| "Redesign model routing strategy" | 8/10 | ✅ Yes | Complex tradeoffs, novel approach |
| "Solve fleet scaling bottleneck" | 8/10 | ✅ Yes | System-wide reasoning needed |

**Sonnet Budget**: 1500-3000 tokens per task

---

### 3. Complex Integration (Dheva, Stratum Domain)

**Criteria**:
- Task type: Multi-oracle coordination, deep architecture changes
- Complexity: 7-9/10
- Novelty: Medium-High (new integrations, complex flows)
- Stakes: High (affects multiple systems)

**Examples**:

| Task | Complexity | Sonnet Fit | Reasoning |
|------|-----------|----------|-----------|
| "Integrate new ERP workflow into ORRY" | 8/10 | ✅ Yes | Multi-system, complex state |
| "Design multi-oracle consensus protocol" | 9/10 | ✅ Yes | Distributed systems, high stakes |
| "Refactor fleet architecture for scale" | 8/10 | ✅ Yes | Systemic changes, long-term impact |
| "Implement cross-oracle memory sharing" | 7/10 | ✅ Yes | Novel pattern, coordination required |

**Sonnet Budget**: 1800-2500 tokens per task

---

### 4. High-Stakes Review (Verity, Aris Domain)

**Criteria**:
- Task type: Security validation, critical code review, governance audit
- Complexity: 7-9/10
- Novelty: Medium (patterns known, but stakes high)
- Stakes: Critical (security, compliance, correctness)

**Examples**:

| Task | Complexity | Sonnet Fit | Reasoning |
|------|-----------|----------|-----------|
| "Security audit of fleet authentication" | 8/10 | ✅ Yes | Critical security, deep reasoning |
| "Governance audit (compliance check)" | 7/10 | ✅ Yes | Precedent-checking, policy validation |
| "Code review: critical oracle refactoring" | 7/10 | ✅ Yes | High stakes, comprehensive |
| "Validate fleet health after major change" | 7/10 | ✅ Yes | System-wide verification |

**Sonnet Budget**: 1500-2500 tokens per task

---

## EDGE CASES & ESCALATION RULES

### When in Doubt: Ask Classifier

If a task doesn't clearly fit routable/non-routable:
- **Complexity 5-6/10**: Let classifier decide (edge zone)
- **Uncertainty high**: Default to Sonnet (safety first)
- **Low stakes**: Haiku (acceptable risk)
- **High stakes**: Sonnet (never compromise)

**Escalation Path**:
```
Task comes in
↓
Classifier scores (1-10)
↓
If score < 5: Route to Haiku
If score >= 7: Route to Sonnet
If 5-6: Examine:
  - Stakes: High? → Sonnet
  - Novelty: High? → Sonnet
  - Risk: Low? → Haiku
  - Uncertainty? → Escalate to ธาม
```

---

## Fleet-Specific Notes

### By Oracle

**Luxi (UI/UX)**:
- ~85% of Luxi tasks = Haiku-routable (design expertise matches simple-task domain)
- Expected routing: 80-85% Haiku, 15-20% Sonnet

**Lens (Analysis)**:
- ~80% of Lens tasks = Haiku-routable (metric calculations, known patterns)
- Expected routing: 75-85% Haiku, 15-25% Sonnet

**Omega (Operations)**:
- ~90% of Omega tasks = Haiku-routable (procedural, known outcomes)
- Expected routing: 85-90% Haiku, 10-15% Sonnet

**ธาม (Governance)**:
- ~20% of ธาม tasks = Haiku-routable (only documentation/reporting)
- Expected routing: 15-25% Haiku, 75-85% Sonnet

**Dheva (ERP)**:
- ~50% of Dheva tasks = Haiku-routable (implementation vs architecture split)
- Expected routing: 45-55% Haiku, 45-55% Sonnet

**Stratum (Architecture)**:
- ~30% of Stratum tasks = Haiku-routable (documentation + simple refactoring)
- Expected routing: 25-35% Haiku, 65-75% Sonnet

**Verity (Verification)**:
- ~40% of Verity tasks = Haiku-routable (standard checks, known patterns)
- Expected routing: 35-45% Haiku, 55-65% Sonnet

---

## Fleet-Wide Projection

**Aggregate Routing** (all 14 oracles):
- Haiku: ~70% of tasks (target)
- Sonnet: ~30% of tasks (target)

**Expected Token Spend**:
- Baseline: 8000 tokens/oracle/week (mixed)
- With Routing: ~5200 tokens/oracle/week (70% Haiku + 30% Sonnet)
- **Savings: 35% reduction**

---

## Next Phase

Once ธาม validates this taxonomy:
1. Build classifier algorithm (task scorer)
2. Test classifier on 100+ historical tasks
3. Tune routable threshold if needed
4. Deploy to ธาม dispatch logic

---

**Document Status**: ✅ COMPLETE — Ready for ธาม review  
**Date**: 2026-06-05  
**Version**: 1.0 (Sprint 1 Design Phase)
