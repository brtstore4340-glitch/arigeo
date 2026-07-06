# Arra Oracle v3 - Architecture Document

## Project Overview

**Arra Oracle v3** is a TypeScript-based MCP (Model Context Protocol) memory layer that provides semantic search, knowledge management, and forum capabilities for Claude Code. It combines SQLite full-text search (FTS5), vector embeddings (LanceDB), and a hybrid search system to enable AI agents to query and learn from philosophy and knowledge artifacts. The system offers both an HTTP API (port 47778) and an MCP server for Claude integration, plus a CLI for operational tasks.

**Core Use Case:** Enable Claude to maintain persistent, searchable knowledge bases (ψ/ vaults) with vector-assisted semantic search, pattern learning, tracing, and forum discussions.

---

## Directory Structure & Purpose

```
arra-oracle-v3/
├── bin/
│   └── arra.ts                    # CLI entry point dispatcher
│                                   # Routes to HTTP server or MCP server
│
├── src/                            # Main application code
│   ├── index.ts                   # MCP server entry (stdio transport)
│   │                               # Registers 23 tools, handles tool calls
│   │
│   ├── server.ts                  # HTTP API server (Elysia bun-native)
│   │                               # Mounts plugins, handles lifecycle
│   │
│   ├── config.ts                  # Config & path resolution
│   │                               # ORACLE_DATA_DIR, DB_PATH, REPO_ROOT, VECTOR_URL
│   │
│   ├── const.ts                   # Constants (defaults, names)
│   │
│   ├── types.ts                   # Type definitions (OracleDocument, SearchResult, etc)
│   │
│   ├── db/
│   │   ├── schema.ts              # Drizzle ORM schema (17 tables)
│   │   │                           # oracle_documents, indexing_jobs, search_log,
│   │   │                           # forum_threads, forum_messages, forum_posts,
│   │   │                           # traces, trace_links, etc.
│   │   ├── index.ts               # DB client init, sqlite connection
│   │   └── seeders/               # Database seeders (menu, default data)
│   │
│   ├── tools/                     # MCP tool handlers (23 total)
│   │   ├── index.ts               # Exports all tool defs & handlers
│   │   ├── search.ts              # oracle_search (hybrid FTS + vector)
│   │   ├── learn.ts               # oracle_learn (add patterns/documents)
│   │   ├── list.ts                # oracle_list (browse documents)
│   │   ├── stats.ts               # oracle_stats (DB statistics)
│   │   ├── concepts.ts            # oracle_concepts (list tags)
│   │   ├── supersede.ts           # oracle_supersede (mark docs outdated)
│   │   ├── handoff.ts             # oracle_handoff (session handoff)
│   │   ├── inbox.ts               # oracle_inbox (messages)
│   │   ├── read.ts                # oracle_read (fetch document by ID)
│   │   ├── reflect.ts             # oracle_reflect (random wisdom)
│   │   ├── verify.ts              # oracle_verify (doc verification)
│   │   ├── forum.ts               # Forum tools (threads, messages, posts)
│   │   ├── trace.ts               # Trace tools (create, list, link traces)
│   │   ├── schedule.ts            # Schedule/timeline tools
│   │   ├── types.ts               # Tool input/output types
│   │   └── __tests__/             # Unit tests
│   │
│   ├── vector/                    # Vector search & embeddings
│   │   ├── config.ts              # Vector config (models, engines)
│   │   ├── embeddings.ts          # Model resolver (bge-m3, qwen, etc)
│   │   ├── factory.ts             # Vector store factory (LanceDB/Qdrant/Chroma)
│   │   ├── runtime-status.ts      # Runtime mode detection
│   │   ├── cpu-capabilities.ts    # CPU feature detection (SIMD, AVX)
│   │   ├── types.ts               # VectorStoreAdapter interface
│   │   ├── adapters/              # Adapter implementations
│   │   └── __tests__/             # Unit tests
│   │
│   ├── indexer/                   # Knowledge indexing pipeline
│   │   ├── index.ts               # Main indexer logic
│   │   ├── parser.ts              # Markdown parser (extract frontmatter, content)
│   │   ├── collectors.ts          # Scan ψ/ directories for documents
│   │   ├── jobs.ts                # Indexing job queue management
│   │   ├── daemon.ts              # Background indexing worker
│   │   ├── storage.ts             # Vector storage operations
│   │   ├── concepts.ts            # Concept extraction
│   │   ├── arra-indexer.ts        # CLI entry for indexer
│   │   ├── frontmatter.ts         # YAML frontmatter extraction
│   │   ├── discovery.ts           # Discover ψ/ vault paths
│   │   └── __tests__/             # Unit tests
│   │
│   ├── server/                    # HTTP server plugins & handlers
│   │   ├── handlers.ts            # Request handler utilities
│   │   ├── logging.ts             # Request logging
│   │   ├── vector-handlers.ts     # Vector-related endpoint handlers
│   │   ├── vector-operations.ts   # Vector search operations
│   │   ├── vector-proxy.ts        # Proxy to remote vector server
│   │   ├── reranker.ts            # Result reranking logic
│   │   ├── context.ts             # Request context helpers
│   │   ├── dashboard.ts           # Dashboard data aggregation
│   │   ├── project-detect.ts      # Project context detection
│   │   ├── plugin/                # Server plugin system
│   │   │   ├── builtin.ts         # Built-in plugin definitions
│   │   │   ├── loader.ts          # Plugin discovery & loading
│   │   │   ├── registry.ts        # Plugin registry
│   │   │   ├── types.ts           # Plugin types
│   │   │   ├── manifest.ts        # Plugin manifest parsing
│   │   │   └── unified.ts         # Unified plugin interface
│   │   └── __tests__/             # Unit tests
│   │
│   ├── routes/                    # HTTP route modules (25 directories)
│   │   ├── auth/                  # Authentication routes
│   │   ├── search/                # Search endpoints
│   │   ├── knowledge/             # Learn, handoff, inbox
│   │   ├── forum/                 # Forum threads & messages
│   │   ├── traces/                # Trace creation & linking
│   │   ├── vector/                # Vector config, indexing, mapping
│   │   ├── health/                # Health checks, stats, oracles list
│   │   ├── indexer/               # Indexer triggers (scan, reindex)
│   │   ├── plugins/               # Plugin management
│   │   ├── settings/              # Configuration endpoints
│   │   ├── schedule/              # Timeline/schedule events
│   │   ├── dashboard/             # Dashboard data
│   │   ├── feed/                  # Event feed
│   │   ├── files/                 # File reading, context, graph
│   │   ├── oraclenet/             # Oracle network presence
│   │   ├── peer/                  # Peer discovery
│   │   ├── menu/                  # Menu management
│   │   ├── concepts/              # Concept listing
│   │   ├── supersede/             # Supersession tracking
│   │   ├── verify/                # Verification endpoints
│   │   ├── sessions/              # Session tracking
│   │   └── vault/                 # Vault management
│   │
│   ├── trace/                     # Trace system (execution journaling)
│   │   ├── types.ts               # Trace types
│   │   └── (handlers in tools/trace.ts)
│   │
│   ├── learn/                     # Learning system
│   │   └── (handlers in tools/learn.ts)
│   │
│   ├── forum/                     # Forum system
│   │   ├── types.ts               # Forum types
│   │   └── handler.ts             # Forum logic
│   │
│   ├── gateway/                   # Gateway/proxy system
│   │   ├── proxy.ts               # HTTP proxying for plugins
│   │   ├── matcher.ts             # Route matching
│   │   ├── config.ts              # Gateway config
│   │   ├── hooks.ts               # Lifecycle hooks
│   │   ├── health.ts              # Health checks
│   │   └── index.ts               # Gateway entry
│   │
│   ├── plugins/                   # Plugin system
│   │   ├── unified-manifest.ts    # Unified plugin manifest
│   │   └── (loaders in routes/plugins)
│   │
│   ├── canvas/                    # Canvas/UI rendering
│   │   ├── host.ts                # Canvas host
│   │   ├── plugin.ts              # Canvas plugin
│   │   ├── metadata.ts            # Canvas metadata
│   │   └── index.ts               # Canvas entry
│   │
│   ├── vault/                     # Vault CLI
│   │   ├── cli.ts                 # CLI entry
│   │   └── (commands)
│   │
│   ├── peer/                      # Peer-to-peer system
│   │   └── peer-query.ts          # Peer queries
│   │
│   ├── menu/                      # Menu system
│   │   └── (menu item management)
│   │
│   ├── verify/                    # Document verification
│   │   └── (verification logic)
│   │
│   ├── process-manager/           # Lifecycle management
│   │   ├── index.ts               # Process lifecycle
│   │   └── (signal handling)
│   │
│   ├── config/                    # Configuration subsystem
│   │   ├── tool-groups.ts         # Tool enable/disable config
│   │   └── (other config modules)
│   │
│   ├── scripts/                   # Utility scripts
│   │
│   ├── integration/               # Integration tests
│   │   └── (test suites)
│   │
│   ├── __tests__/                 # Root-level tests
│   │
│   ├── chroma-mcp.ts              # Legacy Chroma MCP adapter
│   ├── vector-server.ts           # Standalone vector server
│   ├── ensure-server.ts           # Server lifecycle management
│   ├── index.ts                   # MCP server main
│   └── (HTML assets: dashboard.html, ui.html, arthur.html)
│
├── cli/                           # CLI package (arra-cli)
│   ├── src/
│   │   ├── cli.ts                 # Main CLI dispatcher
│   │   ├── lib/
│   │   │   ├── api.ts             # API client
│   │   │   └── config.ts          # CLI config
│   │   ├── commands/              # CLI commands
│   │   │   ├── plugins-list.ts    # List plugins
│   │   │   ├── plugins-install.ts # Install plugin
│   │   │   ├── plugins-remove.ts  # Remove plugin
│   │   │   ├── plugins-toggle.ts  # Enable/disable plugin
│   │   │   ├── plugins-info.ts    # Show plugin info
│   │   │   ├── session-list.ts    # List sessions
│   │   │   ├── session-show.ts    # Show session details
│   │   │   ├── session-context.ts # Session context
│   │   │   ├── menu-list.ts       # List menu items
│   │   │   ├── menu-add.ts        # Add menu item
│   │   │   ├── menu-remove.ts     # Remove menu item
│   │   │   ├── menu-gist.ts       # Gist-based menu
│   │   │   ├── menu-reset.ts      # Reset menu
│   │   │   ├── config.ts          # Show/set config
│   │   │   ├── reindex.ts         # Trigger reindex
│   │   │   └── _output.ts         # Output formatting
│   │   └── plugin/                # Plugin discovery for CLI
│   │       ├── loader.ts          # Load plugins
│   │       ├── registry.ts        # Register plugins
│   │       ├── invoke.ts          # Invoke plugin commands
│   │       └── types.ts           # Plugin types
│   └── package.json
│
├── services/                      # (External services directory)
│
├── catalog/                       # Plugin/service catalog
│
├── maw-plugin/                    # Reference plugin (MAW integration)
│
├── scripts/                       # Setup & utility scripts
│   ├── install.sh                 # Installation script
│   ├── seed-test-data.ts          # Test data seeding
│   ├── gen-endpoints.ts           # Generate API endpoint docs
│   └── vault-rsync.sh             # Vault sync script
│
├── e2e/                           # End-to-end tests (Playwright)
│
├── tests/                         # Test suites
│   └── (mirror of src/ structure)
│
├── docs/                          # Documentation
│   ├── LOCAL-DEV.md               # Local development setup
│   ├── ONBOARDING.md              # Progressive onboarding walkthrough
│   ├── DOCKER-MCP-TOOLKIT.md      # Docker setup
│   ├── architecture.md            # Architecture details
│   ├── MCP-FROM-OPENAPI.md        # MCP generation
│   ├── PLUGIN-TAXONOMY.md         # Plugin classification
│   ├── HOOK-MENU-PACKAGE.md       # Hook-menu integration
│   ├── MENU-AUTOLOAD.md           # Menu autoloading
│   ├── PLUGIN-MENU.md             # Plugin menu system
│   ├── vector-runtime.md          # Vector runtime details
│   ├── CLOUD-VECTOR-PROXY.md      # Cloud vector routing
│   ├── CONTRIBUTING-AWAKENING.md  # Oracle birth announcements
│   ├── RTK-SETUP.md               # RTK configuration
│   ├── SWAGGER-DEPLOY.md          # Swagger deployment
│   ├── TIMELINE.md                # Project timeline
│   ├── API.md                     # API documentation
│   ├── BINS.md                    # Binary names & aliases
│   ├── mcp-tools.md               # MCP tool reference
│   └── dashboard-proposal.md      # Dashboard design
│
├── .claude/                       # Claude Code settings
│   ├── settings.json              # Project settings
│   └── (other config)
│
├── .rtk/                          # RTK cache
│
├── web/                           # Frontend (React/TypeScript)
│   └── (UI components & assets)
│
├── package.json                   # Project dependencies
├── bun.lock                        # Bun lockfile
├── tsconfig.json                  # TypeScript config
├── vitest.config.ts               # Vitest config
├── playwright.config.ts           # E2E test config
├── drizzle.config.ts              # Drizzle ORM config
├── docker-compose.yml             # Docker setup
├── Dockerfile                     # Docker image
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore
├── ecosystem.oracle-stack.config.js # PM2 ecosystem config
├── README.md                      # Project overview
├── CHANGELOG.md                   # Release notes
├── LICENSE                        # BUSL-1.1
└── CLAUDE.md                      # Development guidelines
```

