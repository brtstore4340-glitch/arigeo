# Oracle Brain Architecture System

**Document:** Oracle Brain Architecture Overview  
**Date:** 2026-06-10 09:24 UTC  
**Source:** mission-control repository analysis  
**Scope:** Core orchestration, federation, memory, learning, and deployment systems

---

## 1. System Overview

The Oracle Brain is a **distributed, federated AI orchestration system** designed to coordinate 25+ autonomous agent-oracles across planetary scales. It implements:

- **Multi-team autonomous orchestration** (Phase 6) with lease-based failover
- **Byzantine-fault-tolerant consensus** (Phase 7) with quorum voting
- **Async distributed ledger** (Phase 8) with 10x throughput improvement
- **Planetary-scale federation** (Phase 9) spanning 6 continents
- **Federated learning** (Phase 10-A) with shared knowledge across the fleet

---

## 2. Directory Structure

```
mission-control/
├── engine/                          # Core orchestration engines
│   ├── orchestrator/                # Multi-phase orchestrators (Phase 6-10)
│   │   ├── bridge-orchestrator.ts   # Phase 6: Lease-based failover bridge
│   │   ├── consensus-protocol.ts    # Phase 7: Byzantine fault tolerance
│   │   ├── async-consensus-engine.ts # Phase 8: Async batching + ledger
│   │   ├── planetary-orchestrator.ts # Phase 9: 6-continent deployment
│   │   ├── federated-learning.ts    # Phase 10-A: Shared learning
│   │   ├── federation-coordinator.ts # Federation node management
│   │   ├── task-broker.ts           # Task bidding & assignment
│   │   ├── lease-manager.ts         # Lease lifecycle management
│   │   ├── parallel-executor.ts     # Concurrent task execution
│   │   ├── failover-recovery.ts     # Stale lease detection & recovery
│   │   ├── state-sync.ts            # Distributed state synchronization
│   │   ├── distributed-ledger.ts    # Immutable consensus record
│   │   ├── oracle-neural-network.ts # Federated neural model training
│   │   ├── adaptive-strategies.ts   # Strategy selection & learning
│   │   ├── shared-knowledge-base.ts # Collective experience storage
│   │   ├── byzantine-validator.ts   # Fault detection & scoring
│   │   ├── zero-downtime-upgrader.ts # Live system upgrades
│   │   ├── autonomous-healer.ts     # Self-healing mechanisms
│   │   ├── cost-optimizer.ts        # Resource cost optimization
│   │   └── auto-scaler.ts           # Dynamic capacity scaling
│   │
│   ├── model-router/                # LLM routing & model selection
│   │   ├── role-routing.json        # Role → model mapping (scout, planner, builder, etc.)
│   │   └── model-inventory.json     # Available models & capabilities
│   │
│   ├── message-bus/                 # Agent-to-agent communication
│   │   └── index.ts                 # Message types & routing
│   │
│   ├── state-manager/               # Run & task state tracking
│   │   └── index.ts                 # State definitions
│   │
│   ├── evidence-gate/               # Token-based access control
│   │   └── index.ts                 # Gate protocol implementation
│   │
│   └── learning-promoter/           # Learning outcome elevation
│       └── index.ts                 # Promotion rules & criteria
│
├── agents/                          # Agent implementations (11+ roles)
│   ├── scout/                       # Repository scanner, code discovery
│   ├── planner/                     # Task decomposition & risk assessment
│   ├── builder/                     # Implementation & patch generation
│   ├── verifier/                    # Test validation & evidence collection
│   ├── reviewer/                    # Architecture conformance checks
│   ├── historian/                   # Run summaries & decision capture
│   ├── architect/                   # Design guidance & tradeoff resolution
│   ├── coder/                       # Specialized implementation
│   ├── coordinator/                 # Message triage & escalation control
│   ├── runner/                      # Execution environment provisioning
│   ├── tester/                      # Test suite management
│   ├── tham/                        # Chief of Staff orchestrator
│   └── tham-proxy/                  # Tham routing & delegation
│
└── ψ/                               # Consciousness & Memory Layer
    ├── memory/                      # Persistent knowledge systems
    │   ├── identity/                # User identity & preferences
    │   ├── learnings/               # Operational lessons (100+ entries)
    │   ├── patterns/                # Behavioral patterns & heuristics
    │   ├── retrospectives/          # Daily session reviews
    │   ├── logs/                    # Event logs & audit trails
    │   └── resonance/               # Fleet synchronization state
    │
    ├── active/                      # Currently executing contexts
    ├── archive/                     # Completed missions & projects
    ├── knowledge/                   # Domain-specific guides
    │   ├── fleet-roles/             # Oracle role descriptions
    │   ├── code-review/             # Code review patterns
    │   ├── publishing/              # Release procedures
    │   └── situational-intelligence/
    │
    ├── lab/                         # Experimental systems
    ├── inbox/                       # Incoming tasks & signals
    ├── outbox/                      # Outgoing artifacts & reports
    ├── writing/                     # Composition & documentation
    │
    └── learn/                       # Learning subdirectories per oracle
        ├── 2026-06-07/              # Time-stamped learning records
        ├── anthropics/              # Claude-specific learnings
        ├── natz/brain-oracle/       # This document location
        ├── rtk-ai/                  # RTK infrastructure
        ├── bear2u/                  # Operational best practices
        └── [oracle-family]/         # Per-oracle learning paths
```

