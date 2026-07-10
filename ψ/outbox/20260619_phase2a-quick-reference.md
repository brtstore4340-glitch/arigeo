---
title: Phase 2a Tasks — Quick Reference Card
date: 2026-06-19
format: one-page brief
---

# Phase 2a Tasks — Quick Reference (13 Fixes)

## CRITICAL PATH (Epiteles — 16h)

| Task | Fix | File | Effort | ROI | Status |
|---|---|---|---|---|---|
| 2a-001 | Conflict detection Set | coordination-board.js:361 | 4h | 50-70% | Ready, after Phase 1 |
| 2a-002 | Metadata cache + invalidation | coordination-board.js:444 | 6h | **13%/h** | Blocks on 2a-001 |
| 2a-003 | Board reload → parameter passing | coordination-board.js | 4h | 10-100x I/O | Ready, parallel to 2a-002 |
| 2a-006 | Extract conflict loop | coordination-board.js:449 | 2h | 50% getQueue | Blocks on 2a-001 |

## MEDIUM (Executor B — 14h, Parallel)

| Task | Fix | File | Effort | ROI | Status |
|---|---|---|---|---|---|
| 2a-004 | Sequential metadata batch | coordinator.ts:240 | 2h | +10-20% | After Phase 1 |
| 2a-009 | Lock backoff retry loop | blackboard.js:114 | 6h | -30-50% errors | **Early start** |
| 2a-010 | Lock cleanup runtime | blackboard.js:55 | 1h | -1KB/crash | **Early start** |
| 2a-012 | Artifact write batching | coordinator.ts:242 | 5h | 20-35% | After Phase 1 |

## QUICK WINS (Executor C — 6h, Early Start)

| Task | Fix | File | Effort | ROI | Status |
|---|---|---|---|---|---|
| 2a-007 | Carousel listener cleanup | carousel.tsx | 1h | -50KB/100R | **Start now** |
| 2a-008 | Dependency traversal dedup | coordination-board.js:302 | 2h | Prevents explosion | **Start now** |
| 2a-011 | Regex precompilation | contract-enforcer.js:86 | 1h | Negligible | **Start now** |
| 2a-013 | Array spread → push/GC | coordinator.ts | 2h | 90% heap | **Start now** |

---

## TIMELINE AT A GLANCE

```
Phase 1 (ongoing)          → Gate 1: All 3 Phase 1 fixes merge
                              ↓
Early Start (parallel)     → Executor C: 2a-007, 2a-008, 2a-011, 2a-013 (6h)
to Phase 1 review             Executor B: 2a-009, 2a-010 (7h)
                              ↓ (Phase 1 review proceeding in parallel)
Phase 2a Critical Path     → Day 0: Phase 1 merges + Epiteles starts 2a-001
(upon Phase 1 merge)          Days 1-4: Serial chain 2a-001 → 2a-002 → 2a-006
                              Days 2-7: Executor B parallel (2a-004, 2a-012)
                              ↓
                           → Day 7-9: Integration + benchmarking
                              ↓
                           → All 13 PRs merged to feat/hermes-phase-1-decisions
```

**Total**: 9-12 calendar days (3 executors, 60% parallelism)

---

## EXPECTED OUTCOMES

### Latency Targets (Cumulative)
- Phase 1 alone: 40-60% reduction
- Phase 1 + Phase 2a: **85-90% reduction**
- getQueue() specific: 500ms → 100ms (80%)

### Resource Targets
- File I/O: **10-100x fewer reads** (board caching + params)
- Heap/GC: **-40-60% pressure** (array GC + artifact batching)
- Lock contention: **-30-50% errors** (backoff retry)
- Listeners: **-50 KB/carousel/100 renders**

### Code Quality Gates
- Unit tests: ≥95% coverage (critical path)
- Regression tests: 100% pass
- Benchmarks: Phase 1 + Phase 2 cumulative measured
- Code review: Epiteles sign-off required

---

## DECISION CHECKLIST FOR THAM-ZEUS

Before dispatch:

- [ ] Scope confirmed: Phase 2a = 13 fixes (#1-#4, #7-#13), defer #5 to Phase 3
- [ ] Team assigned: 3 executors (Epiteles + 2 others)
- [ ] Timeline confirmed: 9-12 calendar days
- [ ] Early start approved: Begin 2a-007, 2a-008, 2a-011, 2a-013, 2a-009, 2a-010 during Phase 1 review
- [ ] Phase 1 gate understood: All 3 Phase 1 fixes must merge before Phase 2a critical path
- [ ] ROI accepted: 85-90% cumulative latency reduction for 44h effort
- [ ] Risk mitigation understood: #2 (cache invalidation) is highest risk; requires canary rollout

---

## FILE LOCATIONS

**Full Tickets**: `/route/mission-control/ψ/outbox/20260619_phase2a-task-tickets.md`

**Individual Tasks**: Create GitHub PRs from ticket template above

**Branch**: All Phase 2a work → `feat/hermes-phase-1-decisions` (same branch as Phase 1)

**Gate**: Phase 2a PRs only merge AFTER Phase 1 (all 3 fixes) merged

---

## CONTACT & ESCALATION

**Lead**: Epiteles (critical path owner)  
**Executor B**: Locking + batching  
**Executor C**: Quick wins  
**Governor**: ธาม-Zeus (approval, gates, merges)

**Blockers**: Escalate to ธาม-Zeus inbox immediately  
**Status**: Daily sync via execution team channel

---

**Created**: 2026-06-19 07:52 +07  
**Status**: Ready for dispatch and assignment
