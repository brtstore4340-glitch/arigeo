---
name: 1419-code-snippets
description: ## Project Overview
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-15
  source: fleet-memory
---

# Disk Cleaner v2.1 - Code Snippets Analysis

A cross-platform disk space monitoring and cleaning toolkit written in Python. This document collects the key implementation patterns and architectural decisions.

## Project Overview

- **Language**: Python 3.6+
- **Dependencies**: Zero external dependencies (uses stdlib only)
- **Type Safety**: mypy enabled with gradual typing
- **Platform Support**: Windows, Linux, macOS
- **Key Features**: Intelligent file classification, duplicate detection, incremental scanning, safe deletion

---

## 1. Entry Point & Package Structure

### File: `diskcleaner/__init__.py`

The main package exports the core public API:

```python
"""
disk-cleaner - Cross-platform disk space management toolkit

A comprehensive toolkit for monitoring, analyzing, and cleaning disk space
safely across Windows, Linux, and macOS.
"""

__version__ = "2.0.0-dev"
__author__ = "Disk Cleaner Contributors"

from diskcleaner.config import Config
from diskcleaner.core import DirectoryScanner, FileClassifier, SafetyChecker

__all__ = [
    "DirectoryScanner",
    "FileClassifier",
    "SafetyChecker",
    "Config",
]
```

**Key Pattern**: Minimal public API surface with explicit `__all__`. Users only import what they need.

---

## 2. Core Scanner - High-Performance Directory Traversal

### File: `diskcleaner/core/scanner.py`

The DirectoryScanner is the foundation. It uses `os.scandir()` for 3-5x performance improvement over Path.iterdir().

#### Platform-Specific Path Exclusions

```python
# Cross-platform path exclusions
PLATFORM_EXCLUDES = {
    "windows": [
        "C:\\Windows",
        "C:\\Program Files",
        "C:\\Program Files (x86)",
        "C:\\ProgramData",
        "C:\\$Recycle.Bin",
        "C:\\System Volume Information",
        # ... more
    ],
    "darwin": [
        "/System",
        "/Library",
        "/.Spotlight-V100",
        "/.fseventsd",
        "/.vol",
        "/private/var/vm",  # VM swap files
        # ... more
    ],
    "linux": [
        "/proc",
        "/sys",
        "/dev",
        "/run",
        "/boot",
        # ... more
    ],
}

def should_exclude_path(path: Path) -> bool:
    """Check if a path should be excluded from scanning."""
    system = platform.system().lower()
    path_str = str(path)

    for exclude_prefix in PLATFORM_EXCLUDES.get(system, []):
        if path_str.startswith(exclude_prefix):
            return True

    return False
```

**Pattern**: Platform detection via `platform.system()` with lookup table for exclusions.

#### FileInfo Data Structure

```python
@dataclass
class FileInfo:
    """Information about a single file."""

    path: str
    name: str
    size: int
    mtime: float
    is_dir: bool
    is_link: bool
    inode: Optional[int] = None
    depth: int = 0

    def to_snapshot(self) -> FileSnapshot:
        """Convert to FileSnapshot for caching."""
        return FileSnapshot(
            path=self.path,
            size=self.size,
            mtime=self.mtime,
            inode=self.inode,
        )
```

**Pattern**: Dataclass with optional inode tracking for cycle detection on Unix systems.

#### High-Performance scandir() Implementation

