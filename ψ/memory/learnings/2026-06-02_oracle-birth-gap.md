---
pattern: "Oracle operated 2 days without git/ψ — birth gate missing"
date: 2026-06-02
source: RCA after aeimathes gap
concepts: ["fleet-health", "oracle-birth", "gap-prevention"]
---

# RCA: Aeimathes Birth Gap

## What happened
Aeimathes was spawned to do research (2026-05-31) before being formally awakened.
GitHub repo existed but local directory had no `.git` or `ψ/`.
Oracle operated 2 days without memory system.

## Root cause
No gate requiring oracle to be awakened before being assigned work.
Zeus fleet INDEX not updated after spawn.

## Fix applied
- Aeimathes awakened: 2026-06-02
- Fleet INDEX updated with Birth Rule
- `scripts/fleet-health.sh` created for routine checks

## Rule going forward
Oracle must appear in `ψ/fleet/INDEX.md` before receiving tasks.
Zeus must update INDEX immediately after every awaken.

[[fleet-health-script]]
