# Mission Control Quick Reference

## What Is This?

**Mission Control** is the operator-facing control and observability hub for the MarcuzX Forge local-first AI operations workspace. It's a Next.js application that provides real-time visibility into agent status, task runs, system logs, and orchestration surfaces for managing autonomous AI systems.

In plain terms: this is the dashboard and runtime coordinator that lets you see what your AI agents are doing, manage task queues, approve stage gates, and orchestrate multi-agent workflows across Aegis, TechLead, ChatGPT, Codex, Gemini, and other integrated providers.

## Key Features

1. **Agent Network Dashboard** - Visual graph of agent pipeline (coordinator → planner → builder → verifier → reviewer → historian) with live status, availability, and routing decisions
2. **Task & Run Management** - Queue inspection, run execution tracking, stage-gated progression (Scan → Plan → Patch → Validate → Report), and approvals
3. **Live Activity Feed** - Real-time event streaming, logs, and evidence collection from orchestration runs
4. **Multi-Runtime Support** - Bridges PowerShell orchestrator, Aegis TypeScript coordinator, and OpenAI-backed phase orchestrator in one control plane
5. **Worktree Lifecycle** - Centralized git worktree management with lease-based ownership, cleanup policies, and recovery
6. **Context Intelligence** - Automated codebase scanning, relevance ranking, and context compression for agent handoffs
7. **Configuration & Secrets** - Credential management, gateway config, agent runtime assignment, and deployment tracking

## Installation

### From Source

```bash
# Navigate to mission-control directory
cd /mnt/d/01\ Main\ Work/Boots/Agentic\ AI/mission-control

# Install dependencies (requires pnpm)
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys:
# - GROQ_API_KEY (for orchestrator)
# - ANTHROPIC_API_KEY (for Claude)
# - OPENAI_API_KEY (for ChatGPT)
# - SUPABASE_URL, SUPABASE_KEY (for backend)

# Create database and seed initial data
pnpm run temperature:backfill
```

### Dependencies

- **Node.js**: ≥20
- **Package Manager**: pnpm@10.30.3
- **Database**: SQLite (better-sqlite3)
- **Runtimes**:
  - Next.js 16 (web server)
  - TypeScript 5.7
  - Zod (validation)
  - LangChain + LangGraph (orchestration)
  - Anthropic SDK, OpenAI SDK, Groq SDK

## Quick Start

### 1. Start Development Server

```bash
pnpm run dev
```

This starts:
- Next.js dev server on `http://localhost:3000`
- Hot module reloading
- TypeScript type checking

Visit `http://localhost:3000` to see the Mission Control dashboard.

### 2. View Agent Status

```bash
curl http://localhost:3000/api/agents
```

Returns JSON list of all connected agents and their current availability/status.

### 3. Trigger a Task

```bash
node scripts/aegis-cli.mjs create \
  --title "My Task" \
  --description "Do something" \
  --stage "builder"
```

This creates a new task in the queue. The coordinator will route it through the pipeline stages.

### 4. Run Orchestrator Loop

```bash
node scripts/aegis-cli.mjs runs
# List active runs

pnpm run agent:orchestrator:run -- --repo-root .
# Start the full orchestration loop
```

### 5. Check Scheduler

```bash
pnpm run scheduler:start
# Runs background task scheduling daemon
```

## Common Use Cases

### Use Case 1: Monitor Agent Pipeline Execution

**Scenario**: You want to watch a task move through stages.

**Steps**:
1. Open `http://localhost:3000/forge-v2` (Forge V2 orchestration surface)
2. Look for "Active Runs" section showing stage progression
3. Each row shows: task ID, current stage, assigned agent, status, timestamp
4. Click on a run to see detailed logs and artifacts

**Related Files**: `src/components/dashboard/`, `src/lib/forge-v2/`

### Use Case 2: Inspect or Approve a Stage Gate

**Scenario**: A task needs human approval before proceeding to the next stage.

**Steps**:
1. Go to `http://localhost:3000/api/audit` (approval queue)
2. Find the pending task requiring approval
3. Review evidence artifacts from previous stage
4. Submit approval via API:
   ```bash
   curl -X POST http://localhost:3000/api/audit \
     -H "Content-Type: application/json" \
     -d '{"run_id": "...", "stage": "verifier", "approved": true}'
   ```
5. Task automatically advances to next stage

