# RTK: Code Snippets and Patterns

**Source:** `/home/user/ghq/github.com/rtk-ai/rtk` (v0.42.2)  
**Language:** Rust (Edition 2021)  
**Purpose:** High-performance CLI proxy to minimize LLM token consumption (saves 60-90% of tokens)

---

## 1. Main Entry Point: CLI Architecture

### Root CLI Parser (src/main.rs)

RTK uses **clap** for declarative command-line parsing. The CLI is organized around a single `Cli` struct that routes to 30+ subcommands.

```rust
#[derive(Parser)]
#[command(
    name = "rtk",
    version,
    about = "Rust Token Killer - Minimize LLM token consumption",
)]
struct Cli {
    #[command(subcommand)]
    command: Commands,

    /// Verbosity level (-v, -vv, -vvv)
    #[arg(short, long, action = clap::ArgAction::Count, global = true)]
    verbose: u8,

    /// Ultra-compact mode: ASCII icons, inline format (Level 2 optimizations)
    #[arg(long, global = true)]
    ultra_compact: bool,

    /// Set SKIP_ENV_VALIDATION=1 for child processes (Next.js, tsc, lint, prisma)
    #[arg(long = "skip-env", global = true)]
    skip_env: bool,
}
```

**Key Pattern:** Global flags (`verbose`, `ultra_compact`, `skip_env`) are inherited by all subcommands, ensuring consistent behavior across RTK.

### Command Categories

RTK organizes 30+ commands into **logical groups** (re-exported from submodules):

```rust
// git: diff, log, status, show, add, commit, push, pull, branch, stash, worktree
use cmds::git::{diff_cmd, gh_cmd, git, glab_cmd, gt_cmd};

// js ecosystem: npm, pnpm, prettier, tsc, next, vitest, playwright
use cmds::js::{
    lint_cmd, next_cmd, npm_cmd, playwright_cmd, pnpm_cmd, 
    prettier_cmd, prisma_cmd, tsc_cmd, vitest_cmd,
};

// system: ls, tree, read, grep, find, json, deps, env, log, wc
use cmds::system::{
    deps, env_cmd, find_cmd, format_cmd, grep_cmd, json_cmd, 
    local_llm, log_cmd, ls, pipe_cmd, read, summary, tree, wc_cmd,
};
```

**Example Subcommand Definition:**

```rust
#[derive(Debug, Subcommand)]
enum Commands {
    /// List directory contents with token-optimized output
    Ls {
        #[arg(trailing_var_arg = true, allow_hyphen_values = true)]
        args: Vec<String>,
    },

    /// Read file with intelligent filtering
    Read {
        #[arg(required = true, num_args = 1..)]
        files: Vec<PathBuf>,
        #[arg(short, long, default_value = "none")]
        level: core::filter::FilterLevel,
        #[arg(short, long)]
        max_lines: Option<usize>,
        #[arg(long)]
        tail_lines: Option<usize>,
        #[arg(short = 'n', long)]
        line_numbers: bool,
    },

    /// Git commands with compact output
    Git {
        #[arg(short = 'C', action = clap::ArgAction::Append)]
        directory: Vec<String>,
        #[arg(short = 'c', action = clap::ArgAction::Append)]
        config_override: Vec<String>,
        #[command(subcommand)]
        command: GitCommands,
    },
}
```

---

## 2. Core Processing Pipeline: Filter, Stream, Track

### 2.1 Stream-Based Processing (src/core/stream.rs)

RTK processes command output as **line streams** with two trait-based handler patterns:

#### Trait 1: `StreamFilter` (Base trait)

```rust
pub trait StreamFilter {
    /// Process one line; return filtered output (or None to skip).
    fn feed_line(&mut self, line: &str) -> Option<String>;
    
    /// Called at end of stream; return any remaining buffered output.
    fn flush(&mut self) -> String;
    
    /// Optional: called after process exits; may emit a summary.
    fn on_exit(&mut self, exit_code: i32, raw: &str) -> Option<String> {
        None
    }
}
```

