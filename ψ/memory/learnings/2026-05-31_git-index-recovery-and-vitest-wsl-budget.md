---
pattern: On WSL2 repos with slow vitest, check git log before implementing — task may already be committed; git index 0 bytes → git read-tree HEAD
date: 2026-05-31
source: rrr: mission-control
concepts: [git-recovery, vitest-wsl2, task-verification, session-startup]
---

# Git Index Recovery + Vitest WSL2 Budget

## Lesson 1: Check git log before reading task files

When arriving on a branch with a pending task contract, **run `git log --oneline -5` first**. If a commit matching the task description is present, enter verification mode immediately — don't re-read the full spec and start implementing.

Pattern: task contract says "implement X" → first thing is `git log` → if X is already committed, confirm the implementation matches, run tsc + vitest, report done. Saves 10-20 minutes of file reading.

## Lesson 2: Vitest WSL2 requires explicit time budget

Before running `npx vitest run` on this repo, allocate **10+ minutes**. The startup cost in WSL2 (vmThreads pool, react transform, setup files) is ~8-9 minutes for the full suite. This is known — the vitest.config.ts has a comment about avoiding vite-tsconfig-paths scandir overhead.

**Fast signal**: `tsc --noEmit` (seconds, meaningful for type errors)
**Slow signal**: `vitest run` (10+ minutes, only run once per session with full timeout)

Never retry with shorter timeouts — they will all fail and burn minutes.

## Lesson 3: Git index 0 bytes — recovery command

When `git ls-files` returns `fatal: .git/index: index file smaller than expected`:

```bash
git read-tree HEAD   # rebuilds index from last commit, non-destructive
```

Do NOT use `git reset --hard` (loses uncommitted working tree changes).
The rebuilt index reflects HEAD exactly — run `git diff HEAD` to see what's in the working tree vs the restored index.

This can happen when a previous git process (add, status) was interrupted while writing the lock file, leaving a 0-byte index. The lock file may already be cleaned up by the time you notice.
