# Oracle Brain System: Testing Strategy

**Date:** 2026-06-10  
**Scope:** Mission Control + Arra Oracle v3  
**Coverage:** Unit tests, integration tests, federation health, autonomy validation, self-healing recovery

---

## Executive Summary

The oracle brain system uses a **three-layer testing strategy**:

1. **Unit Tests** (Vitest) — Fast, isolated logic validation
2. **Integration Tests** (Playwright + API) — Full stack HTTP/database behavior
3. **Federation & Consensus Tests** — Distributed system health, Byzantine tolerance, autonomous recovery

Testing is **hermetic** (in-memory databases, mocked networks) for speed, with **explicit state setup** instead of fixtures. The system validates **consensus mechanisms, autonomy goals, federation health**, and **self-healing recovery** — areas that differ sharply from traditional application testing.

---

## 1. Test Structure

### 1.1 Vitest (Unit & Integration Tests)

**Framework:** Vitest v4.0.18 (TypeScript-first, Vite-native)  
**Configuration:** Inline in package.json (no vitest.config.ts for Mission Control)  
**Timeout:** 20,000ms default; longer for database + network tests

```bash
npm test                    # Run all tests
npm test:watch            # Watch mode
npm test:ui               # Interactive UI dashboard
```

**Test File Structure:**
- Unit tests colocated: `src/lib/__tests__/*.test.ts` (28 test files)
- Integration tests: `tests/*.spec.ts` (20+ E2E specs)
- Library tests: `src/lib/*/test.ts` (inline with code)

### 1.2 Test Organization by System

| Layer | Location | Tool | Focus |
|-------|----------|------|-------|
| **Unit** | `src/lib/__tests__/` | Vitest | Logic, state transitions, error paths |
| **Governance** | `src/lib/__tests__/agent-governance.test.ts` | Vitest | Agent routing, role assignment |
| **Autonomy** | `src/lib/__tests__/autonomous-loop.test.ts` | Vitest | Recovery strategy, agent retry logic |
| **Task Health** | `src/lib/__tests__/task-board-health.test.ts` | Vitest + SQLite | Signal derivation, blocker detection |
| **Context** | `src/lib/__tests__/context-intelligence.test.ts` | Vitest | Token estimation, budget tracking |
| **Forge (Orchestration)** | `src/lib/__tests__/forge-v2.test.ts` | Vitest | Stage gates, execution models, task graphs |
| **E2E / API** | `tests/*.spec.ts` | Playwright | Full HTTP stack, CRUD, workflows |
| **Oracle Core** | `arra-oracle-v3/src/**/*.test.ts` | Bun:test | Indexing, reranking, gateway health |

### 1.3 Database Testing Pattern

**In-Memory SQLite:** Vitest tests use `:memory:` databases for isolation and speed.

```typescript
// From task-board-health.test.ts
const db = new Database(':memory:')
databases.push(db)
db.exec(`CREATE TABLE tasks (...); CREATE TABLE agents (...);`)
// Insert test data
ensureAegisAgent(db, now)
const result = repairStuckQualityReviewTasks(db, { now, limit: 10 })
// Assert state
expect(task.status).toBe('done')
```

**Cleanup:** `afterEach()` hooks close connections and reset state tables.

---

## 2. Testing Patterns by System Concern

### 2.1 Governance & Role Assignment

**File:** `src/lib/__tests__/agent-governance.test.ts`

Tests validate:
- ✅ Agent role mapping (e.g., TechLead → architect-agent)
- ✅ Lane assignment (coordinator, worker, reviewer)
- ✅ Team roster normalization
- ✅ Legacy agent filtering (typos, duplicates removed)
- ✅ Support vs. active routing status

**Pattern:** Pure function testing with snapshot-like constants.

```typescript
it('assigns TechLead as the primary architect coordinator', () => {
  const profile = getAgentGovernance('TechLead', 'AI Tech Lead / Orchestrator (Groq)')
  expect(profile.forgeRole).toBe('architect-agent')
  expect(profile.lane).toBe('coordinator')
  expect(profile.routingStatus).toBe('active')
})
```

**Critical Gaps:** No testing of live agent discovery (runtime config registration) — assumes normalized agents exist.

---