#### Trait 2: `BlockHandler` (For multi-line patterns)

```rust
pub trait BlockHandler {
    fn should_skip(&mut self, line: &str) -> bool;
    fn is_block_start(&mut self, line: &str) -> bool;
    fn is_block_continuation(&mut self, line: &str, block: &[String]) -> bool;
    fn format_summary(&self, exit_code: i32, raw: &str) -> Option<String>;
}

pub struct BlockStreamFilter<H: BlockHandler> {
    handler: H,
    in_block: bool,
    current_block: Vec<String>,
    blocks_emitted: usize,
}

impl<H: BlockHandler> StreamFilter for BlockStreamFilter<H> {
    fn feed_line(&mut self, line: &str) -> Option<String> {
        if self.handler.should_skip(line) {
            return None;
        }

        if self.handler.is_block_start(line) {
            let prev = self.emit_block();
            self.current_block.push(line.to_string());
            self.in_block = true;
            prev
        } else if self.in_block {
            if self.handler.is_block_continuation(line, &self.current_block) {
                self.current_block.push(line.to_string());
                None
            } else {
                self.in_block = false;
                self.emit_block()
            }
        } else {
            None
        }
    }
}
```

**Key Pattern:** `BlockStreamFilter` is a reusable wrapper that converts a `BlockHandler` (stateful decision logic) into a `StreamFilter` (streaming processor). This decouples **what to filter** from **how to stream it**.

#### Trait 3: `LineHandler` (For simple line filtering)

```rust
pub trait LineHandler {
    fn should_skip(&mut self, _line: &str) -> bool {
        false
    }
    fn observe_line(&mut self, _line: &str) {}
    fn format_summary(&self, exit_code: i32, raw: &str) -> Option<String>;
}

impl<H: LineHandler> StreamFilter for LineStreamFilter<H> {
    fn feed_line(&mut self, line: &str) -> Option<String> {
        if self.handler.should_skip(line) {
            return None;
        }
        self.handler.observe_line(line);
        Some(format!("{}\n", line))
    }
}
```

**Example Usage:**

Every command handler implements one of these patterns. For example, test output filtering collects failures into a `handler`:

```rust
struct TestFailureHandler {
    failures: Vec<String>,
    current_failure: Option<String>,
}

impl LineHandler for TestFailureHandler {
    fn should_skip(&mut self, line: &str) -> bool {
        !self.is_failure_start(line)
    }
    
    fn format_summary(&self, exit_code: i32, raw: &str) -> Option<String> {
        if self.failures.is_empty() {
            Some("[PASS]".to_string())
        } else {
            Some(format!("[FAIL] {} failures\n{}", 
                self.failures.len(), 
                self.failures.join("\n")
            ))
        }
    }
}
```

### 2.2 Command Execution Wrapper (src/core/runner.rs)

The **runner module** provides a unified execution skeleton:

```rust
#[derive(Default)]
pub struct RunOptions<'a> {
    pub tee_label: Option<&'a str>,          // Save output to file
    pub filter_stdout_only: bool,             // Ignore stderr
    pub skip_filter_on_failure: bool,         // On exit code != 0, skip filter
    pub no_trailing_newline: bool,            // Omit final \n
    pub inherit_stdin: bool,                  // Forward stdin to child
}

impl<'a> RunOptions<'a> {
    pub fn with_tee(label: &'a str) -> Self {
        Self { tee_label: Some(label), ..Default::default() }
    }
    
    pub fn stdout_only() -> Self {
        Self { filter_stdout_only: true, ..Default::default() }
    }
}

pub type CaptureFilter<'a> = Box<dyn Fn(&str) -> String + 'a>;
pub type ExitAwareCaptureFilter<'a> = Box<dyn Fn(&str, i32) -> String + 'a>;

pub enum RunMode<'a> {
    Filtered(CaptureFilter<'a>),
    FilteredWithExit(ExitAwareCaptureFilter<'a>),
    Streamed(Box<dyn StreamFilter + 'a>),
    Passthrough,
}
```

