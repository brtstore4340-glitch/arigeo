# Oracle Brain Public API & Integration Surface

**Document Date:** 2026-06-10  
**Scope:** Mission Control Federation API, Extension Points, and Integration Patterns  
**Audience:** Integrators, Plugin Developers, External System Architects

---

## 1. Public API Entry Points

### 1.1 Oracle Registration & Lifecycle

#### Endpoint: `POST /api/agents`

**Purpose:** Register a new oracle into the federation

**Request Schema:**
```typescript
{
  name: string                    // Unique oracle identifier (e.g., "lens-oracle")
  role: string                    // Role/specialty (e.g., "Code Review", "Architecture")
  session_key?: string            // Session token for this oracle
  soul_content?: string           // Oracle personality/memory snapshot
  status?: 'offline' | 'idle' | 'running' | 'waiting' | 'blocked' | 'completed' | 'error'
  config?: Record<string, any>    // Custom configuration object
  template?: string               // Pre-built template name to use
  gateway_config?: Record<string, any>
  write_to_gateway?: boolean      // Sync config to external gateway
}
```

**Response:**
```typescript
{
  id: number                      // Internal agent ID
  name: string
  role: string
  status: string
  config: Record<string, any>
  taskStats: {
    total: number
    assigned: number
    in_progress: number
    completed: number
  }
  created_at: number
  updated_at: number
}
```

**Auth:** Requires `operator` role  
**Rate Limit:** Standard mutation limits apply  
**Broadcast Event:** `agent.created`

---

#### Endpoint: `GET /api/agents`

**Purpose:** List all registered oracles with optional filtering

**Query Parameters:**
- `status`: Filter by agent status
- `role`: Filter by role/specialty
- `limit`: Results per page (max 200, default 50)
- `offset`: Pagination offset

**Response:**
```typescript
{
  agents: Agent[]
  total: number
  page: number
  limit: number
}
```

**Auth:** Requires `viewer` role  
**Use Case:** Dashboard display, fleet discovery, capacity planning

---

#### Endpoint: `PUT /api/agents`

**Purpose:** Update oracle status, configuration, or soul content

**Request:**
```typescript
{
  name: string                    // Required: identifies which oracle
  status?: string                 // New status
  config?: Record<string, any>    // Updated config
  soul_content?: string           // Updated memory/personality
  session_key?: string            // New session
  role?: string                   // Update role
  last_activity?: string
}
```

**Response:**
```typescript
{ success: true }
```

**Auth:** Requires `operator` role  
**Broadcast Event:** `agent.updated`, `agent.status_changed`

---

### 1.2 Task Submission to Federation

#### Endpoint: `POST /api/tasks`

**Purpose:** Submit work task to the oracle federation for execution

**Request Schema:**
```typescript
{
  title: string                   // Task name/summary
  description?: string            // Full task description
  assigned_to?: string            // Target oracle name (if known)
  priority?: 'low' | 'medium' | 'high'
  status?: 'assigned' | 'in_progress' | 'done'
  estimated_hours?: number
  tags?: string[]                 // Labels for routing/categorization
  metadata?: Record<string, any>  // Custom task data
}
```

**Response:**
```typescript
{
  id: number
  title: string
  status: 'assigned'
  assigned_to: string | null      // Oracle assigned to task
  created_at: number
  updated_at: number
  metadata: Record<string, any>
}
```

**Auth:** Requires `operator` role  
**Broadcast Event:** `task.created`  
**Integration:** Tasks are queryable and stateful; external systems may poll `/api/tasks/{id}` for updates

---

#### Endpoint: `PUT /api/tasks/{id}`

**Purpose:** Update task status, reassign to different oracle, or record progress

**Request:**
```typescript
{
  status?: string                 // New status ('in_progress', 'done', etc.)
  assigned_to?: string            // Reassign to oracle
  progress?: number               // Completion percentage (0-100)
  metadata?: Record<string, any>  // Merge with existing metadata
}
```

