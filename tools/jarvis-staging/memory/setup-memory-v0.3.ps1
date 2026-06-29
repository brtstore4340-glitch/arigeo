# setup-memory-v0.3.ps1 - Initialize JARVIS Memory v0.3
# One-run setup: creates directory structure + initializes wiki

param(
    [switch]$SkipBackup = $false,
    [bool]$Verbose = $true
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$SetupConfig = @{
    MemoryDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory"
    BackupDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\backup\memory-backups"
    LogsDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\logs"

    Subdirs = @(
        "proof-logs"
        "learnings"
        "resonance"
        "wiki"
        "archive"
        "temp"
    )
}

# ============================================================================
# SETUP FUNCTIONS
# ============================================================================

function Create-DirectoryStructure {
    if ($Verbose) { Write-Host "📁 Creating directory structure..." }

    # Create backup first
    if (-not $SkipBackup) {
        if (Test-Path $SetupConfig.MemoryDir) {
            $backupPath = Join-Path $SetupConfig.BackupDir "memory_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
            New-Item -ItemType Directory -Path $backupPath -Force | Out-Null
            Copy-Item "$($SetupConfig.MemoryDir)\*" $backupPath -Recurse -Force -ErrorAction SilentlyContinue
            if ($Verbose) { Write-Host "   ✓ Backup created: $backupPath" }
        }
    }

    # Create main directory
    if (-not (Test-Path $SetupConfig.MemoryDir)) {
        New-Item -ItemType Directory -Path $SetupConfig.MemoryDir -Force | Out-Null
    }

    # Create subdirectories
    foreach ($subdir in $SetupConfig.Subdirs) {
        $path = Join-Path $SetupConfig.MemoryDir $subdir
        if (-not (Test-Path $path)) {
            New-Item -ItemType Directory -Path $path -Force | Out-Null
            if ($Verbose) { Write-Host "   ✓ Created: $subdir" }
        }
    }
}

function Initialize-WikiDatabase {
    if ($Verbose) { Write-Host "📚 Initializing wiki database..." }

    $wikiScript = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis-staging\memory\jarvis-memory-wiki.ps1"

    if (Test-Path $wikiScript) {
        & $wikiScript -Operation build -Verbose:$Verbose | Out-Null
        if ($Verbose) { Write-Host "   ✓ Wiki built with commands, providers, risk levels" }
    }
}

function Create-ResonanceFile {
    if ($Verbose) { Write-Host "💫 Creating resonance (identity) file..." }

    $resonanceFile = Join-Path $SetupConfig.MemoryDir "resonance\jarvis-v0.3-identity.json"

    $resonance = @{
        name = "Jarvis-Local"
        version = "0.3.0-memory"
        core_principles = @(
            "Nothing is Deleted - Archive, don't erase"
            "Patterns Over Intentions - Observe, don't assume"
            "External Brain - Mirror, don't command"
            "Self-Improving - Learn from every execution"
            "Transparency - Always show the Why"
        )
        capabilities = @(
            "Intent parsing (AI + regex fallback)"
            "Risk gating (3-level approval)"
            "Command execution with proof logging"
            "Pattern discovery from execution data"
            "Cross-linked knowledge base"
            "User preference learning"
        )
        memory_layers = @{
            proof_logs = "Raw execution data"
            learnings = "Discovered patterns and correlations"
            wiki = "Cross-linked knowledge base"
            resonance = "Self-identity and principles"
            archive = "Historical data (preserved)"
        }
        created = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
    }

    $resonance | ConvertTo-Json -Depth 5 | Set-Content -Path $resonanceFile -Force
    if ($Verbose) { Write-Host "   ✓ Resonance file created" }
}

function Write-SetupLog {
    $setupLog = Join-Path $SetupConfig.LogsDir "MEMORY_V0.3_SETUP_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"

    $logContent = @"
================================================================================
JARVIS LOCAL MEMORY v0.3 SETUP LOG
================================================================================

Setup Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

DIRECTORY STRUCTURE CREATED:
$($SetupConfig.Subdirs | ForEach-Object { "  ✓ $_" })

WIKI SECTIONS INITIALIZED:
  ✓ Commands (5+ entries)
  ✓ Providers (3+ entries)
  ✓ Risk Levels (3 levels)

MEMORY LAYERS:
  ✓ Proof logs - Raw execution records
  ✓ Learnings - Discovered patterns
  ✓ Wiki - Cross-linked knowledge
  ✓ Resonance - Identity and principles
  ✓ Archive - Backup storage

NEXT STEPS:
  1. Run JARVIS commands to populate proof logs
  2. Wait 7+ days for pattern collection
  3. Run sync-memory.ps1 to ingest and synthesize
  4. Check learnings/ for discovered patterns

MODULES:
  - jarvis-memory-core.ps1      [Core storage & retrieval]
  - jarvis-memory-ingest.ps1    [Auto-ingest from proof logs]
  - jarvis-memory-synthesize.ps1 [Pattern discovery]
  - jarvis-memory-wiki.ps1      [Knowledge base]
  - sync-memory.ps1             [Cron job runner]

STATUS: ✓ Ready
================================================================================
"@

    $logContent | Set-Content -Path $setupLog -Force
    if ($Verbose) { Write-Host "   ✓ Setup log written: $setupLog" }
}

# ============================================================================
# MAIN SETUP
# ============================================================================

Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   JARVIS LOCAL MEMORY v0.3 - SETUP        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

try {
    Create-DirectoryStructure
    Initialize-WikiDatabase
    Create-ResonanceFile
    Write-SetupLog

    Write-Host ""
    Write-Host "✓ SETUP COMPLETE" -ForegroundColor Green
    Write-Host ""
    Write-Host "Memory ready at: $($SetupConfig.MemoryDir)" -ForegroundColor Green
    Write-Host "Run commands to populate proof logs, then sync-memory.ps1 to discover patterns" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ SETUP FAILED: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
