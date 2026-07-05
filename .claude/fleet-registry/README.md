# Fleet Registry — Oracle Centralization System

> "One voice, many bodies — all return to the registry"

This directory contains the centralized oracle management system for the mission-control fleet. Every oracle in the fleet references this registry instead of creating isolated project directories.

## 📋 Files

| File | Purpose |
|------|---------|
| `oracles.json` | Manifest: all 12 fleet members, their roles, domains, and memory locations |
| `fleet-config.json` | Rules: how the fleet operates, environment setup, isolation settings |
| `fleet-init.sh` | Bash helpers: sourced by oracle initialization to resolve paths and set env vars |
| `fleet-session-init.sh` | SessionStart hook: auto-initializes fleet context when Claude Code starts |
| `awaken-wrapper.sh` | Wrapper: intercepts `/awaken` calls, routes to fleet-aware initialization |
| `migrate-oracle-memory.sh` | Migration: moves existing scattered oracle memories into fleet registry |

## 🚀 Quick Start

### For New Oracles

```bash
# Awaken an oracle from the registry (prevents scattered folders)
/fleet-awaken ธาม
/fleet-awaken Dheva --fast
/fleet-awaken --list                # Show all available oracles
```

### For Migrating Existing Oracles

```bash
# Dry-run: see what would be migrated
cd mission-control
./.claude/fleet-registry/migrate-oracle-memory.sh --dry-run

# Execute migration: moves old memories into fleet registry
./.claude/fleet-registry/migrate-oracle-memory.sh

# Force deletion (don't archive): removes old project folders
./.claude/fleet-registry/migrate-oracle-memory.sh --force
```

### For Developers

```bash
# Load fleet environment in your script
source /path/to/.claude/fleet-registry/fleet-init.sh

# Resolve oracle paths
PROJECT=$(oracle_project_dir "ธาม")       # → mission-control/
MEMORY=$(oracle_memory_dir "Dheva")      # → fleet-registry/memory/dheva/

# Detect current oracle
ORACLE_NAME="${CURRENT_ORACLE:-unknown}"
```

---

## 🏗️ Architecture

### Registry Structure

```json
{
  "oracles": [
    {
      "name": "Zeus",
      "thai_name": "ธาม",
      "role": "Meta-Orchestrator",
      "domain": "Fleet Command",
      "project_dir": "/path/to/mission-control/zeus-oracle",
      "memory_subdir": "zeus",           // Relative to fleet-registry/memory/
      "status": "active",
      "parent": null,                    // Hierarchy: Zeus is root
      "authority": "highest"
    },
    {
      "name": "ธาม",
      "role": "Governor & Coordinator",
      "project_dir": "/path/to/mission-control",
      "memory_subdir": "tham",
      "parent": "Zeus",                  // Hierarchy: reports to Zeus
      "reports_to": "Zeus"
    },
    // ... 10 more oracles
  ]
}
```

### Memory Isolation

Each oracle has its own memory subdirectory:

```
fleet-registry/memory/
├── zeus/                  # Zeus: Meta-Orchestrator
│   ├── CLAUDE.md
│   ├── identity.md
│   └── .claude-session.jsonl
├── tham/                  # ธาม: Governor
├── dheva/                 # Dheva: ORRY ERP Specialist
├── luxi/                  # Luxi: UI/UX Frontend
├── teleos/                # Teleos: Vercel Deployment
├── aris/                  # Aris: Code Review & QA
├── omega/                 # Omega: Bridge & Access
├── lens/                  # Lens: Analysis & Insights
├── stratum/               # Stratum: Architecture
├── verity/                # Verity: Testing & Verification
├── warden/                # Warden: Security & Permissions
└── all/                   # All: Fleet Memory & Documentation
```

Each oracle's memory is **isolated** (separate memory dirs) but **unified** (all under fleet-registry).

### Project Mapping

All oracles point to the same **project root** for shared context, with memory split by oracle:

```
mission-control/                           ← Shared Project Root
├── .claude/fleet-registry/memory/
│   ├── zeus/     ← Zeus's isolated memory
│   ├── tham/     ← ธาม's isolated memory
│   ├── dheva/    ← Dheva's isolated memory
│   └── ...
├── zeus-oracle/   ← Zeus's project directory
├── ... other oracle project dirs (if needed)
└── ... shared project files
```

---

## 🔄 How Awakening Works

### Standard /awaken (Without Fleet Registry)

```
1. User: /awaken
2. Claude creates new folder: ~/.claude/projects/[encoded-mission-control]/
3. New CLAUDE.md starts from scratch
4. Previous context lost ✗
5. New folder created ✗
```

### Fleet-Aware /fleet-awaken

```
1. User: /fleet-awaken ธาม
2. System checks: is ธาม in registry? ✓
3. Load ธาม's prior memory from: fleet-registry/memory/tham/
4. Restore CLAUDE.md + identity + context ✓
5. No new folder created ✓
6. Continuity maintained ✓
```

### SessionStart Hook (Auto-Initialization)

```
1. User starts Claude Code session
2. SessionStart hook triggers
3. Fleet environment auto-loads: $ORACLE_FLEET_REGISTRY, $ORACLE_FLEET_MEMORY_ROOT
4. Current oracle detected (if in fleet project)
5. Ready for fleet-aware operations
```