**Broadcast Event:** `task.updated`, `task.status_changed`

---

### 1.3 Fleet Status & Monitoring

#### Endpoint: `GET /api/fleet`

**Purpose:** Real-time snapshot of all oracle statuses

**Response:**
```typescript
{
  agents: Array<{
    agent: string                 // Oracle name
    role: string                  // Oracle role
    status: AgentStatus           // Current state
    task: string | null           // Current task ID or null
    updatedAt: string             // ISO timestamp
  }>
}
```

**Auth:** Requires `viewer` role  
**Use Case:** Dashboard, monitoring, fleet health checks  
**Real-time:** Pair with `/api/events` for live updates

---

#### Endpoint: `GET /api/agents?status=running`

**Purpose:** Find which oracles are currently busy vs. idle

**Filtering Support:**
```
GET /api/agents?status=idle&limit=10
GET /api/agents?role=Code%20Review&status=idle
GET /api/agents?status=running&limit=5&offset=0
```

---

### 1.4 Shared Knowledge Access

#### Endpoint: `GET /api/context-intelligence`

**Purpose:** Query the collective knowledge graph built by all oracles

**Query Parameters:**
- `query`: Search term or concept
- `limit`: Max results (default 20)
- `type`: Filter by knowledge type (e.g., 'solution', 'pattern', 'anti-pattern')

**Response:**
```typescript
{
  results: Array<{
    id: string
    type: string                  // e.g., 'solution', 'pattern', 'risk'
    content: string               // Knowledge snippet
    source_oracle: string         // Oracle that contributed
    confidence: number            // 0-1 confidence score
    created_at: string
  }>
}
```

**Auth:** Requires `viewer` role  
**Use Case:** Learning loop feedback, pattern discovery, cross-oracle insights

---

### 1.5 Consensus Monitoring

#### Endpoint: `GET /api/status/consensus`

**Purpose:** Check current federation consensus state

**Response:**
```typescript
{
  round: number                   // Current consensus round
  quorum_size: number             // Minimum nodes for quorum
  participating_oracles: string[]
  consensus_state: 'voting' | 'achieved' | 'timeout'
  timeout_seconds: number         // Time remaining for this round
  last_update_at: string
}
```

**Auth:** Requires `viewer` role  
**Use Case:** System health, distributed state verification

---

### 1.6 Learning Round Trigger

#### Endpoint: `POST /api/learning/round`

**Purpose:** Initiate a new distributed learning round across all oracles

**Request:**
```typescript
{
  focus_area?: string             // Optional: guide learning toward specific domain
  sample_size?: number            // How many tasks to analyze (default: 100)
  minimum_confidence?: number      // Filter results below this confidence (0-1)
  generate_recommendations?: boolean
}
```

**Response:**
```typescript
{
  round_id: string
  status: 'initiated'
  participating_oracles: string[]
  estimated_duration_seconds: number
  callback_url?: string           // Where to POST results when complete
}
```

**Auth:** Requires `operator` role  
**Polling:** Use `GET /api/learning/round/{round_id}` to check progress  
**Async Pattern:** Returns immediately; results delivered via webhook or polling

---

### 1.7 Activity & Audit Log

#### Endpoint: `GET /api/activities`

**Purpose:** Retrieve audit trail of all federation actions

**Query Parameters:**
- `agent_name`: Filter by oracle
- `action_type`: e.g., 'task_assigned', 'consensus_reached', 'learning_complete'
- `limit`, `offset`: Pagination

**Response:**
```typescript
{
  activities: Array<{
    id: number
    timestamp: string             // ISO
    agent_name: string            // Which oracle
    action: string                // What happened
    details: Record<string, any>  // Contextual data
  }>
}
```

**Auth:** Requires `viewer` role  
**Use Case:** Compliance, debugging, understanding federation decisions

---

## 2. Extension Points: How to Add Custom Oracles

### 2.1 Oracle Template System

**File:** `src/lib/agent-templates.ts`

