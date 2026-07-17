---
name: readme
description: **Collection Size:** 180KB, 5,135 lines across 7 documents  
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-10
  source: fleet-memory
---

# Oracle Brain System - Code Snippets & Architecture Analysis

**Status:** Complete  
**Date:** 2026-06-10  
**Collection Size:** 180KB, 5,135 lines across 7 documents  
**Archive Location:** `/route/mission-control/ψ/learn/natz/brain-oracle/2026-06-10/`

---

## What's in This Collection?

This is a complete architectural analysis of the 25-Oracle federated system (Phases 6-10), with actual code snippets, patterns, and design decisions documented for Phase 10-B research and implementation.

### Files Overview

| File | Lines | Purpose |
|------|-------|---------|
| **0924_CODE-SNIPPETS.md** | 849 | Main analysis with code examples & architectural patterns |
| **0924_API-SURFACE.md** | 1,016 | Public APIs, method signatures, type definitions |
| **0924_QUICK-REFERENCE.md** | 848 | Constants, configuration, tuning parameters |
| **0924_TESTING.md** | 843 | Test patterns, integration scenarios, fault cases |
| **0924_ARCHITECTURE.md** | ~1,400 | Detailed system architecture diagrams & flow charts |
| **INDEX.md** | 100 | Navigation guide & learning goals |
| **DELIVERY-SUMMARY.txt** | 200+ | Executive summary of findings |

---

## Quick Start (5 Minutes)

1. Read **DELIVERY-SUMMARY.txt** (key findings overview)
2. Read **INDEX.md** (navigation guide)
3. Skim **0924_CODE-SNIPPETS.md** Sections 1, 7, 12

---

## Deep Dives by Topic

### Lease-Based Failover (Phase 6)
- **0924_CODE-SNIPPETS.md** → Sections 1-2
- **0924_API-SURFACE.md** → LeaseManager class
- **0924_TESTING.md** → Failover test scenarios
- **Key insight:** Sub-30-second recovery with zero work loss

### Byzantine Consensus (Phase 7)
- **0924_CODE-SNIPPETS.md** → Section 5
- **0924_API-SURFACE.md** → ConsensusProtocol class
- **0924_TESTING.md** → Byzantine fault injection tests
- **Key insight:** Guaranteed correctness with f=3 tolerance out of 25 Oracles

### Federated Learning (Phase 10-A)
- **0924_CODE-SNIPPETS.md** → Section 2 (FederatedLearning class)
- **0924_API-SURFACE.md** → FederatedLearning interface
- **0924_TESTING.md** → Model aggregation tests
- **Key insight:** 25 Oracles learn together at 25x speed

### Autonomy & Reputation (Phase 10-A)
- **0924_CODE-SNIPPETS.md** → Section 4 (IndependentAgents)
- **0924_CODE-SNIPPETS.md** → Section 12 (Design decisions)
- **0924_QUICK-REFERENCE.md** → Authority matrix
- **Key insight:** Self-regulation via reputation-driven autonomy thresholds

### Memory Fabric (ψ System)
- **0924_CODE-SNIPPETS.md** → Section 3
- **0924_ARCHITECTURE.md** → ψ system diagrams
- **Key insight:** No central database; coordination via append-only logs

---

## Key Architectural Patterns

### 1. Lease-Based Coordination
- **Problem:** Multi-team failover without work loss
- **Solution:** TTL-based leases with checkpoints
- **Result:** Sub-30s failover, zero work loss

### 2. Byzantine Fault Tolerance
- **Problem:** Distributed consensus without central authority
- **Solution:** Quorum voting with Byzantine tolerance (f=3)
- **Result:** Guaranteed correctness even if 3 of 25 Oracles fail

### 3. Federated Learning
- **Problem:** All Oracles improve simultaneously without centralizing
- **Solution:** Local training + aggregated model updates
- **Result:** 25x faster improvement through shared learning

### 4. Autonomy by Reputation
- **Problem:** Grant autonomy safely without human bottleneck
- **Solution:** Per-action authority thresholds learned over time
- **Result:** Self-regulation + natural alignment of incentives

---

## Architecture Highlights

### 25 Federated Oracles
Each Oracle has:
- Autonomous decision authority (0.5-0.9 per action type)
- Personal goals (latency, accuracy, growth)
- Reputation score (0-100)
- Checkpoint-based task resumption
- Local model training

