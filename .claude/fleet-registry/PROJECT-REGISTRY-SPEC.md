---
title: Project Registry & Credential Coordination Spec
status: draft
last_edited_utc: 2026-07-09T12:44:52Z
last_verified_utc: 2026-07-09T12:44:52Z
scope: mission-control / fleet-registry
owner: agis-oracle
---

# Project Registry & Credential Coordination Spec

## Purpose

Provide one durable source of truth for:
- which project exists
- who owns it
- who is working on it now
- which credentials are allowed for it
- what changed over time
- whether live reality matches registry state

This spec is designed for a fleet where multiple agents share responsibility but must not share secrets or lose auditability.

## Core principle

Separate these concerns:

1. Identity / ownership
2. Active work state
3. Credential metadata
4. Immutable event history
5. Reconciliation / drift detection

Do not store all five in one flat object.

## Canonical file layout

Recommended storage surface:

```text
.claude/fleet-registry/
├── oracles.json
├── fleet-config.json
├── projects.json
├── work-ledger.jsonl
├── credentials.json
├── reconcile/
│   ├── latest-scan.json
│   └── scans/
│       └── 2026-07-09T12:44:52Z.json
├── locks/
│   └── project-<project_id>.lock
└── memory/
    └── <oracle>/...
```

Notes:
- `projects.json` is the live registry snapshot.
- `work-ledger.jsonl` is append-only history.
- `credentials.json` contains only metadata, never raw secrets.
- `reconcile/` holds drift reports and verification outputs.
- `locks/` holds short-lived ownership or write leases for concurrency control.

## Authority model

Write permissions must be explicit, not implied.

Recommended writers:
- `projects.json` — Agis-oracle or a designated registry writer only
- `work-ledger.jsonl` — Agis-oracle, plus approved automation that appends events
- `credentials.json` — credential steward or security owner only
- `reconcile/latest-scan.json` — Agis-oracle / reconciler only

Recommended readers:
- all fleet agents may read the registry snapshot and reconcile output
- only approved security roles may read secret manager references behind `secret_location_ref`

Rules:
- If a writer changes, record the change in the ledger.
- A lock/lease must be acquired before mutating `projects.json` or `credentials.json`.
- If the lock cannot be acquired, do not write; retry or escalate.

## 1) Project Registry schema

File: `.claude/fleet-registry/projects.json`

Purpose: current state only.

Minimum shape:

```json
{
  "schema_version": "1.0",
  "last_updated_utc": "2026-07-09T12:44:52Z",
  "projects": [
    {
      "project_id": "captain-maid-phase3-thai",
      "name": "Captain Maid Phase 3",
      "status": "in_progress",
      "phase": "phase_3",
      "owner": "Luxi",
      "backup_owner": "Khun-Ram",
      "contributors": ["Luxi", "Khun-Ram", "agis"],
      "workspace_path": "/mnt/d/01 Main Work/Boots/Agentic AI/mission-control/captain-maid",
      "board_slug": "codex-local",
      "current_task_ids": ["t_123", "t_456"],
      "risk_level": "medium",
      "next_checkpoint": "2026-07-09T18:00:00Z",
      "last_updated_utc": "2026-07-09T12:30:00Z"
    }
  ]
}
```

Required fields:
- `project_id`
- `name`
- `status`
- `owner`
- `backup_owner`
- `workspace_path`
- `last_updated_utc`

Recommended fields:
- `phase`
- `contributors`
- `board_slug`
- `current_task_ids`
- `risk_level`
- `next_checkpoint`

Status values:
- `planned`
- `in_progress`
- `blocked`
- `review`
- `done`
- `archived`

Rules:
- One project record = one active ownership truth.
- If ownership changes, update the snapshot and add a ledger event.
- Never overwrite the old meaning without recording the change in the ledger.

## 2) Work Ledger schema

File: `.claude/fleet-registry/work-ledger.jsonl`

Purpose: immutable event trail.

Each line is one JSON object.

Minimum shape:

