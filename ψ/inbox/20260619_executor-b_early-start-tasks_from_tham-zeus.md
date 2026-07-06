---
from: tham-zeus
to: executor-b
subject: Early Start Tasks — 7 Hours Ready Now (No Phase 1 Blocker)
priority: HIGH
date: 2026-06-19
start-condition: IMMEDIATE (parallel to Phase 1 review)
effort-total: 7 hours
timeline: 2-3 calendar days
---

# Early Start Tasks for Executor B

**Status**: Ready to begin immediately  
**Blocker**: NONE (independent of Phase 1)  
**Authority**: Full write access to `feat/hermes-phase-1-decisions` branch  

---

## Mission Overview

Execute 2 high-priority tasks in parallel while Phase 1 is under review. These are independent and can ship immediately upon completion + testing.

**Your Tasks**:
- Task 2a-009: File Locking + Exponential Backoff (6 hours)
- Task 2a-010: Stale Lock Cleanup (1 hour)

**Combined Impact**: 30-50% reduction in lock contention errors; better fairness under concurrent load

---

## Task 2a-009: File Locking → Exponential Backoff with Jitter

**File**: `ai-orchestrator/src/blackboard.js` (lines 114-142)  
**Effort**: 6 hours  
**Complexity**: Medium (parameter tuning required)  
**Risk**: Low-medium (lock contention is isolated subsystem)

### Problem

Synchronous lock + fs.renameSync() blocks. No retry backoff. Failed lock acquisitions return false immediately, forcing caller to handle retry.

```javascript
// Current: fails immediately if lock held
if (!lock(agentName)) {
  // Retry logic pushed to caller (inconsistent)
  return false
}
```

Under concurrent load (10+ agents, 100+ operations), lock contention errors spike.

### Implementation

Add exponential backoff with jitter:

```javascript
async function lockWithRetry(agentName, maxRetries = 5, initialDelayMs = 10) {
  for (let i = 0; i < maxRetries; i++) {
    if (lock(agentName)) return true
    
    // Exponential backoff + jitter (prevents thundering herd)
    const delayMs = initialDelayMs * Math.pow(2, i) + Math.random() * initialDelayMs
    await new Promise(resolve => setTimeout(resolve, delayMs))
  }
  
  // Final failure after all retries exhausted
  return false
}
```

**Parameters**:
- `maxRetries = 5`: Total attempts before giving up (tunable based on load testing)
- `initialDelayMs = 10`: Starting backoff (milliseconds)
- Jitter: `Math.random() * initialDelayMs` prevents synchronized retries

**Backoff Schedule** (with initialDelayMs=10):
```
Attempt 1: fail immediately
Attempt 2: wait 10-20ms
Attempt 3: wait 20-40ms
Attempt 4: wait 40-80ms
Attempt 5: wait 80-160ms
Attempt 6: fail (maxRetries exhausted)
Total max wait: ~310ms
```

### Update All Call Sites

Find every `lock(agentName)` call and replace with:

```javascript
if (!await lockWithRetry(agentName)) {
  logger.warn(`Failed to acquire lock for ${agentName} after retries`)
  // Handle failure appropriately
  return false
}
```

Or wrap in a retry-enabled wrapper function.

### Testing Required

1. **Load Test** (CRITICAL)
   - Simulate 10+ concurrent agents, 100+ lock acquisitions
   - Measure lock failure rate before/after backoff
   - Expected: ≥30% improvement in success rate

2. **Parameter Tuning**
   - Test with different `maxRetries` (3, 5, 10)
   - Test with different `initialDelayMs` (5, 10, 20)
   - Find sweet spot for your typical load

3. **Timeout Enforcement**
   - Verify max total wait time doesn't exceed reasonable timeout
   - Log excessive retries (indicates systemic contention)

4. **Fairness Test**
   - Verify no agent starves (jitter prevents always losing)
   - Concurrent acquisition order under load should be fair

### Expected Outcome
- 30-50% reduction in lock acquisition failures
- Better fairness: no agent consistently loses lock races
- Graceful degradation under overload

### Definition of Done
- [ ] lockWithRetry() implemented with exponential backoff
- [ ] All lock() call sites updated to lockWithRetry()
- [ ] Load test: ≥30% improvement in success rate
- [ ] Parameter limits documented and enforced
- [ ] No regressions in existing lock behavior
- [ ] PR created + merged to feat/hermes-phase-1-decisions

