# RTK (Rust Token Killer) — Architecture Documentation

**Version:** 0.42.2  
**Language:** Rust 2021 Edition (MSRV: 1.91)  
**Purpose:** High-performance CLI proxy to minimize LLM token consumption  
**Repository:** https://github.com/rtk-ai/rtk

---

## Executive Summary

RTK is a sophisticated command-line proxy designed to intercept tool outputs and reduce token consumption by 60-90% before they reach LLM context windows. It operates through a multi-layered architecture combining CLI argument parsing, command routing, output filtering, telemetry tracking, and integrations with AI coding agents (Claude Code, Cursor, Gemini CLI, etc.).

The system employs a **three-tier parsing strategy**: Full (complete structured data), Degraded (partial data with warnings), and Passthrough (truncated raw output). This ensures RTK never silently returns false data.

---

## Directory Structure

```
/home/user/ghq/github.com/rtk-ai/rtk/
├── src/                          # Primary source code
│   ├── main.rs                   # Entry point: CLI argument parsing & command routing
│   ├── analytics/                # Token savings tracking & cost reporting
│   │   ├── gain.rs              # Token savings history & analytics
│   │   ├── ccusage.rs           # Claude Code usage metrics
│   │   ├── cc_economics.rs      # Spending vs. savings analysis
│   │   └── session_cmd.rs       # RTK adoption across sessions
│   ├── cmds/                     # Command filters organized by language
│   │   ├── cloud/               # Cloud tools (AWS, Curl, Psql, Wget)
│   │   ├── dotnet/              # .NET ecosystem (MSBuild, format, tests)
│   │   ├── git/                 # Git & Git hosting (gh, glab, git commands)
│   │   ├── go/                  # Go toolchain (go test, build, vet, golangci-lint)
│   │   ├── js/                  # JavaScript ecosystem (npm, pnpm, next, tsc, eslint, prettier, prisma)
│   │   ├── jvm/                 # JVM languages (Maven, Gradle)
│   │   ├── python/              # Python tools (pytest, ruff, mypy, pip)
│   │   ├── ruby/                # Ruby tools (rake, rspec, rubocop)
│   │   ├── rust/                # Rust toolchain (cargo, clippy)
│   │   └── system/              # System utilities (ls, tree, read, find, grep, env, log, wc, etc.)
│   ├── core/                     # Shared infrastructure
│   │   ├── filter.rs            # Source code comment/boilerplate stripping
│   │   ├── runner.rs            # Process execution with filtering
│   │   ├── stream.rs            # Line-by-line streaming filters (core pattern)
│   │   ├── tracking.rs          # Token savings telemetry
│   │   ├── config.rs            # Configuration file handling
│   │   ├── toml_filter.rs       # Project-local TOML filter matching
│   │   ├── telemetry.rs         # Telemetry consent & reporting
│   │   ├── tee.rs               # Output caching for fallback
│   │   ├── truncate.rs          # Output truncation with ellipsis
│   │   ├── utils.rs             # Cross-cutting utilities
│   │   ├── args_utils.rs        # Argument parsing helpers
│   │   ├── display_helpers.rs   # Colored output formatting
│   │   └── constants.rs         # Global constants
│   ├── discover/                 # Session analysis & opportunity detection
│   │   ├── provider.rs          # Session discovery from Claude Code
│   │   ├── registry.rs          # Command classification & registry
│   │   ├── rules.rs             # RTK opportunity matching rules
│   │   ├── lexer.rs             # Shell-like tokenization
│   │   └── report.rs            # Opportunity analysis reporting
│   ├── hooks/                    # Agent integration & hook lifecycle
│   │   ├── init.rs              # Hook installation wizard
│   │   ├── hook_cmd.rs          # Hook execution for agents
│   │   ├── rewrite_cmd.rs       # Command rewriting engine
│   │   ├── verify_cmd.rs        # Hook integrity verification
│   │   ├── hook_check.rs        # Runtime hook status checks
│   │   ├── trust.rs             # TOML filter trust management
│   │   ├── permissions.rs       # Permission model for hooks
│   │   └── integrity.rs         # Operational mode validation
│   ├── learn/                    # CLI mistake detection & correction suggestions
│   │   ├── detector.rs          # Error pattern detection
│   │   └── report.rs            # Correction recommendations
│   └── parser/                   # Output parsing & formatting
│       ├── formatter.rs         # Token-optimized formatters
│       └── types.rs             # Parsed output types
├── hooks/                        # Hook deployment scripts for agents
├── docs/                         # User & developer documentation
├── tests/                        # Integration tests
├── Cargo.toml                    # Rust project manifest
├── Cargo.lock                    # Dependency lock file
└── build.rs                      # Build script
```

