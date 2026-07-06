---
pattern: Match /rrr mode to session weight — short no-code sessions use --quick, not default
date: 2026-06-06
source: rrr: mission-control
concepts: [rrr, session-ritual, proportionality, tooling]
---

# Match /rrr Mode to Session Weight

**Why:** Default /rrr spawns background agents and reads .jsonl timestamps — proportionate for 1–3 hour sessions with shipped code. On a 13-minute warmup session with no code changes, this overhead drove the retro past the context compaction boundary, requiring a full new context to finish.

**Rule:** Before invoking /rrr, ask two questions:
1. Was this session under 20 minutes?
2. Were any code files changed (not just config/memory)?

If both are no → use `/rrr --quick`. No subagents, no .jsonl mining, memory-based timeline, done in under 1 minute.

**How to apply:** This is a judgment call at /rrr invocation time. The session length and file diff are both available from git log + git diff --stat. Check both before choosing mode.

**Related:** [[feedback-rrr-overhead]], [[session-metrics]]
