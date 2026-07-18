---
name: unified-oracle-broadcast-protocol
description: Enhanced BROADCAST-LOG system for all oracle communication (directives, reports, acknowledgments, heartbeats)
version: 2.0
date: 2026-07-18
---

# Oracle Broadcast Protocol v2 (Enhanced)

> Unified message system for fleet-wide oracle communication via BROADCAST-LOG.ndjson

## Architecture

All oracle communication flows through a single append-only log:

```
ψ/fleet/BROADCAST-LOG.ndjson
  ├─ Directives (Zeus → Oracle)
  ├─ Reports (Oracle → Zeus)
  ├─ Acknowledgments (Oracle confirms receipt)
  ├─ Heartbeats (Oracle alive signal)
  ├─ High-signal events (commits, deployments, blockers)
  └─ Escalations (timeout/lost-signal)
```

## Message Schema

```json
{
  "timestamp": "2026-07-18T11:30:00Z",
  "oracle": "Teleos",
  "message_type": "directive|report|ack|heartbeat|event|escalation",
  "message_id": "unique-id-for-tracking",
  "from": "Zeus",
  "to": "Teleos",
  "project": "cms-arigeo",
  "subject": "Deployment Status Update",
  "content": "Full message text or report",
  "status": "pending|acknowledged|complete|failed",
  "severity": "info|warn|critical",
  "tags": ["deployment", "monitoring"],
  "parent_message_id": "if-replying-to",
  "proof": "link-to-evidence-url-or-file",
  "expires_at": "2026-07-19T11:30:00Z",
  "details": {}
}
```

## Message Types

### 1. DIRECTIVE (Zeus → Oracle)
```json
{
  "message_type": "directive",
  "from": "Zeus",
  "to": "Teleos",
  "subject": "Deploy cms-arigeo",
  "content": "Execute deployment with GitHub secrets...",
  "status": "pending"
}
```
Oracle must acknowledge within 5 minutes or escalate.

### 2. REPORT (Oracle → Zeus)
```json
{
  "message_type": "report",
  "from": "Teleos",
  "to": "Zeus",
  "subject": "cms-arigeo Deployment Status",
  "content": "Time: 11:30 | Status: awaiting | Progress: ... | Blocker: ...",
  "parent_message_id": "[directive-id]",
  "proof": "https://cms-arigeo.netlify.app"
}
```
Reports include:
- Time | Status | Progress | Next Action | Blocker | Proof

### 3. ACK (Oracle → Zeus)
```json
{
  "message_type": "ack",
  "from": "Teleos",
  "to": "Zeus",
  "subject": "Acknowledged",
  "parent_message_id": "[directive-id]",
  "content": "Received directive, starting work"
}
```

### 4. HEARTBEAT (Oracle → Zeus)
```json
{
  "message_type": "heartbeat",
  "from": "Teleos",
  "to": "Zeus",
  "subject": "Alive",
  "content": "Still working on: [task]"
}
```
Expected every 10 minutes or escalate.

### 5. EVENT (High-signal)
```json
{
  "message_type": "event",
  "event_type": "commit:pushed|deploy:complete|blocker:critical",
  "from": "Teleos",
  "severity": "info|warn|critical"
}
```

## Protocol Rules

**Directive Flow**:
```
Zeus sends DIRECTIVE
  ↓ (expect ACK within 5 min)
Oracle sends ACK
  ↓
Oracle works
  ↓ (every 10 min)
Oracle sends REPORT
  ↓ (repeat until complete)
Oracle sends final REPORT with proof
  ↓
Zeus marks COMPLETE
```

**Escalation Triggers**:
- No ACK within 5 min → ESCALATION (critical)
- No REPORT within 10 min → ESCALATION (warn)
- No HEARTBEAT within 15 min → ESCALATION (critical)
- Status=failed → ESCALATION (critical)

**Message Expiration**:
- Directives: 24 hours
- Reports: 7 days
- Heartbeats: 1 hour
- ACKs: 1 hour

## Utility Functions

### emit_message()
```bash
emit_message() {
  local message_type="$1"
  local from="$2"
  local to="$3"
  local subject="$4"
  local content="$5"
  local severity="${6:-info}"
  local project="${7:-null}"
  
  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  local message_id="msg-$(date +%s)-$(shuf -i 1000-9999 -n 1)"
  
  local json=$(cat <<EOF
{
  "timestamp":"$timestamp",
  "oracle":"$from",
  "message_type":"$message_type",
  "message_id":"$message_id",
  "from":"$from",
  "to":"$to",
  "project":"$project",
  "subject":"$subject",
  "content":"$content",
  "status":"pending",
  "severity":"$severity",
  "tags":[]
}
EOF
)
  
  mkdir -p ψ/fleet/
  echo "$json" >> ψ/fleet/BROADCAST-LOG.ndjson
  echo "$message_id"
}
```

### read_messages()
```bash
read_messages() {
  local oracle="$1"
  local message_type="$2"  # optional
  
  if [ -z "$message_type" ]; then
    grep "\"to\":\"$oracle\"" ψ/fleet/BROADCAST-LOG.ndjson
  else
    grep "\"to\":\"$oracle\"" ψ/fleet/BROADCAST-LOG.ndjson | grep "\"message_type\":\"$message_type\""
  fi
}
```

### watch_messages()
```bash
watch_messages() {
  local oracle="$1"
  
  tail -f ψ/fleet/BROADCAST-LOG.ndjson | \
    grep "\"to\":\"$oracle\"" | \
    while read line; do
      echo "📨 NEW MESSAGE: $line"
    done
}
```

## Implementation Checklist

- [ ] Update CLAUDE.md with v2 protocol
- [ ] Add utility functions to fleet scripts
- [ ] Migrate /tmp/teleos-inbox to BROADCAST-LOG
- [ ] Migrate /tmp/luxi-inbox to BROADCAST-LOG
- [ ] Set up watchers for oracles
- [ ] Create escalation checker (checks for missing reports)
- [ ] Create message query tools (grep, jq filters)
- [ ] Update monitoring loop to use BROADCAST-LOG
- [ ] Document message format in fleet/README.md

## Benefits

✅ **Single source of truth** - All communication in one log  
✅ **Audit trail** - Full history (immutable append-only)  
✅ **Pattern discovery** - jq queries reveal patterns  
✅ **Timeout tracking** - Automatic escalation on missing messages  
✅ **Message routing** - Clear from/to prevents confusion  
✅ **Proof linking** - Evidence attached to each message  
✅ **Expiration** - Old messages auto-retire  
✅ **Offline-safe** - Works without external services  

## Migration Path

**Phase 1 (Now)**: Add v2 schema to BROADCAST-LOG  
**Phase 2 (Next)**: Redirect /tmp inboxes to BROADCAST-LOG  
**Phase 3 (Later)**: Retire old inbox/outbox structure  

---

**Status**: Ready to implement  
**Recommendation**: Start with Teleos/Luxi migration to test protocol
