# Ponytail Architecture Analysis

**Project**: DietrichGebert/ponytail  
**Analysis Date**: 2026-06-17  
**Scope**: Cross-tool agentic ruleset distribution

---

## Executive Summary

Ponytail is a **13-agent-portable agentic ruleset** that enforces "lazy senior developer" constraints (YAGNI, stdlib-first, zero unnecessary abstractions). Its core innovation is **single-source-of-truth architecture** where one ruleset (AGENTS.md + skills/) gets injected into fundamentally different agent ecosystems (Claude Code, Codex, OpenCode, Gemini, Cursor, GitHub Copilot, etc.) via **thin, tool-specific adapters**.

The result: **80-94% less code** (vs. unconstrained agents), **3-6× faster**, **47-77% cheaper**, and **mode persistence** across sessions (lite/full/ultra/off intensity levels).

---

## Directory Structure & Portability Philosophy

Ponytail's layout embodies **adapter-per-agent-family** organization:

```
ponytail/
├── AGENTS.md                      # ← SOURCE OF TRUTH (compact ruleset)
├── package.json                   # Metadata (pi-package ref)
├── opencode.json                  # OpenCode manifest
├── gemini-extension.json          # Gemini CLI manifest
│
├── .claude-plugin/                # Claude Code adapter
│   ├── marketplace.json           # Marketplace discovery
│   └── plugin.json                # Plugin metadata
│
├── .codex-plugin/                 # Codex adapter
│   └── plugin.json                # Plugin metadata + skill path
│
├── .opencode/
│   ├── plugins/
│   │   └── ponytail.mjs          # ← ES module plugin (injects via experimental.chat.system.transform)
│   └── command/                   # Command handlers
│
├── .cursor/rules/                 # Cursor IDE rule (static)
│   └── ponytail.mdc
├── .windsurf/rules/               # Windsurf IDE rule (static)
│   └── ponytail.md
├── .clinerules/                   # Cline IDE rule (static)
│   └── ponytail.md
├── .kiro/steering/                # Kiro agent steering rule (static)
│   └── ponytail.md
│
├── .github/
│   ├── copilot-instructions.md    # GitHub Copilot instruction file
│   └── plugin/                    # Copilot CLI plugin metadata
│
├── hooks/                         # ← SHARED LIFECYCLE (Node.js runtime)
│   ├── ponytail-activate.js       # SessionStart hook: detects mode, emits ruleset
│   ├── ponytail-config.js         # Mode resolution (env var → config file → default)
│   ├── ponytail-instructions.js   # Instruction builder (filters by intensity)
│   ├── ponytail-runtime.js        # Flag file I/O, platform detection
│   ├── ponytail-mode-tracker.js   # UserPromptSubmit hook: tracks mode changes
│   ├── ponytail-statusline.sh/.ps1# Shell statusline formatter
│   └── hooks.json                 # Hook manifest (Claude Code, Codex)
│
├── skills/                        # ← PORTABLE BEHAVIORS (agent skill files)
│   ├── ponytail/SKILL.md          # Main lazy-mode behavior (mode-filtered)
│   ├── ponytail-review/SKILL.md   # Over-engineering diff reviewer
│   ├── ponytail-audit/SKILL.md    # Whole-repo over-engineering scanner
│   ├── ponytail-debt/SKILL.md     # Harvest `ponytail:` shortcuts into ledger
│   └── ponytail-help/SKILL.md     # Quick reference
│
├── .agents/rules/                 # Antigravity/VS Code integration
│   └── (links to AGENTS.md)
│
├── pi-extension/                  # Pi package extension
│   ├── package.json
│   └── index.js                   # Registers skills, injects via hooks
│
├── commands/                      # Cross-agent command definitions (.toml)
├── docs/agent-portability.md      # Adapter mapping table (THIS guide)
├── benchmarks/                    # Correctness + latency + cost validation
└── tests/                         # Plugin and hook correctness tests
```

**Key insight**: **Adapters are thin**. Heavy lifting (ruleset content, instruction filtering, mode resolution, statusline formatting) lives in `hooks/` and `skills/`. Each adapter references those shared paths:

