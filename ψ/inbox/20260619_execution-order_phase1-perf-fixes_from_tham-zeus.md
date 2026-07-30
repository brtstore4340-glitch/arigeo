---
from: tham-zeus
to: epiteles
subject: EXECUTION ORDER - Phase 1: 3 Critical Performance Fixes
priority: CRITICAL
deadline: 4-6 hours
date: 2026-06-19
branch: feat/hermes-phase-1-decisions
---

# EXECUTION ORDER: Phase 1 Critical Performance Fixes

**Sender**: ธาม-Zeus (Chief of Staff)  
**Executor**: Epiteles (Implementation Authority)  
**Status**: IMMEDIATE START REQUIRED  
**Deadline**: Complete all 3 fixes within 4-6 hours  
**Deployment Gate**: All 3 PRs must be merged + verified before `feat/hermes-phase-1-decisions` reaches main

---

## Mission: Execute 3 Critical Fixes (Codex-01 Findings)

Source: Performance review from 3-agent review team (codex-01 lead)  
Branch: `feat/hermes-phase-1-decisions`  
Risk Level: CRITICAL — Production deployment blocked until all fixed

---

## CRITICAL FIX #1: inFlightRuns Set Memory Leak

**Time Estimate**: 30 minutes  
**Severity**: CRITICAL 🚨

### Location
- **File**: `src/lib/aegis/coordinator.ts`
- **Lines**: 27, 188, 338

### Problem
Synchronous throw before async boundary leaves `runId` in the Set forever:
- Unbounded Set growth over application lifetime
- False `activeRuns` counts in health checks
- Memory accumulation: 2.4 KB/day under sustained 100 task/hour load
- **Risk**: Production memory exhaustion after 7-10 days of operation

### Implementation

Replace the current `executeRun()` method to wrap in try-catch:

```typescript
private async executeRun(taskId: string, runId: string) {
  try {
    this.inFlightRuns.add(runId)
    // ... existing code ...
  } catch (e) {
    this.inFlightRuns.delete(runId)  // Cleanup on sync throw
    throw e
  } finally {
    this.inFlightRuns.delete(runId)  // Always cleanup
  }
}
```

### Testing Requirement

Write unit test verifying:
1. runId is added to Set on call
2. runId is removed on sync throw
3. runId is removed on async throw
4. runId is removed on success

### Proof
- Unit test file: `src/lib/aegis/__tests__/coordinator.inFlightRuns.test.ts`
- Must pass before PR merge

---

## HIGH PRIORITY FIX #2: Sequential File I/O in executeRun()

**Time Estimate**: 2 hours  
**Severity**: HIGH 🔴  
**Performance Gain**: 40-60% latency reduction (5-15s → 2-6s per execution)

### Location
- **File**: `src/lib/aegis/coordinator.ts`
- **Lines**: 212-262

### Problem
250+ file operations serialized per 50-step execution:
- `writeArtifact()` → `appendRunLog()` → `writeTask()` → `writeRun()` → `appendRunEvent()`
- All blocking, one-by-one
- Causes 5-15 second latency per multi-step run

### Implementation

Batch non-dependent writes with `Promise.all()`:

```typescript
// In the onStep callback, replace sequential calls with:
await Promise.all([
  storage.writeTask(taskUpdate),
  storage.writeRun(runUpdate),
  storage.appendRunLog(runId, logLine),
  storage.appendRunEvent(runId, event),
])

// Keep artifact writes in sequence if they depend on previous state
await storage.writeArtifact(artifactPath)
```

### Testing Requirement

Create latency benchmark:
1. Run 50-step execution on current code → measure time
2. Run same execution on fixed code → measure time
3. Report improvement percentage
4. Assert improvement ≥ 40%

### Proof
- Benchmark file: `src/lib/aegis/__tests__/coordinator.latency-benchmark.ts`
- Screenshot: before/after latency comparison
- Must pass before PR merge

---

## HIGH PRIORITY FIX #3: O(n³) Task Ordering Algorithm

**Time Estimate**: 1 hour  
**Severity**: HIGH 🔴  
**Performance Gain**: 95% faster batch operations

### Location
- **File**: `ai-orchestrator/src/coordination-board.js`
- **Lines**: 157-163

### Problem
`indexOf()` called O(n) times in `O(n log n)` sort comparator:

```javascript
board.task_order.sort((a, b) => {
  const priorityDiff = board.tasks[a].priority - board.tasks[b].priority
  if (priorityDiff !== 0) return priorityDiff
  return board.task_order.indexOf(a) - board.task_order.indexOf(b)  // ← O(n) per compare!
})
```

