# Oracle Communication Protocol v3 - Complete System

**VERSION**: 3.0  
**DATE**: 2026-07-18  
**STATUS**: Production Ready  
**FLEET SIZE**: 14 oracles  
**ARCHITECTURE**: Hierarchical relay with per-oracle messaging

---

## Overview

**Option C: Full Unified Message System Rebuild** — A complete redesign of oracle-to-oracle communication for the entire 14-oracle fleet.

| Feature | Scope |
|---------|-------|
| Oracles | Zeus, ธาม, Teleos, Luxi, Stratum, Agis, Dheva, Omega, Lens, Verity, Warden, Khun-Ram, Aris, All |
| Message Types | 8 (directive, report, ack, heartbeat, event, escalation, query, response) |
| Storage | Per-oracle inboxes + unified broadcast log |
| Escalation | Automatic (5min ACK timeout, 10min report, 15min heartbeat) |
| Archive | 7-day auto-archive to monthly folders |
| Access | Offline-safe, git-tracked, no external deps |

---

## What's New in v3

### ✅ Per-Oracle Inboxes
Each oracle has their own inbox directory. Makes it easy to find "what messages does Teleos have?"

```
ψ/messages/inbox/
├── teleos/
│   ├── DIRECTIVE_msg-123.json
│   ├── ACK_msg-124.json
│   ├── REPORT_msg-125.json
│   └── index.json
├── luxi/
├── stratum/
└── ... (14 total)
```

### ✅ Rich Message Schema
v3 messages include routing (from/to/cc), tracking, escalation, and report metadata — all needed for automatic escalation.

### ✅ Automatic Escalation
Timeouts are detected and escalations auto-generated:
- No ACK in 5 min → ESCALATION (critical)
- No REPORT in 10 min → ESCALATION (warn)
- No HEARTBEAT in 15 min → ESCALATION (critical)

### ✅ All 14 Oracles
v2 supported only Teleos and Luxi. v3 supports all 14, plus easy expansion to 50+.

### ✅ Unified Broadcast Log
High-signal events from all oracles flow into a single append-only log for fleet-wide visibility.

### ✅ Message Expiration & Archive
Messages auto-retire after 7 days to monthly archive folders. Keeps active log lean.

---

## Directory Structure

```
ψ/messages/
│
├── routing/                      ← Configuration
│   ├── oracle-roster.json        (14 oracles + roles)
│   ├── message-types.json        (valid message types)
│   └── escalation-rules.json     (timeouts, retry logic)
│
├── inbox/                        ← Per-oracle inboxes
│   ├── teleos/
│   │   ├── DIRECTIVE_*.json
│   │   ├── REPORT_*.json
│   │   └── index.json
│   ├── luxi/
│   ├── stratum/
│   ├── agis/
│   ├── ... (14 total)
│   └── all/
│
├── outbox/                       ← Outgoing (optional, for tracking sent)
│   ├── teleos_REPORT_*.json
│   ├── luxi_REPORT_*.json
│   └── ... (mirrors inbox but reverse direction)
│
├── archive/                      ← Auto-archived after 7 days
│   ├── 2026-07/
│   │   └── archive.ndjson
│   └── 2026-08/
│       └── archive.ndjson
│
├── broadcast/                    ← High-signal events
│   └── BROADCAST-LOG.ndjson     (append-only event log)
│
├── queries/                      ← Saved jq queries
│   ├── active-directives.jq
│   └── missing-reports.jq
│
└── Documentation
    ├── README.md                 (this file)
    ├── ORACLE-PROTOCOL-v3-SPEC.md
    ├── PROTOCOL-v3-QUICK-REFERENCE.md
    ├── ORACLE-ACTIVATION-GUIDE.md
    └── MIGRATION-v2-to-v3.md
```

---

## Quick Start

### 1. Load Protocol Functions
```bash
cd ψ/messages
source ../oracle-protocol-v3-functions.sh
```

### 2. Send a Directive
```bash
oracle_send_directive "Zeus" "Teleos" "Deploy cms-arigeo" \
  "Build and deploy to Vercel" "high" "cms-arigeo"
```