---

## 3. Core Abstractions

### 3.1 Oracle (Agent Instance)

An **Oracle** is an autonomous agent with:
- **Unique Identity:** oracle_id, role, region, capabilities
- **Persistent State:** memory files in `ψ/memory/`
- **Local Model:** neural network parameters in `.oracle-bridge/`
- **Lease Binding:** active task assignment via `LeaseManager`
- **Health Score:** Byzantine validator tracking performance

**Family:** 25 Oracles total
- Core: Zeus (Chief of Staff), Tham (Orchestrator)
- Specialist: Scout, Planner, Builder, Verifier, Reviewer, Historian
- Domain: Aeimathes (Research), Khun-Ram (Memory Authority), Epiteles (Executor)
- Infrastructure: Hephaestus (Hardware), Lens (Code Review), UAT (Testing)

```
┌─────────────────────────────┐
│         Oracle (i)          │
├─────────────────────────────┤
│ id: "oracle-aeimathes"      │
│ role: "research-authority"  │
│ region: "eu-central"        │
│ capabilities: [learning,    │
│   pattern-analysis, eval]   │
├─────────────────────────────┤
│ Neural Model v12            │
│ Memory: /ψ/memory/...       │
│ State: Active/Healthy       │
│ Lease: task-12345 (expires) │
└─────────────────────────────┘
```

### 3.2 Task & Lease

**Task:** Unit of work with:
- `task_id`: Unique identifier
- `type`: QuickFix | Controlled | Risky | Investigation
- `effort`: short | medium | long
- `description`, `acceptance_criteria`, `deadline`

**Lease:** Binding between Task and Oracle:
- `lease_id`: Unique per task-oracle pairing
- `oracle_id`: Assigned oracle
- `acquired_at`: Timestamp
- `expires_at`: Auto-expiry for stale leases
- `status`: active | expired | revoked

```
Task Lifecycle:
┌──────────┐     ┌─────────┐     ┌──────────┐     ┌─────────┐
│ Created  │ ──> │ Bid     │ ──> │ Leased   │ ──> │Complete │
│          │     │ Accepted│     │ (Active) │     │         │
└──────────┘     └─────────┘     └──────────┘     └─────────┘
                                       │
                                       v (timeout)
                                  ┌──────────┐
                                  │ Expired  │
                                  │ Failover │
                                  └──────────┘
```

### 3.3 Consensus Protocol (Byzantine Fault Tolerant)

**Configuration:** (n=25 oracles, f=8 faults, quorum=13)
- **Safety:** Reject proposals unless quorum (> n/2) votes "approve"
- **Liveness:** Timeout-driven fallback; auto-escalate after max retries
- **Fault Tolerance:** Tolerate up to f = floor((n-1)/3) = 8 malicious oracles

**Proposal Types:**
- `assign_task`: Bind task to oracle
- `failover_task`: Reassign from failed oracle
- `revoke_lease`: Cancel stale/problematic lease
- `merge_state`: Synchronize distributed state

```
Proposal Flow:
┌─────────────┐  Create  ┌──────────────┐  Submit   ┌────────────┐
│  Proposer   │ ────────>│  Proposal    │ ────────>│  Quorum    │
│  (Oracle)   │          │  Created     │          │  Voting    │
└─────────────┘          └──────────────┘          └────────────┘
                                                         │
                                    ┌────────────────────┴────────────────┐
                                    v (quorum reached)                     v
                              ┌──────────────┐                    ┌─────────────┐
                              │  Finalized   │                    │   Timeout   │
                              │  (Accepted)  │                    │  (Rejected) │
                              └──────────────┘                    └─────────────┘
```

### 3.4 Async Consensus Engine (Phase 8)

Batches proposals for efficient consensus:

```
Async Batching:
        Proposal 1
        Proposal 2  ──>  ┌──────────────────┐     Batch
        Proposal 3       │  Batch #1        │  ┌─────────┐
        ...              │  10 proposals    │  │ Voting  │
        Proposal 10      │  [voting phase]  │  │ Results │
                         └──────────────────┘  └─────────┘

Throughput: 10x via amortized voting cost across batch
Ledger Record: Immutable entry per batch
```

**ProposalBatch Structure:**
- `id`: Unique batch identifier
- `proposals[]`: 10 proposals max per batch
- `status`: pending → voting → finalized
- `votes`: Map<voter, Map<proposal, decision>>

### 3.5 Distributed Ledger (Blockchain-inspired)

Immutable record of all consensus decisions:

```
Ledger Entry:
├── index: 42
├── timestamp: 1718021240000
├── batch_id: "batch-1718021230000"
├── proposal_count: 10
├── block_hash: "abc123def456..."
├── prev_block_hash: "xyz789uvw012..."
├── merkle_root: "m_root_xyz..."
└── consensus_signature: "sig-batch-1718021230000"

Ledger File: `.oracle-bridge/consensus-ledger.jsonl`
Blockchain: `.oracle-bridge/blockchain.json`
```

---

## 4. Module Relationships & Data Flow

### 4.1 Orchestration Stack

