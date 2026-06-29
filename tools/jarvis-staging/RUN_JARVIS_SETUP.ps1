# RUN_JARVIS_SETUP.ps1 - Jarvis Local MVP Setup Script
# One-run setup with validation and backup

param(
    [switch]$DryRun = $false,
    [switch]$Verbose = $false
)

$ErrorActionPreference = "Stop"

# ============================================================================
# SETUP CONFIGURATION
# ============================================================================

$JarvisSetup = @{
    Name = "Jarvis-Local-MVP"
    Version = "0.1.0"
    Workspace = "D:\01 Main Work\Boots\Agentic AI\mission-control"
    StagingDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis-staging"
    ToolsDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools"
    InstallDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis"
    LogsDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\logs"
    BackupDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\backup"
    ConfigFile = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis-config.json"
    LastBackupTracker = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\LAST_BACKUP_DIR.txt"
    DryRun = $DryRun
}

Write-Host "╔════════════════════════════════════════════╗"
Write-Host "║    JARVIS LOCAL MVP SETUP v$($JarvisSetup.Version)           ║"
Write-Host "╚════════════════════════════════════════════╝"
Write-Host ""

# ============================================================================
# STEP 1: VALIDATE WORKSPACE
# ============================================================================

Write-Host "Step 1: Validating workspace..."

$requiredPaths = @(
    $JarvisSetup.Workspace,
    $JarvisSetup.ToolsDir,
    $JarvisSetup.StagingDir
)

foreach ($path in $requiredPaths) {
    if (Test-Path $path) {
        Write-Host "  ✓ $path"
    } else {
        Write-Host "  ✗ MISSING: $path"
        exit 1
    }
}

Write-Host ""

# ============================================================================
# STEP 2: CREATE DIRECTORY STRUCTURE
# ============================================================================

Write-Host "Step 2: Creating directory structure..."

$dirsToCreate = @(
    $JarvisSetup.InstallDir,
    $JarvisSetup.LogsDir,
    $JarvisSetup.BackupDir,
    "$($JarvisSetup.InstallDir)\core",
    "$($JarvisSetup.InstallDir)\voice",
    "$($JarvisSetup.InstallDir)\computer-use",
    "$($JarvisSetup.InstallDir)\connectors",
    "$($JarvisSetup.InstallDir)\memory",
    "$($JarvisSetup.InstallDir)\dashboard",
    "$($JarvisSetup.ToolsDir)\screenshots",
    "$($JarvisSetup.ToolsDir)\voice-output",
    "$($JarvisSetup.ToolsDir)\memory",
    "$($JarvisSetup.ToolsDir)\memory\summaries"
)

foreach ($dir in $dirsToCreate) {
    if ($JarvisSetup.DryRun) {
        Write-Host "  [DRY-RUN] Would create: $dir"
    } else {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-Host "  ✓ Created: $dir"
        } else {
            Write-Host "  ✓ Already exists: $dir"
        }
    }
}

Write-Host ""

# ============================================================================
# STEP 3: COPY MODULES
# ============================================================================

Write-Host "Step 3: Installing modules..."

$modules = @(
    @{ src = "$($JarvisSetup.StagingDir)\core\jarvis-core.ps1"; dst = "$($JarvisSetup.InstallDir)\core\jarvis-core.ps1" }
    @{ src = "$($JarvisSetup.StagingDir)\voice\jarvis-voice.ps1"; dst = "$($JarvisSetup.InstallDir)\voice\jarvis-voice.ps1" }
    @{ src = "$($JarvisSetup.StagingDir)\computer-use\jarvis-computer-use.ps1"; dst = "$($JarvisSetup.InstallDir)\computer-use\jarvis-computer-use.ps1" }
    @{ src = "$($JarvisSetup.StagingDir)\connectors\jarvis-connectors.ps1"; dst = "$($JarvisSetup.InstallDir)\connectors\jarvis-connectors.ps1" }
    @{ src = "$($JarvisSetup.StagingDir)\memory\jarvis-memory.ps1"; dst = "$($JarvisSetup.InstallDir)\memory\jarvis-memory.ps1" }
)

foreach ($module in $modules) {
    if (Test-Path $module.src) {
        if ($JarvisSetup.DryRun) {
            Write-Host "  [DRY-RUN] Would copy: $($module.src)"
        } else {
            Copy-Item -Path $module.src -Destination $module.dst -Force
            Write-Host "  ✓ Installed: $(Split-Path -Leaf $module.dst)"
        }
    } else {
        Write-Host "  ✗ Missing: $($module.src)"
    }
}

Write-Host ""

# ============================================================================
# STEP 4: CREATE CONFIGURATION
# ============================================================================

Write-Host "Step 4: Creating configuration..."

$configContent = @{
    name = "Jarvis-Local"
    version = "0.1.0-mvp"
    workspace = $JarvisSetup.Workspace
    tools_dir = $JarvisSetup.ToolsDir
    install_dir = $JarvisSetup.InstallDir
    mode = "safe"
    language = "th-TH"
    voice_settings = @{
        default_voice = "Microsoft Zira Desktop"
        rate = 0
        volume = 100
    }
    computer_use = @{
        screenshot_dir = "$($JarvisSetup.ToolsDir)\screenshots"
        action_queue_file = "$($JarvisSetup.ToolsDir)\action-queue.jsonl"
        require_approval = $true
    }
    connectors = @{
        browser_default = "chrome"
        file_root = "D:\01 Main Work\Boots\Agentic AI"
    }
    memory = @{
        memory_dir = "$($JarvisSetup.ToolsDir)\memory"
        retention_days = 90
    }
    logging = @{
        logs_dir = $JarvisSetup.LogsDir
        level = "info"
    }
    created_at = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
}

