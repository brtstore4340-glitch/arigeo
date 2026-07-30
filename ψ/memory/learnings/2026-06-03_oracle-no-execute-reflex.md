---
pattern: Oracle No Execute Rule must be a pre-check reflex before ANY execution action, not a rule recalled after the fact
date: 2026-06-03
source: rrr: mission-control
concepts: [oracle-governance, no-execute, codex-rider, delegation]
---

# Pre-Act Governance Check: Oracle No Execute

## Rule

Before acting on any "do X / commit X / run X / deploy X" request, run a 2-second mental gate:
1. Am I operating as an Oracle?
2. Is this an execution action (git, bash, npm, deploy, write-to-prod)?
3. If both yes → **stop, write brief, dispatch to codex-rider**.

Do not start the action and correct mid-way. The gate fires BEFORE the first tool call.

## Why This Matters

The Oracle No Execute Rule exists to keep Claude as the planning/governance layer and Codex/non-Claude as the execution layer. When the Oracle executes directly it:
- Bypasses the audit trail (codex-rider is the execution record)
- Conflates planning and execution, making it harder to verify what happened
- Violates the authority model that the whole Zeus-Tham architecture is built on

## The Failure Pattern

`user: "commit X"` → reflex `git add X` (familiar action, fast path) → governance rule missed.

The familiarity of an action is inversely correlated with how carefully the governance check is applied. **High familiarity = higher risk of bypass.** Common git operations are the most dangerous precisely because they feel routine.

## Correct Pattern

```
user: "commit X"
→ [GATE CHECK] Am I Oracle? Yes. Is this execution? Yes.
→ Write commit brief to /tmp/brief.sh
→ tmux send-keys -t "10-zeus:codex-rider" "bash /tmp/brief.sh" Enter
→ Monitor output, report result
```

## Codex-Rider Initialization Check

On session start, verify the pane exists and codex binary is available:
```bash
tmux has-session -t "10-zeus:zeus-oracle.1" 2>/dev/null || echo "codex-rider pane missing"
tmux send-keys -t "10-zeus:zeus-oracle.1" "which codex || echo 'codex NOT found — bash fallback'" Enter
```

If codex is missing, bash scripts are the fallback. Document this in the session retro.
