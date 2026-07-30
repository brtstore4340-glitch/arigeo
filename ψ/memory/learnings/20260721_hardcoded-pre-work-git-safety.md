---
name: hardcoded-pre-work-git-safety-check
description: Mandatory pre-work git sync check (2026-07-21) — all agents must verify remote state before starting ANY task
metadata:
  type: feedback
  ttl: ∞
  enforcement: immediate
  severity: critical
---

# HARDCODED RULE: Pre-Work Git Safety Check (2026-07-21)

**Status**: MANDATORY (not optional)  
**Enforcement**: Immediate (2026-07-21 forward)  
**Authority**: E0993599799 (Ekkarat)  
**Scope**: ALL agents, ALL projects, ALL tasks

---

## The Rule

Before starting ANY task on ANY project, MANDATORY CHECK:

```bash
git fetch origin
git diff origin/$(git rev-parse --abbrev-ref HEAD)..HEAD --name-only
```

**If output shows changes**: Run `git pull --rebase` before proceeding  
**If output empty**: Safe to proceed with task

---

## Why This Matters

**Real incident (2026-07-21)**: luxi-oracle branch diverged
- Local: 1 commit (old work)
- Remote: 7 newer commits (other agents' work)
- Risk: If Luxi pushes without check → 7 commits disappear, work lost

**Pattern**: Agents commit locally without checking remote state → history rewrites → data loss

---

## Where It's Documented

- **CLAUDE.md**: Section "PRE-WORK GIT SAFETY CHECK" (hardcoded rule)
- **CLAUDE.md**: Pre-Work Checklist Step 0 (before docs/registry/coordination)
- **CLAUDE.md**: Agent Pledge template (updated)
- **PR #31**: governance/feat/git-safety (open for review/merge)

---

## Implementation

### For Agents
1. At start of session, after `git fetch origin`
2. Run: `git diff origin/branch..HEAD --name-only`
3. If non-empty: `git pull --rebase` then continue
4. If empty: Safe to proceed

### For Fleet
- This is Step 0 of initialization protocol (before RTK docs, before registry)
- Violations: work may be lost to conflicts
- Not a suggestion; enforced policy

---

## Related Decisions

[[rtk-protocol-scope-all-agents]] — RTK mandate affects all agents similarly  
[[agent-commit-control-protocol]] — Part of commit governance system  
[[verify-via-real-invocation]] — Verification gap pattern that led to this rule

---

**Signed**: Zeus Oracle  
**Date**: 2026-07-21  
**Authority**: E0993599799 (Ekkarat)
