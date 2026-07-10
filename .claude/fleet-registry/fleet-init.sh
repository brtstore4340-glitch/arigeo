#!/bin/bash
# Fleet Registry Initialization Script
# Source this in oracle initialization to use centralized registry
# Usage: source /path/to/fleet-init.sh

FLEET_ROOT="/mnt/d/01 Main Work/Boots/Agentic AI/mission-control"
FLEET_REGISTRY="${FLEET_ROOT}/.claude/fleet-registry"
FLEET_MEMORY_ROOT="${FLEET_REGISTRY}/memory"

# Export for all child processes
export ORACLE_FLEET_REGISTRY="${FLEET_REGISTRY}"
export ORACLE_FLEET_ROOT="${FLEET_ROOT}"
export ORACLE_FLEET_MEMORY_ROOT="${FLEET_MEMORY_ROOT}"

# Prevent scattered projects
export CLAUDE_PREVENT_ISOLATED_PROJECT_CREATION="1"

# Function to resolve oracle project directory
oracle_project_dir() {
  local oracle_name="$1"

  if [ -z "$oracle_name" ]; then
    echo "Error: oracle_project_dir requires oracle name" >&2
    return 1
  fi

  # Check if oracle exists in registry
  if [ -f "${FLEET_REGISTRY}/oracles.json" ]; then
    local project_dir=$(jq -r ".oracles[] | select(.name == \"$oracle_name\" or .thai_name == \"$oracle_name\") | .project_dir" "${FLEET_REGISTRY}/oracles.json" 2>/dev/null | head -1)

    if [ -n "$project_dir" ]; then
      echo "$project_dir"
      return 0
    fi
  fi

  # Fallback: use fleet root
  echo "${FLEET_ROOT}"
  return 0
}

# Function to resolve oracle memory directory
oracle_memory_dir() {
  local oracle_name="$1"

  if [ -z "$oracle_name" ]; then
    echo "Error: oracle_memory_dir requires oracle name" >&2
    return 1
  fi

  # Check if oracle exists in registry
  if [ -f "${FLEET_REGISTRY}/oracles.json" ]; then
    local memory_subdir=$(jq -r ".oracles[] | select(.name == \"$oracle_name\" or .thai_name == \"$oracle_name\") | .memory_subdir" "${FLEET_REGISTRY}/oracles.json" 2>/dev/null | head -1)

    if [ -n "$memory_subdir" ]; then
      mkdir -p "${FLEET_MEMORY_ROOT}/${memory_subdir}"
      echo "${FLEET_MEMORY_ROOT}/${memory_subdir}"
      return 0
    fi
  fi

  # Fallback: use oracle name in memory root
  mkdir -p "${FLEET_MEMORY_ROOT}/${oracle_name}"
  echo "${FLEET_MEMORY_ROOT}/${oracle_name}"
  return 0
}

# Verify fleet registry exists
if [ ! -f "${FLEET_REGISTRY}/oracles.json" ]; then
  echo "⚠️  Fleet registry not found at: ${FLEET_REGISTRY}/oracles.json" >&2
fi

# Create memory root if it doesn't exist
mkdir -p "${FLEET_MEMORY_ROOT}"

echo "✓ Fleet registry initialized"
echo "  Root: ${FLEET_ROOT}"
echo "  Memory: ${FLEET_MEMORY_ROOT}"
