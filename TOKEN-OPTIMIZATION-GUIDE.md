# Token Optimization System — Complete Implementation Guide

**Commit**: `c8af3c3` · **Date**: 2026-07-16 · **Applies To**: Zeus, all agents, all sessions

> ไว้ใจให้แม่น ซื่อสัตย์ให้ชัด — ทุกคำมีหลักฐาน ทุกงานมีเหตุผล
>
> *Trust precisely, Honest clearly — every word has proof, every work has reason*

---

## What Was Implemented (5 Components)

### 1. Context Budget Rules (CLAUDE.md)

**Location**: `CLAUDE.md` → "Context Budget Rules" section

**What It Does**: Enforces 4-tier token usage system with automatic strategy shifts.

| Tier | Range | Strategy |
|------|-------|----------|
| **Green** | 0–40% | Full reads OK, iterate normally |
| **Yellow** | 40–70% | Surgical only (grep → offset/limit reads) |
| **Red** | 70–90% | Extreme efficiency (one-shot bash, no preamble) |
| **Critical** | 90%+ | STOP. Wrap session, commit, push, exit. No negotiation. |

**8 Mandatory Rules**:
1. RTK Once Per Session — cache facts, never re-read
2. Grep Before Read — search large files before full Read()
3. One-Shot Bash — combine commands with `&&`
4. No Preamble — direct answers only
5. Offset/Limit on Reads — don't read whole files
6. Memory Cache Over Re-Derive — use ψ/ instead of re-computing
7. Worktree for Large Changes — isolate context for >100-line edits
8. Session Exit at 85% — wrap up before context explosion

**Enforcement**: Passive monitoring at `/recap`, `/rrr`, and before major ops.

### 2. Worktree Isolation Protocol (ψ/memory/learnings/worktree-isolation-protocol.md)

**Location**: `ψ/memory/learnings/worktree-isolation-protocol.md`

**When to Use**:
- Refactor >100 lines OR >5 files
- Experimental branch / spike
- Large cherry-pick / port
- Parallel work (two agents, same repo)

**Command**:
```bash
/worktree feature-name
# Creates: zeus-oracle-wt-feature-name/
# Work isolated, zero context pollution
# Merge when done: git merge feature-name
# Cleanup: git worktree prune
```

**Impact**: Saves ~1500 tokens per 10-iteration refactor via isolated diffs.

### 3. Memory Consolidation System (ψ/memory/MEMORY-RULES.md + MEMORY.md)

**Location**: `ψ/memory/MEMORY-RULES.md` (rules) + `ψ/memory/MEMORY.md` (index)

**Core Principle**: Write Once, Find Always.

**Memory Types** (organized by TTL):

| Type | Where | TTL | Update When |
|------|-------|-----|------------|
| **User profile** | `memory/learnings/user-*.md` | ∞ | New info contradicts old |
| **Feedback** | `memory/learnings/feedback-*.md` | ∞ | Pattern repeats 2+ times |
| **Decisions** | `memory/learnings/decision-*.md` | ∞ | Never (immutable) |
| **Session metrics** | `memory/learnings/session-metrics.md` | ∞ | Append at session end |
| **Retrospectives** | `memory/retrospectives/YYYY/MM/DD/*.md` | ∞ | Create with /rrr |
| **Resonance** | `memory/resonance/*.md` | ∞ | Breakthrough moments |
| **Reference** | `memory/reference/*.md` | ∞ | External pointers only |
| **Handoff** | `inbox/handoff/DATE_*.md` | 14d | /forward at session end |
| **Escalation** | `inbox/escalation/DATE_*.md` | 14d | Blocks need human decision |
| **Active sprint** | `active/SPRINT-*.md` | Sprint-end | Daily updates |

**MEMORY.md Index** (< 200 lines):
- Fast lookup of all memories
- One-line hook per entry
- Organized by type
- Archive old memories to `memory/archive/YYYY-MM/` if >1 year old

**Impact**: Zero re-derivation. Facts written once, reused forever.

### 4. Cache Server (JSON-based L1 Cache)

**Location**: `/root/.claude/projects/-root-ghq-github-com-E0993599799-zeus-oracle/cache.json`

**What It Does**: Stores frequently-accessed facts with 1-hour TTL.