### 2.2 Autonomy & Recovery Strategies

**File:** `src/lib/__tests__/autonomous-loop.test.ts`

Tests validate:
- ✅ Auto-spawn planning (backlog vs. capacity matching)
- ✅ Blocker classification (verification failures, runtime saturation)
- ✅ Recovery strategy selection (retry same agent vs. reroute)
- ✅ Failure counting and escalation thresholds
- ✅ Wait/restart decisions based on elapsed time

**Pattern:** Decision logic as pure functions with simple inputs/outputs.

```typescript
it('retries the same agent first when the failure is a verification miss', () => {
  const decision = decideOrchestratorRecovery({
    title: 'Add users tab',
    status: 'in_progress',
    failureCount: 1,
    blocker: 'Verification found no changed files in admin UI.',
    lastAgent: 'AutoWorker1',
    lastExitCode: 0,
  })
  expect(decision.strategy).toBe('retry_same_agent')
  expect(decision.preferredAgent).toBe('AutoWorker1')
})
```

**What This Tests:**
- Decision logic is deterministic (same inputs → same strategy)
- Escalation respects failure count thresholds
- Blocker detection correctly identifies verification vs. runtime issues

**Critical Gaps:**
- No testing of actual agent spawning or message delivery
- No simulation of concurrent failures or cascading reroutes
- No validation that recovery strategies actually improve success rates

---

### 2.3 Task Board Health & Signal Derivation

**File:** `src/lib/__tests__/task-board-health.test.ts`

Tests validate:
- ✅ Progress % calculation from task metadata
- ✅ Blocker code assignment (e.g., `awaiting_aegis_approval`, `runtime_saturated`)
- ✅ Lane mapping (status + metadata → display lane)
- ✅ Quality review gate completion (auto-close with Aegis approval)
- ✅ Deferral and retry-ability logic

**Pattern:** Database state setup + function invocation + schema assertion.

```typescript
it('flags quality review tasks that only need Aegis approval', () => {
  const signals = deriveTaskBoardSignals({
    status: 'quality_review',
    assigned_to: undefined,
    metadata: JSON.stringify({ verification: { passed: true } }),
  })
  expect(signals.progressPct).toBeGreaterThanOrEqual(96)
  expect(signals.blockerCode).toBe('awaiting_aegis_approval')
})

it('creates Aegis and auto-closes quality-reviewed tasks with passed evidence', () => {
  db.exec(`CREATE TABLE tasks (...); CREATE TABLE agents (...);`)
  ensureAegisAgent(db, now)
  // Insert task with passed verification
  const result = repairStuckQualityReviewTasks(db, { now, limit: 10 })
  expect(result.healed).toBe(1)
  expect(task.status).toBe('done')
})
```

**What This Tests:**
- Signal derivation is correct (progress, blockers, next actions)
- Gate repair logic (Aegis creation, approval logging, task closure)
- Lane resolution respects metadata context

**Critical Gaps:**
- No testing of concurrent repairs (what if two processes try to heal same task?)
- No validation of signal accuracy under load
- No integration with actual scheduler or task assignment

---

### 2.4 Context Intelligence & Token Budget

**File:** `src/lib/__tests__/context-intelligence.test.ts`

Tests validate:
- ✅ Token estimation by tool type (read > search > write)
- ✅ Default budget guard thresholds (soft/hard limits)
- ✅ Session lifecycle (create → record events → complete)
- ✅ Budget profile scoping (project, agent, default)
- ✅ Heatmap generation for session analytics

**Pattern:** State mutation + query + digest validation.

```typescript
it('builds a digest for a real session scope', () => {
  upsertContextSession({ sessionKey: 'sess-1', ... })
  recordContextEvent({ sessionKey: 'sess-1', toolKind: 'read', lineCount: 80 })
  recordContextEvent({ sessionKey: 'sess-1', toolKind: 'write', lineCount: 20 })
  completeContextSession({ sessionKey: 'sess-1', status: 'completed' })
  
  const digest = getContextDigest({ sessionKey: 'sess-1' })
  expect(digest.summary.totalEvents).toBe(2)
  expect(digest.summary.estimatedTokens).toBeGreaterThan(0)
})
```

