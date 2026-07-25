# Oracle Activation Guide - Protocol v3

**Purpose**: Step-by-step for each oracle to join the v3 communication system.  
**Scope**: All 14 oracles (Zeus, ธาม, Teleos, Luxi, Stratum, Agis, Dheva, Omega, Lens, Verity, Warden, Khun-Ram, Aris, All)

---

## Step 0: Prerequisites

Each oracle needs access to:
1. `ψ/messages/` directory (shared, read/write)
2. `oracle-protocol-v3-functions.sh` (load in every session)
3. Roster of all 14 oracles (in oracle-roster.json)

**Location**: `ψ/messages/` in the zeus-oracle project

---

## Activation Workflow (All Oracles)

### 1. Load Protocol Functions

Add to your oracle's session startup (`.tmux.conf`, shell profile, or session init):

```bash
#!/bin/bash
# Oracle Session Startup

# Navigate to zeus-oracle
cd /path/to/arra-oracle-v3/zeus-oracle

# Load v3 protocol functions
source ψ/messages/oracle-protocol-v3-functions.sh

# Verify health
oracle_health_check

echo "🌐 Oracle Protocol v3 Ready"
```

### 2. Join Fleet

Send an AWAKENING message to Zeus:

```bash
# Send activation message
oracle_emit_v3 "[YOUR-ORACLE-NAME]" "Zeus" "event" \
  "Oracle Awakened" \
  "I am [YOUR-ORACLE-NAME]. Joining the fleet." \
  "info" "" "" ""

echo "✅ Activation message sent to Zeus"
```

### 3. Wait for Directives

Check for incoming directives from Zeus or ธาม:

```bash
# Watch your inbox
oracle_check_directives "[YOUR-ORACLE-NAME]"

# Follow mode (continuous)
oracle_watch_inbox "[YOUR-ORACLE-NAME]"
```

### 4. Respond to Directives

When you receive a DIRECTIVE:

```bash
# 1. Send ACK immediately (within 5 min)
oracle_send_ack "[YOUR-ORACLE-NAME]" "Zeus" "[directive-msg-id]" \
  "Received and acknowledged"

# 2. Do the work

# 3. Send REPORT every 10 minutes
oracle_send_report "[YOUR-ORACLE-NAME]" "Zeus" "[Task Description]" \
  "$(date '+%H:%M GMT+7')" \
  "in-progress" \
  "Completed step 1 of 3" \
  "Starting step 2" \
  "None" \
  "[evidence-url]" \
  "[directive-msg-id]"

# 4. Send final REPORT when complete
oracle_send_report "[YOUR-ORACLE-NAME]" "Zeus" "[Task Description]" \
  "$(date '+%H:%M GMT+7')" \
  "complete" \
  "All steps completed" \
  "Ready for next directive" \
  "None" \
  "[final-proof-url]" \
  "[directive-msg-id]"
```

### 5. Send Heartbeat

Keep Zeus informed you're alive:

```bash
# Send heartbeat every 15 minutes
oracle_send_heartbeat "[YOUR-ORACLE-NAME]" "Zeus" \
  "Current task: [brief description]"
```

---

## Per-Oracle Activation Checklist

### ✅ Zeus (Root Orchestrator)
- [ ] Load protocol functions
- [ ] Read oracle-roster.json
- [ ] Create index: `mkdir -p ψ/messages/inbox/zeus`
- [ ] Status: **READY** (no activation needed — Zeus is the root)

### ✅ ธาม (Governor/Coordinator)
- [ ] Load protocol functions
- [ ] Create inbox: `mkdir -p ψ/messages/inbox/tham`
- [ ] Send activation: `oracle_emit_v3 "ธาม" "Zeus" "event" "Governor Activated" ...`
- [ ] Status: **READY** (direct report to Zeus)

### 🔄 Teleos (Deploy Oracle)
- [x] Load protocol functions ✅
- [x] Create inbox ✅
- [x] Already activated (running) ✅
- [ ] Next: Send report every 10 min on active deployments
- Status: **ACTIVE** (cms-arigeo deployment in progress)

### 🔄 Luxi (UI/UX Oracle)
- [x] Load protocol functions ✅
- [x] Create inbox ✅
- [x] Already activated (running) ✅
- [ ] Next: Send report every 10 min on captain-maid work
- Status: **ACTIVE** (captain-maid UX in progress)

### 🟡 Stratum (Architecture Oracle)
- [ ] Load protocol functions
- [ ] Create inbox: `mkdir -p ψ/messages/inbox/stratum`
- [ ] Send activation: `oracle_emit_v3 "Stratum" "ธาม" "event" "Architect Ready" ...`
- [ ] Check for directives: `oracle_check_directives "stratum"`
- Status: **READY TO ACTIVATE** (awaiting first directive)

### 🟡 Agis (Presence Guardian)
- [ ] Load protocol functions
- [ ] Create inbox: `mkdir -p ψ/messages/inbox/agis`
- [ ] Send activation: `oracle_emit_v3 "Agis" "ธาม" "event" "Presence Guardian Ready" ...`
- [ ] Check for directives: `oracle_check_directives "agis"`
- Status: **READY TO ACTIVATE** (awaiting first directive)

### 🟡 Dheva (Analytics Oracle)
- [ ] Load protocol functions
- [ ] Create inbox: `mkdir -p ψ/messages/inbox/dheva`
- [ ] Send activation: `oracle_emit_v3 "Dheva" "ธาม" "event" "Analytics Ready" ...`
- [ ] Status: **READY TO ACTIVATE**

