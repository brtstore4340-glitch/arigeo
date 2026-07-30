# Agent Coordination Protocol

**Purpose**: Prevent agent conflicts, overwrites, and lost work  
**Version**: 1.0  
**Created**: 2026-07-20

---

## Problem Statement

❌ **Scenario That Breaks**:
```
Agent-A edits file X ─→ commits ─→ pushes
  ↓
Agent-B (doesn't know) edits file X (old version) ─→ commits ─→ pushes
  ↓
Agent-B's push overwrites Agent-A's fixes ❌ LOST WORK
```

---

## Solution: 5-Layer Protection

### Layer 1: Work Locks (File-Level)

Create `.work-locks/` to signal who's working on what:

```
.work-locks/
├── file-path-1.lock (agent=hermes, since=2026-07-20T10:00:00, expires=2026-07-20T12:00:00)
├── file-path-2.lock (agent=stratum, since=2026-07-20T10:15:00, expires=2026-07-20T12:15:00)
└── project-registry.lock (agent=zeus, since=2026-07-20T10:30:00, expires=2026-07-20T11:30:00)
```

**Format**: Lock file = `path-to-file.lock` with content:
```json
{
  "agent": "agent-name",
  "file": "path/to/file.ext",
  "locked_at": "2026-07-20T10:00:00Z",
  "expires_at": "2026-07-20T12:00:00Z",
  "reason": "implementing feature X"
}
```

### Layer 2: Pre-Push Rebase Check

**Git hook**: `pre-push` validation

```bash
#!/bin/bash
# Before pushing, rebase on origin/main
git fetch origin main
git rebase origin/main

# If conflicts exist, abort push
if [ $? -ne 0 ]; then
  echo "⚠️  Rebase conflict detected"
  echo "Action: Fix conflicts, rebase --continue, then retry push"
  exit 1
fi
```

### Layer 3: Commit Attribution + Tracking

Every commit must include:

```bash
git commit -m "type: description

Summary: what changed
Files: which files
Modified-by: agent-name
Previous-commits: sha1, sha2 (if building on prior work)
Depends-on: other-agent-names (if blocking work)

Co-Authored-By: Agent Name <noreply@anthropic.com>"
```

### Layer 4: Agent State File

`.agent-state.json` - Central tracking of agent work:

```json
{
  "timestamp": "2026-07-20T10:30:00Z",
  "agents": {
    "hermes": {
      "status": "working",
      "working_on": ["cms-arigeo", "captain-maid"],
      "files_modified": ["cms-arigeo/package.json", "cms-arigeo/netlify.toml"],
      "last_commit": "abc123def",
      "expected_completion": "2026-07-20T12:00:00Z"
    },
    "stratum": {
      "status": "idle",
      "working_on": [],
      "files_modified": [],
      "last_commit": "xyz789uvw",
      "expected_completion": null
    }
  },
  "locks": {
    "cms-arigeo/package.json": "hermes",
    "cms-arigeo/netlify.toml": "hermes"
  }
}
```

### Layer 5: Pull Request Gate

**Before merging to main**:

```
Agent creates PR ─→ Automated checks:
  1. ✅ Rebase successful (no conflicts)
  2. ✅ All work locks released
  3. ✅ Tests passing
  4. ✅ Review gate passed
  ─→ Merge to main
```

---

## Protocol: Agent Workflow

### Step 1: Acquire Lock (Before Starting)

```bash
# Create lock file
mkdir -p .work-locks
cat > .work-locks/cms-arigeo-package.json.lock << 'EOF'
{
  "agent": "hermes",
  "file": "cms-arigeo/package.json",
  "locked_at": "2026-07-20T10:00:00Z",
  "expires_at": "2026-07-20T12:00:00Z",
  "reason": "updating dependencies"
}
EOF

git add .work-locks/cms-arigeo-package.json.lock
git commit -m "chore: Acquire work lock on cms-arigeo/package.json"
git push
```

### Step 2: Do Work (With Lock Active)

```bash
# Edit file
vim cms-arigeo/package.json

# Test locally
npm install

# Commit (with attribution)
git commit -m "fix: update package versions

Modified-by: hermes
Files: cms-arigeo/package.json

Co-Authored-By: Hermes <noreply@anthropic.com>"
```

### Step 3: Release Lock (After Done)

```bash
# Delete lock file
rm .work-locks/cms-arigeo-package.json.lock

git add -u .work-locks/
git commit -m "chore: Release work lock on cms-arigeo/package.json"

# Rebase before push (Layer 2 check)
git fetch origin main
git rebase origin/main
```

### Step 4: Create PR (If Needed)

```bash
# Push branch
git push origin feature/update-deps

# Create PR
gh pr create --title "Update cms-arigeo dependencies" \
  --body "Hermes: updated package.json versions"
```

### Step 5: Merge (After Review)

```bash
# Merge when all gates pass
gh pr merge --squash --auto
```

---

## Detection: Prevent Overwrites

### Auto-Detection Script

