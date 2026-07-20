#!/bin/bash
# MANDATORY: Agent Startup Checklist
# Run this before ANY work session

set -e

REPO_ROOT="$(git rev-parse --show-toplevel)"
AGENT_NAME="${1:-UnknownAgent}"

echo ""
echo "════════════════════════════════════════════════════════════"
echo "🚨 AGENT STARTUP CHECKLIST"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Agent: $AGENT_NAME"
echo "Repository: $REPO_ROOT"
echo "Date: $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo ""

# Check 1: Repository status
echo "✓ Check 1: Repository Status"
echo "  Verifying git repository..."
if git rev-parse --git-dir > /dev/null 2>&1; then
  echo "  ✅ Valid git repository"
else
  echo "  ❌ NOT a git repository - ABORT"
  exit 1
fi
echo ""

# Check 2: Required documents exist
echo "✓ Check 2: Required Documents"
DOCS=(
  "PROJECT-REGISTRY-INDEX.md"
  ".registry/AGENT-QUICK-REFERENCE.md"
  ".registry/AGENT-COORDINATION-PROTOCOL.md"
  "CLAUDE.md"
)

for doc in "${DOCS[@]}"; do
  if [ -f "$REPO_ROOT/$doc" ]; then
    echo "  ✅ $doc"
  else
    echo "  ❌ MISSING: $doc"
    exit 1
  fi
done
echo ""

# Check 3: Git hooks installed
echo "✓ Check 3: Git Hooks"
HOOKS=(
  ".git/hooks/pre-commit"
  ".git/hooks/pre-push"
)

for hook in "${HOOKS[@]}"; do
  if [ -x "$REPO_ROOT/$hook" ]; then
    echo "  ✅ $(basename $hook) installed"
  else
    echo "  ⚠️  $(basename $hook) not executable"
  fi
done
echo ""

# Check 4: Work locks directory
echo "✓ Check 4: Work Locks System"
if [ -d "$REPO_ROOT/.work-locks" ]; then
  LOCKS=$(ls "$REPO_ROOT/.work-locks"/*.lock 2>/dev/null | wc -l)
  echo "  ✅ .work-locks/ exists"
  echo "  📊 Active locks: $LOCKS"
  if [ $LOCKS -gt 0 ]; then
    echo "  ⚠️  Other agents have active locks:"
    ls -1 "$REPO_ROOT/.work-locks"/*.lock 2>/dev/null | sed 's/.*\//    - /'
  fi
else
  mkdir -p "$REPO_ROOT/.work-locks"
  echo "  ✅ .work-locks/ created"
fi
echo ""

# Check 5: Current branch
echo "✓ Check 5: Current Branch"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "  Current: $CURRENT_BRANCH"
if [ "$CURRENT_BRANCH" = "main" ]; then
  echo "  ⚠️  You're on main. For work, use feature branches"
else
  echo "  ✅ On branch: $CURRENT_BRANCH"
fi
echo ""

# Check 6: Uncommitted changes
echo "✓ Check 6: Working Directory"
if git diff-index --quiet HEAD --; then
  echo "  ✅ No uncommitted changes"
else
  echo "  ⚠️  Uncommitted changes detected:"
  git status -s | sed 's/^/    /'
fi
echo ""

# Mandatory reading confirmation
echo "════════════════════════════════════════════════════════════"
echo "📖 MANDATORY READING REQUIRED"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "You MUST read these documents BEFORE proceeding:"
echo ""
echo "1. PROJECT-REGISTRY-INDEX.md (2 minutes)"
echo "   Command: cat PROJECT-REGISTRY-INDEX.md"
echo "   Learn: All 8 projects, types, status"
echo ""
echo "2. .registry/AGENT-QUICK-REFERENCE.md (5 minutes)"
echo "   Command: cat .registry/AGENT-QUICK-REFERENCE.md"
echo "   Learn: Coordination protocol, locks, rebase rules"
echo ""
echo "3. CLAUDE.md - Agent Initialization Protocol section"
echo "   Command: grep -A 50 'MANDATORY: Agent Initialization' CLAUDE.md"
echo "   Learn: Pre-work requirements"
echo ""

# Interactive confirmation
echo "════════════════════════════════════════════════════════════"
echo "🔐 VERIFICATION"
echo "════════════════════════════════════════════════════════════"
echo ""

# Ask for confirmation
while true; do
  read -p "Have you read all required documents? (yes/no): " CONFIRM
  case $CONFIRM in
    yes|YES|y|Y)
      echo ""
      break
      ;;
    no|NO|n|N)
      echo ""
      echo "❌ Startup aborted. Please read the required documents first."
      exit 1
      ;;
    *)
      echo "Please answer yes or no"
      ;;
  esac
done

# Final checklist
echo "════════════════════════════════════════════════════════════"
echo "✅ FINAL CHECKLIST"
echo "════════════════════════════════════════════════════════════"
echo ""

CHECKLIST=(
  "I know the 8 projects in the fleet"
  "I know project types (commercial, system, hybrid)"
  "I know where PROJECT.md is for my target"
  "I know to check .work-locks/ before editing"
  "I know git rebase origin/main is MANDATORY before push"
  "I know to add Modified-by: in commit messages"
  "I understand the overwrite prevention system"
  "I have verified my current branch"
)

for item in "${CHECKLIST[@]}"; do
  read -p "[$AGENT_NAME] $item (yes/no): " ANSWER
  case $ANSWER in
    yes|YES|y|Y)
      echo "  ✅ Confirmed"
      ;;
    *)
      echo "  ❌ You must confirm ALL items before proceeding"
      exit 1
      ;;
  esac
done

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ STARTUP COMPLETE"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Agent $AGENT_NAME is ready to begin work."
echo ""
echo "Remember:"
echo "  1️⃣  Check .work-locks/ before editing"
echo "  2️⃣  git rebase origin/main before push (MANDATORY)"
echo "  3️⃣  Add Modified-by: to commit messages"
echo "  4️⃣  Ask permission before commit/push"
echo ""
echo "Start time: $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo ""