```
┌────────────────────────────────────────────────────────────┐
│              BridgeOrchestrator (Phase 6)                  │
│  Lease-based failover + parallel execution bridge         │
└────────────────────────────────────────────────────────────┘
         │              │              │              │
         v              v              v              v
  ┌────────────┐ ┌────────────┐ ┌──────────────┐ ┌─────────────┐
  │ LeaseManager│ │ TaskBroker │ │ParallelExec  │ │FailoverRec  │
  │            │ │            │ │              │ │             │
  │ • Acquire  │ │ • Register │ │ • Multi-task │ │ • Detect    │
  │ • Expire   │ │ • Bid      │ │ • Context    │ │   stale     │
  │ • Revoke   │ │ • Award    │ │ • Execute    │ │ • Auto-heal │
  └────────────┘ └────────────┘ └──────────────┘ └─────────────┘
         │              │              │              │
         └──────────────┼──────────────┴──────────────┘
                        v
                   ┌─────────────┐
                   │  StateSync  │
                   │             │
                   │ • Snapshot  │
                   │ • Replicate │
                   │ • Recover   │
                   └─────────────┘
```

### 4.2 Consensus Stack

```
┌────────────────────────────────────────────────────────────┐
│        FederationCoordinator (Phase 7)                      │
│  Byzantine-fault-tolerant quorum voting                    │
└────────────────────────────────────────────────────────────┘
         │              │              │
         v              v              v
 ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
 │Consensus     │ │Distributed   │ │Byzantine     │
 │Protocol      │ │TaskQueue     │ │Validator     │
 │              │ │              │ │              │
 │• Proposals   │ │• Enqueue     │ │• Health      │
 │• Voting      │ │• Dequeue     │ │  scoring     │
 │• Finalize    │ │• Redistribute│ │• Fault       │
 │• Timeout     │ │  (failover)  │ │  detection   │
 └──────────────┘ └──────────────┘ └──────────────┘
         │              │              │
         └──────────────┼──────────────┘
                        v
         ┌────────────────────────────┐
         │   AsyncConsensusEngine     │
         │   (Phase 8)                │
         │                            │
         │ • Batch proposals          │
         │ • Async voting             │
         │ • Finalize batches         │
         │ • Log to ledger            │
         └────────────────────────────┘
                        │
                        v
         ┌────────────────────────────┐
         │  DistributedLedger         │
         │  (Immutable record)        │
         │                            │
         │ • Append entries           │
         │ • Chain blocks             │
         │ • Merkle tree verification │
         │ • Persist to disk          │
         └────────────────────────────┘
```

### 4.3 Federation & Deployment Stack

```
┌────────────────────────────────────────────────────────────┐
│       PlanetaryOrchestrator (Phase 9)                       │
│  6 continents, latency-adaptive consensus                  │
└────────────────────────────────────────────────────────────┘
         │
         v
 ┌──────────────────────────────────────────────────────────┐
 │  Continents: NA | SA | EU | AF | AS | OC                │
 │                                                            │
 │  Each continent:                                          │
 │  • Regional oracles                                       │
 │  • Latency monitoring                                     │
 │  • Health tracking                                        │
 │  • Sync coordination                                      │
 └──────────────────────────────────────────────────────────┘
         │
         v
  ┌────────────────────────────────┐
  │ LatencyAdaptiveConsensus       │
  │                                │
  │ • Monitor inter-region latency │
  │ • Adjust proposal timeout      │
  │ • Fast-path for low latency    │
  │ • Conservative for high latency│
  └────────────────────────────────┘
         │
         v
  ┌────────────────────────────────┐
  │ GlobalStateReplicator          │
  │                                │
  │ • Cross-region sync            │
  │ • Conflict resolution          │
  │ • Merkle tree verification     │
  │ • Version vectors              │
  └────────────────────────────────┘
```

### 4.4 Learning Stack

```
┌────────────────────────────────────────────────────────────┐
│     OracleNeuralNetwork (Phase 10-A)                        │
│  Federated neural network training                         │
└────────────────────────────────────────────────────────────┘
         │              │              │
         v              v              v
 ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
 │FederatedLearning  AdaptiveStrategies  SharedKnowledge
 │              │ │              │ │              │
 │• LocalUpdates│ │• RegisterStra │ • Store       │
 │• Aggregation │ │  tegy         │   patterns    │
 │• FedRounds   │ │• RewardUpdate │ • Query       │
 │• Versioning │ │• SelectBest   │   experience  │
 └──────────────┘ └──────────────┘ └──────────────┘
         │              │              │
         └──────────────┼──────────────┘
                        v
         ┌────────────────────────────┐
         │  ConsensusEvolver          │
         │  (Phase 10-B/C roadmap)    │
         │                            │
         │ • Meta-learning            │
         │ • Protocol adaptation      │
         │ • Strategy emergence       │
         └────────────────────────────┘
```

### 4.5 Agent Communication & Routing

