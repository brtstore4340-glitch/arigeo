---
pattern: When recommending between a reversible and a harder-to-undo option for something with wide blast radius, default the recommendation toward the reversible option — the harder option is an escalation path, not the starting point
date: 2026-07-16
source: "rrr: zeus-oracle"
concepts: [decision-framing, ask-user-question, hooks, blast-radius, escalation]
---

# Recommend the reversible option first for wide-blast-radius decisions

## What happened

Asked to make an RTK protocol mandate "real" (apply to every agent type, no exceptions), two implementation paths existed: a hard technical block (`PreToolUse` hook on the `Agent` tool, gated on a session marker file) or a written mandate (explicit policy language in `CLAUDE.md`/protocol docs, relying on agents honoring it). Presented both via `AskUserQuestion` with the hard block labeled "(Recommended)" — technically the more complete enforcement, since a written rule can silently be skipped. The tradeoff (could block `/rrr`'s own background subagent, affects every agent spawn fleet-wide) was disclosed in the option description, but still framed as the default recommendation.

The user picked the hard block, work began (debug hook added, live schema verification via a real headless session), then the user explicitly cancelled mid-build and asked for the written mandate instead — the option that should have been offered as the default in the first place.

## The generalizable rule

- For any decision with wide blast radius (affects a whole fleet/system, hard to reverse if wrong, or not scoped to just the current task), default the "Recommended" framing toward the more reversible, lower-blast-radius option — even when a harder option is technically more complete or "correct" as enforcement.
- Frame the harder option explicitly as an escalation path: "start with X; if X doesn't hold after real use, revisit with Y" — rather than presenting both as equally-weighted starting points.
- Disclosing a tradeoff in an option's description is not the same as weighting the recommendation correctly. If the tradeoff is serious enough to mention, it's usually serious enough to change which option gets the "(Recommended)" label.
- This applies especially when the option affects infrastructure other agents/subagents depend on (e.g., a hook gating all `Agent` tool calls) — a mistake there doesn't just cost the current task, it can quietly break unrelated flows (like a skill's own background subagent) that aren't in view during the decision.
