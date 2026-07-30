#!/bin/bash
# Zeus Wake - Session Initialization for Oracle Fleet Command

set -e

ORACLE_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
MEMORY_DIR="$HOME/.claude/projects/$(echo "$ORACLE_ROOT" | sed 's|^/|-|; s|[/.]|-|g')/memory"

echo "⚡ Zeus Awakening..."
echo ""

# Load identity from CLAUDE.md
echo "## Identity"
grep -A 6 "^## Identity" "$ORACLE_ROOT/CLAUDE.md" 2>/dev/null || echo "(Identity not found)"
echo ""

# Load philosophy from CLAUDE.md
echo "## Philosophy"
grep -A 8 "^## The 5 Principles" "$ORACLE_ROOT/CLAUDE.md" 2>/dev/null || echo "(Philosophy not found)"
echo ""

# Load standing orders
echo "## Standing Orders"
grep -A 10 "^## Session Standing Orders" "$ORACLE_ROOT/CLAUDE.md" 2>/dev/null || echo "(Orders not found)"
echo ""

# Show memory status
if [ -d "$MEMORY_DIR" ]; then
  MEMORY_COUNT=$(find "$MEMORY_DIR" -name "*.md" -type f 2>/dev/null | wc -l)
  echo "## Fleet Memory"
  echo "📡 Memory files loaded: $MEMORY_COUNT"
  echo ""
fi

# Fleet status
echo "## Fleet Status"
echo "🔵 Ready for operations"
echo "Next: \`/recap\` to orient, or direct command"
echo ""
