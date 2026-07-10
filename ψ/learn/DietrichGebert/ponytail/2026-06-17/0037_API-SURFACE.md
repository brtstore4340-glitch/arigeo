# Ponytail API & Integration Surface

**Version:** 4.7.0 | **License:** MIT | **Author:** Dietrich Gebert  
**Explore:** `/home/user/ghq/github.com/DietrichGebert/ponytail`

---

## 1. Core Ruleset Contract (AGENTS.md)

### The Portable Doctrine

**AGENTS.md** defines the lazy senior dev mode: a 6-rung ladder enforced before any code.

1. Does this need to be built at all? (YAGNI)
2. Does the standard library already do this?
3. Does a native platform feature cover it?
4. Does an already-installed dependency solve it?
5. Can this be one line?
6. Only then: write the minimum code that works.

### The `ponytail:` Comment Convention

**Ceiling + Upgrade Path Rule:** Every deliberate simplification must be marked with a `ponytail:` comment that names:
- **Ceiling:** The known limitation (e.g., "global lock", "O(n²) scan", "naive heuristic")
- **Upgrade Path:** When to revisit (e.g., "per-account locks if throughput matters")

**Format:** `# ponytail: global lock, per-account locks if throughput matters`

**Enforcement:** Shortcuts without upgrade triggers get flagged as "rot risk" — a deferral that silently becomes permanent.

### Boundaries (Never Simplify Away)

- Input validation at trust boundaries
- Error handling that prevents data loss
- Security measures
- Accessibility basics
- Calibration real hardware needs (platform is never spec-ideal)
- Anything explicitly requested by the user

**Lazy code without its check is unfinished:** Non-trivial logic leaves ONE runnable check behind (assert-based demo or one small test file; no frameworks, no fixtures). Trivial one-liners need no test.

---

## 2. Portable Behavior: The Skills Fleet

Ponytail distributes as a **skills directory** (`skills/`) that works across all agent hosts.

### Five Core Skills

#### `skills/ponytail/SKILL.md`
- **Trigger:** `/ponytail`, "be lazy", "lazy mode", "simplest solution", "minimal solution", "yagni", "do less"
- **Default Intensity:** `full`
- **Modes:** `lite` (minimal), `full` (default), `ultra` (aggressive)
- **Persistence:** ACTIVE every response, no drift. Off only: "stop ponytail" / "normal mode"
- **Escalation:** `/ponytail lite|full|ultra` to switch mid-session

#### `skills/ponytail-review/SKILL.md`
- **Purpose:** Code review focused **exclusively on over-engineering**
- **Output Format:** `L<line>: <tag> <what>. <replacement>.`
- **Tags:** `delete:`, `stdlib:`, `native:`, `yagni:`, `shrink:`
- **End Metric:** `net: -<N> lines possible.` or "Lean already. Ship."
- **Complement:** Works alongside correctness-focused reviews; only hunts complexity
- **Non-Goals:** Ignores bugs, security holes, performance (those go to normal review)

#### `skills/ponytail-debt/SKILL.md`
- **Purpose:** Harvest `ponytail:` comments into a tracked ledger
- **Input:** Grep for `(#|//) ?ponytail:` across the repo (skips `node_modules`, `.git`, build output)
- **Output Format:** `<file>:<line> — <what>. ceiling: <limit>. upgrade: <trigger>.`
- **Risk Flag:** `no-trigger` tag for rot-prone shortcuts without an upgrade path
- **End Summary:** `<N> markers, <M> with no trigger.`
- **Read-Only:** Reports only; to persist, writes `PONYTAIL-DEBT.md` on request

#### `skills/ponytail-audit/SKILL.md`
- **Purpose:** Whole-repo over-engineering audit
- **Scope:** Scans codebase for reinvented stdlib, unneeded dependencies, speculative abstractions, dead flexibility
- **Output:** Same format as ponytail-review, aggregated across entire repo
- **Deliverable:** Organized summary of what could be deleted, with replacement suggestions

#### `skills/ponytail-help/SKILL.md`
- **Purpose:** Quick reference card for the ponytail ruleset and command syntax

---

## 3. Extension/Integration Points

### The Adapter Pattern

Ponytail ships **host-specific adapters** that point to shared `skills/` and `hooks/` files. Adapters stay thin; all behavior lives in the portable skills.

