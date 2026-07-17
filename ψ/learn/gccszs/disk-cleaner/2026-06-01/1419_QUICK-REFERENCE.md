---
name: 1419-quick-reference
description: Disk Cleaner is a comprehensive cross-platform disk space monitoring, analysis, 
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-15
  source: fleet-memory
---

# Disk Cleaner v2.1 - Quick Reference Guide

## What It Does

Disk Cleaner is a comprehensive cross-platform disk space monitoring, analysis, and intelligent cleaning toolkit for Windows, Linux, and macOS. It features advanced 3D file classification (type × risk × age matrix), duplicate detection, progressive scanning for large disks (1-second samples, 30-second progressive scans), automated scheduling, and platform-specific optimization. No external dependencies—pure Python standard library implementation supporting Python 3.6+.

## Installation

### Option 1: Install as Claude Code Skill (Recommended)
```bash
npx add-skill gccszs/disk-cleaner
# or
npx skills add gccszs/disk-cleaner
```

### Option 2: Clone from GitHub (Development/Standalone)
```bash
git clone https://github.com/gccszs/disk-cleaner.git
cd disk-cleaner
python skills/disk-cleaner/scripts/analyze_disk.py
```

### Option 3: Verify Installation
```bash
python skills/disk-cleaner/scripts/check_skill.py
```

## Key Features

- **Progressive Scanning**: Quick sample mode (1 second) estimates disk size; progressive mode delivers partial results in 30 seconds for large disks (500GB+)
- **Intelligent Bootstrap**: Auto-detects 20+ common skill package locations and handles module imports with fallbacks
- **3D File Classification**: Categorizes files by type, risk level, and age for smart cleanup decisions
- **Duplicate Detection**: Finds and removes redundant files with adaptive detection strategies
- **Incremental Scanning**: Cache-based performance optimization for 10x faster repeated scans
- **Cross-Platform Safety**: Protected paths (system directories), protected extensions (executables), process-aware file locking detection
- **Platform-Specific Cleanup**: Windows Update caches, Linux package manager caches (apt/dnf/pacman), macOS Xcode derived data
- **Automated Scheduling**: Timer-based recurring cleanup tasks
- **Interactive Cleanup UI**: 5 view modes with visual feedback and manual selection
- **Enhanced Cache Detection**: 26+ cache paths identified (225% improvement from v2.0)
- **Zero Dependencies**: Pure Python standard library—no pip installs needed

## CLI Usage & Examples

### Core Analysis Scripts

#### `analyze_disk.py` — Disk Space Analysis
Analyzes disk usage to identify large files and directories.

```bash
# Analyze default drive (C:\ Windows, / Unix)
python skills/disk-cleaner/scripts/analyze_disk.py

# Analyze specific path
python skills/disk-cleaner/scripts/analyze_disk.py --path "D:\Projects"

# Quick sample (1-second estimation)
python skills/disk-cleaner/scripts/analyze_disk.py --sample

# Get top N largest items (default 20)
python skills/disk-cleaner/scripts/analyze_disk.py --top 50

# JSON output for automation
python skills/disk-cleaner/scripts/analyze_disk.py --json
python skills/disk-cleaner/scripts/analyze_disk.py --output disk_report.json

# Deep scan (no file limit)
python skills/disk-cleaner/scripts/analyze_disk.py --deep-scan
```

#### `analyze_progressive.py` — Progressive Scanning for Large Disks
Designed specifically for large disks; returns partial results on time/file limit or Ctrl+C.

```bash
# Quick sample (1-second estimation)
python skills/disk-cleaner/scripts/analyze_progressive.py --sample

# Progressive scan with 30-second limit
python skills/disk-cleaner/scripts/analyze_progressive.py --max-seconds 30

# Progressive scan with file count limit
python skills/disk-cleaner/scripts/analyze_progressive.py --max-files 50000

# Both limits (uses whichever hits first)
python skills/disk-cleaner/scripts/analyze_progressive.py --max-seconds 60 --max-files 100000
```

#### `find_duplicates.py` — Duplicate File Detection (v2.2+)
Identifies and removes duplicate files based on content hashing.

```bash
# Find duplicates in directory
python skills/disk-cleaner/scripts/find_duplicates.py --path /target/dir

# Preview duplicates (dry-run)
python skills/disk-cleaner/scripts/find_duplicates.py --path /target/dir --dry-run

# Keep only most recent copy
python skills/disk-cleaner/scripts/find_duplicates.py --path /target/dir --keep-newest

# Actually delete duplicates
python skills/disk-cleaner/scripts/find_duplicates.py --path /target/dir --force
```