```python
def _scan_directory_scandir(
    self,
    directory: Path,
    depth: int,
    visited: Optional[Set[int]] = None,
) -> Generator[FileInfo, None, None]:
    """
    Scan a single directory recursively using os.scandir().

    This is 3-5x faster than Path.iterdir() because:
    - Uses system-optimized syscalls
    - Returns DirEntry with cached stat info
    - Avoids extra stat() calls
    """
    if visited is None:
        visited = set()

    # Check depth limit
    if self.max_depth is not None and depth > self.max_depth:
        return

    # Check early stopping conditions
    if self._should_stop_early():
        return

    try:
        # Use os.scandir() for better performance
        with os.scandir(directory) as it:
            for entry in it:
                # Check early stopping before processing each entry
                if self._should_stop_early():
                    break

                try:
                    # Get stat info from DirEntry (cached, no extra syscall)
                    stat_info = entry.stat(follow_symlinks=False)

                    # Get inode for cycle detection (Unix only)
                    inode = None
                    if hasattr(stat_info, "st_ino"):
                        inode = stat_info.st_ino

                    # Check for symlink cycles
                    is_link = entry.is_symlink()
                    if is_link:
                        if not self.follow_symlinks:
                            continue

                        # Check if we've visited this inode
                        if inode is not None and inode in visited:
                            continue
                        visited.add(inode)

                    is_dir = entry.is_dir()

                    # Create FileInfo
                    file_info = FileInfo(
                        path=entry.path,
                        name=entry.name,
                        size=stat_info.st_size if not is_dir else 0,
                        mtime=stat_info.st_mtime,
                        is_dir=is_dir,
                        is_link=is_link,
                        inode=inode,
                        depth=depth,
                    )

                    self.files_scanned += 1
                    yield file_info

                    # Recurse into subdirectories
                    if is_dir and not is_link:
                        subpath = Path(entry.path)
                        if not should_exclude_path(subpath):
                            yield from self._scan_directory_scandir(subpath, depth + 1, visited)

                except (PermissionError, OSError):
                    # Skip files we can't access
                    continue

    except (PermissionError, OSError):
        # Skip directories we can't read
        return
```

**Key Patterns**:
- **Generator-based**: Uses `yield` for memory efficiency on large directories
- **DirEntry caching**: Stat info is cached in DirEntry, avoiding extra syscalls
- **Inode tracking**: Prevents infinite loops on symlink cycles
- **Early stopping**: Configurable file/time limits to prevent long scans

#### Early Stopping Mechanism

```python
def _should_stop_early(self) -> bool:
    """
    Check if we should stop scanning early.

    Returns:
        True if should stop, False otherwise.
    """
    # Check file count limit
    if self.max_files and self.files_scanned >= self.max_files:
        if not self.stopped_early:
            self.stopped_early = True
            self.stop_reason = f"file_limit ({self.max_files} files)"
        return True

    # Check time limit
    if self.max_seconds and self.start_time:
        elapsed = time.time() - self.start_time
        if elapsed >= self.max_seconds:
            if not self.stopped_early:
                self.stopped_early = True
                self.stop_reason = f"time_limit ({self.max_seconds}s)"
            return True

    return False
```

**Pattern**: Bi-directional check (file count and elapsed time) with status tracking.

#### Incremental Scanning with Cache

```python
def scan_incremental(self) -> Tuple[List[FileInfo], List[str], List[str]]:
    """
    Perform incremental scan using cache.

    Returns:
        Tuple of (all_files, new_files, changed_files)
    """
    # Try to load cached scan
    cached_snapshot = None
    if self.cache_enabled and self.cache_manager:
        cached_snapshot = self.cache_manager.get_scan_cache(
            str(self.target_path),
            max_age_days=self.config.cache_ttl,
        )

    # If no cache, do full scan
    if cached_snapshot is None:
        files = self.scan()

        # Save to cache
        if self.cache_enabled and self.cache_manager:
            snapshot = ScanSnapshot(
                path=str(self.target_path),
                timestamp=time.time(),
                files=[f.to_snapshot() for f in files],
                total_size=sum(f.size for f in files),
                file_count=len(files),
            )
            self.cache_manager.save_scan_cache(str(self.target_path), snapshot)

        return files, files, []  # All files are "new"

    # Incremental scan: compare with cache
    cached_files = {f.path: f for f in cached_snapshot.files}
    current_files = []
    new_files = []
    changed_files = []

    for file_info in self.scan_generator():
        current_files.append(file_info)

        cached = cached_files.get(file_info.path)

        if cached is None:
            # New file
            new_files.append(file_info.path)
        elif self.cache_manager.is_file_changed(file_info.to_snapshot(), cached):
            # Changed file
            changed_files.append(file_info.path)

    # Update cache with current state
    if self.cache_enabled and self.cache_manager:
        snapshot = ScanSnapshot(
            path=str(self.target_path),
            timestamp=time.time(),
            files=[f.to_snapshot() for f in current_files],
            total_size=sum(f.size for f in current_files),
            file_count=len(current_files),
        )
        self.cache_manager.save_scan_cache(str(self.target_path), snapshot)

    return current_files, new_files, changed_files
```