```json
{
  "event_id": "evt_20260709_001",
  "timestamp_utc": "2026-07-09T12:44:52Z",
  "project_id": "captain-maid-phase3-thai",
  "actor": "agis",
  "action": "ownership_assigned",
  "from_state": {"owner": "Zeus"},
  "to_state": {"owner": "Luxi", "backup_owner": "Khun-Ram"},
  "related_task_id": "t_123",
  "evidence_path": ".claude/fleet-registry/reconcile/scans/2026-07-09T12:44:52Z.json",
  "note": "Transferred execution ownership after coordination review"
}
```

Allowed actions:
- `project_created`
- `ownership_assigned`
- `ownership_transferred`
- `task_started`
- `task_blocked`
- `task_unblocked`
- `task_completed`
- `credential_bound`
- `credential_unbound`
- `credential_rotated`
- `reconcile_passed`
- `reconcile_failed`
- `escalated`
- `archived`

Rules:
- Append only.
- Do not edit past entries except during an explicit migration.
- If a change is corrected, write a new event that supersedes the old one.
- Every ledger append must include a monotonic `event_id` and a UTC timestamp.
- Every ledger file rotation or compaction must preserve prior history in an archive copy.
- If tamper evidence is available, store a checksum or signature chain for each scan batch.

## 3) Credential Registry schema

File: `.claude/fleet-registry/credentials.json`

Purpose: metadata only. No raw secret values.

Minimum shape:

```json
{
  "schema_version": "1.0",
  "last_updated_utc": "2026-07-09T12:44:52Z",
  "credentials": [
    {
      "cred_ref": "vercel-prod-main",
      "provider": "vercel",
      "scope": "deploy:captain-maid",
      "allowed_projects": ["captain-maid-phase3-thai"],
      "allowed_agents": ["Teleos"],
      "owner": "Teleos",
      "status": "active",
      "secret_location_ref": "vault://vercel/prod/main",
      "rotated_at_utc": "2026-07-01T00:00:00Z",
      "expires_at_utc": null,
      "verified_at_utc": "2026-07-09T12:00:00Z"
    }
  ]
}
```

Required fields:
- `cred_ref`
- `provider`
- `scope`
- `allowed_projects`
- `allowed_agents`
- `owner`
- `status`
- `secret_location_ref`

Rules:
- Store only references to the secret.
- Use a vault, keychain, `.env`, or other secret manager for the actual value.
- If one credential can access multiple projects, declare that explicitly.
- Prefer least privilege: one project, one scope, one agent set.
- Define the secret manager of record for each `secret_location_ref`.
- A credential must not be marked active unless its scope has been verified against the live secret source.
- If a credential is shared, record the sharing reason and the minimum allowed agent set.

Status values:
- `active`
- `rotating`
- `disabled`
- `expired`
- `revoked`

## 4) Reconciliation report schema

File: `.claude/fleet-registry/reconcile/latest-scan.json`

Purpose: compare registry intent against live state.

Minimum shape:

```json
{
  "scan_id": "scan_20260709_124452",
  "timestamp_utc": "2026-07-09T12:44:52Z",
  "scanner": "agis",
  "results": [
    {
      "project_id": "captain-maid-phase3-thai",
      "owner_match": true,
      "task_match": true,
      "credential_match": false,
      "drift_items": [
        "credential scope missing allowed_projects entry"
      ],
      "severity": "medium",
      "action_required": "update credential metadata and rerun scan"
    }
  ]
}
```

Rules:
- Reconciliation reports are not the source of truth.
- They are evidence that the source of truth was checked.
- Keep the latest scan plus a timestamped scan history.

## Hardening controls

### Level 1 — usable
- One registry snapshot file
- One owner per project
- Backup owner recorded
- Credentials tracked by reference only

### Level 2 — reliable
- Append-only work ledger
- Explicit status lifecycle
- Reconciliation report generated on schedule
- Drift items recorded instead of hand-waved

### Level 3 — hardened
- Write access restricted to coordinator/reconciler roles
- Read access allowed fleet-wide
- Project ownership changes require ledger entry
- Credential metadata must include scope and allowed agents
- All scan outputs timestamped in UTC
- Project and credential writes require a lock/lease
- Reconcile output includes the exact source files or runtime checks used
- Ownership changes are rejected unless owner and backup_owner are both present