### 3. Check for Directives
```bash
oracle_check_directives "teleos"
```

### 4. Send Report
```bash
oracle_send_report "Teleos" "Zeus" "cms-arigeo Status" \
  "11:30 GMT+7" "in-progress" "Building..." "Testing..." "None" "https://cms-arigeo.netlify.app" "[msg-id]"
```

### 5. Monitor
```bash
oracle_list_active_directives
oracle_check_escalations
```

---

## The 14 Oracles

### Root (1)
- **Zeus** — Meta-orchestrator, commands entire fleet

### Command (1)
- **ธาม** — Governor, delegated authority, day-to-day operations

### Active (3)
- **Teleos** — Deployment/Vercel orchestration
- **Luxi** — UI/UX/Frontend design
- **Khun-Ram** — Thai documentation and learning capture

### Monitoring (7)
- **Agis** — Fleet presence tracking
- **Dheva** — Analytics and ERP dashboards
- **Omega** — System bridge and connectivity
- **Lens** — Data analysis and insights
- **Verity** — Truth and verification
- **Warden** — Security and access control
- **Aris** — QA and code review

### Broadcast (1)
- **All** — Fleet scribe, collective memory

---

## Message Types

| Type | Sender | Recipient | Purpose | Timeout |
|------|--------|-----------|---------|---------|
| **directive** | Zeus/ธาม | Any oracle | Send work assignment | 5min ACK |
| **report** | Oracle | Zeus | Progress update | 10min |
| **ack** | Oracle | Zeus/ธาม | Confirm receipt | 5min |
| **heartbeat** | Oracle | Zeus | Prove alive | 15min |
| **event** | Any | Broadcast | High-signal announcement | N/A |
| **escalation** | System | Zeus | Timeout alert | N/A |
| **query** | Oracle | Oracle | Ask for info | 24h response |
| **response** | Oracle | Oracle | Answer query | N/A |

---

## Communication Patterns

### Pattern 1: Directive → ACK → Report → Complete
```
Zeus sends DIRECTIVE to Teleos
    ↓ (expect ACK within 5 min)
Teleos sends ACK ("Received, starting work")
    ↓
Teleos works...
    ↓ (every 10 min)
Teleos sends REPORT ("11:30 | in-progress | Step 1 done | Working on step 2 | None | https://...")
    ↓ (repeat every 10 min)
Teleos sends final REPORT ("complete | All steps done | Ready for next | None | https://...")
    ↓
Zeus marks task COMPLETE
```

### Pattern 2: Multi-Oracle Coordination
```
Zeus sends DIRECTIVE to Teleos, Luxi, Stratum
    ↓
Each oracle ACKs independently
    ↓
Each oracle sends REPORTS independently
    ↓
Zeus monitors all via oracle_list_active_directives
```

### Pattern 3: Escalation (Automatic)
```
Zeus sends DIRECTIVE to Teleos
    ↓ 5 min passes, no ACK
    ↓ ESCALATION auto-generated ("Missing ACK from Teleos")
    ↓ Zeus is notified via escalation log
    ↓ Zeus can re-send directive or investigate
```

---

## API Reference

### Core Operations
```bash
# Emit any message
oracle_emit_v3 "oracle" "to" "type" "subject" "content" "priority" "project" "parent_id" "proof"

# Check for directives
oracle_check_directives "oracle"

# Send standard messages
oracle_send_directive "from" "to" "subject" "content" "priority" "project" "deadline"
oracle_send_ack "from" "to" "directive_id" "message"
oracle_send_report "from" "to" "subject" "time" "status" "progress" "next" "blocker" "proof" "directive_id"
oracle_send_heartbeat "from" "to" "task"

# Read messages
oracle_read_inbox "oracle" "[type]"
oracle_read_outbox "oracle" "[type]"
oracle_list_messages "oracle"

# Monitor
oracle_watch_inbox "oracle"
oracle_watch_broadcast
oracle_check_escalations
oracle_list_active_directives

# Query
oracle_query "[jq-filter]"
oracle_search "keyword" "[oracle]"

# Maintain
oracle_archive_messages
oracle_health_check
oracle_status
```