**What This Tests:**
- Token counting accuracy per operation type
- Scope isolation (session/project/global)
- Profile application and reset

**Critical Gaps:**
- No testing of actual token limit enforcement (cutoff, degradation)
- No simulation of cascading sessions or handoff overhead
- No validation against real Claude API token counts

---

### 2.5 Forge V2 Orchestration (Multi-Stage Pipeline)

**File:** `src/lib/__tests__/forge-v2.test.ts` (800+ lines, 45KB)

**Layers Tested:**

#### Stage Gates (Execution Readiness)
```typescript
it('blocks execution without architect approval', () => {
  const plan: ForgeV2ArchitectPlan = {
    approved: false,
    approvalNotes: ['Rejected'],
    executionReadinessScore: 20,
  }
  expect(() => assertExecutionStage(plan, tasks)).toThrowError(ForgeV2StageGateError)
})
```

#### Run Lifecycle & Control
```typescript
it('applies pause and resume controls through run index', async () => {
  const created = await orchestrator.createRun({ command: 'Test' })
  const paused = await orchestrator.controlRun(created.runId, 'pause')
  expect(paused.controlState).toBe('paused')
  const resumed = await orchestrator.controlRun(created.runId, 'resume')
  expect(resumed.controlState).toBe('running')
})
```

#### Gate Enforcement (Fresh DB Reads)
```typescript
it('reads execution_allowed fresh from DB before execution boundary', async () => {
  const created = await orchestrator.createRun({ command: 'fresh gate read' })
  db.prepare(`UPDATE forge_v2_runs_index SET gate_execution_allowed = 0 WHERE run_id = ?`).run(created.runId)
  const run = await orchestrator.processRun(created.runId)
  expect(run.status).toBe('blocked')
})
```

#### Task Timeout Handling (No Hanging Execution)
```typescript
it('fails task on provider timeout without hanging execution loop', async () => {
  process.env.FORGE_V2_TASK_TIMEOUT_MS = '20'
  const outcome = await engine.execute(runId, [/* task */])
  expect(outcome.taskResults[0].status).toBe('failed')
  expect(outcome.taskResults[0].evidence.join(' ')).toContain('provider_timeout')
})
```

#### Recovery & Persistence
```typescript
it('recovers persisted running runs through dispatcher recovery', async () => {
  const created = await orchestrator.createRun({ command: 'recovery scenario' })
  db.prepare(`UPDATE forge_v2_runs_index SET status = 'running' WHERE run_id = ?`).run(created.runId)
  const count = recoverRunningRuns()
  expect(count).toBeGreaterThanOrEqual(1)
  // Poll until run reaches terminal state
})
```

#### Task Graph & Keyword Validation
```typescript
it('builds contextual dynamic task graph from blueprint and architect module map', () => {
  const graph = buildTaskGraph(plan, blueprint)
  expect(graph.length).toBeGreaterThanOrEqual(6)
  expect(graph.every(task => task.scope && task.risks && task.rollbackPlan)).toBe(true)
})

it('runs keyword validation against acceptance criteria and module coverage', () => {
  const result = runKeywordValidation(execution, blueprint)
  // Assert coverage of all modules and acceptance criteria
})
```

**What This Tests:**
- ✅ Stage gate blocking (execution not allowed without approval)
- ✅ Control state machine (pause → resume → completion)
- ✅ Persistent gate enforcement (fresh reads, no race windows)
- ✅ Timeout resilience (tasks fail, loop continues)
- ✅ Recovery from crashed/stuck runs
- ✅ Dynamic task graph generation
- ✅ Keyword validation against blueprint

**Critical Gaps:**
- No testing of concurrent runs (interference, deadlock)
- No simulation of provider failures (partial responses, timeouts)
- No validation of decision quality (are decisions optimal?)
- No testing of actual provider dispatch (mocked)

---

### 2.6 Database Mocking & Pure Function Testing

**File:** `src/lib/__tests__/db-helpers.test.ts`

**Pattern:** Mock better-sqlite3 at module level, test pure helpers.

