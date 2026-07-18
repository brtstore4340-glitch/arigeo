---
name: mission-lessons-security-skills
description: Generalizable patterns from security + skills + metrics mission for fleet reuse
date: 2026-07-18
source: Mission debrief (zeus-security-skills-metrics-v1)
type: lessons-learned
ttl: ∞
---

# Lessons Learned: Security + Skills + Metrics Mission

## Pattern 1: Proof-Required Execution Prevents False Positives

**What we learned**: Requiring reproducible proofs for every claim (not just trust documentation) caught edge cases and false negatives that would have slipped through.

**Why it matters**: Security gates need independent verification. Documentation can be outdated or wrong; code execution is ground truth.

**Example**: Hallucination detector testing — documentation said "typosquat detection works," but reproducing the test independently revealed edge case where Levenshtein distance threshold was too high, allowing some typos through.

**How to apply**: For all security-critical missions:
- Never accept "works" without reproducible proof
- Re-run proofs independently (not just trusting executor's test results)
- Make proof reproducibility a non-negotiable requirement
- Document exactly what counts as proof (exit code, test output, metric values, etc.)

---

## Pattern 2: Role Separation (Executor/Reviewer/Scribe) Prevents Approval Bias

**What we learned**: Having Reviewer independently re-run tests caught issues Executor's own testing would have missed. Separation forces fresh perspective.

**Why it matters**: Self-approval creates blind spots; we optimize toward success instead of questioning assumptions. External validation is the check on that bias.

**Example**: Executor ran security tests and got all green. Reviewer re-ran same tests independently and found one edge case (scope-impersonation pattern) that Executor's local environment had masked (Executor was in E0993599799 allowlist context, so the pattern didn't trigger as expected).

**How to apply**: Enforce strict role separation:
- Executor runs code, generates proofs
- Reviewer runs proofs independently (not just reading output)
- Scribe documents (not involved in execution or validation)
- No role may approve its own work
- Build this into process; don't rely on good intentions

---

## Pattern 3: Composable Skills Enable Rapid Automation Chains

**What we learned**: Designing skills with clear input/output contracts made skill chaining trivial. One skill's output became another's input with zero adaptation code.

**Why it matters**: Reduces code duplication and enables flexible automation. Reusability requires design discipline, but pays off immediately.

**Example**: `nextjs-review` outputs `{errors[], warnings[], suggestions[]}`. `vercel-deployment-audit` accepts `{errors[], warnings[]}`. Chaining them required zero glue code.

**How to apply**: For all future skills:
- Define input schema (what data the skill expects)
- Define output schema (what the skill produces)
- Document both explicitly
- Test composability (can output of A feed into B?)
- Design for chaining from day one (beats retrofitting later)

---

## Pattern 4: Dashboard Metrics Drive Accountability

**What we learned**: Making cost and test pass rate visible on dashboard creates incentive for quality. Invisible metrics lead to invisible debt.

**Why it matters**: What gets measured gets managed. Transparent metrics drive behavior change without policy enforcement.

**Example**: Making mission cost visible ($0 for local execution, $X for cloud execution) immediately creates incentive to run locally first before requesting cloud resources.

**How to apply**: Expose key metrics:
- Cost (actual spend, not estimate)
- Test pass rate (not just final verdict)
- Blocker count (blockers are work, visible blockers get fixed)
- Rework cycles (visible rework cycle count drives quality investment)
- Proof paths (traceable proofs build confidence)

---

## Pattern 5: Fail-Closed Security Gates Prevent Catastrophic Defaults

**What we learned**: Hallucination detector design principle: never false-ALLOW. Worst case is false-BLOCK (annoying but recoverable); false-ALLOW is catastrophic.

**Why it matters**: False negatives in security gates can expose infrastructure. False positives are inconvenient but contained.

**Example**: Typosquat detector blocks `react-router-dom2` (similar to `react-router-dom`). Inconvenient if that's a typo. But if it allowed it? Malicious package installed = infrastructure compromise.

**How to apply**: For all security gates:
- Default to BLOCK on unknown
- Require explicit approval to bypass
- Make approval visible (audit log)
- Never allow "hmm, looks fine" reasoning
- Make the gate less convenient than legitimate approval (approval friction is feature, not bug)

---

## Meta-Pattern: Proof-Reviewable-Scribe Loop Scales

**What we learned**: The 3-phase model (Executor → Reviewer → Scribe) scales well because each phase has clear inputs/outputs and doesn't require access to previous phases' context.

**Why it matters**: Enables parallel work, reduces review friction, creates natural audit trail.

**Example**: Hermes completed work, handoff was PROOF_LOG.md + commits. Aris validated independently without needing Hermes context. Scribe documented without needing to re-derive anything. Each phase was complete unit of work.

**How to apply**: Use this model for all complex missions:
1. **Executor**: Do work, generate proofs
2. **Reviewer**: Validate proofs independently
3. **Scribe**: Document + archive

Each phase hands off self-contained deliverables. No context dependencies between phases.

---

## Residual Risks & Mitigations

### Risk: Hallucination detector is heuristic
- **Mitigation**: Offline (fail-closed), quarterly re-evaluation as threat landscape evolves
- **Acceptable**: Yes (documented, bounded)

### Risk: Skill checks are contract-level only
- **Mitigation**: Suitable for gates; deep audit requires separate security review
- **Acceptable**: Yes (designed this way intentionally)

### Risk: Vercel integration needs token
- **Mitigation**: Netlify is viable fallback; flag to Zeus if Vercel is critical path
- **Acceptable**: Yes (decision pending, not blocker)

---

## Recommendations

1. **Adopt proof-required model** for all security missions
2. **Use Executor/Reviewer/Scribe split** for complex work
3. **Design skills for composability** from day one
4. **Make metrics visible** (cost, test pass, blockers)
5. **Default to BLOCK** in security gates
6. **Document why** each pattern was chosen

---

`[MARCUZ:Scribe] Lessons Learned from Mission v1`
