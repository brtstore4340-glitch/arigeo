---
pattern: "Learned arra-oracle-v3: MCP memory server with hybrid FTS5+vector search, Nothing-is-Deleted supersession, and pluggable vector backends"
date: 2026-06-19
source: learn: Soul-Brews-Studio/arra-oracle-v3
concepts: ["learn", "codebase", "mcp", "oracle", "vector-search", "sqlite", "bun", "knowledge-management"]
---

# Learned arra-oracle-v3

1. **Hybrid search architecture** — FTS5 (SQLite) + LanceDB vectors blended with reranking; zero-config start (FTS only), vectors opt-in via progressive onboarding
2. **"Nothing is Deleted"** — Documents are superseded not deleted; Drizzle ORM with 17-table schema tracks full supersession chain
3. **MCP tool aliasing** bridges naming generations (`arra_*` → `muninn_*` → `oracle_*`) for backward compatibility across Claude Code sessions
4. **Lazy init pattern** — heavy modules load after MCP handshake completes to avoid blocking the connection
5. **Pluggable vector backends** — LanceDB, Qdrant, ChromaDB, sqlite-vec, Cloudflare Vectorize all behind a factory abstraction