```typescript
// Hoisted to avoid temporal dead zone
const { mockRun, mockGet, mockPrepare, mockBroadcast } = vi.hoisted(() => ({
  mockRun: vi.fn(() => ({ lastInsertRowid: 1, changes: 1 })),
  mockGet: vi.fn(() => ({ count: 1 })),
  mockPrepare: vi.fn(() => ({ run: mockRun, get: mockGet, all: vi.fn(() => []) })),
  mockBroadcast: vi.fn(),
}))

vi.mock('better-sqlite3', () => ({
  default: vi.fn(() => ({ prepare: mockPrepare, pragma: vi.fn(), exec: vi.fn() })),
}))

it('inserts activity into database and broadcasts event', () => {
  db_helpers.logActivity('task_created', 'task', 1, 'alice', 'Created task')
  expect(mockPrepare).toHaveBeenCalled()
  expect(mockBroadcast).toHaveBeenCalledWith('activity.created', expect.anything())
})
```

**Benefits:**
- No system sqlite3 dependency (works in CI)
- Fast mock setup, no I/O
- Clear interaction assertions

**Tradeoff:** Does not validate actual SQL correctness.

---

## 3. Mocking Strategies

### 3.1 Database Mocking

**In-Memory SQLite (Preferred for most tests):**
```typescript
import Database from 'better-sqlite3'
const db = new Database(':memory:')
db.exec(SCHEMA_SQL)  // Define tables
// Use normally
const result = db.prepare('SELECT * FROM tasks WHERE status = ?').all('inbox')
```

**Pure Mock (when native module unavailable):**
```typescript
vi.mock('better-sqlite3', () => ({
  default: vi.fn(() => ({
    prepare: vi.fn(() => ({ run, get, all })),
    exec: vi.fn(),
  })),
}))
```

### 3.2 Network Mocking

**HTTP (Playwright E2E tests):**
```typescript
export async function createTestTask(request: APIRequestContext, overrides = {}) {
  const res = await request.post('/api/tasks', {
    headers: { 'x-api-key': 'test-api-key-e2e-12345' },
    data: { title: `e2e-task-${Date.now()}`, ...overrides },
  })
  return res.json()
}
```

**Provider Calls (Forge tests):**
```typescript
// Mock provider invocation
const engine = new ForgeV2ExecutionEngine({
  invokeTask: () => new Promise(() => {}),  // Never resolves (timeout test)
} as any)
// Timeout enforcement kicks in after FORGE_V2_TASK_TIMEOUT_MS
```

### 3.3 Oracle Federation Mocking

**Bun:test integration (Arra Oracle):**
```typescript
// HTTP API test with actual server spawn
beforeAll(async () => {
  if (!await isServerRunning()) {
    serverProcess = Bun.spawn(['bun', 'run', 'src/server.ts'], {
      env: { ORACLE_CHROMA_TIMEOUT: '3000' },
    })
    const ready = await waitForServer(30)
    if (!ready) throw new Error('Server startup timeout')
  }
})

test('GET /api/search returns results', async () => {
  const res = await fetch('http://localhost:47778/api/search?q=oracle')
  expect(res.ok).toBe(true)
})
```

**Database Isolation (CLI tests):**
```typescript
function makeDeps(): CliDeps {
  const db = new Database(':memory:')  // Fresh per test
  db.exec(MIGRATION_SQL)
  return { db, models: MODELS, out: console.log, err: console.error }
}

it('enqueues indexing job', () => {
  const deps = makeDeps()
  cmdEnqueue(deps, ['doc-1', '--model', 'bge-m3'])
  // Assert db state
})
```

---

## 4. Validation Approaches

### 4.1 Federation Health Validation

**What to measure:**
- Agent availability (online status, last heartbeat)
- Consensus reachability (quorum participation rate)
- Message latency (round-trip time for consensus votes)
- Byzantine fault tolerance (how many agents can be down?)

**Pattern (conceptual, not yet implemented):**
```typescript
describe('federation health', () => {
  it('maintains quorum with N-1 agents down', async () => {
    const federation = createTestFederation(25) // 25 oracles
    federation.agents[0].disconnect()
    federation.agents[1].disconnect()
    // ... up to 12 agents down
    const vote = await federation.consensus.propose({ decision: 'execute' })
    expect(vote.quorumReached).toBe(true)  // Still can decide
  })

  it('blocks execution when quorum lost', async () => {
    const federation = createTestFederation(25)
    for (let i = 0; i < 13; i++) federation.agents[i].disconnect()  // >50% down
    const vote = await federation.consensus.propose({ decision: 'execute' })
    expect(vote.quorumReached).toBe(false)
    expect(vote.decision).toBe('block')
  })
})
```