**Usage Pattern:**

```rust
pub fn run_git_status(args: &[String], verbose: u8) -> Result<i32> {
    let timer = tracking::TimedExecution::start();
    let mut cmd = Command::new("git");
    cmd.arg("status").args(args);
    
    let filter_fn = |output: &str, exit_code: i32| -> String {
        if exit_code != 0 {
            return output.to_string();  // Pass through on error
        }
        // Apply compact formatting logic
        format_status_compact(output)
    };
    
    crate::core::runner::run(
        &mut cmd,
        "git status",
        RunMode::FilteredWithExit(Box::new(filter_fn)),
        RunOptions::default()
            .with_tee("git-status")
    )
}
```

### 2.3 Comment Stripping Filter (src/core/filter.rs)

Language-aware filtering removes boilerplate to reduce token count:

```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Language {
    Rust, Python, JavaScript, TypeScript, Go, C, Cpp, Java, Ruby, Shell, Data, Unknown,
}

impl Language {
    pub fn from_extension(ext: &str) -> Self {
        match ext.to_lowercase().as_str() {
            "rs" => Language::Rust,
            "py" | "pyw" => Language::Python,
            "js" | "mjs" | "cjs" => Language::JavaScript,
            "ts" | "tsx" => Language::TypeScript,
            "json" | "yaml" | "yml" | "toml" | "xml" => Language::Data,
            _ => Language::Unknown,
        }
    }

    pub fn comment_patterns(&self) -> CommentPatterns {
        match self {
            Language::Rust => CommentPatterns {
                line: Some("//"),
                block_start: Some("/*"),
                block_end: Some("*/"),
                doc_line: Some("///"),
                doc_block_start: Some("/**"),
            },
            Language::Python => CommentPatterns {
                line: Some("#"),
                block_start: Some("\"\"\""),
                block_end: Some("\"\"\""),
                doc_line: None,
                doc_block_start: Some("\"\"\""),
            },
            // ... etc
        }
    }
}

pub trait FilterStrategy {
    fn filter(&self, content: &str, lang: &Language) -> String;
}
```

**Filtering Levels:**

```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum FilterLevel {
    None,      // Keep everything
    Minimal,   // Remove only comments
    Aggressive, // Remove comments + boilerplate (imports, blank lines)
}
```

---

## 3. Git Command Handler: Real-World Example (src/cmds/git/git.rs)

The git handler demonstrates RTK's **command-specific optimization strategy**:

### Enum-Driven Routing

```rust
#[derive(Debug, Clone)]
pub enum GitCommand {
    Diff, Log, Status, Show, Add, Commit, Push, Pull, Branch, Fetch, Stash { subcommand: Option<String> }, Worktree,
}

pub fn run(
    cmd: GitCommand,
    args: &[String],
    max_lines: Option<usize>,
    verbose: u8,
    global_args: &[String],
) -> Result<i32> {
    match cmd {
        GitCommand::Diff => run_diff(args, max_lines, verbose, global_args),
        GitCommand::Log => run_log(args, max_lines, verbose, global_args),
        GitCommand::Status => run_status(args, verbose, global_args),
        // ... etc
    }
}
```

### Smart Locale Handling

Prevents locale-dependent output from breaking RTK's parsing:

```rust
/// Create a git Command for internal parsing (must be locale-stable)
fn git_cmd_c_locale(global_args: &[String]) -> Command {
    let mut cmd = git_cmd(global_args);
    cmd.env("LC_ALL", "C");  // Force English output for parsing
    cmd
}

/// Create a git Command for user-visible output (respects user's locale)
fn git_cmd(global_args: &[String]) -> Command {
    let mut cmd = resolved_command("git");
    for arg in global_args {
        cmd.arg(arg);
    }
    cmd
}
```

### Diff Compaction Example