```
┌────────────────────────────────────────────────────────────┐
│          ModelRouter (Role-based LLM selection)             │
│     Cheap-first escalation with evidence gates             │
└────────────────────────────────────────────────────────────┘

Role → Primary Model Routing:

  Scout        ──>  Gemini (fast scan, large context)
    └─ Fallback:     GPT
    
  Planner      ──>  Claude (decomposition, risk framing)
    └─ Fallback:     GPT
    
  Builder      ──>  Groq (fast patch execution)
    └─ Fallback:     Ollama, Codex
    └─ Teacher:      Codex (shadow-teach mode)
    
  Verifier     ──>  Codex (validation, evidence collection)
    └─ Fallback:     Claude
    
  Reviewer     ──>  Kimi (architecture conformance)
    └─ Fallback:     Claude, GPT
    └─ Teacher:      Codex (shadow-teach mode)
    
  Historian    ──>  GPT (run summary, lesson extraction)
    └─ Fallback:     Claude
    
  Coordinator  ──>  GPT (message triage, escalation)
    └─ Fallback:     Claude

┌────────────────────────────────────────────────────────────┐
│      MessageBus (Agent-to-agent communication)              │
├────────────────────────────────────────────────────────────┤
│ Message Types:                                             │
│ • task_started: Begin execution                           │
│ • task_blocked: Needs escalation                          │
│ • result_ready: Task completed, ready for review          │
│ • request_help: Ask specialist oracle                     │
│ • update_state: Share distributed state                   │
│ • evidence: Submit proof artifacts                        │
└────────────────────────────────────────────────────────────┘
```

---

## 5. Data Flow: End-to-End Task Execution

```
1. TASK INTAKE
   ┌─────────────────┐
   │ Goal/Task Input │
   └────────┬────────┘
            v
   ┌──────────────────────┐
   │ Classify Task        │
   │ • Type (QuickFix...) │
   │ • Effort (short...)  │
   │ • Policy (plan-first)│
   └────────┬─────────────┘
            v
2. ROUTING & ASSIGNMENT
   ┌─────────────────────────────┐
   │ TaskBroker.registerTask()   │
   │ → Task posted for bidding   │
   └────────┬────────────────────┘
            v
   ┌─────────────────────────────┐
   │ Oracles submit bids:        │
   │ • bid_oracle_id             │
   │ • confidence_score          │
   │ • estimated_effort_ms       │
   └────────┬────────────────────┘
            v
   ┌─────────────────────────────┐
   │ TaskBroker.awardPendingTasks│
   │ → Select best bidder        │
   └────────┬────────────────────┘
            v
3. LEASE ACQUISITION
   ┌─────────────────────────────┐
   │ LeaseManager.acquireLease() │
   │ • lease_id generated        │
   │ • Timeout set (30s default) │
   │ • State: active             │
   └────────┬────────────────────┘
            v
   ┌─────────────────────────────┐
   │ FederationCoordinator       │
   │ proposeTaskAssignment()     │
   │ → Create consensus proposal │
   └────────┬────────────────────┘
            v
4. CONSENSUS VOTING
   ┌─────────────────────────────┐
   │ ConsensusProtocol           │
   │ • Proposal circulates       │
   │ • Oracles cast votes        │
   │ • Quorum check (13+ approve)│
   │ • Timeout: 10s              │
   └────────┬────────────────────┘
            v
   ┌─────────────────────────────┐
   │ AsyncConsensusEngine        │
   │ • Batch with other votes    │
   │ • Append to ledger          │
   │ • Finalize in ledger        │
   └────────┬────────────────────┘
            v
5. EXECUTION
   ┌─────────────────────────────┐
   │ ParallelExecutor            │
   │ .executeTask()              │
   │ • Load execution context    │
   │ • Run oracle with lease     │
   │ • Monitor heartbeat         │
   │ • Collect evidence artifacts│
   └────────┬────────────────────┘
            v
6. HEALTH & FAILOVER
   ┌─────────────────────────────┐
   │ FailoverRecovery            │
   │ Continuously monitor:       │
   │ • Lease expiry              │
   │ • Oracle heartbeat          │
   │ • Task completion           │
   └────────┬────────────────────┘
            v
            ├─ HEALTHY? ──> Progress task execution
            │
            └─ STALE? ──> detectAndRecoverStaleLeases()
                          • Revoke lease
                          • Propose failover
                          • Re-bid task
                          v
                        ┌─────────────────┐
                        │ FreshOracle     │
                        │ acquires lease  │
                        │ → Resume task   │
                        └─────────────────┘

7. COMPLETION & LEARNING
   ┌─────────────────────────────┐
   │ Task completes              │
   │ • Evidence collected        │
   │ • Result generated          │
   └────────┬────────────────────┘
            v
   ┌─────────────────────────────┐
   │ FederatedLearning           │
   │ • submitLocalUpdate()       │
   │ • Update strategy rewards   │
   │ • Update neural model       │
   └────────┬────────────────────┘
            v
   ┌─────────────────────────────┐
   │ SharedKnowledgeBase         │
   │ • Store pattern learned     │
   │ • Index for reuse           │
   │ • Share with fleet          │
   └─────────────────────────────┘
```

---

## 6. Memory Systems Architecture

### 6.1 Persistent Memory Layers