---

## Core Abstractions & Patterns

### 1. **Command Routing Architecture**

**Entry Point:** `main.rs`  
The main CLI parser uses Clap (derive macro) to define a hierarchical command structure:

```
rtk
├── ls/tree/read        (system utilities)
├── git                 (Git hosting)
├── cargo/npm/go/etc.   (language toolchains)
├── gain/discover/learn (analytics & learning)
├── hook/init/verify    (agent integration)
├── pipe/proxy/run      (execution modes)
└── ... (40+ subcommands)
```

Each command maps to a module in `cmds/` or `core/` which implements:
- Argument parsing (some commands accept raw args via `trailing_var_arg`)
- Process execution (spawning child processes)
- Output filtering (applying language-specific or tool-specific rules)
- Tracking (recording tokens before/after)

### 2. **Three-Tier Parsing Strategy**

**Module:** `parser/mod.rs`  
All tool output parsing follows a strict three-tier fallback:

```rust
pub enum ParseResult<T> {
    Full(T),              // Tier 1: Complete structured data
    Degraded(T, warnings),// Tier 2: Partial data + warnings
    Passthrough(String),  // Tier 3: Truncated raw output
}
```

**Rationale:** Ensures RTK never silently returns false data. If full parsing fails, partial data is returned with warnings. If partial parsing fails, raw output is truncated and marked with `[RTK:PASSTHROUGH]`.

**Examples:**
- JSON parser: Try full JSON parsing → extract object from pnpm prefixes → truncate passthrough
- Test runner: Extract failures only → strip compilation noise → fallback raw with marker
- Git: Locale-stable parsing with C locale → strip whitespace → direct output

### 3. **Stream Filter Pattern**

**Module:** `core/stream.rs`  
Core abstraction for line-by-line output processing:

```rust
pub trait LineHandler {
    fn handle_line(&mut self, line: &str) -> LineAction;
}

pub struct LineStreamFilter {
    handler: Box<dyn LineHandler>,
    mode: FilterMode,
}

impl LineStreamFilter {
    pub fn apply(&self, input: &str) -> String { ... }
}
```

**Usage:** Git, test runners, linters, build tools feed output through `LineStreamFilter` with custom handlers:
- **Group Handler:** Deduplicate/compress repeated patterns
- **Skip Handler:** Strip specific line patterns (progress bars, compilation lines)
- **Rewrite Handler:** Transform line formats (e.g., git diff chunk headers)

### 4. **Language-Specific Filter Strategy**

**Module:** `core/filter.rs`  
Strips comments and boilerplate from source code:

```rust
pub enum Language {
    Rust, Python, JavaScript, TypeScript, Go, C, Cpp, Java, Ruby, Shell, Data, Unknown
}

pub trait FilterStrategy {
    fn filter(&self, content: &str, lang: &Language) -> String;
}
```

**Supports:** Line comments, block comments, docstrings (Python triple-quotes), Rust doc comments.

### 5. **Hook Integration Pattern**

**Module:** `hooks/hook_cmd.rs`  
RTK integrates with AI agents (Claude Code, Cursor, Gemini CLI, Copilot) via hooks:

```
Agent executes:       rtk hook claude --json
                          ↓
              RTK reads JSON from stdin
                          ↓
        Rewrite engine transforms command
                          ↓
          Hook logic maps to RTK subcommand
                          ↓
            Output filter → response JSON
```

The **rewrite engine** (in `hooks/rewrite_cmd.rs`) is the "single source of truth" for command transformations:
- Agents call: `REWRITTEN=$(rtk rewrite "$CMD") || fallback`
- Exit 0 + output = supported command with rewrite
- Exit 1 + no output = unsupported command, no rewrite needed