### Level 4 — strong
- Checksums or signatures for registry snapshots
- Lease/lock model for ownership handoff
- Separate secret manager with rotation policy
- Automated drift alerting
- Immutable archive of historical registry snapshots

### Level 5 — tamper-evident
- Hash chain or signature chain across ledger entries and scan outputs
- Stored snapshots are immutable once published
- Reconciliation failures produce an alert, not a silent overwrite
- Archive copies are retained for migration and audit replay

## Operating rules

1. Every project has exactly one current owner.
2. Every project has a backup owner.
3. Every active project has a workspace path.
4. Every credential is metadata-only in the registry.
5. Every state transition writes a ledger event.
6. Every reconcile run produces a report.
7. If live state and registry disagree, registry must be corrected or the project must be flagged blocked.
8. Secrets do not live in the registry.
9. Archive instead of delete.
10. If a lock cannot be acquired, no write happens.
11. If reconciliation cannot verify a claim, the result is `unknown`, not `true`.
12. A registry update without a ledger event is invalid.

## Agis-oracle role in this design

Agis should:
- monitor projects
- scan for drift
- report stale ownership
- flag missing checkpoints
- verify credential metadata against live use
- escalate exceptions

Agis should not:
- store raw secrets
- act as the only owner of truth
- overwrite history without a ledger event

## Fallback policy

This fleet must keep moving when a primary director or lane is unavailable.

Definitions:
- `primary_owner` — default responsible lane or agent
- `fallback_owner` — temporary substitute when primary is unavailable
- `fallback_reason` — why the fallback was activated
- `degraded_until` — optional UTC time when fallback should be re-evaluated
- `circuit_breaker_state` — `closed`, `open`, or `half_open`
- `last_health_check` — most recent successful availability probe

Rules:
1. If the primary lane is unavailable, mark it unavailable explicitly.
2. Do not drop the task; re-route it to an allowed fallback.
3. Every fallback activation must be written to the ledger.
4. Fallback ownership is temporary and must expire or be re-validated.
5. When the primary recovers, restore it only after a successful health check.

Suggested routing matrix:

| Task type | Primary | Fallback | Notes |
|---|---|---|---|
| Review / critique / second opinion | Claude review lane | Gemini reviewer | Best default fallback path |
| Research / comparative analysis | Claude research lane | Gemini reviewer or Hermes researcher | Use Gemini for synthesis, Hermes for repo-local context |
| Execution / code changes | Claude builder lane | Hermes builder / Codex runner | Prefer the lane that can still write safely |
| Coordination / routing | Claude director / Zeus | Hermes lead / Agis | Keep the queue moving |
| Verification / drift check | Claude verifier | Agis + Hermes verifier role | Reconcile against live files and ledger |

Operational fallback sequence:
- Retry the primary lane briefly.
- If it still fails, open the circuit for a cooldown window.
- Route new work to the fallback lane.
- Keep registry state intact and append an event for every ownership change.
- Run health checks periodically.
- When the primary passes health checks again, close the circuit and hand ownership back explicitly.

## Minimal rollout order

1. Define writer roles and lock semantics
2. Create `projects.json`
3. Start appending to `work-ledger.jsonl`
4. Add `credentials.json` with references only
5. Add reconciliation scans
6. Enforce owner/backup-owner on every project
7. Add drift alerting
8. Add checksums/signatures if needed
9. Archive/migrate any older registry forms into the new schema

## Open questions to resolve next

- Which system is the secret manager of record for each provider?
- Which role may write project ownership updates in production?
- What is the canonical task ID source, and can it be generated without collisions?
- Should `board_slug` point at one board per project or one board per lane?
- What is the timeout for stale ownership before escalation?
- What is the lock TTL and stale-lock recovery rule?
- What checksum/signature mechanism will protect snapshots and ledger batches?

[MARCUZ:Khun-Ram]