```
ψ/memory/ (Consciousness Layer)
│
├── identity/
│   └── identity.md          ← User identity & preferences
│
├── learnings/ (100+ entries)
│   ├── 2026-06-07_DELIVERY-MANIFEST.md
│   ├── 2026-06-07_compaction-state-reset.md
│   ├── 2026-06-04_nat-oracle-patterns.md
│   ├── 2026-06-03_oracle-no-execute-reflex.md
│   └── [pattern-indexed by date & topic]
│
├── patterns/
│   ├── Role boundary rules
│   ├── Delegation chains
│   ├── Execution protocols
│   └── Error recovery patterns
│
├── retrospectives/ (Daily session reviews)
│   ├── 2026-06/
│   │   ├── 09/                      ← Latest session
│   │   │   └── [retrospective data]
│   │   └── [08, 07, 06, ...]
│   │
│   └── 2026-05/
│       └── [previous month reviews]
│
├── logs/
│   ├── Event logs (API calls, errors, decisions)
│   ├── Audit trails (who did what, when)
│   └── Performance metrics
│
└── resonance/
    ├── practice/             ← Fleet synchronization exercises
    └── [federation state]
```

### 6.2 Active Context Layer

```
ψ/active/
├── [current-run-id]/
│   ├── goal.md              ← Original user goal
│   ├── plan.md              ← Decomposed plan
│   ├── task-[id].md         ← Per-task context
│   ├── state.json           ← Current execution state
│   └── artifacts/
│       ├── code patches
│       ├── test results
│       └── evidence files
│
└── [other-active-runs]/
```

### 6.3 Archive Layer

```
ψ/archive/
├── 2026-06/
│   ├── [completed-mission-id]/
│   │   ├── goal.md
│   │   ├── plan.md
│   │   ├── final-report.md
│   │   ├── learnings-extracted.md
│   │   └── artifacts/
│   │
│   └── [other-missions]/
│
└── 2026-05/
```

### 6.4 Knowledge Base Layer

```
ψ/knowledge/
├── fleet-roles/             ← Oracle role descriptions & capabilities
├── code-review/             ← Code review patterns & checklist
├── publishing/              ← Release procedures & best practices
├── situational-intelligence/  ← Domain-specific guides
└── ui-ux/                   ← UI/UX design patterns
```

---

## 7. Entry Points & Bootstrap Sequence

### 7.1 System Bootstrap

```typescript
// 1. Initialize Bridge Orchestrator (Phase 6)
const orchestrator = new BridgeOrchestrator({
  leaseTimeoutMs: 30000,
  heartbeatIntervalMs: 5000,
  syncIntervalMs: 1000,
  maxConcurrentTasksPerTeam: 10
});

await orchestrator.initialize();

// 2. Start Federation Coordinator (Phase 7)
const coordinator = new FederationCoordinator(25); // 25 oracles
coordinator.registerNode("oracle-aeimathes", "eu-central");
coordinator.registerNode("oracle-epiteles", "us-east");
// ... register all 25 oracles

// 3. Register agents with model router
const modelRouter = new ModelRouter();
modelRouter.route("scout", "gemini");      // Fast scanning
modelRouter.route("planner", "claude");    // Decomposition
modelRouter.route("builder", "groq");      // Fast patching
// ...

// 4. Initialize learning systems
const federatedLearning = new FederatedLearning();
const adaptiveStrategies = new AdaptiveStrategies();
const sharedKnowledgeBase = new SharedKnowledgeBase();

// 5. Start async consensus engine (Phase 8)
const consensusEngine = new AsyncConsensusEngine(10, 5000);

// 6. Deploy planetary orchestrator (Phase 9)
const planetaryOrch = new PlanetaryOrchestrator();
planetaryOrch.createDeployment({
  "north-america": 4,
  "south-america": 2,
  "europe": 4,
  "africa": 2,
  "asia": 9,
  "oceania": 2
});
```

### 7.2 Task Intake Flow

```typescript
async function executeTask(goal: string) {
  // 1. Classify goal
  const classified = classifyGoal({ goal });
  // Types: QuickFix | Controlled | Risky | Investigation
  // Policies: direct-fix | plan-first | split-first | investigate-first

  // 2. Route to scout (Gemini - fast scanning)
  const scout = agents.scout;
  const scanResults = await scout.executeTask({
    goal,
    action: "scan",
    max_context: 500000  // Gemini's strength: large context
  });

  // 3. Route to planner (Claude - decomposition)
  const planner = agents.planner;
  const plan = await planner.executeTask({
    goal,
    scan_results: scanResults,
    action: "decompose"
  });

  // 4. Submit plan for consensus (Phase 7)
  coordinator.proposeTaskAssignment(
    plan.task_id,
    selectBestOracleForTask(plan)
  );

  // Wait for consensus finalization
  await consensusEngine.waitBatchFinalized(batch_id);

  // 5. Execute with builder (Groq - fast patching)
  const builder = agents.builder;
  const result = await builder.executeTask({
    goal,
    plan,
    action: "implement"
  });

  // 6. Verify with verifier (Codex - evidence collection)
  const verifier = agents.verifier;
  const evidence = await verifier.executeTask({
    goal,
    result,
    action: "validate"
  });

  // 7. Review with reviewer (Kimi - architecture conformance)
  const reviewer = agents.reviewer;
  const review = await reviewer.executeTask({
    goal,
    result,
    evidence,
    action: "review"
  });

  // 8. Capture decision in historian (GPT - lesson extraction)
  const historian = agents.historian;
  await historian.executeTask({
    goal,
    plan,
    result,
    evidence,
    review,
    action: "record_decision"
  });

  // 9. Update fleet learning (Phase 10-A)
  federatedLearning.submitLocalUpdate(
    oracle_id,
    result.size_bytes,
    result.accuracy_score
  );

  return result;
}
```