```rust
fn run_diff(
    args: &[String],
    max_lines: Option<usize>,
    verbose: u8,
    global_args: &[String],
) -> Result<i32> {
    let timer = tracking::TimedExecution::start();

    // Restore -- separator consumed by clap
    let args = &args_utils::restore_double_dash(args);

    // Check for stat-only output
    let wants_stat = args.iter().any(|arg| arg == "--stat" || arg == "--numstat");
    let wants_compact = !args.iter().any(|arg| arg == "--no-compact");

    if wants_stat || !wants_compact {
        // Passthrough: user explicitly requested stat or --no-compact
        let mut cmd = git_cmd(global_args);
        cmd.arg("diff");
        for arg in args {
            if arg != "--no-compact" {
                cmd.arg(arg);
            }
        }
        let result = exec_capture(&mut cmd)?;
        println!("{}", result.stdout.trim());
        
        timer.track("git diff", "rtk git diff", &result.stdout, &result.stdout);
        return Ok(result.exit_code);
    }

    // Compact mode: run diff, compress lines
    let mut cmd = git_cmd_c_locale(global_args);
    cmd.arg("diff").args(args);
    
    let result = stream::run_streaming(&mut cmd, StdinMode::Null, FilterMode::CaptureOnly)?;
    
    if result.exit_code != 0 {
        eprintln!("{}", result.raw_stderr);
        return Ok(result.exit_code);
    }

    // Apply line compaction (only changed lines)
    let filtered = compact_diff(&result.raw_stdout);
    println!("{}", filtered);
    
    timer.track("git diff", "rtk git diff", &result.raw_stdout, &filtered);
    Ok(result.exit_code)
}
```

---

## 4. Configuration System (src/core/config.rs)

TOML-based configuration with sensible defaults:

```rust
#[derive(Debug, Serialize, Deserialize, Default)]
pub struct Config {
    #[serde(default)]
    pub tracking: TrackingConfig,
    #[serde(default)]
    pub display: DisplayConfig,
    #[serde(default)]
    pub filters: FilterConfig,
    #[serde(default)]
    pub tee: crate::core::tee::TeeConfig,
    #[serde(default)]
    pub telemetry: TelemetryConfig,
    #[serde(default)]
    pub hooks: HooksConfig,
    #[serde(default)]
    pub limits: LimitsConfig,
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct HooksConfig {
    /// Commands to exclude from auto-rewrite
    pub exclude_commands: Vec<String>,
    
    /// Wrapper prefixes that should be transparently stripped before routing
    /// Example: ["docker exec mycontainer", "poetry run"]
    pub transparent_prefixes: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TrackingConfig {
    pub enabled: bool,
    pub history_days: u32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub database_path: Option<PathBuf>,
}

impl Default for TrackingConfig {
    fn default() -> Self {
        Self {
            enabled: true,
            history_days: 90,  // 3-month retention
            database_path: None,
        }
    }
}
```

**Storage Locations (platform-aware):**

- Linux: `~/.local/share/rtk/`
- macOS: `~/Library/Application Support/rtk/`
- Windows: `%APPDATA%\rtk\`

---

## 5. Token Tracking and Analytics (src/core/tracking.rs)

### TimedExecution: Timing Wrapper

```rust
/// Automatic token savings tracker.
/// Call `timer.track()` at end of command execution.
pub struct TimedExecution {
    start: Instant,
}

impl TimedExecution {
    pub fn start() -> Self {
        Self {
            start: Instant::now(),
        }
    }

    pub fn track(self, raw_cmd: &str, rtk_cmd: &str, raw_output: &str, filtered_output: &str) {
        let elapsed = self.start.elapsed();
        let tracker = Tracker::new().ok();
        
        // Estimate tokens (heuristic: ~1 token per 4 chars)
        let raw_tokens = raw_output.len() / 4;
        let filtered_tokens = filtered_output.len() / 4;
        let saved = raw_tokens.saturating_sub(filtered_tokens);
        
        if let Some(t) = tracker {
            let _ = t.record(raw_cmd, rtk_cmd, raw_tokens, filtered_tokens, elapsed.as_millis() as u64);
        }
    }
}
```

### Tracker: SQLite Query Interface

```rust
pub struct Tracker {
    conn: Connection,
}

