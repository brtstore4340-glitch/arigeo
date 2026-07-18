#!/bin/bash
# Oracle Broadcast Protocol v2 - Utility Functions
# Source this file in oracle sessions: source ψ/fleet/oracle-broadcast-functions.sh

BROADCAST_LOG="ψ/fleet/BROADCAST-LOG.ndjson"

# Emit a message to the broadcast log
emit_message() {
  local message_type="$1"    # directive|report|ack|heartbeat|event|escalation
  local from="$2"             # Oracle name
  local to="$3"               # Oracle name or Zeus
  local subject="$4"          # Message subject
  local content="$5"          # Message content
  local severity="${6:-info}" # info|warn|critical
  local project="${7:-}"      # Project name (optional)
  local parent_id="${8:-}"    # Parent message ID (optional)
  local proof="${9:-}"        # Proof/evidence URL (optional)

  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  local message_id="msg-$(date +%s)-$(shuf -i 1000-9999 -n 1)"
  local expires_at=$(date -u -d "+24 hours" +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u -v+24H +"%Y-%m-%dT%H:%M:%SZ")

  local json=$(cat <<JSONEOF
{"timestamp":"$timestamp","oracle":"$from","message_type":"$message_type","message_id":"$message_id","from":"$from","to":"$to","project":"$project","subject":"$subject","content":"$content","status":"pending","severity":"$severity","tags":[],"parent_message_id":"$parent_id","proof":"$proof","expires_at":"$expires_at","details":{}}
JSONEOF
)

  mkdir -p "$(dirname "$BROADCAST_LOG")"
  echo "$json" >> "$BROADCAST_LOG"
  echo "$message_id"
}

# Read messages for an oracle
read_messages() {
  local oracle="$1"
  local message_type="${2:-}"  # optional filter

  if [ -z "$message_type" ]; then
    grep "\"to\":\"$oracle\"" "$BROADCAST_LOG" 2>/dev/null || echo "No messages found"
  else
    grep "\"to\":\"$oracle\"" "$BROADCAST_LOG" 2>/dev/null | grep "\"message_type\":\"$message_type\"" || echo "No $message_type messages found"
  fi
}

# Check for new directives
check_directives() {
  local oracle="$1"
  read_messages "$oracle" "directive" | tail -5
}

# Send an ACK for a directive
send_ack() {
  local from="$1"
  local to="$2"
  local directive_id="$3"
  local message="$4"

  emit_message "ack" "$from" "$to" "Acknowledged" "$message" "info" "" "$directive_id"
}

# Send a report
send_report() {
  local from="$1"
  local to="$2"
  local subject="$3"
  local content="$4"
  local directive_id="${5:-}"
  local proof="${6:-}"

  emit_message "report" "$from" "$to" "$subject" "$content" "info" "" "$directive_id" "$proof"
}

# Send a heartbeat
send_heartbeat() {
  local from="$1"
  local to="$2"
  local task="$3"

  emit_message "heartbeat" "$from" "$to" "Alive" "Still working on: $task" "info"
}

# Watch for new messages (follow mode)
watch_messages() {
  local oracle="$1"

  if command -v tail &> /dev/null; then
    echo "Watching for messages to $oracle..."
    tail -f "$BROADCAST_LOG" | grep "\"to\":\"$oracle\"" | while read line; do
      echo "📨 $(date '+%H:%M:%S') $line"
    done
  else
    echo "Error: tail command not found"
    return 1
  fi
}

# Query messages with jq
query_messages() {
  local filter="$1"

  if command -v jq &> /dev/null; then
    grep "." "$BROADCAST_LOG" 2>/dev/null | jq "$filter"
  else
    echo "Error: jq not found. Install jq to use query_messages"
    return 1
  fi
}

# List all messages for an oracle (pretty print)
list_messages() {
  local oracle="$1"

  if command -v jq &> /dev/null; then
    grep "\"to\":\"$oracle\"" "$BROADCAST_LOG" 2>/dev/null | jq -r '[.timestamp, .message_type, .from, .subject] | @csv' | column -t -s',' || echo "No messages found"
  else
    echo "Messages for $oracle:"
    grep "\"to\":\"$oracle\"" "$BROADCAST_LOG" 2>/dev/null | head -20
  fi
}

# Export functions
export -f emit_message
export -f read_messages
export -f check_directives
export -f send_ack
export -f send_report
export -f send_heartbeat
export -f watch_messages
export -f query_messages
export -f list_messages

echo "✅ Oracle Broadcast Functions loaded"
echo "   Available: emit_message, read_messages, check_directives, send_report, send_heartbeat, watch_messages"
