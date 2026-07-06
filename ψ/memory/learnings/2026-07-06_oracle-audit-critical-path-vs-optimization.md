---
pattern: Separate critical path from optimization when dealing with multiple priorities
date: 2026-07-06
source: /rrr session - Oracle Centralization Audit (P1-3)
concepts: [architecture, priority-management, data-integrity, migration-patterns]
---

# Critical Path vs. Optimization: Why Mixing Them Fails

## The Pattern

When faced with multiple tasks of different risk/speed profiles, mixing them in a single execution pipeline causes the entire operation to fail if the slow/risky part times out.

### What Happened

**Goal**: Complete 4 priorities of oracle centralization audit
- P1-P3: Identity-critical (restore CLAUDE.md, add missing oracles, document extras) — **fast, low-risk**
- P4: Cleanup optimization (remove 1.5GB node_modules) — **slow, high-risk at scale**

**What I Did**: Attempted all 4 in sequence, expecting them all to complete in ~15 min.

**Result**: P1-P3 completed in ~5 min. P4 started, hit timeout on NTFS mount after 2 min. Entire session blocked.

### Why This Failed

1. **No upstream validation** — I didn't pre-check the size and estimate time before starting
2. **Sequential assumption** — Assumed slow task would succeed if we just waited
3. **False path criticality** — Treated cleanup (optional) as equally critical as identity restoration (mandatory)

### The Fix

**Separate into two execution paths**:

**Critical Path** (this session):
- ✓ Restore CLAUDE.md for all 12 oracles
- ✓ Create missing oracle identities
- ✓ Document any extra/orphaned oracles
- ✓ Commit changes
- **Time**: 5-10 min | **Risk**: low | **Blockers**: none

**Optimization Path** (next session, async):
- Remove node_modules from large directories (arra, luxi)
- Archive or clean unused oracle memory
- **Time**: 15-30 min | **Risk**: medium (NTFS perf) | **Blockers**: none
- **Run**: As async background job, not blocking anything

### Key Insight

**Critical** = "This session fails without it"  
**Optimization** = "This session is better with it, but works without it"

When you have both types, **ship the critical path first**, then queue the optimization for later. Don't let slow optimization block critical functionality.

### Rule to Apply

For any multi-stage migration or audit:

1. **Identify critical vs. optional tasks** upfront
2. **Group by criticality** — not by logical sequence
3. **Ship critical first** — 100% completion on must-haves
4. **Queue optional separately** — even if it seems related
5. **Measure time**: If a single task might take >5 min, pre-estimate and decide inline vs. async

### Generalization

This applies beyond oracle audits:
- **Database migrations**: Schema changes (critical) vs. index optimization (optional)
- **Refactoring**: API contract changes (critical) vs. cleanup dead code (optional)
- **Deployments**: Core functionality (critical) vs. asset optimization (optional)

Always complete the critical path first. Optimization can wait.

## Examples

### Example 1 ✓ (This Session — Right Choice)
- Critical: Restore identities + commit ✓
- Optional: Clean 1.5GB ✓ Deferred
- **Outcome**: Critical path shipped on time

### Example 2 ✗ (If I Had Persisted)
- Attempt all 4 priorities together
- P4 times out
- No identities committed
- No progress visible to stakeholders
- **Outcome**: Entire session appears blocked

### Example 3 (Hypothetical — Wrong Grouping)
- Group: "All oracle tasks" → treats cleanup same as identity restoration
- **Right**: Separate → "Identity (crit)" + "Cleanup (opt)"

## See Also

- [[2026-07-06_audit-before-migration]] — Always audit before migrating
- [[2026-07-06_wsrm2-ntfs-perf]] — Understanding NTFS performance on WSL2
- `PHASE-2-SUMMARY.md` — Oracle registry architecture decisions