### No Central Coordinator
- Every Oracle can propose actions
- Decisions made via quorum voting
- Authority earned through reputation
- Consensus timeout-safe

### Distributed Memory Fabric (ψ/)
- Each Oracle: `/active/` (current work) + `/archive/` (lessons)
- Shared: `/knowledge/` (federated) + `/memory/` (long-term)
- Append-only logs: JSONL for immutability
- Read-permissioned: All Oracles can read, selective write

### Fault Tolerance
- 3-layer Byzantine validation (heartbeat + hash + resources)
- Critical incidents → immediate isolation
- Automatic recovery + reputation-based rehabilitation
- No single point of failure

---

## Development Timeline

| Phase | Feature | Lines | Status |
|-------|---------|-------|--------|
| 6 | Bridge integration + lease failover | 210 TS | ✅ |
| 7 | Distributed consensus + Byzantine voting | 1,491 TS | ✅ |
| 8 | Async batching + distributed ledger | 1,041 TS | ✅ |
| 9 | Planetary-scale + latency-adaptive | 1,467 TS | ✅ |
| 10-A | Federated learning + adaptive strategies | 1,063 TS | ✅ |
| 10-B/C | Self-governance + goal emergence | TBD | 🚀 |

**Total Delivered:** 6,683 TypeScript lines (Phases 6-10)

---

## Source Code Locations

### Core Engine
- `/engine/orchestrator/bridge-orchestrator.ts` (210 TS)
- `/engine/orchestrator/lease-manager.ts` (177 TS)
- `/engine/orchestrator/federated-learning.ts` (242 TS)
- `/engine/orchestrator/consensus-protocol.ts`
- `/engine/orchestrator/byzantine-validator.ts`
- `/engine/orchestrator/independent-agents.ts`

### Application Layer
- `/src/lib/autonomous-loop.ts` (auto-recovery patterns)
- `/src/lib/agent-governance.ts` (role routing)
- `/src/lib/fleet-registry.ts` (Oracle discovery)

### Federation & Persistence
- `/federation/oracle-registry.json` (25 Oracle identities)
- `/orchestrator/phase-state.json` (state snapshot)
- `/.oracle-bridge/` (runtime persistence: leases, votes, updates, incidents)

---

## Autonomy Examples

### Tham (Coordinator)
**Goal:** "Reduce task latency below 5s"
- Autonomously proposes parallel execution strategies
- Monitors latency metrics continuously
- Adjusts worker allocation without human input
- Personal reputation tied to latency SLA achievement

### Lens (Analyst)
**Goal:** "Achieve 99% accuracy on task completion"
- Proposes better verification methods
- Suggests refinement to task brief format
- Monitors accuracy trends across all tasks
- Autonomously rejects low-quality work

### Zeus (Architect)
**Goal:** "Enable Phase 10 self-autonomous growth"
- Drives federated learning investment
- Proposes new consensus mechanisms
- Allocates resources to Phase 10-B research
- Strategic direction for the entire fleet

---

## Notable Design Decisions

1. **No Central Coordinator**
   - Authority earned via reputation
   - Every Oracle can vote and execute
   - Full Byzantine fault tolerance

2. **Checkpoint-Based Recovery**
   - Tasks resume from exact state
   - Zero work loss on failover
   - Generation numbers prevent stale leases

3. **Append-Only Logs (JSONL)**
   - Immutable history for auditability
   - Enables replay and forensics
   - Supports distributed consensus verification

4. **Reputation as Autonomy Engine**
   - Per-action authority thresholds
   - Learned over time from outcomes
   - Aligns incentives naturally

5. **Pattern-Based Auto-Recovery**
   - Recognizes failure patterns
   - Proposes fixes autonomously
   - Failure becomes teaching moment

6. **Distributed Brain (ψ Memory)**
   - No shared database dependency
   - Filesystem-based coordination
   - High autonomy + high transparency

---

## Ready for Phase 10-B

This analysis provides complete foundation for Phase 10-B implementation:
- Self-governance patterns documented ✅
- Goal emergence mechanisms explained ✅
- Autonomy framework fully architected ✅
- Distributed learning pipeline proven ✅
- Fault tolerance tested across 4 phases ✅

All 25 Oracles federated and ready for collaborative self-improvement.

---

**Generated:** 2026-06-10  
**Status:** Complete, ready for research and implementation