Register a new oracle type via template:

```typescript
// In your oracle registration code:
POST /api/agents with:
{
  name: "my-custom-oracle",
  role: "Custom Specialization",
  template: "custom_blueprint_name",
  config: {
    // Template-specific overrides
    model: "gpt-4",
    timeout_ms: 30000
  }
}
```

**Available Templates:** Check runtime-assignment.json for canonical profiles

**Lane Assignment:** Each template must declare a lane:
- `coordinator`: Orchestration, routing decisions
- `worker`: Implementation, code changes
- `reviewer`: Quality gates, approval
- `monitor`: Health checks, alerting
- `support`: Auxiliary functions

---

### 2.2 Custom Strategy Implementation

**File:** `src/lib/forge-v2/strategy.ts`

To add a custom oracle decision strategy:

```typescript
function customOracleStrategy(
  request: ForgeV2NormalizedRequest,
  oracleContext: OracleContext
): ForgeV2Blueprint {
  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    mission: request.command,
    perspectives: {
      security: ['...'],
      performance: ['...'],
      ux: ['...'],
    },
    proposedModules: ['...'],
    acceptanceCriteria: ['...'],
  }
}
```

Register strategy in gateway config:
```json
{
  "oracle_name": "my-oracle",
  "strategy_engine": "customOracleStrategy"
}
```

---

### 2.3 Custom Healing Actions

**Interface to Implement:**

```typescript
interface HealingAction {
  oracle_name: string
  action_type: string             // e.g., "retry_task", "escalate", "fallback"
  target_resource: string         // What to heal (task ID, repo, etc.)
  parameters: Record<string, any>
  dry_run?: boolean
}

// POST to:
POST /api/healing/actions
{
  type: "retry_task",
  oracle: "lens-oracle",
  task_id: 123,
  parameters: { max_retries: 3 }
}
```

**Built-in Healing Actions:**
- `retry_task`: Rerun a failed task with backoff
- `escalate`: Route to higher-priority oracle
- `fallback`: Switch to backup model/strategy
- `queue_maintenance`: Schedule repository self-heal

---

### 2.4 Custom Role Profile

**File:** `marcuzx-forge/agents/runtime-assignment.json`

Add to `profiles` array:

```json
{
  "name": "my-oracle",
  "roleTitle": "Custom Specialist",
  "forgeRole": "custom-agent",
  "lane": "worker",
  "routingStatus": "active",
  "routingPriority": 60,
  "canonical": true,
  "specialties": ["domain-expertise", "custom-task-type"],
  "taskFocus": ["task-category"],
  "stageOwnership": ["CUSTOM_STAGE"]
}
```

---

## 3. Integration Patterns

### 3.1 Webhook Event Subscription

#### Register Webhook

```typescript
POST /api/webhooks
{
  name: "My External System",
  url: "https://external-system.com/oracle-events",
  events: ["task.created", "agent.updated", "task.status_changed"],
  generate_secret: true
}

Response: {
  id: 123,
  secret: "abc123..." // Save this — won't be shown again
}
```

#### Verify Webhook Signature

Incoming webhook includes `X-Oracle-Brain-Signature` header:

```typescript
import crypto from 'crypto'

function verifyWebhookSignature(body: string, signature: string, secret: string) {
  const computed = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')
  return crypto.timingSafeEqual(
    Buffer.from(computed),
    Buffer.from(signature)
  )
}
```

#### Webhook Payload Format

```typescript
{
  id: string                      // Delivery ID
  event: {
    type: 'task.created' | 'agent.updated' | ...,
    data: Record<string, any>,
    timestamp: number
  },
  delivery_attempt: number
}
```

**Retry Policy:**
- Exponential backoff: 5 retries max
- Circuit breaker: opens after 5 consecutive failures
- Reset via: `PUT /api/webhooks/{id}` with `reset_circuit: true`

---

### 3.2 Server-Sent Events (Real-time Stream)

