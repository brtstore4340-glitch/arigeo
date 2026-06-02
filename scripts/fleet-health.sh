#!/usr/bin/env bash
# fleet-health.sh — Zeus fleet health check
# Detects oracle dirs missing git, ψ/, or not in INDEX
# Run: bash zeus-oracle/scripts/fleet-health.sh

MC="/mnt/d/01 Main Work/Boots/Agentic AI/mission-control"
INDEX="$MC/zeus-oracle/ψ/fleet/INDEX.md"

ORACLES=(
  tham-oracle luxi-oracle teleos-oracle aris-oracle
  lens-oracle stratum-oracle verity-oracle warden-oracle
  all-oracle aeimathes-oracle
)

echo "⚡ Fleet Health — $(date '+%Y-%m-%d %H:%M')"
echo ""

ALL_OK=true

for dir in "${ORACLES[@]}"; do
  path="$MC/$dir"
  name=$(echo "$dir" | sed 's/-oracle//')
  issues=()

  [ ! -d "$path" ]           && issues+=("NO DIR")
  # .git can be a file (submodule) or directory (standalone)
  [ ! -e "$path/.git" ]      && issues+=("NO GIT")
  [ ! -d "$path/ψ" ]         && issues+=("NO ψ/")
  [ ! -f "$path/CLAUDE.md" ] && issues+=("NO CLAUDE.md")

  # Thai name aliases for INDEX lookup
  alias_name="$name"
  [ "$dir" = "tham-oracle" ] && alias_name="ธาม"
  [ "$dir" = "all-oracle" ]  && alias_name="all"
  grep -qi "$alias_name\|$dir" "$INDEX" 2>/dev/null || issues+=("NOT IN INDEX")

  if [ ${#issues[@]} -eq 0 ]; then
    branch=$(git -C "$path" branch --show-current 2>/dev/null)
    dirty=$(git -C "$path" status --porcelain 2>/dev/null | wc -l | tr -d ' ')
    [ "$branch" != "main" ] && issues+=("OFF MAIN: $branch")
    [ "$dirty" -gt 20 ]     && issues+=("DIRTY: $dirty files")
  fi

  if [ ${#issues[@]} -eq 0 ]; then
    echo "  ✅ $dir"
  else
    echo "  ⚠️  $dir — ${issues[*]}"
    ALL_OK=false
  fi
done

echo ""
$ALL_OK && echo "Fleet clean." || echo "Issues found — report to Zeus."