### 🟡 Omega (Bridge Oracle)
- [ ] Load protocol functions
- [ ] Create inbox: `mkdir -p ψ/messages/inbox/omega`
- [ ] Send activation: `oracle_emit_v3 "Omega" "ธาม" "event" "Bridge Ready" ...`
- [ ] Status: **READY TO ACTIVATE**

### 🟡 Lens (Analysis Oracle)
- [ ] Load protocol functions
- [ ] Create inbox: `mkdir -p ψ/messages/inbox/lens`
- [ ] Send activation: `oracle_emit_v3 "Lens" "ธาม" "event" "Analysis Ready" ...`
- [ ] Status: **READY TO ACTIVATE**

### 🟡 Verity (Verification Oracle)
- [ ] Load protocol functions
- [ ] Create inbox: `mkdir -p ψ/messages/inbox/verity`
- [ ] Send activation: `oracle_emit_v3 "Verity" "ธาม" "event" "Verification Ready" ...`
- [ ] Status: **READY TO ACTIVATE**

### 🟡 Warden (Security Oracle)
- [ ] Load protocol functions
- [ ] Create inbox: `mkdir -p ψ/messages/inbox/warden`
- [ ] Send activation: `oracle_emit_v3 "Warden" "ธาม" "event" "Security Ready" ...`
- [ ] Status: **READY TO ACTIVATE**

### 🟡 Khun-Ram (Localization Oracle)
- [x] Load protocol functions ✅
- [x] Create inbox ✅
- [x] Already activated (learning capture) ✅
- [ ] Next: Send reports on learning documentation progress
- Status: **ACTIVE** (learning capture in progress)

### 🟡 Aris (QA Oracle)
- [ ] Load protocol functions
- [ ] Create inbox: `mkdir -p ψ/messages/inbox/aris`
- [ ] Send activation: `oracle_emit_v3 "Aris" "ธาม" "event" "QA Ready" ...`
- [ ] Status: **READY TO ACTIVATE**

### 🟡 All (Fleet Scribe)
- [ ] Load protocol functions
- [ ] Create inbox: `mkdir -p ψ/messages/inbox/all`
- [ ] Initialize broadcast log: `cat > ψ/messages/broadcast/.gitkeep`
- [ ] Status: **READY TO ACTIVATE** (collective memory logger)

---

## Quick Activation Script (All Oracles at Once)

```bash
#!/bin/bash
# Activate all 14 oracles

cd ψ/messages

# Create inboxes for all oracles
for oracle in zeus tham teleos luxi stratum agis dheva omega lens verity warden khun-ram aris all; do
  mkdir -p "inbox/$oracle"
  echo "✅ Created inbox for $oracle"
done

# Create outbox
mkdir -p outbox

# Initialize indexes
for oracle in zeus tham teleos luxi stratum agis dheva omega lens verity warden khun-ram aris all; do
  cat > "inbox/$oracle/index.json" <<EOF
{
  "oracle": "$oracle",
  "created": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "message_count": 0,
  "last_updated": null
}
EOF
done

echo ""
echo "✅ All 14 oracle inboxes initialized"
echo "📊 Ready for protocol v3 operation"
```

---

## Communication Patterns

### Pattern 1: Single Oracle Task
```bash
# Zeus sends directive to Teleos
oracle_send_directive "Zeus" "Teleos" "Deploy cms-arigeo" "..." "high"

# Teleos responds
oracle_send_ack "Teleos" "Zeus" "[msg-id]" "Starting deployment"
[work...]
oracle_send_report "Teleos" "Zeus" "..." "[report]" "[proof]" "[msg-id]"
```

### Pattern 2: Multi-Oracle Coordination
```bash
# Zeus sends directive to multiple oracles
for oracle in teleos luxi stratum; do
  oracle_send_directive "Zeus" "$oracle" "Build cms-arigeo Phase 2" "..." "high"
done

# Each sends ACK and REPORT independently
# Zeus monitors all via oracle_list_active_directives
```

### Pattern 3: Oracle-to-Oracle Communication
```bash
# Teleos asks Luxi for feedback (via query)
oracle_emit_v3 "Teleos" "Luxi" "query" "UX feedback on deploy form?" "..." "normal" "cms-arigeo"

# Luxi responds
oracle_emit_v3 "Luxi" "Teleos" "response" "Re: UX feedback" "..." "normal" "cms-arigeo"
```

---

## Verification Checklist

After activating all 14 oracles:

- [ ] `oracle_health_check` passes
- [ ] `oracle_status` shows all 14 oracles
- [ ] `oracle_list_active_directives` shows pending tasks
- [ ] Each oracle can `oracle_read_inbox`
- [ ] Escalation timeouts work (test with mock directive)
- [ ] Archive system creates monthly folders
- [ ] Broadcast log has entries from all 14 oracles

---

## Support

**For integration questions**: See `PROTOCOL-v3-QUICK-REFERENCE.md`  
**For full specification**: See `ORACLE-PROTOCOL-v3-SPEC.md`  
**For migration**: See `MIGRATION-v2-to-v3.md`

---

**Status**: Ready for all-oracle activation  
**Authority**: Zeus / Option C Full Rebuild  
**Timeline**: 14 oracles activated over next 4-6 hours as they receive first directive
