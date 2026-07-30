---
name: escalation-verification-gap-pattern
description: Recurring decision error — trusting proxy signals instead of real verification
metadata:
  type: escalation
  ttl: 14d
  date: 2026-07-16
  source: session-metrics pattern-check
---

# Escalation: Recurring "Verification Gap" Pattern — 2026-07-16

**Timestamp**: 🕐 03:19 +07 (Thursday 16 July 2026)
**Session**: 24276afd · zeus-oracle
**Authority**: Zeus (Meta-Orchestrator)
**To**: พี่เอก / Ekkarat (Boss)
**Priority**: Raise, don't auto-fix — Principle 3 (External Brain, Not Command). Boss decides.

## What's recurring

Five of the last seven logged sessions (tracked in `ψ/memory/learnings/session-metrics.md`) show the same shape of error in the `error` column, across different repos and different kinds of task:

| Session | Date | Error |
|---|---|---|
| 6c9bd8a0 | 2026-06-19 | Overconfidence in proximity; copied a working pattern to a new context without checking it actually applied there |
| unknown | 2026-07-06 09:49 | Jumped to fix a submodule issue without first verifying data safety |
| de19627 | 2026-07-06 11:38 | Assumed "untrack" meant "delete" instead of confirming intent |
| unknown | 2026-07-07 19:06 | Misdiagnosed a Vercel build failure as a config problem three times, when the actual cause (wrong branch) was sitting in the build log the whole time |
| 24276afd | 2026-07-16 03:13 | Reported a Claude Code hook "confirmed working" based on manually running its script with a hand-set, non-existent environment variable — not the real hook-execution path |

This was already flagged once before, on 2026-06-20, after just 3 of 4 sessions showed it (`ψ/memory/learnings/session-metrics.md`, first "🔁 Recurring Pattern Detected" block). It has now recurred **two more times** since that flag, a month apart, in a different repo. Flagging it in the metrics file alone hasn't broken the cycle — that's the reason for this direct escalation instead of a third silent flag.

## The pattern, precisely

Not "making mistakes" in general — a specific failure mode: **declaring something verified based on a proxy signal (a manual simulation, a plausible-sounding assumption, a repeated diagnosis that felt right) instead of checking the actual target behavior.** In this session specifically: I told the user a session-start hook was "confirmed working" after manually exporting an environment variable myself and running the hook's script directly — which of course succeeded, because I supplied the variable. I never checked whether that variable was real. It wasn't. The user asking me to literally start a new session and check is what caught it.

## What already helped, this session

Once caught, the fix that worked was concrete and repeatable: stop trusting standalone simulations, and instead run the *real* invocation path (`claude -p --debug hooks`, actually restarting the affected service, actually watching live logs) before reporting success. Every subsequent claim in this session was checked this way and held up. That's a workable discipline — the open question is why it takes an in-session correction to reach for it, rather than it being the default first move.

## Ask

Not proposing an auto-fix — per Principle 3, this is Boss's call, not mine to resolve unilaterally. Options as I see them:
1. Standup discussion — name the pattern explicitly so it's visible fleet-wide, not just in one Oracle's memory file.
2. A standing rule in CLAUDE.md (this repo or fleet-wide): "verified" claims must cite the real invocation/behavior checked, not a proxy — make the discipline that worked this session the default instead of a recovery.
3. Something else — Boss knows the fleet's rhythm better than I do here.

No further action taken beyond this note and the direct flag already given in-session. 🇹🇭 ทุกคำมีหลักฐาน — this note is the evidence trail.
