---
name: claude-to-im
description: - **GitHub**: https://github.com/op7418/Claude-to-IM
metadata:
  type: handoff
  ttl: ∞
  date: 2026-05-31
  source: fleet-memory
---

# Claude-to-IM Learning Index

## Source
- **Origin**: ./origin/
- **GitHub**: https://github.com/op7418/Claude-to-IM

## Explorations

### 2026-05-31 0913 (default — 3 agents)
- [Architecture](2026-05-31/0913_ARCHITECTURE.md)
- [Code Snippets](2026-05-31/0913_CODE-SNIPPETS.md)
- [Quick Reference](2026-05-31/0913_QUICK-REFERENCE.md)

**Key insights**:
1. No external Telegram SDK needed — uses raw `fetch()` to Bot API, same pattern as `telegram-utils.ts`
2. The `Host` interface (`BridgeStore + LLMProvider + PermissionGateway`) is the integration point — swap LLM with tmux send-keys
3. Long polling with 2-phase offset commitment prevents message loss on crash
