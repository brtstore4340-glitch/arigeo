---
name: 1336-code-snippets
description: **Focus:** Main entry point, core implementations, design patterns, configuratio
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-11
  source: fleet-memory
---

# Mission Control — Code Snippets & Patterns

**Date:** 2026-06-11  
**Source:** `/mnt/d/01 Main Work/Boots/Agentic AI/mission-control`  
**Focus:** Main entry point, core implementations, design patterns, configuration, and error handling

---

## 1. Main Entry Point: Development Bootstrap (`dev-reset.js`)

The primary entry point that orchestrates the entire development stack. It manages process lifecycle, native dependencies, and daemon spawning.

```javascript
#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')
const { execFileSync, spawn } = require('node:child_process')

const projectRoot = process.cwd()
const nextDir = path.join(projectRoot, '.next')
const schedulerDistDir = path.join(projectRoot, '.scheduler-dist')
const schedulerEntry = path.join(schedulerDistDir, 'daemon', 'scheduler-daemon.js')
const schedulerPidFile = path.join(projectRoot, '.data', 'scheduler-daemon.pid')
const port = String(process.env.PORT || '3005')
const bundler = (process.env.MC_DEV_BUNDLER || 'turbo').toLowerCase()

// Kill stale processes on port
for (const pid of getListeningPids(port)) {
  if (killPid(pid)) {
    log(`Stopped stale process on port ${port} (PID ${pid})`)
  }
}

clearNextArtifacts()
clearSchedulerArtifacts()
ensureBetterSqlite3()
buildScheduler()

// Spawn scheduler daemon and Next dev server as concurrent processes
const scheduler = spawn(process.execPath, [schedulerEntry], {
  cwd: projectRoot,
  stdio: 'inherit',
  env: { ...process.env, MC_PROCESS_ROLE: 'scheduler-daemon' }
})

const nextBin = require.resolve('next/dist/bin/next')
const child = spawn(process.execPath, [nextBin, 'dev', '--hostname', host, '--port', port], {
  cwd: projectRoot,
  stdio: 'inherit'
})

// Forward signals to both processes
process.on('SIGINT', () => {
  if (!scheduler.killed) scheduler.kill('SIGINT')
  if (!child.killed) child.kill('SIGINT')
})
```

**Key Patterns:**
- **Process lifecycle management** — Manages scheduler daemon and Next server as siblings
- **Port cleanup** — Kills stale processes before binding to port (prevents "address in use" errors)
- **Native binding recovery** — Auto-rebuilds better-sqlite3 on permission errors
- **Signal forwarding** — Graceful shutdown propagates to all spawned children

---

## 2. Core Implementation: Zustand State Management (`src/index.ts`)

Centralized client-side state store using Zustand with subscribeWithSelector middleware. Manages Mission Control's 7 major domains.

```typescript
'use client'

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export const useMissionControl = create<MissionControlStore>()(
  subscribeWithSelector((set, get) => ({
    // Connection State
    connection: { isConnected: false, url: '', reconnectAttempts: 0 },
    setConnection: (connection) =>
      set((state) => ({ connection: { ...state.connection, ...connection } })),

    // Tasks (inbox → assigned → in_progress → review → done)
    tasks: [],
    setTasks: (tasks) => set({ tasks }),
    updateTask: (taskId, updates) =>
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        ),
        selectedTask: state.selectedTask?.id === taskId
          ? { ...state.selectedTask, ...updates }
          : state.selectedTask
      })),

    // Logs with deduplication (prevent duplicates via message ID)
    logs: [],
    addLog: (log) =>
      set((state) => {
        const existingIndex = state.logs.findIndex(l => l.id === log.id)
        if (existingIndex !== -1) {
          const updated = [...state.logs]
          updated[existingIndex] = log
          return { logs: updated }
        }
        return { logs: [log, ...state.logs].slice(0, 1000) }
      }),

    // Chat with pending message deduplication
    chatMessages: [],
    addChatMessage: (message) =>
      set((state) => {
        if (message.id > 0 && state.chatMessages.some(m => m.id === message.id)) {
          return state // Skip duplicate
        }
        const messages = [...state.chatMessages, message].slice(-500)
        return { chatMessages: messages }
      }),

    // UI Persistence (localStorage bridge)
    sidebarExpanded: (() => {
      if (typeof window === 'undefined') return false
      try { return localStorage.getItem('mc-sidebar-expanded') === 'true' } catch { return false }
    })(),
    setSidebarExpanded: (expanded) => {
      try { localStorage.setItem('mc-sidebar-expanded', String(expanded)) } catch {}
      set({ sidebarExpanded: expanded })
    }
  }))
)
```

