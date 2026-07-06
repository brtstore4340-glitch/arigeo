---
pattern: Check existing MAW state before creating fleet config — maw oracle ls first, then create only what's missing
date: 2026-05-30
source: rrr: mission-control
concepts: [maw, fleet-registration, oracle-management, phase4]
---

# MAW Fleet Registration: Check Before Create

When registering new oracles in MAW fleet config (`~/.config/maw/fleet/*.json`), always run `maw oracle ls` first to identify what's already registered vs. what's missing.

## The Pattern

Creating a fleet config for an oracle that already has an active session causes MAW to show a duplicate "fleet-only (not cloned)" entry alongside the real one. Cleanup requires deleting the duplicate JSON — avoidable with one check upfront.

## The Dependency Chain

An oracle cannot be MAW-wired until it has:
1. GitHub repo created
2. `ghq get <org>/<repo>` — local clone in ghq root
3. Fleet config `~/.config/maw/fleet/<N>-<name>.json` written
4. `maw oracle scan` to update oracles.json cache

Local dirs in mission-control (subdirs, not submodules) are NOT sufficient for MAW registration.

## How to Apply

Before Gate 4.3 or any MAW fleet work:
```bash
maw oracle ls  # see current state
# identify: fleet+awake (skip), fleet (registered not running, skip), fs (local only, register), (none) = not known
```

Only create fleet configs for oracles in the `fs` or unknown state.