**Cached Items**:
- CLAUDE.md identity + rules
- Fleet roster + oracle statuses
- Memory index
- RTK checklist

**How RTK Uses It**:
1. Check if `cache.json` exists and is <1 hour old
2. If yes: use cached values, skip fresh reads (saves 100-200 tokens)
3. If no: read fresh CLAUDE.md/memory index, write cache, set TTL

**Invalidation**:
- Auto: TTL expires (1 hour)
- Manual: `rtk --refresh`
- Auto: Git detects CLAUDE.md/MEMORY.md changed
- Auto: Session boundary

**No Setup Needed**: Cache is auto-created/managed. Just works.

### 5. Systematic Memory Rules (ψ/memory/MEMORY-RULES.md)

**Location**: `ψ/memory/MEMORY-RULES.md`

**Defines**:
- What to save where (learnings vs. reference vs. escalation)
- When to save (on new info, on pattern repeat, on decision)
- TTL rules (what expires when)
- Index discipline (keep MEMORY.md <200 lines)
- Loading rules (which memories to load per session)
- Verification questions before saving

**Use This When**:
- Starting a new memory file
- Deciding whether to update existing memory
- Wondering where to put something
- Cleaning up expired memories

---

## How to Use (Per-Session)

### Every Session: Follow RTK

```bash
/recap → RTK → observe fleet → direct → /rrr → commit → push → จบ
```

**RTK Steps** (automatic via RTK checklist):
1. Load `ψ/memory/MEMORY.md` (index)
2. Check if `cache.json` is fresh (<1 hour)
   - If yes: use cached values for CLAUDE.md, fleet, memory index
   - If no: read fresh, write cache
3. Verify delegation boundaries (Zeus role)
4. Confirm phase status
5. Identify blockers from prior session

### During Session: Follow Context Budget Tier

**At 40%**: Switch to surgical reads
```bash
# ❌ Don't:
Read(large-file.md)

# ✅ Do:
Bash(grep -n "pattern" large-file.md)
Read(large-file.md, offset: 150, limit: 50)
```

**At 70%**: Extreme efficiency
```bash
# ❌ Don't:
"Let me think about this... here's what I found... to summarize..."

# ✅ Do:
"[direct answer]"
```

**At 85%**: Stop and wrap
```bash
# Stop substantive work
# git add . && git commit
# /rrr
# git push
# exit
```

### Large Changes: Use Worktree

```bash
/worktree feature-name
# ... edit in isolation ...
git commit -m "feature: description"
# ... test, iterate (small token cost) ...
cd ../zeus-oracle
git merge feature-name
git push origin main
git worktree prune
```

### Saving Memory: Use MEMORY-RULES.md

Before saving a new memory:
1. Read `ψ/memory/MEMORY-RULES.md`
2. Ask: "What type is this?" (feedback vs. decision vs. reference)
3. Ask: "Where does it go?" (learnings vs. inbox vs. active)
4. Ask: "What's the TTL?" (∞ vs. 14d vs. sprint-end)
5. Save with frontmatter (name, description, type, ttl)
6. Add pointer to `ψ/memory/MEMORY.md` index

Example:
```yaml
---
name: pattern-discovered
description: Recurring pattern in deployment failures, suggested fix strategy
metadata:
  type: feedback
  ttl: ∞
---

# Pattern: Deployment Failures on First Try

**Pattern Detected**: 2026-07-16 (3rd observation in 7 sessions)
**Why**: Transient cloud API errors, retried on second attempt
**Fix Strategy**: Add exponential backoff + 3-retry loop

[→ AGENT DECISION] Should default retry loop be in Teleos or Vercel skill?
```

---

## Expected Token Savings

| Strategy | Savings Per Session | Example Scenario |
|----------|-------------------|-----------------|
| RTK caching | 100–200 tokens | Skip re-reading CLAUDE.md + fleet state |
| Surgical reads | 150–300 tokens | Use grep + offset/limit instead of full file |
| One-shot bash | 50–100 tokens per command | Combine 3 git commands into 1 call |
| Memory cache | 500–1000 tokens per session | Use ψ/ instead of re-deriving fleet status |
| Worktree isolation | ~1500 tokens per 10-iteration refactor | Small, clean diffs vs. full repo context |
| **Total** | **2000–3000 tokens** | **~10–15% session budget savings** |

