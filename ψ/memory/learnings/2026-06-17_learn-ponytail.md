---
pattern: "Learned ponytail: one AGENTS.md 'lazy senior dev' ruleset ported to 13 AI agents; decision-ladder (YAGNI→stdlib→platform→dep→one-line) cuts 80-94% code; marks shortcuts with ponytail: comment + upgrade path"
date: 2026-06-17
source: "learn: DietrichGebert/ponytail"
concepts: ["learn", "codebase", "agent-portability", "prompt-ruleset", "minimal-code", "token-efficiency"]
---

# Learned ponytail
Portable "lazy senior dev" skill: a single `AGENTS.md` ruleset (climb the cheapest rung: YAGNI → stdlib → native platform → installed dep → one line → minimal code) delivered to 13 agent tools via per-tool plugin manifests (.claude-plugin/.codex-plugin/.opencode/.cursor/etc) + hooks. Shortcuts are marked with a `ponytail:` comment naming the ceiling + upgrade path; non-trivial logic leaves ONE runnable check. NOT lazy about validation/security/accessibility/hardware calibration. Benchmarks (promptfoo, median of 10 across Haiku/Sonnet/Opus) claim 80-94% less code, 47-77% cheaper, 3-6× faster. Same spirit as our fleet's token-restrict / "min token max output" doctrine — worth borrowing the explicit decision-ladder + upgrade-path-comment idea.
