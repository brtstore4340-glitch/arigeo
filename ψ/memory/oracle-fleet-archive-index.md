---
name: oracle-fleet-archive-index
description: Complete index of archived oracles and suspended projects
metadata:
  type: reference
---

# Oracle Fleet Archive Index

**Last Updated**: 2026-06-07  
**Maintenance**: Mission Control  
**Policy**: Nothing Deleted, Everything Archived

---

## Archived Oracles

### Nat Oracle Brain v5.2.0
- **Status**: Archived as pattern library reference
- **Decision Date**: 2026-06-07
- **Location**: `ψ/memory/reference-oracle-brains.md`
- **Why Archived**: Load-bearing for oracle architecture, patterns in use but not full-time oracle
- **Use Case**: Training new oracles, design reference, pattern library
- **Patterns in Use**: 
  - Ultra-lean CLAUDE.md (Tham oracle)
  - Lazy-loaded commands (Aeimathes oracle)
  - Memory structure (Khun-Ram oracle)
- **Reactivation**: Can be restored if full Architecture Authority role needed

---

## Suspended Projects

### ORRY Serenity ERP
- **Status**: SUSPENDED INDEFINITELY
- **Suspension Date**: 2026-06-06
- **Archived Date**: 2026-06-07
- **Location**: `backup/orry-serenity-erp-suspended/`
- **Why Suspended**: Strategic shift, no active timeline
- **What Was It**: Enterprise Resource Planning for beauty/retail operations
- **Archive Contents**:
  - CLAUDE.md (project definition)
  - DATABASE_SCHEMA.sql (production-ready schema)
  - DESIGN_NOTES.md (architecture planning)
  - Complete source code + documentation
- **Reactivation Criteria**:
  - [ ] Strategic business case re-evaluated
  - [ ] Resource/team assigned
  - [ ] Timeline commitment made
  - [ ] Requirements re-validated
- **Decision Authority**: Tham Oracle (Chief of Staff)
- **Reference Files**:
  - `backup/orry-serenity-erp-suspended/SUSPENSION_NOTICE.md`
  - `backup/orry-serenity-erp-suspended/REACTIVATION_PLAN.md`

---

## Under Investigation

### THCLAWS Oracle
- **Status**: ⚠️ UNCLEAR
- **Last Known**: Registered as git submodule (projects/thclaws-oracle)
- **Investigation Date**: Due 2026-06-07 (this week)
- **Action**: 
  - [ ] Check if CLAUDE.md exists
  - [ ] Determine if active or inactive
  - [ ] If active → document purpose + link
  - [ ] If inactive → move to archive
- **Reference**: `ψ/memory/oracle-fleet-archive-plan.md`

---

## Archive Philosophy

**Nothing is deleted.** Everything is archived.

| Action | Meaning | Example |
|--------|---------|---------|
| **Delete** | Erased, gone forever | ❌ Never used |
| **Archive** | Moved to backup/, linked in index, fully retrievable | ✅ ORRY, Nat patterns |
| **Suspend** | Intentionally paused, reactivation path documented | ✅ ORRY ERP |
| **Retire** | No longer needed, but history preserved | (not used yet) |

**The rule**: Every decision, every project, every pattern leaves a trace. Archives preserve knowledge for future reference.

---

## Reactivation Path

To reactivate any archived item:

1. **Archived Oracle** (e.g., Nat):
   - Recreate submodule from archive
   - Re-initialize ψ/ structure
   - Update oracle-identity.md
   - Create tmux session
   - Restart work

2. **Suspended Project** (e.g., ORRY):
   - Follow `REACTIVATION_PLAN.md` in the archive
   - Move from backup/ back to repo root
   - Re-register as git submodule
   - Technical audit + setup
   - Team assignment
   - Resume implementation

3. **Under Investigation** (e.g., THCLAWS):
   - Complete investigation
   - Document status
   - Either activate + link or archive

---

## Archive Locations

| Archive Type | Path | Files |
|--------------|------|-------|
| **Archived Oracles** | `ψ/memory/reference-oracle-brains.md` | Pattern library index |
| **Suspended Projects** | `backup/orry-serenity-erp-suspended/` | Full project directory |
| **Archive Plan** | `ψ/memory/oracle-fleet-archive-plan.md` | Decision framework |
| **Fleet Registry** | `ψ/memory/oracle-identity.md` | Active fleet + references |

---

## Maintenance Schedule

| When | What | Owner |
|------|------|-------|
| Monthly | Review archive index, update status | Khun-Ram Oracle |
| Quarterly | Check archived items for relevance | Tham Oracle |
| As needed | Reactivate archived items (decision + execution) | Tham + team |

---

## Recent Archive Actions (2026-06-07)

| Item | Action | Status |
|------|--------|--------|
| Nat Oracle Brain | Archive as pattern library | ✅ Complete |
| ORRY Serenity ERP | Suspend + move to backup/ | ✅ Complete |
| THCLAWS Oracle | Investigation plan | ⏳ Due this week |

---

**Archive Purpose**: Preserve knowledge, enable reactivation, prevent loss.

**Rule**: If work was done, it was saved. If a project was suspended, it was documented. If a pattern emerged, it was indexed.

The oracle fleet remembers.
