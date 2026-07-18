---
mission_id: zeus-security-skills-metrics-v1
from: Tham (Governor)
to: Zeus (Meta-Orchestrator) → Hermes, Reviewer, Scribe
date: 2026-07-18 20:42 GMT+7
priority: HIGH
mode: autonomous-with-proof
workspace: mission-control (D:\01 Main Work\Boots\Agentic AI\mission-control)
status: RECEIVED_AND_DELEGATING
---

# 🚀 MISSION ORDER: AI Agent Security + Skills + Metrics Implementation

**From**: Tham (Governor) via runtime briefing  
**To**: Zeus → Hermes (Executor) → Reviewer → Scribe  
**Date**: 2026-07-18 20:42 GMT+7  
**Priority**: HIGH  
**Mode**: Autonomous execution with reproducible proof required  
**Workspace**: mission-control (Windows: D:\01 Main Work\...)

---

## OBJECTIVE SUMMARY

Implement comprehensive security, reusable skills, and metrics infrastructure across mission-control and Forge/Omega agent workflows to enable safe, auditable, scalable agent operations.

---

## 4 STRATEGIC OBJECTIVES

### 1. Repository and Dependency Safety

**Deliverable**: Allowlist enforcement + hallucination blocking + provenance verification

**Implementation**:
- GitHub organization/repository allowlist enforcement
- Block git clone, package install, binary download, remote script execution when source was hallucinated/guessed by AI
- Verify: repository owner, canonical URL, recent commit history, release provenance, package registry metadata, checksum/signature
- Require explicit approval for all new dependencies
- Record all blocked/approved dependency actions in audit log

