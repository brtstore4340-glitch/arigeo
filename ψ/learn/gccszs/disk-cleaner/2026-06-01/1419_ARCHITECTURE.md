---
name: 1419-architecture
description: **Repository**: https://github.com/gccszs/disk-cleaner  
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-01
  source: fleet-memory
---

# Disk Cleaner v2.1 - Architecture Documentation

**Project**: disk-cleaner  
**Version**: 2.0.0-dev (2.1 release)  
**Repository**: https://github.com/gccszs/disk-cleaner  
**Architecture Analysis Date**: 2026-06-01  

---

## Table of Contents

1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Core Architecture](#core-architecture)
4. [Entry Points & CLI Scripts](#entry-points--cli-scripts)
5. [Core Abstractions & Classes](#core-abstractions--classes)
6. [Data Flow & Processing Pipeline](#data-flow--processing-pipeline)
7. [Dependencies](#dependencies)
8. [Platform Support](#platform-support)
9. [Performance Optimizations](#performance-optimizations)
10. [Configuration System](#configuration-system)

---

## Overview

**disk-cleaner** is a cross-platform disk space monitoring, analysis, and intelligent cleaning toolkit written in Python 3.6+. It provides:

- **Disk Space Analysis** - Identify files/directories consuming space
- **Intelligent Classification** - 3D categorization (type × risk × age)
- **Duplicate Detection** - Find and remove duplicate files
- **Safe Junk Cleaning** - Remove temp files, caches, logs with safety checks
- **Real-time Monitoring** - Track disk usage with configurable thresholds
- **Cross-Platform Support** - Windows, Linux, macOS with platform-specific optimizations
- **Zero External Dependencies** - Pure Python standard library implementation

**Key Architectural Principles**:
- Modular design with clear separation of concerns
- Pluggable configuration system with multi-level priority
- Cross-platform abstraction layer for OS-specific operations
- Comprehensive safety mechanisms (protected paths, file locking detection)
- Adaptive performance optimizations based on system resources

---

## Directory Structure

### Main Repository Layout

```
disk-cleaner/
├── diskcleaner/                    # Core library (primary source)
│   ├── __init__.py                 # Package root + version/exports
│   ├── config/                     # Configuration system
│   │   ├── __init__.py
│   │   ├── defaults.py             # Default configuration dictionary
│   │   └── loader.py               # Multi-level config loader (Config class)
│   ├── core/                       # Core functionality modules
│   │   ├── __init__.py             # Core module exports
│   │   ├── scanner.py              # DirectoryScanner: incremental dir scanning
│   │   ├── classifier.py           # FileClassifier: 3D file categorization
│   │   ├── cache.py                # CacheManager: scan result caching
│   │   ├── duplicate_finder.py     # DuplicateFinder: adaptive duplicate detection
│   │   ├── growth_analyzer.py      # GrowthAnalyzer: disk growth trends
│   │   ├── process_manager.py      # ProcessManager: process locking detection
│   │   ├── safety.py               # SafetyChecker: pre-deletion safety checks
│   │   ├── interactive.py          # InteractiveCleanupUI: menu-driven interface
│   │   ├── smart_cleanup.py        # SmartCleanupEngine: orchestrates all modules
│   │   ├── progress.py             # ProgressBar/IndeterminateProgress: CLI progress display
│   │   └── rules/
│   │       ├── __init__.py
│   │       └── archive_rules.py    # ArchiveAnalyzer: archive file handling
│   ├── optimization/               # Performance optimization layers
│   │   ├── __init__.py             # Optimization module exports
│   │   ├── concurrency.py          # ConcurrencyManager: thread/process pool management
│   │   ├── delete.py               # DeletionManager: async/batch deletion strategies
│   │   ├── hash.py                 # AdaptiveHasher/ParallelHasher: optimized hashing
│   │   ├── memory.py               # MemoryMonitor: memory usage tracking
│   │   ├── profiler.py             # PerformanceProfiler: performance measurement
│   │   └── scan.py                 # ConcurrentScanner: multi-threaded scanning
│   └── platforms/                  # Platform-specific implementations
│       ├── __init__.py             # Platform module exports
│       ├── windows.py              # WindowsPlatform class
│       ├── linux.py                # LinuxPlatform class
│       └── macos.py                # MacOSPlatform class
├── skills/disk-cleaner/            # Skill package for Agent integration
│   ├── SKILL.md                    # Skill definition & feature guide
│   ├── diskcleaner/                # Embedded copy of core modules
│   ├── scripts/                    # Executable CLI scripts (8 main)
│   │   ├── clean_disk.py           # Main junk file cleanup
│   │   ├── analyze_disk.py         # Basic disk analysis
│   │   ├── analyze_progressive.py  # Progressive scanning (30s max)
│   │   ├── find_duplicates.py      # Duplicate file finder
│   │   ├── interactive_wizard.py   # Interactive cleanup wizard
│   │   ├── monitor_disk.py         # Real-time disk monitoring
│   │   ├── organize_files.py       # File organization/archiving
│   │   ├── scheduler.py            # Automated cleanup scheduling
│   │   ├── skill_bootstrap.py      # Smart module loader for skill integration
│   │   └── check_skill.py          # Skill diagnostic tool
│   └── docs/                       # Reference documentation
├── tests/                          # Comprehensive test suite (244+ tests)
│   ├── conftest.py                 # Pytest configuration
│   ├── test_*.py                   # Unit tests for each module
│   └── benchmarks/                 # Performance benchmarks
├── examples/                       # Usage examples
│   └── archive_demo.py             # Archive processing example
├── pyproject.toml                  # Project metadata & build config
├── README.md                       # User documentation (English)
├── README_zh.md                    # Chinese documentation
├── V2.1-DEVELOPMENT-SUMMARY.md    # v2.1 release notes & changes
├── Makefile                        # Development task automation
└── .github/workflows/              # CI/CD pipelines
    ├── lint.yml                    # Code linting (black, isort, flake8, mypy)
    └── test.yml                    # Automated test execution
```

### Key Directories

**diskcleaner/** (280+ LOC core library)
- Pure Python implementation with no external dependencies
- Organized into logical domains: config, core, optimization, platforms
- Well-defined module boundaries with clear exports

**skills/disk-cleaner/** (Skill package)
- Self-contained skill for agent integration (Claude Code skills)
- Includes full diskcleaner modules + 8 executable scripts
- Skill definition in SKILL.md for agent discovery
- Diagnostic tools (check_skill.py, skill_bootstrap.py) for runtime verification

**tests/** (244+ tests)
- Comprehensive unit, integration, and benchmark tests
- Organized by module (test_scanner.py, test_classifier.py, etc.)
- Performance benchmarks (test_scan_performance.py, test_large_scale.py)

---

## Core Architecture

### Layered Architecture Model

```
┌─────────────────────────────────────────────────┐
│  CLI Entry Points (scripts/)                    │
│  clean_disk.py, analyze_disk.py, etc.          │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│  SmartCleanupEngine (orchestrator)              │
│  - Coordinates scanner, classifier, finder      │
│  - Generates CleanupReport with statistics      │
└─────────────────────┬───────────────────────────┘
          ┌───────────┼───────────┐
          │           │           │
┌─────────▼────┐ ┌────▼──────┐ ┌─▼──────────────┐
│ DirectoryScanner│ │FileClassifier│ │DuplicateFinder │
│ - Incremental  │ │ - 3D classify │ │- Adaptive hash │
│ - os.scandir() │ │ - Risk level  │ │- Size filter   │
│ - Cache-based  │ │ - Age-based   │ │- SHA-256 check │
└────────────────┘ └───────────────┘ └────────────────┘
        │                │                  │
┌───────▼──────────┬─────▼────────────────┬─▼──────────────┐
│ CacheManager     │ Config (multi-level) │ SafetyChecker  │
│ - FileSnapshot   │ - Defaults           │ - Lock detect  │
│ - ScanSnapshot   │ - User config        │ - Permissions  │
│ - Incr. updates  │ - Project config     │ - Protected   │
└──────────────────┴──────────────────────┴────────────────┘
```

### Module Responsibilities

#### Config Layer (`diskcleaner/config/`)

**Config** (loader.py:17-70)
- Multi-level configuration merging: defaults → user → project → CLI args
- Loads from ~/.disk-cleaner/config.yaml, .disk-cleaner.yaml
- Provides protected_paths, protected_extensions, protected_patterns
- Age thresholds, risk level definitions

**get_default_config()** (defaults.py)
- Baseline configuration for all platforms
- File type categories (logs, temp, cache, backup, downloads)
- Risk level mappings (SAFE, CONFIRM_NEEDED, PROTECTED)
- Performance tuning parameters

#### Core Scanning (`diskcleaner/core/scanner.py`)

**DirectoryScanner** (scanner.py:~200 LOC)
- Incremental directory traversal using os.scandir() (3-5x faster than Path.glob)
- Tracks FileInfo: path, name, size, mtime, is_dir, is_link, inode, depth
- Cross-platform path exclusion (PLATFORM_EXCLUDES dict)
- Excludes Windows system dirs, Linux /proc/sys/dev, macOS /System/Library
- Integration with CacheManager for delta-scanning
- Early stopping on file/time limits

Key Functions:
- `scan_directory(path, use_cache=True)` → List[FileInfo]
- `scan_incremental(path, previous_snapshot)` → List[FileInfo] (changed files only)

#### Core Classification (`diskcleaner/core/classifier.py`)

**FileClassifier** (classifier.py:~300 LOC)
- 3D categorization: Type × Risk × Age
- Risk levels: RiskLevel enum (SAFE, CONFIRM_NEEDED, PROTECTED)
- Type categories: 临时/构建产物 (temp/build), 日志文件 (logs), 缓存文件 (cache), etc.
- Age groups: recent (< 30 days), mid-term (30-90 days), old (> 90 days)

Key Methods:
- `classify(file_info)` → (type_cat, risk_level, age_group)
- `check_protection(file_info)` → bool
- Custom rules support via config

#### Duplicate Detection (`diskcleaner/core/duplicate_finder.py`)

**DuplicateFinder** (duplicate_finder.py:~250 LOC)
- Adaptive strategy selection based on file count
- ADAPTIVE_THRESHOLD = 1000 files
- Fast strategy: size + mtime pre-filtering for large directories
- Accurate strategy: SHA-256 hash comparison for smaller sets
- Returns DuplicateGroup objects with reclaimable_space metric

Key Methods:
- `find_duplicates(files: List[FileInfo])` → List[DuplicateGroup]
- `_find_by_hash(files)` → accurate duplicate detection
- `_find_by_fast_strategy(files)` → quick filtering approach

**DuplicateGroup** dataclass
- files: List[FileInfo]
- size: int (size per file)
- hash_value: Optional[str]
- reclaimable_space property: size × (count - 1)

#### Safety Checking (`diskcleaner/core/safety.py`)

**SafetyChecker** (safety.py:~400 LOC)
- Pre-deletion verification: file locks, permissions, protection status
- FileStatus enum: SAFE, LOCKED, NO_PERMISSION, PROTECTED, ERROR
- Cross-platform file lock detection
  - Windows: uses handle count via WMI
  - Linux/macOS: uses lsof command
- Protected path/extension/pattern matching from config
- Optional process termination (with confirmation)
- Backup creation before deletion (optional)

Key Methods:
- `verify_all(files: List[FileInfo])` → List[(FileInfo, FileStatus)]
- `check_file_lock(file_path)` → bool
- `create_backup(file_path)` → backup_path

#### Smart Cleanup Engine (`diskcleaner/core/smart_cleanup.py`)

**SmartCleanupEngine** (smart_cleanup.py:~350 LOC)
- Central orchestrator integrating all core modules
- Constructor: SmartCleanupEngine(config, scanner, classifier, finder, checker)
- Workflow: scan → classify → find_duplicates → safety_check → report

**CleanupReport** dataclass
- by_type: Dict[str, List[FileInfo]] - grouped by category
- by_risk: Dict[str, List[FileInfo]] - grouped by risk level
- by_age: Dict[str, List[FileInfo]] - grouped by age
- duplicates: List[DuplicateGroup]
- Statistics: total_files, total_size, reclaimable_space
- Properties: safe_reclaimable, confirm_reclaimable, duplicate_reclaimable, total_reclaimable

Key Methods:
- `analyze_directory(path)` → CleanupReport
- `recommend_cleanup()` → List[FileInfo] (safe candidates)

#### Interactive UI (`diskcleaner/core/interactive.py`)

**InteractiveCleanupUI** (interactive.py:~300 LOC)
- Menu-driven interface for report navigation
- 5 view modes: by_type, by_risk, by_age, duplicates, detailed_list
- Hierarchical display with date ranges and average age metrics

Key Methods:
- `display_report_menu(report)` → user selection
- `view_by_type(report)` → List[str] (selected file paths)
- `view_by_risk(report)`, `view_by_age(report)`, `view_duplicates(report)`

#### Caching Layer (`diskcleaner/core/cache.py`)

**FileSnapshot** dataclass (cache.py:16-36)
- path, size, mtime, inode
- to_dict() / from_dict() for JSON serialization
- Hashable for caching purposes

**ScanSnapshot** dataclass (cache.py:39-68)
- path, timestamp, files (List[FileSnapshot])
- total_size, file_count aggregations
- JSON serializable

**CacheManager** (cache.py:~200 LOC)
- Stores/loads scan results in ~/.disk-cleaner/cache/
- Delta detection: compares current scan vs cached snapshot
- Identifies added, deleted, modified files for incremental updates

---

## Entry Points & CLI Scripts

All scripts located in `skills/disk-cleaner/scripts/` and `diskcleaner/` directories.

### Primary Entry Points

#### 1. **clean_disk.py**
```python
# Purpose: Main junk file cleanup utility
# Usage: python clean_disk.py [--dry-run] [--path PATH] [--interactive]

class DiskCleaner:
    def __init__(self, dry_run: bool = True, show_progress: bool = True)
    def get_protected_paths() -> Set[str]
    def scan_junk_files(path: str) -> Dict[str, FileInfo]
    def clean_files(files: List[str]) -> Tuple[int, int]  # (count, freed_bytes)
```
- Scans directory for temporary/cache/log files
- Shows progress with optional ProgressBar
- Dry-run mode (default) for safety
- Interactive mode for selective deletion
- Returns cleanup statistics

#### 2. **analyze_disk.py**
```python
# Purpose: Comprehensive disk analysis and reporting
# Usage: python analyze_disk.py [--path PATH] [--duplicates] [--format json|text]

# Main workflow:
# 1. DirectoryScanner.scan_directory()
# 2. FileClassifier categorization
# 3. DuplicateFinder detection
# 4. Output formatted report
```
- Detailed breakdown by file type, size, count
- Identifies large files (top 20)
- Optional duplicate detection
- Supports JSON/text output formats

#### 3. **analyze_progressive.py**
```python
# Purpose: Progressive scanning for large disks (v2.1 feature)
# Usage: python analyze_progressive.py [--sample] [--max-seconds 30] [--max-files 50000]

# Features:
# - Quick sample: 1 second estimation
# - Progressive scan: 30 second partial results
# - Interruptible (Ctrl+C)
# - Real-time progress updates
```
- Solves disk scanning timeout for 500GB+ disks
- Adaptive sampling: scans representative subdirectories
- Returns partial but useful results
- Essential for large-scale deployments

#### 4. **find_duplicates.py**
```python
# Purpose: Specialized duplicate file detection
# Usage: python find_duplicates.py --path PATH [--min-size SIZE]

# Uses DuplicateFinder with:
# - FileInfo from DirectoryScanner
# - Adaptive strategy (fast/accurate)
# - SHA-256 hashing for accuracy
```
- Lists duplicate files grouped by hash
- Shows reclaimable space per group
- Safe removal recommendations
- Supports size filtering (--min-size)

#### 5. **interactive_wizard.py**
```python
# Purpose: Step-by-step interactive cleanup
# Usage: python interactive_wizard.py

# Workflow:
# 1. Select target directory
# 2. SmartCleanupEngine.analyze_directory()
# 3. InteractiveCleanupUI menu navigation
# 4. Select files/categories
# 5. Confirmation + execute cleanup
```
- User-friendly menu interface (Chinese)
- Real-time selection feedback
- Safety confirmations
- Detailed cleanup report

#### 6. **monitor_disk.py**
```python
# Purpose: Real-time disk monitoring with alerts
# Usage: python monitor_disk.py [--interval 5] [--threshold 90]

# Features:
# - Periodic disk usage polling
# - Alerts when threshold exceeded
# - Historical tracking (JSON file)
# - ASCII-safe output for all platforms
```
- Continuous monitoring in background
- Configurable polling interval
- JSON-based usage history
- Cross-platform compatibility

#### 7. **organize_files.py**
```python
# Purpose: File organization and archiving
# Usage: python organize_files.py [--path PATH] [--by type|date|size]

# Uses archive rules from diskcleaner/core/rules/archive_rules.py
```
- Organizes files into directories (by date, type, size)
- Archive creation for old files
- Configurable organization rules

#### 8. **scheduler.py**
```python
# Purpose: Automated cleanup scheduling
# Usage: python scheduler.py --task clean [--cron "0 2 * * *"]

# Features:
# - Cron-based scheduling
# - Multiple scheduled cleanup tasks
# - Persistent task storage
# - Cross-platform support
```
- Schedule cleanup operations
- Persistent task storage in JSON
- Cron expression parsing

#### Bootstrap & Diagnostics

**skill_bootstrap.py**
```python
# Auto-detection of skill package location
# Searches 20+ common installation paths
# Fallback to installed version if needed
# Environment variable override: DISK_CLEANER_SKILL_PATH
```

**check_skill.py**
```python
# Diagnostic tool for skill validation
# Tests all core module imports
# Verifies script executability
# Reports skill readiness
```

---

## Core Abstractions & Classes

### Data Classes & Enums

#### FileInfo (scanner.py:88-99)
```python
@dataclass
class FileInfo:
    path: str           # Full path
    name: str           # Filename only
    size: int           # File size in bytes
    mtime: float        # Last modification time (Unix timestamp)
    is_dir: bool        # Is directory?
    is_link: bool       # Is symlink?
    inode: Optional[int] = None  # Inode number (for cross-volume tracking)
    depth: int = 0      # Directory depth from root
```

#### RiskLevel Enum (classifier.py:18-23)
```python
class RiskLevel(Enum):
    SAFE = "safe"                    # Temp files, logs, caches
    CONFIRM_NEEDED = "confirm_needed"  # Backups, configs (non-critical)
    PROTECTED = "protected"          # System files, executables
```

#### DuplicateGroup (duplicate_finder.py:16-32)
```python
@dataclass
class DuplicateGroup:
    files: List[FileInfo]
    size: int
    hash_value: Optional[str] = None
    
    @property
    def count(self) -> int:
        return len(self.files)
    
    @property
    def reclaimable_space(self) -> int:
        return self.size * (self.count - 1)
```

#### FileStatus Enum (safety.py:21-28)
```python
class FileStatus(Enum):
    SAFE = "safe"
    LOCKED = "locked"
    NO_PERMISSION = "no_permission"
    PROTECTED = "protected"
    ERROR = "error"
```

#### CleanupReport (smart_cleanup.py:21-64)
```python
@dataclass
class CleanupReport:
    by_type: Dict[str, List[FileInfo]]
    by_risk: Dict[str, List[FileInfo]]
    by_age: Dict[str, List[FileInfo]]
    duplicates: List[DuplicateGroup]
    
    total_files: int
    total_size: int
    reclaimable_space: int
    
    scan_time: float
    timestamp: float
    
    # Computed properties
    @property
    def safe_reclaimable(self) -> int: ...
    @property
    def total_reclaimable(self) -> int: ...
```

### Major Classes

| Class | Module | Purpose |
|-------|--------|---------|
| **DirectoryScanner** | scanner.py | Incremental directory traversal via os.scandir() |
| **FileClassifier** | classifier.py | 3D file categorization (type/risk/age) |
| **DuplicateFinder** | duplicate_finder.py | Adaptive duplicate detection (fast/accurate) |
| **CacheManager** | cache.py | Scan result caching and delta detection |
| **SafetyChecker** | safety.py | Pre-deletion verification (locks, permissions) |
| **SmartCleanupEngine** | smart_cleanup.py | Orchestrates all modules, generates reports |
| **InteractiveCleanupUI** | interactive.py | Menu-driven user interface |
| **ProcessManager** | process_manager.py | Cross-platform process locking detection |
| **GrowthAnalyzer** | growth_analyzer.py | Disk usage trend analysis and prediction |
| **ProgressBar** | progress.py | CLI progress display with fancy formatting |
| **Config** | config/loader.py | Multi-level configuration management |
| **ConcurrencyManager** | optimization/concurrency.py | Thread/process pool management |
| **DeletionManager** | optimization/delete.py | Async/batch deletion strategies |
| **AdaptiveHasher** | optimization/hash.py | Performance-optimized hashing |
| **ConcurrentScanner** | optimization/scan.py | Multi-threaded directory scanning |

---

## Data Flow & Processing Pipeline

### Typical Cleanup Analysis Workflow

```
User Input (path, options)
    ↓
[Config Layer]
  Config.load() → merged config from defaults/user/project/CLI
    ↓
[Scanning Phase]
  DirectoryScanner.scan_directory(path, use_cache=True)
    ├─ CacheManager.load_snapshot() → previous state (if exists)
    ├─ os.scandir() recursive traversal
    └─ FileInfo[] list created
    ↓
[Classification Phase]
  FileClassifier.classify(file_info[])
    ├─ Type categorization (logs, cache, temp, etc.)
    ├─ Risk level assessment (safe/confirm/protected)
    └─ Age calculation (recent/mid/old)
    ↓
[Duplicate Detection Phase]
  DuplicateFinder.find_duplicates(files)
    ├─ Strategy selection (count > 1000 ? accurate : fast)
    ├─ Size pre-filtering
    ├─ SHA-256 hashing
    └─ DuplicateGroup[] returned
    ↓
[Safety Verification Phase]
  SafetyChecker.verify_all(files)
    ├─ Protected path/extension check
    ├─ File lock detection (cross-platform)
    ├─ Permission verification
    └─ FileStatus[] results
    ↓
[Report Generation]
  CleanupReport created with:
    ├─ by_type grouping
    ├─ by_risk grouping
    ├─ by_age grouping
    ├─ duplicates list
    ├─ statistics (total_size, reclaimable_space)
    └─ scan_time measurement
    ↓
[User Interaction]
  InteractiveCleanupUI.display_report_menu(report)
    ├─ View options (type/risk/age/duplicates/list)
    ├─ File selection
    ├─ Confirmation prompt
    └─ Selected file paths[]
    ↓
[Deletion Phase]
  DeletionManager (optimization layer)
    ├─ Batch deletion or async deletion
    ├─ Progress updates
    └─ Cleanup results
```

### Data Structures in Transit

```
DirectoryScanner Output:
  List[FileInfo] = [
    FileInfo(path=/tmp/cache.tmp, size=1000, mtime=1.23, depth=2),
    FileInfo(path=/home/user/.npm, size=500MB, is_dir=True),
    ...
  ]

Classifier Output:
  Dict[str, List[FileInfo]] = {
    "logs": [...],
    "cache": [...],
    "temp": [...]
  }
  Dict[str, RiskLevel] = { file_path: RiskLevel.SAFE, ... }

DuplicateFinder Output:
  List[DuplicateGroup] = [
    DuplicateGroup(files=[...], size=100MB, hash="abc123"),
    DuplicateGroup(files=[...], size=50MB, hash="def456")
  ]

CleanupReport:
  {
    by_type: {"logs": [...], "cache": [...]},
    by_risk: {"safe": [...], "protected": [...]},
    by_age: {"recent": [...], "old": [...]},
    duplicates: [...],
    total_files: 45000,
    total_size: 120GB,
    reclaimable_space: 95GB
  }
```

---

## Dependencies

### Build & Project Metadata

**pyproject.toml**
```toml
[project]
name = "disk-cleaner"
version = "2.0.0-dev"
requires-python = ">=3.6"

[project.optional-dependencies]
dev = [
    "pytest>=7.0",
    "pytest-cov>=3.0",
    "pytest-benchmark>=4.0",
    "black>=22.0",
    "isort>=5.0",
    "flake8>=4.0",
    "mypy>=0.950",
    "pre-commit>=2.0",
]
```

### Runtime Dependencies

**None** - Pure Python standard library implementation

Imports used across codebase:
```python
# Standard library only
import os              # File operations
import platform        # Platform detection
import subprocess      # Process management (lsof, wmic)
import hashlib         # SHA-256 hashing
import json            # Config & cache serialization
import time            # Timestamps
import shutil          # File operations
import fnmatch         # Wildcard pattern matching
from pathlib import Path
from dataclasses import dataclass
from datetime import datetime, timedelta
from enum import Enum
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
from typing import Dict, List, Optional, Tuple, Set, Generator
```

### Development Dependencies

- **pytest** - Unit/integration testing
- **pytest-cov** - Coverage reporting
- **pytest-benchmark** - Performance benchmarking
- **black** - Code formatting
- **isort** - Import sorting
- **flake8** - Linting
- **mypy** - Type checking
- **pre-commit** - Git hooks

### CI/CD Pipelines

**.github/workflows/lint.yml**
- Runs: black, isort, flake8, mypy
- On: push to main/PRs

**.github/workflows/test.yml**
- Runs full test suite
- Coverage report generation
- On: push/PRs

---

## Platform Support

### Platform-Specific Implementations

#### Windows (`platforms/windows.py`)
- Protected paths: C:\Windows, C:\Program Files, C:\ProgramData, C:\$Recycle.Bin
- File locking detection via WMI (Windows Management Instrumentation)
- Registry-based cache detection (Windows Update, AppData)
- Long path support (\\?\) for paths > 260 chars
- Process manager: uses handle count queries

#### Linux (`platforms/linux.py`)
- Protected paths: /proc, /sys, /dev, /run, /boot, /lib, /etc
- File locking detection via lsof command
- Package manager cache: APT, pacman, DNF/YUM
- inode tracking for hardlink detection
- Process manager: /proc filesystem parsing

#### macOS (`platforms/macos.py`)
- Protected paths: /System, /Library, /private/var/vm, /.Spotlight-V100
- File locking detection via lsof command
- Spotlight cache detection (._*files)
- Application Support directories
- Homebrew cache detection
- Sandbox restrictions handling

### Cross-Platform Path Exclusions (scanner.py:24-64)

```python
PLATFORM_EXCLUDES = {
    "windows": ["C:\\Windows", "C:\\Program Files", ...],
    "darwin": ["/System", "/Library", "/private/var/vm", ...],
    "linux": ["/proc", "/sys", "/dev", "/run", ...]
}

def should_exclude_path(path: Path) -> bool:
    system = platform.system().lower()
    for exclude_prefix in PLATFORM_EXCLUDES.get(system, []):
        if str(path).startswith(exclude_prefix):
            return True
    return False
```

---

## Performance Optimizations

### Scanning Optimization (`optimization/scan.py`)

**QuickProfiler**
- Samples 5-10% of directory tree
- Estimates total size in <1 second
- Predicts scan time required

**ConcurrentScanner**
- Multi-threaded directory traversal
- ThreadPoolExecutor with adaptive worker count
- Lock-free file collection via queues
- 3-5x speedup vs sequential scanning

**IncrementalCache**
- Delta detection: added/deleted/modified files
- Only re-scans changed portions
- 10x speedup for stable directories
- Persistent storage in ~/.disk-cleaner/cache/

### Hashing Optimization (`optimization/hash.py`)

**AdaptiveHasher**
- Strategy selection based on file count
- For <1000 files: immediate SHA-256
- For 1000+ files: size-based pre-filtering first
- Parallel hashing via ProcessPoolExecutor

**ParallelHasher**
- Process pool for CPU-intensive hashing
- Optimal worker count = min(cpu_count, file_count)

**FastFilter**
- Pre-filter by size + mtime before hashing
- Reduces hash operations by 70-80%

**HashCache**
- Persistent hash cache in ~/.disk-cleaner/cache/
- Invalidated on file modification

### Memory Monitoring (`optimization/memory.py`)

**MemoryMonitor**
- Tracks system memory availability
- MemoryStatus enum: ABUNDANT, MODERATE, LOW, CRITICAL
- Adapts buffer sizes and worker counts

### Deletion Optimization (`optimization/delete.py`)

**BatchDeleter**
- Groups files for efficient batch deletion
- Platform-optimized batch sizes

**AsyncDeleter**
- Asynchronous deletion via ThreadPoolExecutor
- Non-blocking progress updates

**SmartDeleter**
- Strategy selection (batch/async) based on context
- Fallback handling on permission errors

---

## Configuration System

### Multi-Level Configuration Priority

```
1. Command-line arguments (highest priority)
   ↓
2. Project config (.disk-cleaner.yaml in project root)
   ↓
3. User config (~/.disk-cleaner/config.yaml)
   ↓
4. Default config (lowest priority)
```

### Configuration Sources

**defaults.py** (`get_default_config()`)
```python
{
    "age_threshold_days": 90,
    "min_file_size": 1024,
    "protected_extensions": [".exe", ".dll", ".app", ...],
    "protected_paths": ["C:\\Windows", "/System", ...],
    "protected_patterns": ["*.sys", "*.bat", ...],
    "file_categories": {
        "logs": ["*.log"],
        "cache": ["*.cache", ".cache"],
        "temp": ["*.tmp", "__pycache__"],
        ...
    },
    "risk_levels": {
        "logs": "safe",
        "cache": "safe",
        "system": "protected"
    },
    "performance": {
        "cache_enabled": True,
        "concurrent_workers": "auto",
        "memory_limit_mb": 512
    }
}
```

### Config Class (loader.py)

```python
class Config:
    @classmethod
    def load(cls, path: Optional[str] = None, 
             cli_args: Optional[Dict] = None) -> "Config"
        # Merges configs with priority order
    
    def get(self, key: str, default=None) -> Any
        # Access config value by dot notation
    
    # Properties for common settings
    @property
    def protected_paths: Set[str]
    @property
    def protected_extensions: Set[str]
    @property
    def protected_patterns: List[str]
    @property
    def check_file_locks: bool
    @property
    def verify_permissions: bool
    @property
    def age_threshold_days: int
```

### YAML Configuration Example

**.disk-cleaner.yaml** (project-level)
```yaml
age_threshold_days: 60
protected_paths:
  - /path/to/project/important
protected_extensions:
  - .project
  - .config

~/.disk-cleaner/config.yaml (user-level)
```

---

## Summary

**disk-cleaner v2.1** is a mature, well-architected cross-platform disk management toolkit built on:

1. **Modular Design** - Clear separation: config → core → optimization → platforms
2. **Layered Architecture** - CLI scripts → SmartCleanupEngine → specialized modules
3. **Intelligent Abstractions** - FileInfo, RiskLevel, DuplicateGroup, CleanupReport
4. **Adaptive Performance** - Strategy selection, incremental caching, concurrent operations
5. **Cross-Platform Support** - Windows/Linux/macOS with platform-specific optimizations
6. **Comprehensive Safety** - Multiple verification layers, protected paths, dry-run mode
7. **Configuration Flexibility** - Multi-level config merging with sensible defaults
8. **Zero Dependencies** - Pure Python 3.6+ using only standard library

**Key Strengths**:
- Production-ready with 244+ tests and benchmarks
- Well-documented with README, SKILL.md, and development summaries
- Skill-packaged for Agent integration (Claude Code compatible)
- V2.1 includes critical fixes (cross-platform encoding) and new features (progressive scanning)

**Architecture enables**:
- Fast incremental analysis (10x via caching)
- Safe operations (multiple safety checks)
- User-friendly interaction (interactive UI, detailed reports)
- Scalable performance (concurrent scanning, adaptive strategies)