---

## Entry Points

### 1. MCP Server (`src/index.ts`)
- **Binary:** `arra-oracle-v2` (legacy alias) or `bunx --package github:Soul-Brews-Studio/arra-oracle-v3 arra-oracle-v2`
- **Transport:** stdio (Claude Code integration)
- **Function:** Registers 23 MCP tools, dispatches tool calls, manages DB lifecycle
- **Key Exports:** Tool definitions (`searchToolDef`, `learnToolDef`, etc.), handler functions, alias resolution

### 2. HTTP API Server (`src/server.ts` + `bin/arra.ts`)
- **Binary:** `arra-oracle` or `bun run server`
- **Port:** 47778 (configurable via `ORACLE_PORT`)
- **Framework:** Elysia (bun-native, TypeBox schemas)
- **Routes:** 55 endpoints across 14 modules (search, forum, traces, vector, plugins, etc)
- **Plugins:** Dynamically loaded from `src/server/plugin/`
- **Features:**
  - Swagger docs at `/swagger`
  - Health checks & stats
  - Search (FTS5 + LanceDB hybrid)
  - Forum (threads, messages, posts)
  - Traces (execution journaling)
  - Vector indexing & config
  - Dashboard data aggregation

### 3. CLI (`cli/src/cli.ts`)
- **Binary:** `arra-cli`
- **Commands:**
  - `plugin {list, install, remove, enable, disable, info}` — plugin management
  - `session {list, show, context}` — inspect active sessions
  - `menu {list, add, remove, gist, reset}` — customize studio menu
  - `config` — show/set API target
  - `reindex` — trigger knowledge reindex
