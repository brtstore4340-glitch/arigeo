---
pattern: Async Stop hooks run independently — disable ≠ drain; always pgrep+wait before touching shared resources
date: 2026-06-06
source: rrr: mission-control
concepts: [tmux, hooks, async, race-condition, claude-code]
---

# Async Hook Drain Pattern

When disabling a Claude Code Stop hook (`"Stop": []`) during an active session, any hook invocations that have **already fired** continue running as independent background processes until completion. Disabling the hook config only prevents *future* firings.

## The Race Condition

```
Session ends → hook fires (async: true) → hook process starts (pid=XXXX)
           → you disable "Stop": [] → (has no effect on pid=XXXX)
           → you clean up resources the hook uses
           → pid=XXXX accesses now-altered resources → crash / unintended destruction
```

## Safe Maintenance Order

1. Fix the hook script (if broken)
2. Disable the hook in config (`"Stop": []`)
3. **Drain in-flight invocations**: `pgrep -f <hook-script-name>` — wait for 0 matches
   - Or: `pkill -f <hook-script-name>; sleep 1` (destructive but fast)
4. Then clean up shared resources (tmux windows, files, etc.)

## tmux kill-window Footgun

Any script that runs *inside* a tmux window and calls `tmux kill-window` **must** specify `-t session:window` explicitly. Without it, tmux kills the window it considers "current" which may not be the intended one — especially in multi-window sessions.

**Wrong**: `tmux kill-window`
**Right**: `tmux kill-window -t 'session-name:window-name'`

## Recovery

If a Zeus/Oracle session gets destroyed by a relay gone wrong:
```bash
maw wake zeus
```
Session is typically back in < 2 minutes.