**Key Patterns:**
- **Deduplication by ID** — Prevents duplicates in logs and chat via findIndex check
- **Memory ceiling** — Keeps recent 1000 logs and 500 messages (circular buffer pattern)
- **Conditional persistence** — localStorage only accessed in browser context (SSR-safe)
- **Spread updates** — Shallow merges allow partial updates without losing nested state
- **Selector middleware** — Enables granular subscriptions: `store.subscribe(state => state.tasks, handler)`

---

## 3. Core Implementation: WebSocket Gateway Protocol (`src/lib/websocket.ts`)

Real-time bidirectional communication with protocol v3 handshake, heartbeat, and exponential backoff reconnection.

```typescript
export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null)
  const handshakeCompleteRef = useRef<boolean>(false)
  const reconnectAttemptsRef = useRef<number>(0)
  const missedPongsRef = useRef<number>(0)

  // Heartbeat with missed pong detection
  const startHeartbeat = useCallback(() => {
    if (pingIntervalRef.current) clearInterval(pingIntervalRef.current)
    
    pingIntervalRef.current = setInterval(() => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
      
      if (missedPongsRef.current >= MAX_MISSED_PONGS) {
        console.warn(`Missed ${MAX_MISSED_PONGS} pongs, triggering reconnect`)
        wsRef.current?.close(4000, 'Heartbeat timeout')
        return
      }

      const pingId = `ping-${++pingCounterRef.current}`
      pingSentTimestamps.current.set(pingId, Date.now())
      missedPongsRef.current += 1

      wsRef.current.send(JSON.stringify({
        type: 'req',
        method: 'ping',
        id: pingId
      }))
    }, PING_INTERVAL_MS)
  }, [addLog])

  // Handle pong response and calculate latency
  const handlePong = useCallback((frameId: string) => {
    const sentAt = pingSentTimestamps.current.get(frameId)
    if (sentAt) {
      const rtt = Date.now() - sentAt
      pingSentTimestamps.current.delete(frameId)
      missedPongsRef.current = 0
      setConnection({ latency: rtt })
    }
  }, [setConnection])

  // Connect handshake: send protocol version + client metadata
  const sendConnectHandshake = useCallback((ws: WebSocket) => {
    const connectRequest = {
      type: 'req',
      method: 'connect',
      id: nextRequestId(),
      params: {
        minProtocol: PROTOCOL_VERSION,
        maxProtocol: PROTOCOL_VERSION,
        client: {
          id: 'gateway-client',
          displayName: 'Mission Control',
          version: '2.0.0',
          platform: 'web'
        },
        role: 'operator',
        auth: authTokenRef.current ? { token: authTokenRef.current } : undefined
      }
    }
    ws.send(JSON.stringify(connectRequest))
  }, [])

  const connect = useCallback((url: string, token?: string) => {
    authRejectedRef.current = false
    authTokenRef.current = token || process.env.NEXT_PUBLIC_GATEWAY_TOKEN || ''
    handshakeCompleteRef.current = false

    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => {
      setConnection({ url, reconnectAttempts: 0 })
    }

    ws.onmessage = (event) => {
      try {
        const frame = JSON.parse(event.data) as GatewayFrame
        handleGatewayFrame(frame, ws)
      } catch (error) {
        console.error('Failed to parse message:', error)
      }
    }

    ws.onclose = (event) => {
      setConnection({ isConnected: false })
      handshakeCompleteRef.current = false
      stopHeartbeat()

      // Auth errors stop reconnect; others use exponential backoff
      if (authRejectedRef.current) {
        addLog({
          id: `auth-stop-${Date.now()}`,
          timestamp: Date.now(),
          level: 'warn',
          source: 'gateway',
          message: 'Gateway rejected auth token. Fix NEXT_PUBLIC_GATEWAY_TOKEN and reconnect manually.'
        })
        return
      }

      const attempts = reconnectAttemptsRef.current
      if (attempts < maxReconnectAttempts) {
        const timeout = Math.min(Math.pow(2, attempts) * 1000, 30000)
        reconnectAttemptsRef.current = attempts + 1
        reconnectTimeoutRef.current = setTimeout(() => {
          connect(url, authTokenRef.current)
        }, timeout)
      }
    }
  }, [setConnection, handleGatewayFrame, addLog, stopHeartbeat])

  return { isConnected: connection.isConnected, connect, disconnect, reconnect, sendMessage }
}
```