#[derive(Debug)]
pub struct CommandRecord {
    pub timestamp: DateTime<Utc>,
    pub raw_command: String,
    pub rtk_command: String,
    pub input_tokens: usize,
    pub output_tokens: usize,
    pub elapsed_ms: u64,
    pub project_path: String,
}

impl Tracker {
    pub fn new() -> Result<Self> {
        let db_path = RTK_DATA_DIR.join(HISTORY_DB);
        fs::create_dir_all(&RTK_DATA_DIR)?;
        
        let conn = Connection::open(&db_path)?;
        conn.execute(
            "CREATE TABLE IF NOT EXISTS command_history (
                id INTEGER PRIMARY KEY,
                timestamp TEXT NOT NULL,
                raw_command TEXT NOT NULL,
                rtk_command TEXT NOT NULL,
                input_tokens INTEGER NOT NULL,
                output_tokens INTEGER NOT NULL,
                elapsed_ms INTEGER NOT NULL,
                project_path TEXT NOT NULL
            )",
            [],
        )?;
        
        Ok(Self { conn })
    }

    pub fn record(
        &self,
        raw_cmd: &str,
        rtk_cmd: &str,
        input_tokens: usize,
        output_tokens: usize,
        elapsed_ms: u64,
    ) -> Result<()> {
        let project_path = current_project_path_string();
        
        self.conn.execute(
            "INSERT INTO command_history 
             (timestamp, raw_command, rtk_command, input_tokens, output_tokens, elapsed_ms, project_path)
             VALUES (?, ?, ?, ?, ?, ?, ?)",
            params![
                Utc::now().to_rfc3339(),
                raw_cmd,
                rtk_cmd,
                input_tokens,
                output_tokens,
                elapsed_ms,
                project_path,
            ],
        )?;
        Ok(())
    }

    pub fn get_summary(&self) -> Result<Summary> {
        let mut stmt = self.conn.prepare(
            "SELECT 
                COUNT(*) as count,
                SUM(input_tokens) as total_input,
                SUM(output_tokens) as total_output,
                AVG(elapsed_ms) as avg_time
             FROM command_history
             WHERE timestamp > datetime('now', '-90 days')"
        )?;
        
        let summary = stmt.query_row([], |row| {
            Ok(Summary {
                command_count: row.get(0)?,
                total_input_tokens: row.get(1)?,
                total_output_tokens: row.get(2)?,
                total_saved: row.get::<_, usize>(1)? - row.get::<_, usize>(2)?,
                avg_time_ms: row.get(3)?,
            })
        })?;
        
        Ok(summary)
    }
}
```

---

## 6. Hook Integrity & Security (src/hooks/integrity.rs)

RTK installs a **PreToolUse hook** that auto-rewrites commands. To prevent tampering:

```rust
/// Result of hook integrity verification
#[derive(Debug, PartialEq)]
pub enum IntegrityStatus {
    Verified,                                    // Hash matches
    Tampered { expected: String, actual: String }, // Hash mismatch (!)
    NoBaseline,                                  // Pre-integrity-check install
    NotInstalled,                                // RTK not installed
    OrphanedHash,                                // Hash but no hook
}

/// Compute SHA-256 hash of hook script
pub fn compute_hash(path: &Path) -> Result<String> {
    let content = fs::read(path)?;
    let mut hasher = Sha256::new();
    hasher.update(&content);
    Ok(format!("{:x}", hasher.finalize()))
}

