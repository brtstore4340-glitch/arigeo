---
pattern: After context compaction, treat all session state as stale — verify pwd + branch + file-read-cache before acting
date: 2026-06-07
source: rrr: mission-control
concepts: [context-compaction, worktree, session-resume, tool-failures, defensive-first-step]
---

# Compaction Resets Session State — Always Verify Before Acting

## Rule

When resuming from a compacted session (or any session continuation), the **first action must be `pwd` + `git branch`**.

Three things silently invalidate on compaction:
1. **Worktree path** — the worktree may have been cleaned up; the session context doesn't know
2. **Write-tool read-cache** — the tool tracks which files were "read in this context window"; compaction resets this
3. **EnterWorktree state** — the tool thinks you're "already in a worktree session" even if that worktree was deleted

## Why

In session d58acc27, resuming after compaction on branch `feat+phm-v2-phase2` caused:
1. Write → "must read file first" (read-cache reset)
2. EnterWorktree → "already in worktree session" (stale worktree state)
3. Write again → "session isolated in worktree" (wrong path assumed)

All three failures resolved by a single `pwd` confirming the actual working directory.

## How to apply

- Session resume after compaction → run `pwd && git branch` before any file operation
- If pwd shows wrong path → use that actual path for all subsequent file reads/writes
- Never assume worktree context survived compaction — always verify
