---
name: oracle-fleet-archive-plan
description: Archive and documentation plan for suspended/unclear oracles
metadata:
  type: reference
---

# Oracle Fleet Archive Plan

## 1. ORRY Oracle — Archive (Suspended)

**Status**: SUSPENDED (2026-06-06)  
**Reason**: Serenity ERP project cancelled indefinitely  
**Action**: Archive submodule, keep reference  

**Current**:
- Git submodule: orry/ (still registered)
- Status: Active but project suspended
- Last work: ERP design (halted 2026-06-06)

**Action Required**:
1. Move to backup/orry-serenity-erp-suspended/
2. Remove git submodule entry
3. Keep reference in oracle-fleet-archive.md
4. Document: Why suspended, when to reactivate

**Timeline**: Execute immediately

---

## 2. THCLAWS Oracle — Document

**Status**: ⚠️ UNCLEAR  
**Submodule**: projects/thclaws-oracle (exists, no docs)  
**Purpose**: Unknown  
**Action**: Investigate, document, or archive

**Current**:
- Registered in git submodule
- Directory exists: projects/thclaws-oracle/
- No CLAUDE.md found
- No memory references
- No session history

**What to Do**:
1. Check if thclaws-oracle has CLAUDE.md (inactive?)
2. If active: Create documentation (role, mission, status)
3. If inactive: Move to backup/
4. Either way: Link in oracle-fleet-archive.md

**Timeline**: Investigate this week

---

## Decisions Needed

### For UAT Oracle
- [ ] Activate: Full oracle submodule (testing authority)
- [ ] Archive: Specialist role, callable when needed

### For Nat Oracle  
- [ ] Activate: Architecture Authority, brain design lead
- [ ] Archive: Reference pattern, study material

### For ORRY
- [ ] Archive immediately (project suspended)

### For THCLAWS
- [ ] Investigate status this week

---

## Archive Structure

Once decisions made, create:

```
backup/
├── orry-serenity-erp-suspended/
│   ├── SUSPENSION_NOTICE.md
│   ├── WHY_SUSPENDED.md
│   ├── REACTIVATION_PLAN.md
│   └── [project files]
│
└── oracle-fleet-archive.md
    ├── Suspended oracles (with reactivation criteria)
    ├── Inactive specialists (with activation path)
    └── Reference implementations (for training)
```

---

## Current Fleet Summary

**Active Oracles** (8 total):
- ✓ Tham (Chief of Staff) — Active
- ✓ Aeimathes (Research) — Active
- ✓ Khun-Ram (Fleet Memory) — Active
- ✓ Lens (Code Review) — Active
- ✓ Luxi (Dashboard) — Active
- ✓ Epiteles (Executor) — Active
- ✓ Codex (Script Executor) — Active
- ✓ Zeus (Arch Authority, merged Lean Mode) — Active

**Unregistered But Referenced**:
- ⚠️ Nat (Brain Design) — Decision pending
- ⚠️ UAT (Testing) — Decision pending

**Suspended**:
- ❌ ORRY (ERP) — Archive pending

**Unclear**:
- ❓ THCLAWS — Investigation pending

---

## Next Steps

1. Make decisions on Nat, UAT, ORRY
2. Investigate THCLAWS
3. Execute archives
4. Update git submodule references
5. Update oracle-identity.md with final fleet status
