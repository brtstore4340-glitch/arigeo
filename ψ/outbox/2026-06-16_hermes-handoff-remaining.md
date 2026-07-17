---
name: 2026-06-16-hermes-handoff-remaining
description: ## Open tasks
metadata:
  type: announcement
  ttl: ∞
  date: 2026-06-16
  source: fleet-memory
---

# Hermes Handoff — Remaining Items (2026-06-16, tham-node, token-restrict)

Filed by ธาม-Zeus on entering token-restrict mode. Delegating remaining open threads to Hermes.

## Open tasks
1. **forge-routes merge conflicts** — IN PROGRESS with Codex-01 (branch `fix/forge-routes-merge-conflicts`).
   6 active forge API routes (`src/app/api/forge/{agents,health,projects,runtime,snapshot,tasks}/route.ts`) + `engine/orchestrator/cost-optimizer.ts` + `cloudflare-temperature-portal/src/index.js` have unresolved `<<<<<<<` markers — likely broken. Resolve correctly, exclude `backup/orry-serenity-erp-suspended/` from lint. → await PR.

2. **PR #89 (token-gate) + #112 (phase-11 bugs)** — small, ready to merge once quality-gate is green. Blocked by repo-wide lint debt (~30 errors) surfaced after the pnpm fix (PR #132, merged). Decide: clear lint debt vs make lint non-blocking.

3. **protocol.md v0 GAP** — `aeimathes-oracle/memory/protocol.md` does NOT exist despite a RATIFY retro (`ψ/.../04.31_hermes-protocol-v0-ratify...`). Aeimathes (`17-aeimathes` session active) to produce/commit the real file, or confirm location. Phase 13b dependency.

## Done this session
- PR #132 merged (pnpm version + lockfile + tmp/ ObsidianAgentVault lint exclusion).
- Closed stale PRs #114/#120/#121 (superseded by #116 / artifact churn).
- Archived 41 stale background jobs (162→3 active).
