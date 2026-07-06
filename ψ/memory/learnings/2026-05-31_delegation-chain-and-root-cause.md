---
pattern: Surface root cause before delegating — cascade through agents only after human confirms priority
date: 2026-05-31
source: rrr: mission-control
concepts: [delegation, rate-limit, root-cause, governance, agent-chain]
---

# Delegation Pattern: Root Cause First, Then Delegate

When a primary agent hits a rate limit or session limit, the reflex is to cascade to the next available agent. This is the wrong default.

## The Correct Pattern

1. **Identify root cause first** — what is the actual blocker? (Node version, missing key, wrong environment?)
2. **Surface to human** — "Primary agent rate-limited. Root cause is X. Options: wait for reset / use WSL directly / try Y"
3. **Human decides priority** — then delegate if still needed

## Why This Matters

A 3-hop cascade (luxi → codex-01 → OpenAI Codex CLI) consumed significant context and time only to discover that the real issue was Node 20 vs 22 — something detectable in the first 30 seconds of investigation.

## Windows Binary in WSL = Windows Shell Context

Any binary at `/mnt/c/` or installed via Windows Volta runs in Windows shell context, not WSL bash. This means:
- Node version = Windows Node (may differ from WSL Node)
- File paths = Windows paths (D:\...)
- Shell commands = cmd.exe or PowerShell

Always verify execution environment before delegating terminal work to a Windows-path binary.

## How to Apply

Before spawning any agent to fix an environment issue:
1. `node --version` in WSL context vs Windows context
2. `which <tool>` to confirm path prefix
3. If tool is in `/mnt/c/` or `/mnt/d/` → it runs Windows context