### 4.2 Learning Convergence Validation

**What to measure:**
- Do all oracles learn the same patterns?
- Does knowledge divergence self-heal?
- What is convergence time?

**Pattern (conceptual):**
```typescript
it('converges knowledge across federation after 3 rounds', async () => {
  const fed = createTestFederation(25)
  const oracle1 = fed.agents[0]
  const oracle2 = fed.agents[1]
  
  // Oracle1 learns something
  await oracle1.memory.recordLearning({
    pattern: 'retry_same_agent_on_verification_miss',
    successRate: 0.87,
  })
  
  // Wait for gossip rounds
  await fed.gossip.propagate()
  await fed.gossip.propagate()
  await fed.gossip.propagate()
  
  // Oracle2 should have learned it
  const learned = oracle2.memory.getLearning('retry_same_agent_on_verification_miss')
  expect(learned?.successRate).toBe(0.87)
})
```

### 4.3 Autonomy Goal Validation

**What to measure:**
- Does agent pursue its assigned goal?
- Does reputation score reflect performance?
- Does autonomy respect boundaries (don't exceed caps)?

**Pattern (conceptual):**
```typescript
it('pursues personal goal within team constraints', async () => {
  const agent = createTestAgent('Scout', {
    personalGoal: 'reduce_planning_latency',
    reputationScore: 0.82,
    teamCapacity: 10,
  })
  
  // Agent spawns sub-agents to parallelize planning
  const spawned = await agent.autonomy.spawnWorkers()
  expect(spawned.count).toBeLessThanOrEqual(10)  // Respects team capacity
  
  // Agent should track its contribution to personal goal
  const improvement = await agent.autonomy.measureGoalProgress()
  expect(improvement.latencyMs).toBeLessThan(previous.latencyMs)
})
```

### 4.4 Self-Healing Recovery Validation

**What to measure:**
- Does system detect degradation?
- Does it select correct recovery strategy?
- Does health metric improve after recovery?

**Pattern (conceptual):**
```typescript
it('detects circuit breaker opening and routes around broken provider', async () => {
  const dispatcher = createTestDispatcher(providers)
  const broken = providers[0]  // Make it return errors
  broken.errorRate = 0.95
  
  // Health monitor detects degradation
  const health = dispatcher.healthMonitor.check()
  expect(health.providers[0].status).toBe('degraded')
  
  // Dispatcher opens circuit breaker
  dispatcher.circuitBreaker.trip(broken.id)
  
  // Subsequent tasks route to healthy providers
  const task = await dispatcher.execute({ /* task */ })
  expect(task.assignedProvider).not.toBe(broken.id)
})
```

---

## 5. Coverage Strategy

### 5.1 Critical Path (Must Test)

| System | Why Critical | Current Coverage |
|--------|-------------|-------------------|
| **Stage Gates** | Prevents buggy code execution | ✅ Full (forge-v2.test.ts) |
| **Governance Routing** | Ensures tasks reach correct agents | ✅ Full (agent-governance.test.ts) |
| **Recovery Strategy** | Determines success under failure | ✅ Partial (autonomous-loop.test.ts) |
| **Consensus** | Federated decisions require agreement | ❌ None (gap) |
| **Autonomy Bounds** | Prevents resource exhaustion | ❌ None (gap) |
| **Byzantine Tolerance** | Assumes up to 12/25 agents down | ❌ None (gap) |
| **Self-Healing** | System recovers from degradation | ❌ None (gap) |

### 5.2 Coverage Gaps

#### Gap 1: Consensus & Quorum Validation
**Why:** Federated systems fail silently if quorum logic is wrong.
**Mitigation:** Add tests for Byzantine fault tolerance, partition scenarios.

#### Gap 2: Autonomy Under Load
**Why:** Agents might exceed team capacity or spawn cascading workers.
**Mitigation:** Add stress tests for multi-agent spawning, goal tracking.

#### Gap 3: Learning Convergence
**Why:** Federated knowledge should converge, not diverge.
**Mitigation:** Add gossip round simulation, knowledge diff validation.

#### Gap 4: Provider Failover
**Why:** System assumes providers work; should test degradation.
**Mitigation:** Add circuit breaker tests, timeout cascades.

#### Gap 5: Network Partition Scenarios
**Why:** Oracles might lose connectivity; need split-brain handling.
**Mitigation:** Add partition simulation (disconnect, slow network, etc).

### 5.3 Test Matrix (Effort vs. Value)

| Test | Effort | Value | Status |
|------|--------|-------|--------|
| Unit logic (pure functions) | Low | High | ✅ Done |
| Database state transitions | Low-Med | High | ✅ Done |
| HTTP API CRUD | Med | High | ✅ Done (E2E) |
| Stage gate enforcement | Med | High | ✅ Done |
| Autonomy goal pursuit | Med | High | ❌ Gap |
| Consensus quorum | Med | High | ❌ Gap |
| Byzantine fault recovery | High | High | ❌ Gap |
| Learning convergence | High | Med | ❌ Gap |
| Network partitions | High | High | ❌ Gap |
| Provider cascading timeout | High | Med | ❌ Gap |

---

## 6. Running Tests

### 6.1 Mission Control (Vitest)

```bash
# All tests
npm test

# Watch mode
npm test:watch

# UI dashboard (live results)
npm test:ui

# Specific file
npm test -- src/lib/__tests__/forge-v2.test.ts

# Smoke test (AEGIS health)
npm run aegis:smoke:test
```

### 6.2 Playwright E2E

```bash
# Run all E2E tests (starts server on :3005)
npm run test:e2e

# Specific test
npm run test:e2e -- tests/agents-crud.spec.ts

# Debug mode (headed browser)
npx playwright test --headed
```

### 6.3 Arra Oracle (Bun:test)

```bash
cd external/oracle/arra-oracle-v3

# Run all tests
bun test

# Run integration tests
bun test src/integration/*.test.ts

# Watch mode
bun test --watch
```

### 6.4 Quality Gate

```bash
# Full pipeline: lint + typecheck + test + build + E2E
npm run quality:gate
```

---

## 7. Unique Aspects of Oracle Testing

### 7.1 Deterministic Recovery (Not Just Correctness)

Traditional tests verify: "Does the function work?"

Oracle tests must also verify: "Does the recovery strategy make the right choice?"

```typescript
// NOT just: does the function run without error?
expect(() => decideOrchestratorRecovery(...)).not.toThrow()

// BUT: does it choose the right strategy?
expect(decision.strategy).toBe('retry_same_agent')
expect(decision.summary).toContain('Verification miss → retry same agent')
```

### 7.2 Consensus as a Testable Property

Traditional tests verify: "Does the code execute?"

Oracle tests must verify: "Do N agents agree on the decision?"

```typescript
// Conceptual (not yet implemented)
const votes = await federation.consensus.vote({
  decision: 'execute_task',
  context: execution,
})
expect(votes.unanimous).toBe(true)
// or
expect(votes.consensus.count).toBeGreaterThanOrEqual(Math.ceil(25 * 2/3))
```

### 7.3 Autonomy as a Bounded Property

Traditional tests verify: "Does the feature work?"

Oracle tests must verify: "Does autonomy stay within bounds?"

```typescript
// Conceptual
const spawned = await agent.autonomy.spawn({
  goal: agent.personalGoal,
  maxWorkers: agent.autonomyBounds.maxSpawn,
})
expect(spawned.length).toBeLessThanOrEqual(agent.autonomyBounds.maxSpawn)
```

### 7.4 Self-Healing as Observable Recovery

Traditional tests verify: "Does it fail gracefully?"

Oracle tests must verify: "Does it detect, diagnose, and recover?"

```typescript
// Observation chain
expect(health.provider.status).toBe('degraded')      // Detection
expect(logs).toContain('circuit_breaker_open')      // Diagnosis
expect(task.provider).not.toBe(failedProvider.id)   // Recovery action
expect(healthAfter.provider.status).toBe('healthy') // Validation
```

---

## 8. Testing Roadmap

### Phase 1: Foundation (Current)
- ✅ Unit tests for logic and state transitions
- ✅ Database integration tests (in-memory)
- ✅ API CRUD tests (Playwright)
- ✅ Stage gate enforcement

### Phase 2: Federation (Next)
- ⏳ Consensus quorum validation
- ⏳ Byzantine fault tolerance (N-1 agents down)
- ⏳ Network partition handling
- ⏳ Message ordering and idempotency

### Phase 3: Autonomy (Next)
- ⏳ Personal goal pursuit within bounds
- ⏳ Reputation score accumulation
- ⏳ Spawn rate limiting and escalation
- ⏳ Conflict resolution (multi-agent goals)

### Phase 4: Learning (Next)
- ⏳ Knowledge gossip convergence
- ⏳ Learning validation across federation
- ⏳ Drift detection and auto-correction
- ⏳ Strategy success rate tracking

### Phase 5: System Resilience (Next)
- ⏳ Provider circuit breaker
- ⏳ Cascading timeout scenarios
- ⏳ Load shedding and backpressure
- ⏳ Graceful degradation validation

---

## 9. Key Testing Principles

### 9.1 Hermetic Tests
- **In-memory databases** (no file I/O)
- **Mocked HTTP** (no real provider calls)
- **Explicit state** (don't rely on fixtures)
- **Cleanup** (afterEach closes resources)

### 9.2 Fast Tests
- Vitest unit tests: <100ms each
- Database tests: <500ms (SQLite in-memory)
- Forge tests: <20s (timeout safety)
- E2E tests: <60s per test (server startup)

### 9.3 Deterministic Tests
- No time-dependent logic (use fixed timestamps)
- No randomness (seed RNG if needed)
- No shared state (cleanup per test)
- No thread races (single-threaded by default)

### 9.4 Observable Testing
- Assert on visible behavior (status, signals, decisions)
- Don't assert internal state (mock interactions)
- Use clear error messages (`.toContain()` > `.toBe()`)
- Trace recovery chains (decision → action → outcome)

---

## 10. Resources

**Test Files (Mission Control):**
- `/route/mission-control/src/lib/__tests__/` (28 test files)
- `/route/mission-control/tests/` (20+ E2E specs)

**Test Files (Arra Oracle):**
- `/route/mission-control/external/oracle/arra-oracle-v3/src/**/*.test.ts` (30+ tests)
- `/route/mission-control/external/oracle/arra-oracle-v3/tests/` (E2E)

**Configuration:**
- Vitest: inline in package.json (testTimeout: 20000)
- Playwright: `/playwright.config.ts`, `/playwright.runtime.config.ts`
- Bun:test: native (no config needed)

**Key Patterns:**
- Database mocking: `vi.hoisted()` + `vi.mock('better-sqlite3')`
- API testing: `request.post('/api/...', { headers: API_KEY_HEADER, data: {...} })`
- State setup: explicit table creation + inserts, no fixtures
- Cleanup: `afterEach()` hooks with `databases.pop()?.close()`

---

## Appendix: Test Checklists

### Before Adding a New Oracle Agent
- [ ] Is agent role/lane correctly mapped in `agent-governance`?
- [ ] Does agent appear in `ORCHESTRATOR_VISIBLE_TEAM_NAMES` or worker pool?
- [ ] Are recovery strategies defined in `autonomous-loop`?
- [ ] Is autonomy bound defined (max spawn, personal goal)?

### Before Deploying Orchestrator Change
- [ ] Do stage gates pass (architect approval, execution allowed)?
- [ ] Does task graph build without errors?
- [ ] Can execution recover from timeout?
- [ ] Does quality review gate work (Aegis approval)?

### Before Committing Federation Code
- [ ] Can quorum be maintained with N-1 agents down?
- [ ] Does consensus converge in <3 rounds?
- [ ] Are partition scenarios handled (split-brain)?
- [ ] Do agents re-join after network heal?

### Before Releasing Learning System
- [ ] Do all oracles converge to same knowledge?
- [ ] Can drift be detected and corrected?
- [ ] Is knowledge gossip idempotent?
- [ ] Are strategy success rates tracked accurately?

---

**Document Version:** 1.0  
**Last Updated:** 2026-06-10  
**Next Review:** 2026-06-17 (Phase 2 federation tests)