- **Claude Code/Codex**: hooks.json → ponytail-activate.js/ponytail-mode-tracker.js
- **OpenCode**: ponytail.mjs ESM plugin → requires ponytail-instructions.js (CommonJS bridge)
- **pi**: pi-extension/index.js → skills/ + hooks/
- **Cursor/Windsurf/Cline/Kiro**: Static copies of same ruleset text (kept aligned via `scripts/check-rule-copies.js`)
- **Gemini CLI**: gemini-extension.json contextFileName → AGENTS.md
- **GitHub Copilot**: .github/copilot-instructions.md (static copy)

---

## Core Abstractions

### 1. Single Ruleset Source (AGENTS.md)

**Location**: `/AGENTS.md` (27 lines)

```markdown
# Ponytail, lazy senior dev mode

You are a lazy senior developer...

Before writing any code, stop at the first rung that holds:
1. Does this need to exist at all? (YAGNI)
2. Does the standard library do this? Use it.
3. Does a native platform feature cover it? Use it.
4. Does an already-installed dependency solve it? Use it.
5. Can this be one line? Make it one line.
6. Only then: write the minimum code that works.

Rules:
- No abstractions that weren't explicitly requested.
- No new dependency if it can be avoided.
- No boilerplate nobody asked for.
- Deletion over addition. Boring over clever. Fewest files possible.
...
```

This is **always-on context** for agents that support project instructions (Antigravity, VS Code + Codex, GitHub Copilot fallback, any agent reading `.cursorrules`-like files).

### 2. Instruction Builder (ponytail-instructions.js)

**Location**: `/hooks/ponytail-instructions.js` (90+ lines)

**Purpose**: Builds intensity-filtered instructions from skill frontmatter.

**Key functions**:
- `filterSkillBodyForMode(body, mode)`: Parses SKILL.md frontmatter and filters table rows/examples by mode
- `getPonytailInstructions(mode)`: Loads `skills/ponytail/SKILL.md`, filters to mode, falls back to generated text if file missing

**Mode filtering logic**:
```javascript
// SKILL.md has table rows like:
// | **lite** | Build what's asked, name lazier alternative...
// | **full** | Enforce the ladder...
// | **ultra** | YAGNI extremist...

// Filter keeps only the row matching (mode === 'lite|full|ultra')
// Sections without mode labels (normal rules) always kept
```

**Fallback**: If skills/ unavailable, generates compact instructions from hardcoded template (getFallbackInstructions).

### 3. Mode Configuration Resolution (ponytail-config.js)

**Location**: `/hooks/ponytail-config.js` (100+ lines)

**Resolution hierarchy** (highest to lowest priority):
1. `PONYTAIL_DEFAULT_MODE` environment variable
2. Config file at `~/.config/ponytail/config.json` (or XDG_CONFIG_HOME override, or %APPDATA% on Windows)
   - Field: `defaultMode` (must be 'lite', 'full', 'ultra', 'off', or 'review')
3. Hardcoded default: `'full'`

**Cross-platform paths**:
- Linux/macOS: `~/.config/ponytail/config.json`
- Windows: `%APPDATA%\ponytail\config.json`
- XDG override: `$XDG_CONFIG_HOME/ponytail/config.json`

**Validation**: `normalizeMode()` restricts runtime modes to `['off', 'lite', 'full', 'ultra']`; `normalizePersistedMode()` also accepts `'review'` (independent skill-only mode).

### 4. Lifecycle Hooks (Claude Code / Codex)

**Files**: `/hooks/hooks.json`, `ponytail-activate.js`, `ponytail-mode-tracker.js`

**Injection points**:

**SessionStart** (startup, resume, clear, compact):
1. Run `ponytail-activate.js` (5s timeout)
2. Detect default mode (via ponytail-config.js)
3. Write flag file at `~/.claude/.ponytail-active` (for statusline badge)
4. Emit ruleset as hidden SessionStart context via `getPonytailInstructions(mode)`
5. Detect missing statusline config → nudge user to add statusline command to settings.json

