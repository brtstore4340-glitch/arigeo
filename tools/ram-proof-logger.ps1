# ram-proof-logger.ps1 - Layer 5: Proof Logging & Audit Trail
# Never delete, always prove it - SFSR (Searchable, Forensic, Synth-Ready)

param(
    [string]$Intent = "",
    [string]$Status = "unknown",
    [object]$ExecutionResult = $null,
    [int]$RiskLevel = 0,
    [string]$ErrorLog = "",
    [switch]$Verbose = $true
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$ProofConfig = @{
    Version = "1.0"
    Philosophy = "Nothing is deleted. Proof first. Learn from everything."
    LogsDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\logs"
    ProofsDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\proofs"
    ArchiveDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\backup\archive"

    # Log retention (never delete, only archive)
    RetentionDays = 90
    ArchiveAfterDays = 30
    CompressArchives = $true
}

# ============================================================================
# PROOF RECORDING
# ============================================================================

function Write-ProofLog {
    param([string]$Message, [string]$Level = "INFO")
    $color = switch ($Level) {
        "INFO" { "Cyan" }
        "PROOF" { "Green" }
        "AUDIT" { "Yellow" }
        "ERROR" { "Red" }
        default { "Gray" }
    }
    if ($Verbose) {
        Write-Host "[$Level] $Message" -ForegroundColor $color
    }
}

function New-ProofEntry {
    param([object]$ExecutionData)

    Write-ProofLog "📝 Creating proof entry..." "PROOF"

    $proof = @{
        # Identity
        proof_id = [guid]::NewGuid().ToString()
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
        version = "1.0"

        # Execution details
        intent = $ExecutionData.intent
        status = $ExecutionData.status
        executor = if ($ExecutionData.executor) { $ExecutionData.executor } else { "unknown" }
        risk_level = $ExecutionData.risk_level

        # Results
        result_summary = $ExecutionData.output -or "No output"
        duration_ms = $ExecutionData.duration_ms -or 0
        error_log = $ExecutionData.error_log -or ""

        # Metadata
        layer = "proof_logger"
        hostname = $env:COMPUTERNAME
        username = $env:USERNAME
        working_dir = (Get-Location).Path

        # Searchability (for synthesis)
        tags = @($ExecutionData.intent, $ExecutionData.status, "ram-proof")
        keywords = @(
            $ExecutionData.intent,
            if ($ExecutionData.status -eq "error") { "error" } else { "success" },
            "executed"
        )

        # Traceability
        correlations = @{
            intent_id = $ExecutionData.intent
            parent_intent = $ExecutionData.parent_intent
            chain = @($ExecutionData.intent)
        }
    }

    return $proof
}

function Save-ProofEntryToJSONL {
    param([object]$ProofEntry, [string]$FileName)

    Write-ProofLog "💾 Saving proof entry..." "PROOF"

    # Ensure directory exists
    if (-not (Test-Path $ProofConfig.LogsDir)) {
        New-Item -ItemType Directory -Path $ProofConfig.LogsDir -Force | Out-Null
    }

    $logFile = Join-Path $ProofConfig.LogsDir $FileName

    $json = $ProofEntry | ConvertTo-Json -Compress
    Add-Content -Path $logFile -Value $json -Force

    Write-ProofLog "✓ Saved to: $FileName" "PROOF"
    return $logFile
}

function Save-ProofMetadata {
    param([object]$ProofEntry)

    Write-ProofLog "🏷️  Creating metadata..." "PROOF"

    # Create searchable metadata file
    $metaDir = Join-Path $ProofConfig.ProofsDir $([DateTime]::ParseExact($ProofEntry.timestamp, "yyyy-MM-ddTHH:mm:ss.fffZ", $null).ToString("yyyy-MM-dd"))
    if (-not (Test-Path $metaDir)) {
        New-Item -ItemType Directory -Path $metaDir -Force | Out-Null
    }

    $metaFile = Join-Path $metaDir "$($ProofEntry.proof_id).json"
    $ProofEntry | ConvertTo-Json -Depth 10 | Set-Content -Path $metaFile -Force

    Write-ProofLog "✓ Metadata: $($ProofEntry.proof_id)" "PROOF"
    return $metaFile
}

# ============================================================================
# ARCHIVE MANAGEMENT
# ============================================================================

function Archive-OldProofs {
    Write-ProofLog "📦 Archiving old proofs..." "AUDIT"

    if (-not (Test-Path $ProofConfig.LogsDir)) {
        return
    }

    $logFiles = Get-ChildItem -Path $ProofConfig.LogsDir -Filter "*.log" -ErrorAction SilentlyContinue

    $archiveDate = (Get-Date).AddDays(-$ProofConfig.ArchiveAfterDays)

    foreach ($file in $logFiles) {
        if ($file.LastWriteTime -lt $archiveDate) {
            Write-ProofLog "📤 Archiving: $($file.Name)" "AUDIT"

            # Create archive directory
            $archiveDir = Join-Path $ProofConfig.ArchiveDir $($file.LastWriteTime.ToString("yyyy-MM"))
            if (-not (Test-Path $archiveDir)) {
                New-Item -ItemType Directory -Path $archiveDir -Force | Out-Null
            }

            # Copy to archive (never delete!)
            Copy-Item -Path $file.FullName -Destination $archiveDir -Force
            Write-ProofLog "✓ Archived: $($file.Name)" "AUDIT"
        }
    }
}

function Get-ProofStats {
    Write-ProofLog "📊 Calculating proof statistics..." "AUDIT"

    $stats = @{
        total_proofs = 0
        success_count = 0
        error_count = 0
        blocked_count = 0
        success_rate = 0
        avg_duration_ms = 0
    }

    if (-not (Test-Path $ProofConfig.LogsDir)) {
        return $stats
    }

    $logFiles = Get-ChildItem -Path $ProofConfig.LogsDir -Filter "*.log" -ErrorAction SilentlyContinue

    foreach ($file in $logFiles) {
        try {
            $entries = Get-Content $file.FullName -ErrorAction SilentlyContinue | `
                ConvertFrom-Json -ErrorAction SilentlyContinue

            if ($entries) {
                $stats.total_proofs += $entries.Count

                foreach ($entry in $entries) {
                    switch ($entry.status) {
                        "success" { $stats.success_count++ }
                        "error" { $stats.error_count++ }
                        "blocked" { $stats.blocked_count++ }
                    }

                    if ($entry.duration_ms) {
                        $stats.avg_duration_ms += $entry.duration_ms
                    }
                }
            }
        } catch {
            # Continue on error
        }
    }

    if ($stats.total_proofs -gt 0) {
        $stats.success_rate = [math]::Round(($stats.success_count / $stats.total_proofs) * 100, 1)
        $stats.avg_duration_ms = [math]::Round($stats.avg_duration_ms / $stats.total_proofs, 0)
    }

    return $stats
}

# ============================================================================
# MAIN PROOF LOGGER
# ============================================================================

function Invoke-ProofLogger {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Magenta
    Write-Host "║  RAM PROOF LOGGER - Layer 5                ║" -ForegroundColor Magenta
    Write-Host "║  Never delete. Always prove. Forever learn ║" -ForegroundColor Magenta
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Magenta
    Write-Host ""

    Write-ProofLog "Intent: $Intent | Status: $Status" "INFO"
    Write-Host ""

    # Step 1: Create proof entry
    $proofEntry = New-ProofEntry -ExecutionData @{
        intent = $Intent
        status = $Status
        executor = if ($ExecutionResult.executor) { $ExecutionResult.executor } else { "unknown" }
        risk_level = $RiskLevel
        output = if ($ExecutionResult.output) { $ExecutionResult.output } else { "" }
        error_log = $ErrorLog
        duration_ms = if ($ExecutionResult.duration_ms) { $ExecutionResult.duration_ms } else { 0 }
    }

    # Step 2: Save to JSONL (append-only, searchable)
    $fileName = "ram-proof-$(Get-Date -Format 'yyyyMMdd').log"
    $proofFile = Save-ProofEntryToJSONL -ProofEntry $proofEntry -FileName $fileName

    # Step 3: Save metadata (indexed)
    $metaFile = Save-ProofMetadata -ProofEntry $proofEntry

    # Step 4: Archive old proofs
    Write-Host ""
    Archive-OldProofs

    # Step 5: Get stats
    Write-Host ""
    $stats = Get-ProofStats

    # Display summary
    Write-Host "✓ PROOF RECORDED" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Proof ID:        $($proofEntry.proof_id)"
    Write-Host "  Status:          $($proofEntry.status)"
    Write-Host "  Intent:          $($proofEntry.intent)"
    Write-Host "  Risk Level:      $($proofEntry.risk_level)/10"
    Write-Host "  Duration:        $($proofEntry.duration_ms)ms"
    Write-Host ""
    Write-Host "  Proof File:      $fileName"
    Write-Host "  Metadata File:   $(Split-Path $metaFile -Leaf)"
    Write-Host ""
    Write-Host "📊 Lifetime Statistics:"
    Write-Host "   Total Proofs:    $($stats.total_proofs)"
    Write-Host "   Success Rate:    $($stats.success_rate)%"
    Write-Host "   Avg Duration:    $($stats.avg_duration_ms)ms"
    Write-Host ""

    return @{
        proof_id = $proofEntry.proof_id
        proof_file = $proofFile
        metadata_file = $metaFile
        stats = $stats
    }
}

# ============================================================================
# MAIN ENTRY
# ============================================================================

if ($MyInvocation.InvocationName -ne ".") {
    $output = Invoke-ProofLogger

    # Return as JSON
    $output | ConvertTo-Json -Depth 10 | Write-Output
}