**Success Criteria**:
- ✅ Untrusted repository clone is blocked with proof
- ✅ Hallucinated package install is rejected with audit trail
- ✅ Approved dependencies verified and logged
- ✅ Zero false positives on trusted E0993599799/* repos

---

### 2. Reusable Agent Skills

**Deliverable**: 7 reusable SKILL.md modules with execution contracts

**Skills to create**:
1. `nextjs-review` — Next.js 13+ project audit
2. `vercel-deployment-audit` — Vercel config validation
3. `dependency-security-check` — npm/pnpm/yarn provenance + vulnerability scan
4. `supabase-schema-review` — Database schema audit
5. `seo-audit` — SEO metadata + performance review
6. `ui-design-review` — React component & design pattern audit
7. `proof-verification` — Generic proof validator

**Each skill must define**:
- Trigger conditions (when to invoke)
- Required inputs
- Risk level (low/medium/high)
- Allowed tools (which bash/npm/gh commands permitted)
- Execution contract (preconditions, postconditions, invariants)
- Validation commands
- Proof requirements (what counts as evidence)
- Failure and rollback behavior

**Success Criteria**:
- ✅ 7 skills deployed and testable
- ✅ Each skill has reproducible trigger + proof
- ✅ No skill can self-approve its output
- ✅ Skills composable (one skill output → another skill input)

---

### 3. Agent Quality and Cost Dashboard

**Deliverable**: Structured metrics for every mission + dashboard exposure

**Metrics per mission**:
```
task_id, agent_id, provider, model, start_timestamp, end_timestamp,
duration_ms, token_estimate, cost_estimate, test_pass_rate,
review_pass_status, deployment_status, rework_count, proof_paths,
commit_sha, final_verdict
```

**Dashboard exposure**:
- Local dashboard if none exists, OR
- Integrate with existing (Notion, Obsidian, GitHub, etc.)
- Real-time cost tracking per agent
- Proof paths traceable back to commit

**Success Criteria**:
- ✅ Dashboard displays metrics for this mission
- ✅ Cost estimates match actual usage
- ✅ Every mission has complete metrics record
- ✅ Proof paths are clickable/verifiable

---

### 4. Vercel and GitHub Integration Audit

**Deliverable**: Integration status detection + compatibility verification

**Implementation**:
- Detect if official Vercel agent/plugin workflow is configured
- Do NOT install blindly
- Verify official source + current compatibility before installation
- Document recommended integration steps (with credential/authorization requirements)

**Mandatory Workflow**:
```
Intent/Prompt Decode
  ↓
Memory/Risk Gate
  ↓
Contract (preconditions check)
  ↓
Hermes Executor (isolated)
  ↓
Tests and Proof Generation
  ↓
Reviewer Validation
  ↓
Dashboard Writeback
  ↓
Obsidian/Notion/GitHub Record
```

**Success Criteria**:
- ✅ Vercel integration status documented
- ✅ GitHub Tools compatibility verified
- ✅ No unauthorized installations attempted
- ✅ Workflow follows mandatory pipeline

---

## EXECUTION STRUCTURE

### Role Assignments

| Role | Responsibility | Authority |
|------|---|---|
| **Zeus** | Orchestrate, delegate, coordinate | Full |
| **Tham** | Architecture/brain (async approval) | Approval-only |
| **Hermes** | Execute (isolated branch/worktree) | Execution-only |
| **Reviewer** | Validate proofs, security test | Validation-only |
| **Scribe** | Document, record in Obsidian/fleet | Documentation |

### Hard Constraints

- ✅ No agent may self-approve its own work
- ✅ Never modify main directly — use isolated branch/worktree
- ✅ Do not claim Complete, Done, Check, Pass, or OK without reproducible proof
- ✅ PowerShell-first on Windows
- ✅ Background/no-window for unattended processes
- ✅ Timeout, watchdog, no-hang protection required
- ✅ Back up every modified file before changing
  - Update: `tools/LAST_BACKUP_DIR.txt`
  - Write: `tools/logs/{summary,proof,run,error}.log`
  - Write: `tools/backups/manifest.json`

---

## REQUIRED OUTPUTS

1. **Implementation Contract**
   - File structure changes
   - Dependencies required
   - Preconditions to deploy
   - Postconditions to verify

2. **Files Changed**
   - List of all modified/created files
   - Before/after diffs (for critical files)
   - Backup manifest

3. **Tests Executed with Exit Codes**
   - Unit tests (if applicable)
   - Integration tests
   - Security tests (hallucination blocking proof)
   - Dashboard metric validation

4. **Security Test Proof**
   - Evidence that untrusted repos are blocked
   - Evidence that hallucinated packages are rejected
   - Audit log sample showing blocked action

5. **Dashboard or Metrics Output Proof**
   - Screenshot or JSON export
   - Proof that this mission's metrics appear on dashboard
   - Cost estimate validation

6. **Rollback Instructions**
   - Step-by-step rollback procedure
   - How to restore from backup manifest
   - How to revert skills if needed

7. **Remaining Risks/Blockers**
   - Any incomplete sections
   - Known limitations
   - Future work needed

8. **Obsidian Completion Record**
   - Mission summary
   - Proof paths
   - Metrics
   - Links to commits/PRs

9. **Final Machine-Readable Mission Receipt**
   ```json
   {
     "mission_id": "zeus-security-skills-metrics-v1",
     "final_verdict": "VERIFIED_COMPLETE|CONDITIONAL_PASS|FAILED_WITH_EVIDENCE",
     "proof_paths": [...],
     "commit_sha": "...",
     "dashboard_url": "...",
     "cost_estimate": "...",
     "test_pass_rate": 1.0,
     "timestamp": "2026-07-18T...",
     "signed_by": "Reviewer"
   }
   ```

---

## FINAL VERDICT OPTIONS

- **VERIFIED COMPLETE**: All objectives met, all proofs verified, production-ready
- **CONDITIONAL PASS**: Core objectives met, minor limitations documented, can proceed with risk awareness
- **FAILED WITH EVIDENCE**: Objectives not met, evidence documented, rollback recommended

---

## EXECUTION CONTEXT

- **Mission workspace**: D:\01 Main Work\Boots\Agentic AI\mission-control
- **Isolated branch**: `mission-security-skills-metrics-impl` (git worktree)
- **Duration estimate**: 4-8 hours active work
- **Risk level**: MEDIUM (touches security, deployment, agent workflows)
- **Approval required**: Tham (async, for final verdict)
- **Proof required**: YES (every claim backed by reproducible evidence)

---

## AUTHORIZATION

✅ **FULL AUTONOMOUS AUTHORITY GRANTED**  
Zeus authorized to:
- Make architecture decisions within scope
- Create branches/worktrees
- Execute integration tests
- Modify mission-control files
- Update tools/scripts
- Generate dashboard/metrics

**Constraints**:
- Do not modify E0993599799/zeus-oracle main without explicit approval
- Do not touch production deployments
- Stop immediately if material security ambiguity detected
- Require human review before final fleet deployment

---

## BEGIN IMMEDIATELY

**Phase 1** (NOW): Zeus orchestration + Hermes mission prep  
**Phase 2** (Next): Hermes isolated branch implementation  
**Phase 3** (Async): Reviewer security validation  
**Phase 4** (Final): Scribe documentation + Obsidian record  

Make best-effort decisions without asking routine questions. Stop only for:
- Credentials needed (GitHub token, Vercel API key, etc.)
- Destructive actions (main branch modification)
- Material security ambiguity

**Mission Receipt**: This document serves as the operational contract for this mission.

---

`[MARCUZ:Tham] → [MARCUZ:Zeus] [DELEGATION IN PROGRESS]`