**UserPromptSubmit** (every message):
1. Run `ponytail-mode-tracker.js` (5s timeout)
2. Detect if user switched modes (by reading flag file)
3. Persist mode for next turn

**Why dual hooks**: SessionStart injects the ruleset once per session; UserPromptSubmit tracks mode changes so `/ponytail ultra` takes effect on the next message, not after a session restart.

### 5. Statusline Integration

**Files**: `/hooks/ponytail-statusline.sh` (bash), `ponytail-statusline.ps1` (PowerShell)

**Purpose**: Display badge like `[PONYTAIL]` or `[PONYTAIL:ULTRA]` in Claude Code status bar.

**Mechanism**:
- Reads flag file `~/.claude/.ponytail-active`
- Outputs bash/PowerShell command that prints badge
- User adds command to `~/.claude/settings.json`:
  ```json
  "statusLine": { "type": "command", "command": "bash ~/.claude/ponytail-statusline.sh" }
  ```

### 6. Plugin System (OpenCode Example)

**Location**: `/.opencode/plugins/ponytail.mjs` (65 lines, ES module)

```javascript
export default async ({ client } = {}) => {
  const readMode = () => fs.readFileSync(statePath, 'utf8').trim() || getDefaultMode();
  const writeMode = (mode) => fs.writeFileSync(statePath, mode);

  return {
    // Append ruleset to system prompt every turn
    'experimental.chat.system.transform': async (_input, output) => {
      const mode = readMode();
      if (mode === 'off') return;
      output.system.push(getPonytailInstructions(mode));
    },

    // Persist `/ponytail <level>` command
    'command.execute.before': async (input) => {
      if (input.command !== 'ponytail') return;
      const mode = normalizePersistedMode(input.arguments.trim());
      writeMode(mode);
    },
  };
};
```

**Key**: Uses shared `ponytail-instructions.js` (CommonJS → ES bridge via `createRequire`), keeps state in `.config/opencode/.ponytail-active` (OpenCode-specific).

---

## Entry Points (How Each Tool Loads the Ruleset)

| Agent | Entry Point | Mechanism | Effect |
|-------|------------|-----------|--------|
| **Claude Code** | `.claude-plugin/plugin.json` | Plugin install → hooks.json → SessionStart hook runs ponytail-activate.js | Ruleset emitted as hidden context; statusline badge option nudged |
| **Codex** | `.codex-plugin/plugin.json` | Plugin marketplace → hooks.json + skills/ directory path | Ruleset injected per-turn + `/ponytail` commands available |
| **OpenCode** | `.opencode/plugins/ponytail.mjs` + `opencode.json` | Server plugin registered in opencode.json | `experimental.chat.system.transform` appends ruleset to system prompt every turn |
| **pi (agent harness)** | `pi-extension/index.js` + `package.json` | Package extension declares `pi.extensions` + `pi.skills` | Hooks registered via pi runtime; skills auto-discovered |
| **Gemini CLI** | `gemini-extension.json` | Extension manifest points `contextFileName` → `AGENTS.md` | AGENTS.md loaded as always-on context + `/ponytail` commands auto-registered |
| **Antigravity CLI** | `gemini-extension.json` → `.agents/rules/` | Same as Gemini (migration path) | Same as Gemini |
| **Cursor IDE** | `.cursor/rules/ponytail.mdc` | Project rule auto-loaded (no setup required) | Mdc format (Cursor syntax) → always-on rule in composer |
| **Windsurf IDE** | `.windsurf/rules/ponytail.md` | Project rule auto-loaded | Md format → always-on rule |
| **Cline IDE** | `.clinerules/ponytail.md` | Project rule auto-loaded (copies into ~/.clinerules/ or project .clinerules/) | Always-on rule |
| **Kiro agent** | `.kiro/steering/ponytail.md` | Steering rule (copy to ~/.kiro/steering/ or project .kiro/steering/) | Always-on rule |
| **GitHub Copilot (editor)** | `.github/copilot-instructions.md` | Repository instruction file auto-discovered | Always-on rule (instruction-tier, no mode switching) |
| **GitHub Copilot CLI** | `.github/plugin/plugin.json` or `.github/copilot-instructions.md` | Plugin or fallback instructions | Full plugin adds `/ponytail` modes + hooks; fallback is instruction-only |
| **VS Code + Codex extension** | `AGENTS.md` or `~/.codex/AGENTS.md` (global) | Extension reads AGENTS.md | Always-on rule |
| **Generic agents** | `AGENTS.md` or `skills/*/SKILL.md` (copy) | Manual integration | Copy text into agent config |

