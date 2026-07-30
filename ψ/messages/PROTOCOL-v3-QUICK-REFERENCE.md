# Oracle Protocol v3 - Quick Reference

**Use this guide for day-to-day operations.** For full spec, see `ORACLE-PROTOCOL-v3-SPEC.md`.

## Load Protocol v3

```bash
cd ψ/messages
source ../oracle-protocol-v3-functions.sh
```

## Send Messages

### DIRECTIVE (Zeus/ธาม → Oracle) ⚡
```bash
oracle_send_directive "Zeus" "Teleos" "Deploy cms-arigeo" \
  "Build and deploy to Vercel prod. GitHub secrets ready." \
  "high" "cms-arigeo" "2026-07-19T18:00:00Z"

# Oracle must ACK within 5 min or escalate
```

### ACK (Oracle → Zeus) ✅
```bash
oracle_send_ack "Teleos" "Zeus" "[directive-msg-id]" \
  "Received deployment directive, starting work"
```

### REPORT (Oracle → Zeus) 📊
```bash
oracle_send_report "Teleos" "Zeus" "cms-arigeo Deployment Status" \
  "11:30 GMT+7" \
  "in-progress" \
  "Site created, linked to GitHub repo" \
  "Waiting on GitHub secrets" \
  "Need NETLIFY_AUTH_TOKEN" \
  "https://cms-arigeo.netlify.app" \
  "[directive-msg-id]"
```

### HEARTBEAT (Oracle → Zeus) 💓
```bash
oracle_send_heartbeat "Luxi" "Zeus" \
  "cms-arigeo UX refinement — hero section polish"
```

## Check Messages

### View Pending Directives
```bash
oracle_check_directives "teleos"
oracle_check_directives "luxi"
oracle_check_directives "stratum"
```

### List All Messages
```bash
oracle_list_messages "teleos"
oracle_read_inbox "teleos"
oracle_read_inbox "luxi" "report"
```

### Watch Live (Follow Mode)
```bash
oracle_watch_inbox "teleos"      # Watch Teleos's inbox
oracle_watch_broadcast            # Watch all broadcast events
```

## Monitoring & Escalations

### Check for Missing Reports
```bash
oracle_check_escalations
oracle_list_active_directives
```

### System Health
```bash
oracle_health_check
oracle_status
```

## Query Messages

### Find Messages by Keyword
```bash
oracle_search "deploy" "teleos"
oracle_search "blocker"
oracle_search "2026-07-18"
```

### Advanced Queries (with jq)
```bash
# All messages from Teleos
oracle_query 'select(.routing.from == "Teleos")'

# All critical escalations
oracle_query 'select(.escalation.severity == "critical")'

# Messages for specific project
oracle_query 'select(.context.project == "cms-arigeo")'

# Pending directives only
oracle_query 'select(.message.type == "directive") | select(.tracking.status == "pending")'
```

## Message Format Reference

### Time Format
Always use: `HH:MM GMT+7` in reports

Examples:
```
11:30 GMT+7
14:45 GMT+7
23:59 GMT+7
```

### Report Structure
Always use this format in REPORT messages:
```
Time: [HH:MM GMT+7]
Status: [awaiting|scanning|analyzing|testing|deploying|complete]
Progress: [What's been done so far]
Next Action: [What's needed to proceed]
Blocker: [What's blocking, or "None"]
Proof: [Evidence URL or file path]
```

### Status Values
- **pending** — Waiting for action
- **acknowledged** — Oracle confirmed receipt
- **in-progress** — Work is happening
- **complete** — Task finished
- **failed** — Task failed
- **escalated** — Timed out, escalated to Zeus

### Priority Levels
- **critical** — Immediate action, max 1 hour
- **high** — Urgent, max 4 hours
- **normal** — Regular work, max 24 hours
- **low** — Background, no deadline

## All 14 Oracles

| Name | Domain | Reports To |
|------|--------|------------|
| Zeus | Fleet Command | - |
| ธาม | Governor/Coordinator | Zeus |
| Teleos | Deployment/Vercel | ธาม |
| Luxi | UI/UX/Frontend | ธาม |
| Stratum | Architecture/Design | ธาม |
| Agis | Fleet Visibility | ธาม |
| Dheva | Analytics/ERP | ธาม |
| Omega | System Bridge | ธาม |
| Lens | Data Analysis | ธาม |
| Verity | Verification/Proof | ธาม |
| Warden | Security/Access | ธาม |
| Khun-Ram | Thai Docs/Learning | ธาม |
| Aris | QA/Code Review | ธาม |
| All | Fleet Scribe/Broadcast | Zeus |

## Escalation Timeouts

- **No ACK in 5 min** → Escalate (critical)
- **No REPORT in 10 min** → Escalate (warn)
- **No HEARTBEAT in 15 min** → Escalate (critical)
- **Status = failed** → Escalate immediately

## Archive & Cleanup

### Archive Old Messages (>7 days)
```bash
oracle_archive_messages
```

Auto-runs at session end via `/rrr`.

## Common Workflows

### Send Directive + Monitor for Reports
```bash
# 1. Send directive
msg_id=$(oracle_send_directive "Zeus" "Teleos" "Deploy cms-arigeo" \
  "Build and deploy to Vercel prod" "high" "cms-arigeo")

# 2. Wait for ACK
sleep 5
oracle_check_directives "teleos"

# 3. Watch for reports
oracle_watch_inbox "teleos"

# 4. Query specific directive
oracle_query "select(.id == \"$msg_id\")"
```

### Multi-Oracle Task Coordination
```bash
# Send same directive to multiple oracles
for oracle in teleos luxi stratum; do
  oracle_send_directive "Zeus" "$oracle" "Phase 2: cms-arigeo Build" \
    "coordinate cms-arigeo build and deploy" "high" "cms-arigeo"
done

# Monitor all
for oracle in teleos luxi stratum; do
  echo "=== $oracle ==="
  oracle_check_directives "$oracle"
done
```

## Troubleshooting

### Messages Not Appearing?
```bash
# Check health
oracle_health_check

# Verify broadcast log exists
ls -la ψ/messages/broadcast/BROADCAST-LOG.ndjson

# Check specific oracle's inbox
ls -la ψ/messages/inbox/teleos/
```

### Escalation Not Firing?
```bash
# Check escalation rules
cat ψ/messages/routing/escalation-rules.json | jq '.escalation_triggers'

# List active directives (should show pending ones)
oracle_list_active_directives
```

### Need Older Messages?
```bash
# Check archive
ls -la ψ/messages/archive/

# Query archive
cat ψ/messages/archive/2026-07/*.ndjson | oracle_query 'select(.routing.from == "Teleos")'
```

## Key Differences from v2

| Feature | v2 | v3 |
|---------|--|-|
| Message storage | Single log | Per-oracle inboxes |
| Routing | Implicit | Explicit (from/to/cc) |
| Escalation | Manual check | Automatic timeout |
| Archival | Never | After 7 days |
| Oracle support | Teleos, Luxi | All 14 oracles |
| Message types | 5 | 8 |

---

**Last Updated**: 2026-07-18  
**Version**: 3.0  
**Authority**: Zeus