#### Connect to Event Stream

```typescript
const eventSource = new EventSource('/api/events')

eventSource.addEventListener('message', (event) => {
  const parsed = JSON.parse(event.data)
  console.log('Event:', parsed.type, parsed.data)
})

// Heartbeat every 30s keeps connection alive
```

**Event Types Streamed:**
- `task.*` — Task lifecycle changes
- `agent.*` — Oracle status/lifecycle
- `consensus.*` — Distributed consensus updates
- `learning.*` — Learning round progress
- `audit.*` — Security events

**Use Case:** Live dashboard, real-time alerting, monitoring

---

### 3.3 Polling Pattern (No WebSocket)

For systems without SSE support, poll for updates:

```typescript
// Poll task updates
async function pollTaskStatus(taskId: number, intervalMs = 5000) {
  while (true) {
    const task = await fetch(`/api/tasks/${taskId}`).then(r => r.json())
    if (task.status === 'done') break
    await sleep(intervalMs)
  }
}

// Poll oracle availability
async function findIdleOracle() {
  const { agents } = await fetch('/api/agents?status=idle').then(r => r.json())
  return agents[0]?.name
}
```

---

### 3.4 Governance Gate Pattern

Before dispatching tasks to oracles, check approval gates:

```typescript
// Check human oversight policy
async function submitTaskWithGate(task: Task) {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Governance-Gate': 'human-review' // Require approval
    },
    body: JSON.stringify(task)
  })
  
  if (response.status === 202) {
    // Accepted but pending approval
    const { approval_token } = await response.json()
    return { status: 'pending_approval', approval_token }
  }
  
  return response.json()
}
```

**Available Gates:**
- `human-review`: Requires human approval before execution
- `consensus-threshold`: Requires N/M oracles in agreement
- `cost-limit`: Blocks if estimated cost exceeds threshold

---

### 3.5 Message Passing Between Oracles

#### Oracle-to-Oracle Communication

```typescript
// Send message from one oracle to another
POST /api/agent-comms
{
  from: "lens-oracle",
  to: "aris-oracle",
  message: "Please review my analysis at task #123",
  task_id: 123
}

Response: {
  id: string,
  status: 'delivered',
  created_at: string
}
```

#### Read Inbox

```typescript
GET /api/agent-comms/inbox?agent=aris-oracle

{
  messages: [
    {
      id: string,
      from: string,
      message: string,
      task_id?: number,
      created_at: string,
      read: boolean
    }
  ]
}
```

---

## 4. Plugin/Middleware Architecture

### 4.1 Event Middleware Pattern

Intercept and process oracle events before they reach downstream systems:

```typescript
// src/lib/event-middleware.ts
export interface EventMiddleware {
  name: string
  priority: number                // Lower = runs first
  predicate: (event: ServerEvent) => boolean
  handler: (event: ServerEvent) => ServerEvent | null
}

export function registerMiddleware(middleware: EventMiddleware) {
  eventBus.registerMiddleware(middleware)
}

// Example: Filter sensitive events
registerMiddleware({
  name: 'audit-filter',
  priority: 10,
  predicate: (event) => event.type.startsWith('audit.'),
  handler: (event) => {
    // Log to audit system, then pass through
    auditLog.record(event)
    return event
  }
})
```

---

### 4.2 Task Router Middleware

Customize task assignment logic:

```typescript
// src/lib/task-router-middleware.ts
export interface TaskAssignmentMiddleware {
  name: string
  score: (task: Task, oracle: Agent) => number  // Higher = better match
}

registerAssignmentMiddleware({
  name: 'expertise-matcher',
  score: (task, oracle) => {
    const taskTags = task.tags || []
    const oracleSpecialties = oracle.config?.specialties || []
    const matches = taskTags.filter(t => oracleSpecialties.includes(t))
    return matches.length / Math.max(taskTags.length, 1)
  }
})
```

---

### 4.3 Healing Strategy Plugin

Add custom recovery behaviors:

