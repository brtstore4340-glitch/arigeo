---
name: 0706-quick-reference
description: ---
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-15
  source: fleet-memory
---

# Arra Oracle v3 — Quick Reference Guide

**Version:** 26.6.1-alpha.1428 | **Status:** Always Nightly | **Runtime:** Bun ≥1.2.0

---

## What Is This?

**Arra Oracle** is an MCP (Model Context Protocol) server for semantic knowledge management. It provides:

- **Hybrid search** (SQLite FTS5 + LanceDB vector embeddings) over a knowledge vault
- **HTTP API** (port 47778) for programmatic access
- **CLI tools** for operator management and indexing
- **Philosophy-first design**: Inspired by Oracle philosophy, designed to keep humans human

**Use cases:**
- AI memory layers (Claude Code integration via MCP)
- Knowledge vault indexing and retrieval
- Semantic search over documentation
- Session tracing and audit trails
- Thread-based Q&A forums

---

## Install

### Quickest: bunx (Recommended)

```bash
# HTTP server
bunx --bun --package github:Soul-Brews-Studio/arra-oracle-v3 arra-oracle

# CLI (operator client)
bunx --bun --package github:Soul-Brews-Studio/arra-oracle-v3 arra-cli --help

# Add to Claude Code
claude mcp add arra-oracle-v2 -- bunx --bun --package github:Soul-Brews-Studio/arra-oracle-v3 arra-oracle-v2
```

### From Source

```bash
git clone https://github.com/Soul-Brews-Studio/arra-oracle-v3.git
cd arra-oracle-v3 && bun install
bun run dev          # MCP server (stdio)
bun run server       # HTTP API on :47778
```

### Requirements