#### `analyze_growth.py` — Growth Trend Analysis (v2.2+)
Tracks disk usage over time and predicts when disk will be full.

```bash
# Analyze growth trends
python skills/disk-cleaner/scripts/analyze_growth.py

# Show growth for specific path
python skills/disk-cleaner/scripts/analyze_growth.py --path /target/dir

# Predict when disk runs out of space
python skills/disk-cleaner/scripts/analyze_growth.py --predict
```

### Cleaning & Organization Scripts

#### `clean_disk.py` — Safe Junk File Removal
Removes temporary files, caches, logs, and recycled items with comprehensive safety checks.

```bash
# ALWAYS preview first (dry-run mode is default)
python skills/disk-cleaner/scripts/clean_disk.py --dry-run

# Clean all categories
python skills/disk-cleaner/scripts/clean_disk.py --force

# Clean specific categories only
python skills/disk-cleaner/scripts/clean_disk.py --temp       # Temp files (%TEMP%, /tmp)
python skills/disk-cleaner/scripts/clean_disk.py --cache      # Application/browser caches
python skills/disk-cleaner/scripts/clean_disk.py --logs       # Log files (older than 30 days)
python skills/disk-cleaner/scripts/clean_disk.py --recycle    # Recycle bin / trash

# Clean downloads older than N days
python skills/disk-cleaner/scripts/clean_disk.py --downloads 90

# Combine multiple categories
python skills/disk-cleaner/scripts/clean_disk.py --temp --cache --logs --force
```

#### `interactive_wizard.py` — Interactive Guided Cleanup (v2.2+)
Step-by-step cleanup with safety confirmations and preview.

```bash
# Launch interactive wizard
python skills/disk-cleaner/scripts/interactive_wizard.py

# Wizard with specific starting path
python skills/disk-cleaner/scripts/interactive_wizard.py --path /target/dir
```

#### `organize_files.py` — File Organization & Archival (v2.2+)
Intelligent file archival with multiple strategies.

```bash
# Organize desktop
python skills/disk-cleaner/scripts/organize_files.py --strategy desktop --dry-run

# Organize downloads by date
python skills/disk-cleaner/scripts/organize_files.py --target ~/Downloads --strategy downloads

# Archive old files (> 1 year)
python skills/disk-cleaner/scripts/organize_files.py --strategy archive --min-age 365

# Actually move/archive files
python skills/disk-cleaner/scripts/organize_files.py --force
```

### Monitoring & Diagnostics Scripts

#### `monitor_disk.py` — Disk Usage Monitoring
One-shot or continuous monitoring with configurable thresholds.

```bash
# Single check (exit immediately)
python skills/disk-cleaner/scripts/monitor_disk.py

# Continuous monitoring (checks every 60 seconds)
python skills/disk-cleaner/scripts/monitor_disk.py --watch

# Custom monitoring interval (5 minutes = 300 seconds)
python skills/disk-cleaner/scripts/monitor_disk.py --watch --interval 300

# Custom thresholds (warning at 70%, critical at 85%)
python skills/disk-cleaner/scripts/monitor_disk.py --warning 70 --critical 85

# Alert mode for CI/CD (exit codes: 0=OK, 1=WARNING, 2=CRITICAL)
python skills/disk-cleaner/scripts/monitor_disk.py --alerts-only

# JSON output
python skills/disk-cleaner/scripts/monitor_disk.py --json
```

#### `check_skill.py` — Diagnostic Tool
Verifies skill package functionality and environment.

```bash
# Full diagnostic check
python skills/disk-cleaner/scripts/check_skill.py

# Verifies: Python version, file structure, module imports, permissions, script execution
```

### Scheduling & Automation

#### `scheduler.py` — Automated Cleanup Scheduling
Set up recurring cleanup tasks.

```bash
# Add daily cleanup of /tmp
python skills/disk-cleaner/scripts/scheduler.py add "Daily Temp Cleanup" /tmp 24h --type temp

# List all scheduled tasks
python skills/disk-cleaner/scripts/scheduler.py list

# Run due tasks (dry-run by default)
python skills/disk-cleaner/scripts/scheduler.py run

# Run with actual deletion
python skills/disk-cleaner/scripts/scheduler.py run --force

# Remove scheduled task
python skills/disk-cleaner/scripts/scheduler.py remove "Task Name"
```

### Python API Usage

#### Smart Cleanup Engine
```python
from diskcleaner.core import SmartCleanupEngine

# Initialize engine
engine = SmartCleanupEngine("/path/to/clean", cache_enabled=True)

# Analyze directory
report = engine.analyze(
    include_duplicates=True,
    safety_check=True
)

# Get summary
print(engine.get_summary(report))
```

