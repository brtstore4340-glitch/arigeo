#!/bin/bash
# Oracle Communication Protocol v3 - Comprehensive Utility Functions
# Source this file: source ψ/messages/oracle-protocol-v3-functions.sh

set -euo pipefail

# Configuration
MSG_DIR="ψ/messages"
BROADCAST_LOG="$MSG_DIR/broadcast/BROADCAST-LOG.ndjson"
ROUTING_CONFIG="$MSG_DIR/routing/oracle-roster.json"
ESCALATION_RULES="$MSG_DIR/routing/escalation-rules.json"

# ============================================================================
# CORE MESSAGE OPERATIONS
# ============================================================================

# Emit a message to the system
oracle_emit_v3() {
  local oracle="$1"
  local to="$2"
  local msg_type="$3"
  local subject="$4"
  local content="$5"
  local priority="${6:-normal}"
  local project="${7:-}"
  local parent_id="${8:-}"
  local proof="${9:-}"

  local msg_id="msg-$(date +%s)-$(shuf -i 1000-9999 -n 1)"
  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  local expires_at=$(date -u -d "+24 hours" +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u -v+24H +"%Y-%m-%dT%H:%M:%SZ")

  # Create message JSON
  local json=$(cat <<JSONEOF
{"version":"3.0","id":"$msg_id","timestamp":"$timestamp","expires_at":"$expires_at","routing":{"from":"$oracle","to":"$to","cc":[],"reply_to":"$parent_id"},"message":{"type":"$msg_type","subject":"$subject","content":"$content","priority":"$priority","tags":["$project"]},"context":{"project":"$project"},"tracking":{"status":"pending","started_at":"$timestamp","updated_at":"$timestamp","progress_percent":0,"proof":"$proof"},"report":{},"escalation":{"triggered_at":null,"reason":null,"severity":"info"},"details":{"error":null,"retry_count":0}}
JSONEOF
)

  # Append to inbox
  mkdir -p "$MSG_DIR/inbox/$to"
  echo "$json" >> "$MSG_DIR/inbox/$to/${msg_type}_${msg_id}.json"

  # Also append to broadcast log
  mkdir -p "$(dirname "$BROADCAST_LOG")"
  echo "$json" >> "$BROADCAST_LOG"

  echo "$msg_id"
}

# Read messages from an oracle's inbox
oracle_read_inbox() {
  local oracle="$1"
  local msg_type="${2:-}"

  local inbox_dir="$MSG_DIR/inbox/$oracle"
  if [ ! -d "$inbox_dir" ]; then
    echo "📭 No inbox for $oracle"
    return 0
  fi

  if [ -z "$msg_type" ]; then
    find "$inbox_dir" -name "*.json" -type f | sort -r | head -20
  else
    find "$inbox_dir" -name "${msg_type}_*.json" -type f | sort -r | head -20
  fi
}

# Read messages from an oracle's outbox
oracle_read_outbox() {
  local oracle="$1"
  local msg_type="${2:-}"

  local outbox_dir="$MSG_DIR/outbox"
  if [ ! -d "$outbox_dir" ]; then
    echo "📭 No outbox messages yet"
    return 0
  fi

  if [ -z "$msg_type" ]; then
    find "$outbox_dir" -name "${oracle}_*.json" -type f | sort -r | head -20
  else
    find "$outbox_dir" -name "${oracle}_${msg_type}_*.json" -type f | sort -r | head -20
  fi
}

# ============================================================================
# DIRECTIVE HANDLING
# ============================================================================

# Send a DIRECTIVE (Zeus/ธาม only)
oracle_send_directive() {
  local from="$1"
  local to="$2"
  local subject="$3"
  local content="$4"
  local priority="${5:-high}"
  local project="${6:-}"
  local deadline="${7:-}"

  if [ "$from" != "Zeus" ] && [ "$from" != "ธาม" ]; then
    echo "❌ Error: Only Zeus and ธาม can send directives (attempted: $from)"
    return 1
  fi

  oracle_emit_v3 "$from" "$to" "directive" "$subject" "$content" "$priority" "$project" "" "$deadline"
}