### 6. **Telemetry & Tracking System**

**Modules:** `core/tracking.rs`, `analytics/gain.rs`  
Tracks token savings with opt-in telemetry:

```rust
pub struct TimedExecution {
    start: Instant,
    command: String,
}

impl TimedExecution {
    pub fn track(&self, raw_cmd: &str, rtk_cmd: &str, raw_output: &str, filtered: &str) {
        // Estimate tokens, log to database
    }
}
```

**Database:** SQLite (stored in `~/.rtk/` or per-project `.rtk/`)  
**Metrics:** 
- Tokens before/after filtering
- Per-command, per-project, per-session statistics
- Time-series analysis (daily/weekly/monthly)
- Claude Code spending vs. RTK savings comparison

### 7. **Discover & Learn System**

**Modules:** `discover/mod.rs`, `learn/mod.rs`  
Analyzes Claude Code session history to:

1. **Discover:** Find commands that RTK could optimize
   - Query session files from Claude Code history
   - Classify commands (known RTK, unsupported, disabled)
   - Estimate token savings opportunity
   - Group by category and effectiveness

2. **Learn:** Detect repeated CLI mistakes and suggest corrections
   - Track failed commands and their error output
   - Deduplicate patterns (same mistake ≥ N times)
   - Score confidence based on frequency
   - Generate `.claude/rules/cli-corrections.md`

### 8. **Configuration System**

**Module:** `core/config.rs`, `core/toml_filter.rs`  
Two-tier configuration:

1. **Global Config** (`~/.rtk/config.toml`):
   - Filter strictness, token limits, output caps
   - Telemetry consent, proxy settings

2. **Project-Local TOML Filters** (`.rtk/filters.toml`):
   - Custom filtering rules for specific projects
   - Requires trust verification (hash-based integrity check)
   - Syntax:
     ```toml
     [[filter]]
     command = "^myapp build"
     filter_stderr = true
     rules = [
       { pattern = "progress", action = "skip" },
       { pattern = "error", action = "keep" }
     ]
     ```

---

## Entry Points & CLI Dispatch

### 1. **Binary Entry Point**

**File:** `src/main.rs` (lines 1366-1386)

```rust
fn main() {
    #[cfg(unix)]
    unsafe { libc::signal(libc::SIGPIPE, libc::SIG_DFL); } // SIGPIPE handling
    
    let code = match run_cli() {
        Ok(code) => code,
        Err(e) => { eprintln!("rtk: {:#}", e); 1 }
    };
    std::process::exit(code);
}

fn run_cli() -> Result<i32> {
    core::telemetry::maybe_ping();     // 1/day telemetry
    hooks::hook_check::maybe_warn();   // Warn if hook is outdated
    
    let cli = Cli::try_parse()?;       // Parse arguments
    
    // Route to command handler
    match cli.command { ... }
}
```

### 2. **Fallback Mechanism**

**File:** `src/main.rs` (lines 1155-1280)

If Clap parsing fails, RTK attempts **graceful fallback**:

```
rtk <invalid> → Clap error
    ↓
Try run_fallback()
    ↓
Check RTK_META_COMMANDS list → If yes, show error. If no:
    ↓
TOML filter lookup (basename matching)
    ↓
If TOML found: execute with filter applied
If no TOML: direct passthrough (Stdio::inherit)
    ↓
Track execution & record parse failure
```

This allows RTK to:
- Proxy unknown commands (`rtk make`) → runs `make` directly
- Apply TOML filters to custom tools
- Never fail hard; always attempt execution

### 3. **Command Routing Examples**

**System Command:**
```
rtk ls -lh
  → Clap matches Commands::Ls { args: ["-lh"] }
  → Dispatch: cmds::system::ls::run(&args, verbose)
  → Spawn: ls command, apply compact formatting
```

**Language Toolchain:**
```
rtk cargo test
  → Clap matches Commands::Cargo { CargoCommands::Test { args } }
  → Dispatch: cmds::rust::cargo_cmd::run(CargoCommand::Test, args, verbose)
  → Spawn: cargo test --json, parse output, show failures only
```

