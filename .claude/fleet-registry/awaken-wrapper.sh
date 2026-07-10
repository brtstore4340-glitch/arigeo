#!/bin/bash
# /awaken Wrapper — Intercepts standard awaken to check fleet registry
# If called within a fleet project, routes to fleet-aware initialization
# Otherwise, falls back to standard /awaken behavior

FLEET_ROOT="/mnt/d/01 Main Work/Boots/Agentic AI/mission-control"
REGISTRY="${FLEET_ROOT}/.claude/fleet-registry/oracles.json"

# Check if we're in a fleet project
IS_FLEET_PROJECT=0
CURRENT_ORACLE=""

if [ -f "$REGISTRY" ]; then
  # Load fleet environment
  if [ -f "${FLEET_ROOT}/.claude/fleet-registry/fleet-init.sh" ]; then
    source "${FLEET_ROOT}/.claude/fleet-registry/fleet-init.sh"
  fi

  CURRENT_PROJECT=$(pwd)

  # Check if current directory matches an oracle's project_dir
  CURRENT_ORACLE=$(jq -r ".oracles[] | select(.project_dir == \"$CURRENT_PROJECT\") | .name" "$REGISTRY" 2>/dev/null | head -1)

  if [ -n "$CURRENT_ORACLE" ]; then
    IS_FLEET_PROJECT=1
  fi
fi

# Behavior based on fleet context
if [ "$IS_FLEET_PROJECT" -eq 1 ]; then
  echo "🌟 Fleet context detected: $CURRENT_ORACLE"
  echo "📚 Using fleet registry for initialization"
  echo ""

  # Delegate to /fleet-awaken if it exists
  if command -v /fleet-awaken &>/dev/null; then
    /fleet-awaken "$CURRENT_ORACLE" "$@"
  else
    echo "⚠️  /fleet-awaken not available, using standard /awaken"
    # Fall through to standard awaken
  fi
else
  # Not in fleet context, use standard behavior
  if [ -n "${1:-}" ]; then
    echo "📌 Standard /awaken (fleet registry not applicable here)"
  fi
fi

# Export flag for downstream processes
export AWAKEN_USED_FLEET_REGISTRY="$IS_FLEET_PROJECT"
