---
pattern: A shell rc that cd's on startup overrides tmux -c and wake-tool start-dirs — boot agents with `cd <repo> && <cmd>` after shell init, not -c
date: 2026-06-16
source: "rrr: mission-control"
concepts: [tmux, bashrc, maw-wake, agent-spawn, cwd, reminder-scheduling, outbox-relay, skip-permissions]
---

# A startup-`cd` in shell rc silently breaks every agent-spawn cwd

**Context**: `maw wake aeimathes` and my own `tmux new-session -c <repo>` both kept landing in `/route/mission-control` instead of the target oracle repo — for three turns I hand-waved it as "a maw bug." Root cause: `~/.bashrc:120` runs `cd /route/mission-control` on every interactive shell, which executes *after* tmux applies `-c`, clobbering it.

**Rules (generalizable)**:
1. If a shell rc `cd`s on startup, `tmux new-session -c <dir>` and any wake tool's start-dir are overridden. To boot an agent in a specific repo, create the session then send `cd <repo> && <cmd>` *after* the shell settles — don't trust `-c`. Verify with `tmux display-message -p '#{pane_current_path}'` before launching.
2. When asked to "restart"/"rerun" a scheduled job, **read it first**. Time-only triggers with no date guard will re-fire stale, outward-facing messages (this script would have sent Wed/Thu reminders again today). Add date guards + a state file before relaunching anything that messages other agents.
3. An outbox note addressed `to: X` is a *label*, not delivery. To reach an agent, write into *their* inbox or push via `maw hey`. Never assume cross-agent auto-relay — build it explicitly.
4. Launching a spawned agent with `--dangerously-skip-permissions` is an authority grant. Name it before doing it, even under a standing YOLO/auto order.

**Verification habit**: `tmux capture-pane | tail` can show blank frames while a TUI boots — confirm a process exists with `pgrep -P <pane_pid>` and grep for non-empty lines rather than trusting an empty capture.
