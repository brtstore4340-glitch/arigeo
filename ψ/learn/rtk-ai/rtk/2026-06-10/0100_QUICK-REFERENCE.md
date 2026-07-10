# RTK Quick Reference Guide

## What is RTK?

**RTK (Rust Token Killer)** is a high-performance CLI proxy that filters and compresses command outputs before they reach your LLM context, reducing token consumption by 60–90% with less than 10ms overhead.

---

## Installation

### Quick Install (Recommended)

```bash
# macOS/Linux
curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh

# Homebrew (macOS)
brew install rtk

# Cargo (any platform)
cargo install --git https://github.com/rtk-ai/rtk
```

### Verify Installation

```bash
rtk --version      # Check version
rtk gain           # View token savings stats (CRITICAL: verifies correct RTK installed)
```

> **Name Collision**: Two projects called "rtk" exist. If `rtk gain` fails, uninstall with `cargo uninstall rtk` and reinstall from the git repo.

### Post-Installation Setup (Claude Code)

```bash
# Install global hook (recommended)
rtk init -g
# Restarts Claude Code when done

# OR: Project-only setup
rtk init           # Creates CLAUDE.md in current directory
```

---

## Quick Start

### Minimal Working Example

```bash
# Test basic filtering
rtk ls .                    # Directory listing, ~80% fewer tokens
rtk git status              # Git status, compact format
rtk cargo test              # Test output, failures only

# View savings
rtk gain                    # See token savings statistics
```

### Hook-Based Auto-Rewrite (After `rtk init -g`)

Once installed globally with the hook:

```bash
# These commands automatically rewrite to rtk equivalents
git status                  # Auto → rtk git status
ls -la                      # Auto → rtk ls -la
cargo test                  # Auto → rtk cargo test
```

No need to call `rtk` manually—the hook handles it transparently in Claude Code.

---

## Key Features

### 1. File Operations
```bash
rtk ls .                           # Compact directory tree
rtk tree [args]                    # Native tree output, filtered
rtk read file.rs                   # Read file with smart filtering
rtk read file.rs -l aggressive     # Signatures only (strips function bodies)
rtk find "*.rs" .                  # Grouped find results
rtk grep "pattern" .               # Search results, grouped by file
```

**Token Savings**: 70–80% reduction

### 2. Git Operations
```bash
rtk git status                     # → "3 modified, 1 untracked ✓"
rtk git log -n 10                  # → One-line commits
rtk git diff                       # Condensed diff output
rtk git add                        # → "ok"
rtk git commit -m "msg"            # → "ok abc1234"
rtk git push                       # → "ok main"
```

**Token Savings**: 75–92% reduction

### 3. Test Runners
```bash
rtk cargo test                     # Failures only, -90% tokens
rtk pytest                         # Python tests, -90% tokens
rtk jest                           # Jest failures only
rtk go test                        # Go tests, NDJSON output
rtk playwright test                # E2E results, compact
```

**Token Savings**: 90% reduction

### 4. Build & Linting
```bash
rtk cargo build                    # Build output, -80% tokens
rtk cargo clippy                   # Clippy warnings, grouped
rtk tsc                            # TypeScript errors by file
rtk lint                           # ESLint results, grouped by rule
rtk ruff check                     # Python linting, JSON format
```

**Token Savings**: 75–85% reduction

### 5. GitHub CLI
```bash
rtk gh pr list                     # Compact PR listing
rtk gh pr view 42                  # PR details + check status
rtk gh issue list                  # Issues, compact
rtk gh run list                    # Workflow runs
```

### 6. Containers & Cloud
```bash
rtk docker ps                      # Compact container list
rtk docker logs <container>        # Deduplicated logs
rtk kubectl pods                   # Pod list
rtk aws ec2 describe-instances     # AWS instances, compact
rtk aws lambda list-functions      # Lambda functions, compact
```

