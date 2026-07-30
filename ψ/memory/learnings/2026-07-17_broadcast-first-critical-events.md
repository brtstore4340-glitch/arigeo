---
name: broadcast-first-critical-events
description: Critical fleet events should hit broadcast log before inbox/notifications
metadata:
  type: feedback
  ttl: ∞
  source: rrr:2026-07-17 Zeus fleet coordination
---

# Broadcast-First for Critical Events

**Rule**: Fleet events affecting multiple oracles or blocking deployments should be recorded in the fleet broadcast log first, with async notifications (inbox, email, /talk-to) as secondaries.

**Why**: The broadcast log is the persistent single source of truth. Async notifications are transient and can be missed. Critical events (activations, blockers, deployments) need to be visible fleet-wide immediately, not just to individual inboxes.

**Pattern**: 
1. Write event to `ψ/fleet/BROADCAST-LOG.ndjson` (append-only, timestamped, tagged)
2. Send async notification (inbox message, /talk-to, Slack) for urgency
3. Never rely on async alone for critical state

**Example** (Luxi activation):
- ✅ Event recorded in broadcast log (oracle:activation, critical severity)
- ✅ Activation message written to ψ/inbox/
- ✅ Both persisted and committed

**How to apply**: When Zeus/ธาม decides "this affects the fleet," check: is it in the broadcast log yet? If no, add it first. Then notify individuals.

**Related**: [[fleet-coordination-luxi-activation]]
