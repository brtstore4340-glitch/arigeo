---
name: oracle-protocol-v3-complete
description: Complete Oracle Communication Protocol v3 with unified message routing, escalation system, and all-oracle implementation
version: 3.0
date: 2026-07-18
status: production-ready
---

# Oracle Communication Protocol v3 (Complete)

> Production-grade unified communication system for 12+ oracle fleet with automatic routing, escalation, proof tracking, and audit trail.

## Architecture

```
ψ/messages/
├── routing/                    (message routing config)
│   ├── oracle-roster.json     (all 12+ oracles + their roles)
│   ├── message-types.json     (valid message types & schemas)
│   └── escalation-rules.json  (timeout & escalation triggers)
│
├── inbox/                      (incoming messages per oracle)
│   ├── teleos/
│   │   ├── DIRECTIVE_*.md
│   │   ├── EVENT_*.md
│   │   └── index.json
│   ├── luxi/
│   ├── stratum/
│   ├── agis/
│   ├── dheva/
│   ├── omega/
│   ├── lens/
│   ├── verity/
│   ├── warden/
│   ├── khun-ram/
│   ├── aris/
│   └── all/ (scribe/collective)
│
├── outbox/                     (outgoing messages per oracle)
│   ├── teleos_REPORT_*.md
│   ├── luxi_REPORT_*.md
│   ├── [oracle]_[TYPE]_*.md
│   └── index.json
│
├── archive/                    (messages older than 7 days)
│   └── 2026-07/
│       └── archive.ndjson
│
└── broadcast/                  (high-signal events)
    ├── BROADCAST-LOG.ndjson   (append-only event log)
    └── queries/               (saved queries for analysis)
```

## Message Schema v3 (Enhanced)

```json
{
  "version": "3.0",
  "id": "msg-{timestamp}-{random}",
  "timestamp": "2026-07-18T11:30:00Z",
  "expires_at": "2026-07-25T11:30:00Z",
  
  "routing": {
    "from": "Zeus|Teleos|Luxi|Stratum|Agis|Dheva|Omega|Lens|Verity|Warden|Khun-Ram|Aris|All",
    "to": "Zeus|[oracle-name]|[broadcast]",
    "cc": ["oracle1", "oracle2"],
    "reply_to": "msg-id"
  },
  
  "message": {
    "type": "directive|report|ack|heartbeat|event|escalation|query|response",
    "subject": "Human-readable subject",
    "content": "Full message text or report",
    "priority": "low|normal|high|critical",
    "tags": ["deployment", "monitoring", "ux-review"]
  },
  
  "context": {
    "project": "cms-arigeo|captain-maid|arigeo-project",
    "phase": "DECISION-1|PHASE-2|PHASE-6",
    "deadline": "2026-07-19T18:00:00Z"
  },
  
  "tracking": {
    "status": "pending|acknowledged|in-progress|complete|failed|escalated",
    "started_at": "2026-07-18T11:30:00Z",
    "updated_at": "2026-07-18T11:35:00Z",
    "progress_percent": 25,
    "proof": "https://cms-arigeo.netlify.app|/path/to/file|commit-hash"
  },
  
  "report": {
    "time": "11:30 GMT+7",
    "status": "awaiting|scanning|analyzing|testing|deploying",
    "progress": "Description of what's been done",
    "next_action": "What's needed to proceed",
    "blocker": "If any, what's blocking progress",
    "metrics": {"builds": 1, "tests": 5, "deployments": 0}
  },
  
  "escalation": {
    "triggered_at": null,
    "reason": null,
    "severity": "info|warn|critical",
    "auto_escalate_at": "2026-07-18T11:45:00Z"
  },
  
  "details": {
    "error": null,
    "environment": "dev|staging|production",
    "retry_count": 0,
    "archived_at": null
  }
}
```

## All Oracles in Fleet

