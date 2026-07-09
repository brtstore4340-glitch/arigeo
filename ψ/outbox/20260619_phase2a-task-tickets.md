---
from: tham-zeus
to: execution-team
subject: Phase 2a Task Tickets (13 Fixes) — Ready for Assignment
date: 2026-06-19
priority: HIGH
phase: Phase 2a (Performance Optimization Sprint)
effort-total: 44 hours
timeline: 9-12 calendar days
team-size: 3 executors recommended
---

# Phase 2a Task Tickets (13 Fixes)

**Status**: Ready for assignment  
**Gate**: Phase 1 (all 3 fixes) must merge before Phase 2a critical path starts  
**Early Start**: Fixes #7, #8, #11, #13, #9, #10 can begin during Phase 1 PR review  

---

## CRITICAL PATH (Must Sequence)

### Task 2a-001: O(n²) Conflict Detection → Set-Based Lookup

**Priority**: CRITICAL (blocks #2)  
**File**: `ai-orchestrator/src/coordination-board.js` (lines 361-377)  
**Effort**: 4 hours  
**Start Condition**: After Phase 1 merge  
**Assigned To**: Epiteles (senior)

#### Problem
```javascript
for (const filePath of task.files) {
  for (const otherTaskId of tasksWritingToFile) {
    if (board.running_tasks.includes(otherTaskId)) {  // O(n) per compare!
      conflicts.push({...})
    }
  }
}
```
Complexity: O(F × T × R) where F=files, T=tasks/file, R=running. Running `includes()` is O(n).

#### Implementation
Convert `running_tasks` array to Set at function entry:
```javascript
const runningSet = new Set(board.running_tasks)
for (const filePath of task.files) {
  for (const otherTaskId of tasksWritingToFile) {
    if (!runningSet.has(otherTaskId)) continue  // O(1)
    conflicts.push({...})
  }
}
```

#### Testing
- Unit test: Verify Set membership works for circular deps, self-conflicts
- Fuzz test: Random task/file/running combinations
- Benchmark: Conflict detection time with 100, 1000, 10000 tasks

#### Expected Outcome
50-70% latency reduction in conflict detection

#### Definition of Done
- [ ] Code implemented + reviewed
- [ ] Unit tests passing (≥95% coverage)
- [ ] Benchmark shows ≥50% improvement
- [ ] No regression in other tests
- [ ] PR merged to feat/hermes-phase-1-decisions

---

### Task 2a-002: Metadata Cache + Invalidation Strategy

**Priority**: CRITICAL (highest ROI, ~13% per hour)  
**File**: `ai-orchestrator/src/coordination-board.js` (lines 444-462)  
**Effort**: 6 hours  
**Start Condition**: After Phase 1 merge + Task 2a-001 complete  
**Assigned To**: Epiteles (senior)

#### Problem
```javascript
return board.task_order.map((taskId) => ({
  ...board.tasks[taskId],
  dependencies_met: areDependenciesMet(taskId, board),  // O(n) per task
  conflicts: detectConflicts(taskId, board),             // O(n) per task (NOW O(1) after 2a-001)
}))
```
Called frequently (status queries, UI refreshes). No caching or memoization. With 100 tasks: 200+ expensive operations per call.

#### Implementation
1. Add metadata cache to board object:
```javascript
board._metadataCache = {
  task_metadata: new Map(),  // taskId → {dependencies_met, conflicts}
  invalidated: new Set()      // Track which tasks need refresh
}
```

2. Cache insertion on task state change:
```javascript
onTaskStateChange(taskId) {
  board._metadataCache.invalidated.add(taskId)
  // Cascade invalidate dependent tasks
}
```

3. Lazy compute on access:
```javascript
getTaskMetadata(taskId) {
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

4. Invalidation on state change:
```javascript
// In updateTaskStatus, addTask, deleteTask:
board._metadataCache.invalidated.add(taskId)
```

#### Testing
- Unit test: Cache hit/miss scenarios
- State transition tests: Verify invalidation on add/delete/status-change
- Regression test: 100% consistency (cached == computed)
- Load test: 1000 getQueue() calls with varying task counts
- Benchmark: Queue latency 500ms → 100ms for 100+ tasks

#### Expected Outcome
70-80% latency reduction in getQueue() + listBlockedTasks()

#### Definition of Done
- [ ] Cache implementation + state invalidation logic
- [ ] Unit tests: ≥95% coverage
- [ ] State transition tests: 100% pass
- [ ] Benchmark: 500ms → 100ms (100+ tasks)
- [ ] No cache corruption under concurrent task updates
- [ ] PR merged to feat/hermes-phase-1-decisions

---

### Task 2a-003: Board Reload → Parameter Passing

**Priority**: HIGH (dependency depth, 10-100x disk I/O savings)  
**File**: `ai-orchestrator/src/coordination-board.js` (throughout)  
**Effort**: 4 hours  
**Start Condition**: After Phase 1 merge  
**Assigned To**: Epiteles (senior)

#### Problem
Every function (`getNextTask`, `updateTaskStatus`, `detectConflicts`, `getQueue`, `listBlockedTasks`) calls `loadBoard()` independently:
- `getQueue()` → calls `loadBoard()` + calls `detectConflicts()` for each task (each calls `loadBoard()` again) = O(n²) disk reads
- `listBlockedTasks()` → same issue

#### Implementation
1. Pass loaded board object as optional parameter:
```javascript
function getQueue(board = null) {
  if (!board) board = loadBoard()  // Load once
  return board.task_order.map((taskId) => ({
    ...board.tasks[taskId],
    dependencies_met: areDependenciesMet(taskId, board),    // Pass board
    conflicts: detectConflicts(taskId, board),              // Pass board
  }))
}

function detectConflicts(taskId, board) {
  // Use passed board, no reload
  for (const filePath of board.tasks[taskId].files) {
    // ...
  }
}
```

2. Mark `loadBoard` as internal or private to encourage parameter passing

3. Update all call sites to pass board:
```javascript
const board = loadBoard()
const queue = getQueue(board)
const blocked = listBlockedTasks(board)
const next = getNextTask(board)
```

#### Testing
- Unit test: Verify all functions work with passed board
- Integration test: Board state consistency across multiple calls
- Benchmark: File I/O count before/after
- Load test: 100+ concurrent operations

#### Expected Outcome
10-100x fewer disk reads

#### Definition of Done
- [ ] All functions accept optional board parameter
- [ ] Call sites updated to pass board
- [ ] Unit tests: ≥95% coverage
- [ ] Integration tests: 100% state consistency
- [ ] Disk I/O benchmark: 10-100x fewer reads
- [ ] No regression in functionality
- [ ] PR merged to feat/hermes-phase-1-decisions

---

### Task 2a-006: Extract Conflict Detection from getQueue() Loop

**Priority**: HIGH (50% getQueue() latency reduction, depends on 2a-001)  
**File**: `ai-orchestrator/src/coordination-board.js` (lines 449, 462)  
**Effort**: 2 hours  
**Start Condition**: After Task 2a-001 (Set-based conflict detection)  
**Assigned To**: Epiteles (senior)

#### Problem
```javascript
// Current: loop calls detectConflicts inside map
return board.task_order.map((taskId) => ({
  conflicts: detectConflicts(taskId, board)  // Called N times, same file registry scanned N times
}))
```

Even with Set-based lookup (Task 2a-001), the loop still repeats work.

#### Implementation
Precompute conflicts once, then map:
```javascript
// Compute conflicts once
const conflictsByTask = new Map()
for (const taskId of board.task_order) {
  conflictsByTask.set(taskId, detectConflicts(taskId, board))
}

// Then map (just lookup, no computation)
return board.task_order.map((taskId) => ({
  ...board.tasks[taskId],
  conflicts: conflictsByTask.get(taskId)
}))
```

Or: Cache conflicts in Task 2a-002 (metadata cache) and reuse here.

#### Testing
- Unit test: Conflict map correctness
- Benchmark: Latency before/after extraction

#### Expected Outcome
50% latency reduction within getQueue()

#### Definition of Done
- [ ] Refactored loop to extract conflict computation
- [ ] Unit tests passing
- [ ] Benchmark shows ≥50% getQueue() improvement
- [ ] PR merged to feat/hermes-phase-1-decisions

---

## MEDIUM PRIORITY (Can Parallelize)

### Task 2a-004: Sequential Metadata Batching

**Priority**: MEDIUM-HIGH (stacks with Phase 1 file I/O, +10-20%)  
**File**: `src/lib/aegis/coordinator.ts` (lines ~240-260, onStep callback)  
**Effort**: 2 hours  
**Start Condition**: After Phase 1 merge + Phase 1 file I/O batching  
**Assigned To**: Executor B (mid)

#### Problem
Beyond Phase 1 batching: some metadata updates could still batch better.

#### Implementation
Wrap additional non-dependent updates:
```typescript
await Promise.all([
  storage.writeTask(taskUpdate),
  storage.writeRun(runUpdate),
  storage.appendRunLog(runId, logLine),
  storage.appendRunEvent(runId, event),
])
```

Identify and group other non-dependent metadata updates.

#### Testing
- Latency benchmark: +10-20% improvement
- Concurrency test: Verify no race conditions

#### Expected Outcome
Additional 10-20% latency reduction

#### Definition of Done
- [ ] Additional batching identified + implemented
- [ ] Benchmark shows ≥10% improvement
- [ ] No concurrency regressions
- [ ] PR merged

---

### Task 2a-009: File Locking + Exponential Backoff

**Priority**: MEDIUM (lock contention, 30-50% error reduction)  
**File**: `ai-orchestrator/src/blackboard.js` (lines 114-142)  
**Effort**: 6 hours  
**Start Condition**: Can start during Phase 1 review (independent)  
**Assigned To**: Executor B (mid)

#### Problem
Synchronous lock + fs.renameSync() blocks; no retry backoff. Failed lock acquisitions return false immediately, forcing caller to handle retry.

#### Implementation
```javascript
async function lockWithRetry(agentName, maxRetries = 5, initialDelayMs = 10) {
  for (let i = 0; i < maxRetries; i++) {
    if (lock(agentName)) return true
    const delayMs = initialDelayMs * Math.pow(2, i) + Math.random() * initialDelayMs
    await new Promise(resolve => setTimeout(resolve, delayMs))
  }
  return false
}
```

Add exponential backoff with jitter. Update all lock call sites to use this function.

#### Testing
- Load test: Concurrent lock contention (10+ agents, 100+ operations)
- Backoff parameter tuning (max delay, max retries)
- Benchmark: Lock failure rate before/after

#### Expected Outcome
30-50% reduction in lock contention errors; better fairness under concurrent load

#### Definition of Done
- [ ] Exponential backoff implementation
- [ ] All lock() call sites updated to lockWithRetry()
- [ ] Load test: ≥30% improvement
- [ ] Parameter limits enforced (max backoff, max retries)
- [ ] PR merged

---

### Task 2a-010: Stale Lock Cleanup During Runtime

**Priority**: MEDIUM-LOW (filesystem bloat prevention)  
**File**: `ai-orchestrator/src/blackboard.js` (line 55)  
**Effort**: 1 hour  
**Start Condition**: Can start during Phase 1 review; pairs with Task 2a-009  
**Assigned To**: Executor B (mid)

#### Problem
Cleanup only called at init, never during runtime. Stale locks from crashed agents accumulate on disk.

#### Implementation
```javascript
function unlock(agentName) {
  // ... existing unlock ...
  
  // Every 100 lock acquisitions, cleanup stale locks
  if (++lockCount % 100 === 0) {
    cleanup()
  }
}
```

Or periodic cleanup via timer:
```javascript
setInterval(() => cleanup(), 30 * 60 * 1000)  // Every 30 min
```

#### Testing
- Unit test: Cleanup triggered at right frequency
- Filesystem test: Stale locks removed

#### Expected Outcome
Prevent 1 KB per crash accumulation

#### Definition of Done
- [ ] Cleanup called during runtime
- [ ] Frequency tested (100 lock acquisitions or timer)
- [ ] Stale locks removed
- [ ] PR merged

---

### Task 2a-012: Unbatched Multi-Step Artifact Writes → Batching

**Priority**: MEDIUM (20-35% latency, syscall reduction)  
**File**: `src/lib/aegis/coordinator.ts` (lines 242-257, onStep)  
**Effort**: 5 hours  
**Start Condition**: After Phase 1 file I/O merge (needs Phase 1 patterns)  
**Assigned To**: Executor B (mid)

#### Problem
Individual file per artifact per step; 500+ file operations for 100-step execution.

#### Implementation
Buffer artifact writes, flush every N steps:
```typescript
private artifactBuffer = []

onArtifact(runId, artifact) {
  this.artifactBuffer.push({ runId, artifact })
  if (this.artifactBuffer.length >= 10) {
    this.flushArtifacts()
  }
}

private async flushArtifacts() {
  await Promise.all(
    this.artifactBuffer.map(({ runId, artifact }) =>
      storage.writeArtifact(runId, artifact)
    )
  )
  this.artifactBuffer = []
}
```

Or: Batch by step boundary instead of size.

#### Testing
- Latency benchmark: Before/after syscall count
- Buffer overflow test: Verify flush on buffer full
- Timeout test: Flush on step boundary even if buffer not full

#### Expected Outcome
20-35% latency reduction; fewer syscalls

#### Definition of Done
- [ ] Buffering + flush logic implemented
- [ ] Benchmark shows ≥20% improvement
- [ ] Buffer bounds enforced
- [ ] Timeout prevents unbounded wait
- [ ] PR merged

---

## LOW PRIORITY / QUICK WINS (Can Parallelize Early)

### Task 2a-007: Carousel Event Listener Cleanup

**Priority**: LOW (memory only, -50 KB/100 renders)  
**File**: `pharmacy-monitoring-system/src/app/components/ui/carousel.tsx`  
**Effort**: 1 hour  
**Start Condition**: Can start immediately (independent, early start)  
**Assigned To**: Executor C (junior)

#### Problem
useEffect attaches carousel listeners without cleanup. Every re-render adds listeners. 100 re-renders = 200 accumulated listeners.

#### Implementation
```typescript
React.useEffect(() => {
  if (!api) return
  onSelect(api)
  api.on("reInit", onSelect)
  api.on("select", onSelect)
  
  // Add cleanup
  return () => {
    api.off("reInit", onSelect)
    api.off("select", onSelect)
  }
}, [api, onSelect])  // Add dependency array if missing
```

#### Testing
- Unit test: Verify cleanup called on unmount/dependency change
- Memory test: Listener count after 100 re-renders

#### Expected Outcome
~50 KB memory saved per carousel per 100 re-renders

#### Definition of Done
- [ ] Cleanup function added
- [ ] Dependency array correct
- [ ] Unit test passing
- [ ] PR merged

---

### Task 2a-008: Quadratic Dependency Traversal → Deduplication

**Priority**: LOW (stability, prevents pathological cases)  
**File**: `ai-orchestrator/src/coordination-board.js` (lines 302-328, getTaskDependencies)  
**Effort**: 2 hours  
**Start Condition**: Can start immediately (independent, early start)  
**Assigned To**: Executor C (junior)

#### Problem
```javascript
const queue = [...task.dependencies]
while (queue.length > 0) {
  const depId = queue.shift()  // O(n) for arrays
  if (allDeps.has(depId)) continue
  allDeps.add(depId)
  const depTask = board.tasks[depId]
  if (depTask) {
    queue.push(...depTask.dependencies)  // Duplicates added
  }
}
```

Two issues: `shift()` is O(n), duplicates in queue cause explosion.

#### Implementation
```javascript
const queue = [...task.dependencies]
const queued = new Set(queue)
while (queue.length > 0) {
  const depId = queue.pop()  // O(1)
  if (allDeps.has(depId)) continue
  allDeps.add(depId)
  const depTask = board.tasks[depId]
  if (depTask) {
    for (const d of depTask.dependencies) {
      if (!allDeps.has(d) && !queued.has(d)) {
        queue.push(d)
        queued.add(d)
      }
    }
  }
}
```

#### Testing
- Unit test: Deep dependency graph (10+ levels)
- Fuzz test: Circular deps, self-deps
- Performance test: Queue size before/after dedup

#### Expected Outcome
Prevent queue explosion on deep/cyclic graphs

#### Definition of Done
- [ ] Deduplication implemented
- [ ] pop() used instead of shift()
- [ ] Unit tests passing
- [ ] Circular/self-dep edge cases handled
- [ ] PR merged

---

### Task 2a-011: Regex Precompilation in Contract Enforcer

**Priority**: LOW (negligible impact, easy win)  
**File**: `ai-orchestrator/src/contract-enforcer.js` (lines 86-101)  
**Effort**: 1 hour  
**Start Condition**: Can start immediately (independent, early start)  
**Assigned To**: Executor C (junior)

#### Problem
```javascript
if (constraints.forbidden_commands && constraints.forbidden_commands.length > 0) {
  const command = args.command || ''
  for (const forbidden of constraints.forbidden_commands) {
    if (new RegExp(forbidden).test(command)) {  // Recompiled per check
      // ...
    }
  }
}
```

#### Implementation
Precompile during contract load:
```javascript
const forbiddenPatterns = constraints.forbidden_commands.map(p => {
  try {
    return { type: 'regex', pattern: new RegExp(p) }
  } catch {
    return { type: 'string', value: p }
  }
})

// Then check:
forbiddenPatterns.some(fp =>
  fp.type === 'string' ? command.includes(fp.value) : fp.pattern.test(command)
)
```

#### Testing
- Unit test: String vs regex pattern handling
- Benchmark: Regex compilation overhead (negligible)

#### Expected Outcome
Negligible but free

#### Definition of Done
- [ ] Precompilation on contract load
- [ ] Pattern validation (invalid regex handling)
- [ ] Unit tests passing
- [ ] PR merged

---

### Task 2a-013: Array Spread Operator → push() + Single Assignment

**Priority**: LOW (GC pressure, 90% heap reduction)  
**File**: `src/lib/aegis/coordinator.ts` (lines 243, 250, 256, 282)  
**Effort**: 2 hours  
**Start Condition**: Can start immediately (independent, early start)  
**Assigned To**: Executor C (junior)

#### Problem
```typescript
taskUpdate.artifacts = [...taskUpdate.artifacts, artifactPath]  // O(n²) allocation per step
runUpdate.events = [...currentRun.events, event]
taskUpdate.logs = [...taskUpdate.logs, logPath]
```

Each iteration reallocates entire array. 100 steps = ~5,000 intermediate allocations.

#### Implementation
Use push() directly:
```typescript
taskUpdate.artifacts.push(artifactPath)
runUpdate.events.push(event)
taskUpdate.logs.push(logPath)
```

Or accumulate in separate buffer, assign once:
```typescript
const newArtifacts = [...taskUpdate.artifacts]
newArtifacts.push(artifactPath)
// ... more pushes ...
taskUpdate.artifacts = newArtifacts  // One assignment
```

#### Testing
- Memory benchmark: Heap allocation before/after
- GC profile: GC frequency reduction

#### Expected Outcome
90% GC pressure reduction

#### Definition of Done
- [ ] Spread operator replaced with push()
- [ ] Memory benchmark shows ≥80% improvement
- [ ] No functionality regressions
- [ ] PR merged

---

## TASK ASSIGNMENT MATRIX

| Task | Executor | Effort | Start | Dependencies |
|---|---|---|---|---|
| **2a-001** (Conflict Set) | Epiteles | 4h | Phase 1 merge | none |
| **2a-002** (Metadata Cache) | Epiteles | 6h | 2a-001 done | 2a-001 |
| **2a-003** (Board Reload) | Epiteles | 4h | Phase 1 merge | none |
| **2a-006** (Extract Loop) | Epiteles | 2h | 2a-001 done | 2a-001 |
| **2a-004** (Metadata Batch) | Executor B | 2h | Phase 1 merge | Phase 1 file I/O |
| **2a-009** (Lock Backoff) | Executor B | 6h | Early start | none |
| **2a-010** (Lock Cleanup) | Executor B | 1h | Early start | pairs w/ 2a-009 |
| **2a-012** (Artifact Batch) | Executor B | 5h | Phase 1 merge | Phase 1 file I/O |
| **2a-007** (Carousel) | Executor C | 1h | Early start | none |
| **2a-008** (Dependency) | Executor C | 2h | Early start | none |
| **2a-011** (Regex) | Executor C | 1h | Early start | none |
| **2a-013** (Array GC) | Executor C | 2h | Early start | none |

**Total Effort**: 44 hours  
**Epiteles**: 16 hours (critical path)  
**Executor B**: 14 hours (parallelizable)  
**Executor C**: 6 hours (quick wins, early start)

---

## WORKFLOW & GATES

### Phase 1 Checkpoint (Blocker)
- All 3 Phase 1 fixes merged to `feat/hermes-phase-1-decisions`
- All Phase 1 benchmarks passed
- Tham-Zeus approval for Phase 2a start

### Early Start (Parallel to Phase 1 Review)
```
BEGIN (parallel to Phase 1):
  Executor C: Tasks 2a-007, 2a-008, 2a-011, 2a-013 (6 hours)
  Executor B: Tasks 2a-009, 2a-010 (7 hours)
  Lead: PR reviews for early-start tasks
```

### Phase 2a Critical Path (After Phase 1 Merge)
```
DAY 0 (Phase 1 merged):
  Epiteles: Start 2a-001 (4h)
  Executor B: Start 2a-004, 2a-012
  Executor C: Finalize early-start PRs

DAY 1 (2a-001 done):
  Epiteles: Start 2a-002 (6h, depends on 2a-001)
  Executor B: Continue 2a-004, 2a-012
  
DAY 2:
  Epiteles: Start 2a-003 (4h, parallel to 2a-002)
  Executor B: Start artifact batching
  
DAY 3:
  Epiteles: Complete 2a-003, start 2a-006 (2h, depends on 2a-001)
  Executor B: Finalize locking fixes
  
DAY 4-7:
  Integration, benchmarking, reviews
  All PRs merged to feat/hermes-phase-1-decisions
```

**Expected Completion**: Day 7-9 (9-12 calendar days including weekends, reviews, overhead)

---

## SUCCESS CRITERIA PER TASK

All tasks must satisfy:
- ✅ Code implemented + reviewed by 2 eyes (Tham-Zeus + peer)
- ✅ Unit tests: ≥95% coverage
- ✅ Benchmarks: Improvement ≥ stated % or latency reduction
- ✅ Regression tests: 100% pass
- ✅ PR merged to `feat/hermes-phase-1-decisions`
- ✅ No concurrent modification bugs

---

## TICKET DISTRIBUTION

**Ready to assign to Execution Team**

Each task includes:
- ✅ File location + line numbers
- ✅ Problem statement + code example
- ✅ Implementation approach
- ✅ Testing requirements
- ✅ Expected outcome
- ✅ Definition of Done
- ✅ Dependencies + start condition

**Next Action**: Route these tickets to executors + create GitHub PRs

---

**Document Status**: ✅ Ready for execution

**Approved By**: ธาม-Zeus (Governor)  
**Dispatch Date**: 2026-06-19 07:52 +07