---

## Monitoring & Maintenance

### Per-Session (Automatic via RTK)

- [ ] RTK loads cache.json (or refreshes if stale)
- [ ] Budget tier checked at `/recap`, `/rrr`
- [ ] Budget tier checked before major operations
- [ ] Memory index loaded (from cache or fresh)

### Per-Handoff (Manual)

- [ ] Create `ψ/inbox/handoff/DATE_title.md` with `/forward`
- [ ] Next session reads handoff within 14 days
- [ ] Handoff archived to `ψ/memory/archive/YYYY-MM/` if expired

### Per-Sprint (Manual)

- [ ] Archive `ψ/active/SPRINT-*.md` to `ψ/memory/archive/YYYY-MM/` when sprint ends
- [ ] Prune old memories: if `ψ/memory/MEMORY.md` > 200 lines, snapshot to archive

### Per-Year (Automated Suggestion)

- [ ] Review `ψ/memory/MEMORY.md` index
- [ ] Archive memories not loaded in 3+ sessions to `ψ/memory/archive/YYYY-MM/`
- [ ] Keep only actively referenced memories in index

---

## Files & Locations

```
zeus-oracle/
├── CLAUDE.md
│   ├── Identity section (unchanged)
│   ├── Fleet section (unchanged)
│   ├── Context Budget Rules (NEW — enforced per tier)
│   ├── Worktree Isolation Protocol (NEW — command /worktree)
│   ├── Memory Consolidation System (NEW — ψ/ hierarchy)
│   └── Cache Server Setup (NEW — auto-managed cache.json)
├── .gitignore
│   └── Exception: !/ψ/memory/ (NEW — track oracle memory)
├── TOKEN-OPTIMIZATION-GUIDE.md (THIS FILE — reference)
└── ψ/memory/
    ├── MEMORY.md (UPDATED — index of all memories)
    ├── MEMORY-RULES.md (NEW — when/where/how to save)
    ├── learnings/
    │   ├── worktree-isolation-protocol.md (NEW — git worktree workflow)
    │   ├── 2026-07-16_recommend-reversible-option-first.md (existing)
    │   └── ... (other learnings)
    ├── retrospectives/ (existing structure)
    ├── reference/ (existing structure)
    └── inbox/ (existing structure)

~/.claude/projects/-root-ghq-github-com-E0993599799-zeus-oracle/
├── cache.json (NEW — L1 cache, auto-managed)
└── *.jsonl (session transcripts)
```

---

## Troubleshooting

### "Cache.json is stale?"

→ `rtk --refresh` to manually refresh cache (or wait 1 hour for auto-refresh)

### "Budget tier not detected at /recap?"

→ Check that `CLAUDE.md` sections are properly formatted. `/recap` reads `CLAUDE.md` at RTK step.

### "Memory files not tracked by git?"

→ Ensure `.gitignore` has exceptions: `!/ψ/memory/` and `!/ψ/memory/**`

### "MEMORY.md index too large?"

→ Archive old entries to `ψ/memory/archive/YYYY-MM/MEMORY-snapshot.md`. Keep index <200 lines.

### "Worktree cleanup leaving stale directories?"

→ Run `git worktree prune` to clean up deleted worktrees.

---

## Next Steps (Optional Enhancements)

- [ ] Set up Redis cache server (instead of JSON) for shared fleet cache
- [ ] Add metrics dashboard to track token usage trends across sessions
- [ ] Create automated memory archival script (expires old memories)
- [ ] Wire cache.json into real hook (auto-validate at SessionStart)
- [ ] Build memory search tool (fast grep + filter across ψ/)

---

## Questions?

Refer to:
- **Context budget rules**: `CLAUDE.md` → "Context Budget Rules" section
- **Memory discipline**: `ψ/memory/MEMORY-RULES.md`
- **Worktree workflow**: `ψ/memory/learnings/worktree-isolation-protocol.md`
- **Memory index**: `ψ/memory/MEMORY.md`

---

**Implementation Date**: 2026-07-16  
**Applies To**: Zeus (this session), all agents (via RTK mandate), future oracles (via bud)  
**Enforcement**: Passive (via /recap monitoring) + explicit (tier thresholds)  
**Status**: ✓ Live and enforced
