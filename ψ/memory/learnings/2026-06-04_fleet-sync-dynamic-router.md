---
pattern: fetch-origin-first + git identity preset + research-then-implement same session = compounding fleet ops efficiency
date: 2026-06-04
source: rrr: mission-control
concepts: [fleet-ops, git-workflow, oracle-architecture, token-efficiency, dynamic-routing]
---

# Fleet Sync + Dynamic Task Router — 2026-06-04

## Key Lessons

### 1. Fetch-origin-first is non-negotiable in shared oracle repos
Before any commit/push cycle in an oracle repo that another session may have touched:
```bash
git fetch origin && git rebase origin/main
```
Skipping this caused rebase conflicts on aeimathes and lens requiring detached HEAD recovery.

### 2. Set global git identity once per fleet session
Oracle repos under E0XXXXXXXXX often lack `user.email` config.
Fix permanently: `git config --global user.email "ekkarat.mee@gmail.com"`
Or set at session start before any oracle work.

### 3. In Tham-Zeus merged topology, "send to Zeus" = "do it yourself or delegate to another oracle"
maw hey zeus-oracle queues to inbox when the pane IS this session.
Correct routing: wake a specialist oracle (Aeimathes) instead of trying to reach yourself.

### 4. Research → implement same session while context is hot
Aeimathes researched Dynamic Task Router at 01:09. Implementation started at 01:50, merged by 02:08.
The 79-minute research-to-ship cycle produced 260 lines of tested code.
Pattern: don't defer to "next session" when research findings are fresh.

### 5. Dynamic Task Router — complexity scoring for model tier selection
Base score = 3 (Sonnet). Signals: keywords (-2 to +3), instruction length, toolCount, crossAgent flag.
Tier: ≤2=haiku, 3-4=sonnet, ≥5=opus. Expected 60-80% token reduction on CRUD-heavy workloads.
Activate: set `ANTHROPIC_API_KEY` in ai-orchestrator/.env.
