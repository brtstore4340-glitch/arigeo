---
pattern: Verify identity/topology and process-liveness before asserting; relay agent-menu choices as full text, not bare digits
date: 2026-06-16
source: "rrr: mission-control"
concepts: [orchestration, tmux, verification, maw, delegation]
---

# Verify ground truth before asserting; relay menus as text

Three orchestration lessons from the mission-control CI-saga session:

1. **Identity/location is a claim, not a given.** I told the user I was "a background run separate from the attached pane" — wrong; I was the attached pane (%6 in `10-zeus`). Run `tmux list-clients` + capture the pane before asserting which session you are.

2. **Relay menu choices as full text.** Sending a bare `3` via `maw send` to another agent's option picker registered as option 1. Always send a full instruction naming the option; number-key selection does not survive send-keys reliably.

3. **Liveness greps match themselves.** `pgrep -af | grep "jobs/<id>"` matched its own command line → false "live process". Exclude own PID / read `/proc/<pid>/cmdline`.

Meta: this is the recurring "act before verifying ground truth" pattern — adopt a hard verify gate before any state assertion (identity, liveness, file existence).