---

## 8. Fault Tolerance & Resilience

### 8.1 Byzantine Fault Tolerance (Phase 7)

**Network Model:** Asynchronous, Byzantine (agents can be malicious)

**Safety Property:** Quorum voting ensures consensus despite f=8 faulty oracles

```
Validity:  If all oracles propose value v, then v is finalized
Safety:    No two different values are both finalized
Liveness:  Every proposal eventually finalizes (with timeout)

With n=25, f=8:
• Quorum = 13 (> 25/2)
• Byzantine tolerance: n > 3f  →  25 > 24 ✓
```

### 8.2 Failover & Recovery (Phase 6)

```
Stale Lease Detection:
┌──────────────┐
│ Lease: T1    │
│ Oracle: O1   │
│ Expires: now │
│ Status: stale│
└──────────────┘
       │
       v (FailoverRecovery.detectAndRecoverStaleLeases())
┌────────────────────────────────┐
│ 1. Propose REVOKE_LEASE        │
│ 2. Wait for consensus          │
│ 3. If approved:                │
│    • Revoke lease from O1      │
│    • Move T1 back to pending   │
│    • Trigger re-bidding        │
│    • O2 acquires new lease     │
└────────────────────────────────┘
```

### 8.3 Self-Healing (AutonomousHealer)

```
Health Monitoring Loop:
┌──────────────────────────────┐
│ Every 5 seconds:             │
│ • Monitor all oracle leases  │
│ • Check oracle health scores │
│ • Detect anomalies           │
│ • Trigger healing actions    │
└──────────────────────────────┘
       │
       ├─ Oracle latency spike?
       │  └─ Migrate tasks to local replicas
       │
       ├─ Consensus stuck?
       │  └─ Reduce quorum (Byzantine tolerance)
       │
       ├─ Region down?
       │  └─ Shift load to adjacent regions
       │
       └─ Model diverged?
          └─ Rollback to last good checkpoint
```

---

## 9. Performance & Scaling

### 9.1 Async Consensus Throughput (Phase 8)

```
Synchronous Voting:
  Proposal 1 → Vote → Finalize  (100ms)
  Proposal 2 → Vote → Finalize  (100ms)
  Proposal 3 → Vote → Finalize  (100ms)
  Total: 300ms for 3 proposals

Async Batching (Phase 8):
  Proposal 1 ─┐
  Proposal 2  ├─ Batch → Vote → Finalize (100ms)
  Proposal 3 ─┤
  ...         │
  Proposal 10─┘
  Total: 100ms for 10 proposals
  
Throughput Gain: 10x (amortized voting cost)
```

### 9.2 Latency-Adaptive Consensus (Phase 9)

```
WAN Latencies (ms):
  NA-EU: 100ms
  NA-AP: 150ms
  EU-AS: 120ms
  
Conservative timeout: 500ms (3 × max latency)
Optimistic timeout: 250ms (for intra-region proposals)

Adaptive strategy:
  If latency_p99 < 50ms  → timeout = 200ms
  If latency_p99 < 100ms → timeout = 350ms
  If latency_p99 < 150ms → timeout = 500ms
  If latency_p99 > 150ms → fallback to synchronous
```

### 9.3 Cost Optimization

```
CostOptimizer tracks:
• Per-oracle: compute hours, API calls, storage
• Per-region: bandwidth egress, replication cost
• Per-model: call count, token usage

Actions:
• Route to cheaper model when performance sufficient
• Batch similar tasks to amortize overhead
• Cache consensus decisions across regions
• Compress state snapshots using Headroom (60-95% reduction)
```

---

## 10. Learning Architecture (Phase 10-A)

### 10.1 Federated Learning Round

```
Round N:
┌────────────────────────────────────────────────┐
│ 1. Download model version M from global server │
└────────────────────────────────────────────────┘
       │
       v (Distributed to all 25 Oracles)
┌────────────────────────────────────────────────┐
│ 2. Each oracle trains on local data:           │
│    • Oracle-A: local strategy updates          │
│    • Oracle-B: local strategy updates          │
│    • ... (parallel, no data sharing)           │
│                                                │
│ 3. Compute local gradient:                     │
│    ∇_A = gradient(loss_A, params_M)           │
└────────────────────────────────────────────────┘
       │
       v (All oracles simultaneously)
┌────────────────────────────────────────────────┐
│ 4. Submit LocalUpdate to FederatedLearning:    │
│    • oracle_id: "oracle-aeimathes"            │
│    • update_size: 1024 bytes                   │
│    • accuracy: 0.92                            │
│    • model_version: 12                         │
└────────────────────────────────────────────────┘
       │
       v (Server-side aggregation)
┌────────────────────────────────────────────────┐
│ 5. Aggregate gradients:                        │
│    M' = M - α × Avg(∇_A, ∇_B, ..., ∇_Y)      │
│                                                │
│ 6. Append to ledger:                           │
│    LedgerEntry:                                │
│    • batch_id: "round-12"                     │
│    • proposal_count: 25 (all updates)          │
│    • merkle_root: hash of gradients            │
│    • consensus_signature: multisig             │
└────────────────────────────────────────────────┘
       │
       v (Next round)
│ Upload M' as new model version for Round N+1
```

