---
name: 1336-architecture
description: **Generated:** 2026-06-11  
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-11
  source: fleet-memory
---

# Mission Control Architecture Documentation

**Project:** Mission Control (v1.2.0)  
**Description:** Marcuzx Forge local control and observability host  
**Generated:** 2026-06-11  
**Runtime:** Node.js 20+, pnpm 10.30.3

---

## Table of Contents

1. [Directory Structure](#directory-structure)
2. [Entry Points](#entry-points)
3. [Core Abstractions](#core-abstractions)
4. [Technology Stack](#technology-stack)
5. [Module Relationships](#module-relationships)
6. [Key Features](#key-features)

---

## Directory Structure

```
mission-control/
├── src/
│   ├── app/                          # Next.js App Router pages and API routes
│   │   ├── api/                      # REST API endpoints (30+ routes)
│   │   ├── dashboard/                # Dashboard feature module
│   │   ├── chat/                     # Chat interface module
│   │   ├── forge/                    # Forge integration module
│   │   ├── forge-omega/              # Omega orchestrator integration
│   │   ├── forge-v2/                 # Forge v2 features
│   │   ├── groq-office/              # Groq office management interface
│   │   ├── temperature-monitoring/   # Temperature sensor dashboard
│   │   ├── salary-certificate/       # HR certification module
│   │   ├── public-holiday-change/    # Holiday management
│   │   ├── login/                    # Authentication page
│   │   ├── docs/                     # Documentation pages
│   │   ├── webhooks/                 # Webhook handlers
│   │   ├── page.tsx                  # Root dashboard page
│   │   ├── layout.tsx                # Root layout wrapper
│   │   └── globals.css               # Global styles
│   │
│   ├── components/                   # Reusable React components
│   │   ├── dashboard/                # Dashboard components
│   │   ├── chat/                     # Chat UI components
│   │   ├── layout/                   # Layout components (nav, header, sidebar)
│   │   ├── control-center/           # Control center UI
│   │   ├── forge/                    # Forge UI components
│   │   ├── forge-v2/                 # Forge v2 UI components
│   │   ├── groq-office/              # Groq office UI
│   │   ├── hud/                      # Heads-up display components
│   │   ├── panels/                   # Reusable panel components
│   │   ├── settings/                 # Settings UI components
│   │   ├── ui/                       # Base UI primitives
│   │   ├── temperature-monitoring/   # Temperature UI
│   │   ├── salary-certificate/       # HR UI
│   │   ├── public-holiday-change/    # Holiday UI
│   │   ├── ErrorBoundary.tsx         # Error boundary component
│   │   ├── providers.tsx             # React context providers
│   │   └── neural-office/            # Neural office interface
│   │
│   ├── lib/                          # Core business logic & utilities
│   │   ├── db.ts                     # SQLite database initialization
│   │   ├── migrations.ts             # Database schema migrations
│   │   ├── event-bus.ts              # Server-side event broadcasting
│   │   ├── orchestrator-*.ts         # Orchestrator control & runtime (8+ files)
│   │   ├── agent-*.ts                # Agent management & governance (9+ files)
│   │   ├── scheduler.ts              # Task scheduler daemon
│   │   ├── forge-queue.ts            # Forge task queue
│   │   ├── model-router.ts           # Multi-model LLM routing
│   │   ├── models.ts                 # Model catalog & config
│   │   ├── fleet-registry.ts         # Oracle fleet tracking
│   │   ├── gateway-runtime.ts        # Runtime gateway integration
│   │   ├── context-intelligence.ts   # Context awareness system
│   │   ├── autonomous-loop.ts        # Autonomous execution loop
│   │   ├── auth.ts                   # Authentication logic
│   │   ├── session-cookie.ts         # Session management
│   │   ├── github.ts                 # GitHub API integration
│   │   ├── google-auth.ts            # Google OAuth integration
│   │   ├── config.ts                 # Configuration management
│   │   ├── logger.ts                 # Structured logging (Pino)
│   │   ├── env.ts                    # Environment variable schema
│   │   ├── paths.ts                  # Path resolution
│   │   ├── rate-limit.ts             # Rate limiting utilities
│   │   └── websocket.ts              # WebSocket client utilities
│   │
│   ├── store/                        # Zustand state management
│   │   └── index.ts                  # Global app state (Zustand + selectors)
│   │
│   ├── types/                        # TypeScript type definitions
│   │   ├── mission-control.ts        # Mission control domain types
│   │   ├── context-intelligence.ts   # Context types
│   │   ├── runtime-activation.ts     # Runtime activation types
│   │   └── index.ts                  # Re-exports
│   │
│   ├── daemon/                       # Long-running daemons
│   │   └── scheduler-daemon.ts       # Task scheduler daemon entry point
│   │
│   ├── bin/                          # Executable CLI entry points
│   │   └── run-agent-orchestrator.ts # Agent orchestrator launcher
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-neural-office-events.ts
│   │   └── use-neural-office-snapshot.ts
│   │
│   ├── styles/                       # CSS modules & styling
│   │
│   └── test/                         # Test utilities & fixtures
│
├── ai-orchestrator/                  # Multi-model orchestration system
│   ├── index.js                      # CLI entry point
│   ├── src/
│   │   ├── orchestrator.js           # Task decomposition
│   │   ├── task-router.js            # Agent routing logic
│   │   ├── team-memory.js            # Agent registry & learnings
│   │   ├── gemini-models.js          # Gemini model resolver
│   │   └── local-executor.js         # Fallback executor
│   └── output/                       # Generated files (runtime)
│
├── cloudflare-temperature-portal/    # Separate temperature monitoring app
│   └── [Vite + React application]
│
├── B2B/                              # B2B portal (separate Next.js app)
│   └── [B2B features]
│
├── config/                           # Configuration files
│   ├── maw-wake-zeus.config.json     # Zeus orchestration config
│   ├── omega-model-router.config.json # Model routing rules
│   └── zeus-fallback-policy.json     # Fallback policies
│
├── contracts/                        # JSON schemas for data contracts
│   ├── agent-result.schema.json
│   ├── evidence.schema.json
│   └── message.schema.json
│
├── scripts/                          # Development & deployment scripts
│   ├── dev-reset.js                  # Dev server initialization
│   ├── start-stack.js                # Production stack launcher
│   ├── scheduler-daemon.ts           # Scheduler daemon TypeScript
│   ├── normalize-agents.mjs          # Agent normalization script
│   ├── validate-agent-runtime-sync.mjs
│   ├── sync-forge-secrets.mjs        # Secret synchronization
│   ├── aegis-cli.mjs                 # Task CLI interface
│   ├── aegis-smoke-test.mjs          # Smoke testing
│   ├── telegram-poll-daemon.mjs      # Telegram bridge daemon
│   └── temperature_backfill.py       # Python temperature data backfill
│
├── tools/                            # Build & utility tools
│   ├── bootstrap/                    # Bootstrap & initialization
│   ├── install-deps.ps1              # PowerShell dependency installer
│   ├── worktree-housekeeping.ps1     # Git worktree cleanup
│   ├── normalize-task-contract.mjs   # Task contract normalization
│   └── backup/                       # Backup utilities
│
├── artifacts/                        # Runtime artifacts (generated)
│
├── package.json                      # Root dependencies & scripts
├── next.config.js                    # Next.js configuration
├── tsconfig.json                     # TypeScript main config
├── tsconfig.orchestrator.json        # Orchestrator TypeScript config
├── tsconfig.scheduler.json           # Scheduler TypeScript config
├── tailwind.config.js                # Tailwind CSS config
├── vitest.config.ts                  # Unit test configuration
├── playwright.config.ts              # E2E test configuration
├── postcss.config.js                 # PostCSS configuration
└── vercel.json                       # Vercel deployment config
```

---

## Entry Points

### Primary User Interface
- **`src/app/page.tsx`** - Root dashboard (SSR + client-side hybrid)
  - Dynamic panel imports with lazy loading
  - WebSocket server-sent events (SSE) integration
  - Layout: NavRail + HeaderBar + Live Feed + System Now Panel

### API Routes (30+ endpoints)
- **`src/app/api/[feature]/route.ts`** - Next.js API handlers
  - RESTful endpoints for tasks, agents, activities, alerts, audit logs
  - WebSocket upgrade handlers
  - Webhook receivers
  - Authentication & session management

### Background Daemons
- **`src/bin/run-agent-orchestrator.ts`** - Agent orchestrator launcher
  - Spawns multi-model orchestration system (Groq → Gemini/Ollama)
  - Task decomposition & routing

- **`src/daemon/scheduler-daemon.ts`** - Scheduled task executor
  - Cron-based task triggering
  - Recovery of stuck tasks
  - State persistence in SQLite

- **`ai-orchestrator/index.js`** - CLI task interface
  - Entry point: `node index.js "task description"`
  - Groq primary, Gemini/Ollama fallback

### Development Entry Point
- **`scripts/dev-reset.js`** - `npm run dev`
  - Initializes dev server (supports raw, turbo, webpack bundlers)
  - Runs migrations, syncs secrets

- **`scripts/start-stack.js`** - `npm start` (production)
  - Launches full stack (Next.js + scheduler daemon)

---

## Core Abstractions

### 1. **Database Layer** (`src/lib/db.ts`)
- **SQLite** with WAL mode for concurrent access
- **Path:** `config.dbPath` (typically `.data/mission-control.db`)
- **Features:**
  - Foreign keys enabled
  - Transaction support via `db.transaction()`
  - Event broadcasting on mutations via `eventBus`
  - Schema versioning via `migrations.ts`
- **Main Tables:**
  - `users` - Authentication & roles
  - `tasks` - Task inbox & workflow
  - `agents` - Agent registry & status
  - `activities` - Audit log
  - `notifications` - User alerts
  - `sessions` - Chat/agent sessions
  - `settings` - Configuration key-value store
  - `orchestrator_runs` - Orchestrator execution history

### 2. **Event Bus** (`src/lib/event-bus.ts`)
- **Singleton EventEmitter** for server-side broadcasts
- **Event Types:** 16+ including:
  - `task.*` - Task lifecycle events
  - `agent.*` - Agent status changes
  - `chat.message` - Chat events
  - `audit.security` - Security events
  - `office.event` - Office management events
- **Transport:** Server-Sent Events (SSE) to clients
- **Pattern:** Pub-sub with HMR survival via `globalThis`

### 3. **State Management** (`src/store/index.ts`)
- **Zustand** store with `subscribeWithSelector` middleware
- **Root Slices:**
  - `sessionState` - Chat/agent sessions
  - `logsState` - Structured logging
  - `taskState` - Task tracking
  - `agentState` - Agent status
  - `settingsState` - User preferences
  - `tokenUsageState` - Cost tracking
  - `missionControlState` - Orchestrator health
- **Features:** Selector subscriptions, device persistence, type safety

### 4. **Agent Management** (`src/lib/agent-*.ts`)
- **Registry:** `src/lib/agent-runtime-status.ts` - health, availability checks
- **Governance:** `src/lib/agent-governance.ts` - role definitions, permissions
- **Sync:** `src/lib/agent-sync.ts` - bidirectional sync with fleet
- **Templates:** `src/lib/agent-templates.ts` - agent configuration blueprints
- **Graph:** `src/lib/agent-graph.ts` - agent dependency mapping
- **Availability:** `src/lib/agent-availability.ts` - capability scoring

### 5. **Orchestrator Control** (`src/lib/orchestrator-*.ts`)
- **`orchestrator-control.ts`** - Master control state machine
  - States: `running`, `idle`, `paused`, `stopped`
  - Feature toggles: autonomous loop, auto-spawn, debate, self-heal
  - Action dispatch to team agents

- **`orchestrator-launch.ts`** - Spawn orchestrator processes
  - Fork processes or CLI spawning
  - Arguments: repo-root, task, timeout

- **`orchestrator-spawn.ts`** - Task spawning & queue management
  - BullMQ integration
  - Job persistence, retries, deadletter

- **`orchestrator-runtime-status.ts`** - Monitor orchestrator health
  - Active run tracking
  - Execution metrics

### 6. **Scheduler** (`src/lib/scheduler.ts`)
- **Cron-based task triggering** using schedule syntax
- **Recovery:** `runStuckTaskRecoveryPass()` - restart stalled tasks
- **State:** Stored in settings table
- **Daemon:** Runs as separate Node.js process (`.scheduler-dist/`)

### 7. **Model Router** (`src/lib/model-router.ts`)
- **Multi-model LLM routing:**
  - Claude (Anthropic SDK)
  - Groq (primary orchestrator)
  - Gemini (fallback team)
  - Ollama (local fallback)
- **Configuration:** `config/omega-model-router.config.json`
- **Health tracking:** Provider availability & fallback policies
- **Token counting:** Cost estimation per model

### 8. **Authentication & Sessions** 
- **DB-backed:** Username/password stored in `users` table (bcrypt-hashed)
- **Session:** Cookie-based with `NEXT_AUTH_SECRET`
- **OAuth:** Google integration via `src/lib/google-auth.ts`
- **Middleware:** `src/lib/auth.ts` - role-based access control

### 9. **Context Intelligence** (`src/lib/context-intelligence.ts`)
- **Codebase awareness:** AST parsing, symbol indexing
- **Memory augmentation:** RAG store (`.rag-store.db`)
- **Type:** `ContextIntelligenceState` in Zustand store
- **Lattice-based:** Indexed hierarchies for fast lookups

### 10. **Fleet Registry** (`src/lib/fleet-registry.ts`)
- **Tracks 25+ distributed Oracle agents** across sessions
- **Peer-to-peer discovery:** Lease-based registration
- **Health metrics:** Heartbeat polling, Byzantine-fault tolerance
- **Consensus:** Distributed ledger for state agreement

---

## Technology Stack

### Frontend
- **Framework:** Next.js 16.1.6 (App Router, Server Components)
- **UI Library:** React 19.0.1 with TypeScript 5.7.2
- **Styling:** Tailwind CSS 3.4.17 + PostCSS
- **Components:** 
  - Lucide React (icons)
  - Recharts (data visualization)
  - Reactflow (graph rendering)
  - @xyflow/react (flow diagrams)
- **State:** Zustand 5.0.11 (lightweight alternative to Redux)
- **Themes:** next-themes (dark mode)

### Backend
- **Runtime:** Node.js 20+ (with ts-node support)
- **Database:** SQLite 3 with better-sqlite3 (sync API)
- **Logging:** Pino 10.3.1 (structured JSON logging)
- **WebSocket:** ws 8.19.0, MQTT 5.15.1
- **API Clients:**
  - Anthropic SDK (Claude API)
  - LangChain (orchestration)
  - LangGraph (agentic workflows)
  - Supabase client (optional integrations)

### Orchestration & AI
- **LangChain/LangGraph:** 1.3.2 (multi-step workflows)
- **Model Context Protocol:** @modelcontextprotocol/sdk 1.29.0
- **AI Orchestrator:** Custom Node.js system (ai-orchestrator/)
  - Groq (primary decomposition)
  - Gemini + Ollama (team execution)

### Testing
- **Unit:** Vitest 4.0.18
- **E2E:** Playwright 1.51.0
- **DOM Testing:** @testing-library/react 16.1.0

### Build & Development
- **Package Manager:** pnpm 10.30.3 (monorepo-ready)
- **Build Tools:** Next.js built-in (Turbopack or Webpack)
- **TypeScript Compilation:** tsc 5.7.2 + tsc-alias
- **Linting:** ESLint 9.18.0 with Next.js config
- **Dev Server:** Supports raw, turbo, webpack bundler modes

### DevOps & Deployment
- **Hosting:** Vercel (production)
- **IaC:** Terraform (optional)
- **Containerization:** Docker (Dockerfile present)
- **Environment:** `.env`, `.env.local`, `.env.test`

---

## Module Relationships

### Dependency Graph

```
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js App Router                          │
│  ├─ src/app/page.tsx (Root Dashboard)                           │
│  ├─ src/app/api/* (30+ REST endpoints)                          │
│  └─ src/app/*/page.tsx (Feature pages)                          │
└────────────────┬────────────────────────────────────────────────┘
                 │ imports
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              React Components Layer                             │
│  ├─ src/components/dashboard/* (Dashboard UI)                  │
│  ├─ src/components/chat/* (Chat interface)                     │
│  ├─ src/components/control-center/* (Control UI)               │
│  ├─ src/components/layout/* (Navigation, Header)               │
│  ├─ src/components/panels/* (Reusable panels)                  │
│  └─ src/components/ui/* (Base primitives)                      │
└────────────────┬────────────────────────────────────────────────┘
                 │ uses
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              Custom Hooks & Store                               │
│  ├─ src/hooks/* (React hooks)                                  │
│  ├─ src/store/index.ts (Zustand global state)                  │
│  └─ useWebSocket, useServerEvents (connection utilities)       │
└────────────────┬────────────────────────────────────────────────┘
                 │ dispatches actions to
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              Core Business Logic (src/lib/)                     │
│  ├─ Database Layer                                             │
│  │  ├─ db.ts (SQLite connection)                              │
│  │  └─ migrations.ts (Schema versioning)                      │
│  │                                                             │
│  ├─ Event System                                               │
│  │  ├─ event-bus.ts (Server-side Pub/Sub)                    │
│  │  └─ useServerEvents hook (SSE subscription)               │
│  │                                                             │
│  ├─ Orchestration                                              │
│  │  ├─ orchestrator-control.ts (Master state machine)         │
│  │  ├─ orchestrator-launch.ts (Process spawning)              │
│  │  ├─ orchestrator-spawn.ts (Task queue)                     │
│  │  └─ orchestrator-runtime-status.ts (Health)                │
│  │                                                             │
│  ├─ Agent Management                                            │
│  │  ├─ agent-runtime-status.ts (Health checks)                │
│  │  ├─ agent-governance.ts (RBAC)                             │
│  │  ├─ agent-sync.ts (Fleet sync)                             │
│  │  └─ fleet-registry.ts (Discovery & leasing)                │
│  │                                                             │
│  ├─ Task Scheduling                                             │
│  │  ├─ scheduler.ts (Cron engine)                             │
│  │  ├─ forge-queue.ts (Task queue)                            │
│  │  └─ scheduler-daemon.ts (Background process)               │
│  │                                                             │
│  ├─ Model Routing                                               │
│  │  ├─ model-router.ts (Multi-LLM dispatch)                   │
│  │  ├─ models.ts (Model catalog)                              │
│  │  └─ gateway-runtime.ts (Gateway integration)                │
│  │                                                             │
│  ├─ Context & Memory                                            │
│  │  ├─ context-intelligence.ts (RAG indexing)                 │
│  │  └─ autonomous-loop.ts (Self-improvement)                   │
│  │                                                             │
│  └─ Utilities                                                  │
│     ├─ auth.ts (Authentication)                               │
│     ├─ config.ts (Configuration)                              │
│     ├─ logger.ts (Structured logging)                         │
│     └─ [20+ more utilities]                                   │
└────────────────┬────────────────────────────────────────────────┘
                 │ connects to
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              External Systems                                   │
│  ├─ SQLite Database (.data/mission-control.db)                 │
│  ├─ Event Bus (In-memory EventEmitter)                         │
│  ├─ LLM APIs (Anthropic, Groq, Google, Ollama)                 │
│  ├─ GitHub API (Sync & webhooks)                               │
│  ├─ Google OAuth (Authentication)                              │
│  ├─ WebSocket (Real-time client updates)                       │
│  ├─ SSE (Server-Sent Events)                                   │
│  └─ Agent Orchestrator (ai-orchestrator/)                      │
└─────────────────────────────────────────────────────────────────┘
```

### API Route Organization

```
src/app/api/
├── activities/                  # Activity audit log endpoints
├── agents/                      # Agent registry & status
├── alerts/                      # Alert management
├── audit/                       # Audit trail
├── backup/                      # Database backup
├── chat/                        # Chat message endpoints
├── cleanup/                     # Database cleanup
├── connect/                     # Connection management
├── connected-projects/          # Linked project tracking
├── context-intelligence/        # RAG indexing
├── credentials/                 # Credential management
├── cron/                        # Cron job management
├── docs/                        # Documentation API
├── events/                      # SSE event streaming
├── export/                      # Data export
├── fleet/                       # Fleet management
├── forge/                       # Forge operations
├── gateway-config/              # Gateway configuration
├── gateways/                    # Gateway endpoints
├── github/                      # GitHub integration
├── health/                      # System health check
├── integrations/                # Integration management
├── logs/                        # Log streaming
├── memory/                      # Memory management
├── notifications/               # Notification endpoints
├── orchestrator/                # Orchestrator control
├── pipelines/                   # Pipeline endpoints
├── quality-review/              # QA endpoints
├── readme/                      # README endpoints
└── scheduler/                   # Scheduler control
```

---

## Key Features

### 1. **Multi-Modal AI Orchestration**
- Groq as primary orchestrator (task decomposition)
- Gemini & Ollama as team executors
- Fallback routing with health monitoring
- Token usage & cost tracking per model

### 2. **Distributed Agent Fleet**
- 25+ Oracle agents across 6 continents
- Peer-to-peer discovery with lease-based registration
- Byzantine-fault-tolerant consensus
- Autonomous spawn/retire based on queue depth

### 3. **Task Workflow Management**
- Inbox → Assigned → In Progress → Review → Done pipeline
- Priority levels: Low, Medium, High, Urgent
- Evidence gates for quality assurance
- Self-healing loop with orchestrator decision tracking

### 4. **Real-Time Observability**
- Server-Sent Events (SSE) for live updates
- Structured logging with Pino (JSON output)
- WebSocket support for low-latency communication
- Activity audit trail with timestamps

### 5. **Autonomous Execution Modes**
- **Autonomous Dev Loop:** Continuous task processing
- **Auto-spawn Agents:** Dynamic pool scaling (spawn Q>15, retire Q<3)
- **Agent Debate:** Multi-agent consensus on contentious tasks
- **Self-healing:** Automatic recovery from errors

### 6. **Context-Aware Execution**
- RAG store (`.rag-store.db`) for code indexing
- Symbol & AST-based context extraction
- Lattice-based relevance ranking
- Memory augmentation for task context

### 7. **Multi-Tenant Security**
- Role-based access control (RBAC)
- Audit logging of all changes
- Credential management with encryption
- Google OAuth integration

### 8. **Extensible Architecture**
- Plugin system via LangChain/LangGraph
- Custom tool definitions via Model Context Protocol
- Webhook receivers for external integrations
- Configuration-driven behavior (settings table)

---

## Build & Deployment

### Development
```bash
npm run dev              # Start dev server (default bundler)
npm run dev:raw         # Raw bundler (no transpilation)
npm run dev:turbo       # Turbopack (fast)
npm run dev:webpack     # Webpack (compatible)
```

### Production
```bash
npm run build           # Build Next.js + scheduler
npm start              # Run full stack (Next.js + daemon)
```

### Compilation
```bash
npm run typecheck      # TypeScript type checking
npm run lint           # ESLint
npm run test           # Unit tests (Vitest)
npm run test:e2e       # E2E tests (Playwright)
npm run quality:gate   # Full CI pipeline
```

### Database
```bash
npm run agents:normalize         # Sync agent registry
npm run validate:agent-runtime   # Validate runtime config
npm run forge:sync-secrets       # Sync Forge secrets
```

---

## Configuration Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables (secrets, URLs) |
| `.env.local` | Local overrides |
| `next.config.js` | Next.js build config (CSP, Webpack) |
| `tsconfig.json` | TypeScript compiler options |
| `tailwind.config.js` | Tailwind CSS theming |
| `vitest.config.ts` | Unit test configuration |
| `playwright.config.ts` | E2E test configuration |
| `config/*.json` | Orchestrator & routing policies |
| `contracts/*.schema.json` | Data contract validation |

---

## Data Persistence

- **SQLite Database:** `.data/mission-control.db`
  - Schema versioned via migrations
  - WAL mode enabled for concurrency
  - Foreign keys enforced

- **RAG Store:** `.rag-store.db`
  - Vector embeddings for code indexing
  - Similarity search for context retrieval

- **Runtime State:** `.data/scheduler-daemon-heartbeat.json`
  - Scheduler daemon heartbeat tracking

- **Artifacts:** `artifacts/` (generated at runtime)
  - Sensor data snapshots
  - Execution logs
  - Report outputs

---

## Notable Libraries & Integrations

| Library | Version | Purpose |
|---------|---------|---------|
| `next` | 16.1.6 | Framework |
| `react` | 19.0.1 | UI library |
| `zustand` | 5.0.11 | State management |
| `better-sqlite3` | 12.6.2 | Database |
| `pino` | 10.3.1 | Logging |
| `@langchain/langgraph` | 1.3.2 | Agent workflows |
| `@anthropic-ai/sdk` | 0.78.0 | Claude API |
| `recharts` | 3.7.0 | Charting |
| `tailwindcss` | 3.4.17 | Styling |
| `typescript` | 5.7.2 | Type system |

---

## Summary

Mission Control is a sophisticated **agentic orchestration platform** combining:

1. **Frontend Dashboard** - Real-time observability UI (React + Next.js)
2. **API Layer** - 30+ RESTful endpoints with SSE streaming
3. **Task Orchestrator** - Multi-model AI routing (Groq → Gemini/Ollama)
4. **Distributed Fleet** - 25+ Oracle agents with consensus
5. **Persistent Storage** - SQLite with migrations, RAG indexing
6. **Background Daemons** - Scheduler, orchestrator, health monitors
7. **Security & Auth** - RBAC, audit logging, OAuth integration

The architecture emphasizes **scalability** (elastic agent pool), **reliability** (Byzantine consensus, self-healing), and **observability** (structured logging, real-time SSE, activity trails).

---

**End of Architecture Documentation**
