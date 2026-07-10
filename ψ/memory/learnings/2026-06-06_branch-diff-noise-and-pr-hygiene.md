---
pattern: On mixed cleanup+feature branches, use git show <hash> not git diff branch..HEAD
date: 2026-06-06
source: rrr: mission-control
concepts: [git, pr-hygiene, branch-workflow, recap-protocol]
---

# Lesson: Branch diff noise and PR shipping hygiene

## Rule 1 — git show beats branch diff on mixed branches

When a branch contains both cleanup (mass-delete) and feature commits, `git diff main...HEAD --stat` returns noise proportional to the cleanup. The signal is buried.

Preferred pattern:
1. `git log main..HEAD --oneline` — see all commits
2. Pick the feature commit hash
3. `git show <hash> --stat` — clean view of what the feature actually changed

## Rule 2 — Branch-with-no-PR is a ship waiting to happen

A feature branch that's committed and pushed but has no open PR is invisible to reviewers. It will sit there indefinitely. `/recap` surfaces this via `git log main..HEAD --oneline`. Run it every session start.

## Rule 3 — Commit body is not a substitute for reading the code

When writing a PR description, reading the commit body is a shortcut. It works when the author was thorough. It fails when they weren't. The code is always authoritative; the commit message is an intention. For critical features, `git show <hash>` the actual diff before drafting PR description.