**Pattern**: Three-tier return (all files, new, changed) enables both full and incremental workflows.

---

## 3. File Classification - 3D Categorization

### File: `diskcleaner/core/classifier.py`

The FileClassifier implements three-dimensional classification: by type, risk level, and age.

#### Classification Dimensions

```python
class RiskLevel(Enum):
    """Risk level for file deletion."""

    SAFE = "safe"
    CONFIRM_NEEDED = "confirm_needed"
    PROTECTED = "protected"


def classify(
    self,
    files: List[FileInfo],
) -> Dict[str, Dict[str, List[FileInfo]]]:
    """
    Classify files by type, risk, and age.

    Returns:
        Dictionary with three classification dimensions:
        {
            "by_type": {category_name: [files]},
            "by_risk": {risk_level: [files]},
            "by_age": {age_group: [files]}
        }
    """
    result = {
        "by_type": {},
        "by_risk": {
            RiskLevel.SAFE.value: [],
            RiskLevel.CONFIRM_NEEDED.value: [],
            RiskLevel.PROTECTED.value: [],
        },
        "by_age": {
            "最近创建 (7天内)": [],
            "近期文件 (30天内)": [],
            "陈旧文件 (90天内)": [],
            "很旧 (90天以上)": [],
        },
    }

    for file in files:
        # Skip directories
        if file.is_dir:
            continue

        # Classify by type
        type_category = self._classify_type(file)
        if type_category not in result["by_type"]:
            result["by_type"][type_category] = []
        result["by_type"][type_category].append(file)

        # Classify by risk
        risk_level = self._classify_risk(file)
        result["by_risk"][risk_level.value].append(file)

        # Classify by age
        age_group = self._classify_age(file)
        result["by_age"][age_group].append(file)

    return result
```

#### Pattern Matching for File Types

```python
def _classify_type(self, file: FileInfo) -> str:
    """Classify file by type."""
    # Check custom rules first
    for rule in self.custom_rules:
        pattern = rule.get("pattern", "")
        if self._matches_pattern(file, pattern):
            return rule.get("category", "其他文件")

    # Check built-in categories
    for category, patterns in self.type_categories.items():
        if patterns is None:
            continue

        for pattern in patterns:
            if self._matches_pattern(file, pattern):
                return category

    # Special handling for downloads
    if "downloads" in file.path.lower():
        return "下载文件"

    return "其他文件"

def _matches_pattern(self, file: FileInfo, pattern: str) -> bool:
    """Check if file matches a pattern using fnmatch."""
    # Check filename
    if fnmatch.fnmatch(file.name, pattern):
        return True

    # Check path components
    path_parts = Path(file.path).parts
    for part in path_parts:
        if fnmatch.fnmatch(part, pattern):
            return True

    # Check full path
    if fnmatch.fnmatch(file.path, pattern):
        return True

    # Check if pattern is a directory name in path
    if pattern.rstrip("/") in path_parts:
        return True

    return False
```

**Pattern**: Multi-level matching (filename, path components, full path) with fnmatch wildcards.

#### Risk Classification with Rule Priority

```python
def _classify_risk(self, file: FileInfo) -> RiskLevel:
    """Classify file by risk level."""
    # Check if path is protected
    for protected_path in self.protected_paths:
        if file.path.startswith(protected_path):
            return RiskLevel.PROTECTED

    # Check if extension is protected
    for ext in self.protected_extensions:
        if file.name.lower().endswith(ext.lower()):
            return RiskLevel.PROTECTED

    # Check if pattern matches protected patterns
    for pattern in self.protected_patterns:
        if fnmatch.fnmatch(file.name, pattern):
            return RiskLevel.PROTECTED

    # Classify by file type
    file_type = self._classify_type(file)

    # Safe to delete categories
    safe_categories = ["临时/构建产物", "日志文件", "缓存文件"]
    if file_type in safe_categories:
        return RiskLevel.SAFE

    # Confirm needed for user data
    confirm_categories = ["下载文件", "媒体文件", "文档文件"]
    if file_type in confirm_categories:
        return RiskLevel.CONFIRM_NEEDED

    # Default to confirm needed
    return RiskLevel.CONFIRM_NEEDED
```

**Pattern**: Layered checks with explicit precedence (protected paths > protected extensions > type-based).