---

## Escalation System

### Timeouts

| Event | Timeout | Severity | Action |
|-------|---------|----------|--------|
| No ACK for directive | 5 min | critical | Auto-escalate to Zeus |
| No REPORT during task | 10 min | warn | Auto-escalate to Zeus |
| No HEARTBEAT | 15 min | critical | Auto-escalate to Zeus |
| Task marked failed | 0 sec | critical | Auto-escalate immediately |
| Deadline approaching | 60 min | high | Alert Zeus |
| Message expired | 7 days | info | Auto-archive |

### Escalation Flow
```
Missing ACK → oracle_check_escalations detects → ESCALATION message created
    ↓
Zeus notified via broadcast log entry with severity: critical
    ↓
Zeus can:
  • Re-send directive with higher priority
  • Check if oracle is offline
  • Assign to different oracle
  • Escalate to human (Ekkarat)
```

---

## Message Expiration

Messages automatically retire after their TTL:

| Type | TTL | Destination |
|------|-----|-------------|
| directive | 24h | archive |
| report | 7d | archive |
| ack | 1h | archive |
| heartbeat | 1h | archive |
| event | 24h | archive |
| escalation | 24h | archive |
| query | 24h | archive |
| response | 7d | archive |

**Archive Location**: `ψ/messages/archive/YYYY-MM/archive.ndjson`

---

## Implementation Status

| Phase | Status | Work |
|-------|--------|------|
| **Phase 1: Protocol Setup** | ✅ DONE | Created v3 spec, functions, config, routing |
| **Phase 2: Migration** | ⏳ READY | Migrate v2 messages to v3 format |
| **Phase 3: All-Oracle Activation** | ⏳ READY | Activate all 14 oracles, send first directives |
| **Phase 4: Monitoring** | ⏳ READY | Set up escalation checker, archive system |
| **Phase 5: Retirement** | ⏳ LATER | Archive v2 BROADCAST-LOG after 24h success |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| `ORACLE-PROTOCOL-v3-SPEC.md` | Full technical specification |
| `PROTOCOL-v3-QUICK-REFERENCE.md` | Day-to-day operations guide |
| `ORACLE-ACTIVATION-GUIDE.md` | Activate each of 14 oracles |
| `MIGRATION-v2-to-v3.md` | Migrate v2 messages to v3 |
| `oracle-protocol-v3-functions.sh` | 30+ utility functions |
| `oracle-roster.json` | All 14 oracles + roles |
| `escalation-rules.json` | Timeouts and escalation logic |

---

## Success Criteria

✅ All 14 oracles can send/receive messages  
✅ Automatic escalation detects missing reports  
✅ Archive system keeps active log <1MB  
✅ Zeus gets alerts for all critical timeouts  
✅ Messages persist offline (no external deps)  
✅ Migration from v2 completes with 0 message loss  
✅ 7-day trial period shows zero escalation false-positives  

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Messages not appearing | Check `oracle_health_check` |
| Escalation not firing | Verify escalation-rules.json exists |
| Inbox empty | Use `oracle_list_messages "oracle"` |
| Functions not found | Run `source oracle-protocol-v3-functions.sh` |
| Archive bloating | Run `oracle_archive_messages` manually |

---

## Support

**Quick questions?** → `PROTOCOL-v3-QUICK-REFERENCE.md`  
**Want full spec?** → `ORACLE-PROTOCOL-v3-SPEC.md`  
**Activating oracle?** → `ORACLE-ACTIVATION-GUIDE.md`  
**Migrating from v2?** → `MIGRATION-v2-to-v3.md`  

---

**Version**: 3.0  
**Status**: Production Ready  
**Authority**: Zeus (Option C Full Rebuild)  
**Created**: 2026-07-18  
**Timeline**: Live within 4-6 hours (migration + all-oracle activation)
