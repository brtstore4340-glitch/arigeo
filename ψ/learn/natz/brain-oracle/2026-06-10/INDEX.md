---
name: index
description: 
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-10
  source: fleet-memory
---

# Oracle Brain System - Documentation Index

**Collection Date:** 2026-06-10  
**Archive Location:** `/route/mission-control/ψ/learn/natz/brain-oracle/2026-06-10/`

## Files in this Collection

### 1. **0924_CODE-SNIPPETS.md** (849 lines, 30KB)
Comprehensive code analysis and architecture overview.

**Contents:**
- Section 1: Main Entry Points (BridgeOrchestrator)
- Section 2: Core Implementations (Lease Manager, Byzantine Validator, Federated Learning)
- Section 3: Memory Patterns (ψ system, Oracle Registry)
- Section 4: Autonomy & Decision-Making (IndependentAgents, Autonomous Recovery)
- Section 5: Distributed Consensus (Quorum Voting Protocol)
- Section 6: Agent Governance & Routing
- Section 7: Novel Architectural Patterns (4 core patterns explained)
- Section 8: Complete Task Execution Flow with Failover
- Section 9: Key Constants & Tuning Reference
- Section 10: Persistence & Recovery Mechanisms
- Section 11: Phases 6-10 Development Timeline
- Section 12: Notable Design Decisions

---

## Source Code Locations

### Core Engine (`/engine/orchestrator/`)
- `bridge-orchestrator.ts` - Phase 6 multi-team coordination (210 TS)
- `lease-manager.ts` - TTL-based lease system (177 TS)
- `task-broker.ts` - Task bidding & assignment
- `parallel-executor.ts` - Concurrent task execution
- `failover-recovery.ts` - Automatic failure detection & recovery
- `state-sync.ts` - Distributed state synchronization
- `consensus-protocol.ts` - Byzantine quorum voting
- `byzantine-validator.ts` - Fault detection & isolation
- `federated-learning.ts` - Shared knowledge aggregation (242 TS)
- `independent-agents.ts` - Oracle autonomy framework
- `consensus-evolver.ts` - Adaptive consensus tuning

### Application Layer (`/src/lib/`)
- `autonomous-loop.ts` - Auto-recovery loop (pattern recognition)
- `agent-governance.ts` - Agent routing & role assignment
- `agent-availability.ts` - Capacity planning
- `agent-sync.ts` - State synchronization
- `fleet-registry.ts` - Oracle discovery

### Memory & Federation
- `federation/oracle-registry.json` - 25 Oracle identities & specs
- `orchestrator/phase-state.json` - Current orchestration state
- `.oracle-bridge/` - Runtime persistence (leases, votes, incidents, updates)
- `ψ/` - Distributed memory fabric

---

## Key Architectural Patterns

### 1. Lease-Based Multi-Team Failover (Phase 6)
- **TTL:** 30 seconds (heartbeat every 5s)
- **Checkpoint:** Task state preserved on each renewal
- **Transfer:** Generation increment prevents stale leases
- **Result:** Sub-30s failover without work loss

### 2. Byzantine Fault Tolerance (Phase 7)
- **Config:** 25 Oracles, f=3 tolerance, quorum=13
- **Validation:** 3-layer (heartbeat + state hash + resources)
- **Isolation:** Critical incidents → immediate isolation
- **Recovery:** Automatic healing + reputation recovery

### 3. Federated Learning (Phase 10-A)
- **Local Training:** Each Oracle improves on task feedback
- **Aggregation:** Model weights averaged by accuracy
- **Versioning:** Global model version prevents skew
- **Distribution:** New model synced to all 25 Oracles

### 4. Autonomy by Reputation (Phase 10-A)
- **Authority Matrix:** Per-action thresholds (0.5–0.9)
- **Decision Rules:** Execute if random() < authority[action]
- **Learning:** Good outcomes → +reputation → +autonomy
- **Incentive:** Self-regulation toward optimal authority

---

## Timeline: Phases 6-10 (Delivered 2026-06-10)

| Phase | Feature | Lines | Status |
|-------|---------|-------|--------|
| **6** | Bridge integration + lease failover | 210 TS | ✅ |
| **7** | Distributed consensus + Byzantine | 1,491 TS | ✅ |
| **8** | Async batching + distributed ledger | 1,041 TS | ✅ |
| **9** | Planetary-scale + latency-adaptive | 1,467 TS | ✅ |
| **10-A** | Federated learning + strategies | 1,063 TS | ✅ |
| **10-B/C** | Self-governance + goal emergence | TBD | 🚀 |

**Total:** 6,683 TypeScript lines across 5 completed phases.

---

**Archive Created:** 2026-06-10 09:30 UTC
