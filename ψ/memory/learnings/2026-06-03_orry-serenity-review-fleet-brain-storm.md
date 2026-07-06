---
pattern: Wake all required Oracles in parallel at mission start; verify tool script paths before invoking skills; run quality checks as first step of any code review mission
date: 2026-06-03
source: rrr: mission-control (session 9a2b7918)
concepts: [fleet-coordination, code-review, quality-gates, git-hygiene, tmux, maw]
---

# Fleet Brain Storm — Code Review Coordination Lessons

## Context

Session: ORRY_SERENITY_DIFF_REVIEW_AND_CLEANUP — Zeus + Lens brain storm on `fix/erp-high-priority-3-fixes` (18 files, 263KB patch). Stop hook forced quality gate. PR #16 merged.

## Lessons

### 1. Wake all required Oracles in parallel at mission start

If a mission explicitly requires multiple Oracles (e.g., "Zeus + Lens brain storm"), wake both with `maw wake` calls in a single parallel step before sending any brief. Waking Lens late delayed the brain storm setup by ~5 minutes.

**Rule**: `maw wake zeus && maw wake lens` before first `tmux send-keys` brief.

### 2. Verify maw script path before calling skill

`maw.hey` depends on `.agents/scripts/hey.sh` relative to the mission-control project. If the file doesn't exist (e.g., after repo restructure), the skill fails silently with a path error. Always have `tmux send-keys -t "<session>" "..." Enter` as a fallback.

**Rule**: Check `.agents/scripts/hey.sh` exists before calling `/maw.hey`. Fallback: tmux direct.

### 3. Run quality checks as first step of code review mission

`tsc --noEmit` + `eslint .` should be step 1 of any code review, before sending diff to Oracle. This session wasted 3 stop-hook cycles because checks ran reactively instead of proactively.

**Rule**: Any `DIFF_REVIEW` mission → quality gate first, then Oracle brief.

### 4. Inspect git staging before committing

Other Oracles (Zeus) may stage files asynchronously. Running `git commit` without first checking `git status` can produce combined commits that mix multiple logical batch groups. Always `git status` before `git commit`.

**Rule**: `git status` → review staged set → then `git commit`.

### 5. Trim Oracle briefs for context efficiency

Zeus reached 82% context after a single session. Verbose multi-paragraph briefs consume context budget before actual work starts. Prefer structured bullet briefs under ~30 lines.

**Rule**: Oracle brief ≤30 lines. Use file paths + task bullets — no prose explanation.