**Unifying pattern**: All entry points converge on one of three integration strategies:
1. **Plugin + hooks** (Claude Code, Codex, OpenCode, pi): Full mode switching + persistence
2. **Manifest file** (Gemini, Antigravity, GitHub Copilot CLI, Cursor, Windsurf, Cline, Kiro): Static or plugin-registered
3. **Instructions/rules file** (VS Code + Codex, Copilot fallback): Copy AGENTS.md or skills text

---

## Ruleset Injection Per Turn (The Persistence Model)

### Claude Code / Codex Flow

```
1. Session starts → SessionStart hook runs ponytail-activate.js
   ↓
2. ponytail-activate.js calls getPonytailInstructions(mode) → ruleset emitted as hidden context
   ↓
3. User sends message → UserPromptSubmit hook runs ponytail-mode-tracker.js
   ↓
4. If user said `/ponytail ultra` → mode flag updated for next turn
   ↓
5. Next session start → Ruleset injected at intensity level from flag file
   ↓
6. **Persistence**: Mode persists across reboots (stored in ~/.claude/.ponytail-active or config file)
```

**Key insight**: Ruleset re-injects **every turn** (via hook, not one-time system prompt). This prevents drift — if an agent stops following the rules mid-session, the next prompt re-establishes the constraints.

### OpenCode Flow

```
1. Server plugin instantiated → registers `experimental.chat.system.transform` hook
   ↓
2. Every chat turn:
   a. Read mode from ~/.config/opencode/.ponytail-active
   b. Append getPonytailInstructions(mode) to output.system
   ↓
3. User sends `/ponytail lite` → command.execute.before hook writes new mode to flag file
   ↓
4. Next turn: mode picked up and applied immediately
```

### Static Rules (Cursor, Windsurf, etc.)

```
1. Ruleset copied to .cursor/rules/ponytail.mdc (or .windsurf/rules/ponytail.md)
   ↓
2. IDE loads on startup (agent composition always-on)
   ↓
3. No mode switching or persistence (static)
   ↓
4. To update: run `node scripts/check-rule-copies.js` to sync against AGENTS.md
```

---

## Dependencies & Package Structure

**File**: `package.json`

```json
{
  "name": "ponytail",
  "version": "0.1.0",
  "keywords": ["pi-package", "pi", "skills", "ponytail"],
  "scripts": {
    "test": "node --test tests/*.test.js && npm test --prefix pi-extension"
  },
  "pi": {
    "extensions": ["./pi-extension/index.js"],
    "skills": ["./skills"]
  }
}
```

**No runtime dependencies** (zero npm packages beyond Node.js stdlib). All hook logic uses only `fs`, `path`, `os` stdlib.

**pi metadata**:
- `pi.extensions`: Registers pi-extension/index.js as pi agent extension
- `pi.skills`: Points pi to `skills/` directory for auto-discovery

**Tests**: Node.js --test (built-in; no test framework dependency).

---

## Skills System (Portable Behaviors)

**Location**: `/skills/` directory

Each skill is a **SKILL.md file with YAML frontmatter** (name, description, license):

### ponytail/SKILL.md
- **Purpose**: Main lazy-mode enforcement (mode-filtered)
- **Frontmatter**: name, description, license, triggers (`ponytail`, `be lazy`, `yagni`, etc.)
- **Content**: Detailed rules, intensity table (lite/full/ultra rows), worked examples, boundaries
- **Mode filtering**: Skill loader filters table rows and examples by intensity level (lite/full/ultra)

