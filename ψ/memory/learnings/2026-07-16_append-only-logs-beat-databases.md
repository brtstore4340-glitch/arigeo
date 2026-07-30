---
name: append-only-logs-over-databases
description: Append-only NDJSON logs are simpler and more auditable than databases for audit trails and fleet coordination
metadata:
  type: feedback
  ttl: ∞
---

# Append-Only Logs Beat Databases for Fleet Coordination

**Pattern Observed**: Fleet status broadcast system design decision (2026-07-16). Chose NDJSON append-only log over database/centralized server.

**The Choice**: When all you need is "what happened and when," git-tracked append-only NDJSON is simpler and more auditable than a database.

**Why This Matters**:
- **No concurrency issues** — Append is atomic; no write locks or conflict resolution needed
- **Git audit trail** — Every event is in git history; can blame/log any change
- **Zero dependencies** — Works offline, no external services, no version conflicts
- **Human-readable** — grep, jq, tail work natively; no query language to learn
- **Scales to 100+ oracles** — Single file grows linearly; split by day at 1000 events/day if needed
- **Easy to replicate** — Copy file to another oracle; done

**Tradeoff**: No real-time distributed sync (solved by periodic git pulls; acceptable for 3 oracles on same filesystem).

**Apply To**: Any audit-heavy feature (deployment log, decision record, incident timeline, session metrics, performance logs). Default to append-only JSON over database unless you have: multiple writers from different machines (concurrency), strict schema validation, or queries that need indexing (>10M rows).

**Scope**: Fleet coordination, event logging, audit trails. Not suitable for: operational state (use database), transactional consistency (use database), real-time distributed sync (use message queue).

---

## Reference

**Related memory**: [[design-for-all-before-implement]] — When deploying to multiple instances, read all contexts first and design once for all variants.

**Session**: /rrr 2026-07-16 fleet-status-phase-1-2 (implementation note: chose NDJSON over database after Plan agent research)

**Evidence**: Fleet status system now uses BROADCAST-LOG.ndjson. Works perfectly for 5 events across 3 oracles. Dashboard queries via jq run in <100ms.

---

*This is a generalizable pattern discovered during fleet status system implementation. Applies to any Oracle, any project.*