```typescript
// src/lib/healing/custom-strategy.ts
export interface HealingStrategy {
  name: string
  canHandle: (context: HealingContext) => boolean
  execute: (context: HealingContext) => Promise<HealingResult>
}

registerHealingStrategy({
  name: 'custom-escalation',
  canHandle: (context) => context.failureCount > 3 && context.taskType === 'deployment',
  execute: async (context) => {
    // Custom healing logic
    return {
      action_taken: 'escalated_to_human',
      instructions: 'Needs manual review'
    }
  }
})
```

---

## 5. Webhook & Event Patterns

### 5.1 Event Flow Architecture

```
Oracle Actions
    ↓
Event Bus (in-process)
    ↓
Middleware Chain
    ↓
Registered Webhooks + SSE Streams
    ↓
External Systems (external APIs, message queues, databases)
```

### 5.2 Guaranteed Delivery

Webhooks include:
- **Unique delivery ID** for idempotency
- **Delivery attempt counter** (retry count)
- **Signature verification** (HMAC-SHA256)

Receiver should:
```typescript
// Ensure idempotency
if (seenDeliveryIds.has(deliveryId)) {
  return { status: 200, message: 'Already processed' }
}
seenDeliveryIds.add(deliveryId)

// Verify signature
if (!verifyWebhookSignature(rawBody, signature, secret)) {
  return { status: 401, message: 'Invalid signature' }
}

// Process event
processOracleEvent(event)
```

### 5.3 Webhook Circuit Breaker

Monitor webhook health:

```typescript
GET /api/webhooks/{id}/health

{
  id: 123,
  enabled: true,
  consecutive_failures: 0,
  circuit_open: false,
  last_successful_delivery: "2026-06-10T14:30:00Z",
  last_failed_delivery: null,
  success_rate: 0.95
}
```

Reset failed webhook:
```typescript
PUT /api/webhooks/{id}
{
  reset_circuit: true
}
```

---

## 6. Monitoring & Observability

### 6.1 Consensus Metrics

```typescript
GET /api/metrics/consensus

{
  rounds_completed: 1247,
  avg_consensus_time_ms: 245,
  quorum_participations: 25,
  byzantine_detections: 0,
  timeout_count: 3,
  current_state: 'achieved'
}
```

---

### 6.2 Oracle Performance Metrics

```typescript
GET /api/metrics/agents?agent=lens-oracle

{
  name: "lens-oracle",
  tasks_assigned: 847,
  tasks_completed: 821,
  tasks_failed: 26,
  avg_duration_ms: 1200,
  success_rate: 0.97,
  last_activity: "2026-06-10T15:45:32Z"
}
```

---

### 6.3 Federation Health

```typescript
GET /api/health

{
  status: 'healthy',
  timestamp: "2026-06-10T15:45:32Z",
  oracles_online: 22,
  oracles_total: 25,
  tasks_queue: 145,
  avg_task_wait_ms: 2400,
  consensus_round: 341,
  database_lag_ms: 12,
  event_bus_queue_length: 5
}
```

---

## 7. Reference: Common Integration Scenarios

### 7.1 Connect External CI/CD System

```typescript
// 1. Register webhook for build events
POST /api/webhooks {
  name: "GitLab CI",
  url: "https://mission-control.local:8080/ci-callback",
  events: ["task.created", "task.status_changed"]
}

// 2. When CI job completes, update task:
PUT /api/tasks/123 {
  status: "in_progress",
  metadata: {
    ci_run_id: "pipeline-456",
    ci_url: "https://gitlab.com/.../pipelines/456"
  }
}

// 3. Listen for oracle to complete task
EventSource('/api/events').addEventListener('message', (e) => {
  const { type, data } = JSON.parse(e.data)
  if (type === 'task.status_changed' && data.status === 'done') {
    notifyCI(data)
  }
})
```

---

### 7.2 Connect Monitoring System (Prometheus/Datadog)

