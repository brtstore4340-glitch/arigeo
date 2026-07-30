---
pattern: Always verify which window the human's client actually renders (tmux list-clients) before any tmux mutation; never assume active window == viewed window
date: 2026-06-15
source: "rrr: mission-control"
concepts: [tmux, orchestration, fleet-ops, destructive-actions, verify-first]
---

# Verify the human's tmux view before mutating layout

When orchestrating a multi-session tmux fleet, the "active window" of a session is NOT
necessarily the window the human's terminal is displaying. Before any `kill-pane`,
`split-window`, `select-layout`, `break-pane`, or `switch-client`:

1. Run `tmux list-clients -F '#{client_tty} #{session_name}:#{window_name}'` — this is ground truth for what the human sees.
2. Only mutate panes in that window after confirming, or you will destroy the human's live view.

**Corollary — self-bounce detection:** if a message you `send-keys` to another agent
reappears as your *own* user input, you sent it to your own pane. Stop and map pane↔session
(via pane_id + capture-pane content) before relaying again.

**Corollary — ambiguous destructive ops:** "kill the others" on shared infra requires an
explicit confirmed target list, even under a YOLO/auto-mode standing order — killing in-flight
work (e.g. an oracle mid-task) contradicts the human's own prior requests.

Cost of skipping: this session caused repeated "panes disappeared" frustration by killing
monitor panes that were in the human's live view, mistaken for clutter from another session.