- **Bun** ≥ 1.2.0 ([install](https://bun.sh))
- Optional: `gh` CLI (for issue workflows), `curl` (for testing HTTP endpoints)

**Check versions:**
```bash
bun --version
gh --version
curl --version
```

---

## Run

### 1. Start the MCP / HTTP Server

```bash
# Default port: 47778
ORACLE_PORT=47778 bun run src/server.ts
# or from root: bun run server
```

**Verify it's alive:**
```bash
curl http://localhost:47778/api/health
```

### 2. CLI (Separate Terminal)

```bash
cd cli
bun run src/cli.ts --help
bun run src/cli.ts search "oracle principles"
```

### 3. Web Dashboard (Optional, Separate Terminal)

```bash
cd web
PUBLIC_BACKEND_URL=http://localhost:47778 bun run dev
# Opens http://localhost:4321
```

### CORS Troubleshooting

If the web dev server (port 4321) can't reach the API (port 47778), set:

```bash
CORS_ORIGIN=http://localhost:4321 ORACLE_PORT=47778 bun run src/server.ts
```

Or use the browser fallback: `http://localhost:4321/?api=http://localhost:47778`

---

## Key Features

### 1. Hybrid Search (No Setup Required)

Fresh install works immediately with **SQLite FTS5** (full-text search). No vectors needed to start.

```bash
# Keyword search
curl 'http://localhost:47778/api/search?q=oracle&mode=fts'

# Hybrid (FTS + vectors when ready)
curl 'http://localhost:47778/api/search?q=oracle&mode=hybrid'
```

If vectors aren't indexed yet, `hybrid` degrades gracefully to FTS.

### 2. Progressive Onboarding

Opt in to features as you need them:

| Step | Feature | Setup Time |
|------|---------|-----------|
| 0 | Start server | 1 min |
| 1 | FTS5 search | 0 min (included) |
| 2 | Connect MCP to Claude Code | 2 min |
| 3 | Reduce tool surface via config | 5 min |
| 4 | Index your `ψ/` vault | 10 min |
| 5 | Enable vector search | 20 min |
| 6 | Review audit trails | Ongoing |

**Start at step 0. Skip steps you don't need.**

### 3. MCP Tools (23 Total)

Primary tools:
| Tool | Purpose |
|------|---------|
| `oracle_search` | Hybrid search (FTS5 + vectors) |
| `oracle_reflect` | Random wisdom |
| `oracle_learn` | Add patterns to knowledge base |
| `oracle_list` | Browse indexed documents |
| `oracle_stats` | Database statistics |
| `oracle_verify` | Verify document accuracy |
| `oracle_trace` | Create execution trace |
| `oracle_thread` | Create Q&A thread |

See the [MCP Tools](../docs/mcp-tools.md) reference for all 23.

### 4. Vault CLI

Manage the knowledge vault:

```bash
oracle-vault init <owner/repo>    # Initialize with GitHub repo
oracle-vault status               # Show config + pending changes
oracle-vault sync                 # Commit + push to GitHub
oracle-vault pull                 # Pull vault files into local ψ/
oracle-vault migrate              # Seed vault from ghq repos
```

---

## API Endpoints (55 Total)

Grouped by module. See [API reference](../docs/API.md) for full docs.

### Health & Admin
```
GET  /api/health              # Server liveness
GET  /api/stats               # Doc + vector stats
GET  /api/oracles             # Active Oracle instances
GET  /api/settings            # Configuration
POST /api/settings            # Update config
```

### Search & Browse
```
GET  /api/search?q=...&mode=fts|hybrid|vector
GET  /api/list                # Browse all documents
GET  /api/reflect             # Random wisdom
GET  /api/similar?doc=...     # Vector nearest neighbors
GET  /api/map                 # 2D knowledge map
GET  /api/map3d               # 3D PCA projection
```

### Knowledge Management
```
POST /api/learn               # Add pattern
POST /api/handoff             # Session handoff
GET  /api/inbox               # Inbox messages
POST /api/supersede           # Mark document as superseded
```

### Indexing
```
POST /api/indexer/scan        # Scan ψ/ vault
POST /api/indexer/reindex     # Rebuild indexes
GET  /api/vector/config       # Vector engine settings
PATCH /api/vector/config      # Configure embeddings
POST /api/vector/index/start  # Start vector indexing
```

### Traces & Audit
```
GET  /api/traces              # List execution traces
GET  /api/traces/:id          # Get trace details
POST /api/traces/:id/link     # Link traces
DELETE /api/traces/:id/link   # Unlink traces
```

### Forum & Threads
```
GET  /api/threads             # List Q&A threads
POST /api/thread              # Create thread
GET  /api/thread/:id          # Get thread messages
PATCH /api/thread/:id/status  # Update thread status
```

---

## Configuration

### Environment Variables

```bash
# Server
ORACLE_PORT=47778                        # HTTP port (default)
ORACLE_SESSION_SECRET=                   # Auto-generated if empty
CORS_ORIGIN=                             # Allowed origin (e.g., https://yourdomain.com)

# Data
ORACLE_DATA_DIR=                         # Where DB/indexes live (default: ~/.oracle)
ORACLE_REPO_ROOT=$(pwd)                  # Knowledge base root

# Vector Backend (Choose One)
CHROMA_URL=http://localhost:8000         # Chroma service
QDRANT_URL=http://localhost:6333         # Qdrant service
QDRANT_API_KEY=                          # Qdrant auth

# Embeddings
OPENAI_API_KEY=                          # For OpenAI embeddings
OLLAMA_BASE_URL=http://localhost:11434   # For local Ollama

# Optional
ORACLE_FORUM_REPO=owner/repo             # GitHub repo for forum sync
ORACLE_SOURCE_MAPPINGS='{"key":"..."}' # JSON source map
```

### MCP Tool Filtering

Restrict tool surface via `.arra/config.json`:

```json
{
  "allowed_tools": ["oracle_search", "oracle_read", "oracle_list", "oracle_stats"]
}
```

Or env vars:
```bash
# Allow only these
ORACLE_ENABLED_TOOLS=oracle_search,oracle_read,oracle_list,oracle_stats

# Hide these
ORACLE_DISABLED_TOOLS=oracle_trace,oracle_thread
```

### Web UI Tool Toggle

Open `http://localhost:47778/tools/config` to toggle tools in the browser. Settings persist to `.arra/config.json`.

---

## Common Workflows

### Search Over Your Knowledge Vault

1. **Index your vault:**
   ```bash
   # Scan ψ/ directory
   curl -X POST http://localhost:47778/api/indexer/scan
   # Reindex SQLite FTS
   curl -X POST http://localhost:47778/api/indexer/reindex
   ```

2. **Search:**
   ```bash
   # Keyword search (always works)
   curl 'http://localhost:47778/api/search?q=oracle&mode=fts'
   # Semantic (if vectors enabled)
   curl 'http://localhost:47778/api/search?q=oracle&mode=hybrid'
   ```

### Add MCP to Claude Code

1. **Start the server:**
   ```bash
   bun run server
   ```

2. **Add MCP:**
   ```bash
   claude mcp add arra-oracle-v2 \
     --env ORACLE_API=http://localhost:47778 \
     -- bunx --bun --package github:Soul-Brews-Studio/arra-oracle-v3 arra-oracle-v2
   ```

3. **In Claude Code:** Use `oracle_search`, `oracle_learn`, etc. in your chat

### Enable Vector Search

1. **Pick a vector engine** (Chroma, Qdrant, or local LanceDB):
   ```bash
   # Example: local LanceDB + Ollama embeddings
   OLLAMA_BASE_URL=http://localhost:11434 bun run server
   ```

2. **Configure embeddings:**
   ```bash
   curl http://localhost:47778/api/vector/config
   ```

3. **Index vectors:**
   ```bash
   curl -X POST http://localhost:47778/api/vector/index/start
   ```

4. **Search with vectors:**
   ```bash
   curl 'http://localhost:47778/api/search?q=oracle&mode=hybrid'
   ```

### Track Execution with Traces

Create and link traces to build an audit trail:

```bash
# Create trace
curl -X POST http://localhost:47778/api/trace \
  -H 'Content-Type: application/json' \
  -d '{"name":"my_task","metadata":{"user":"alice"}}'

# Link traces
curl -X POST http://localhost:47778/api/traces/:prevId/link \
  -H 'Content-Type: application/json' \
  -d '{"nextId":"new-trace-id"}'

# View chain
curl http://localhost:47778/api/traces/:id/linked-chain
```

---

## Testing

```bash
# All tests (unit + integration)
bun test

# Unit tests only
bun test:unit

# Integration tests
bun test:integration

# E2E tests (Playwright)
bun test:e2e

# With coverage
bun test:coverage
```

---

## Database Commands

Uses **Drizzle ORM** with SQLite:

```bash
# Push schema to DB
bun db:push

# Generate migrations
bun db:generate

# Apply pending migrations
bun db:migrate

# Pull schema from DB
bun db:pull

# Open GUI editor
bun db:studio
```

---

## Architecture

```
arra-oracle-v3/
├── src/
│   ├── index.ts           # MCP server entry (stdio)
│   ├── server.ts          # HTTP API (Hono + Elysia)
│   ├── indexer.ts         # Knowledge indexer
│   ├── tools/             # MCP tool handlers (23 tools)
│   ├── routes/            # HTTP endpoint handlers
│   ├── trace/             # Execution trace system
│   ├── db/
│   │   ├── schema.ts      # Drizzle ORM schema
│   │   └── index.ts       # DB client
│   ├── server/            # HTTP server modules
│   └── vault/             # Vault CLI
├── cli/                   # Operator CLI
├── web/                   # Astro web dashboard
├── services/              # External services (reranker, etc.)
├── docs/                  # Documentation
└── catalog/               # Plugin catalog
```

**Stack:**
- **Runtime:** Bun ≥ 1.2.0
- **Database:** SQLite + FTS5 + LanceDB vectors
- **ORM:** Drizzle
- **HTTP:** Hono (migrating to Elysia)
- **MCP:** TypeScript SDK
- **Web:** Astro + React

---

## Important Notes

### File Size Rule
- Keep source files ≤ 250 lines
- Split by concern; don't pad with helpers

### Test Layout
- Mirror route structure: `tests/http/<cluster>/<endpoint>.test.ts`
- Run by cluster: `bun test tests/http/forum/`

### Versioning
- **Always alpha.** Every main merge auto-releases as `v{yy}.{m}.{d}-alpha.{HMM}`
- Never cut a stable release without explicit user direction

### Migration Rule
- **Never use direct SQL** for schema changes
- Always update `src/db/schema.ts` first
- Then run `bun db:push`
- If Drizzle skips indexes (known bug): manually `CREATE INDEX IF NOT EXISTS` or drop indexes first

### Drizzle Gotchas
- `db:push` doesn't use `IF NOT EXISTS` for indexes — if they exist, push fails
- **Workaround:** Backup first, then `CREATE INDEX IF NOT EXISTS` manually, or drop indexes before push

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `EADDRINUSE: address already in use :47778` | Stale process holds port | `lsof -i :47778` then kill, or `ORACLE_PORT=47779 bun run server` |
| `CORS error` in browser | Server doesn't allow web origin | `CORS_ORIGIN=http://localhost:4321 bun run server` or use `?api=` fallback |
| `bun: command not found` | Bun not installed or not in PATH | Install Bun: `curl -fsSL https://bun.sh/install \| bash`, then `export PATH="$HOME/.bun/bin:$PATH"` |
| LanceDB missing/hangs/timeout | Vector setup incomplete | Skip vectors — FTS5 works fine alone. Hybrid mode degrades to FTS. |
| Fresh install, no search results | Index is empty | Run `POST /api/indexer/scan` then `POST /api/indexer/reindex`. Or add docs via `oracle_learn`. |
| `bun db:push` fails on indexes | Schema drift (indexes exist in DB but not in schema) | Add indexes to `src/db/schema.ts` to preserve data, or drop them first |

---

## Learn More

- **[README.md](../README.md)** — Full overview
- **[docs/LOCAL-DEV.md](../docs/LOCAL-DEV.md)** — Detailed local dev setup
- **[docs/ONBOARDING.md](../docs/ONBOARDING.md)** — Progressive feature checklist
- **[docs/DOCKER-MCP-TOOLKIT.md](../docs/DOCKER-MCP-TOOLKIT.md)** — Docker deployment
- **[docs/architecture.md](../docs/architecture.md)** — Technical deep dive
- **[docs/CONTRIBUTING-AWAKENING.md](../docs/CONTRIBUTING-AWAKENING.md)** — How to report new Oracles
- **[CLAUDE.md](../CLAUDE.md)** — Project conventions & dev guidelines
- **[Drizzle ORM](https://orm.drizzle.team/)** — Database docs
- **[MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk)** — MCP protocol

---

**Last Updated:** 2026-06-19 | **Guide Version:** 1.0.0
