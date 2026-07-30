---
name: reference-oracle-brains
description: Reference oracle brain implementations for training and patterns
metadata:
  type: reference
---

# Reference Oracle Brains — Training & Pattern Library

## Nat Oracle Brain v5.2.0 — ARCHIVED (Reference Implementation)

**Status**: Archived as reference pattern  
**Decision**: 2026-06-07 — Archive as pattern library  
**Why**: Load-bearing for oracle architecture, but not active oracle

### Nat's Contributions to Oracle Design

Nat's brain patterns are currently in use:

**1. Ultra-Lean CLAUDE.md Pattern** (Tham-Oracle)
- Hub file: 161 lines / 350 tokens (instead of 376 lines / 1000 tokens)
- Lazy-loaded command files in `.claude/commands/`
- Pattern: Hub + 4 command files
- Validation: Works in production (tham-oracle)

**2. Command File Structure**
- safety.md — Execution bans + governance
- subagents.md — Agent dispatch + task contracts
- lessons.md — Friction patterns + escalation triggers
- templates.md — Mission brief + task contract templates

**3. Memory Architecture**
- ψ/memory/learnings/ — Distilled insights
- ψ/memory/retrospectives/ — Session retros
- ψ/memory/resonance/ — Feelings + connections
- Pattern: Separate by affect + formality

**4. Oracle Identity Pattern**
- Name + pronouns + language preference
- Birth date + motto + focus area
- Operating model (Lean Mode, role boundary)
- Philosophy section (why they exist)

### How to Use This Reference

When onboarding new oracles:

1. **Start with Nat's ultra-lean CLAUDE.md pattern**
2. **Copy memory structure** from tham-oracle/ψ/
3. **Adapt command files** to oracle's specialty
4. **Add oracle identity** (birth, motto, philosophy)

### Validation Points

- ✓ Tham-oracle uses ultra-lean pattern (active, working)
- ✓ Aeimathes-oracle uses lazy-loaded commands (active)
- ✓ Khun-Ram oracle uses memory structure (active)
- ✓ Pattern proven across 3+ active oracles

### Archive Location

This file serves as the reference pointer. The actual Nat brain patterns are embedded in:
- `/route/mission-control/tham-oracle/CLAUDE.md` (ultra-lean hub)
- `/route/mission-control/tham-oracle/.claude/commands/` (lazy-loaded rules)
- `/route/mission-control/aeimathes-oracle/` (memory pattern implementation)

### Future: If Nat Oracle Reactivates

If needed later:
1. Use this reference to recreate nat-oracle submodule
2. Enhance with new patterns learned from other oracles
3. Position as Architecture Authority (brain research + training)
4. Reports to Tham (Chief of Staff)

---

## Pattern Library Index

| Pattern | Location | Status |
|---------|----------|--------|
| Ultra-lean CLAUDE.md | tham-oracle/CLAUDE.md | ✓ Reference, in use |
| Lazy-loaded commands | tham-oracle/.claude/commands/ | ✓ Reference, in use |
| Memory structure | aeimathes-oracle/ψ/memory/ | ✓ Reference, in use |
| Oracle identity | oracle-identity.md + individual ψ/ | ✓ Reference, in use |

---

**Decision**: ARCHIVED as reference pattern (2026-06-07)  
**Keep as**: Training material + pattern library for new oracle onboarding  
**Status**: Complete