/// Store hash after installation (format: `<hash>  <filename>`)
pub fn store_hash(hook_path: &Path) -> Result<()> {
    let hash = compute_hash(hook_path)?;
    let hash_file = hook_path.parent()?.join(".rtk-hook.sha256");
    let content = format!("{}  {}\n", hash, hook_path.file_name()?.to_str()?);
    
    fs::write(&hash_file, &content)?;
    
    // Set hash file read-only (speed bump against casual modification)
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        fs::set_permissions(&hash_file, fs::Permissions::from_mode(0o444))?;
    }
    
    Ok(())
}

/// Verify hook hasn't been tampered with
pub fn verify(hook_path: &Path) -> Result<IntegrityStatus> {
    let hash_file = hook_path.parent()?.join(".rtk-hook.sha256");
    
    if !hook_path.exists() && !hash_file.exists() {
        return Ok(IntegrityStatus::NotInstalled);
    }
    
    if !hash_file.exists() {
        return Ok(IntegrityStatus::NoBaseline);
    }
    
    if !hook_path.exists() {
        return Ok(IntegrityStatus::OrphanedHash);
    }
    
    let stored = fs::read_to_string(&hash_file)?;
    let expected = stored.split_whitespace().next().unwrap_or("");
    let actual = compute_hash(hook_path)?;
    
    if expected == actual {
        Ok(IntegrityStatus::Verified)
    } else {
        Ok(IntegrityStatus::Tampered {
            expected: expected.to_string(),
            actual,
        })
    }
}
```

---

## 7. Command Discovery & Analytics (src/discover/mod.rs)

RTK scans Claude Code session logs to identify **which commands saved the most tokens**:

```rust
pub fn run(
    project: Option<&str>,
    all: bool,
    since_days: u64,
    limit: usize,
    format: &str,
    verbose: u8,
) -> Result<()> {
    let provider = ClaudeProvider;
    
    // Determine project filter
    let project_filter = if all {
        None
    } else if let Some(p) = project {
        Some(p.to_string())
    } else {
        // Default: current working directory
        let cwd = std::env::current_dir()?;
        let cwd_str = cwd.to_string_lossy().to_string();
        let encoded = ClaudeProvider::encode_project_path(&cwd_str);
        Some(encoded)
    };

    // Scan session files
    let sessions = provider.discover_sessions(project_filter.as_deref(), Some(since_days))?;
    
    let mut total_commands = 0;
    let mut supported_map: HashMap<&'static str, SupportedBucket> = HashMap::new();
    let mut unsupported_map: HashMap<String, UnsupportedBucket> = HashMap::new();

    for session_path in &sessions {
        let extracted = provider.extract_commands(&session_path)?;

        for ext_cmd in &extracted {
            let parts = split_command_chain(&ext_cmd.command);
            
            for part in parts {
                total_commands += 1;

                // Skip if RTK_DISABLED
                if prefix_contains_rtk_disabled(&part) {
                    continue;
                }

                let classification = classify_command(&part);
                
                match classification {
                    Classification::Supported { rtk_equivalent, category } => {
                        // Estimate tokens saved
                        let raw_tokens = estimate_tokens(&ext_cmd.output);
                        let filtered_tokens = estimate_filtered_tokens(&ext_cmd.output, &category);
                        let saved = raw_tokens.saturating_sub(filtered_tokens);
                        
                        supported_map
                            .entry(rtk_equivalent)
                            .or_insert_with(|| SupportedBucket { /* ... */ })
                            .total_output_tokens += saved;
                    }
                    Classification::Unsupported { reason } => {
                        unsupported_map
                            .entry(reason)
                            .or_insert(UnsupportedBucket { count: 0, example: part.clone() })
                            .count += 1;
                    }
                }
            }
        }
    }
    
    // Report findings
    print_report(&supported_map, &unsupported_map, total_commands, format)?;
    Ok(())
}

/// Aggregation bucket for supported commands
struct SupportedBucket {
    rtk_equivalent: &'static str,
    category: &'static str,
    count: usize,
    total_output_tokens: usize,  // Savings
    total_raw_output_tokens: usize, // Before filtering
    command_counts: HashMap<String, usize>,
}
```

---

## 8. Reusable Patterns and Idioms

### Pattern 1: Builder-Style Options (RunOptions)

```rust
pub struct RunOptions<'a> {
    pub tee_label: Option<&'a str>,
    pub filter_stdout_only: bool,
    pub skip_filter_on_failure: bool,
    // ...
}

