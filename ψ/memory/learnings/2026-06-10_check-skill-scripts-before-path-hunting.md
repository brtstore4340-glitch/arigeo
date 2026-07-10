---
pattern: Check the skill's own scripts/ directory before hunting for raw data paths
date: 2026-06-10
source: rrr: mission-control
concepts: ["oracle-family-scan", "skill-execution", "tool-at-hand", "path-resolution"]
---

# Check Skill Scripts Before Raw Path Hunting

When a skill has a `scripts/` subfolder, that folder already abstracts path resolution, API calls, and fallback logic. Reading it first saves 5+ minutes of manual path hunting.

**Observed pattern**: `/oracle-family-scan` has `scripts/fleet-scan.ts` which does everything via GitHub API. But I spent time searching for `oracles.json` at 4 different filesystem paths (`laris-co`, `Soul-Brews-Studio`, `ghq root`, `Code dir`) before discovering the abstraction existed.

**Rule**: Before searching for raw data files, run `ls <skill-dir>/scripts/` first. If a script covers the query, use it.

**Also applies to**: Any skill that requires external data (registry files, config, JSON databases). Check scripts before grep.
