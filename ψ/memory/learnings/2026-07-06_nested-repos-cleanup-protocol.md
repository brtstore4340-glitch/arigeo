---
pattern: Nested git repos require explicit detection before destructive operations
date: 2026-07-06
source: rrr: mission-control
concepts: [git, infrastructure, nested-repos, cleanup, safety]
---

# Nested Repos Cleanup Protocol

## Lesson

When a git repository contains multiple subrepositories with their own `.git` directories, standard cleanup operations (`git clean -fd`, `rm -rf`) will either timeout (if directories are large) or hit protection errors. Bulk operations are unsafe.

**Rule for future work**: Always enumerate nested repos first with `find . -maxdepth 2 -name .git -type d` before bulk cleanup. Then either:
1. Preserve them (if they're legitimate subprojects)
2. Remove them explicitly by name (safer than glob patterns)
3. Add them to `.gitignore` (if they're build artifacts)

## Context

In mission-control, `.claude/fleet-registry/memory/` contained 10+ nested oracle repos (aeimathes-oracle, codex-oracle, khun-ram-oracle, etc.). The first `git clean -fd` command:
- Protected all nested repos (expected behavior)
- Timed out after 2 minutes when trying to remove large directories
- Left orphaned worktree references that broke `git status` output

**Why this matters**: A single slow cleanup operation can block the entire workflow. Sequential single-directory removal is slower per-operation but more transparent and recoverable.

## Pattern to Reuse

```bash
# Step 1: Enumerate nested repos
find . -maxdepth 2 -name .git -type d | sed 's|/.git||' | sort > /tmp/nested-repos.txt

# Step 2: Identify safe targets (no .git)
for dir in */; do
  [ -f "$dir/.git" ] && continue
  [ -d "$dir/.git" ] && continue
  echo "$dir is safe to remove"
done

# Step 3: Remove safe targets one-by-one (with timeout)
rm -rf test-results/ tmux-*.log scripts/  # etc.

# Step 4: Verify git state
git status --ignore-submodules=all --short
```

## When NOT to Use Bulk Cleanup

- Repository contains >5 nested `.git` directories
- Directory sizes unknown (large monorepos, cloned node_modules, etc.)
- Git status is already failing (indicates corruption in submodules)

## When to Ask For Confirmation

If a user says "untrack files" or "clean up", confirm intent first:
- "Remove and delete?" (destructive)
- "Add to .gitignore?" (safe, non-destructive)
- "Archive to /tmp?" (recoverable)

A simple "Confirm before removing?" prevents accidental data loss.

## Related Patterns

- [[RTK-TOKEN-OPTIMIZATION.md]] — Resource management under constraints
- [[shell-rc-cd-overrides-spawn-cwd.md]] — Environment path safety
- [[canonical-source-before-asserting-absence.md]] — Check reality before claiming something is gone
