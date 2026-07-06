---
from: tham-zeus
to: epiteles
subject: Phase 2a Execution Briefing — 13 Task Tickets Ready for Planning
priority: HIGH
date: 2026-06-19
time: 07:53 +07
phase: Phase 2a (Performance Optimization Sprint)
effort-total: 44 hours (Epiteles: 16h critical path)
timeline: 9-12 calendar days
team-size: 3 executors (Epiteles lead + Executor B + Executor C)
---

# Phase 2a Execution Briefing for Epiteles

**Sender**: ธาม-Zeus (Chief of Staff)  
**Receiver**: Epiteles (Implementation Executor)  
**Status**: Ready for execution planning  
**Authority**: Governor approval + execution authority transferred

---

## Mission Overview

Execute Phase 2a of performance optimization sprint:
- **13 fixes** identified across coordination, storage, UI, and locking layers
- **44 hours** total effort (Epiteles: 16h critical path)
- **9-12 calendar days** timeline with 3 executors and 60% parallelism
- **Expected outcome**: 85-90% cumulative latency reduction (Phase 1 + Phase 2a combined)

---

## Your Role

**Epiteles = Critical Path Owner**

You own the highest-ROI, most complex fixes on the critical path:

| Task | File | Effort | Dependency | ROI |
|---|---|---|---|---|
| **2a-001** | Conflict Set (coordination-board.js) | 4h | none | 50-70% |
| **2a-002** | Metadata Cache (coordination-board.js) | 6h | 2a-001 | **13%/h** |
| **2a-003** | Board Reload (coordination-board.js) | 4h | Phase 1 merge | 10-100x I/O |
| **2a-006** | Extract Loop (coordination-board.js) | 2h | 2a-001 | 50% getQueue |

**Total Your Effort**: 16 hours, serial chain with 2 parallel tracks

---

## Execution Sequence

### Phase 1 Blocker (Prerequisite)
All 3 Phase 1 fixes must merge to `feat/hermes-phase-1-decisions` before your Phase 2a critical path starts.

Status: Epiteles executing Phase 1 fixes (inFlightRuns leak, sequential file I/O, O(n³) task ordering)

**Gate**: When Phase 1 all 3 complete → Phase 2a critical path begins

### Phase 2a Timeline (Your Responsibility)

```
Day 0 (Phase 1 merges):
  - You: START 2a-001 (Conflict Set, 4h)
  - Executor B: Start 2a-004 + 2a-012 (parallel batching, 7h)
  - Executor C: Finalize early-start PRs (2a-007, 2a-008, 2a-011, 2a-013)

Day 1 (2a-001 complete):
  - You: START 2a-002 (Metadata Cache, 6h, depends on 2a-001)
  - Executor B: Continue parallel batching
  - Code reviews: 2a-001 benchmark validation

Day 2 (2a-002 underway):
  - You: START 2a-003 (Board Reload, 4h, parallel to 2a-002)
  - Executor B: Finalize batching PRs
  - Executor C: Early-start PRs ready for merge

Day 3 (2a-003 complete):
  - You: START 2a-006 (Extract Loop, 2h, depends on 2a-001)
  - Executor B: Integration testing
  - Lead: PR reviews + merge coordinating

Day 4-7:
  - You: Finalize 2a-006 + code reviews
  - Executor B: Final benchmarking + merge coordination
  - Lead: Orchestrate all merges to feat/hermes-phase-1-decisions

Expected Complete: Day 7-9 (accounting for weekends, reviews, overhead)
```

---

## Critical Path Details

### Task 2a-001: O(n²) Conflict Detection → Set-Based Lookup

**File**: `ai-orchestrator/src/coordination-board.js` (lines 361-377)  
**Effort**: 4 hours  
**Complexity**: Medium (straightforward refactor)

**Problem**:
```javascript
for (const filePath of task.files) {
  for (const otherTaskId of tasksWritingToFile) {
    if (board.running_tasks.includes(otherTaskId)) {  // O(n) per compare
      conflicts.push({...})
    }
  }
}
```
Complexity: O(F × T × R). `includes()` is O(n) array scan.

**Fix**:
```javascript
const runningSet = new Set(board.running_tasks)  // O(1) lookup
for (const filePath of task.files) {
  for (const otherTaskId of tasksWritingToFile) {
    if (!runningSet.has(otherTaskId)) continue    // O(1)
    conflicts.push({...})
  }
}
```

**Testing Required**:
- Unit test: Set membership works for circular deps, self-conflicts
- Fuzz test: Random task/file/running combinations
- Benchmark: Conflict detection time (100 vs 1000 vs 10000 tasks)

**Expected Outcome**: 50-70% latency reduction

**Definition of Done**: Code + tests + benchmark + PR merged

---

### Task 2a-002: Metadata Cache + Invalidation Strategy

**File**: `ai-orchestrator/src/coordination-board.js` (lines 444-462)  
**Effort**: 6 hours  
**Complexity**: Medium-High (cache invalidation is hard)

