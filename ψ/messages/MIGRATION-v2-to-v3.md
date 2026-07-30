# Migration Guide: BROADCAST-LOG v2 → Protocol v3

**Status**: Ready to execute  
**Date**: 2026-07-18  
**Scope**: Migrate all existing v2 messages to v3 structure for all 14 oracles

## What Changed

| Aspect | v2 | v3 | Benefit |
|--------|--|-|-|
| Storage | Single log | Per-oracle inboxes + broadcast log | Easier to find messages; per-oracle state |
| Schema | Simple JSON | Rich message object with routing, tracking, escalation | Better tracking; automatic escalation |
| Routing | from/to fields | Explicit routing object (from/to/cc/reply_to) | Supports CC and threading |
| Escalation | Manual checks | Automatic via escalation rules | No missed timeouts |
| Archive | Never | Automatic after 7 days | Keeps active log lean |
| Message types | Limited | 8 types (directive, report, ack, heartbeat, event, escalation, query, response) | Richer communication |

## Migration Steps

### Phase 1: Create v3 Structure ✅ DONE
- Created `ψ/messages/` directory tree (inbox for 14 oracles, outbox, archive, broadcast)
- Created routing config: `oracle-roster.json` (all 14 oracles)
- Created escalation rules: `escalation-rules.json` (timeouts, retry logic)
- Created utility functions: `oracle-protocol-v3-functions.sh`

### Phase 2: Migrate Existing Messages (NOW)

**Source**: `ψ/fleet/BROADCAST-LOG.ndjson` (v2 format)  
**Target**: 
- `ψ/messages/inbox/{oracle}/*.json` (per-oracle inbox)
- `ψ/messages/broadcast/BROADCAST-LOG.ndjson` (v3 format)

**Migration script**:
```bash
# Load v3 functions
source ψ/messages/oracle-protocol-v3-functions.sh

# Migrate each v2 message to v3
cat ψ/fleet/BROADCAST-LOG.ndjson | while read line; do
  if [ -z "$line" ]; then continue; fi

  # Extract fields from v2
  from=$(echo "$line" | jq -r '.from // .oracle')
  to=$(echo "$line" | jq -r '.to // "Zeus"')
  type=$(echo "$line" | jq -r '.message_type')
  subject=$(echo "$line" | jq -r '.subject')
  content=$(echo "$line" | jq -r '.content')
  project=$(echo "$line" | jq -r '.project // ""')
  proof=$(echo "$line" | jq -r '.proof // ""')
  
  # Emit as v3 message (creates inbox file + broadcast log entry)
  oracle_emit_v3 "$from" "$to" "$type" "$subject" "$content" "normal" "$project" "" "$proof"
done

echo "✅ Migration complete: all v2 messages now in v3 format"
```

### Phase 3: Initialize All Oracles (NOW)
Create index files for each of 14 oracles:

```bash
for oracle in teleos luxi stratum agis dheva omega lens verity warden khun-ram aris all; do
  mkdir -p "ψ/messages/inbox/$oracle"
  cat > "ψ/messages/inbox/$oracle/index.json" <<EOF
{
  "oracle": "$oracle",
  "created": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "message_count": 0,
  "last_updated": null
}
EOF
done
```

### Phase 4: Update CLAUDE.md (NOW)
Replace v2 protocol docs with v3 in CLAUDE.md:
- Remove old BROADCAST-PROTOCOL-v2.md reference
- Add new ORACLE-PROTOCOL-v3-SPEC.md reference
- Document all 14 oracles in fleet roster
- Document escalation system
- Document per-oracle routing

### Phase 5: Retire v2 Structure (AFTER VERIFICATION)
Once v3 is running for 24 hours without issues:
- Archive old `ψ/fleet/BROADCAST-LOG.ndjson` to `ψ/messages/archive/`
- Keep as reference, don't delete
- Update git: `git mv ψ/fleet/BROADCAST-LOG.ndjson → ψ/messages/archive/BROADCAST-LOG-v2-legacy.ndjson`

## Current State

**v2 log location**: `ψ/fleet/BROADCAST-LOG.ndjson` (30+ messages)

**v2 oracle status**:
- ✅ Teleos: 10 messages (DIRECTIVE, ACK, REPORT)
- ✅ Luxi: 8 messages (DIRECTIVE, ACK, REPORT)
- 🔄 Other 12 oracles: Not yet active

**Expected v3 count after migration**: 30+ messages + new ones from all 14 oracles

## Verification Checklist

After migration:
- [ ] All 30+ v2 messages appear in v3 broadcast log
- [ ] Each message has correct oracle in inbox/
- [ ] oracle_check_directives "teleos" shows pending directives
- [ ] oracle_check_directives "luxi" shows pending directives
- [ ] oracle_health_check passes
- [ ] Monitoring loop works with v3 queries

## Rollback Plan

If issues found during v3 migration:
1. Keep v2 log intact in `ψ/fleet/`
2. Remove v3 messages: `rm -rf ψ/messages/inbox/*/` (but keep structure)
3. Revert CLAUDE.md changes: `git checkout CLAUDE.md`
4. Investigate issue, then re-run migration

## Timeline

- **Migration**: 5 minutes (automated script)
- **Verification**: 10 minutes
- **All 14 oracles active**: ~4 hours (as each awakens and receives first directive)
- **Stabilization**: 24 hours

---

**Status**: Ready to proceed  
**Authority**: User direction (Option C full rebuild)  
**Next**: Run migration script and verify