#### Age Classification

```python
def _classify_age(self, file: FileInfo) -> str:
    """Classify file by age."""
    now = datetime.now()
    file_time = datetime.fromtimestamp(file.mtime)
    age = now - file_time

    if age < timedelta(days=7):
        return "最近创建 (7天内)"
    elif age < timedelta(days=30):
        return "近期文件 (30天内)"
    elif age < timedelta(days=90):
        return "陈旧文件 (90天内)"
    else:
        return "很旧 (90天以上)"
```

**Pattern**: Time-based bucketing with intuitive age categories.

---

## 4. Safety Checking - Multi-Layer Protection

### File: `diskcleaner/core/safety.py`

Comprehensive safety checks before deletion.

#### File Status Enum and Verification

```python
class FileStatus(Enum):
    """Status of a file for deletion."""

    SAFE = "safe"
    LOCKED = "locked"
    NO_PERMISSION = "no_permission"
    PROTECTED = "protected"
    ERROR = "error"


class SafetyChecker:
    """
    Performs safety checks before file deletion.

    Features:
    - Protected path and extension checking
    - File lock detection (cross-platform)
    - Permission verification
    - Process termination (optional)
    - Backup creation (optional)
    """

    def verify_file(self, file: FileInfo) -> FileStatus:
        """Verify if a single file is safe to delete."""
        # Check protected paths
        if self._is_protected_path(file.path):
            return FileStatus.PROTECTED

        # Check protected extensions
        if self._is_protected_extension(file.name):
            return FileStatus.PROTECTED

        # Check protected patterns
        if self._is_protected_pattern(file.name):
            return FileStatus.PROTECTED

        # Check file locks
        if self.check_locks:
            if self._is_locked(file.path):
                return FileStatus.LOCKED

        # Check permissions
        if self.verify_perms:
            if not self._has_write_permission(file.path):
                return FileStatus.NO_PERMISSION

        return FileStatus.SAFE
```

#### Cross-Platform Lock Detection

```python
def _is_locked(self, path: str) -> bool:
    """Check if file is locked by a process."""
    if self.platform == "Windows":
        return self._is_locked_windows(path)
    elif self.platform in ["Linux", "Darwin"]:
        return self._is_locked_unix(path)

    return False

def _is_locked_windows(self, path: str) -> bool:
    """Check if file is locked on Windows."""
    try:
        # Try to open file in exclusive mode
        with open(path, "rb+") as f:
            f.seek(0, 2)  # Seek to end
        return False
    except (IOError, OSError):
        # File is locked or inaccessible
        return True

def _is_locked_unix(self, path: str) -> bool:
    """Check if file is locked on Unix."""
    try:
        # Use lsof command to check locks
        result = subprocess.run(
            ["lsof", path],
            capture_output=True,
            timeout=1,
        )
        # If lsof found the file in any process, it's locked
        return result.returncode == 0
    except (FileNotFoundError, subprocess.TimeoutExpired):
        # lsof not available, assume not locked
        return False
```

**Pattern**: Platform-specific implementations with fallbacks.

---

## 5. Duplicate Detection - Adaptive Strategy

### File: `diskcleaner/core/duplicate_finder.py`

Smart duplicate detection with automatic strategy selection.

#### Duplicate Group Data Structure

```python
@dataclass
class DuplicateGroup:
    """A group of duplicate files."""

    files: List[FileInfo]
    size: int
    hash_value: Optional[str] = None

    @property
    def count(self) -> int:
        """Number of duplicate files."""
        return len(self.files)

    @property
    def reclaimable_space(self) -> int:
        """Space that can be reclaimed (keeping one copy)."""
        return self.size * (self.count - 1)
```

**Pattern**: Dataclass with computed properties for convenient access.

#### Adaptive Strategy Selection