Results in:
- O(n² log n) per call
- 10⁹ operations for 1000 tasks
- CPU spike during batch adds

### Implementation

Replace `indexOf()` with `insertion_order` counter:

```javascript
board.task_order.sort((a, b) => {
  const priorityDiff = board.tasks[a].priority - board.tasks[b].priority
  if (priorityDiff !== 0) return priorityDiff
  return board.tasks[a].insertion_order - board.tasks[b].insertion_order
})
```

**Setup**: When adding task, assign `insertion_order`:
```javascript
addTask(taskId, task) {
  if (!this.insertion_counter) this.insertion_counter = 0
  task.insertion_order = this.insertion_counter++
  board.tasks[taskId] = task
  board.task_order.push(taskId)
  this.sort()
}
```

### Testing Requirement

Create CPU/performance benchmark:
1. Generate 1000 random tasks with priorities
2. Add them in batch (triggers sort N times)
3. Measure CPU time on current code
4. Run same on fixed code
5. Report improvement percentage
6. Assert improvement ≥ 90%

### Proof
- Benchmark file: `ai-orchestrator/src/__tests__/coordination-board.perf-benchmark.ts`
- CPU profile comparison (screenshot)
- Must pass before PR merge

---

## Execution Checklist

**Do NOT merge to main until ALL items checked:**

- [ ] **Fix #1 Complete**
  - [ ] Code implemented (try-catch wrapping)
  - [ ] Unit tests written + passing
  - [ ] PR created: `fix/inFlightRuns-memory-leak`
  - [ ] Code review pass
  - [ ] Merged to `feat/hermes-phase-1-decisions`

- [ ] **Fix #2 Complete**
  - [ ] Code implemented (Promise.all batching)
  - [ ] Latency benchmark written + shows ≥40% improvement
  - [ ] PR created: `fix/sequential-file-io-batching`
  - [ ] Code review pass
  - [ ] Merged to `feat/hermes-phase-1-decisions`

- [ ] **Fix #3 Complete**
  - [ ] Code implemented (insertion_order counter)
  - [ ] CPU benchmark written + shows ≥90% improvement
  - [ ] PR created: `fix/task-ordering-On3`
  - [ ] Code review pass
  - [ ] Merged to `feat/hermes-phase-1-decisions`

- [ ] **All Tests Passing**
  - [ ] Unit tests pass
  - [ ] Benchmark tests pass
  - [ ] No regressions in existing tests

- [ ] **Completion Report**
  - [ ] Write summary to `/route/mission-control/ψ/outbox/20260619_epiteles_phase1-complete.md`
  - [ ] Include: time taken, challenges, proof (screenshots)
  - [ ] Post to thread or notify Tham-Zeus

---

## Blocker Rule

**HARD GATE**: No commit to main until:
1. All 3 fixes are merged to `feat/hermes-phase-1-decisions`
2. All benchmarks/tests pass
3. Tham-Zeus approves + signs off

**If blocked**: Immediately escalate via `/talk-to tham-zeus --urgent "Phase 1 blocker: [reason]"`

---

## Authority & Constraints

- **You are the Executor**: Write code, run tests, create PRs — this is your domain
- **I am the Governor**: I verify proof, gate merges, coordinate approvals
- **Authority Chain**: Epiteles (Execute) → ธาม-Zeus (Approve) → main (Deploy)

**Do not skip testing or proof** — benchmarks are non-negotiable.

---

## Timeline

| Stage | Duration | Deadline |
|-------|----------|----------|
| Fix #1 (inFlightRuns) | 30 min | +0:30 from start |
| Fix #2 (File I/O) | 2h | +2:30 from start |
| Fix #3 (Task ordering) | 1h | +3:30 from start |
| Testing + review buffer | 30 min - 2.5h | +4:00 to +6:00 from start |

**Total Window**: 4-6 hours from now (07:47 +07 → ~12:00–14:00 +07 finish)

---

## Questions?

If anything is unclear, reply in this message or escalate immediately:
- `/talk-to tham-zeus --urgent "Phase 1 clarification needed: [question]"`

**Expected Response Timeline**: Complete all 3 + report status by 14:00 +07 (2026-06-19)

---

**From**: ธาม-Zeus (Chief of Staff)  
**Authority**: Mission Control Governor  
**Timestamp**: 2026-06-19 07:47 +07  
**Status**: Awaiting execution confirmation

*"ทำงานจริง, ทำสำเร็จ, รายงานผล"* (Do real work, achieve success, report results)
