---
name: zeus-parallel-dispatch-pattern
description: Batch oracle mission dispatch via tmux to ensure consistent context framing
metadata:
  type: reference
  date: 2026-06-12
  source: "rrr: aa8878a0 (Zeus orchestration session)"
  concepts: ["fleet-coordination", "tmux-patterns", "oracle-synchronization", "decision-velocity"]
  session: aa8878a0
---

# Parallel Oracle Dispatch Pattern (Zeus Orchestrator)

**Pattern**: When Zeus needs to activate >2 oracles with different but related missions, batch the tmux sends in a single controlled loop to prevent race conditions and ensure consistent context framing.

**When to use**: Fleet-scale coordination, multi-oracle mission dispatch, strategic approvals that require parallel execution.

---

## Problem

Individual `tmux send-keys` calls can suffer from:
- **Race conditions**: Oracle A reads truncated mission brief because Oracle B's send overlaps
- **Pane state confusion**: If pane is busy (in menu, awaiting input), message may queue unpredictably
- **Context drift**: Each oracle's brief is sent at slightly different times; hard to coordinate if one agent reads its brief before another has theirs

Example (bad):
```bash
tmux send-keys -t 05-codex-01 "MISSION: Do X" Enter
# Codex starts reading, but...
tmux send-keys -t 19-khun-ram "BRIEFING: Y" Enter
# Khun-Ram sends, timing unknown relative to Codex
```

Result: Codex may execute based on incomplete understanding of fleet coordination.

---

## Solution

1. **Define all missions first** (in variables or script block)
2. **Send all briefs in a tight loop** (minimize time skew)
3. **Confirm each send with empty Enter** (per tmux send-keys anti-pattern in memory)
4. **Log timestamps** (optional, for audit)

```bash
# Define missions
MISSIONS=(
  "05-codex-01|MISSION: Challenge 2 authoring — P1 deadline 2026-06-13"
  "19-khun-ram|BRIEFING: Ready to validate Challenge 2 content"
  "17-aeimathes|PHASE 13 APPROVED by Zeus — Begin architecture sprint"
)

# Dispatch all in tight loop
for PAIR in "${MISSIONS[@]}"; do
  IFS='|' read SESSION MSG <<< "$PAIR"
  echo "[$(date '+%H:%M:%S')] Dispatching to $SESSION..."
  tmux send-keys -t "$SESSION" "$MSG" Enter
  sleep 0.1  # Small delay to prevent pane overflow
  tmux send-keys -t "$SESSION" "" Enter
done

echo "All missions dispatched (synchronized at $(date '+%H:%M:%S'))"
```

---

## Why This Matters

**Scenario**: Zeus approves Phase 13 and needs to:
- Tell Codex-01: "You're still on Challenge 2, Phase 13 prep coming after"
- Tell Aeimathes: "Phase 13 approved, you're the lead, begin architecture"
- Tell Tham: "Fleet status: Challenge 2 on track, Phase 13 greenlit"

If these are sent individually over 30 seconds:
- Codex might start Phase 13 work before seeing Challenge 2 mission
- Aeimathes might hesitate on architecture because Tham hasn't confirmed yet
- Tham might think we're still reviewing Phase 13

If sent in a batch loop over 2 seconds:
- All three receive their briefs in the same temporal window
- Fleet state is synchronized
- Each oracle knows others have been briefed (because they see coordinated action)

---

## Variations

### With confirmation handshake
```bash
# After sending all missions, confirm in reverse order
for SESSION in "${SESSIONS[@]}"; do
  tmux send-keys -t "$SESSION" "Ready?" Enter
  # In real use, would wait for response
done
```

### With audit trail
```bash
# Log dispatch for retrospective/audit
DISPATCH_LOG="/route/mission-control/ψ/memory/logs/dispatch-$(date +%s).log"
mkdir -p "$(dirname "$DISPATCH_LOG")"

for PAIR in "${MISSIONS[@]}"; do
  IFS='|' read SESSION MSG <<< "$PAIR"
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
  echo "$TIMESTAMP | $SESSION | $MSG" | tee -a "$DISPATCH_LOG"
  tmux send-keys -t "$SESSION" "$MSG" Enter
  tmux send-keys -t "$SESSION" "" Enter
done
```

### Error handling
```bash
# Check if session exists before sending
for PAIR in "${MISSIONS[@]}"; do
  IFS='|' read SESSION MSG <<< "$PAIR"
  if tmux list-sessions -F '#{session_name}' | grep -q "^${SESSION#*:}"; then
    tmux send-keys -t "$SESSION" "$MSG" Enter
    tmux send-keys -t "$SESSION" "" Enter
  else
    echo "⚠️ Session $SESSION not found (skipping)"
  fi
done
```

---

## Related Patterns

- [[feedback-tmux-sendkeys-pattern]] — Always follow send-keys with empty Enter
- [[feedback-agent-watchdog-lesson]] — Agents go silent without human trigger; check back 3-5 min
- [[feedback-marcuzx-orchestrator-rule]] — Zeus/orchestrator only spawns panes + sends messages, never executes directly

---

## Outcome (This Session)

Used in Zeus session aa8878a0 to dispatch Challenge 2 (Codex-01 + Khun-Ram) and Phase 13 (Aeimathes) in a coordinated batch. All three oracles entered "Working" state within 7 seconds of dispatch, confirming synchronized context receipt.

---

*Documented by ธาม-Zeus · Session aa8878a0 · 2026-06-12*