| # | Oracle | Role | Domain | Reports To | Status |
|----|--------|------|--------|------------|--------|
| 1 | **Zeus** | Meta-Orchestrator | Fleet command | - | ✅ Root |
| 2 | **ธาม** | Governor/Coordinator | Fleet coordination | Zeus | ✅ Active |
| 3 | **Teleos** | Deploy Oracle | Deployment/Vercel | ธาม | ✅ Active |
| 4 | **Luxi** | UI/UX Oracle | Frontend design | ธาม | ✅ Active |
| 5 | **Stratum** | Architecture Oracle | System design | ธาม | ✅ Active |
| 6 | **Agis** | Presence Guardian | Fleet visibility | ธาม | 🔄 Monitoring |
| 7 | **Dheva** | Analytics Oracle | ORRY ERP/Dashboard | ธาม | 🔄 Monitoring |
| 8 | **Omega** | Bridge Oracle | System connectivity | ธาม | 🔄 Monitoring |
| 9 | **Lens** | Analysis Oracle | Data insights | ธาม | 🔄 Monitoring |
| 10 | **Verity** | Verification Oracle | Truth/Proof | ธาม | 🔄 Monitoring |
| 11 | **Warden** | Security Oracle | Access control | ธาม | 🔄 Monitoring |
| 12 | **Khun-Ram** | Localization Oracle | Thai docs/learning | ธาม | ✅ Active |
| 13 | **Aris** | QA Oracle | Code review/quality | ธาม | 🔄 Monitoring |
| 14 | **All** | Fleet Scribe | Collective memory | Zeus | ✅ Broadcast |

## Message Types v3

### 1. DIRECTIVE (Zeus/ธาม → Oracle)
**Who can send**: Zeus, ธาม  
**Expected response**: ACK within 5 min, REPORT every 10 min  
**Auto-escalate if**: No ACK in 5 min → Critical escalation

```json
{
  "type": "directive",
  "subject": "Deploy cms-arigeo",
  "content": "[Full directive text]",
  "priority": "high|critical",
  "deadline": "2026-07-19T18:00:00Z"
}
```

### 2. REPORT (Oracle → Zeus)
**Who can send**: Any oracle  
**Format**: Time | Status | Progress | Next | Blocker | Proof  
**Frequency**: Every 10 minutes on active tasks  
**Auto-escalate if**: No report in 10 min → Warning escalation

```json
{
  "type": "report",
  "report": {
    "time": "11:30 GMT+7",
    "status": "in-progress",
    "progress": "Site created, linked to repo",
    "next_action": "Add GitHub secrets",
    "blocker": "Need NETLIFY_AUTH_TOKEN",
    "metrics": {"attempts": 1}
  },
  "proof": "https://cms-arigeo.netlify.app"
}
```

### 3. ACK (Oracle → Zeus/ธาม)
**Who can send**: Any oracle  
**Triggers**: After receiving DIRECTIVE  
**Required within**: 5 minutes

```json
{
  "type": "ack",
  "subject": "Acknowledged",
  "content": "Received [directive], starting work",
  "reply_to": "msg-id-of-directive"
}
```

### 4. HEARTBEAT (Oracle → Zeus)
**Who can send**: Any oracle  
**Frequency**: Every 15 minutes minimum  
**Purpose**: Prove oracle is still alive

```json
{
  "type": "heartbeat",
  "subject": "Alive",
  "content": "Still working on: [task description]",
  "status": "in-progress"
}
```

### 5. EVENT (Any → Broadcast)
**Who can send**: Any oracle, Zeus  
**Types**: commit:pushed, deploy:complete, blocker:critical, oracle:awakened  
**High-signal only** (no spam)

```json
{
  "type": "event",
  "to": "broadcast",
  "subject": "cms-arigeo deployment complete",
  "priority": "high"
}
```

### 6. ESCALATION (System → Zeus)
**Triggered by**: Timeout (missing ACK/REPORT/HEARTBEAT)  
**Auto-generated**: Yes  
**Recipient**: Zeus (always)