**Hook Mode:**
```
rtk hook claude
  → Read JSON from stdin (PreToolUse hook payload from Claude Code)
  → Dispatch: hooks::hook_cmd::run_claude()
  → Extract command → run rewrite engine → return rewritten command (if supported)
```

---

## Key Dependencies

| Crate | Version | Purpose |
|-------|---------|---------|
| `clap` | 4.x | CLI argument parsing with derive macros |
| `serde_json` | 1.x | JSON parsing (preserve_order) |
| `regex` | 1.x | Pattern matching for log/output filtering |
| `rusqlite` | 0.31 | SQLite for telemetry tracking |
| `chrono` | 0.4 | Time/date utilities |
| `colored` | 2.x | Colored terminal output |
| `toml` | 0.8 | Configuration file parsing |
| `walkdir` | 2.x | File system traversal (discover sessions) |
| `ignore` | 0.4 | Gitignore-aware file filtering |
| `ureq` | 2.x | HTTP client (telemetry pings) |
| `tempfile` | 3.x | Temporary file handling |
| `sha2` | 0.10 | SHA-256 (TOML integrity checks) |
| `flate2` | 1.0 | Gzip compression (archived logs) |
| `quick-xml` | 0.37 | XML parsing (.NET test reports) |
| `libc` | 0.2 | Unix signal handling (SIGPIPE) |
| `automod` | 1.x | Automatic module re-exports |

**Dev Dependencies:** None currently (minimal test suite)

---

## Data Flow Examples

### Example 1: Git Diff Filtering

```
User Input:
  $ rtk git diff HEAD~1

│
├─ main.rs: Clap routes to Commands::Git { GitCommands::Diff { args } }
│
├─ cmds/git/git.rs::run_diff():
│   └─ Executes: git diff HEAD~1 --no-color --unified=1 (compact format)
│   └─ Captures output via Command::output()
│
├─ cmds/git/diff_cmd.rs::process_diff_output():
│   └─ Parse unified diff format
│   └─ Group by file
│   └─ Strip hunk headers
│   └─ Deduplicate identical lines
│
├─ core/tracking::TimedExecution::track():
│   └─ Store: raw_output (2500 tokens) → filtered (400 tokens) = 84% savings
│   └─ Log to ~/.rtk/tracking.db
│
└─ Output:
   file.rs:
     -  let x = old_value;
     +  let x = new_value;
```

### Example 2: Test Runner with Failures Only

```
User Input:
  $ rtk cargo test

│
├─ main.rs: Commands::Cargo { CargoCommands::Test { args } }
│
├─ cmds/rust/cargo_cmd.rs::run():
│   └─ Spawn: cargo test --json (force JSON output)
│   └─ Pipe output through LineStreamFilter
│
├─ Tier 1 Parse (JSON):
│   ├─ Extract: { type: "test", name: "test_foo", event: "ok" }
│   ├─ Collect only: { event: "failed" } entries
│   └─ Output: "test_foo ... FAILED"
│
├─ Fallback (if JSON parse fails):
│   ├─ Tier 2: Regex extract failures from text output
│   └─ Tier 3: Truncate with [RTK:PASSTHROUGH] marker
│
├─ core/tracking::track():
│   └─ raw: 15000 tokens (all compilation, test output)
│   └─ filtered: 800 tokens (failures only)
│   └─ savings: 94.7%
│
└─ Output:
   test_foo ... FAILED
   test_bar ... FAILED
```

### Example 3: Claude Code Hook Integration

```
Claude Code Execution:
  executes command: cargo build

│
├─ Claude Code hook intercepts (PreToolUse)
│   └─ Hook payload: { command: "cargo build", ... }
│
├─ rtk hook claude (reads from stdin)
│   └─ Parse JSON from stdin
│   └─ Extract command string
│
├─ hooks/rewrite_cmd.rs::rewrite():
│   ├─ Classify: cargo build → supported
│   ├─ Check: RTK_DISABLED env var? No
│   └─ Rewrite to: rtk cargo build
│
├─ Hook Response:
│   └─ Return: { command: "rtk cargo build" }
│
├─ Claude Code executes: rtk cargo build
│   └─ Spawns RTK normally
│   └─ RTK filters output as per standard flow
│
└─ Output filtered before reaching Claude Code context
```