| Host | Adapter Location | Integration Method | Command Support | Hooks Support |
|------|------------------|-------------------|-----------------|---------------|
| **Claude Code** | `.claude-plugin/` | Plugin install | `/ponytail` commands | `SessionStart`, `UserPromptSubmit` |
| **Codex** | `.codex-plugin/plugin.json` | Plugin install | `/ponytail` levels | Lifecycle hooks + statusline |
| **OpenCode** | `.opencode/plugins/ponytail.mjs` | Server plugin (opencode.json) | `/ponytail` mode switches | System prompt transform |
| **pi** | `pi-extension/index.js` | Package extension | Aliased commands | Skill system + entries |
| **Gemini CLI** | `gemini-extension.json` | Extension manifest | Auto-discover from commands/*.toml | N/A (instruction-tier) |
| **Cursor** | `.cursor/rules/ponytail.mdc` | Project rule (`.mdc` format) | N/A | Always-on |
| **Windsurf** | `.windsurf/rules/ponytail.md` | Project rule | N/A | Always-on |
| **Cline** | `.clinerules/ponytail.md` | Project rule | N/A | Always-on |
| **GitHub Copilot** | `.github/copilot-instructions.md` | Repo instructions | N/A | Instruction-tier |
| **GitHub Copilot CLI** | `.github/plugin/` + `AGENTS.md` | Plugin-supported or fallback instructions | Plugin levels or none | Depends on mode |
| **Antigravity** | `AGENTS.md` + `.agents/rules/` | Reads repo root | N/A | Instruction-tier |
| **VS Code + Codex ext** | `AGENTS.md` | Extension reads config | N/A or via full plugin | Instruction-tier or hooks |
| **Kiro** | `.kiro/steering/ponytail.md` | Steering rule | N/A | Always-on |
| **Generic agents** | `AGENTS.md` or `skills/*/SKILL.md` | Copy + configure | N/A | User-defined |

### Adding a NEW Agent Tool: The Per-Tool Manifest Pattern

#### Step 1: Create the Adapter
```
<new-host>/
├── plugin.json           # host-specific metadata
└── activation-hook.js    # optional: load mode at session start
```

**Minimal plugin.json:**
```json
{
  "name": "ponytail",
  "version": "4.7.0",
  "description": "Lazy senior dev mode",
  "skills": "./skills/",
  "hooks": "./hooks/"
}
```

#### Step 2: Wire Skill Discovery
- Point `"skills"` at the shared `skills/` directory (5 skills auto-discovered: `ponytail`, `ponytail-review`, `ponytail-audit`, `ponytail-debt`, `ponytail-help`)
- Reuse `skills/*/SKILL.md` frontmatter (name, description, trigger patterns) for command registration

#### Step 3: Mode Persistence (Optional)
- Implement mode-state storage (e.g., `.ponytail-config` file, session entry, env var)
- Call `normalizePersistedMode()` from `hooks/ponytail-config.js` to validate modes
- Pass mode to `getPonytailInstructions(mode)` from `hooks/ponytail-instructions.js`

#### Step 4: Inject Instructions
Two patterns:

**A. System Prompt Transform (OpenCode pattern)**
```javascript
// In your plugin hook, call before LLM dispatch:
const mode = getPersistedMode();
const instructions = getPonytailInstructions(mode);
chatSystem = instructions + "\n\n" + chatSystem;
```

**B. Session Activation Hook (Claude Code pattern)**
```json
{
  "hooks": {
    "SessionStart": [
      {
        "type": "command",
        "command": "node hooks/ponytail-activate.js",
        "timeout": 5
      }
    ]
  }
}
```

#### Step 5: Support Mode Switching (Optional)
Listen for `/ponytail lite|full|ultra` and:
1. Call `normalizeMode(input)` to validate
2. Persist the mode
3. Re-inject instructions for the next turn

---

## 4. Hooks API & Lifecycle

### hooks.json Schema (Codex/Claude Code)

```json
{
  "hooks": {
    "<HookName>": [
      {
        "matcher": "<pattern>",
        "hooks": [
          {
            "type": "command",
            "command": "<shell-command>",
            "commandWindows": "<powershell-command>",
            "timeout": 5,
            "statusMessage": "<UI-message>"
          }
        ]
      }
    ]
  }
}
```

### Supported Hook Points

| Hook | Trigger | Use Case |
|------|---------|----------|
| `SessionStart` | Session begins (startup, resume, clear, compact) | Load default mode, initialize state |
| `UserPromptSubmit` | User submits a prompt | Track mode changes, validate instructions |

### Hook Execution Contract

- **Exit Code 0:** Success, message shows in statusline
- **Timeout:** Default 5s; commands that exceed timeout are silently skipped
- **Windows:** Separate `commandWindows` for PowerShell environments
- **Idempotent:** Hooks may run multiple times; ensure no side effects

### Hooks in Ponytail

**SessionStart:** `ponytail-activate.js`
- Loads user's default mode (from `~/.ponytail-config` or env)
- Logs mode to session state

**UserPromptSubmit:** `ponytail-mode-tracker.js`
- Detects `/ponytail <level>` commands
- Updates persistent mode
- Reflects back to statusline

---

## 5. Config & State Management

### ponytail-config.js

Shared module for all adapters. Exports:

```javascript
DEFAULT_MODE // "full"
getDefaultMode() // reads ~/.ponytail-config
normalizeMode(input) // "lite" | "full" | "ultra" | null
normalizePersistedMode(state) // "lite" | "full" | "ultra" | "off" | null
normalizeConfigMode(input) // "lite" | "full" | "ultra" | "off" | null
writeDefaultMode(mode) // persists to ~/.ponytail-config
```

### Config File Location
- **Linux/macOS:** `~/.ponytail-config`
- **Windows:** `$env:APPDATA\ponytail\config`

### Config Format (Plain Text)
```
lite
```
or
```
full
```
or
```
ultra
```
or
```
off
```

---

## 6. Instruction Builder Architecture

### ponytail-instructions.js

Core instruction generator. Exports:

```javascript
getPonytailInstructions(mode)
  // Returns: "PONYTAIL MODE ACTIVE — level: <mode>\n\n<instructions>"
  // Reads skills/ponytail/SKILL.md and filters by mode

filterSkillBodyForMode(body, mode)
  // Strips frontmatter, filters mode-specific table rows and examples
  // Returns: cleaned instruction text for the given mode
  // Fallback: getFallbackInstructions(mode) if skill file missing
```

### Filtering Logic

Removes frontmatter (`---...---`), then filters lines:

**Mode-Specific Table Rows:**
```
| **lite** | ... |  ← kept only if mode="lite"
| **full** | ... |  ← kept only if mode="full"
| **ultra** | ... | ← kept only if mode="ultra"
```

**Mode-Specific Examples:**
```
- lite: example text  ← kept only if mode="lite"
- full: example text  ← kept only if mode="full"
```

**Normal Rules** (always kept):
```
- No unrequested abstractions: ...  ← no mode label, always included
```

---

## 7. Org Adaptation & Forking Guide

### How to Fork Ponytail for Your Coding Doctrine

#### Phase 1: Copy & Customize AGENTS.md

1. Fork the repo or copy `AGENTS.md` into your codebase
2. Replace the 6-rung ladder with your doctrine (e.g., your security gates, your dependency policy)
3. Keep the `ponytail:` comment convention—it's the portable contract
4. Update triggers in `skills/ponytail/SKILL.md` frontmatter if needed

**Example: Security-First Doctrine**
```markdown
# Your Security Ladder

Before any code, stop at the first rung that holds:

1. Does this need to be built at all?
2. Does it handle secrets securely? (Env vars, no hardcoding)
3. Does it validate inputs at trust boundaries?
4. Does the stdlib provide it?
5. ... (rest of ponytail ladder)
```

#### Phase 2: Extend the Skills Fleet

Add new skills for your workflow:

```
skills/
├── ponytail/           (core: your ladder)
├── ponytail-review/    (reuse or customize)
├── security-audit/     (new: your org's security patterns)
└── dependency-debt/    (new: track your policy violations)
```

Each skill is independent: `skills/<name>/SKILL.md` with frontmatter.

#### Phase 3: Deploy Across Your Tools

Use the adapter pattern:

```
your-org-ruleset/
├── AGENTS.md                  # compact always-on rule
├── skills/                    # portable skills
├── hooks/                     # lifecycle hooks
├── .claude-plugin/plugin.json # Claude Code
├── .codex-plugin/plugin.json  # Codex
├── .cursor/rules/             # Cursor
├── .github/copilot-instructions.md
└── (other adapters as needed)
```

Sync script (one-shot):
```bash
# Update all adapters to point to canonical skill files
# Run before every commit to keep adapters thin
npm run sync-adapters
```

#### Phase 4: Track Deferrals

Enforce the `ponytail:` convention in code review:

```bash
# Pre-commit hook or CI check
grep -rn 'ponytail:' src/ tests/ | while read line; do
  if ! echo "$line" | grep -q 'ponytail: .*, '; then
    echo "ERROR: $line — missing upgrade trigger"
    exit 1
  fi
done
```

#### Phase 5: Org Dashboard (Optional)

Aggregate debt across teams:

```bash
# Collect all ponytail-debt reports into one ledger
for repo in repos/*; do
  cd "$repo"
  /ponytail-debt > /tmp/debt-"${repo##*/}".md
  cd ..
