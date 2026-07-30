---
name: design-for-all-before-implement
description: Design once for all contexts before implementing; avoid iterate-then-adapt trap when deploying across multiple instances
metadata:
  type: feedback
  ttl: ∞
---

# Design-for-All Before Implement (Not Iterate-Then-Adapt)

**Pattern Observed**: Token optimization system deployment across 3 oracles (Zeus, Luxi, Tham).

**The Mistake**: Implemented Zeus fully (comprehensive context budget rules, memory system, cache), then replicated to Luxi and Tham with local adaptations. Caught inconsistencies late (during implementation, not design).

**Examples of Late Catches**:
- Luxi gitignore doesn't exclude /ψ/ (unlike Zeus/Tham) — discovered during implementation
- Tham already had a 6-item budget rules section — had to *replace* not *append* — discovered during implementation
- Project directories for cache.json didn't exist yet — discovered during implementation

**The Better Way**:
1. **Read all contexts first** — scan all 3 CLAUDE.md files, understand differences (branches, ignores, existing sections)
2. **Design once** — architect the system for *all* oracle variants simultaneously, not for Zeus as template
3. **Implement once** — apply design to all 3 in parallel, no iteration/rework cycles
4. **Verify** — one pass to check all 3

**Why This Matters**:
- Reduces rework (no "adapt Zeus design to Luxi" iterations)
- Catches variant differences *before* implementation (upfront design thinking)
- Scales to 10+ oracles (design-for-all is O(n), iterate-then-adapt is O(n²))
- Documentation is clearer (spec written for all, not retrofitted)

**How to Apply**:
When deploying a system across N > 1 oracle instances:
- DO: Read all N CLAUDE.md / .gitignore / relevant files upfront
- DO: Ask "what's different about each oracle?" — branch names, existing sections, patterns
- DO: Design with all N variants in mind (one design, N implementations)
- DON'T: Implement for oracle #1, then adapt for #2 and #3
- DON'T: Assume all oracles have the same structure (they don't — Zeus/Tham differ from Luxi)

**Applies To**: Any fleet-wide system deployment (cache, memory, rules, protocols, CI/CD). Not just oracles.

**Caught**: 2026-07-16, token optimization deployment. Rework was minimal because inconsistencies were caught in implementation, but they should have been caught in design.

---

*This is a generalizable rule, not session-specific feedback. Apply to next fleet deployment.*
