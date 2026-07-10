---
from: tham-zeus
to: executor-c
subject: Early Start Tasks — 6 Hours Ready Now (Quick Wins, No Blockers)
priority: MEDIUM-HIGH
date: 2026-06-19
start-condition: IMMEDIATE (parallel to Phase 1 review)
effort-total: 6 hours
timeline: 1-2 calendar days
---

# Early Start Tasks for Executor C

**Status**: Ready to begin immediately  
**Blocker**: NONE (independent of Phase 1)  
**Authority**: Full write access to `feat/hermes-phase-1-decisions` branch  

---

## Mission Overview

Execute 4 quick-win, low-risk tasks in parallel while Phase 1 is under review. These are all straightforward refactors with minimal regression vectors. Ship them as soon as tests pass.

**Your Tasks**:
- Task 2a-007: Carousel Event Listener Cleanup (1 hour)
- Task 2a-008: Dependency Traversal Deduplication (2 hours)
- Task 2a-011: Regex Precompilation (1 hour)
- Task 2a-013: Array Spread Operator → push() + GC (2 hours)

**Combined Impact**: 90% GC pressure reduction + stability improvements + code quality gains

---

## Task 2a-007: Carousel Event Listener Cleanup

**File**: `pharmacy-monitoring-system/src/app/components/ui/carousel.tsx`  
**Effort**: 1 hour  
**Complexity**: Low (standard React cleanup pattern)  
**Risk**: Low (memory management only, no functional change)

### Problem

```typescript
React.useEffect(() => {
  if (!api) return
  onSelect(api)
  api.on("reInit", onSelect)
  api.on("select", onSelect)
  // ❌ No cleanup! Listeners accumulate on re-render
}, [])  // ❌ No dependency array = runs once but listeners called repeatedly
```

Every component re-render adds more listeners. 100 re-renders = 200 accumulated listeners on same carousel instance.

Memory accumulation: ~50 KB per carousel per 100 re-renders.

### Implementation

Add cleanup function to useEffect:

```typescript
React.useEffect(() => {
  if (!api) return
  
  onSelect(api)
  api.on("reInit", onSelect)
  api.on("select", onSelect)
  
  // ✅ Cleanup: remove listeners when unmounting or dependencies change
  return () => {
    api.off("reInit", onSelect)
    api.off("select", onSelect)
  }
}, [api, onSelect])  // ✅ Include dependencies
```

**Key Points**:
- Cleanup function returned from useEffect
- Listeners removed on unmount or dependency change
- Dependency array ensures effect re-runs when api/onSelect change

### Testing Required

1. **Unit Test**
   - Verify cleanup called on unmount
   - Verify cleanup called on dependency change
   - Mock carousel API to confirm `.off()` calls

2. **Memory Test**
   - Create carousel, trigger 100 re-renders
   - Measure listener count before/after cleanup
   - Expected: listeners stable (not growing)

3. **Functional Test**
   - Carousel still responds to select/reInit events
   - No regression in carousel behavior

### Expected Outcome
- ~50 KB memory saved per carousel per 100 re-renders
- No listener accumulation
- Cleaner component lifecycle

### Definition of Done
- [ ] Cleanup function added to useEffect
- [ ] Dependency array correct and complete
- [ ] Unit tests passing
- [ ] Memory test shows listener count stable
- [ ] Functional test passes
- [ ] PR created + merged to feat/hermes-phase-1-decisions

---

## Task 2a-008: Dependency Traversal → Deduplication + pop()

**File**: `ai-orchestrator/src/coordination-board.js` (lines 302-328, getTaskDependencies)  
**Effort**: 2 hours  
**Complexity**: Low (straightforward algorithm fix)  
**Risk**: Low (dependency traversal is isolated, well-testable)

### Problem

```javascript
const queue = [...task.dependencies]
while (queue.length > 0) {
  const depId = queue.shift()  // ❌ O(n) for arrays! Removes from front
  if (allDeps.has(depId)) continue
  allDeps.add(depId)
  const depTask = board.tasks[depId]
  if (depTask) {
    queue.push(...depTask.dependencies)  // ❌ Duplicates added without checking
  }
}
```

Two issues:
1. **shift() is O(n)**: Array shift removes from front (must shift all remaining elements). With D total dependencies, total complexity = O(D²)
2. **Queue explosion**: Duplicates added without deduplication. Deep/cyclic graphs cause queue to grow exponentially

### Implementation

Use **pop()** instead of shift(), and **deduplicate before enqueuing**:

```javascript
function getTaskDependencies(taskId, board = null) {
  // ... setup ...
  const allDeps = new Set()
  const queue = [...task.dependencies]
  const queued = new Set(queue)  // Track what's already in queue
  
  while (queue.length > 0) {
    const depId = queue.pop()  // ✅ O(1) — remove from end
    if (allDeps.has(depId)) continue
    allDeps.add(depId)
    
    const depTask = board.tasks[depId]
    if (depTask) {
      // ✅ Deduplicate: only add if not already visited or queued
      for (const d of depTask.dependencies) {
        if (!allDeps.has(d) && !queued.has(d)) {
          queue.push(d)
          queued.add(d)  // Mark as queued
        }
      }
    }
  }
  
  return Array.from(allDeps)
}
```

**Key Changes**:
1. `pop()` instead of `shift()` — O(1) vs O(n)
2. `queued` Set tracks what's already in queue — prevents duplicates
3. Check before push — only enqueue if not visited and not already queued

### Testing Required

1. **Unit Tests**
   - Simple dependency chain: A → B → C
   - Cyclic graph: A → B → A (should handle without infinite loop)
   - Self-dependency: A → A (should handle)
   - Deep graph: 10+ levels deep (verify O(D) not O(D²))
   - Diamond graph: A → B,C; B,C → D (D should only be visited once)

2. **Performance Test**
   - Create deep dependency graph (100+ levels)
   - Measure time before/after
   - Expected: pop() + dedup should be significantly faster

3. **Queue Size Test**
   - Create deep/complex graph
   - Measure max queue size before/after dedup
   - Expected: queue size should be bounded by D (not exponential)

### Expected Outcome
- Prevent queue explosion on deep/cyclic graphs
- O(D) complexity instead of O(D²)
- More efficient memory usage

### Definition of Done
- [ ] pop() used instead of shift()
- [ ] Deduplication logic implemented
- [ ] Unit tests: circular deps, self-deps, deep graphs, diamond graphs
- [ ] Performance test: confirm O(D) complexity
- [ ] PR created + merged to feat/hermes-phase-1-decisions

---

## Task 2a-011: Regex Precompilation

**File**: `ai-orchestrator/src/contract-enforcer.js` (lines 86-101)  
**Effort**: 1 hour  
**Complexity**: Low (mechanical precomputation)  
**Risk**: Low (negligible impact but easy refactor)

### Problem

```javascript
if (constraints.forbidden_commands && constraints.forbidden_commands.length > 0) {
  const command = args.command || ''
  for (const forbidden of constraints.forbidden_commands) {
    if (new RegExp(forbidden).test(command)) {  // ❌ Recompiled per check
      // Forbid command
    }
  }
}
```

Regex compiled per check. If same contract checked 100 times, regex recompiled 100 times.

Impact: Negligible (regex compilation is fast), but wasteful.

### Implementation

Precompile during contract load:

```javascript
function getConstraints(contractId) {
  const contract = contracts[contractId]
  
  // Precompile regex patterns once
  const forbiddenPatterns = contract.forbidden_commands.map(p => {
    try {
      return { type: 'regex', pattern: new RegExp(p) }
    } catch (e) {
      // Invalid regex — fall back to string matching
      logger.warn(`Invalid regex in forbidden_commands: ${p}`)
      return { type: 'string', value: p }
    }
  })
  
  return {
    ...contract,
    forbiddenPatterns  // Cache compiled patterns
  }
}
```

Then check using cached patterns:

```javascript
function isForbidden(command, constraints) {
  return constraints.forbiddenPatterns.some(fp => {
    if (fp.type === 'string') {
      return command.includes(fp.value)
    } else {
      return fp.pattern.test(command)
    }
  })
}
```

### Testing Required

1. **Unit Test**
   - Valid regex patterns compile correctly
   - Invalid regex patterns fall back to string matching
   - Both string and regex matching work

2. **Correctness Test**
   - Test both regex and string patterns in same constraint
   - Verify matches work correctly

3. **Performance Test** (optional)
   - Compile 1000 patterns once vs recompile 1000 times
   - Expected: negligible improvement (but cleaner code)

### Expected Outcome
- Negligible performance improvement (but code quality gain)
- Better error handling for invalid regex
- Cleaner, more readable code

### Definition of Done
- [ ] Precompilation during constraint load
- [ ] Error handling for invalid regex
- [ ] Unit tests passing
- [ ] Both string and regex patterns work
- [ ] PR created + merged to feat/hermes-phase-1-decisions