**Problem**:
```javascript
return board.task_order.map((taskId) => ({
  dependencies_met: areDependenciesMet(taskId, board),    // O(n) per task
  conflicts: detectConflicts(taskId, board),              // O(n) per task (now O(1) after 2a-001)
}))
```
Called frequently (100+ times per session). No caching. 100 tasks = 200 expensive operations.

**Fix Strategy**:
1. Add cache object to board:
```javascript
board._metadataCache = {
  task_metadata: new Map(),     // taskId → {dependencies_met, conflicts}
  invalidated: new Set()         // Tasks needing refresh
}
```

2. Lazy-compute on access:
```javascript
getTaskMetadata(taskId, board) {
  if (board._metadataCache.task_metadata.has(taskId)) {
    return board._metadataCache.task_metadata.get(taskId)
  }
  const metadata = {
    dependencies_met: areDependenciesMet(taskId, board),
    conflicts: detectConflicts(taskId, board)
  }
  board._metadataCache.task_metadata.set(taskId, metadata)
  return metadata
}
```

3. Invalidate on state change:
```javascript
// In updateTaskStatus(), addTask(), deleteTask():
board._metadataCache.invalidated.add(taskId)
// + cascade invalidate dependent tasks
```

**Testing Required** (CRITICAL - cache invalidation is error-prone):
- Unit test: Cache hit/miss correctness
- State transition test: Verify invalidation on add/delete/status-change
- Consistency test: Cached result == computed result (100% fidelity)
- Load test: 1000 getQueue() calls with varying task counts
- Concurrency test: No corruption under simultaneous task updates
- Benchmark: 500ms → 100ms for 100+ tasks

**Expected Outcome**: 70-80% latency reduction in getQueue() + listBlockedTasks()

**Definition of Done**: Code + all tests passing + benchmark proof + PR merged

**Note**: This is the **highest-risk fix** in Phase 2a. Requires:
- Comprehensive state transition tests
- Cache validation logs (optional: can add debug mode)
- Canary rollout (test with small task counts first)

---

### Task 2a-003: Board Reload → Parameter Passing

**File**: `ai-orchestrator/src/coordination-board.js` (throughout)  
**Effort**: 4 hours  
**Complexity**: Medium (mechanical refactor, low risk)

**Problem**:
```javascript
// Current: every function reloads board independently
getQueue() {
  const board = loadBoard()  // Disk read #1
  return board.task_order.map(taskId => {
    detectConflicts(taskId, board)  // Calls loadBoard() again = Disk read #2, #3, etc.
  })
}
```
`getQueue()` with 100 tasks = 101 disk reads (1 + 100 in loop).

**Fix**:
Pass loaded board as parameter:
```javascript
getQueue(board = null) {
  if (!board) board = loadBoard()  // Load once
  return board.task_order.map(taskId => ({
    dependencies_met: areDependenciesMet(taskId, board),  // Use passed board
    conflicts: detectConflicts(taskId, board)             // Use passed board
  }))
}

// All helper functions accept board parameter:
detectConflicts(taskId, board) {
  // Use board, no reload
  for (const filePath of board.tasks[taskId].files) {
    // ...
  }
}
```

**Testing Required**:
- Unit test: All functions work with passed board
- Integration test: Board state consistency across multiple calls
- Benchmark: File I/O count before/after (expect 10-100x reduction)
- Load test: 100+ concurrent operations

**Expected Outcome**: 10-100x fewer disk reads

**Definition of Done**: All functions accept board + call sites updated + benchmark + PR merged

---

### Task 2a-006: Extract Conflict Detection from Loop

**File**: `ai-orchestrator/src/coordination-board.js` (lines 449, 462)  
**Effort**: 2 hours  
**Complexity**: Low (mechanical extraction, depends on 2a-001)

**Problem**:
Even with Set-based lookup (2a-001), loop still repeats work:
```javascript
return board.task_order.map((taskId) => ({
  conflicts: detectConflicts(taskId, board)  // Called N times
}))
```

**Fix**:
Precompute conflicts once, then map:
```javascript
// Compute conflicts once
const conflictsByTask = new Map()
for (const taskId of board.task_order) {
  conflictsByTask.set(taskId, detectConflicts(taskId, board))
}

// Then map (just lookup)
return board.task_order.map((taskId) => ({
  conflicts: conflictsByTask.get(taskId)
}))
```

Or: Cache via Task 2a-002 (Metadata Cache).

**Testing Required**:
- Unit test: Conflict map correctness
- Benchmark: Latency before/after extraction

**Expected Outcome**: 50% latency reduction within getQueue()

**Definition of Done**: Refactored + benchmark + PR merged

---

## Support & Coordination

### Executor B (Mid-Level)
Handles parallel tracks:
- 2a-004 (Sequential metadata batch, 2h) — after Phase 1
- 2a-009 (Lock backoff, 6h) — early start
- 2a-010 (Lock cleanup, 1h) — early start
- 2a-012 (Artifact batching, 5h) — after Phase 1

**Your coordination**: Provide code review + merge approval for B's PRs

### Executor C (Junior/Contractor)
Handles quick wins (all early start):
- 2a-007 (Carousel cleanup, 1h)
- 2a-008 (Dependency traversal, 2h)
- 2a-011 (Regex precompile, 1h)
- 2a-013 (Array spread/GC, 2h)