### 7. Analytics & Insights
```bash
rtk gain                           # Summary stats
rtk gain --graph                   # ASCII graph (last 30 days)
rtk gain --history                 # Recent command history
rtk gain --all --format json       # JSON export for dashboards

rtk discover                       # Find missed savings opportunities
rtk discover --all --since 7       # All projects, last 7 days

rtk session                        # Show RTK adoption in recent sessions
```

---

## Common Usage Patterns

### Pattern 1: Debugging with Compact Output

When a command fails, RTK saves the **full unfiltered output** for later inspection:

```bash
rtk cargo test                     # Compact output on failure
# Output includes: [full output: ~/.local/share/rtk/tee/1707753600_cargo_test.log]
```

You can then read the saved log when needed without re-executing.

### Pattern 2: Ultra-Compact Mode for Extra Savings

```bash
rtk -u git log                     # ASCII icons, inline format
rtk --ultra-compact cargo test     # Level 2 optimizations
```

Use `-u` for environments with tight token budgets.

### Pattern 3: Verbose Debugging

```bash
rtk -v cargo test                  # Show filter details on stderr
rtk -vv cargo test                 # Increased verbosity
rtk -vvv cargo test                # Maximum debug output
```

### Pattern 4: Manual Command Filtering

When RTK's auto-rewrite hook isn't available (e.g., Windows native shell):

```bash
# Explicitly call rtk for commands that won't auto-rewrite
rtk git status
rtk cargo test
rtk ls -la
```

### Pattern 5: Passthrough with Tracking

```bash
rtk proxy "long-running-command"   # Raw passthrough + tracking
rtk err "any-command"              # Filter errors only from any command
rtk test "any-command"             # Generic test wrapper
```

---

## Global Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--ultra-compact` | `-u` | ASCII icons, inline format (extra token savings) |
| `--verbose` | `-v` | Increase verbosity (-v, -vv, -vvv) |
| `--skip-env` | — | Set SKIP_ENV_VALIDATION=1 for child processes (Next.js, tsc, lint, prisma) |

---

## Troubleshooting

### Problem: `rtk: command not found`

**Diagnosis:**
```bash
which rtk
```

**Solution:**
- If empty: RTK not installed or PATH not updated
- Add `~/.local/bin` to PATH:
  ```bash
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
  source ~/.bashrc
  ```

### Problem: Wrong RTK Installed (Type Kit instead of Token Killer)

**Diagnosis:**
```bash
rtk gain  # Should show token savings stats, not "command not found"
```

**Solution:**
```bash
cargo uninstall rtk
cargo install --git https://github.com/rtk-ai/rtk
rtk gain  # Verify again
```

### Problem: Hook Not Working (Commands Don't Auto-Rewrite)

**Diagnosis:**
```bash
rtk init --show  # Check if hook is installed
```

**Solution:**
```bash
# Reinstall hook
rtk init -g --auto-patch

# Restart Claude Code (quit and reopen)

# Test manually
git status   # Should print compact output automatically
```

### Problem: Settings.json Backup / Restore

**If hook installation broke Claude Code settings:**

```bash
# Restore from backup
cp ~/.claude/settings.json.bak ~/.claude/settings.json

# Try again with manual inspection
rtk init -g --no-patch  # Print instructions instead of auto-patching
```

### Problem: Windows Shell (Native cmd.exe / PowerShell)

**RTK works but hook doesn't auto-rewrite on Windows native shell:**

```powershell
# Workaround: Call rtk explicitly
rtk cargo test
rtk git status

# Better: Use WSL for full hook support
wsl
rtk init -g
```

### Problem: Command Not Recognized / Passthrough

**RTK doesn't recognize a subcommand:**

- RTK will execute the command normally (fallback/passthrough)
- Output is logged for analysis
- Check `rtk discover` for missed opportunities

```bash
rtk discover --all --since 7  # Find commands not yet optimized
```

---

## Configuration