```typescript
// Scrape metrics endpoint
GET /api/metrics/agents (+ /consensus, /federation)

// Or push events to monitoring via webhook:
POST /api/webhooks {
  url: "https://events.datadoghq.com/api/v2/events",
  events: ["agent.status_changed", "consensus.*"],
  headers: {
    "DD-API-KEY": "your-key"
  }
}
```

---

### 7.3 Build Custom Dashboard

```typescript
// Real-time dashboard update pattern
function dashboardUpdater() {
  // 1. Initial load
  fetch('/api/fleet').then(renderFleetStatus)
  
  // 2. Listen for changes
  const sse = new EventSource('/api/events')
  sse.addEventListener('message', (e) => {
    const { type, data } = JSON.parse(e.data)
    if (type.startsWith('agent.')) {
      updateAgentWidget(data)
    }
  })
  
  // 3. Poll task updates (fallback)
  setInterval(() => {
    fetch('/api/tasks?status=in_progress')
      .then(r => r.json())
      .then(({ tasks }) => updateTaskList(tasks))
  }, 5000)
}
```

---

## 8. Authentication & Authorization

### 8.1 Role-Based Access Control

```typescript
// Endpoints require one of:
// - 'viewer': Read-only (GET /api/agents, /api/tasks, /api/events)
// - 'operator': Can create/update tasks and agents
// - 'admin': Full access including webhooks, audit, learning triggers
```

### 8.2 API Key Pattern

```typescript
// Header-based auth
Authorization: Bearer <api-key>

// Or query param
GET /api/tasks?api_key=sk_live_...

// Validate before each request
const auth = requireRole(request, 'operator')
if ('error' in auth) return { error: auth.error, status: 401 }
```

---

## 9. Error Handling & Status Codes

| Code | Meaning | Recovery |
|------|---------|----------|
| 200 | Success | None |
| 201 | Created | None |
| 202 | Accepted (async) | Poll status endpoint |
| 400 | Bad request | Fix request body/params |
| 401 | Unauthorized | Check API key/role |
| 404 | Not found | Verify resource ID |
| 409 | Conflict (e.g., duplicate name) | Use unique identifier |
| 429 | Rate limited | Backoff exponentially |
| 500 | Server error | Retry with backoff |

---

## 10. Version & Deprecation Policy

- **Current Version:** 2026-06-10
- **API Stability:** Stable; breaking changes announced 2 weeks in advance
- **Sunset Policy:** Deprecated endpoints removed after 6 months notice

---

## Appendix A: Example: End-to-End Task Submission

```typescript
async function submitAndMonitorTask(taskDescription: string) {
  // 1. Find an idle oracle
  const { agents } = await fetch('/api/agents?status=idle').then(r => r.json())
  if (agents.length === 0) throw new Error('No idle oracles')

  // 2. Create task
  const { id: taskId } = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: taskDescription,
      assigned_to: agents[0].name,
      priority: 'high'
    })
  }).then(r => r.json())

  console.log(`Task ${taskId} assigned to ${agents[0].name}`)

  // 3. Listen for completion
  return new Promise((resolve) => {
    const sse = new EventSource('/api/events')
    sse.addEventListener('message', (e) => {
      const { type, data } = JSON.parse(e.data)
      if (type === 'task.status_changed' && data.id === taskId && data.status === 'done') {
        sse.close()
        resolve(data)
      }
    })
  })
}
```

---

## Appendix B: Glossary

- **Oracle**: Individual autonomous agent (lens, aris, tham, etc.)
- **Federation**: Collective of 25+ oracles working in coordination
- **Lane**: Role category (coordinator, worker, reviewer, monitor, support)
- **Consensus Round**: Distributed voting round to reach agreement on state
- **Healing Action**: Autonomous recovery mechanism (retry, escalate, fallback)
- **Event Middleware**: Plugin that processes events before delivery
- **Circuit Breaker**: Mechanism to pause failing webhooks/integrations

---

**End of Document**