```python
class DuplicateFinder:
    """
    Duplicate file detector with adaptive strategy.

    Features:
    - Adaptive strategy selection based on file count
    - Fast strategy: size + mtime pre-filtering
    - Accurate strategy: SHA-256 hash comparison
    """

    # Threshold for switching strategies
    ADAPTIVE_THRESHOLD = 1000

    def find_duplicates(self, files: List[FileInfo]) -> List[DuplicateGroup]:
        """Find duplicate files in the given list."""
        if not files:
            return []

        # Filter out directories (only check files)
        file_list = [f for f in files if not f.is_dir]

        if not file_list:
            return []

        # Determine which strategy to use
        use_accurate = self._should_use_accurate(len(file_list))

        # Find duplicates
        if use_accurate:
            duplicates = self._find_by_hash(file_list)
        else:
            duplicates = self._find_by_fast_strategy(file_list)

        # Sort by reclaimable space (descending)
        duplicates.sort(key=lambda d: d.reclaimable_space, reverse=True)

        return duplicates

    def _should_use_accurate(self, file_count: int) -> bool:
        """Determine whether to use accurate strategy."""
        if self.strategy == "accurate":
            return True
        if self.strategy == "fast":
            return False
        # Adaptive: use accurate for small directories
        return file_count < self.ADAPTIVE_THRESHOLD
```

#### Fast Strategy - Pre-filtering

```python
def _find_by_fast_strategy(self, files: List[FileInfo]) -> List[DuplicateGroup]:
    """
    Find duplicates using fast size + mtime strategy.

    Strategy:
    1. Group by exact size (primary filter)
    2. Within size groups, check mtime similarity
    3. Hash verification only for likely duplicates
    """
    # Step 1: Group by exact size
    size_groups: Dict[int, List[FileInfo]] = {}
    for file_info in files:
        if file_info.size not in size_groups:
            size_groups[file_info.size] = []
        size_groups[file_info.size].append(file_info)

    # Step 2: For each size group with 2+ files, check mtime similarity
    potential_duplicates: List[Tuple[int, List[FileInfo]]] = []

    for size, file_list in size_groups.items():
        if len(file_list) < 2:
            continue

        # Check if files have similar mtimes (within threshold)
        # Group by mtime buckets (1-second granularity)
        mtime_groups: Dict[int, List[FileInfo]] = {}
        for file_info in file_list:
            mtime_bucket = int(file_info.mtime)
            if mtime_bucket not in mtime_groups:
                mtime_groups[mtime_bucket] = []
            mtime_groups[mtime_bucket].append(file_info)

        # Find files in same mtime bucket (likely duplicates)
        for mtime_bucket, same_time_files in mtime_groups.items():
            if len(same_time_files) >= 2:
                potential_duplicates.append((size, same_time_files))

    # Only hash-verify the potential duplicates
    verified_duplicates: List[DuplicateGroup] = []
    for size, file_list in potential_duplicates:
        # Hash verification logic here
        pass

    return verified_duplicates
```

**Pattern**: Two-phase filtering (size, then mtime) before expensive hash computation.

#### Hash-Based Verification

```python
def _find_by_hash(self, files: List[FileInfo]) -> List[DuplicateGroup]:
    """Find duplicates using SHA-256 hash comparison."""
    # Group files by hash
    hash_groups: Dict[str, List[FileInfo]] = {}

    for file_info in files:
        try:
            # Calculate file hash
            file_hash = self._calculate_hash(file_info.path)

            if file_hash not in hash_groups:
                hash_groups[file_hash] = []
            hash_groups[file_hash].append(file_info)
        except (OSError, IOError):
            # Skip files we can't read
            continue

    # Create duplicate groups (only groups with 2+ files)
    duplicates = []
    for hash_value, file_list in hash_groups.items():
        if len(file_list) > 1:
            size = file_list[0].size
            duplicates.append(DuplicateGroup(files=file_list, size=size, hash_value=hash_value))

    return duplicates
```

---

## 6. Configuration System - Multi-Level Priority

### File: `diskcleaner/config/loader.py`

Configuration with hierarchical priority loading.

#### Priority Hierarchy

```python
class Config:
    """
    Configuration manager with multi-level priority support.

    Priority (highest to lowest):
    1. Command-line arguments (cli_args)
    2. Project directory (.disk-cleaner.yaml)
    3. User config (~/.disk-cleaner/config.yaml)
    4. Default config (built-in)
    """

    @classmethod
    def load(
        cls,
        path: Optional[str] = None,
        cli_args: Optional[Dict[str, Any]] = None,
    ) -> "Config":
        """Load configuration with proper priority merging."""
        # Start with default config
        config = get_default_config()

        # Load and merge user config
        user_config = cls._load_user_config()
        config = cls._merge_configs(config, user_config)

        # Load and merge project config
        if path:
            project_config = cls._load_project_config(path)
            config = cls._merge_configs(config, project_config)

        # Apply command-line arguments (highest priority)
        if cli_args:
            config = cls._apply_cli_args(config, cli_args)

        return cls(config)
```

