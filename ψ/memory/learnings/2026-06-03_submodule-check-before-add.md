---
pattern: Always run git submodule status before git add on oracle directories — ?? inside a submodule ≠ plain untracked directory
date: 2026-06-03
source: rrr: mission-control
concepts: [git-submodules, commit-briefs, codex-rider, oracle-housekeeping]
---

# Submodule Check Before git add

## Rule

Before writing `git add <oracle-dir>` in any commit brief, run:

```bash
git submodule status <dir> 2>/dev/null | grep -q . && echo "SUBMODULE" || echo "PLAIN DIR"
```

If SUBMODULE: use `git add <dir>` (no slash) to update the pointer only.
If PLAIN DIR: use `git add <dir>/` to add all contents.

## The Failure Pattern

`git status --short` shows `?? aeimathes-oracle/reports/file.md` → interpreted as "plain untracked directory" → `git add aeimathes-oracle/` → removes mode 160000 submodule ref → adds files as regular tracked files.

The correct interpretation: `??` appearing INSIDE a submodule directory means the submodule has untracked content. The outer repo still tracks it as a submodule. `git status` with default `--ignore-submodules=none` shows the inner untracked files, not the submodule status.

## What to Do If Submodule

If the submodule has new content that needs committing:
1. `cd <oracle-dir> && git add . && git commit -m "..." && git push`
2. Back in mission-control: `git add <oracle-dir>` (updates pointer to new commit)
3. Commit the pointer update in mission-control

## Why This Matters

Accidentally converting a submodule to regular files:
- Loses the link to the submodule's own git history
- Makes future submodule sync commands fail
- Requires manual re-registration (`git submodule add ...`)

## See Also

`git submodule status` output format:
- `-abc1234 name` = not initialized
- ` abc1234 name` = clean, pointer at abc1234
- `+abc1234 name` = pointer changed (update pending)
- `Uabc1234 name` = merge conflict