impl<'a> RunOptions<'a> {
    // Named constructors for common use cases
    pub fn with_tee(label: &'a str) -> Self { /* ... */ }
    pub fn stdout_only() -> Self { /* ... */ }
    
    // Fluent API for customization
    pub fn tee(mut self, label: &'a str) -> Self { /* ... */ }
    pub fn early_exit_on_failure(mut self) -> Self { /* ... */ }
}

// Usage
runner::run(
    cmd,
    "tool",
    RunMode::Filtered(Box::new(filter_fn)),
    RunOptions::default()
        .with_tee("label")
        .skip_filter_on_failure()
)
```

### Pattern 2: Trait-Based Polymorphism for Filtering

```rust
// Generic handler trait
pub trait BlockHandler {
    fn should_skip(&mut self, line: &str) -> bool;
    fn is_block_start(&mut self, line: &str) -> bool;
    fn is_block_continuation(&mut self, line: &str, block: &[String]) -> bool;
    fn format_summary(&self, exit_code: i32, raw: &str) -> Option<String>;
}

// Generic stream adapter
pub struct BlockStreamFilter<H: BlockHandler> {
    handler: H,
    // ... state management
}

impl<H: BlockHandler> StreamFilter for BlockStreamFilter<H> {
    fn feed_line(&mut self, line: &str) -> Option<String> {
        // Stateless routing to handler trait methods
        // Handler encapsulates filter logic
    }
}

// Concrete implementation (test output filtering)
struct TestOutputHandler {
    failures: Vec<String>,
}

impl BlockHandler for TestOutputHandler {
    fn is_block_start(&mut self, line: &str) -> bool {
        line.starts_with("FAILED")
    }
    fn format_summary(&self, exit_code: i32, raw: &str) -> Option<String> {
        if self.failures.is_empty() { Some("[PASS]".to_string()) }
        else { Some(format!("[FAIL] {}", self.failures.len())) }
    }
    // ...
}

// Usage
let handler = TestOutputHandler { failures: vec![] };
let filter = BlockStreamFilter::new(handler);
// Process stream via filter
```

### Pattern 3: Enum Dispatch (Command Routing)

```rust
#[derive(Debug, Clone)]
pub enum GitCommand {
    Diff, Log, Status, Show, Add, Commit, Push, Pull, // ...
}

pub fn run(cmd: GitCommand, args: &[String]) -> Result<i32> {
    match cmd {
        GitCommand::Diff => run_diff(args),
        GitCommand::Log => run_log(args),
        // Each variant can have different argument handling
    }
}
```

### Pattern 4: Platform-Aware Paths (Trait-based)

```rust
// Abstraction over OS-specific paths
const RTK_DATA_DIR: &str = "rtk";  // Used with dirs crate

// Computed at runtime
fn config_path() -> PathBuf {
    dirs::config_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join("rtk")
        .join("config.toml")
}

// Usage
let config = fs::read_to_string(config_path())?;
```

### Pattern 5: Error Context Chain (anyhow)

```rust
use anyhow::{Context, Result};

fn read_config() -> Result<Config> {
    let path = config_path();
    let content = fs::read_to_string(&path)
        .with_context(|| format!("Failed to read config from {}", path.display()))?;
    
    toml::from_str(&content)
        .context("Failed to parse config.toml")
}

// Error output:
// Error: Failed to parse config.toml
// 
// Caused by:
//     0: Failed to read config from ~/.local/share/rtk/config.toml
//     1: No such file or directory (os error 2)
```

---

## 9. Error Handling Strategy

### Exit Code Propagation

RTK preserves the wrapped command's exit code:

```rust
pub fn run(
    mut cmd: Command,
    tool_name: &str,
    mode: RunMode,
    opts: RunOptions,
) -> Result<i32> {
    let result = stream::run_streaming(&mut cmd, /* ... */)?;
    
    // Filter output, but preserve exit code
    let exit_code = result.exit_code;
    
    if opts.skip_filter_on_failure && exit_code != 0 {
        // On error, skip filtering (show raw error messages)
        print!("{}", result.raw_stdout);
    } else {
        // Apply filter
        let filtered = filter_fn(&result.raw_stdout);
        print!("{}", filtered);
    }
    
    Ok(exit_code)  // Return original exit code
}
```

### Validation Without Panics

RTK uses `Result` and `anyhow::Context` instead of `.unwrap()`:

```rust
// Good: Propagates with context
fn verify_hook(path: &Path) -> Result<()> {
    fs::read(path)
        .with_context(|| format!("Cannot read hook at {}", path.display()))?;
    Ok(())
}

// Bad (never appears in RTK):
// fs::read(path).unwrap();  // <-- Panic on missing file
```

---

## 10. Dependencies & Build Profile

### Key Dependencies

| Crate | Purpose |
|-------|---------|
| `clap` | CLI parsing & routing |
| `regex` | Pattern matching (comment removal) |
| `serde`/`serde_json`/`toml` | Config & data serialization |
| `rusqlite` | SQLite tracking database |
| `sha2` | Hook integrity verification |
| `colored` | Terminal color output |
| `dirs` | Platform-aware paths (config, cache) |
| `ignore`/`walkdir` | Recursive file discovery |
| `tempfile` | Temporary files for tests |
| `which` | Locate executables in PATH |
| `flate2` | Gzip compression (downloads) |
| `quick-xml` | XML parsing (.trx test results) |

### Release Profile

```toml
[profile.release]
opt-level = 3          # Maximum optimization
lto = true             # Link-time optimization
codegen-units = 1      # Single codegen unit (slower compile, faster binary)
panic = "abort"        # Crash on panic (smaller binary)
strip = true           # Strip symbols (smaller binary)
```

**Result:** Fully-optimized, compact binary suitable for CI/CD pipelines.

---

## 11. Key Insights

1. **Pluggable Filters via Traits:** The `StreamFilter` trait allows RTK to support 30+ commands with a unified pipeline (line-buffering, exit-code handling, tee logging).

2. **Locale Stability:** Git commands explicitly set `LC_ALL=C` for parsing but use default locale for user output, preventing locale-dependent behavior from breaking RTK.

3. **Token Estimation Heuristic:** ~1 token per 4 characters (conservative). Actual savings tracked in SQLite database for reporting.

4. **Hook Integrity:** SHA-256 verification prevents command injection attacks on the auto-rewrite hook.

5. **Project-Scoped Analytics:** Token savings tracked per project (not global) using `GLOB` patterns in SQLite queries.

6. **No Unwrap Culture:** All Rust code uses `Result` + `Context`, enabling graceful error recovery.

7. **Builder Pattern for Options:** `RunOptions` uses fluent API to avoid function signature explosions.

8. **Discovery via Session Scanning:** RTK scans Claude Code session logs to recommend which commands to use (via `rtk discover`).

---

## Quick Reference: How RTK Processes a Command

```
User Input: "rtk git log"
    ↓
CLI Parser (clap) → GitCommand::Log variant
    ↓
run_log(args, max_lines, verbose, global_args)
    ↓
TimedExecution::start() [Timer created]
    ↓
Command::new("git") → .arg("log") → .args(args)
    ↓
stream::run_streaming() [Capture output]
    ↓
Check exit_code:
  ├─ exit_code != 0 → print raw output
  └─ exit_code == 0 → apply filter_fn
    ↓
log_filter(output)  [Compact lines, group by commit]
    ↓
println!("{}", filtered)
    ↓
timer.track(raw, filtered) [Record tokens saved to SQLite]
    ↓
Return exit_code
```
