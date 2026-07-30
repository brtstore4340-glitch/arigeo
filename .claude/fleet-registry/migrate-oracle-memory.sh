#!/bin/bash
# Migrate scattered oracle memories into fleet registry
# Usage: ./migrate-oracle-memory.sh [--dry-run] [--force]

set -euo pipefail

FLEET_ROOT="/mnt/d/01 Main Work/Boots/Agentic AI/mission-control"
REGISTRY="${FLEET_ROOT}/.claude/fleet-registry/oracles.json"
FLEET_MEMORY_ROOT="${FLEET_ROOT}/.claude/fleet-registry/memory"
OLD_PROJECTS_ROOT="${HOME}/.claude/projects"

DRY_RUN=0
FORCE=0

while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run) DRY_RUN=1; shift ;;
    --force) FORCE=1; shift ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

if [ "$DRY_RUN" -eq 1 ]; then
  echo "🔍 DRY RUN MODE — no changes will be made"
  echo ""
fi

# Step 1: Load oracle registry
if [ ! -f "$REGISTRY" ]; then
  echo "❌ Fleet registry not found: $REGISTRY"
  exit 1
fi

echo "📋 Fleet Registry: $REGISTRY"
echo "📂 Old Projects: $OLD_PROJECTS_ROOT"
echo "📂 Fleet Memory: $FLEET_MEMORY_ROOT"
echo ""

# Step 2: Scan for existing project directories
ENCODED_PATTERN="^-.*-$"  # Encoded paths start with '-'
MIGRATIONS=()

if [ -d "$OLD_PROJECTS_ROOT" ]; then
  echo "🔎 Scanning for oracle project directories..."

  for project_dir in "$OLD_PROJECTS_ROOT"/*; do
    if [ ! -d "$project_dir" ]; then
      continue
    fi

    dirname=$(basename "$project_dir")

    # Skip if not encoded format
    if ! [[ "$dirname" =~ $ENCODED_PATTERN ]]; then
      continue
    fi

    # Try to find which oracle this belongs to
    ORACLE_NAME=""
    for oracle in $(jq -r '.oracles[].name,.oracles[].thai_name' "$REGISTRY" 2>/dev/null); do
      # Simple heuristic: check if oracle name appears in project history
      if [ -f "$project_dir/.claude-session.jsonl" ]; then
        if grep -q "$oracle" "$project_dir/.claude-session.jsonl" 2>/dev/null | head -1; then
          ORACLE_NAME="$oracle"
          break
        fi
      fi
    done

    # If we found which oracle it is, add to migrations
    if [ -n "$ORACLE_NAME" ]; then
      MEMORY_SUBDIR=$(jq -r ".oracles[] | select(.name == \"$ORACLE_NAME\" or .thai_name == \"$ORACLE_NAME\") | .memory_subdir" "$REGISTRY" 2>/dev/null | head -1)

      if [ -n "$MEMORY_SUBDIR" ]; then
        MIGRATIONS+=("$project_dir:$MEMORY_SUBDIR:$ORACLE_NAME")
      fi
    fi
  done
fi

if [ ${#MIGRATIONS[@]} -eq 0 ]; then
  echo "✓ No scattered oracle memories found to migrate"
  exit 0
fi

echo "Found ${#MIGRATIONS[@]} oracle(s) to migrate:"
echo ""

# Step 3: Execute migrations
MIGRATED=0
SKIPPED=0

for migration in "${MIGRATIONS[@]}"; do
  IFS=':' read -r old_project memory_subdir oracle_name <<< "$migration"
  target_memory="${FLEET_MEMORY_ROOT}/${memory_subdir}"

  echo "→ $oracle_name"
  echo "  From: $old_project"
  echo "  To:   $target_memory"

  if [ "$DRY_RUN" -eq 1 ]; then
    echo "  [DRY RUN] Would copy memory files"
  else
    mkdir -p "$target_memory"

    # Copy memory files if source exists
    if [ -d "$old_project" ]; then
      # Copy session files, identity, and settings
      for file in .claude-session.jsonl CLAUDE.md identity.md settings.json; do
        if [ -f "$old_project/$file" ]; then
          cp "$old_project/$file" "$target_memory/" 2>/dev/null || true
          echo "  ✓ Copied $file"
        fi
      done

      # Archive old project if not force mode
      if [ "$FORCE" -eq 0 ]; then
        ARCHIVE="${old_project}.archive"
        if [ ! -d "$ARCHIVE" ]; then
          mv "$old_project" "$ARCHIVE"
          echo "  ✓ Archived old project to $ARCHIVE"
        fi
      else
        rm -rf "$old_project"
        echo "  ✓ Removed old project directory"
      fi

      MIGRATED=$((MIGRATED + 1))
    else
      echo "  ⚠ Source not found, skipping"
      SKIPPED=$((SKIPPED + 1))
    fi
  fi
  echo ""
done

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$DRY_RUN" -eq 1 ]; then
  echo "✓ DRY RUN COMPLETE"
  echo "Would migrate: $MIGRATED oracle(s)"
  echo "Would skip: $SKIPPED oracle(s)"
  echo ""
  echo "Run without --dry-run to apply:"
  echo "  $0"
else
  echo "✓ MIGRATION COMPLETE"
  echo "Migrated: $MIGRATED oracle(s)"
  echo "Skipped: $SKIPPED oracle(s)"
  echo ""
  echo "Old projects archived at: ~/.claude/projects/*.archive"
  echo "New memories at: $FLEET_MEMORY_ROOT/"
fi