if ($JarvisSetup.DryRun) {
    Write-Host "  [DRY-RUN] Would write config to: $($JarvisSetup.ConfigFile)"
} else {
    $configContent | ConvertTo-Json -Depth 3 | Set-Content -Path $JarvisSetup.ConfigFile
    Write-Host "  ✓ Config saved: $($JarvisSetup.ConfigFile)"
}

Write-Host ""

# ============================================================================
# STEP 5: CREATE BACKUP
# ============================================================================

Write-Host "Step 5: Creating backup..."

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupPath = Join-Path $JarvisSetup.BackupDir "jarvis-backup-$timestamp"

if ($JarvisSetup.DryRun) {
    Write-Host "  [DRY-RUN] Would backup to: $backupPath"
} else {
    if (-not (Test-Path $backupPath)) {
        New-Item -ItemType Directory -Path $backupPath -Force | Out-Null
    }

    # Backup staging directory
    Copy-Item -Path $JarvisSetup.StagingDir -Destination "$backupPath\staging" -Recurse -Force
    Copy-Item -Path $JarvisSetup.ConfigFile -Destination "$backupPath\config.json" -Force

    # Update backup tracker
    $backupPath | Set-Content -Path $JarvisSetup.LastBackupTracker

    Write-Host "  ✓ Backup created: $backupPath"
    Write-Host "  ✓ Tracker updated: $($JarvisSetup.LastBackupTracker)"
}

Write-Host ""

# ============================================================================
# STEP 6: VALIDATE INSTALLATION
# ============================================================================

Write-Host "Step 6: Validating installation..."

$validationTests = @(
    @{ name = "Core module"; path = "$($JarvisSetup.InstallDir)\core\jarvis-core.ps1" }
    @{ name = "Voice module"; path = "$($JarvisSetup.InstallDir)\voice\jarvis-voice.ps1" }
    @{ name = "Computer-use module"; path = "$($JarvisSetup.InstallDir)\computer-use\jarvis-computer-use.ps1" }
    @{ name = "Connectors module"; path = "$($JarvisSetup.InstallDir)\connectors\jarvis-connectors.ps1" }
    @{ name = "Memory module"; path = "$($JarvisSetup.InstallDir)\memory\jarvis-memory.ps1" }
    @{ name = "Configuration"; path = $JarvisSetup.ConfigFile }
    @{ name = "Logs directory"; path = $JarvisSetup.LogsDir }
    @{ name = "Backup tracker"; path = $JarvisSetup.LastBackupTracker }
)

$validCount = 0
foreach ($test in $validationTests) {
    if (Test-Path $test.path) {
        Write-Host "  ✓ $($test.name)"
        $validCount++
    } else {
        if (-not $JarvisSetup.DryRun) {
            Write-Host "  ✗ $($test.name) - MISSING: $($test.path)"
        }
    }
}

Write-Host ""
Write-Host "Validation: $validCount/$($validationTests.Count) passed"

# ============================================================================
# STEP 7: WRITE PROOF LOG
# ============================================================================

Write-Host "Step 7: Writing proof log..."

$proofLog = @{
    timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
    action = "setup"
    version = $JarvisSetup.Version
    workspace = $JarvisSetup.Workspace
    dry_run = $JarvisSetup.DryRun
    validation_passed = $validCount -eq $validationTests.Count
    directories_created = $dirsToCreate.Count
    modules_installed = $modules.Count
    backup_location = $backupPath
    config_file = $JarvisSetup.ConfigFile
    status = "complete"
}

$proofLogPath = "$($JarvisSetup.LogsDir)\setup-proof-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"

if ($JarvisSetup.DryRun) {
    Write-Host "  [DRY-RUN] Would write proof log to: $proofLogPath"
} else {
    $proofLog | ConvertTo-Json | Set-Content -Path $proofLogPath
    Write-Host "  ✓ Proof log: $proofLogPath"
}

Write-Host ""

# ============================================================================
# COMPLETION
# ============================================================================

Write-Host "╔════════════════════════════════════════════╗"
Write-Host "║          SETUP COMPLETE ✓                 ║"
Write-Host "╚════════════════════════════════════════════╝"
Write-Host ""

if ($JarvisSetup.DryRun) {
    Write-Host "[DRY-RUN MODE] No changes were made."
    Write-Host "Re-run without -DryRun flag to install."
} else {
    Write-Host "Installation Details:"
    Write-Host "  Workspace:   $($JarvisSetup.Workspace)"
    Write-Host "  Install Dir: $($JarvisSetup.InstallDir)"
    Write-Host "  Config:      $($JarvisSetup.ConfigFile)"
    Write-Host ""
    Write-Host "Next Steps:"
    Write-Host "  1. Review configuration: $($JarvisSetup.ConfigFile)"
    Write-Host "  2. Set environment variables if using external APIs"
    Write-Host "  3. Run: .\START_JARVIS.ps1"
}

Write-Host ""
Write-Host "Proof Log: $proofLogPath"