**Location:**
- Linux/macOS: `~/.config/rtk/config.toml`
- macOS (alternate): `~/Library/Application Support/rtk/config.toml`

**Basic Config:**
```toml
[hooks]
exclude_commands = ["curl", "playwright"]  # Don't auto-rewrite these

[tee]
enabled = true          # Save full output on failure (default: true)
mode = "failures"       # "failures", "always", or "never"
```

**Reload config**: Just invoke RTK again (no restart needed)

---

## Performance & Token Savings

### Real-World Example (30-min Claude Code Session)

| Operation | Frequency | Standard | RTK | Savings |
|-----------|-----------|----------|-----|---------|
| `ls` / `tree` | 10x | 2,000 | 400 | -80% |
| `cat` / `read` | 20x | 40,000 | 12,000 | -70% |
| `grep` / `rg` | 8x | 16,000 | 3,200 | -80% |
| `git status` | 10x | 3,000 | 600 | -80% |
| `git diff` | 5x | 10,000 | 2,500 | -75% |
| `cargo test` | 5x | 25,000 | 2,500 | -90% |
| **Total** | | ~118,000 | ~23,900 | **-80%** |

### How RTK Filters

Four strategies per command:

1. **Smart Filtering** — Remove noise (comments, whitespace, boilerplate)
2. **Grouping** — Aggregate similar items (files by directory, errors by type)
3. **Truncation** — Keep relevant context, cut redundancy
4. **Deduplication** — Collapse repeated log lines with counts

---

## Pro Tips

### Tip 1: Check Your Savings with `rtk gain`

```bash
rtk gain                # Quick summary
rtk gain --graph        # Visual trend (last 30 days)
rtk gain --daily        # Day-by-day breakdown
```

### Tip 2: Find Optimization Opportunities

```bash
rtk discover            # Current project only
rtk discover --all      # All projects
rtk discover --all --since 7  # Last 7 days
```

### Tip 3: Use `rtk read` for Code Review

```bash
rtk read src/main.rs -l aggressive  # Signatures only—perfect for reviewing structure
```

### Tip 4: Combine with Other Tools

```bash
rtk err "some-command"  # Extract errors from any command
rtk test "some-command" # Generic test wrapper—failures only
rtk summary "long-command"  # Heuristic 2-line summary
```

### Tip 5: Monitor Token Usage in Team Sessions

```bash
rtk session             # Show RTK adoption across recent sessions
rtk gain --all --format json  # Export for dashboards
```

---

## Supported AI Tools

RTK integrates with 14+ AI coding assistants:

| Tool | Installation | Method |
|------|--------------|--------|
| **Claude Code** | `rtk init -g` | PreToolUse hook (auto-rewrite) |
| **Cursor** | `rtk init -g --agent cursor` | hooks.json |
| **Gemini CLI** | `rtk init -g --gemini` | BeforeTool hook |
| **Windsurf** | `rtk init -g --agent windsurf` | .windsurfrules |
| **Cline / Roo Code** | `rtk init --agent cline` | .clinerules |
| **Codex** | `rtk init -g --codex` | AGENTS.md + RTK.md |
| **Hermes** | `rtk init --agent hermes` | Python plugin adapter |
| **Pi** | `rtk init -g --agent pi` | TypeScript extension |
| **Kilo Code** | `rtk init --agent kilocode` | .kilocode/rules/ |
| **Google Antigravity** | `rtk init --agent antigravity` | .agents/rules/ |

---

## Next Steps

1. **Install**: `curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh`
2. **Setup**: `rtk init -g` (or agent-specific variant)
3. **Verify**: `rtk gain` and restart your AI tool
4. **Explore**: `rtk discover` to find optimization opportunities

**For full documentation:**
- Website: https://www.rtk-ai.app
- GitHub: https://github.com/rtk-ai/rtk
- Discord: https://discord.gg/RySmvNF5kF

---

**Last Updated:** 2026-06-10  
**RTK Version:** 0.42.2