#### Simple YAML Parser (No External Dependencies)

```python
@staticmethod
def _parse_simple_yaml(content: str) -> Dict[str, Any]:
    """
    Parse simplified YAML format.

    This is a basic YAML parser that handles our config format.
    It supports:
    - Key-value pairs
    - Nested dictionaries
    - Lists
    - Comments (#)
    """
    config: Dict[str, Any] = {}
    stack: list = [config]
    current = config
    indent_size = 0

    for line in content.split("\n"):
        # Skip empty lines and comments
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue

        # Calculate indentation
        indent = len(line) - len(line.lstrip())

        # Adjust stack based on indentation
        if indent == 0:
            stack = [config]
            current = config
        elif indent > indent_size:
            pass
        elif indent < indent_size:
            # Shallower level, pop stack
            while len(stack) > 1 and indent < len(stack[-1]) * 2:
                stack.pop()
            current = stack[-1]

        indent_size = indent

        # Parse key-value pair
        if ":" in stripped:
            key, value = stripped.split(":", 1)
            key = key.strip()
            value = value.strip()

            if not value:
                # This is a parent key for nested values
                current[key] = {}
                stack.append(current[key])
                current = current[key]
            elif value.startswith("[") and value.endswith("]"):
                # List value
                list_str = value[1:-1]
                current[key] = [item.strip().strip("\"'") for item in list_str.split(",")]
            else:
                # Simple value - parse type
                value = value.strip("\"'")
                if value.lower() == "true":
                    value = True
                elif value.lower() == "false":
                    value = False
                # ... more type parsing
                current[key] = value

    return config
```

**Pattern**: Custom YAML parser avoiding external dependencies (0 dependencies philosophy).

---

## 7. File Organization - Rules Engine

### File: `diskcleaner/core/rules/archive_rules.py`

Pluggable rule system for file organization.

#### Rule Definition

```python
class RuleType(Enum):
    """Types of archive rules."""

    EXTENSION = "extension"
    PATTERN = "pattern"
    AGE = "age"
    SIZE = "size"
    PATH = "path"
    CUSTOM = "custom"


@dataclass
class ArchiveRule:
    """
    A rule for organizing files.

    Attributes:
        name: Rule name for identification.
        description: Human-readable description.
        rule_type: Type of rule (extension, pattern, age, etc.).
        destination: Target directory path (relative to base).
        priority: Higher priority rules are evaluated first.
        condition: Function that returns True if file matches rule.
        transform: Optional function to transform destination path.
    """

    name: str
    description: str
    rule_type: RuleType
    destination: str
    priority: int = 0
    condition: Optional[Callable[[FileInfo], bool]] = None
    transform: Optional[Callable[[str, FileInfo], str]] = None

    def matches(self, file: FileInfo) -> bool:
        """Check if file matches this rule."""
        if self.condition is None:
            return True
        return self.condition(file)

    def get_destination(self, file: FileInfo) -> str:
        """Get destination path for file (possibly transformed)."""
        dest = self.destination

        if self.transform:
            dest = self.transform(dest, file)

        return dest
```

#### Strategy Pattern - Pluggable Organization Strategies

```python
class ArchiveStrategy(ABC):
    """
    Abstract base class for archive strategies.

    Each strategy defines a set of rules for organizing files
    in a specific way (e.g., desktop, downloads, project).
    """

    def __init__(self, name: str, description: str):
        """Initialize strategy."""
        self.name = name
        self.description = description
        self.rules: List[ArchiveRule] = []

    @abstractmethod
    def get_rules(self) -> List[ArchiveRule]:
        """Get all rules for this strategy (sorted by priority)."""
        pass

    def organize_file(self, file: FileInfo) -> Optional[str]:
        """Determine where to organize a file."""
        for rule in self.get_rules():
            if rule.matches(file):
                return rule.get_destination(file)

        return None
```

#### Example: Desktop Strategy