#### Platform-Specific Cleanup
```python
from diskcleaner.platforms import WindowsPlatform, LinuxPlatform, MacOSPlatform
import platform

if platform.system() == "Windows":
    platform_impl = WindowsPlatform()
elif platform.system() == "Linux":
    platform_impl = LinuxPlatform()
else:
    platform_impl = MacOSPlatform()

# Get platform-specific cleanup suggestions
items = platform_impl.get_system_maintenance_items()
for key, item in items.items():
    print(f"{item['name']}: {item['description']}")
    print(f"  Risk: {item['risk']}, Size: {item['size_hint']}")
```

#### Interactive Cleanup UI
```python
from diskcleaner.core import InteractiveCleanupUI

ui = InteractiveCleanupUI(report)
ui.display_menu()  # Shows 5 view options with user selection
```

## Configuration

### Environment Variables

- `DISK_CLEANER_SKILL_PATH`: Override skill package location detection
  ```bash
  export DISK_CLEANER_SKILL_PATH=/custom/path/to/disk-cleaner
  python skills/disk-cleaner/scripts/analyze_disk.py
  ```

### Script Defaults

Core defaults (customizable via CLI flags):
- **Max Files**: 500,000 files (use `--deep-scan` to remove limit)
- **Max Time**: 120 seconds (configurable with `--max-seconds`)
- **Dry-run**: Enabled by default for all cleanup operations
- **Warning Threshold**: 70% disk usage
- **Critical Threshold**: 85% disk usage
- **Log Retention**: 30 days (files older than this are marked for cleanup)
- **Download Retention**: 90 days (configurable with `--downloads N`)

### Python Configuration

Default configuration module: `diskcleaner/config/defaults.py`

Key config options:
```python
MAX_FILES = 500000
MAX_SCAN_TIME = 120
PROTECTED_PATHS = [...system directories...]
PROTECTED_EXTENSIONS = [...executables...]
CACHE_LOCATIONS = {...26+ cache paths...}
```

## Supported Platforms & File Types

### Platforms

| Feature | Windows | Linux | macOS |
|---------|---------|-------|-------|
| Disk Analysis | ✅ | ✅ | ✅ |
| Progressive Scanning | ✅ | ✅ | ✅ |
| Quick Sample Mode | ✅ | ✅ | ✅ |
| Temp Cleaning | ✅ | ✅ | ✅ |
| Cache Cleaning | ✅ | ✅ | ✅ |
| Log Cleaning | ✅ | ✅ | ✅ |
| Recycle Bin | ✅ | ✅ | ✅ |
| Real-time Monitoring | ✅ | ✅ | ✅ |
| Duplicate Detection | ✅ | ✅ | ✅ |
| Growth Analysis | ✅ | ✅ | ✅ |
| GBK Console (Windows) | ✅ | N/A | N/A |
| UTF-8 Console | ✅ | ✅ | ✅ |

### Specific Locations Cleaned

**Windows:**
- `%TEMP%`, `%TMP%`, `%LOCALAPPDATA%\Temp`
- `C:\Windows\Temp`, `C:\Windows\Prefetch`
- `C:\Windows\SoftwareDistribution\Download`
- Browser caches: Chrome, Edge, Firefox
- Development caches: npm, pip, Gradle, Maven
- Recycle Bin

**Linux:**
- `/tmp`, `/var/tmp`, `/var/cache`
- Package manager caches: apt, dnf, pacman
- Browser caches: Chrome, Firefox
- Development caches: npm, pip, Gradle

**macOS:**
- `/tmp`, `/private/tmp`, `/var/folders`
- `~/Library/Caches`, `~/Library/Logs`
- iOS device backups
- Homebrew cache
- Xcode derived data

### Protected Paths (Never Deleted)

**Windows:** `C:\Windows`, `C:\Program Files`, `C:\ProgramData`

**Linux/macOS:** `/usr`, `/bin`, `/sbin`, `/System`, `/Library`, `/etc`, `/boot`

### Protected Extensions (Never Deleted)

`.exe`, `.dll`, `.sys`, `.drv`, `.bat`, `.cmd`, `.ps1`, `.sh`, `.bash`, `.zsh`, `.app`, `.dmg`, `.pkg`, `.deb`, `.rpm`, `.msi`, `.iso`, `.vhd`, `.vhdx`

## Notable Limitations & Caveats

1. **Python Requirement**: Requires Python 3.6 or higher (3.7+ recommended). No pre-compiled binary; uses Python standard library only.