- **Design:** Plugin-based command registry; plugins can extend CLI

### 4. Indexer (`src/indexer/index.ts`)
- **CLI:** `bun run index` or via HTTP `POST /api/indexer/reindex`
- **Function:** Scan ψ/ directories, extract frontmatter, parse markdown, create/update `oracle_documents`, queue vector jobs
- **Architecture:** Parse → Store FTS5 → Queue vector jobs → Daemon processes asynchronously

---

## Core Abstractions & Relationships

### 1. Document Model
```
OracleDocument (vector DB, granular)
  ├─ id: unique identifier
  ├─ type: 'principle' | 'pattern' | 'learning' | 'retro' | 'distillation' | 'security-corpus'
  ├─ content: full text (embedded)
  ├─ concepts: array of tags ['trust', 'patterns', 'mirror']
  └─ source_file: path in ψ/

OracleMetadata (SQLite, source of truth)
  ├─ id, type, source_file, concepts (JSON)
  ├─ created_at, updated_at, indexed_at
  ├─ superseded_by, superseded_at, superseded_reason (Nothing is Deleted pattern)
  ├─ origin: 'mother' | 'arthur' | 'volt' | 'human'
  └─ project: ghq-style path (github.com/laris-co/arra-oracle)
```

### 2. Search Pipeline (Hybrid)
```
User Query
  ↓
FTS5 Search (immediate, fast) ──→ SQLite oracleDocuments
  ↓
Vector Search (optional, accurate) ──→ LanceDB (bge-m3 embeddings)
  ↓
Merge & Rerank (union, score blending) ──→ Final results
  ↓
Degrade gracefully if vector unavailable (proxy down, FTS only)
```

