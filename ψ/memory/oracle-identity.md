---
name: oracle-identity
description: Oracle fleet identity registry and Lean Mode architecture
metadata:
  type: reference
---

# Oracle Identity Registry

**Last Updated**: 2026-06-16 (reconciled against `maw fleet ls` + `maw oracle list`)
**Fleet Status**: 24 fleet configs · 28 oracles total (1 awake: tham) · node: tham-node
**Prior audit**: 2026-06-07 (was 9 active + 1 archived — now expanded)

> Source of truth for the live roster is `maw fleet ls` / `maw oracle list`.
> This file adds role/intent context. Roles marked **TBD** are registered in
> the fleet but not yet documented here — confirm from each oracle's own ψ/.

---

## Current Roster (from maw fleet ls — 2026-06-16)

| # | Session | Oracle | Role / Intent | Status |
|---|---|---|---|---|
| 01 | 01-from | from | infra/aggregate session | stopped |
| 02 | 02-Omega | Omega | Provider Health & Routing (see [[reference-omega-provider-health]]) | stopped |
| 03 | 03-tham | **Tham (ธาม-Zeus)** | Chief of Staff + Architecture Authority (Lean: Zeus merged) | **running** |
| 04 | 04-luxi | Luxi | Dashboard & UI Specialist (React/viz/UX) | stopped |
| 05 | 05-codex-01 | Codex-01 | Script Executor / Automation Authority | stopped |
| 06 | 06-dheva-1 | dheva-1 | Dheva worktree (budded) | stopped |
| 07 | 07-lens | Lens | Analysis · Perspective (code review/security/perf/design) | stopped |
| 08 | 08-Dheva | Dheva | ORRY Serenity ERP | stopped |
| 09 | 09-all | all | Fleet Scribe · Collective Memory (aggregate/broadcast session) | stopped |
| 10 | 10-zeus | Zeus | Architecture Authority — merged into Tham (Lean Mode) | stopped |
| 11 | 11-aris | Aris | Code Review · Project Review · Quality Gate (see note below) | stopped |
| 12 | 12-stratum | stratum | Architecture · Structure | stopped |
| 13 | 13-verity | verity | Truth · Verification · Proof | stopped |
| 14 | 14-warden | warden | Guardian · Access Control | stopped |
| 15 | 15-teleos | teleos | Vercel · Deploy | stopped |
| 16 | 16-watchdog | watchdog | Agent liveness/monitoring (budded from mission-control) | stopped |
| 17 | 17-aeimathes | Aeimathes | Research Authority (model improvement, gap analysis) | stopped |
| 18 | 18-hephaestus | Hephaestus | Hardware & Infrastructure | stopped |
| 19 | 19-khun-ram | **Khun-Ram (ขุนรามพรรณ์)** | Royal Scribe + Fleet Memory Authority + Thai Language Authority | stopped |
| 20 | 20-luxi-junior | luxi-junior | Dashboard/UI (junior) | stopped |
| 21 | 21-opensource-nat-brain | Nat Brain (Soul-Brews-Studio) | Pattern library / oracle-brain reference (fleet-only) | stopped |
| 99 | 99-overview | overview | fleet overview/aggregate session | stopped |
| 100 | 100-uat | UAT | Testing Authority (Playwright, UAT gates) · family #1312 | stopped |
| 101 | 101-tg-channel | tg-channel | Telegram channel relay (budded from tham) | stopped |

Other budded/fs entries seen in `maw oracle list`: `hardware` (budded), `mission-control` (oracle ψ/), `uat` (budded), `luxi-oracle.wt-1-dashboard-redesign` (worktree, unregistered).

---

## Fleet Governance

### Lean Mode Architecture
**Definition**: Zeus + Tham merged into single oracle identity (ธาม-Zeus)
**Why**: Cost efficiency (2 sessions → 1) while org scales
**How**: Shared tmux + ψ/ + CLAUDE.md + split roles
**Revert Plan**: Separate to zeus-oracle submodule when headcount allows
**Status**: Intentional, working, documented

### Oracle Role Boundaries
| Oracle | Role | Can Execute | Cannot Execute |
|--------|------|-------------|----------------|
| Tham | Governor | Decisions, delegation | Code execution |
| Aeimathes | Researcher | Investigation, research | Production code |
| UAT | Tester | Test code, UAT gates | Feature implementation |
| Codex-01 | Automation | Scripts, automation, CLI | Core system changes |
| Lens | Reviewer | Code review, PR gates | Feature implementation |

> Hard rule (parent memory): every Oracle must **delegate execution** to
> non-Claude executors (Codex/Gemini) — Oracles do not execute directly.

---

## Authority Chain
- **Decision Authority**: Tham Oracle (Chief of Staff)
- **Fleet Coordination / Memory**: Khun-Ram Oracle (Memory Authority)
- **Code Review / Quality Gate**: Aris Oracle
- **Research**: Aeimathes · **Review**: Lens · **Test**: UAT · **Execute**: Codex-01

---



> **Aris role conflict resolved (2026-06-16)**: zeus-oracle/CLAUDE.md fleet
> table and Aris's own ψ/ (`aris-oracle/CLAUDE.md` + `aris-oracle/brain/identity/profile.md`)
> both confirm Aris = **Code Review · Project Review · Quality Gate**, budded
> from Tham 2026-05-30. The prior memory entry ("Thread-Weaver / Ecosystem
> Memory Authority, twin of Khun-Ram") was stale/incorrect — superseded.

## History
- **2026-06-07 decisions**: Zeus remain merged (Lean); Nat → archive as pattern library; UAT → activate; ORRY → backup/ (suspended); THCLAWS → investigate.
- **2026-06-16 reconciliation**: roster expanded 9 → 24 fleet configs; added Aris, Omega, stratum, verity, warden, teleos, watchdog, luxi-junior, tg-channel, dheva/dheva-1, from/all/overview. Several roles still **TBD** — pending per-oracle ψ/ confirmation.