---

## Task 2a-010: Stale Lock Cleanup During Runtime

**File**: `ai-orchestrator/src/blackboard.js` (line 55)  
**Effort**: 1 hour  
**Complexity**: Low (mechanical addition)  
**Risk**: Low (cleanup only removes stale entries)

### Problem

Cleanup called only at init, never during runtime. Stale locks from crashed agents accumulate on disk.

```javascript
function init() {
  // ... setup ...
  cleanup()  // Only called once!
}
```

Over time, dead lock files pile up. Not a memory leak in JS, but filesystem bloat (~1 KB per crash).

### Implementation

**Option A: Periodic Cleanup (Recommended)**

```javascript
function init() {
  // ... existing setup ...
  
  // Cleanup stale locks every 30 minutes during runtime
  setInterval(() => {
    cleanup()
    logger.debug('Stale locks cleaned')
  }, 30 * 60 * 1000)  // 30 min
}
```

**Option B: Cleanup After Unlock**

```javascript
function unlock(agentName) {
  // ... existing unlock logic ...
  
  // Every 100 lock operations, trigger cleanup
  if (++lockCount % 100 === 0) {
    cleanup()
  }
}
```

**Option C: Hybrid**

Combine periodic (30 min) + operational (every 100 unlocks) for belt-and-suspenders.

Choose the approach that fits your architecture best.

### Testing Required

1. **Unit Test**
   - Verify cleanup triggered at right frequency
   - Verify stale locks removed from filesystem

2. **Integration Test**
   - Run sustained operation (1000+ lock/unlock cycles)
   - Verify file count doesn't grow unbounded

3. **Filesystem Check**
   - Before: count stale lock files
   - Run cleanup
   - After: count should decrease

### Expected Outcome
- Prevents filesystem bloat (~1 KB per crash cleanup)
- Filesystem usage stable over long-running operations

### Definition of Done
- [ ] Cleanup called during runtime (periodic or operational)
- [ ] Frequency verified correct
- [ ] Unit tests passing
- [ ] Filesystem test shows stale locks removed
- [ ] No performance impact (cleanup is O(1) operation count)
- [ ] PR created + merged to feat/hermes-phase-1-decisions

---

## Execution Timeline

### Day 0 (Today)
- Review both task specs
- Set up load test environment for 2a-009
- Begin 2a-009 implementation

### Day 1
- Complete 2a-009 implementation
- Run load test + parameter tuning
- Begin 2a-010 implementation

### Day 2
- Finalize 2a-009 benchmarks
- Complete 2a-010 + tests
- Code review + merge preparation

### Day 2-3
- PR reviews + feedback incorporation
- Final benchmarks
- Merge both PRs to feat/hermes-phase-1-decisions

---

## Support & Questions

- Full task specs: See `/route/mission-control/ψ/outbox/20260619_phase2a-task-tickets.md` (section: Task 2a-009 and 2a-010)
- Blockers: Reply to this message with `[BLOCKER]` tag
- Status updates: Daily sync preferred (brief summary)
- Code reviews: Epiteles will review your PRs

---

## Authority & Permissions

- **You have**: Full write access to feat/hermes-phase-1-decisions branch
- **You do NOT have**: Authority to merge to main (Tham-Zeus gates that)
- **Dependencies**: None (these tasks are independent)
- **Gate**: Your PRs merge to feat/hermes-phase-1-decisions immediately upon test pass (no blocker)

---

## Success Criteria

✅ **Code Quality**
- Unit tests: ≥95% coverage
- Load test: ≥30% improvement in lock success rate
- No regressions in existing lock behavior

✅ **Benchmarks**
- Before/after lock failure rate
- Backoff parameter performance
- Fairness metrics (no starvation)

✅ **Filesystem**
- Stale lock cleanup removes dead entries
- Filesystem usage stable

---

## Questions to Answer Before Starting

1. What load levels have you observed in this system? (agents, lock operations/sec)
2. Any current lock timeout issues documented? (helps with parameter tuning)
3. Filesystem location for locks: `/tmp`, `/var`, or project-specific?

---

**From**: ธาม-Zeus (Chief of Staff)  
**Date**: 2026-06-19 07:55 +07  
**Status**: Ready to execute immediately — no blockers, high priority