### 3. Indexing Pipeline
```
Markdown File (ψ/learn/...)
  ↓ Parser
Frontmatter + Content
  ↓ Storage
SQLite: insert/update oracle_documents + indexingStatus
  ↓ Queue
indexingJobs: one row per model (bge-m3, qwen, etc)
  ↓ Daemon
Worker claims job, calls embeddings API/model
  ↓ LanceDB
Insert embedding into oracle_knowledge_<model_key> collection
  ↓ Status
Mark job.status = 'done'
```

### 4. Vector Store Abstraction
```
VectorStoreAdapter (interface)
  ├─ LanceDB (local, embedded)
  ├─ Qdrant (local or remote)
  ├─ Chroma (legacy, deprecated)
  └─ Proxy (remote HTTP, VECTOR_URL)

Vector Config
  ├─ mode: 'embedded' | 'proxied' | 'disabled'
  ├─ engine: 'lancedb' | 'qdrant' | 'chroma'
  ├─ model: 'bge-m3' | 'qwen2.5-3b' | (configurable)
  └─ URL: for proxy mode
```

### 5. Server Plugin System
```
ServerPlugin (interface)
  ├─ name, version, enabled
  ├─ routes: Elysia routes
  ├─ start() / stop() lifecycle
  └─ (optional) config, context

BuiltinPlugins (src/server/plugin/builtin.ts)
  ├─ search, forum, traces, vector, plugins, etc
  └─ Each registers routes in src/routes/*

PluginLoader
  ├─ Discovers built-in plugins
  ├─ Applies env filters (ORACLE_ENABLED_TOOLS, ORACLE_DISABLED_TOOLS)
  └─ Mounts routes into Elysia app
```