done
cat /tmp/debt-*.md > ORG-PONYTAIL-DEBT.md
```

---

## 8. Command Syntax Across Hosts

### Claude Code & Codex

```
/ponytail                 → toggle mode (off→full, full→lite, lite→full, ultra→off)
/ponytail lite            → set to lite
/ponytail full            → set to full (default)
/ponytail ultra           → set to ultra (most aggressive)
/ponytail status          → show current mode
/ponytail default lite    → set default mode for future sessions
```

### OpenCode

```
/ponytail lite|full|ultra → set mode
(persists to session state)
```

### pi

```
(Command aliases via skill system, same syntax as above)
```

### CLI / Generic Agents

```
(No commands; pass mode via environment or config file)
export PONYTAIL_MODE=full
```

---

## 9. Reference: Skill Manifest (Frontmatter)

Every skill in `skills/` must have this frontmatter:

```yaml
---
name: <skill-name>              # max 64 chars, unique, no spaces
description: >                  # 1-3 sentences, max 200 chars
  Describe what this skill does and when to invoke it.
  Include trigger keywords (e.g., "lazy", "simplify", "audit").
license: MIT                    # or your license
---

# Skill Title

Body of the skill (markdown).
```

**Example:**
```yaml
---
name: ponytail
description: >
  Forces the laziest solution: YAGNI, stdlib first, no unrequested abstractions.
  Use for "be lazy", "simplest solution", "minimal code".
