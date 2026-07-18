---
mission_id: zeus-security-skills-metrics-v1
assigned_to: Hermes (Executor Oracle)
from: Zeus (Meta-Orchestrator)
date: 2026-07-18 21:10 GMT+7
role: EXECUTOR
status: READY_FOR_EXECUTION
---

# 🔧 DELEGATION: Hermes — Mission Executor

**From**: Zeus (Meta-Orchestrator)  
**To**: Hermes (Executor Oracle)  
**Mission**: AI Agent Security + Skills + Metrics Implementation  
**Role**: Execute on isolated branch/worktree  
**Authority**: Full execution authority (within constraints)

---

## YOUR MISSION

Execute the 4 strategic objectives documented in:  
`ψ/inbox/mission-orders/20260718_2053_SECURITY-SKILLS-METRICS-IMPLEMENTATION.md`

**You own**:
- Isolated branch/worktree creation (`mission-security-skills-metrics-impl`)
- Implementation of all 4 objectives
- File backup before modifications
- Running tests and generating proof
- Logging (summary, proof, run, error logs)

**You do NOT own**:
- Approval of your own work (Reviewer does)
- Final verdict on mission success
- Fleet deployment decision

---

## EXECUTION CHECKLIST

### Phase 1: Setup (Immediate)

- [ ] Create isolated git worktree: `mission-security-skills-metrics-impl`
- [ ] Verify workspace access: `D:\01 Main Work\Boots\Agentic AI\mission-control`
- [ ] Create backup manifest structure:
  - `tools/LAST_BACKUP_DIR.txt` (track backup location)
  - `tools/logs/summary.log`
  - `tools/logs/proof.log`
  - `tools/logs/run.log`
  - `tools/logs/error.log`
  - `tools/backups/manifest.json`
- [ ] Document preconditions (dependencies, env vars, tooling)

### Phase 2: Objective 1 — Repository & Dependency Safety

- [ ] Design allowlist enforcement mechanism
- [ ] Implement hallucination detection blocker
- [ ] Create provenance verification logic
- [ ] Build audit logging system
- [ ] Test: Prove untrusted repo clone is blocked
- [ ] Test: Prove hallucinated package install is rejected
- [ ] Document success criteria met/unmet

### Phase 3: Objective 2 — Reusable Agent Skills

- [ ] Create 7 SKILL.md templates with execution contracts
  - `nextjs-review.md`
  - `vercel-deployment-audit.md`
  - `dependency-security-check.md`
  - `supabase-schema-review.md`
  - `seo-audit.md`
  - `ui-design-review.md`
  - `proof-verification.md`
- [ ] Each skill includes: triggers, inputs, risk level, allowed tools, contract, validation, proof requirements, rollback
- [ ] Test composability (skill output → input chain)
- [ ] Verify no self-approval loops

### Phase 4: Objective 3 — Agent Quality Dashboard

- [ ] Design metrics schema (task_id, agent_id, provider, model, timestamps, tokens, cost, test_pass, review_status, deployment_status, rework_count, proof_paths, commit_sha, verdict)
- [ ] Implement metrics collection
- [ ] Create dashboard or integrate with existing (Notion/Obsidian/GitHub)
- [ ] Validate this mission's metrics appear on dashboard
- [ ] Proof: Screenshot or JSON export

### Phase 5: Objective 4 — Vercel/GitHub Integration Audit

- [ ] Detect Vercel agent/plugin configuration status
- [ ] Verify official source + compatibility
- [ ] Document integration steps (no blind install)
- [ ] Implement mandatory workflow pipeline (Decode → Gate → Contract → Hermes → Tests → Reviewer → Dashboard → Obsidian)
- [ ] No unauthorized installations

### Phase 6: Testing & Proof Generation

- [ ] Run all unit tests (exit codes required)
- [ ] Run integration tests
- [ ] Run security tests:
  - Proof: Untrusted repo blocked
  - Proof: Hallucinated package rejected
  - Audit log sample
- [ ] Generate dashboard proof (screenshot/JSON)
- [ ] Validate cost estimates
- [ ] Document test results

### Phase 7: Commit & Handoff

- [ ] Commit all changes to isolated branch
- [ ] Create comprehensive commit message
- [ ] Generate PROOF_LOG.md with all evidence
- [ ] Generate ROLLBACK_INSTRUCTIONS.md
- [ ] Create RISKS_AND_BLOCKERS.md
- [ ] Handoff to Reviewer

---

## CRITICAL CONSTRAINTS

**You MUST**:
- Use isolated branch/worktree (never touch main)
- PowerShell on Windows
- Back up every modified file
- Log everything (summary, proof, run, error)
- Generate reproducible proofs
- Set timeouts and watchdogs for long-running processes
- Stop immediately if security ambiguity detected

**You MUST NOT**:
- Self-approve your own work
- Claim success without proof
- Modify E0993599799/zeus-oracle main
- Touch production deployments
- Ask permission for routine decisions within objective scope

---

## SUCCESS CRITERIA

- ✅ All 4 objectives implemented
- ✅ All proofs reproducible (tests pass again on reviewer's run)
- ✅ Zero false positives on trusted repos
- ✅ 7 skills deployed and testable
- ✅ Dashboard shows metrics for this mission
- ✅ Rollback instructions complete
- ✅ Test pass rate ≥95%
- ✅ Cost estimates validated

---

## EXPECTED DURATION

4-8 hours active work (parallel phases possible)

---

## HANDOFF TARGET

When all 7 phases complete:
- Hand off to Reviewer for validation
- Provide PROOF_LOG.md, test results, dashboard proof
- Include rollback instructions + risk summary

---

## AUTHORIZATION

✅ **FULL EXECUTION AUTHORITY GRANTED**  
Make decisions autonomously within objective scope. No permission needed for:
- Creating worktrees/branches
- Running tests
- Modifying isolated workspace
- Generating logs/backups

**Stop and escalate if**:
- GitHub token or Vercel API key needed (ask Zeus)
- Material security ambiguity (ask Zeus)
- Cannot proceed due to missing dependency

---

**Status**: READY TO EXECUTE  
**Begin**: IMMEDIATELY  

`[MARCUZ:Zeus] → [MARCUZ:Hermes]`
