# Agent Quick Reference - Prevent Overwrites

**TL;DR**: Always rebase before push. Use work locks. Check locks before editing.

---

## Before Each Edit

```bash
# 1. Check if anyone is working on this file
ls -la .work-locks/ | grep "your-file.ext"

# 2. If locked by another agent → WAIT (or ask them)
# 3. If locked by YOU → OK continue
# 4. If no lock → OK to proceed
```

## Before Each Push

```bash
# MANDATORY: Rebase on main first
git fetch origin main
git rebase origin/main

# If conflicts: Fix them, then rebase --continue
# If errors: STOP, don't push. Ask for help.
```

## Commit Message

```bash
git commit -m "type: description

Modified-by: your-agent-name
Files: file1.ext, file2.ext
Previous-commits: abc123 (if building on prior work)

Co-Authored-By: Your Agent <noreply@anthropic.com>"
```

## Create Work Lock

```bash
# Before starting work
cat > .work-locks/your-file.ext.lock << 'LOCK'
{
  "agent": "your-name",
  "file": "path/to/file.ext",
  "locked_at": "2026-07-20T10:00:00Z",
  "expires_at": "2026-07-20T12:00:00Z",
  "reason": "what you're doing"
}
LOCK

git add .work-locks/your-file.ext.lock
git commit -m "chore: Acquire work lock"
```

## Release Work Lock

```bash
# After you're done
rm .work-locks/your-file.ext.lock
git add -u .work-locks/
git commit -m "chore: Release work lock"
```

## If Overwrite Happened

```bash
# 1. Find lost commit
git reflog

# 2. Recover it
git cherry-pick <lost-commit-hash>

# 3. Commit with proper attribution
git commit --amend -m "fix: Restore overwritten changes
Modified-by: previous-agent-name"
```

---

## Rules

✅ DO:
- Rebase before push (MANDATORY)
- Check work locks (MANDATORY)  
- Add attribution (MANDATORY)
- Use locks for long work (2h+)
- Test locally first

❌ DON'T:
- Push without rebasing
- Force-push (--force forbidden)
- Overwrite other agents' work
- Edit locked files
- Delete other agent's locks

---

**Full documentation**: `.registry/AGENT-COORDINATION-PROTOCOL.md`

**Questions**: See protocol or ask Tham/Khun-Ram