license: MIT
---
```

---

## 10. Portability Guarantees

### What's Guaranteed

- **Core Ruleset (AGENTS.md):** Portable as-is across all hosts; instruction-tier adapters copy it verbatim
- **Skills (`skills/*/SKILL.md`):** Portable; each host's adapter references the canonical files
- **Hooks (`hooks/`):** Portable JS modules; each host's adapter calls the shared functions
- **Comment Convention (`ponytail:`):** Portable marker; all tools grep the same pattern
- **Mode Persistence:** `~/.ponytail-config` is the single source of truth; all adapters read from it

### What's Host-Specific

- **Command Registration:** Each host has its own command syntax (e.g., `/ponytail` in Claude Code, `/ponytail` as a Codex skill)
- **Statusline Rendering:** Each host formats UI differently (shell prompt, IDE sidebar, chat message)
- **Hook Lifecycle:** SessionStart/UserPromptSubmit are Codex/Claude Code events; other hosts use their own hook points
- **State Storage:** Session entries (Claude Code), entries (pi), filesystem (OpenCode), environment (CLI)

---

## 11. Version & Upgrade Strategy

**Current Version:** 4.7.0

**Breaking Changes:** None. Adapters detect missing skill files and fall back to `getFallbackInstructions()`.

**Migration Path:** When the ruleset changes, update `AGENTS.md` and all adapters read from it; no code changes in client repos needed.

---

## 12. Security & Trust Model

### Input Validation
- All user inputs (`/ponytail <mode>`) validated against enum: `"lite" | "full" | "ultra" | "off"`
- Invalid inputs logged but don't break the session

### No Remote Execution
- All hooks are local (shell commands in `hooks/`)
- No network calls; skills are pure instruction text
- Config file is user-writable only

### Secrets
- No ponytail config or state contains secrets
- Safe to commit adapters to version control
- Skills are documentation; no code secrets embedded

---

## Summary: Integration Checklist for a New Host

1. **Create plugin.json:** Point to `skills/` and `hooks/` directories
2. **Implement mode persistence:** Use `ponytail-config.js` functions
3. **Inject instructions:** Call `getPonytailInstructions(mode)` before LLM dispatch
4. **Support `/ponytail` command:** Map `lite|full|ultra` switches via `normalizeMode()`
5. **Add statusline (optional):** Show current mode in UI
6. **Test the 6-rung ladder:** Verify `ponytail:` comments pass grep
7. **Document mode commands:** In host's help or plugin README

That's it. The portability contract is maintained by reusing shared files, not by centralized tooling.