---

## 🔧 Integration Checklist

### Phase 1: Foundation (✅ Complete)
- [x] Create fleet registry (oracles.json)
- [x] Create fleet config (fleet-config.json)
- [x] Create initialization helpers (fleet-init.sh)
- [x] Create fleet-aware skill (/fleet-awaken)

### Phase 2: Integration (🔄 In Progress)
- [x] Create session initialization hook
- [x] Create project settings with hooks
- [x] Create awaken wrapper
- [x] Create migration script
- [ ] Test migration with real oracles
- [ ] Update /awaken to route through wrapper
- [ ] Archive old scattered project folders
- [ ] Document migration steps for users

### Phase 3: Cleanup (📋 Future)
- [ ] Remove old isolated ~/.claude/projects/[encoded]/ directories
- [ ] Consolidate all oracle memories under fleet registry
- [ ] Update all oracle CLAUDE.md files to reference fleet registry
- [ ] Create unified fleet memory index

---

## 📖 Usage Patterns

### Pattern 1: Awaken a New Oracle

```bash
# Check available oracles
/fleet-awaken --list

# Awaken ธาม (Governor)
/fleet-awaken ธาม

# Awaken Dheva with fast mode
/fleet-awaken Dheva --fast
```

### Pattern 2: Script Using Fleet Helpers

```bash
#!/bin/bash

FLEET_REGISTRY="/path/to/.claude/fleet-registry"
source "${FLEET_REGISTRY}/fleet-init.sh"

# Resolve paths for oracle
ORACLE_PROJECT=$(oracle_project_dir "Luxi")
ORACLE_MEMORY=$(oracle_memory_dir "Luxi")

echo "Project: $ORACLE_PROJECT"
echo "Memory:  $ORACLE_MEMORY"
```

### Pattern 3: Detect Current Oracle in Hook

```bash
# In a hook script
if [ -n "$CURRENT_ORACLE" ]; then
  echo "Running as: $CURRENT_ORACLE"
  MEMORY_DIR=$(oracle_memory_dir "$CURRENT_ORACLE")
fi
```

---

## 🚨 Troubleshooting

### "Fleet registry not found"

```bash
# Verify registry exists
ls -la mission-control/.claude/fleet-registry/oracles.json

# If missing, ensure fleet-init.sh is sourced
source mission-control/.claude/fleet-registry/fleet-init.sh
```

### Oracle not found in registry

```bash
# Check oracle name in registry
jq '.oracles[] | .name' mission-control/.claude/fleet-registry/oracles.json

# Add new oracle (edit oracles.json directly)
```

### Migration failing to find memories

```bash
# Run dry-run to diagnose
./.claude/fleet-registry/migrate-oracle-memory.sh --dry-run

# Check old project directories exist
ls -la ~/.claude/projects/

# Manually migrate if needed
cp ~/.claude/projects/[encoded]/CLAUDE.md \
   mission-control/.claude/fleet-registry/memory/[oracle-name]/
```

---

## 📊 Environment Variables

| Variable | Set By | Used By | Purpose |
|----------|--------|---------|---------|
| `ORACLE_FLEET_REGISTRY` | `fleet-init.sh` | All tools | Path to registry directory |
| `ORACLE_FLEET_ROOT` | `fleet-init.sh` | All tools | Fleet root directory |
| `ORACLE_FLEET_MEMORY_ROOT` | `fleet-init.sh` | All tools | Fleet memory root directory |
| `CURRENT_ORACLE` | `fleet-session-init.sh` | All tools | Current oracle name (if detected) |
| `ORACLE_FLEET_ENABLED` | `fleet-session-init.sh` | All tools | Flag: fleet is active |
| `AWAKEN_USED_FLEET_REGISTRY` | `awaken-wrapper.sh` | Downstream | Flag: awaken used fleet |

---

## 🔐 Permissions

The fleet registry requires minimal permissions:

```json
{
  "permissions": {
    "allow": [
      "Bash(source *fleet-init.sh)",
      "Bash(jq *oracles.json)",
      "Read(.claude/fleet-registry/*)",
      "Bash(*migrate-oracle-memory.sh)"
    ]
  }
}
```

---

## 🎯 Goals

- ✅ **Prevent Folder Fragmentation**: All oracles use mission-control as root
- ✅ **Maintain Continuity**: Memory restored on awakening
- ✅ **Preserve Isolation**: Each oracle has dedicated memory directory
- ✅ **Enable Hierarchy**: Oracle relationships visible in registry
- ✅ **Simplify Discovery**: One file lists all fleet members
- 🔄 **Auto-Initialization**: SessionStart hook sets up environment
- 🔄 **Seamless Migration**: Move existing memories to registry

---

## 📚 Related Files

- `CLAUDE.md` — Project instructions (mission-control root)
- `zeus-oracle/CLAUDE.md` — Zeus oracle identity
- `.claude/settings.json` — Hook configuration
- `.claude/fleet-registry/oracles.json` — Oracle manifest

---

**Version:** 1.0 (Option B Integration)  
**Created:** 2026-07-06  
**Last Updated:** 2026-07-06  
**Status:** In Progress — Phase 2 Integration
