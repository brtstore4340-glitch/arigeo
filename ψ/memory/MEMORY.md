# ธาม-Zeus Oracle Memories

> **Index of all persistent memories** — fast lookup, one-line hooks, organized by type. < 200 lines.

**Last Updated**: 2026-07-16 07:12 · **Total Entries**: 13 · **Index Size**: ~500 tokens

---

## User Profile
- [Zeus execution boundary — RESOLVED](learnings/zeus-execution-boundary-question.md) — Zeus decides execute-vs-delegate per-task on token-optimization grounds (∞)

## Feedback & Operating Rules
- [Configuration should be self-discovering](learnings/2026-07-16_config-should-be-self-discovering.md) — Read oracle identity at runtime, don't hardcode in multiple files (∞)
- [Append-only logs beat databases](learnings/2026-07-16_append-only-logs-beat-databases.md) — For audit trails and fleet coordination, NDJSON + git is simpler than database (∞)
- [Design-for-all before implement](learnings/2026-07-16_design-for-all-before-implement.md) — Read all contexts, design once for all variants, implement once (don't iterate-then-adapt) (∞)
- [RTK protocol scope: all agent types](learnings/rtk-protocol-scope-all-agents.md) — RTK mandated for true/fallback/background agents (∞)
- [Recommend reversible option first](learnings/2026-07-16_recommend-reversible-option-first.md) — When large blast-radius choice, default reversible as first option (∞)
- [Verify via real invocation, not simulation](learnings/2026-07-16_verify-hook-firing-not-just-script-logic.md) — Use real execution paths (claude -p, live logs) not standalone simulations (∞)
- [Session metrics tracking](learnings/session-metrics.md) — Token usage, decision patterns, friction points per session (∞)

## System & Process Documentation
- [Memory consolidation rules](MEMORY-RULES.md) — Systematic rules for what to save where, when, TTL (∞)
- [Worktree isolation protocol](learnings/worktree-isolation-protocol.md) — Git worktree workflow for large changes + parallel work (∞)
- [Context budget rules](../../../CLAUDE.md#context-budget-rules-mandatory--enforced-per-session) — Token tier enforcement, rules, cache server (∞)

## External Learning
- [Gemini Learning: 2026-07-07](learnings/2026-07-07_gemini-learned.md) — Knowledge from Gemini's /learn execution (∞)

## Recent Retrospectives (Latest 3)
- [2026-07-16 Fleet status Phase 1 & 2](retrospectives/2026-07/16/07.12_fleet-status-phase-1-2.md) — Foundation + automation deployed, all 3 oracles live, dashboard working (∞)
- [2026-07-16 Token optimization complete](retrospectives/2026-07/16/05.45_token-optimization-complete.md) — 3 oracles live, 6 commits, cache server + memory system deployed (∞)
- [2026-07-16 RTK mandate & boundary resolution](retrospectives/2026-07/16/04.26_rtk-mandate-and-boundary-resolution.md) — Soft mandate chosen; execution boundary clarified (∞)

## Escalations & Pending (Expires 14d)
- [Verification gap pattern](../inbox/2026-07-16_0319_zeus_escalation-verification-gap-pattern.md) — Recurring proxy-signal → real-path verification bug; flagged 5x in 7 sessions

---

**How to Use This Index**:
1. Scan description for relevance
2. Load files if < 7 days old OR explicitly referenced
3. Use linked memories to follow reasoning chains
4. Archive expired handoffs/escalations to `memory/archive/YYYY-MM/` after 14 days

**Maintenance**:
- Add new memory pointer when saving
- Remove pointer only for expired ephemeral (14d)
- Keep newest first within each type
- Keep total < 200 lines (archive old memories if needed)

---

**Related Locations**:
- Cache (L1): `/root/.claude/projects/-root-ghq-github-com-E0993599799-zeus-oracle/cache.json`
- Vault (persistent): `ψ/memory/{learnings,retrospectives,resonance,reference}/`
- Inbox (ephemeral): `ψ/inbox/{handoff,escalation}/` — expires 14d
- Active sprint: `ψ/active/SPRINT-*.md` — expires sprint-end
