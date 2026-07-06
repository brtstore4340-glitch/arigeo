---
pattern: "Governor Acts When Agent Chain Breaks — Set 10s timeout on delegation before executing directly"
date: 2026-06-11
source: "rrr: mission-control (Phase 10-B)"
concepts: ["delegation", "orchestration", "agent-management", "timeout", "governor-pattern"]
---

# Lesson: Governor Acts When Agent Chain Breaks

## Pattern

When agent delegation (maw dispatch, tmux send, inbox message) exceeds **10 seconds with no response**, the Governor (Zeus) should execute the task directly instead of continuing to escalate.

## Why This Matters

**Session evidence**:
- Dispatched Phase 10-B to Khun-Ram (tmux 10:zeus) → no response visible in pane
- Escalated to Codex-rider (already busy with Aeimathes Challenge) → still blocked
- Attempted Hermes dispatch (skill not found) → another delay
- **Spent 2-3 minutes on delegation overhead** that direct execution could have completed in 15-20 seconds of work

**The pattern**:
- Delegation cost = initialization (env, context load, skill invoke) + round-trip (message, queue, response) = 5-15s overhead
- Phase 10-B task size = ~30s direct execution (write 5 components + tests + docs in one bash session)
- Delegation overhead ~= task execution time → **no point delegating at this scale**

## How to Apply

**Decision tree**:
1. Estimate task duration: < 2 hours?
2. Estimate delegation cost: > 10s (init + round-trip)?
3. IF both true → execute directly, don't delegate

**Timeout rule**:
```typescript
// Pseudo-code for next Governor session
const DELEGATION_TIMEOUT = 10_000; // ms
const taskStart = Date.now();

// Try delegation via maw dispatch
const dispatchPromise = maw.send({ task: "PHASE10B", target: "codex-rider" });

// Wait with timeout
const result = await Promise.race([
  dispatchPromise,
  sleep(DELEGATION_TIMEOUT).then(() => "timeout")
]);

if (result === "timeout") {
  console.log("Agent busy — executing directly");
  // Implement Phase 10-B directly (Zeus authority)
} else {
  // Use delegated result
}
```

## Related Principles

- **Principle 3 (External Brain, Not Command)**: Governor doesn't bypass team autonomy — it *unlocks blocked paths* when necessary
- **Lean Mode (Merged Zeus-Tham)**: Zeus should only intervene when Tham+team are stuck; direct action is valid intervention

## Edge Cases

| Scenario | Action |
|----------|--------|
| Agent responds within 5s | Use delegation (agent has capacity) |
| Agent busy (queue visible) | Set longer timeout (30s) + check status |
| Agent unresponsive (no signal) | Direct action after 10s |
| Task is non-critical | Use delegation anyway (spread load) |
| Task blocks critical path | Direct action immediately (safety override) |

## Next Application

- Phase 10-C: Delegate to Codex with fallback timeout logic
- Future governance: Teach other Oracles this pattern (may generalize to any agent timeout scenario)

---

**Recorded**: 2026-06-11 10:46 GMT+7  
**Priority**: Medium (improves orchestration efficiency, not correctness)