### ponytail-review/SKILL.md
- **Purpose**: Review a diff for over-engineering, output delete-list
- **Triggers**: `ponytail-review`, `/ponytail-review` (Codex), `@ponytail-review` (Codex)

### ponytail-audit/SKILL.md
- **Purpose**: Scan whole repo for over-engineering patterns

### ponytail-debt/SKILL.md
- **Purpose**: Harvest `ponytail:` comments into a tracked ledger (debt tracker for deferred upgrades)

### ponytail-help/SKILL.md
- **Purpose**: Quick command reference

**How skills load**:
- Claude Code / Codex / pi: Agent auto-discovers skills from skills/ directory
- Gemini CLI: Auto-discovers via extension.json
- OpenCode: Must be explicitly installed (not auto-discovered); ponytail.mjs plugin loads AGENTS.md instead

---

## How the Ruleset is Re-Injected Each Turn

### Conceptual Model

```
┌─────────────────────────────────────────────────┐
│ Agent Framework (Claude Code / Codex / etc.)    │
├─────────────────────────────────────────────────┤
│                                                 │
│  System Prompt Builder                          │
│  ├─ Agent's defaults                            │
│  ├─ Project instructions (AGENTS.md, etc.)      │
│  ├─ Active skill (ponytail/SKILL.md filtered)   │ ← Re-inserted every turn
│  ├─ User's message                              │
│  └─ Hidden SessionStart context                 │ ← Hook emits here
│                                                 │
└─────────────────────────────────────────────────┘
     ↓
  LLM (Claude, Gemini, etc.)
     ↓
  Response respects `ponytail:` constraints
```

