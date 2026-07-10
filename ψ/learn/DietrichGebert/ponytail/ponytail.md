# Ponytail Learning Index

## Source
- **Origin**: ./origin/ → /home/user/ghq/github.com/DietrichGebert/ponytail
- **GitHub**: https://github.com/DietrichGebert/ponytail
- **Status**: Actively maintained (last updated 2026-06-17)

---

## Explorations

### 2026-06-18 · 11:33 (default mode — 3 agents)

#### Generated Documentation
- [[2026-06-18/1133_QUICK-REFERENCE|Quick Reference]] ✅
- Architecture Explorer (in progress)
- Code Snippets Collector (in progress)

---

## Key Insights

**Ponytail** is a "lazy senior dev mode" Pi extension for Claude AI agents that injects a laziness ruleset into system prompts to enforce minimal, efficient code.

1. **The Core Mechanism**: A 6-rung decision ladder (YAGNI → stdlib → platform → installed deps → one-liner → minimum code) that gets injected via hooks before every agent response, with 3 intensity levels (lite/full/ultra) for mode-specific filtering.

2. **Portability via Adapters**: Single AGENTS.md synced across 13+ host platforms (Copilot, Codex, Claude Code, Cursor, Windsurf, etc.) with drift-checking scripts ensuring consistency across machines.

3. **Proven Impact**: 80–94% code reduction measured empirically with PromptFoo config on Claude Haiku/Sonnet/Opus, with benchmarks validating that code actually follows rules (not just short for shortness' sake).

4. **Zero Production Dependencies**: Built on Node.js built-ins only, multi-language support (JS, Python, Bash, PowerShell), stateless hooks + persistent config for cross-session mode tracking.

---

## Session Metadata

| Field | Value |
|-------|-------|
| Learned | 2026-06-18 |
| Time | 11:33 UTC+7 |
| Mode | Default (3 agents) |
| Agents | Architecture, Code Snippets, Quick Reference |
| Status | 1/3 files visible |

---

## Architecture Overview (Agent Report)

From Architecture Explorer agent:
- **Directory Structure**: Portability-first organization with hooks, skills, adapters, tests, benchmarks
- **Entry Points**: SessionStart hook, UserPromptSubmit hook, Pi extension event handlers
- **Core Abstractions**: 6-rung decision ladder, intensity levels (lite/full/ultra), mode tracking + persistence
- **Tech Stack**: Node.js built-ins only, multi-language support, 13+ host platforms

---

## Code Patterns (Agent Report)

From Code Snippets Collector agent:
- CSV sum example: 20 → 3 lines reduction (demonstration of laziness impact)
- Session mode tracking via backward-walking through history
- Triple-tier config resolution (env → file → hardcoded)
- Graceful degradation: missing files never break features
- Regex-based markdown parsing for instruction filtering

---

## Quick Reference

**What it does**: Injects a laziness ruleset into Claude's system prompt to enforce minimal code.

**Installation**: Pi extension (available in Claude Code, Cursor, Codex, etc.)

**Key Features**:
- Laziness ladder: 6-rung decision tree for code choices
- Intensity levels: lite/full/ultra for different contexts
- Multi-platform: Works across Copilot, Claude Code, Codex, etc.
- Zero dependencies: Built on Node.js only
- Benchmarked: Validated with PromptFoo (80–94% reduction)

**Usage**: Enable via mode command, configure via `~/.config/ponytail/config.json`

---

## Next Steps

1. Full documentation files should appear in `2026-06-18/` folder
2. Link to complete reports when available
3. Run `/learn --deep` for 5-agent exploration if more detail needed
4. Track learning via `/trace ponytail`