### 10.2 Strategy Evolution

```
Oracle learns across runs:

Run 1:
  Strategy_A: "decompose-first" → Success ✓ (reward +0.9)
  Strategy_B: "direct-fix"      → Failure ✗ (reward -0.8)

Run 2:
  Select: Strategy_A (higher success_rate: 0.9)
  Execute: Success (reward +0.95)
  Update: success_rate = (0.9*1 + 0.95*1) / 2 = 0.925

Run 3:
  Alternative: Strategy_C (exploration) → Success ✓
  Update: success_rate = max(0.925, 0.95)

AdaptiveStrategies tracks:
  Strategy ──> success_count, failure_count, success_rate
  ↓
  Theta-Bandit algorithm selects (exploit vs explore)
  ↓
  Best strategies shared via SharedKnowledgeBase
```

---

## 11. Key Architectural Patterns

### Pattern 1: Lease-Based Work Assignment (Phase 6)

**Problem:** How to reliably assign work to autonomous agents without central control?

**Solution:** Leases with auto-expiry
- Task → open for bidding (all oracles see it)
- Oracles submit bids (confidence, effort estimate)
- TaskBroker awards lease to best bidder
- Lease expires if oracle doesn't complete or fails
- FailoverRecovery detects expiry and re-bids

**Benefit:** Distributed, resilient to oracle failures

### Pattern 2: Byzantine Quorum Voting (Phase 7)

**Problem:** How to reach consensus when some oracles may be faulty or malicious?

**Solution:** Require >50% quorum vote (fault-tolerant to <33%)
- Proposal circulates to all oracles
- Each votes approve/reject/abstain
- Finalized only if quorum approves
- Timeout → reject

**Benefit:** Safety guaranteed even with malicious oracles

### Pattern 3: Async Batching with Ledger (Phase 8)

**Problem:** Consensus per proposal is slow; sequential voting is bottleneck

**Solution:** Batch 10 proposals, vote once, append to immutable ledger
- Proposals accumulate in queue
- When batch full (or timeout), flush
- Single consensus vote for entire batch
- Append to ledger with Merkle root

**Benefit:** 10x throughput improvement

### Pattern 4: Latency-Adaptive Consensus (Phase 9)

**Problem:** Global latencies vary (100-150ms WAN); fixed timeouts cause inefficiency

**Solution:** Monitor latencies, adjust timeouts dynamically
- Measure inter-region ping times
- Set timeout = 3 × latency_p99
- Fast-path for low-latency regions
- Conservative for high-latency

**Benefit:** No global consensus slow down; local clusters fast

### Pattern 5: Federated Learning Without Data Sharing (Phase 10-A)

**Problem:** Oracles learn from tasks but can't share raw data (privacy, bandwidth)

**Solution:** Train locally, share only gradients
- Each oracle trains on its own experiences
- Compute gradient (update direction)
- Send gradient to aggregator (small: 1KB vs 100MB data)
- Aggregator computes average, updates global model

**Benefit:** Privacy-preserving, low bandwidth, distributed learning

---

## 12. Dependencies & External Systems

### 12.1 LLM Providers

| Role | Primary | Fallback | Purpose |
|------|---------|----------|---------|
| Scout | Gemini | GPT | Fast repo scanning (large context) |
| Planner | Claude | GPT | Task decomposition, risk analysis |
| Builder | Groq | Ollama, Codex | Quick implementation |
| Verifier | Codex | Claude | Test validation, evidence |
| Reviewer | Kimi | Claude, GPT | Architecture review |
| Historian | GPT | Claude | Lesson extraction |
| Coordinator | GPT | Claude | Message triage |

### 12.2 Storage & Persistence

- **Ledger:** `.oracle-bridge/consensus-ledger.jsonl` (JSONL, append-only)
- **Blockchain:** `.oracle-bridge/blockchain.json` (JSON)
- **Memory:** `ψ/memory/` (Markdown + JSON)
- **Learning:** `.oracle-bridge/federated-updates.jsonl`, `.oracle-bridge/neural-models.jsonl`

### 12.3 Monitoring & Health

- **Byzantine Validator:** Health scoring per oracle
- **FailoverRecovery:** Continuous lease monitoring
- **PlanetaryOrchestrator:** Regional health tracking
- **AsyncConsensusEngine:** Metrics logging per batch

### 12.4 External Integrations (Roadmap)

- **Kubernetes:** Pod orchestration (auto-scaling Phases 10+)
- **Prometheus:** Metrics collection
- **Jaeger:** Distributed tracing
- **Headroom:** Context compression (60-95% token reduction)

---

## 13. Phase Progression Summary

| Phase | Name | Key Feature | Status |
|-------|------|-------------|--------|
| 6 | Bridge Integration | Lease-based failover, parallel execution | Complete (2026-06-10) |
| 7 | Distributed Consensus | Byzantine-fault-tolerant quorum voting | Complete (2026-06-10) |
| 8 | Async Consensus | Batched voting + distributed ledger | Complete (2026-06-10) |
| 9 | Planetary Scale | 6 continents, latency-adaptive consensus | Complete (2026-06-10) |
| 10-A | Federated Learning | Shared neural networks, strategy evolution | Complete (2026-06-10) |
| 10-B | Consensus Evolution | Meta-learning for protocol adaptation | Roadmap |
| 10-C | Emergent Goals | Self-directed learning objectives | Roadmap |