### 6. Forum System
```
ForumThread (parent discussion)
  ├─ id, title, status ('active', 'answered', 'pending', 'closed')
  ├─ created_by, created_at, updated_at
  ├─ issue_url, issue_number (GitHub mirror)
  └─ syncedAt (GitHub sync timestamp)

ForumMessage (reply in thread)
  ├─ id, thread_id, body (markdown)
  ├─ from, to (actor IDs)
  └─ created_at

ForumPost (extended discussion artifact)
  ├─ id, thread_id, post_type ('code', 'insight', 'question')
  └─ content, source_file (optional)
```

### 7. Trace System
```
Trace (execution journal)
  ├─ id, name, status ('active', 'completed', 'error')
  ├─ input, output (JSON)
  ├─ duration_ms, created_at
  └─ metadata (custom fields)

TraceLink (parent-child or cause-effect)
  ├─ prev_id, next_id (bidirectional graph)
  └─ relation_type (optional)

Trace Chain (linked traces)
  └─ Enables root-cause analysis, execution flow visualization
```

### 8. MCP Tool Invocation
```
Claude (MCP client)
  ↓ CallToolRequest
Tool Name (oracle_search, oracle_learn, etc) + Input JSON
  ↓ index.ts::handleCallTool()
resolveToolName() → handles aliases (arra_*, muninn_*, oracle_*)
  ↓ Tool Handler (from tools/*)
Execute business logic (db queries, vector search, etc)
  ↓ ToolResponse
Output JSON + optional content array
```

---

## Key Dependencies