---

## Execution Modes

### 1. **Filter Mode** (Default)
```
rtk <cmd> [args...]
  → Executes command
  → Applies language/tool-specific filters
  → Tracks tokens
  → Prints filtered output
```

### 2. **Hook Mode**
```
rtk hook claude | curssor | gemini | copilot
  → Reads JSON from stdin (agent hook payload)
  → Executes rewrite logic
  → Outputs JSON response back to agent
```

### 3. **Pipe Mode**
```
some_command | rtk pipe --filter cargo-test
  → Reads from stdin
  → Applies named filter
  → Outputs filtered result to stdout
```

### 4. **Proxy Mode**
```
rtk proxy cargo build
  → Executes command without filtering
  → Still tracks usage and tokens
  → Useful for debugging or passthrough
```

### 5. **Run Mode**
```
rtk run -c 'cargo build && cargo test'
  → Executes raw shell command
  → No filtering, no tracking
  → Raw pass-through
```

---

## Configuration & Trust Model

### TOML Filter Trust Verification

```rust
// File: .rtk/filters.toml
[[filter]]
command = "^myapp build"
rules = [ ... ]

// RTK calculates:
// hash = SHA256(.rtk/filters.toml content)
// Stores in: ~/.rtk/trusted_projects.db
// On execution:
//   current_hash = SHA256(read filters.toml)
//   if current_hash != stored_hash: reject filter
//   else: apply filter
```

This prevents TOML injection attacks while allowing project-local customization.

---

## Telemetry & Analytics

### Metrics Tracked

1. **Per-Command:**
   - Command executed (e.g., "cargo test")
   - Raw output tokens (estimated)
   - Filtered output tokens (estimated)
   - Savings percentage
   - Timestamp

2. **Per-Project:**
   - Aggregated savings
   - Top commands by savings
   - Session-level adoption rate

3. **Session-Level:**
   - Session ID (from Claude Code)
   - Project path
   - Savings summary
   - Tools used

### Storage

- **Location:** `~/.rtk/` (global) or `.rtk/` (project-local)
- **Format:** SQLite database (encrypted at rest in enterprise)
- **Schema:** 
  - `tracking` table: Per-execution metrics
  - `sessions` table: Session metadata
  - `trusted_projects` table: TOML filter hashes

### Opt-Out

```
rtk telemetry consent <yes|no>
RTK_TELEMETRY=0 rtk <cmd>  # Disable for single command
RTK_NO_TRACKING=1           # Disable for all commands
```

---

## Security Model

### 1. **Hook Integrity**
- SHA-256 checksums for installed hooks
- Runtime verification before execution
- Warn if hook is outdated or corrupted

### 2. **TOML Filter Trust**
- SHA-256 hash of project-local filters
- Explicit `rtk trust` / `rtk untrust` workflow
- Prevents automatic execution of untrusted filters

### 3. **Permissions**
- Each hook gets explicit permissions list
- Permission model in `hooks/permissions.rs`
- Example: "allow tsc", "deny npm publish"

### 4. **Audit Logging**
```
RTK_HOOK_AUDIT=1 rtk <cmd>
  → Records all hook rewrites to ~/.rtk/hook-audit.json
  → Viewable via: rtk hook-audit --since 7
```

---

## Extension Points

### 1. **Custom Command Filters**

Add a new command handler in `src/cmds/<language>/`:

```rust
// src/cmds/newlang/mycommand.rs
pub fn run(args: &[String], verbose: u8) -> Result<i32> {
    let output = std::process::Command::new("mycommand")
        .args(args)
        .output()?;
    
    let filtered = filter_mycommand_output(&String::from_utf8_lossy(&output.stdout));
    println!("{}", filtered);
    
    let timer = core::tracking::TimedExecution::start();
    timer.track("mycommand ...", "rtk mycommand ...", &raw, &filtered);
    
    Ok(0)
}

// Register in src/main.rs
use cmds::newlang::mycommand;
Commands::MyCommand { args } => mycommand::run(&args, cli.verbose)?
```

### 2. **Custom Output Parsers**

Implement `parser::OutputParser` trait:

```rust
pub struct MyToolOutput { /* ... */ }

impl OutputParser for MyToolOutput {
    type Output = MyToolOutput;
    
    fn parse(input: &str) -> ParseResult<Self::Output> {
        // Tier 1: Try JSON
        // Tier 2: Try regex
        // Tier 3: Return Passthrough(truncated)
    }
}
```

### 3. **Custom Line Handlers**

Implement `core::stream::LineHandler`:

```rust
struct MyHandler { /* state */ }

impl LineHandler for MyHandler {
    fn handle_line(&mut self, line: &str) -> LineAction {
        if line.contains("verbose info") {
            LineAction::Skip
        } else {
            LineAction::Keep(line.to_string())
        }
    }
}

// Use it:
let filter = LineStreamFilter::new(Box::new(MyHandler::new()));
let output = filter.apply(&raw_output);
```

---

## Performance Characteristics

| Operation | Latency | Notes |
|-----------|---------|-------|
| CLI parse | <1ms | Clap derive macro |
| Command spawn | 5-50ms | Depends on system load |
| Output filtering | 10-500ms | Depends on output size |
| Telemetry write | <5ms | SQLite async or batched |
| Hook rewrite | <2ms | Pattern matching |

**Token Estimation:** Fast heuristic (count words/newlines) rather than full tokenization; actual token usage reported by LLM.

---

## Build & Deployment

### Build Optimization

```toml
[profile.release]
opt-level = 3          # Maximum optimization
lto = true             # Link-time optimization
codegen-units = 1     # Single codegen for better optimization
panic = "abort"        # Smaller binary, faster panics
strip = true           # Strip symbols
```

### Package Formats

- **Homebrew:** `target/release/rtk` → `/usr/local/bin/rtk`
- **Debian:** `.deb` package via `cargo-deb`
- **RPM:** `.rpm` package via `cargo-generate-rpm`
- **GitHub Releases:** Automated via `release-please`

---

## Notable Design Decisions

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| Rust + Clap | Type-safe CLI, zero-cost abstractions | Slower compilation (mitigated by release builds) |
| Line-by-line streaming | Memory efficient, unbuffered | Cannot reorder lines across entire output |
| Three-tier parsing | Never silently wrong; always auditable | Slightly verbose tier detection |
| Hook via JSON stdin | Process isolation, agent-agnostic | Extra process spawn overhead |
| SQLite for telemetry | Structured queries, ACID | File-based locking (mitigated by batching) |
| TOML filters | Human-readable, familiar format | Regex limit for complex patterns |
| Passthrough marker | Auditable fallback mode | Visible in output (can be parsed) |

---

## Summary

RTK is a **layered architecture** combining:

1. **CLI Router** (main.rs) — Clap-driven command dispatch with graceful fallback
2. **Command Filters** (cmds/*) — 50+ language/tool-specific optimizers
3. **Core Infrastructure** (core/*) — Streaming, filtering, tracking, config
4. **Agent Integration** (hooks/*) — Hook deployment & rewrite engine
5. **Analytics** (analytics/ + discover/ + learn/) — Telemetry, opportunity detection, error learning
6. **Safety Guarantees** — Three-tier parsing, TOML trust, audit logging, SIGPIPE handling

The system operates at the **OS process boundary**, intercepting command outputs without requiring deep tool integration. This design maximizes compatibility while maintaining high filtering effectiveness.

---

## File Reference Quick Index

| Purpose | Key Files |
|---------|-----------|
| Entry point & routing | `src/main.rs` |
| Git commands | `src/cmds/git/git.rs`, `diff_cmd.rs` |
| Test runners | `src/cmds/rust/cargo_cmd.rs`, `src/cmds/python/pytest_cmd.rs` |
| Hook integration | `src/hooks/hook_cmd.rs`, `rewrite_cmd.rs` |
| Output filtering | `src/core/stream.rs`, `src/core/filter.rs` |
| Telemetry | `src/core/tracking.rs`, `src/analytics/gain.rs` |
| Session discovery | `src/discover/provider.rs`, `registry.rs` |
| Error learning | `src/learn/detector.rs` |
| Configuration | `src/core/config.rs`, `toml_filter.rs` |
| Parsing | `src/parser/formatter.rs`, `types.rs` |