```python
class DesktopStrategy(ArchiveStrategy):
    """
    Desktop organization strategy.

    Organizes files by type into categories:
    - Images
    - Documents
    - Media
    - Archives
    - Code
    - Other
    """

    def __init__(self):
        super().__init__(
            name="desktop",
            description="Organize desktop files by type",
        )
        self.rules = self._build_rules()

    def _build_rules(self) -> List[ArchiveRule]:
        """Build desktop organization rules."""
        rules = []

        # Images
        rules.append(
            ArchiveRule(
                name="images",
                description="Image files (PNG, JPG, GIF, etc.)",
                rule_type=RuleType.EXTENSION,
                destination="Images",
                priority=100,
                condition=lambda f: f.name.lower().endswith(
                    (
                        ".png",
                        ".jpg",
                        ".jpeg",
                        ".gif",
                        ".bmp",
                        ".svg",
                        ".webp",
                        ".ico",
                    )
                ),
            )
        )

        # ... more rules
        return rules
```

**Pattern**: Abstract base class with concrete strategy implementations, ordered by priority.

---

## 8. Optimized Deletion - Batch Processing

### File: `diskcleaner/optimization/delete.py`

Smart batched deletion with progress tracking.

#### Result and Progress Data Structures

```python
@dataclass
class DeleteResult:
    """Result of a delete operation."""

    success: List[Path]
    failed: List[Path]
    total_deleted: int
    total_failed: int
    total_size_freed: int
    elapsed_time: float
    cancelled: bool = False

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            "success": [str(p) for p in self.success],
            "failed": [str(p) for p in self.failed],
            "total_deleted": self.total_deleted,
            "total_failed": self.total_failed,
            "total_size_freed": self.total_size_freed,
            "elapsed_time": self.elapsed_time,
            "cancelled": self.cancelled,
        }


@dataclass
class ProgressUpdate:
    """Progress update for deletion operations."""

    current: int
    total: int
    percent: float
    batch: int
    total_batches: int
    current_file: Optional[str] = None
    speed: float = 0.0  # files/second
```

#### Adaptive Batch Strategy

```python
class BatchDeleter:
    """
    Smart batched file deletion.

    Deletes files in batches with progress tracking and error handling.
    """

    def __init__(self, progress_callback=None):
        """Initialize batch deleter."""
        self.batch_config = {
            "small": {"count": 1000, "interval": 0.1},
            "medium": {"count": 5000, "interval": 0.5},
            "large": {"count": 10000, "interval": 1.0},
        }
        self.progress_callback = progress_callback

    def delete_with_progress(self, files: List[Path]) -> DeleteResult:
        """Delete files in batches with progress updates."""
        if not files:
            return DeleteResult(
                success=[],
                failed=[],
                total_deleted=0,
                total_failed=0,
                total_size_freed=0,
                elapsed_time=0.0,
            )

        start_time = time.time()

        # Select batch strategy based on file count
        file_count = len(files)
        if file_count < 5000:
            config = self.batch_config["small"]
        elif file_count < 20000:
            config = self.batch_config["medium"]
        else:
            config = self.batch_config["large"]

        batch_size = config["count"]
        interval = config["interval"]

        success = []
        failed = []
        total_size = 0

        # Process in batches
        for i in range(0, file_count, batch_size):
            batch = files[i : i + batch_size]
            batch_success, batch_failed, batch_size_freed = self._delete_batch(batch)

            success.extend(batch_success)
            failed.extend(batch_failed)
            total_size += batch_size_freed
```

**Pattern**: Adaptive batch size selection based on total file count (small/medium/large strategies).

---

## 9. CLI Entry Point - Command Line Interface

### File: `scripts/organize_files.py`

Practical example showing how to use the library programmatically.

#### Argument Parsing

