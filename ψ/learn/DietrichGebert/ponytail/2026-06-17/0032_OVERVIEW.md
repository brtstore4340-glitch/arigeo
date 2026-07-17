---
name: 0032-overview
description: **Core artifact:** `AGENTS.md` — a decision ladder the agent climbs before wri
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-15
  source: fleet-memory
---

# ponytail — Overview

**What:** A portable "lazy senior dev" ruleset/skill that makes an AI coding agent write the *minimum* code. Tagline: "He says nothing. He writes one line. It works." Ships the SAME ruleset to **13 agents** (Claude, Codex, Gemini, Cursor, Windsurf, Kiro, opencode, openclaw, Copilot, cline, pi, …) via per-tool plugin manifests.

**Core artifact:** `AGENTS.md` — a decision ladder the agent climbs before writing code:
1. Does this need to exist? (YAGNI) 2. stdlib already does it? 3. native platform feature? 4. already-installed dep? 5. can it be one line? 6. only then write minimal code.
Plus rules: no unrequested abstractions/deps/boilerplate, deletion>addition, boring>clever, mark shortcuts with a `ponytail:` comment naming the ceiling + upgrade path. NOT lazy about: input validation at trust boundaries, error handling, security, accessibility, hardware calibration — and every non-trivial change leaves ONE runnable check.

**Claimed results:** 80-94% less code, 47-77% cheaper, 3-6× faster vs no-skill agent (median of 10 runs across Haiku/Sonnet/Opus; reproducible via `npx promptfoo eval -c benchmarks/promptfooconfig.yaml`).

## Structure
- `AGENTS.md` — the ruleset (source of truth; re-injected each turn)
- per-tool configs: `.claude-plugin/`, `.codex-plugin/`, `.opencode/`, `.openclaw/`, `.cursor/`, `.windsurf/`, `.kiro/`, `.clinerules/`, `.github/copilot-instructions.md`, `gemini-extension.json`, `pi-extension/`
- `hooks/` — ponytail-activate.js, ponytail-config.js, ponytail-statusline.sh, hooks.json
- `benchmarks/` — promptfoo configs + LOC/cost/behavior measurement (claude-email.js, loc.js, correctness.js, robustness-audit.js)
- `tests/` — per-tool plugin tests (opencode/openclaw/gemini/copilot/hooks/behavior/commands)
- `docs/agent-portability.md` — how the cross-tool portability works
- `examples/` — before/after survivors

## How to use
Install the plugin/extension for your agent tool (each .X-plugin dir / extension.json); the ruleset auto-injects each turn. The `ponytail:` comments in output mark intentional simplifications + their upgrade path.

## Notable
- Single ruleset, 13 delivery targets = strong "agent portability" pattern (one AGENTS.md → many tool-specific manifests + hooks).
- Honest about overhead: re-injecting the ruleset each turn can outweigh savings on one short prompt.
- Relevant to our fleet: same philosophy as token-restrict / "min token max output" doctrine.
