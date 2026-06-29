# sync-memory.ps1 - Automated memory sync + synthesis
# Run weekly: ingests proof logs, discovers patterns, generates insights

param(
    [string]$Mode = "full",  # full, quick, ingest-only, synthesize-only
    [int]$DaysBack = 7,
    [bool]$Verbose = $true,
    [bool]$Archive = $true
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$SyncConfig = @{
    MemoryDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory"
    LogsDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\logs"
    CoreScript = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis-staging\memory\jarvis-memory-core.ps1"
    IngestScript = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis-staging\memory\jarvis-memory-ingest.ps1"
    SynthesizeScript = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis-staging\memory\jarvis-memory-synthesize.ps1"
}

# ============================================================================
# SYNC OPERATIONS
# ============================================================================

function Start-MemorySync {
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║     JARVIS MEMORY SYNC - $(Get-Date -Format 'yyyyMMdd HHmmss')     ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""

    $syncStart = Get-Date
    $results = @{
        mode = $Mode
        started = $syncStart.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        steps = @()
    }

    # Step 1: Initialize memory if needed
    if ($Verbose) { Write-Host "Step 1️⃣  Checking memory structure..." }
    if (-not (Test-Path $SyncConfig.MemoryDir)) {
        if ($Verbose) { Write-Host "   ⚙️  Running setup..." }
        $setupScript = Join-Path (Split-Path $SyncConfig.CoreScript) "setup-memory-v0.3.ps1"
        & $setupScript -SkipBackup | Out-Null
    }
    $results.steps += "initialization"

    # Step 2: Ingest
    if ($Mode -in @("full", "ingest-only")) {
        if ($Verbose) { Write-Host "Step 2️⃣  Ingesting proof logs ($DaysBack days)..." }
        $ingestResult = & $SyncConfig.IngestScript -DaysBack $DaysBack -Verbose:$Verbose
        $results.steps += "ingest"
        if ($Verbose) {
            Write-Host "   ✓ Ingested $($ingestResult.proof_entries) entries"
            Write-Host "   ✓ Found $($ingestResult.intent_patterns) intent patterns"
            Write-Host "   ✓ Found $($ingestResult.risk_patterns) risk patterns"
        }
    }

    # Step 3: Synthesize
    if ($Mode -in @("full", "synthesize-only")) {
        if ($Verbose) { Write-Host "Step 3️⃣  Synthesizing patterns..." }
        $synthesizeResult = & $SyncConfig.SynthesizeScript -Period "weekly" -DaysToAnalyze $DaysBack -Verbose:$Verbose
        $results.steps += "synthesis"
        if ($Verbose) {
            Write-Host "   ✓ Generated $($synthesizeResult.insights.Count) insights"
            Write-Host "   ✓ Success rate: $($synthesizeResult.summary.overall_success_rate)%"
        }
    }

    # Step 4: Archive old data
    if ($Archive) {
        if ($Verbose) { Write-Host "Step 4️⃣  Archiving old data..." }
        & $SyncConfig.CoreScript -Operation archive -MemoryType proof -Days 30 | Out-Null
        & $SyncConfig.CoreScript -Operation archive -MemoryType learnings -Days 30 | Out-Null
        $results.steps += "archive"
        if ($Verbose) { Write-Host "   ✓ Archived data >30 days old" }
    }

    # Step 5: Statistics
    if ($Verbose) { Write-Host "Step 5️⃣  Computing statistics..." }
    $statsProof = & $SyncConfig.CoreScript -Operation stats -MemoryType proof
    $statsLearnings = & $SyncConfig.CoreScript -Operation stats -MemoryType learnings
    $results.steps += "stats"
    if ($Verbose) {
        Write-Host "   ✓ Proof logs: $($statsProof.entries) entries, $($statsProof.size_kb) KB"
        Write-Host "   ✓ Learnings: $($statsLearnings.entries) entries, $($statsLearnings.size_kb) KB"
    }

    # Final summary
    $syncEnd = Get-Date
    $duration = $syncEnd - $syncStart
    $results.completed = $syncEnd.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    $results.duration_seconds = [math]::Round($duration.TotalSeconds, 2)

    return $results
}

function Write-SyncLog {
    param([object]$Results)

    $logFile = Join-Path $SyncConfig.LogsDir "MEMORY_SYNC_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"

    $logContent = @"
================================================================================
JARVIS MEMORY SYNC LOG
================================================================================

Mode: $($Results.mode)
Started: $($Results.started)
Completed: $($Results.completed)
Duration: $($Results.duration_seconds)s

Steps Executed:
$($Results.steps | ForEach-Object { "  ✓ $_" })

STATUS: ✓ COMPLETE
Next sync: $(((Get-Date).AddDays(7)).ToString('yyyy-MM-dd'))

================================================================================
"@

    Set-Content -Path $logFile -Value $logContent -Force
    if ($Verbose) { Write-Host "   ✓ Sync log: $logFile" }
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

$results = Start-MemorySync
Write-SyncLog -Results $results

Write-Host ""
Write-Host "✓ SYNC COMPLETE in $($results.duration_seconds)s" -ForegroundColor Green
Write-Host ""

$results | ConvertTo-Json