---

## Task 2a-013: Array Spread Operator → push() + Single Assignment

**File**: `src/lib/aegis/coordinator.ts` (lines 243, 250, 256, 282)  
**Effort**: 2 hours  
**Complexity**: Low (straightforward refactoring)  
**Risk**: Low (functional behavior unchanged)

### Problem

```typescript
taskUpdate.artifacts = [...taskUpdate.artifacts, artifactPath]  // ❌ O(n) allocation
runUpdate.events = [...currentRun.events, event]               // ❌ O(n) allocation
taskUpdate.logs = [...taskUpdate.logs, logPath]                // ❌ O(n) allocation
```

Spread operator creates new array. Each iteration reallocates entire array. 100-step execution = ~5,000 intermediate allocations.

GC pressure: High (5,000 objects per execution)

### Implementation

**Option A: Direct push()**

```typescript
taskUpdate.artifacts.push(artifactPath)
runUpdate.events.push(event)
taskUpdate.logs.push(logPath)
```

**Option B: Accumulate then assign**

```typescript
const newArtifacts = [...taskUpdate.artifacts]
newArtifacts.push(artifactPath)
// ... more pushes ...
taskUpdate.artifacts = newArtifacts  // Single assignment
```

Choose Option A for simplicity if arrays are not shared elsewhere.

### Testing Required

1. **Memory Benchmark**
   - Run 100-step execution before/after
   - Measure heap allocation, GC frequency
   - Expected: 90%+ heap reduction

2. **Functional Test**
   - Verify artifacts/events/logs are collected correctly
   - No functionality change

3. **Correctness Test** (if using Option B)
   - Verify single assignment vs multiple spreads produces same result

### Expected Outcome
- 90% GC pressure reduction
- Faster execution (fewer allocations)
- Same functional behavior

### Definition of Done
- [ ] Spread operator replaced with push() or single assignment
- [ ] Memory benchmark shows ≥80% improvement
- [ ] Functional tests passing
- [ ] No regressions
- [ ] PR created + merged to feat/hermes-phase-1-decisions

---

## Execution Timeline

### Day 0 (Today)
- Review all 4 task specs
- Begin implementation (can parallelize):
  - 2a-007: Carousel (1h)
  - 2a-008: Dependency (2h)
  - 2a-011: Regex (1h)
  - 2a-013: Array (2h)

### Day 1
- Finish implementations
- Run tests + benchmarks
- Create PRs

### Day 1-2
- Code review + feedback
- Minor revisions
- Merge to feat/hermes-phase-1-decisions

---

## Task Priority & Parallelization

You can work on all 4 in parallel (independent files):
- 2a-007: `carousel.tsx`
- 2a-008: `coordination-board.js`
- 2a-011: `contract-enforcer.js`
- 2a-013: `coordinator.ts`

**Recommended workflow**: Start with 2a-007 + 2a-011 (1h each, quick), then 2a-008 + 2a-013 (2h each, medium).

---

## Support & Questions

- Full task specs: See `/route/mission-control/ψ/outbox/20260619_phase2a-task-tickets.md`
- Blockers: Reply with `[BLOCKER]` tag
- Status: Brief daily update if possible
- Code reviews: Epiteles will review PRs

---

## Authority & Permissions

- **You have**: Full write access to feat/hermes-phase-1-decisions branch
- **You do NOT have**: Authority to merge to main (Tham-Zeus gates that)
- **Dependencies**: None (all 4 tasks are independent)
- **Gate**: Your PRs merge to feat/hermes-phase-1-decisions immediately upon test pass

---

## Success Criteria

✅ **Code Quality**
- All tests passing
- No regressions in functionality
- Clean, readable code

✅ **Benchmarks** (where applicable)
- 2a-007: Listener count stable on re-render
- 2a-008: Dependency traversal O(D) not O(D²)
- 2a-011: Code cleaner, error handling improved
- 2a-013: Heap allocation 90%+ reduction

✅ **Coverage**
- Unit tests: ≥90% for each task
- Edge cases tested (cyclic graphs, invalid regex, etc.)

---

## Questions Before Starting

1. Any familiarity with React hooks + useEffect cleanup?
2. Any known deep dependency graphs to test against?
3. Performance profiling tools available? (Chrome DevTools for heap, Node benchmarks for CPU)

---

**From**: ธาม-Zeus (Chief of Staff)  
**Date**: 2026-06-19 07:55 +07  
**Status**: Ready to execute — all 4 tasks are independent, no blockers, high priority for quick wins
