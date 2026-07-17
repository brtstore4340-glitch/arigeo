---
name: session-metrics
description: Oracle session tracking — token usage, friction patterns, decision errors across all sessions
metadata:
  type: reference
  ttl: ∞
  source: fleet-metrics
---

# Oracle Session Metrics

Rule: same friction 3 sessions → fix root cause, not another workaround.

| when | session | done | stuck | win | friction | error |
|---|---|---|---|---|---|---|
| 2026-06-02 11:44 | 94d36a81 | PR #48 merged, Aeimathes awakened, Luxi re-synced, fleet-health.sh, Execution Rule × 9 oracles, ธาม-Zeus restored | Dheva 166 dirty (deferred), Omega rule | fleet-health.sh + Birth Rule — oracle birth gap closed permanently | tmux flush pattern not applied automatically; pane mislabeled from metadata-only read | Reverted ธาม-Zeus identity without reading intent in commit — acted on structural pattern |
| 2026-06-19 01:13 | 6c9bd8a0 | dashboard stats fix, requests page stats API, production deploy | n/a | both pages now show correct status counts (9 reviewing) | none | overconfidence in proximity; copied requests page pattern without checking execution context (client vs server) |
| 2026-06-20 15:17 | 1fdc5e30 | Ledger decision (Path B) recorded & pushed | n/a | Phase 13b unblocked; Codex-01 has execution plan | Worktree isolation overhead; bg job .jsonl integration | Re-litigated Path A instead of executing decision |
| 2026-07-06 09:49 |  | Priorities 1-3 complete (restore Zeus identity, create ທາມ+Omega, document 8 extra oracles) | Priority 4 deferred (NTFS node_modules cleanup timeout) | All oracle identities restored/created; zero data loss; critical path shipped on time | NTFS mount perf on 1.5GB+ dirs; orphaned git worktree; bash script file persistence | Jumped to solve submodule issue without verifying data safety first; should have checked aeimathes-oracle data was preserved |
| 2026-07-06 11:35 | unknown | Audit P1-P3 committed, fleet registry created, learning docs saved, session metrics appended | n/a | Critical path finalization: ensured audit completion committed before attempting optimization (P4) | Session ID detection failed in background; bg job isolation requires worktree path access | n/a |
| 2026-07-06 11:38 | de19627 | workspace cleanup, 8 dirs removed, git recovery | n/a | Stable branch-registry-phase2 state after typechange fix | Large dir timeouts, broken worktrees, nested repos unplanned | Assumed 'untrack' meant delete instead of confirming intent |
| 2026-07-07 19:06 | unknown | 7 shipped (i18n fixes, blog/news section, color tokens); plan file drafted | plan not executed (delegated elsewhere); bare "3" msg unresolved | full Blog/News/"Brand Stories" homepage section in one pass, clean refactor | git clean -fd timeout on vendored node_modules in ψ tree; cwd drift to nonexistent subdir | misdiagnosed vercel build failure as config problem 3 times when branch name was in log the whole time |
| 2026-07-16 03:13 | 24276afd | SessionStart hook fixed (717c669, 28f24a6), PreToolUse hook fixed (5099af0), claude-mem missing-module bug fixed + verified live + PR #3273 opened upstream | n/a | claude-mem Chroma sync went from failing on every project to clean backfill across ~19 projects | jq not installed forcing rewrite; /tmp tmpfs filled by unrelated pre-existing bunx caches; dubious git ownership requiring su-as-user for plugin repo | reported SessionStart hook "confirmed working" after only manually running its script with a hand-exported, non-existent env var (CLAUDE_PROJECT_ROOT) — not the real hook-execution path; corrected only after user asked to verify with a real session |
| 2026-07-16 04:26 | 24276afd | tmux 3-pane fleet layout, RTK checklist run, RTK-for-all-agents mandate committed (9b54bd5), execution-boundary question resolved + memory updated, claude-mem backfill confirmed complete | hard-block hook approach started then explicitly cancelled by user mid-build | RTK mandate + execution-boundary policy both now durably recorded, not just discussed | /tmp filled to 100% a second time from the same unaddressed root cause | recommended the harder-to-reverse hard-block-via-hook option as "(Recommended)" for a fleet-wide mechanism instead of defaulting to the reversible written-mandate option first |
| 2026-07-16 05:45 | a9dadb85 | comprehensive token optimization system shipped to all 3 oracles (c8af3c3, 22dffa9, fa1cf1c, b0ef1b4), ψ/memory system deployed, cache.json created, context budget rules + worktree protocol + memory consolidation live | n/a | token optimization system (context budget 4-tier, worktree isolation, memory consolidation, cache server, systematic rules) deployed across Zeus/Luxi/Tham, verified all files in place, commits pushed | gitignore inconsistency across oracles (Zeus/Tham exclude /ψ/, Luxi doesn't); session file detection failed (project dir not created yet, handled gracefully); cache.json parent dir creation required defensive mkdir | designed system serially (Zeus as template, adapt to Luxi+Tham) when mandate was "do everything" — should have read all 3 CLAUDE.md upfront, designed for all contexts simultaneously, then implemented once |
| 2026-07-16 07:11 | 9e7f42bd | fleet status broadcast Phase 1 & 2 (foundation: schema, API, queries, 4 test events; automation: hooks, dashboard, git integration), gitignore audit (3 oracles standardized), all 3 oracles synced (6 commits pushed), dashboard tested (5 events showing) | n/a | Fleet status system live across all 3 oracles. Users now have real-time visibility into commits, sessions, deployments, blockers. Automated emission works (git hooks + SessionStart hook). Dashboard provides human-friendly fleet summary. Ready for production. | gitignore exception syntax (order of exception vs exclusion matters; fixed with 2 attempts); settings.json missing on Luxi (required manual creation); manual script replication to 3 oracles (scales poorly at 10+ oracles) | hardcoded oracle names in git post-commit hooks instead of self-discovering from CLAUDE.md — works for 3 oracles, unmaintainable at 50+ |
| 2026-07-17 07:21 | f324103b | Luxi activated (06:49), captain-maid status verified (Phase 5 complete), 1 commit pushed (8d67681), fleet broadcast event recorded | n/a | Fleet coordination unblocked; captain-maid production path clear; Luxi has 2h window for image integration + Lighthouse check | Dual activation messages (04:07 + 06:49 to same oracle); broadcast log + inbox redundancy | Activated on command inference ("wake luxi") without confirming deadline expectations — assumed urgency over asking |
| 2026-07-17 21:43 | 9aa3f979 | Escalation created (Luxi deadline missed), broadcast event recorded, push to remote, memory index updated | captain-maid blocked (image integration not started), Luxi silent for 13h | Escalation documented + communicated to fleet; decision gate now with ธาม; blocks clear for next action | No capacity check from Luxi before deadline; unclear if message delivered vs ignored vs blocker encountered | Assumed no news = no action; should have proactively checked Luxi status before 08:49 deadline instead of waiting for response |

---

## 🔁 Recurring Pattern Detected

**"Pattern overconfidence"** appeared in the **error** column of 3 of the last 4 sessions (Jun 2, Jun 19, Jun 20):

| Session | Error |
|---------|-------|
| 2026-06-02 | Reverted identity without reading intent — **acted on structural pattern** |
| 2026-06-19 | **Overconfidence in proximity**; **copied pattern** without checking execution context |
| 2026-06-20 | **Re-litigated Path A** instead of executing decision |

**Pattern**: All three involve quick decisions based on pattern recognition (structure, proximity, prior decision) without validating assumptions first. The error isn't in the pattern itself, but in trusting the pattern without verification.

**Suggested action**: Open issue `root-cause: pattern-overconfidence-verification-gap` or raise in standup with Boss.

**How to prevent**:
1. Before acting on a recognized pattern: explicitly verify at least one assumption
2. When copying a pattern from one context to another: confirm execution context matches
3. When re-evaluating a decision: start from first principles, not from "we decided before"

---

## 🔁 Recurring Pattern Detected (re-checked 2026-07-16)

**"Verification gap"** appears in the **error** column of **6 of the last 7 sessions** (Jun 19, Jul 6 09:49, Jul 6 11:38, Jul 7, Jul 16 03:13, Jul 17 07:21, Jul 17 21:43):

| Session | Error |
|---------|-------|
| 2026-06-19 | Overconfidence in proximity; copied pattern without checking execution context |
| 2026-07-06 09:49 | Jumped to solve submodule issue without verifying data safety first |
| 2026-07-06 11:38 | Assumed 'untrack' meant delete instead of confirming intent |
| 2026-07-07 19:06 | Misdiagnosed Vercel build failure as config problem 3× when branch name was in the log the whole time |
| 2026-07-16 03:13 | Reported a hook "confirmed working" from a manual script run with a hand-set, non-existent env var — not the real execution path |

Per parent CLAUDE.md §"Self-Evaluation Loop" — this is the same root cause flagged in the block above (2026-06/06-20 check), still recurring five sessions later across a different repo and a different kind of task. The specific mistake changes each time; the shape doesn't: declaring something verified based on a proxy (a manual run, a plausible assumption, a repeated diagnosis) instead of the real target behavior.

**Suggested action**: **ESCALATE TO BOSS (Ekkarat)**. This pattern has persisted across 3+ pattern-checks over 30 days (Jun 2, Jul 6, Jul 16, Jul 17 today) and is now consistent across 6 of 7 most recent sessions. Flagging alone hasn't broken the cycle. Need root-cause decision: (1) Is verification-gap structural to how AI agents operate? (2) Accept it as cost of speed + build contingency (e.g., always remind T−30m for deadlines)? (3) Add tooling rules to catch it? Recommend raising at next standup.
