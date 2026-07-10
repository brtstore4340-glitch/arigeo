# Fleet Registry & Coordination Architecture

> "One voice, many bodies — all return to the registry."

This directory contains the centralized oracle management system for the mission-control fleet. Moving beyond basic folder isolation, the Fleet Registry serves as the foundational **Multi-Agent System (MAS)** coordination layer, integrating deterministic State Ledgers, Dynamic Discovery, and Reconciliation mechanisms for the full organization phase.

## 🏗️ Architecture: The Coordination Fabric

Our MAS architecture relies on four core pillars to ensure observability, fault tolerance, and secure execution at scale.

### 1. Shared Registry (The "Who & What")
The registry acts as the system's identity and service discovery layer.
- **Agent Identity & Capabilities:** Defined in `oracles.json`. Includes roles, domains, routing rules, and hierarchy (e.g., Zeus as Meta-Orchestrator, ธาม as Governor).
- **Credential Metadata:** `PROJECT_REGISTRY.md` serves as the master reference map. **Safety First Rule:** No raw secrets are stored here; it strictly maps project environments to external Vault or Environment Variable references to keep metadata machine-readable and secure.

### 2. Work Ledger (The "How & When")
We are transitioning from legacy text-based logs (`consensus-ledger.jsonl`) to a **Boring, Durable SQLite Ledger** (`trans_4340_*.sqlite`).
- **Transactional Integrity:** SQLite supports concurrent writes from multiple agents, solving the JSONL file-locking bottlenecks during high-throughput async batching.
- **Granular Receipts:** Every discrete agent action (bead) is appended to the ledger, enabling deterministic replays, audit trails, and resumability if an agent crashes mid-task.

### 3. Ownership & Lease Management (The "Lock")
To prevent tasks from hanging indefinitely (Zombie Tasks):
- **Time-based Leases (TTL):** When an agent checks out a task from the ledger, it acquires a lease. If the agent fails to report back within the TTL window, the lease expires.
- **Exclusive Authority:** Only the active leaseholder can invoke associated tools or access environment credentials for that specific task, preventing race conditions.

### 4. Reconciliation (The "Truth")
A background safety net ensuring the Work Ledger intent matches the actual environment state.
- **Liveness Checks:** Periodically scans for and revokes expired leases, returning abandoned work to the pool for other oracles to claim.
- **State Sync:** Mechanisms like `healPartition()` resolve divergent ledgers across network boundaries or parallel execution streams to ensure consensus.

---

## 📋 Registry Files

| File | Purpose |
|------|---------|
| `oracles.json` | Manifest: all fleet members, roles, capabilities, and hierarchy |
| `fleet-config.json` | Rules: environment setup, lease TTL configurations, and routing |
| `PROJECT_REGISTRY.md` | Schema-mapped metadata index (Strictly NO raw secrets) |
| `fleet-init.sh` | Bash helpers: sources paths and env vars during agent awakening |
| `fleet-session-init.sh` | SessionStart hook: auto-initializes fleet context |
| `awaken-wrapper.sh` | Wrapper: intercepts `/awaken` calls, routes to fleet-aware initialization |
| `migrate-oracle-memory.sh` | Migration: consolidates legacy isolated memories into the registry |

---

## 🚀 Quick Start

### For New Oracles

```bash
# Awaken an oracle from the registry
/fleet-awaken ธาม
/fleet-awaken Dheva --fast
/fleet-awaken --list                # Show all registered agents
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

## 🔄 Integration Checklist (Phase 3: Production Scale)

### Phase 1 & 2: Foundation & Isolation (✅ Complete)
- [x] Create fleet registry manifest (`oracles.json`)
- [x] Create fleet-aware initialization scripts and `/awaken` wrappers
- [x] Consolidate isolated `.claude/projects/` into unified `fleet-registry/memory/`
- [x] Implement initial text-based ledger (`consensus-ledger.jsonl`)

### Phase 3: Robust Multi-Agent Coordination (🔄 In Progress)
- [ ] **Ledger Migration:** Migrate `consensus-ledger.jsonl` to SQLite (`trans_4340_*.sqlite`) for concurrency support.
- [ ] **Lease Mechanism:** Implement TTL-based task ownership in the database schema.
- [ ] **Registry Hardening:** Enforce strict JSON/YAML schema validation for `PROJECT_REGISTRY.md` to ensure machine-readability.
- [ ] **Reconciliation Worker:** Deploy a background cron/worker to run liveness checks and `healPartition()` automatically.

---

## 🚨 Troubleshooting

### "Fleet registry not found"
```bash
# Verify registry exists
ls -la mission-control/.claude/fleet-registry/oracles.json

# If missing, ensure fleet-init.sh is sourced
source mission-control/.claude/fleet-registry/fleet-init.sh
```

### Ledger Concurrency Issues / File Locks
*If using the legacy JSONL ledger and encountering write errors:*
Fall back to sequential batching or accelerate the Phase 3 SQLite migration to handle concurrent `async-consensus-engine` writes.

---

## 🔐 Permissions & Security

The fleet registry enforces strict credential isolation:
- Agents only receive access to the specific environment variables referenced by their active task's metadata.
- **Never** commit `.env` or raw secrets into `PROJECT_REGISTRY.md` or the SQLite ledger.

---

**Version:** 2.0 (Phase 3: Full Organization Scale)  
**Created:** 2026-07-06  
**Last Updated:** 2026-07-09  
**Status:** Transitioning to SQLite Ledger & Active Lease Management