2. **File Locking**: Files currently in use by system or other processes may not be deletable, even with administrator/root privileges. The tool detects locks and skips protected files.

3. **Permission Constraints**: User must have read permissions to scan and write permissions to delete. Cannot clean system-protected directories without elevated privileges.

4. **Large Disk Scanning**: Full disk scans on systems with 1M+ files may exceed time limits. Always use `--sample` or `--max-seconds` for initial assessment.

5. **Dry-Run Discrepancy**: Actual freed space may differ slightly from dry-run estimates due to:
   - File system allocation units (clusters)
   - Sparse files
   - Hard links (only one deleted if duplicated)

6. **Encoding Safety**: All script output uses ASCII characters (no emoji) for Windows GBK console compatibility. Agent tools should use emoji in reports to humans, not in script output.

7. **Network Drives**: Performance significantly degraded on network/mounted drives. Not recommended for network shares.

8. **Case Sensitivity**: On case-sensitive systems (Linux), files differing only in case may be detected as duplicates.

9. **Symbolic Links**: By default, symlinks are followed; use caution to avoid following circular references.

10. **Windows Directory Scanning**: System directories require `--include-windows` flag and elevated privileges. Not recommended for casual users.

## Use Case Examples

### Scenario 1: Free Up C Drive on Windows
```bash
# Step 1: Analyze what's taking space
python skills/disk-cleaner/scripts/analyze_disk.py

# Step 2: Preview cleanup (dry-run)
python skills/disk-cleaner/scripts/clean_disk.py --dry-run

# Step 3: Execute cleanup
python skills/disk-cleaner/scripts/clean_disk.py --force

# Step 4: Verify freed space
python skills/disk-cleaner/scripts/monitor_disk.py
```

### Scenario 2: Large Disk Analysis (500GB+)
```bash
# Quick sample (estimate scan time)
python skills/disk-cleaner/scripts/analyze_progressive.py --sample

# Progressive scan (get results in 30 seconds)
python skills/disk-cleaner/scripts/analyze_progressive.py --max-seconds 30

# If you want comprehensive results (may take hours)
python skills/disk-cleaner/scripts/analyze_disk.py --deep-scan
```

### Scenario 3: Automated Disk Monitoring in CI/CD
```bash
# In pipeline script:
python skills/disk-cleaner/scripts/monitor_disk.py --alerts-only --json

# Exit codes: 0=OK, 1=WARNING, 2=CRITICAL
if [ $? -ne 0 ]; then
  echo "Disk space issue detected!"
  exit 1
fi
```

### Scenario 4: Find and Remove Duplicates
```bash
# Find duplicates
python skills/disk-cleaner/scripts/find_duplicates.py --path ~/Documents

# Preview removals (dry-run)
python skills/disk-cleaner/scripts/find_duplicates.py --path ~/Documents --dry-run

# Keep newest, delete rest
python skills/disk-cleaner/scripts/find_duplicates.py --path ~/Documents --keep-newest --force
```

### Scenario 5: Predictive Disk Analysis
```bash
# Analyze growth trend
python skills/disk-cleaner/scripts/analyze_growth.py --predict

# Output shows: current usage, growth rate, estimated full date
```

## Common Workflows

### Safety-First Workflow
1. Run `check_skill.py` to verify environment
2. Run analysis with `analyze_disk.py` or `analyze_progressive.py`
3. Review results (JSON if needed for parsing)
4. Preview cleanup with `--dry-run`
5. Execute cleanup with `--force`
6. Monitor with `monitor_disk.py`

### Quick Cleanup
```bash
python skills/disk-cleaner/scripts/clean_disk.py --force
```

### Automated Maintenance
```bash
# Set up daily scheduled cleanup
python skills/disk-cleaner/scripts/scheduler.py add "Daily Cleanup" /tmp 24h --type temp
python skills/disk-cleaner/scripts/scheduler.py run --force
```

## Troubleshooting

**Script doesn't run:**
- Check Python version: `python --version` (need 3.6+)
- Run diagnostic: `python skills/disk-cleaner/scripts/check_skill.py`
- Try `python3` instead of `python`

**Permission denied errors:**
- Windows: Run as Administrator (right-click PowerShell, "Run as administrator")
- Linux/macOS: Use `sudo` for system directories

**Encoding errors on Windows:**
- Update to v2.1+ (includes cross-platform encoding fix)
- All scripts use ASCII-safe output by design

**Slow scanning:**
- Use `--sample` for quick estimate
- Use `--max-seconds 30` for progressive partial results
- Avoid network drives for analysis

**Can't delete specific files:**
- File may be locked by running process
- Check file permissions
- Run with elevated privileges (sudo/Administrator)