**For Claude Code/Codex**:
- SessionStart hook runs → ponytail-activate.js → emits ruleset as hidden context
- This context is non-interactive (user doesn't see it) but informs the model
- Re-fires on every session start (startup, resume, clear, compact)

**For OpenCode/pi**:
- System prompt transform appends ruleset programmatically before each LLM call
- No "hidden context" concept; it's part of the visible system prompt

**For static rules (Cursor, Windsurf, Kiro)**:
- IDE loads rule once at startup; no re-injection
- Rule text must be manually synchronized (check-rule-copies.js validates alignment)

### Why Re-Injection Matters

1. **Prevents drift**: If agent starts building over-engineered solution mid-session, next prompt re-establishes "lazy" constraints
2. **Survives mode switches**: User can `/ponytail ultra` and next message enforces stricter YAGNI
3. **Fallback reliability**: If agent "forgets" lazy mindset, ruleset reactivates automatically

---

## Mode Persistence Across Sessions

### State Storage

**Claude Code**: `~/.claude/.ponytail-active` (flag file written by SessionStart hook)

**OpenCode**: `~/.config/opencode/.ponytail-active` (flag file written by command hook)

**Config-file approach**: `~/.config/ponytail/config.json` (shared across all tools):
```json
{ "defaultMode": "ultra" }
```

**Environment var** (highest priority): `PONYTAIL_DEFAULT_MODE=lite`

### Resolution on Startup

1. Check `PONYTAIL_DEFAULT_MODE` env var
2. Check config file (`~/.config/ponytail/config.json`, XDG override, Windows %APPDATA%)
3. Fallback to hardcoded `'full'`
4. Validate against allowed modes

### Mode Switch Persistence

- User types `/ponytail ultra` → hook writes "ultra" to flag file
- Flag file read on next turn → intensity changes immediately
- Persists across session closes (stored on disk)

---

## Testing & Validation

**Location**: `/tests/` directory

- `hooks.test.js`: Tests hook.json parsing, ponytail-config.js resolution, ponytail-instructions.js filtering
- `openclaw-skills.test.js`: Validates OpenClaw skill package generation
- `copilot-plugin.test.js`: GitHub Copilot plugin correctness
- `gemini-extension.test.js`: Gemini CLI extension loading
- `behavior.test.js`: End-to-end behavior (mode switching, persistence)
- `commands.test.js`: `/ponytail` command parsing and execution
- `correctness.test.js`: Benchmarks (code size, latency, cost)

**Validation invariant** (from scripts/check-rule-copies.js):
- AGENTS.md content must align with all static copies (.cursor, .windsurf, .clinerules, .github/copilot-instructions.md)
- Fails CI if drift detected

---

## Cross-Tool Portability: The Design Pattern

### Principle: Adapter + Shared Core

**Core** (tool-agnostic, always maintained):
- `AGENTS.md` (compact ruleset)
- `hooks/` (Node.js utilities for config, instructions, runtime)
- `skills/` (behavior definitions, mode-filtered)

**Adapters** (thin, tool-specific):
- `.claude-plugin/plugin.json` → references hooks.json
- `.codex-plugin/plugin.json` → references hooks.json + skills/
- `.opencode/plugins/ponytail.mjs` → requires ponytail-instructions.js (CommonJS bridge)
- `.cursor/rules/ponytail.mdc` → static copy (kept in sync by scripts/check-rule-copies.js)
- `gemini-extension.json` → contextFileName: "AGENTS.md"

**Invariant**: All adapters **reference the core**, never duplicate. If duplicate (static copy), synchronization job validates alignment.

### Why This Works

1. **Single source of truth**: Edit AGENTS.md or skills/ once; all adapters pick it up (or scripts/ validates alignment)
2. **Portability**: No tool-specific bloat; a new agent type adds a thin adapter file, not a new ruleset
3. **Testability**: Hook logic (ponytail-config.js, ponytail-instructions.js) is tool-agnostic; pi tests validate all agents equally
4. **Scalability**: 13 agents, 1 ruleset, zero duplication

---

## Appendix: File Mapping by Agent

| Tool | Load Sequence | Files |
|------|---------------|-------|
| Claude Code | Marketplace → plugin.json → hooks.json (SessionStart: ponytail-activate.js; UserPromptSubmit: ponytail-mode-tracker.js) | .claude-plugin/, hooks/, skills/ |
| Codex | Marketplace → plugin.json → hooks.json + skills/ path | .codex-plugin/, hooks/, skills/ |
| OpenCode | opencode.json → plugin: ./.opencode/plugins/ponytail.mjs | .opencode/plugins/, hooks/ (via require), skills/ |
| pi | package.json → pi.extensions + pi.skills | pi-extension/, hooks/, skills/ |
| Gemini CLI | gemini-extension.json → contextFileName: AGENTS.md | AGENTS.md, skills/ (auto-discover) |
| Cursor | .cursor/rules/ponytail.mdc (auto-load) | .cursor/rules/ |
| Windsurf | .windsurf/rules/ponytail.md (auto-load) | .windsurf/rules/ |
| Cline | .clinerules/ponytail.md (copy to ~/.clinerules/ or project) | .clinerules/ |
| Kiro | .kiro/steering/ponytail.md (copy to ~/.kiro/steering/ or project) | .kiro/steering/ |
| GitHub Copilot (editor) | Repository discovers .github/copilot-instructions.md | .github/copilot-instructions.md |
| GitHub Copilot CLI | .github/plugin/plugin.json (full) or .github/copilot-instructions.md (fallback) | .github/ |
| VS Code + Codex extension | Codex extension reads AGENTS.md (project root or ~/.codex/AGENTS.md global) | AGENTS.md |

---

## Conclusion

Ponytail demonstrates **expert-level agent portability architecture**: one ruleset, 13 agents, zero duplication. The key innovations are:

1. **Thin adapters** (plugin.json, .mjs bridges, static copies) that reference shared core
2. **Shared instruction builder** (ponytail-instructions.js) for mode filtering and persistence
3. **Lifecycle hooks** as injection points (SessionStart, UserPromptSubmit, system prompt transforms)
4. **Mode persistence** across tool boundaries via environment variables and config files
5. **Synchronization validation** (scripts/check-rule-copies.js) for static copies

The architecture prioritizes **maintainability** (edit once, apply everywhere) and **reliability** (re-injection prevents drift, fallback instructions if skills unavailable).

