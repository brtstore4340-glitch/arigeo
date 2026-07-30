---
pattern: Oracle must check "briefing or executing?" before every tool call — auto-mode does not override no-execute
date: 2026-06-03
source: rrr: mission-control
concepts: [oracle-discipline, delegation, tmux-patterns, git-wsl2, gh-api]
---

# Delegation Discipline + Codex-Rider Patterns

## Rule 1: PRE-EXECUTION CHECK at tool boundary

Before Bash/Edit/Write/git — ask "briefing or executing?". If executing → STOP, write brief, delegate to codex-rider. Auto-mode and YOLO-mode do NOT override this. "go ahead" from user = proceed with brief+delegate, not direct execute.

## Rule 2: Temp file pattern for codex-rider scripts

Never embed multiline Python/bash in `tmux send-keys`. Write to `/tmp/script.py`, then `python3 /tmp/script.py`. Inline heredocs break on quote boundaries guaranteed.

## Rule 3: Use `gh api` for PR creation in automation

`gh pr create` enters interactive mode or hangs on multiline `--body` via tmux. Use instead:
```bash
gh api repos/OWNER/REPO/pulls \
  -f title='...' -f head='branch' -f base='main' \
  -f body='...' --jq '.html_url'
```

## Rule 4: Kill shell git-status before git checkout on WSL2/NTFS

Shell prompt (starship/oh-my-posh) runs `git status --porcelain` constantly on D: drive, recreating index.lock. Fix:
```bash
pgrep -a "git status" | awk '{print $1}' | xargs kill 2>/dev/null
git checkout main   # immediately after
```

## Rule 5: Branch workflow — no direct pushes to main

Every fix/feat must use: `git checkout -b fix/<desc>` → commit → `git push origin fix/<desc>` → `gh api` PR → merge.