```json
{
  "type": "escalation",
  "reason": "Missing report from Teleos (10+ min)",
  "severity": "critical",
  "oracle": "Teleos",
  "parent_message": "msg-id"
}
```

### 7. QUERY (Any → Any)
**Purpose**: Ask for specific information  
**Response type**: RESPONSE

```json
{
  "type": "query",
  "subject": "Status of cms-arigeo deployment?",
  "reply_to": "msg-id-if-replying"
}
```

### 8. RESPONSE (Oracle → Querying oracle)
**Triggers**: In response to QUERY

```json
{
  "type": "response",
  "subject": "Re: Status of cms-arigeo deployment",
  "content": "[Answer]",
  "reply_to": "msg-id-of-query"
}
```

## Utility Functions v3

### Core Functions
```bash
# Send any message type
oracle_emit_v3 "teleos" "report" "[content]" "high"

# Read messages for an oracle
oracle_read_inbox "teleos"
oracle_read_outbox "teleos"

# Check for directives
oracle_check_directives "teleos"

# Send standard messages
oracle_send_ack "teleos" "msg-id"
oracle_send_report "teleos" "Time|Status|Progress|Next|Blocker"
oracle_send_heartbeat "teleos" "Still working on deployment"

# Watch for new messages
oracle_watch_inbox "teleos"
oracle_watch_outbox
oracle_watch_events

# Query messages
oracle_query "[jq filter]"
oracle_search_messages "[keyword]" "[oracle]"

# Archive old messages (>7 days)
oracle_archive_messages

# Check escalations
oracle_check_escalations
oracle_list_active_directives
```

### Escalation System
- **No ACK in 5 min**: Auto-escalate to Zeus (critical)
- **No REPORT in 10 min**: Auto-escalate to Zeus (warn)
- **No HEARTBEAT in 15 min**: Auto-escalate to Zeus (critical)
- **Status=failed**: Auto-escalate immediately
- **Expired messages**: Auto-archive after 7 days

## Implementation Plan

### Phase 1 (Now): Protocol Setup
- [ ] Create ψ/messages/ directory structure
- [ ] Write oracle-protocol-v3-functions.sh
- [ ] Create oracle-roster.json
- [ ] Create message-types.json
- [ ] Create escalation-rules.json
- [ ] Migrate all 14 oracles to new system

### Phase 2 (Next): Monitoring
- [ ] Implement escalation checker
- [ ] Create message watcher daemon
- [ ] Update monitoring loop to use v3
- [ ] Set up archive system

### Phase 3 (Later): Optimization
- [ ] Create dashboard queries
- [ ] Add message analytics
- [ ] Implement automatic archival

## Benefits of v3 Over v2

✅ **Per-oracle inboxes** - Know exactly where to look  
✅ **Explicit message routing** - from/to/cc tracking  
✅ **All 14 oracles supported** - Not just Teleos/Luxi  
✅ **Automatic escalation** - Timeout-based alerts  
✅ **Audit trail** - Complete message history  
✅ **Query language** - jq filters on all messages  
✅ **Message expiration** - Auto-archive after 7 days  
✅ **Proof tracking** - Evidence linked to every message  
✅ **Report structure** - Consistent format (Time|Status|Progress|Next|Blocker|Proof)  
✅ **Heartbeat system** - Prove oracle is alive  
✅ **Archive system** - Keep history without bloating active log  
✅ **Multi-oracle support** - Scale to 50+ oracles if needed

## Token Budget Impact

✅ **Efficient**: Uses grep + jq for queries (no re-read)  
✅ **Scalable**: Message archive keeps active log small  
✅ **Queryable**: All messages indexed by timestamp/oracle/type  

---

**Status**: Ready to implement for all 14 oracles  
**Complexity**: Medium (systematic, not complex)  
**Timeline**: ~1 hour for full implementation