**Key Patterns:**
- **Protocol v3 handshake** — Client sends connect request with role/auth before any data exchange
- **RTT measurement** — Pings track sent time, pongs calculate round-trip latency
- **Missed pong detection** — Connection dies after 3 missed pongs; forces reconnect immediately
- **Exponential backoff** — Reconnect delays double each attempt: 1s → 2s → 4s... capped at 30s
- **Auth isolation** — Auth failures (code 4001) stop reconnect loop; connection errors continue retrying
- **Frame batching** — Messages parsed as frames (req/res/event); real-time updates via events

---

## 4. Core Implementation: SQLite Database Layer (`src/lib/db.ts`)

Singleton database instance with WAL mode, migrations, and broadcast via event bus.

```typescript
import Database from 'better-sqlite3'
import { config, ensureDirExists } from './config'
import { runMigrations } from './migrations'
import { eventBus } from './event-bus'

const DB_PATH = config.dbPath
let db: Database.Database | null = null

export function getDatabase(): Database.Database {
  if (!db) {
    ensureDirExists(dirname(DB_PATH))
    db = openDatabase(DB_PATH)
    
    // Enable WAL mode for concurrent access
    db.pragma('journal_mode = WAL')
    db.pragma('synchronous = NORMAL')
    db.pragma('cache_size = 1000')
    db.pragma('foreign_keys = ON')
    
    initializeSchema()
  }
  return db
}

function initializeSchema() {
  if (!db) return
  try {
    runMigrations(db)
    seedAdminUserFromEnv(db)
    startWorktreeRecovery(db)
    logger.info('Database migrations applied successfully')
  } catch (error) {
    logger.error({ err: error }, 'Failed to apply migrations')
    throw error
  }
}

function seedAdminUserFromEnv(dbConn: Database.Database): void {
  // Skip during build phase (env vars may not be available)
  if (process.env.NEXT_PHASE === 'phase-production-build') return

  const count = (dbConn.prepare('SELECT COUNT(*) as count FROM users').get() as CountRow).count
  if (count > 0) return

  const username = process.env.AUTH_USER || 'admin'
  const password = process.env.AUTH_PASS
  if (!password) {
    logger.error('SECURITY: AUTH_PASS not set. Refusing to seed with default password.')
    return
  }

  dbConn.prepare(`
    INSERT OR IGNORE INTO users (username, display_name, password_hash, role)
    VALUES (?, ?, ?, ?)
  `).run(username, displayName, hashPassword(password), 'admin')

  logger.info(`Seeded admin user: ${username}`)
}

// Database helper functions with event broadcasting
export const db_helpers = {
  logActivity: (type: string, entity_type: string, entity_id: number, actor: string, description: string, data?: any) => {
    const db = getDatabase()
    const stmt = db.prepare(`
      INSERT INTO activities (type, entity_type, entity_id, actor, description, data)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    
    const result = stmt.run(type, entity_type, entity_id, actor, description, data ? JSON.stringify(data) : null)
    
    const activityPayload = {
      id: result.lastInsertRowid,
      type,
      entity_type,
      entity_id,
      actor,
      description,
      data: data || null,
      created_at: Math.floor(Date.now() / 1000)
    }
    
    // Broadcast to SSE clients and webhooks
    eventBus.broadcast('activity.created', activityPayload)
  },

  createNotification: (recipient: string, type: string, title: string, message: string, source_type?: string, source_id?: number) => {
    const db = getDatabase()
    const result = db.prepare(`
      INSERT INTO notifications (recipient, type, title, message, source_type, source_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(recipient, type, title, message, source_type, source_id, Math.floor(Date.now() / 1000))
    
    eventBus.broadcast('notification.created', { id: result.lastInsertRowid })
  }
}
```

**Key Patterns:**
- **Lazy singleton** — Database opened only when first accessed; persists for process lifetime
- **WAL mode** — Write-Ahead Logging enables concurrent readers while writers commit
- **Prepared statements** — Prevent SQL injection; improve performance via statement caching
- **Idempotent schema** — Migrations safe to re-run; CREATE TABLE IF NOT EXISTS patterns
- **Event broadcasting** — Database changes trigger eventBus; decouples UI from DB
- **Build-phase safety** — Skips seed logic during Next.js build (no env vars in build time)

---

## 5. Core Implementation: Scheduler Daemon (`src/daemon/scheduler-daemon.ts`)

Background process lifecycle management with graceful shutdown and health state persistence.

```typescript
import { closeDatabase } from '../lib/db'
import { logger } from '../lib/logger'
import { initScheduler } from '../lib/scheduler'
import {
  clearSchedulerDaemonFiles,
  isProcessAlive,
  readSchedulerDaemonPid,
  writeSchedulerDaemonPid,
  writeSchedulerDaemonState
} from '../lib/scheduler-daemon-state'

const existingPid = readSchedulerDaemonPid()
if (existingPid && existingPid !== process.pid && isProcessAlive(existingPid)) {
  logger.error({ pid: existingPid }, 'Scheduler daemon already running')
  process.exit(1)
}

let shuttingDown = false

function cleanupAndExit(code: number, status: 'stopped' | 'error') {
  if (shuttingDown) return
  shuttingDown = true
  
  try {
    writeSchedulerDaemonState({ pid: process.pid, status, updatedAt: Date.now() })
  } catch {
    // ignore
  }
  
  try {
    closeDatabase()
  } catch {
    // ignore
  }
  
  clearSchedulerDaemonFiles()
  process.exit(code)
}

writeSchedulerDaemonPid(process.pid)
writeSchedulerDaemonState({
  pid: process.pid,
  status: 'starting',
  startedAt: Date.now(),
  cwd: process.cwd()
})

try {
  initScheduler()
  writeSchedulerDaemonState({
    pid: process.pid,
    status: 'running',
    startedAt: Date.now(),
    updatedAt: Date.now(),
    cwd: process.cwd()
  })
  logger.info({ pid: process.pid }, 'Scheduler daemon started')
} catch (error) {
  logger.error({ err: error }, 'Scheduler daemon failed to start')
  cleanupAndExit(1, 'error')
}

// Heartbeat: write state every 15s for monitoring
setInterval(() => {
  writeSchedulerDaemonState({
    pid: process.pid,
    status: 'running',
    updatedAt: Date.now(),
    cwd: process.cwd()
  })
}, 15_000)

// Graceful shutdown handlers
process.on('SIGINT', () => cleanupAndExit(0, 'stopped'))
process.on('SIGTERM', () => cleanupAndExit(0, 'stopped'))
process.on('uncaughtException', (error) => {
  logger.error({ err: error }, 'Uncaught exception')
  cleanupAndExit(1, 'error')
})
process.on('unhandledRejection', (error) => {
  logger.error({ err: error }, 'Unhandled rejection')
  cleanupAndExit(1, 'error')
})
```

**Key Patterns:**
- **Single-instance guard** — Checks existing PID via isProcessAlive before starting
- **Reentrant-safe cleanup** — Flag prevents double cleanup if shutdown signals cascade
- **State persistence** — Writes PID/status to disk for external health checks
- **Heartbeat write** — Updates state every 15s (proves daemon is alive even without log output)
- **Graceful shutdown** — Closes database, clears files, then exits (prevents corruption)
- **Error isolation** — Each cleanup step in try/catch to ensure final process.exit runs

---

## 6. Interesting Pattern: Error Boundary (`src/components/ErrorBoundary.tsx`)

React error boundary with automatic chunk reload detection and sessionStorage debouncing.

```typescript
'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Panel error:', error, errorInfo)

    // Auto-reload on chunk load errors (dev/build-time code-split failures)
    if (isChunkLoadError(error)) {
      try {
        const key = 'mc:chunk-reload'
        const now = Date.now()
        const last = Number(window.sessionStorage.getItem(key) || '0')
        
        // Debounce: only reload once per 10s window (prevent reload loops)
        if (!last || now - last > 10_000) {
          window.sessionStorage.setItem(key, String(now))
          window.location.reload()
        }
      } catch {
        // sessionStorage may be blocked in private mode
      }
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-destructive/10 mb-4">
            <svg className="w-6 h-6 text-destructive" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-primary rounded-lg hover:bg-primary/90"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

function isChunkLoadError(error: Error) {
  const message = String(error?.message || '')
  return (
    error?.name === 'ChunkLoadError' ||
    message.includes('Loading chunk') ||
    message.includes('ChunkLoadError')
  )
}
```

**Key Patterns:**
- **Class component for errors** — Only way to catch render-phase errors in React
- **getDerivedStateFromError** — Updates state without side effects (called during render)
- **componentDidCatch** — Side effects happen here (logs, tracking, recovery logic)
- **Chunk error recovery** — Detects code-split chunk failures and auto-reloads
- **Debounce with sessionStorage** — Prevents reload loops by tracking last reload time
- **Fallback support** — Allows custom error UI or default panic screen

---

## 7. Configuration Pattern (`src/lib/config.ts`)

Centralized configuration with environment variable resolution and path candidates.

```typescript
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { resolveRuntimePaths } from './env'

const runtimePaths = resolveRuntimePaths()
const repoRoot = runtimePaths.repoRoot

// Orchestrator runtime: check multiple candidates
const defaultOrchestratorRuntimeCandidates = [
  path.resolve(repoRoot, 'ai-orchestrator'),
  path.resolve(repoRoot, '..', 'ai-orchestrator'),
]
const defaultOrchestratorRuntimeDir =
  defaultOrchestratorRuntimeCandidates.find((candidate) => 
    fs.existsSync(path.join(candidate, 'index.js'))
  ) || defaultOrchestratorRuntimeCandidates[0]

// Agent runtime bin: cascade through env vars with fallbacks
const configuredOpenClawBin =
  process.env.OPENCLAW_BIN ||
  process.env.OPENCLAWD_BIN ||
  process.env.MC_OPENCLAW_BIN ||
  ''

const configuredAgentRuntimeBin =
  configuredOpenClawBin ||
  process.env.MC_AGENT_RUNTIME_BIN ||
  process.env.CLAWDBOT_BIN ||
  (process.platform === 'win32' ? 'openclaw.cmd' : 'openclaw')

export const config = {
  claudeHome: process.env.MC_CLAUDE_HOME || path.join(os.homedir(), '.claude'),
  dataDir: process.env.MISSION_CONTROL_DATA_DIR || path.join(repoRoot, '.data'),
  dbPath: process.env.MISSION_CONTROL_DB_PATH || path.join(config.dataDir, 'mission-control.db'),
  agentRuntimeHome: runtimePaths.runtimeHome,
  orchestratorRuntimeDir: process.env.MC_ORCHESTRATOR_RUNTIME_DIR || defaultOrchestratorRuntimeDir,
  agentRuntimeBin: configuredAgentRuntimeBin,
  
  // Worktree management
  worktreeRoot: process.env.MC_WORKTREE_ROOT || 
    (process.platform === 'win32'
      ? path.join('C:\\wt', path.basename(repoRoot).toLowerCase())
      : path.join(os.tmpdir(), 'wt', path.basename(repoRoot).toLowerCase())
    ),
  worktreeStaleSeconds: Number(process.env.MC_WORKTREE_STALE_SECONDS || '1800'),
  
  // Gateway service
  gatewayHost: process.env.MC_GATEWAY_HOST || '127.0.0.1',
  gatewayPort: Number(process.env.MC_GATEWAY_PORT || '18789'),
  
  // Data retention (days; 0 = keep forever)
  retention: {
    activities: Number(process.env.MC_RETAIN_ACTIVITIES_DAYS || '90'),
    auditLog: Number(process.env.MC_RETAIN_AUDIT_DAYS || '365'),
    logs: Number(process.env.MC_RETAIN_LOGS_DAYS || '30'),
    tokenUsage: Number(process.env.MC_RETAIN_TOKEN_USAGE_DAYS || '90'),
  },
}

export function ensureDirExists(dirPath: string) {
  if (!dirPath) return
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}
```

**Key Patterns:**
- **Environment cascade** — Multiple env var names allow flexibility across deployment modes
- **Candidate search** — find() on array of candidates allows graceful fallback paths
- **Platform-aware defaults** — Windows (C:\wt\...) vs Unix (/tmp/wt/...)
- **Numeric coercion** — Number() with || fallback ensures config values are always defined
- **Lazy directory creation** — ensureDirExists called before file operations
- **Retention tiers** — Different retention periods by entity type (activities 90d, audit logs 365d)

---

## 8. Autonomous Loop Pattern (`src/lib/autonomous-loop.ts`)

Settings-driven task orchestration with recovery strategies and debate resolution.

```typescript
export interface AutonomousLoopSettings {
  enabled: boolean
  autoSpawnEnabled: boolean
  debateEnabled: boolean
  selfHealEnabled: boolean
  maxAutoSpawnWorkers: number
  maxAutoSpawnReviewers: number
  maxTaskAttemptsBeforeDebate: number
}

export interface AutonomousLoopResult {
  spawnedAgents: number
  debatedTasks: number
  healedRepos: number
  message: string
}

// Settings read from database with fallbacks
export function getAutonomousLoopSettings(): AutonomousLoopSettings {
  return {
    enabled: readBooleanSetting('general.autonomous_dev_loop', true),
    autoSpawnEnabled: readBooleanSetting('orchestrator.auto_spawn_agents', true),
    debateEnabled: readBooleanSetting('orchestrator.agent_debate_enabled', true),
    selfHealEnabled: readBooleanSetting('orchestrator.repo_self_heal', true),
    maxAutoSpawnWorkers: readNumberSetting('orchestrator.max_auto_spawn_workers', DEFAULT_AUTONOMOUS_WORKER_CAP),
    maxAutoSpawnReviewers: readNumberSetting('orchestrator.max_auto_spawn_reviewers', 1),
    maxTaskAttemptsBeforeDebate: readNumberSetting('orchestrator.max_task_attempts_before_debate', 2),
  }
}

function readBooleanSetting(key: string, fallback: boolean) {
  try {
    const db = getDatabase()
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value?: string } | undefined
    if (!row?.value) return fallback
    return row.value === 'true'
  } catch {
    return fallback
  }
}

function readNumberSetting(key: string, fallback: number) {
  try {
    const db = getDatabase()
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value?: string } | undefined
    const value = Number(row?.value)
    return Number.isFinite(value) && value > 0 ? value : fallback
  } catch {
    return fallback
  }
}

// Parse task metadata: handles JSON + null safely
function parseMetadata(raw: string | null | undefined): Record<string, any> {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

// Recovery strategy selection based on blocker reason
function getProblemFixAndPrevention(reason?: string) {
  const blocker = normalizeBlockerReason(reason)
  const lower = blocker.toLowerCase()

  if (/\bconfig|environment|env\b|\bpermission|auth|token|credential\b/.test(lower)) {
    return {
      fix: 'repair the missing environment or configuration prerequisite before re-running the task',
      prevent: 'run a prerequisite checklist for config, auth, and migrations before assigning the task',
    }
  }

  if (/\bno changed files\b|\bno verified diff\b|\bverification\b/.test(lower)) {
    return {
      fix: 'retry with a tighter file scope and require a verified diff before handing the task forward',
      prevent: 'capture the intended file list up front and run verification before moving to review',
    }
  }

  if (/\btimeout\b|\bstuck\b|\bslow\b|\blong running\b/.test(lower)) {
    return {
      fix: 'increase timeouts or break the task into smaller chunks',
      prevent: 'set realistic timeouts and profile long-running operations before assignment',
    }
  }

  return {
    fix: 'investigate the blocker reason and retry the task with refined parameters',
    prevent: 'improve task definition clarity and add precondition checks',
  }
}
```

**Key Patterns:**
- **Settings hierarchy** — Database-backed with fallback defaults (survives missing settings)
- **Safe JSON parsing** — Handles null/undefined/invalid JSON gracefully
- **Pattern matching recovery** — Regex matches on blocker reason to suggest fix/prevent strategies
- **Type safety** — Settings interface defines all possible configurations
- **Lazy evaluation** — Settings read on-demand from DB (no startup penalty)

---

## Summary

Mission Control demonstrates seven architectural patterns:

| Pattern | Location | Purpose |
|---------|----------|---------|
| **Process Lifecycle** | `dev-reset.js` | Manage multiple daemon children, port cleanup, graceful shutdown |
| **Zustand State** | `src/index.ts` | Centralized client state with deduplication and localStorage persistence |
| **WebSocket Gateway** | `src/lib/websocket.ts` | Protocol v3 handshake, heartbeat/RTT, exponential backoff reconnect |
| **Database Layer** | `src/lib/db.ts` | Singleton with WAL mode, event broadcasting, migration management |
| **Daemon Management** | `src/daemon/scheduler-daemon.ts` | Single-instance guard, heartbeat health check, signal handlers |
| **Error Handling** | `src/components/ErrorBoundary.tsx` | Chunk error detection, auto-reload debouncing, panic UI |
| **Configuration** | `src/lib/config.ts` | Environment cascades, path candidates, platform-aware defaults |
| **Task Orchestration** | `src/lib/autonomous-loop.ts` | Settings-driven recovery strategies, metadata parsing |

All patterns emphasize **safety first**: error isolation, retry logic, cleanup guarantees, and graceful degradation.