### Runtime
- **Bun >=1.2.0** — All runtime, testing, and scripts use Bun
- **Node.js types** for compatibility (dev only)

### Core Libraries
- **@modelcontextprotocol/sdk** ^1.29.0 — MCP protocol implementation
- **drizzle-orm** ^0.45.2 — Type-safe database ORM
- **elysia** ^1.4.28 — Bun-native HTTP framework
- **better-sqlite3** ^12.9.0 — SQLite driver (sync, bundled)
- **@lancedb/lancedb** ^0.27.2 — Vector database client

### HTTP & Middleware
- **@elysiajs/cors** ^1.4.1 — CORS handling
- **@elysiajs/swagger** ^1.3.1 — Swagger/OpenAPI docs

### CLI & Config
- **commander** ^14.0.3 — CLI argument parsing
- **hook-menu** github:Soul-Brews-Studio/hook-menu — Menu system (custom)

### Vector & Search
- **sqlite-vec** ^0.1.9 — SQLite vector extension
- **@qdrant/js-client-rest** ^1.17.0 — Qdrant client (optional)

### Database Tools
- **drizzle-kit** ^0.31.10 — Migrations & schema generation
- **typescript** ^5.7.2 — TypeScript compiler

---

## System Flow (End-to-End)

### 1. Fresh Install → First Search
```
bunx --bun --package github:Soul-Brews-Studio/arra-oracle-v3 arra-oracle
  ↓ bin/arra.ts dispatches to src/server.ts
  ↓ Elysia app starts on :47778
  ↓ src/server/plugin/builtin.ts loads plugins
  ↓ Routes mount (search, forum, vector, etc)
  ↓ GET /api/health → { status: 'ok', vectorMode: 'disabled' }
  
User: GET /api/search?mode=fts&q=trust
  ↓ routes/search/index.ts
  ↓ SQLite FTS5 query (if index exists, else empty)
  ↓ Response: { results: [], total: 0, mode: 'fts', vectorAvailable: false }
```

### 2. Index Knowledge Base
```
POST /api/indexer/scan  (discovers ψ/ files)
  ↓ routes/indexer/index.ts → collectors.ts
  ↓ Scans REPO_ROOT/ψ/learn/*, finds .md files
  ↓ Returns file list

POST /api/indexer/reindex  (parse & store)
  ↓ routes/indexer/index.ts → indexer/index.ts
  ↓ For each file:
     ├─ Parse frontmatter + content
     ├─ Insert into oracle_documents (FTS5 indexed)
     ├─ Queue indexingJobs (one per vector model)
     └─ Return status

Daemon (src/indexer/daemon.ts) runs continuously
  ↓ Claims pending jobs
  ↓ Calls vector embeddings API (local or remote)
  ↓ Inserts into LanceDB collection
  ↓ Marks job as 'done'

GET /api/health
  ↓ Detects vector jobs complete
  ↓ Returns: { vectorMode: 'embedded', embedingsReady: true }
```

### 3. Hybrid Search with Vectors
```
GET /api/search?q=patterns&mode=hybrid
  ↓ routes/search/index.ts
  ↓ FTS5 query → top 20 results (fast)
  ↓ Vector query → top 10 semantic matches
  ↓ Merge by ID, rerank by blended score
  ↓ Return union (de-duplicated, sorted)
```

### 4. Learn Pattern (Add Knowledge)
```
MCP: oracle_learn(pattern="...", concepts=["tag1", "tag2"])
  ↓ tools/learn.ts::handleLearn()
  ↓ Create document in oracle_documents
  ├─ type: 'pattern'
  ├─ concepts: JSON array
  ├─ source_file: auto-generated path in ψ/learn/
  └─ created_by: 'oracle_learn'
  ↓ Queue vector jobs
  ↓ Daemon embeds and indexes
```

### 5. Forum Discussion
```
POST /api/thread  (create thread)
  ↓ routes/forum/index.ts
  ↓ Insert into forum_threads
  ↓ Return thread_id

POST /api/thread/{id}  (send message)
  ↓ Insert into forum_messages
  ↓ Update forum_threads.updated_at
  ↓ (Optional) Sync to GitHub issue if issueUrl is set

GET /api/thread/{id}  (read thread)
  ↓ Fetch thread + all messages
  ↓ Return thread with messages array
```

