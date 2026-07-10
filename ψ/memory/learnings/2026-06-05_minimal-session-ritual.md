---
pattern: Minimal ritual sessions (identity check + retro only) deserve concise retrospectives — truth over volume; JSONL path: list dirs first, encode second
date: 2026-06-05
source: rrr: mission-control
concepts: [rrr, session-hygiene, oracle-ritual, jsonl-path, retrospective]
---

# Minimal Session Ritual

## Lesson 1: Ritual sessions are valid — don't inflate them

When `/rrr` is called on a session containing only skill invocations (no feature work, no tests, no code), write concisely. The template's word minimums exist to prevent lazy retrospectives on substantive sessions — not to force inflation on ritual sessions. Write the truth at whatever length the truth requires.

## Lesson 2: JSONL path — list before encode

The `sed` encoding of `$ORACLE_ROOT` for the project dir lookup assumes a specific encoding rule that breaks on paths with spaces (e.g., `/mnt/d/01 Main Work/...`). Always run `ls $HOME/.claude/projects/` first, then match the actual directory name. One extra bash call prevents one failed lookup.

## Lesson 3: Timestamp miner is fast and worth it

The background timestamp miner returned in ~13 seconds with 3 real timestamps that confirmed my reconstruction. Even for trivial sessions, spawn it — zero cost, grounded timeline.