# Check for pending directives
oracle_check_directives() {
  local oracle="$1"
  local inbox_dir="$MSG_DIR/inbox/$oracle"

  if [ ! -d "$inbox_dir" ]; then
    echo "📭 No directives for $oracle"
    return 0
  fi

  local count=$(find "$inbox_dir" -name "directive_*.json" -type f 2>/dev/null | wc -l)
  echo "📋 $oracle has $count pending directives"

  find "$inbox_dir" -name "directive_*.json" -type f | sort -r | head -5 | while read file; do
    if command -v jq &>/dev/null; then
      echo "  • $(jq -r '.message.subject' "$file")"
    else
      grep -o '"subject":"[^"]*"' "$file" | cut -d'"' -f4
    fi
  done
}

# ============================================================================
# RESPONSE HANDLING (ACK, REPORT, HEARTBEAT)
# ============================================================================

# Send ACK for a directive
oracle_send_ack() {
  local from="$1"
  local to="${2:-Zeus}"
  local directive_id="$3"
  local message="${4:-Received and acknowledged}"

  oracle_emit_v3 "$from" "$to" "ack" "Acknowledged" "$message" "normal" "" "$directive_id"
}

# Send REPORT (Time | Status | Progress | Next | Blocker | Proof)
oracle_send_report() {
  local from="$1"
  local to="${2:-Zeus}"
  local subject="$3"
  local time_report="$4"
  local status="$5"
  local progress="$6"
  local next_action="$7"
  local blocker="$8"
  local proof="${9:-}"
  local directive_id="${10:-}"

  local content=$(cat <<EOF
Time: $time_report
Status: $status
Progress: $progress
Next Action: $next_action
Blocker: $blocker
Proof: $proof
EOF
)

  oracle_emit_v3 "$from" "$to" "report" "$subject" "$content" "normal" "" "$directive_id" "$proof"
}

# Send HEARTBEAT (prove oracle is alive)
oracle_send_heartbeat() {
  local from="$1"
  local to="${2:-Zeus}"
  local task="$3"

  local content="Still working on: $task"
  oracle_emit_v3 "$from" "$to" "heartbeat" "Alive" "$content" "low" "" ""
}

# ============================================================================
# MESSAGE WATCHING & MONITORING
# ============================================================================