**Related Files**: `src/lib/aegis/coordinator.ts`, `src/app/api/audit/`

### Use Case 3: Add a New Agent to the Pipeline

**Scenario**: You want to integrate a new LLM provider or custom agent.

**Steps**:
1. Add agent profile to `marcuzx-forge/agents/runtime-assignment.json`:
   ```json
   {
     "id": "MyAgent",
     "role": "builder",
     "provider": "custom",
     "model": "my-model",
     "status": "active"
   }
   ```
2. Update stage routing in `agent-runtime.json -> graph.paths.legacy_runtime`
3. Create agent script in `agents/MyAgent/` (if using PowerShell runtime)
4. Run validation:
   ```bash
   pnpm run validate:agent-runtime
   ```
5. Restart the server: `pnpm run dev`

**Related Files**: `agent-runtime.json`, `src/lib/agent-graph.ts`, `marcuzx-forge/agents/`

### Use Case 4: Debug a Failed Run and Inspect Logs

**Scenario**: A task failed and you need to see why.

**Steps**:
1. Query the run: `curl http://localhost:3000/api/activities?run_id=<id>`
2. Review log entries in `.logs/` directory
3. Check artifacts in `.data/artifacts/`
4. Inspect evidence in `src/lib/aegis/evidence/`
5. If Codex repair loop is enabled:
   ```bash
   pnpm run agent:orchestrator:run -- --repair-mode
   ```

**Related Files**: `src/lib/mission-control-status.ts`, `src/lib/aegis/evidence.ts`

### Use Case 5: Deploy to Production

**Scenario**: You're ready to ship Mission Control to production.

**Steps**:
1. Build the application:
   ```bash
   pnpm run build
   ```
2. Run linting and tests:
   ```bash
   pnpm run test:all
   ```
3. Verify scheduler builds:
   ```bash
   pnpm run scheduler:build
   ```
4. Run smoke test:
   ```bash
   pnpm run aegis:smoke:test
   ```
5. If using Supabase edge functions, deploy:
   ```bash
   supabase functions deploy distill-session-extract
   supabase functions deploy distill-session-distill
   supabase functions deploy distill-session-store
   ```

**Related Files**: `DEPLOYMENT_GUIDE.md`, `package.json` (build/test scripts)

## Important Files

| Path | Purpose |
|------|---------|
| **`agent-runtime.json`** | Authoritative agent inventory, gateway config, graph edges, explicit pipeline shape (coordinator → planner → builder → verifier → reviewer → historian) |
| **`marcuzx-forge/agents/runtime-assignment.json`** | Active agent pool, role bindings, provider metadata, routing status |
| **`src/lib/agent-graph.ts`** | Unifying graph layer; resolves stages to agents; PIPELINE_GRAPH definition |
| **`src/lib/aegis/`** | TypeScript coordinator: run/task persistence, deterministic progression, approval gates |
| **`src/lib/forge-v2/`** | Stage and gate model implementation; stage routing logic |
| **`src/app/api/`** | REST endpoints: `/agents`, `/audit`, `/activities`, `/forge`, `/context-intelligence`, etc. |
| **`engine/orchestrator/orchestrator.ps1`** | Authoritative PowerShell execution runtime (legacy pipeline) |
| **`engine/orchestrator/stage-router/stage-router.ps1`** | Live stage execution order and hand-off serialization |
| **`src/lib/mission-control-status.ts`** | Status aggregation: agent availability, run snapshots, activity summaries |
| **`src/lib/context-intelligence.ts`** | Codebase scanning, relevance ranking, context compression |
| **`src/components/dashboard/agent-network.tsx`** | Agent graph visualization; renders PIPELINE_GRAPH with live session overlay |
| **`scripts/aegis-cli.mjs`** | CLI for task creation, run inspection, health checks |
| **`.env.example`** | Template for required API keys and environment variables |

### Key Entry Points

- **Web UI**: `src/app/page.tsx` (HQ shell / root dashboard)
- **Forge V2 Surface**: `src/app/forge-v2/` (stage-gated orchestration surface)
- **API Handler**: `src/app/api/` (all REST endpoints)
- **Daemon**: `src/daemon/scheduler-daemon.ts` (background task scheduler)
- **CLI**: `scripts/aegis-cli.mjs` (command-line task and run management)

---

**Last updated**: 2026-06-11 | **Version**: 1.2.0