### 6. Trace Execution Path
```
POST /api/traces  (start trace)
  ↓ routes/traces/index.ts
  ↓ Insert into traces table
  ↓ Return trace_id

POST /api/traces/{id}  (log details)
  ↓ Update traces with status, output, duration_ms
  ↓ Mark as 'completed' or 'error'

POST /api/traces/{prevId}/link  (link traces)
  ↓ Insert into trace_links
  ↓ Enables graph queries (previous/next traces)

GET /api/traces/{id}/linked-chain
  ↓ Fetch entire chain (recursive linked traces)
  ↓ Returns chronological execution flow
```

---

## Configuration & Environment

### Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `ORACLE_PORT` | 47778 | HTTP server port |
| `ORACLE_DATA_DIR` | `~/.arra-oracle-v2` | Data directory (DB, vectors, plugins) |
| `ORACLE_REPO_ROOT` | auto-detect | Knowledge base root (where ψ/ lives) |
| `ORACLE_DB_PATH` | `$ORACLE_DATA_DIR/oracle.db` | SQLite database path |
| `VECTOR_URL` | (empty) | Remote vector server URL (proxy mode) |
| `VECTOR_FALLBACK` | fts5 | Fallback when vector unavailable |
| `ORACLE_VECTOR_SERVER` | (empty) | Set to '1' to run vector-server.ts |
| `ORACLE_VECTOR_READONLY` | (empty) | Set to '1' for read-only vector mode |
| `ORACLE_ENABLED_TOOLS` | (empty) | Comma-separated MCP tool names to enable |
| `ORACLE_DISABLED_TOOLS` | (empty) | Comma-separated MCP tool names to disable |
| `ORACLE_CORS_ORIGIN` | (empty) | Extra CORS origins (comma-separated) |
| `CORS_ORIGIN` | (empty) | Legacy CORS origin (deprecated) |

### Data Paths
- **SQLite DB:** `$ORACLE_DATA_DIR/oracle.db`
- **LanceDB:** `$ORACLE_DATA_DIR/lancedb/` (collections per model)
- **Vectors archive:** `$ORACLE_DATA_DIR/vectors.db` (legacy)
- **Knowledge vault:** `$ORACLE_REPO_ROOT/ψ/` (symlinked or actual)
- **Plugins:** `$ORACLE_DATA_DIR/plugins/`
- **Schedule:** `$ORACLE_DATA_DIR/schedule.md`
- **Feed log:** `$ORACLE_DATA_DIR/feed.log`

### Drizzle Migrations
```bash
bun db:generate  # Create migration from schema changes
bun db:push      # Apply migrations to DB
bun db:pull      # Sync schema.ts from existing DB
bun db:studio    # Open Drizzle Studio GUI
```

---

## Database Schema (17 Tables)

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `oracle_documents` | Main index (FTS5 indexed) | id, type, source_file, concepts, superseded_by, origin, project |
| `indexing_status` | Progress tracking | isIndexing, progressCurrent, progressTotal, error |
| `indexing_jobs` | Vector job queue | docId, modelKey, status ('pending'\|'claimed'\|'done'), attempts |
| `search_log` | Query audit trail | query, type, mode, resultsCount, project |
| `consult_log` | Legacy consultation log | (retained for backward compat) |
| `learn_log` | Pattern learning log | documentId, patternPreview, concepts, project |
| `document_access` | Access tracking | documentId, accessType, project |
| `forum_threads` | Discussion threads | title, status, issueUrl, issueNumber, project |
| `forum_messages` | Individual messages | threadId, body, from, to |
| `forum_posts` | Extended artifacts | threadId, postType, content, sourceFile |
| `traces` | Execution journals | name, status, input, output, durationMs |
| `trace_links` | Trace relationships | prevId, nextId, relationType |
| `(vector collections)` | LanceDB tables (dynamic) | oracle_knowledge_<model_key> |

---

## Testing Strategy