```python
def parse_arguments():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(
        description="Organize files using intelligent strategies",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Preview organization of desktop
  python organize_files.py ~/Desktop --strategy desktop --preview

  # Organize downloads by date
  python organize_files.py ~/Downloads --strategy downloads --execute

Available strategies:
  desktop   - Organize by file type (Images, Documents, Media, etc.)
  downloads - Organize by type and date (Documents/2024-04/)
  project   - Organize by project and semantic grouping
  general   - Mixed strategy (size, age, type)
        """,
    )

    parser.add_argument(
        "path",
        nargs="?",
        help="Directory path to organize",
    )

    parser.add_argument(
        "--strategy",
        "-s",
        choices=["desktop", "downloads", "project", "general"],
        default="desktop",
        help="Organization strategy to use (default: desktop)",
    )

    parser.add_argument(
        "--preview",
        "-p",
        action="store_true",
        help="Preview changes without executing (dry-run mode)",
    )

    parser.add_argument(
        "--execute",
        "-e",
        action="store_true",
        help="Execute organization plan (actually move files)",
    )

    return parser.parse_args()
```

#### Main Workflow

```python
def main():
    """Main entry point."""
    args = parse_arguments()

    # Validate path
    target_path = Path(args.path).expanduser()
    if not target_path.exists():
        print(f"Error: Path does not exist: {args.path}", file=sys.stderr)
        return 1

    # Determine mode
    dry_run = not args.execute

    # Create organizer
    try:
        organizer = FileOrganizer(
            target_path=str(target_path),
            strategy=args.strategy,
            dry_run=dry_run,
        )
    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1

    # Preview mode
    if args.preview or not args.execute:
        print(organizer.preview_organization(max_files=args.max_files))

        if dry_run:
            print("\nPreview complete. No files were moved.")
            print("Use --execute flag to actually organize files.")
            return 0

    # Execute mode
    if args.execute:
        print("Executing organization plan...")

        def progress_callback(current, total):
            if args.verbose:
                percent = (current / total) * 100
                print(f"Progress: {current}/{total} ({percent:.1f}%)", end="\r")

        # Organize files
        try:
            organized, skipped, errors = organizer.organize(
                progress_callback=progress_callback if args.verbose else None,
            )

            print("Organization Complete!")
            print(f"  Files organized: {organized}")
            print(f"  Files skipped: {skipped}")
            print(f"  Errors: {errors}")

            return 0 if errors == 0 else 1

        except Exception as e:
            print(f"Error during organization: {e}", file=sys.stderr)
            return 1

    return 0
```

**Pattern**: Standard argparse setup with subcommand-like behavior (preview vs execute).

---

## Key Architectural Patterns

### 1. **Generator-Based Processing**
Uses Python generators for memory efficiency on large datasets. The scanner yields FileInfo objects rather than loading all into memory.

### 2. **Dataclass-Heavy Design**
Extensive use of `@dataclass` for data structures (FileInfo, DuplicateGroup, ArchiveRule, etc.) with minimal boilerplate.

### 3. **Platform Abstraction**
Platform-specific logic (Windows/Linux/macOS) is isolated in lookup tables and platform-detection functions rather than scattered conditionals.

### 4. **Adaptive Strategy Selection**
Many components auto-select algorithms based on input size (fast vs accurate strategies for duplicates, batch sizes for deletions).

### 5. **Layered Safety**
Multiple safety checks in priority order (protected paths → protected extensions → patterns → locks → permissions).

### 6. **Configuration Hierarchy**
Multi-level config loading with clear priority (defaults → user → project → CLI args).

### 7. **Pluggable Rules Engine**
Abstract base class (ArchiveStrategy) with concrete implementations allowing new strategies without modifying core code.

### 8. **Incremental Caching**
Scanner supports both full and incremental scans, comparing against cached snapshots to track new/changed files.

### 9. **Cross-Platform Path Handling**
Platform-specific path exclusions and lock detection, with graceful fallbacks.

### 10. **Zero External Dependencies**
Custom YAML parser and pure stdlib implementation for maximum portability.

---

## Performance Optimization Highlights

1. **os.scandir() over Path.glob()**: 3-5x faster filesystem iteration
2. **Inode-based cycle detection**: Prevents infinite loops on symlinks
3. **Early stopping**: Configurable max files and time limits
4. **Two-phase duplicate detection**: Size/mtime pre-filtering before expensive hashing
5. **Batch processing**: Adaptive batch sizes for deletion operations
6. **Caching**: Incremental scan support with snapshot comparison

---

## Testing & Code Quality

- Type hints enabled (gradual, not strict)
- mypy configuration for static analysis
- pytest with markers for slow/integration tests
- Black for formatting (100 char line length)
- Pre-commit hooks configured
- Coverage tracking enabled
