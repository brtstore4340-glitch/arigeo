---
name: arra-oracle-v3
description: - **GitHub**: https://github.com/Soul-Brews-Studio/arra-oracle-v3
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-19
  source: fleet-memory
---

# arra-oracle-v3 Learning Index

## Source
- **Origin**: ./origin/
- **GitHub**: https://github.com/Soul-Brews-Studio/arra-oracle-v3

## Explorations

### 2026-06-19 0706 (default — 3 agents)
- [[2026-06-19/0706_ARCHITECTURE|Architecture]]
- [[2026-06-19/0706_CODE-SNIPPETS|Code Snippets]]
- [[2026-06-19/0706_QUICK-REFERENCE|Quick Reference]]

**Key insights**:
1. MCP memory layer combining SQLite FTS5 + LanceDB vector search with hybrid blending — "Nothing is Deleted" supersession pattern keeps full history
2. 55 HTTP endpoints + 23 MCP tools all backed by the same Drizzle ORM schema; MCP tool aliasing bridges `arra_*` → `muninn_*` → `oracle_*` naming generations
3. Progressive onboarding (6 opt-in steps) with lazy init to avoid blocking MCP handshake — runs on Bun with pluggable vector backends (LanceDB, Qdrant, Chroma, sqlite-vec, Cloudflare Vectorize)