**Your coordination**: PR review + feedback, merge when ready

---

## Authority & Permissions

- **You have**: Full write access to feat/hermes-phase-1-decisions branch
- **You do NOT have**: Authority to merge to main (Tham-Zeus gates that)
- **You own**: Critical path completion, code quality, benchmark proof
- **Escalate to me**: Blockers, dependency delays, quality concerns

---

## Success Criteria

### Code Quality
- ✅ Unit tests: ≥95% coverage (critical path: 2a-001, 2a-002, 2a-003)
- ✅ Regression tests: 100% pass
- ✅ Code review: 2-eye approval (you + peer)

### Benchmarks (REQUIRED Before Merge)
- ✅ 2a-001: Conflict detection 50-70% faster
- ✅ 2a-002: getQueue() 500ms → 100ms (for 100+ tasks)
- ✅ 2a-003: Disk I/O 10-100x fewer reads
- ✅ 2a-006: Loop extraction 50% faster

### Risk Mitigation
- ✅ 2a-002 (highest risk): Comprehensive state transition tests, optional canary rollout
- ✅ All tasks: No concurrent modification bugs, no memory leaks

---

## Deliverables

1. **4 PRs** (one per critical-path task):
   - PR title: `perf: 2a-001 conflict detection O(n) → O(1)`
   - PR title: `perf: 2a-002 metadata cache + invalidation`
   - PR title: `perf: 2a-003 board reload → parameter passing`
   - PR title: `perf: 2a-006 extract conflict detection from loop`

2. **Benchmarks** (one per PR):
   - Before/after latency numbers
   - Concurrency test results (if applicable)
   - Load test metrics

3. **Completion Report** (when all 4 done):
   - Write to `/route/mission-control/ψ/outbox/20260619_epiteles_phase2a-critical-path-complete.md`
   - Include: time taken, challenges, benchmark proof, integration notes

---

## Questions to Answer Before Starting

1. **Resources**: Do you have full write access to `feat/hermes-phase-1-decisions`?
2. **Dependencies**: When will Phase 1 (all 3 fixes) complete? (Impacts 2a start date)
3. **Blockers**: Any known issues with coordination-board.js that might slow things down?
4. **Availability**: Can you commit 16h in a 7-day window (2.3h/day sustained)?

---

## Timeline Expectations

| Stage | You | Executor B | Executor C | Total |
|---|---|---|---|---|
| Phase 1 Review (parallel) | Plan 2a-001 | Implement 2a-009, 2a-010 | Implement 2a-007, 2a-008, 2a-011, 2a-013 | +5d |
| Day 0-1 | 2a-001 (4h) | 2a-004, 2a-012 start | Final reviews | — |
| Day 1-2 | 2a-002 (6h) + 2a-003 (4h) | 2a-004, 2a-012 (5h) | Merge early-start PRs | — |
| Day 3 | 2a-006 (2h) | Integration | — | — |
| Day 4-7 | Finalize + reviews | Benchmarking | — | Code review + merge |

**Expected Completion**: Day 7-9 (assuming 3-4 hours/day you can commit)

---

## Communication

**Status Updates**: Daily sync via this message thread or maw

**Blockers**: Post to ψ/inbox/ immediately with `[BLOCKER]` tag

**Completion**: Reply to this message with completion summary

**Approval**: Once all 4 PRs done, post summary + I'll (Tham-Zeus) verify benchmarks + gate main merge

---

## Attached Documents

1. **Full Tickets**: See `/route/mission-control/ψ/outbox/20260619_phase2a-task-tickets.md`
   - Detailed specs for all 13 tasks
   - Testing requirements for each
   - File locations, line numbers, examples

2. **Quick Reference**: See `/route/mission-control/ψ/outbox/20260619_phase2a-quick-reference.md`
   - One-page task summary
   - Timeline at a glance
   - ROI rankings

---

## Authority Delegation

By this message, I (ธาม-Zeus) delegate:
- **Execution authority**: You own the critical path (2a-001 through 2a-006)
- **PR merge authority**: To feat/hermes-phase-1-decisions branch (governed by test pass)
- **Code review authority**: You approve Executor B + Executor C work
- **Blocker escalation**: You escalate to me if anything blocks your path

**I retain**: Main merge gate (only I approve Phase 2a → main)

---

## Final Notes

- This is the **highest-ROI work** in Phase 2 (13%+ per hour for 2a-001 and 2a-002)
- You are **critical path owner** — your schedule controls Phase 2 completion date
- **Metadata cache** (2a-002) is the **highest-risk fix** — requires rigorous testing
- **Early start** is encouraged — Executor B and C can deliver 13h in parallel while Phase 1 reviews

---

**Ready to begin?**

Reply with:
1. Confirmation you received these tickets
2. Any questions on implementation approach
3. When you expect Phase 1 to complete (blocks your start)
4. Your availability (hours/day) for next 9-12 days

**From**: ธาม-Zeus (Chief of Staff)  
**Date**: 2026-06-19 07:53 +07  
**Status**: Awaiting your confirmation + execution planning