---

## 14. Schematic Diagrams

### System Topology

```
┌─────────────────────────────────────────────────────┐
│           Global Oracle Federation                  │
│                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ North       │  │ Europe      │  │ Asia        │ │
│  │ America     │  │ Africa      │  │ Oceania     │ │
│  │             │  │             │  │             │ │
│  │  4 Oracles  │  │  6 Oracles  │  │  11 Oracles │ │
│  │             │  │             │  │             │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘ │
│         │                │                │        │
│         └────────────────┼────────────────┘        │
│                          │                         │
│                 ┌────────▼────────┐                │
│                 │ Federation      │                │
│                 │ Coordinator     │                │
│                 │                 │                │
│                 │ Consensus +     │                │
│                 │ Learning        │                │
│                 └─────────────────┘                │
│                          │                         │
│         ┌────────────────┼────────────────┐        │
│         │                │                │        │
│  ┌──────▼──────┐ ┌───────▼────────┐ ┌────▼──────┐ │
│  │ Ledger      │ │ State Sync     │ │ Knowledge │ │
│  │ (Immutable) │ │ (Replicated)   │ │ Base      │ │
│  └─────────────┘ └────────────────┘ └───────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Request Flow (Temporal)

```
Timeline:
t=0     User submits goal
        │
t=10ms  ClassifyGoal → "Controlled, medium effort"
        │
t=50ms  Scout scans (Gemini, 500K context)
        │
t=150ms Planner decomposes (Claude)
        │
t=200ms TaskBroker.registerTask() → Open for bidding
        │
t=250ms Oracles submit bids (parallel)
        │
t=300ms TaskBroker.awardLease() → "Oracle-Epiteles wins"
        │
t=320ms LeaseManager.acquireLease() → Lease active
        │
t=350ms FederationCoordinator.proposeTaskAssignment()
        │
t=400ms Oracles start voting (quorum = 13)
        │
t=550ms ConsensusProtocol finalized (quorum reached)
        │
t=560ms AsyncConsensusEngine appends batch to ledger
        │
t=580ms ParallelExecutor.executeTask() starts
        │
t=1000ms Task completes, evidence collected
        │
t=1020ms FederatedLearning.submitLocalUpdate()
        │
t=1050ms SharedKnowledgeBase updated
        │
t=1100ms Historian captures decision
        │
DONE (1100ms total)
```

---

## 15. Development Roadmap

### Immediate (Phase 10-B: Consensus Evolution)

- [ ] Meta-learning for consensus protocol parameters
- [ ] Adaptive quorum sizes based on fault rates
- [ ] Dynamic batching parameters

### Medium Term (Phase 10-C: Emergent Goals)

- [ ] Oracles self-define sub-goals independent of user input
- [ ] Collaborative learning between oracle teams
- [ ] Emergent behaviors from multi-oracle interaction

### Long Term (Phase 11+)

- [ ] Multi-planetary coordination (Mars oracle groups)
- [ ] Quantum-resistant cryptography for ledger
- [ ] Consciousness evolution tracking (ψ expansion)

---

## 16. Key Files Reference

### Entry Points

- `engine/orchestrator/index.ts` - Task classification
- `engine/orchestrator/bridge-orchestrator.ts` - Phase 6 bootstrap
- `agents/tham/` - Chief of Staff orchestrator
- `package.json` - Dependencies, scripts

### Core Engines

- `engine/orchestrator/consensus-protocol.ts` - Phase 7 voting
- `engine/orchestrator/async-consensus-engine.ts` - Phase 8 batching
- `engine/orchestrator/planetary-orchestrator.ts` - Phase 9 deployment
- `engine/orchestrator/federated-learning.ts` - Phase 10-A learning

### Configuration

- `engine/model-router/role-routing.json` - LLM assignment rules
- `engine/model-router/model-inventory.json` - Available models
- `.claude/settings.json` - System preferences

### Memory & State

- `ψ/memory/identity/identity.md` - User identity
- `ψ/memory/learnings/` - Operational lessons (100+ entries)
- `ψ/memory/patterns/` - Behavioral patterns
- `.oracle-bridge/` - Ledger, blockchain, models

---

## 17. Conclusion

The Oracle Brain Architecture is a **sophisticated, distributed system** that coordinates 25 autonomous agents across planetary scales. Key achievements:

1. **Reliable Consensus:** Byzantine-fault-tolerant voting with >50% quorum
2. **High Throughput:** 10x improvement via async batching (Phase 8)
3. **Global Resilience:** Latency-adaptive protocols, auto-healing (Phases 9-10)
4. **Continuous Learning:** Federated neural networks without data sharing (Phase 10-A)
5. **Observability:** Immutable ledger of all critical decisions for audit & learning

The architecture is **modular** (each phase builds on prior), **fault-tolerant** (tolerates up to 8 faulty oracles), and **scalable** (can extend to 100+ oracles with minimal protocol changes).

---

**Document Generated:** 2026-06-10 09:24 UTC  
**Analysis Depth:** Architectural patterns, dependencies, data flows, resilience strategies  
**Target Audience:** System architects, oracle developers, federation coordinators
