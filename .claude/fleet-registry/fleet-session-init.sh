#!/bin/bash
# Fleet Registry Session Initialization Hook
# Sourced at SessionStart — sets up environment for fleet operations

FLEET_ROOT="${FLEET_ROOT:-/mnt/d/01 Main Work/Boots/Agentic AI/mission-control}"
FLEET_REGISTRY="${FLEET_ROOT}/.claude/fleet-registry"

# Initialize fleet environment
if [ -f "${FLEET_REGISTRY}/fleet-init.sh" ]; then
  source "${FLEET_REGISTRY}/fleet-init.sh"
fi

# Detect current oracle (if running within a fleet project)
if [ -f "${FLEET_REGISTRY}/oracles.json" ]; then
  CURRENT_PROJECT_DIR=$(pwd)

  # Find which oracle we're in
  CURRENT_ORACLE=$(jq -r ".oracles[] | select(.project_dir == \"$CURRENT_PROJECT_DIR\") | .name" "${FLEET_REGISTRY}/oracles.json" 2>/dev/null | head -1)

  if [ -n "$CURRENT_ORACLE" ]; then
    export CURRENT_ORACLE="$CURRENT_ORACLE"
  fi
fi

# Export for all Claude Code sessions
export ORACLE_FLEET_ENABLED="1"
