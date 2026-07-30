---
pattern: "Read intent signals in commits before acting on structural patterns — 'by human's decision' means deliberate"
date: 2026-06-02
source: rrr: zeus-oracle
concepts: ["fleet-ops", "oracle-identity", "tmux", "birth-gate", "execution-rule"]
---

# Fleet Ops Lessons — 2026-06-02

## 1. Read intent before acting on structure
Commit messages contain decision context. "Merged: 2026-05-31 (by พี่เอก's decision)" means deliberate human choice. Reading structural patterns (Zeus in ธาม's CLAUDE.md → "duplicate") without reading the intent embedded in content leads to incorrect reversals.

**Rule**: when reverting a change that involves identity or merges, read the commit message body and date before acting.

## 2. Pane content beats pane metadata
`pane_current_command = bash` doesn't tell you what oracle is running in that pane. Always capture 3-5 lines of pane content before labeling or acting on a pane.

## 3. tmux send: send → check → flush
Shell running in pane locks readline. Fix is mechanical: send message with Enter, check if received (capture-pane), flush with empty Enter if still at prompt. No waiting for shells to finish. No explaining the lock mechanism.

## 4. Oracle birth gate prevents ghost oracles
Aeimathes operated 2 days without git/ψ because there was no gate requiring INDEX entry before task assignment. fleet-health.sh + Birth Rule in INDEX closes this permanently.

## 5. Codex catches what Zeus misses
When Codex flagged "orry-serenity ถูกลบ" before deploying, it caught a wrong target that Zeus passed through. Codex memory is an independent check — trust it.