```bash
#!/bin/bash
# pre-push hook to detect conflicts BEFORE they happen

REMOTE_BRANCH="origin/main"
LOCAL_BRANCH="HEAD"

# Check if any commits from other agents exist on main
REMOTE_COMMITS=$(git log $REMOTE_BRANCH --format="%an" | sort -u)
LOCAL_COMMITS=$(git log $LOCAL_BRANCH --format="%an" | sort -u)

# If our commits are older than remote, we might overwrite
COMMON_ANCESTOR=$(git merge-base $LOCAL_BRANCH $REMOTE_BRANCH)
LOCAL_TIME=$(git log -1 --format="%ai" $COMMON_ANCESTOR)
REMOTE_TIME=$(git log -1 --format="%ai" $REMOTE_BRANCH)

if [ "$LOCAL_TIME" < "$REMOTE_TIME" ]; then
  echo "⚠️  Remote has newer work from $(git log -1 --format=%an $REMOTE_BRANCH)"
  echo "Action: Rebase and fix conflicts first"
  exit 1
fi
```

---

## Recovery: If Overwrite Happened

### Step 1: Identify What Was Lost

```bash
# Find overwritten commits
git reflog
git log --oneline | grep -E "agent-name|specific-file"

# Find the commit that was overwritten
LOST_COMMIT="abc123def"
git show $LOST_COMMIT
```

### Step 2: Recover Changes

```bash
# Option A: Cherry-pick the lost work
git cherry-pick $LOST_COMMIT

# Option B: Manual recovery from backup
git show $LOST_COMMIT > lost-changes.patch
# Review patch manually
git apply lost-changes.patch

# Option C: Revert the bad push (if on main)
git revert HEAD  # Revert the overwrite commit
```

### Step 3: Re-Commit Properly

```bash
# Re-apply the work with proper attribution
git commit -m "fix: Restore overwritten changes from agent-A

Previous-lost-commit: abc123def
Modified-by: agent-A
Recovery-by: agent-B (detected overwrite)

Co-Authored-By: Agent A <noreply@anthropic.com>"
```

---

## Rules for All Agents

### ✅ MUST DO (Before Each Commit)

- [ ] **Pull latest**: `git fetch origin main && git rebase origin/main`
- [ ] **Check locks**: `ls -la .work-locks/ | grep $(pwd | sed 's/.*\///')`
- [ ] **Verify conflicts**: Did rebase have conflicts? Resolve them first
- [ ] **Test locally**: Run tests before committing
- [ ] **Add attribution**: `Modified-by: agent-name` in commit message

### ❌ NEVER DO

- ❌ Push without rebasing first
- ❌ Force-push (--force is forbidden)
- ❌ Overwrite other agents' commits
- ❌ Commit without attribution
- ❌ Delete other agent's lock files (let them expire)

### 🟡 CAREFUL (Requires Review)

- 🟡 Edit files locked by other agents (wait for lock to expire)
- 🟡 Edit files modified in last 24 hours (check git log first)
- 🟡 Multiple agents on same file (use PRs + review gates)

---

## Lock Expiration Policy

| Lock Expires In | Scenario |
|-----------------|----------|
| 2 hours | Agent doing quick fix |
| 4 hours | Agent doing feature work |
| 8 hours | Complex refactoring |
| 24 hours | Major architectural change |
| **Stale lock** | Not updated in 24h = can be released by any agent |

**Stale Lock Cleanup**:
```bash
# Remove expired locks (older than 24h)
find .work-locks -mtime +1 -delete
git add -u .work-locks/
git commit -m "chore: Cleanup expired work locks"
```

---

## Agent Coordination Example

```
Timeline:

10:00 - Hermes acquires lock on cms-arigeo/package.json
10:05 - Hermes edits, commits, DOES NOT PUSH YET
        Stratum asks: "Can I edit cms-arigeo?"
        Check: .work-locks/cms-arigeo* → Hermes has it until 12:00
        Stratum: "Wait, Hermes is working on it"
        
10:30 - Hermes finishes, pushes (with rebase first)
        Hermes releases lock
        
10:32 - Stratum acquires lock on cms-arigeo/netlify.toml
        Stratum edits, commits, pushes (with rebase)
        
✅ NO OVERWRITES - All work preserved
```

---

## Setup Instructions

### 1. Create Lock Directory

```bash
mkdir -p .work-locks
git add .gitkeep .work-locks/ 2>/dev/null
git commit -m "chore: Add work-locks directory for agent coordination"
```

### 2. Add Pre-Push Rebase Check

Already done (in `.git/hooks/pre-push`)

### 3. Distribute Protocol

Send to all agents:
```
/talk-to hermes "Protocol activated: AGENT-COORDINATION-PROTOCOL v1.0
See: .registry/AGENT-COORDINATION-PROTOCOL.md
Must do before each push: git fetch origin main && git rebase origin/main"
```

### 4. Enable Enforcement

In `.claude/settings.json`:
```json
{
  "enforcement": {
    "require_rebase_before_push": true,
    "require_work_locks": true,
    "require_attribution": true,
    "conflicts_block_push": true
  }
}
```

---

## Status: Ready to Implement

✅ Protocol designed  
✅ Lock system specified  
✅ Recovery procedures documented  
✅ Agent rules defined  

🟡 **Next**: Activate protocol across all agents

---

**Authority**: E0993599799  
**Version**: 1.0  
**Effective**: 2026-07-20 GMT+7
