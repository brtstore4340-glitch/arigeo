---
name: config-should-be-self-discovering
description: Oracle configuration should flow from single source of truth, not duplicated across multiple files
metadata:
  type: feedback
  ttl: ∞
---

# Configuration Should Be Self-Discovering

**Pattern Observed**: Fleet status broadcast system git hook implementation (2026-07-16). Hardcoded oracle names in `.git/hooks/post-commit` files instead of reading from CLAUDE.md.

**The Mistake**: Created separate hook files for each oracle with hardcoded names:
```bash
# Zeus hook: ORACLE="Zeus"
# Luxi hook: ORACLE="Luxi"  
# Tham hook: ORACLE="ธาม"
```

When fleet grows to 50 oracles, maintaining 50 separate hook files with hardcoded oracle names becomes unmaintainable.

**Better Way**:
1. Store oracle identity in a single source of truth (CLAUDE.md, or separate `ψ/config/identity.json`)
2. Hooks read identity at runtime (not compile-time)
3. Deploy identical hook template to all oracles; each reads its own identity

**Example (Better)**:
```bash
# .git/hooks/post-commit (identical for all oracles)
ORACLE=$(grep "^- \*\*Name\*\*:" "$ORACLE_ROOT/CLAUDE.md" | sed 's/.*Name.*: //')
source scripts/fleet-emit.sh
oracle_emit "$ORACLE" "commit:pushed" "$(git log -1 --format=%s)" "info"
```

**Why This Matters**:
- **Scales to 100 oracles** — One hook template, not 100 hook files
- **Easy to change** — Edit CLAUDE.md identity once; all hooks pick it up
- **Clear source of truth** — No ambiguity about which oracle is running
- **Reduces git noise** — No duplicate hook files with 1-line differences

**How to Apply**:
When implementing fleet-wide features:
- DO: Read oracle identity from CLAUDE.md at runtime
- DON'T: Hardcode oracle name in scripts/config files
- DO: Create a single template that all oracles share
- DON'T: Create per-oracle variants unless truly different

**Scope**: Git hooks, CI/CD scripts, any automation that needs to know "who am I." Not applicable to: per-oracle business logic, oracle-specific features.

---

## Reference

**Related memory**: [[design-for-all-before-implement]] — Read all contexts first to understand differences; design once for all variants.

**Session**: /rrr 2026-07-16 fleet-status-phase-1-2 (git hook implementation detail; hardcoded names)

**Uncomfortable truth**: Recognized this during implementation but chose "simpler to ship now" over "better design for scale." Should have refactored after Phase 1 proved the concept worked.

---

*This is a generalizable pattern for any fleet-wide feature. Applies beyond Zeus to any multi-instance deployment.*