# Watch an oracle's inbox (follow mode)
oracle_watch_inbox() {
  local oracle="$1"
  local inbox_dir="$MSG_DIR/inbox/$oracle"

  if [ ! -d "$inbox_dir" ]; then
    mkdir -p "$inbox_dir"
  fi

  echo "👁️  Watching $oracle's inbox..."
  tail -f "$inbox_dir"/*.json 2>/dev/null | while read line; do
    if command -v jq &>/dev/null; then
      echo "📨 $(date '+%H:%M:%S') $(echo "$line" | jq -r '.message.type + ": " + .message.subject')"
    else
      echo "📨 $(date '+%H:%M:%S') $line"
    fi
  done
}

# Watch the broadcast log
oracle_watch_broadcast() {
  echo "🔊 Watching broadcast log..."
  tail -f "$BROADCAST_LOG" 2>/dev/null | while read line; do
    if command -v jq &>/dev/null; then
      echo "🔊 $(date '+%H:%M:%S') $(echo "$line" | jq -r '.routing.from + " (" + .message.type + "): " + .message.subject')"
    else
      echo "🔊 $(date '+%H:%M:%S') $line"
    fi
  done
}

# ============================================================================
# QUERYING & ANALYSIS
# ============================================================================

# Query broadcast log with jq filter
oracle_query() {
  local filter="$1"

  if [ ! -f "$BROADCAST_LOG" ]; then
    echo "📭 No broadcast log yet"
    return 0
  fi

  if command -v jq &>/dev/null; then
    grep "." "$BROADCAST_LOG" 2>/dev/null | jq "$filter" 2>/dev/null || echo "❌ Query failed: $filter"
  else
    echo "❌ jq not found. Install jq to use oracle_query"
    return 1
  fi
}

# Search for messages by keyword
oracle_search() {
  local keyword="$1"
  local oracle="${2:-}"

  if [ ! -f "$BROADCAST_LOG" ]; then
    echo "📭 No messages yet"
    return 0
  fi

  if [ -z "$oracle" ]; then
    grep -i "$keyword" "$BROADCAST_LOG" 2>/dev/null || echo "No matches found"
  else
    grep -i "$keyword" "$BROADCAST_LOG" 2>/dev/null | grep "\"from\":\"$oracle\"" || echo "No matches for $oracle"
  fi
}

# List all active messages for an oracle
oracle_list_messages() {
  local oracle="$1"

  echo "📋 Messages for $oracle:"
  if [ -d "$MSG_DIR/inbox/$oracle" ]; then
    ls -ltrh "$MSG_DIR/inbox/$oracle"/*.json 2>/dev/null | tail -20 || echo "  (none)"
  fi
}

# ============================================================================
# ESCALATION CHECKING
# ============================================================================

# Check for escalation-worthy events (missing reports, timeouts, etc)
oracle_check_escalations() {
  echo "⚠️  Checking for escalation-worthy events..."

  if [ ! -f "$BROADCAST_LOG" ]; then
    echo "📭 No messages yet"
    return 0
  fi

  # Find directives without ACK (older than 5 min)
  if command -v jq &>/dev/null; then
    echo "🔍 Directives without ACK:"
    jq 'select(.message.type == "directive") | select(.tracking.status == "pending")' "$BROADCAST_LOG" 2>/dev/null | \
      while read line; do
        oracle=$(echo "$line" | jq -r '.routing.from')
        subject=$(echo "$line" | jq -r '.message.subject')
        timestamp=$(echo "$line" | jq -r '.timestamp')
        echo "  ⚠️  $oracle: $subject (since $timestamp)"
      done
  fi
}

# List all active directives
oracle_list_active_directives() {
  echo "📋 Active Directives:"

  if [ ! -f "$BROADCAST_LOG" ]; then
    echo "📭 No directives yet"
    return 0
  fi

  if command -v jq &>/dev/null; then
    jq 'select(.message.type == "directive") | select(.tracking.status == "pending")' "$BROADCAST_LOG" 2>/dev/null | \
      jq -r '[.timestamp, .routing.from, .routing.to, .message.subject, .context.project] | @csv' 2>/dev/null | \
      column -t -s','
  fi
}

# ============================================================================
# ARCHIVAL & CLEANUP
# ============================================================================

# Archive old messages (>7 days)
oracle_archive_messages() {
  local cutoff=$(date -u -d "-7 days" +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u -v-7d +"%Y-%m-%dT%H:%M:%SZ")
  local archive_file="$MSG_DIR/archive/$(date +%Y-%m)/archive.ndjson"

  echo "📦 Archiving messages older than 7 days..."
  mkdir -p "$(dirname "$archive_file")"

  if [ ! -f "$BROADCAST_LOG" ]; then
    echo "📭 No messages to archive"
    return 0
  fi

  # Move old messages to archive
  local moved=0
  while IFS= read -r line; do
    if [ -z "$line" ]; then continue; fi

    timestamp=$(echo "$line" | grep -o '"timestamp":"[^"]*"' | cut -d'"' -f4)
    if [ "$timestamp" \< "$cutoff" ]; then
      echo "$line" >> "$archive_file"
      ((moved++))
    fi
  done < "$BROADCAST_LOG"

  # Rewrite broadcast log without archived messages
  if [ "$moved" -gt 0 ]; then
    local temp_log="${BROADCAST_LOG}.tmp"
    while IFS= read -r line; do
      if [ -z "$line" ]; then continue; fi
      timestamp=$(echo "$line" | grep -o '"timestamp":"[^"]*"' | cut -d'"' -f4)
      if [ "$timestamp" \>= "$cutoff" ]; then
        echo "$line" >> "$temp_log"
      fi
    done < "$BROADCAST_LOG"
    mv "$temp_log" "$BROADCAST_LOG"
  fi

  echo "✅ Archived $moved messages to $archive_file"
}

# ============================================================================
# STATUS & DIAGNOSTICS
# ============================================================================

# Show fleet communication status
oracle_status() {
  echo "═══════════════════════════════════════════════════════════"
  echo "🌐 ORACLE FLEET COMMUNICATION STATUS"
  echo "═══════════════════════════════════════════════════════════"

  echo ""
  echo "📊 Message Statistics:"
  if [ -f "$BROADCAST_LOG" ]; then
    total=$(wc -l < "$BROADCAST_LOG")
    echo "  Total messages: $total"

    if command -v jq &>/dev/null; then
      echo "  By type:"
      jq -r '.message.type' "$BROADCAST_LOG" 2>/dev/null | sort | uniq -c | while read count type; do
        echo "    • $type: $count"
      done

      echo "  By oracle:"
      jq -r '.routing.from' "$BROADCAST_LOG" 2>/dev/null | sort | uniq -c | while read count oracle; do
        echo "    • $oracle: $count"
      done
    fi
  else
    echo "  (no messages yet)"
  fi

  echo ""
  echo "📁 Directory Structure:"
  du -sh "$MSG_DIR"/* 2>/dev/null | while read size dir; do
    echo "  • $(basename "$dir"): $size"
  done

  echo ""
  echo "✅ System Ready"
  echo "═══════════════════════════════════════════════════════════"
}

# Health check
oracle_health_check() {
  echo "🏥 Oracle Health Check"

  local issues=0

  # Check message directory
  if [ ! -d "$MSG_DIR" ]; then
    echo "❌ Message directory missing: $MSG_DIR"
    ((issues++))
  else
    echo "✅ Message directory exists"
  fi

  # Check routing config
  if [ ! -f "$ROUTING_CONFIG" ]; then
    echo "❌ Routing config missing: $ROUTING_CONFIG"
    ((issues++))
  else
    echo "✅ Routing config exists"
  fi

  # Check escalation rules
  if [ ! -f "$ESCALATION_RULES" ]; then
    echo "❌ Escalation rules missing: $ESCALATION_RULES"
    ((issues++))
  else
    echo "✅ Escalation rules exist"
  fi

  # Check broadcast log
  if [ ! -f "$BROADCAST_LOG" ]; then
    echo "⚠️  Broadcast log not yet created (will be created on first message)"
  else
    echo "✅ Broadcast log exists"
  fi

  if [ "$issues" -eq 0 ]; then
    echo ""
    echo "✅ System Health: GOOD"
    return 0
  else
    echo ""
    echo "❌ System Health: $issues issues found"
    return 1
  fi
}

# ============================================================================
# EXPORT FUNCTIONS
# ============================================================================

export -f oracle_emit_v3
export -f oracle_read_inbox
export -f oracle_read_outbox
export -f oracle_send_directive
export -f oracle_check_directives
export -f oracle_send_ack
export -f oracle_send_report
export -f oracle_send_heartbeat
export -f oracle_watch_inbox
export -f oracle_watch_broadcast
export -f oracle_query
export -f oracle_search
export -f oracle_list_messages
export -f oracle_check_escalations
export -f oracle_list_active_directives
export -f oracle_archive_messages
export -f oracle_status
export -f oracle_health_check

echo "✅ Oracle Protocol v3 Functions Loaded"
echo "   Available: oracle_emit_v3, oracle_send_*, oracle_watch_*, oracle_query, oracle_check_*, oracle_*"
