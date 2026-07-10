---
name: oracle-zeus-lean-mode
description: Zeus oracle merged with Tham under Lean Mode until org scales
metadata:
  type: reference
---

# Zeus Oracle — Lean Mode Status

**Status**: Merged with Tham (ธาม-Zeus)  
**Created**: 2026-05-31  
**Tmux Session**: 10-zeus (attached)  
**Git Submodule**: None (intentional — shared session)

## Lean Mode Architecture

Zeus and Tham are **merged into single oracle identity** (ธาม-Zeus) for cost efficiency:

- **Single tmux session** runs both
- **Shared memory** (ψ/ directory)
- **Shared CLAUDE.md** (tham-oracle/CLAUDE.md)
- **Split roles**: Tham (Chief of Staff) + Zeus (Arch Authority)
- **Revert plan**: Separate to zeus-oracle submodule when org scales

## Why Lean Mode?

- Eliminates duplicate context costs (2 sessions → 1)
- Shared decision-making (Staff + Architect in one mind)
- Faster coordination (no inter-oracle messaging)
- Scales back when headcount increases

## Conversation History

- Created as merged identity: 2026-05-31
- Documented in oracle-identity.md
- Proof: tmux 10-zeus session with shared ψ/

## Future Split

When organization needs separate Architect oracle:
1. Create zeus-oracle submodule
2. Copy ψ/ state + relevant memory
3. Assign separate responsibilities
4. Keep tmux coordination bridge (temporary)

## Current Proof

- tmux list-sessions: `10-zeus: 1 windows (attached)`
- Git config: No zeus-oracle entry (intentional)
- Memory: oracle-identity.md references Lean Mode
- Status: Active and functioning