### Test Suites
- **Unit:** `src/tools/__tests__/`, `src/server/__tests__/`, `src/vault/__tests__/`, `src/indexer/__tests__/`
- **Integration:** `src/integration/` (database, HTTP, MCP contracts)
- **E2E:** `e2e/` (Playwright, runs full server)

### Commands
```bash
bun test                    # All tests (unit + integration)
bun test:unit              # Unit tests only
bun test:integration       # Integration tests
bun test:integration:db    # Database tests
bun test:integration:mcp   # MCP contract tests
bun test:integration:http  # HTTP endpoint tests
bun test:e2e               # Playwright E2E
bun test:coverage          # Coverage report
```

---

## Development & Deployment

### Local Development
```bash
git clone https://github.com/Soul-Brews-Studio/arra-oracle-v3.git
cd arra-oracle-v3 && bun install

# MCP server (for Claude Code)
bun run dev       # Watches & hot-reloads

# HTTP API
bun run server    # Port :47778

# Indexer daemon
bun run daemon

# CLI
bun run cli -- <command>
```

### Docker
```bash
docker-compose up
# or
docker build -t arra-oracle .
docker run -e ORACLE_DATA_DIR=/data -v /data arra-oracle
```

### Deployment
- **Bundling:** TypeScript compiled to JavaScript (type checking only, `bun build` not yet integrated)
- **Distribution:** GitHub releases + `bunx` package installation
- **Vector Sidecar:** Optional `VECTOR_URL` proxy for scaled deployments

---

## Key Design Patterns

### 1. Nothing is Deleted
- Documents marked `superseded_by` instead of deleted
- Maintains audit trail and enables time-travel queries

### 2. Progressive Onboarding
- Start with FTS5 (no vectors required)
- Enable vectors when ready
- Graceful degradation if vector unavailable

### 3. Pluggable Vector Stores
- `VectorStoreAdapter` interface abstracts LanceDB/Qdrant/Chroma
- Switch engines via config without code changes

### 4. Async Indexing
- Parse → FTS5 sync
- Queue vector jobs → Background daemon
- Avoid blocking on embeddings API

### 5. MCP Tool Aliasing
- `arra_*`, `muninn_*`, `oracle_*` all resolve to same handler
- Backward compatibility across name changes

### 6. Hybrid Search
- FTS5 for recall (keywords)
- Vector for semantic relevance
- Blend scores, deduplicate, rerank

---

## Notable Files

- **`src/index.ts`** — MCP server lifecycle + tool dispatch (28KB)
- **`src/server.ts`** — Elysia app setup + plugin mounting (7KB)
- **`src/tools/search.ts`** — Hybrid search implementation (17KB)
- **`src/tools/learn.ts`** — Document creation + concept extraction (12KB)
- **`src/vector/factory.ts`** — Vector store abstraction (9KB)
- **`src/indexer/parser.ts`** — Markdown parsing + frontmatter (10KB)
- **`src/db/schema.ts`** — Drizzle ORM schema (full DB) (varies)
- **`src/server/vector-operations.ts`** — Vector CRUD ops (10KB)
- **`cli/src/cli.ts`** — CLI dispatcher (varies)
- **`package.json`** — Dependencies + scripts (3KB)

---

## Summary

Arra Oracle v3 is a full-stack knowledge management system combining SQLite (fast, local), vector embeddings (semantic), and HTTP APIs for persistent AI memory. Its modular plugin architecture, progressive onboarding, and hybrid search strategy make it both accessible (FTS5 from day one) and powerful (vectors on-demand). The system serves Claude Code via MCP tools, provides a web dashboard & CLI for operators, and integrates with GitHub forums and external vector services.

**Key Strengths:**
- Low friction to start (SQLite FTS5 works immediately)
- Flexible vector routing (local, proxied, or disabled)
- Comprehensive audit trails (search logs, document access, traces)
- Forum integration for threaded knowledge discussions
- Pluggable architecture (plugins, tools, vector engines)

**Primary Use Case:** Enable long-lived AI agents to maintain searchable knowledge bases with semantic recall, pattern learning, and execution tracing.
