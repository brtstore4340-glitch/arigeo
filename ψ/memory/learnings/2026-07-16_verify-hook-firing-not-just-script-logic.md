---
pattern: Verifying a hook's shell script runs correctly is not the same as verifying the hook actually fires — test the real invocation path, not a manual simulation
date: 2026-07-16
source: rrr: zeus-oracle
concepts: [hooks, claude-code, testing, verification, matcher-syntax]
---

# Verify hook firing via real invocation, not manual script simulation

Two separate hooks in `.claude/settings.json` were both silently broken, and both bugs were only caught by testing the *actual* hook-execution path instead of the shell command in isolation.

## What happened

1. **SessionStart hook**: referenced `${CLAUDE_PROJECT_ROOT}`, which is not a real Claude Code environment variable (the real one is `CLAUDE_PROJECT_DIR`). Manually exporting `CLAUDE_PROJECT_ROOT` and running the script directly "worked" — because the tester supplied the variable themselves, not because the hook was correctly wired. Only running a real headless session (`claude -p --debug hooks --debug-file <path>`) and grepping the debug log for the hook's dispatch line revealed the true failure.

2. **PreToolUse hook**: matcher was `"Skill(fleet-awaken|awaken)"`, borrowing the `Tool(pattern)` syntax used in permission `allow`/`deny` rules. Hook matchers only exact-match the tool name itself — they do not support filtering by tool-input arguments this way. This hook had never fired, for any skill, ever. Confirmed via changelog: parenthetical arg-filtering is documented for path-based tools like `Edit(src/**)`, not for arbitrary tool-input fields like `Skill`'s skill name.

## The generalizable rule

- Don't verify a hook by running its command string manually with hand-set env vars — that only proves the script's internal logic, not that the hook-runner invokes it correctly.
- Use the real invocation path: `claude -p --debug hooks --debug-file <path>` for a one-shot headless session, then grep the debug log for the specific hook name / tool dispatch. Test both a positive case (should fire) and a negative case (should stay silent) when the matcher/filter logic matters.
- Hook `matcher` fields match tool names only (exact match, or path patterns for path-based tools like `Edit`/`Read`/`Bash`). To filter on a non-path tool argument (like `Skill`'s `skill` parameter), match the bare tool name and filter inside the hook command by reading the tool's stdin JSON (`tool_input.<field>`).
- Don't assume common CLI tools (`jq`, etc.) are installed in the target execution environment before depending on them inside a hook command — check with `which` first. A hook with a broad matcher that then crashes on a missing dependency is worse than one that silently never fires.
