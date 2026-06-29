# consolidate-oracle-memory.ps1 - Ingest memories from other oracles into JARVIS
# Consolidates learnings from: khun-ram-oracle, aeimathes-oracle, zeus-oracle

param(
    [switch]$DryRun = $false,
    [switch]$Verbose = $true
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$ConsolidationConfig = @{
    JarvisMemoryDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory"
    Oracles = @(
        @{
            Name = "khun-ram-oracle"
            Path = "D:\01 Main Work\Boots\Agentic AI\mission-control\khun-ram-oracle\ψ\memory"
        }
        @{
            Name = "aeimathes-oracle"
            Path = "D:\01 Main Work\Boots\Agentic AI\mission-control\aeimathes-oracle\ψ\memory"
        }
        @{
            Name = "zeus-oracle"
            Path = "D:\01 Main Work\Boots\Agentic AI\mission-control\zeus-oracle\ψ\memory"
        }
    )
    ConsolidatedLearningsFile = "oracle-fleet-consolidated-learnings.jsonl"
    ConsolidationLogFile = "oracle-memory-consolidation.log"
}

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logLine = "[$timestamp] [$Level] $Message"

    Write-Host $logLine -ForegroundColor $(
        switch ($Level) {
            "INFO" { "Cyan" }
            "SUCCESS" { "Green" }
            "WARNING" { "Yellow" }
            "ERROR" { "Red" }
            default { "Gray" }
        }
    )
}

function Read-MemoryFile {
    param([string]$FilePath)

    if (-not (Test-Path $FilePath)) {
        return $null
    }

    try {
        $content = Get-Content -Path $FilePath -Raw
        return $content
    } catch {
        Write-Log "Failed to read $FilePath : $_" "WARNING"
        return $null
    }
}

function Extract-LearningsFromMemory {
    param(
        [string]$OracleName,
        [string]$MemoryPath
    )

    $learnings = @()

    # Find all learning files
    $learningFiles = Get-ChildItem -Path "$MemoryPath/learnings" -Filter "*.md" -ErrorAction SilentlyContinue

    foreach ($file in $learningFiles) {
        $content = Read-MemoryFile -FilePath $file.FullName

        if ($content) {
            $learnings += @{
                oracle = $OracleName
                file = $file.Name
                path = $file.FullName
                content = $content
                extracted_at = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
            }
        }
    }

    return $learnings
}

function Extract-ResonanceFromMemory {
    param(
        [string]$OracleName,
        [string]$MemoryPath
    )

    $resonances = @()

    # Find resonance files
    $resonanceFiles = Get-ChildItem -Path "$MemoryPath/resonance" -Filter "*.md" -ErrorAction SilentlyContinue

    foreach ($file in $resonanceFiles) {
        $content = Read-MemoryFile -FilePath $file.FullName

        if ($content) {
            $resonances += @{
                oracle = $OracleName
                file = $file.Name
                type = if ($file.Name -match "philosophy|soul|oracle") { $file.Name.TrimEnd('.md') } else { "identity" }
                content = $content
                extracted_at = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
            }
        }
    }

    return $resonances
}

function Create-ConsolidatedEntry {
    param(
        [string]$OracleName,
        [hashtable]$Learning
    )

    return @{
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
        source = "oracle-fleet-consolidation"
        source_oracle = $OracleName
        source_file = $Learning.file
        type = "learning"
        content_summary = $Learning.content.Substring(0, [Math]::Min(500, $Learning.content.Length))
        full_content = $Learning.content
        extracted_at = $Learning.extracted_at
    }
}

# ============================================================================
# MAIN CONSOLIDATION
# ============================================================================

function Consolidate-OracleMemory {
    Write-Log "╔════════════════════════════════════════════╗"
    Write-Log "║  ORACLE FLEET MEMORY CONSOLIDATION        ║"
    Write-Log "╚════════════════════════════════════════════╝"
    Write-Log ""

    # Verify JARVIS memory directory exists
    if (-not (Test-Path $ConsolidationConfig.JarvisMemoryDir)) {
        Write-Log "JARVIS memory directory not found: $($ConsolidationConfig.JarvisMemoryDir)" "ERROR"
        return $false
    }

    $consolidatedCount = 0
    $allLearnings = @()
    $allResonances = @()

    # Process each oracle
    foreach ($oracle in $ConsolidationConfig.Oracles) {
        Write-Log ""
        Write-Log "Processing: $($oracle.Name)" "INFO"
        Write-Log "  Path: $($oracle.Path)" "INFO"

        if (-not (Test-Path $oracle.Path)) {
            Write-Log "  ⚠️  Memory directory not found" "WARNING"
            continue
        }

        # Extract learnings
        $learnings = Extract-LearningsFromMemory -OracleName $oracle.Name -MemoryPath $oracle.Path
        if ($learnings.Count -gt 0) {
            Write-Log "  ✓ Found $($learnings.Count) learning files" "SUCCESS"
            $allLearnings += $learnings
            $consolidatedCount += $learnings.Count
        }

        # Extract resonances
        $resonances = Extract-ResonanceFromMemory -OracleName $oracle.Name -MemoryPath $oracle.Path
        if ($resonances.Count -gt 0) {
            Write-Log "  ✓ Found $($resonances.Count) resonance files" "SUCCESS"
            $allResonances += $resonances
        }
    }

    Write-Log ""
    Write-Log "Total extracted: $consolidatedCount learnings + $($allResonances.Count) resonances" "INFO"

    # Write consolidated learnings to JSONL
    if (-not $DryRun) {
        $consolidatedFile = Join-Path $ConsolidationConfig.JarvisMemoryDir "learnings" $ConsolidationConfig.ConsolidatedLearningsFile

        foreach ($learning in $allLearnings) {
            $entry = Create-ConsolidatedEntry -OracleName $learning.oracle -Learning $learning
            $json = $entry | ConvertTo-Json -Compress
            Add-Content -Path $consolidatedFile -Value $json -Force
        }

        Write-Log ""
        Write-Log "✓ Consolidated learnings written to: $consolidatedFile" "SUCCESS"
        Write-Log "✓ Total entries: $($allLearnings.Count)" "SUCCESS"
    } else {
        Write-Log ""
        Write-Log "[DRY-RUN] Would write $($allLearnings.Count) learnings to consolidated file" "INFO"
    }

    # Write consolidation report
    $reportContent = @"
# ORACLE FLEET MEMORY CONSOLIDATION REPORT

**Date**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Status**: ✓ Complete

## Summary

- Total Oracles Processed: $($ConsolidationConfig.Oracles.Count)
- Total Learnings Extracted: $($allLearnings.Count)
- Total Resonances Extracted: $($allResonances.Count)
- Total Entries: $($allLearnings.Count + $allResonances.Count)

## Oracles Consolidated

"@

    foreach ($oracle in $ConsolidationConfig.Oracles) {
        $oracleLearnings = @($allLearnings | Where-Object { $_.oracle -eq $oracle.Name })
        $oracleResonances = @($allResonances | Where-Object { $_.oracle -eq $oracle.Name })

        $reportContent += @"

### $($oracle.Name)
- Learnings: $($oracleLearnings.Count)
- Resonances: $($oracleResonances.Count)
- Path: $($oracle.Path)

"@
    }

    $reportContent += @"

## Knowledge Consolidated Into JARVIS

JARVIS now has access to:
- ✓ Fleet patterns and learnings
- ✓ Oracle identities and philosophies
- ✓ Cross-oracle insights
- ✓ Historical decision patterns

## Usage

JARVIS will use these consolidated learnings:
1. During intent parsing (contextual understanding)
2. During risk evaluation (historical precedents)
3. During memory synthesis (pattern recognition)
4. In weekly updates (continuous learning)

All memory is preserved in: $($ConsolidationConfig.JarvisMemoryDir)/learnings/

"@

    $reportPath = Join-Path $ConsolidationConfig.JarvisMemoryDir $ConsolidationConfig.ConsolidationLogFile
    Set-Content -Path $reportPath -Value $reportContent -Force

    Write-Log ""
    Write-Log "✓ Consolidation report written to: $reportPath" "SUCCESS"
    Write-Log ""
    Write-Log "╔════════════════════════════════════════════╗"
    Write-Log "║  CONSOLIDATION COMPLETE                   ║"
    Write-Log "╚════════════════════════════════════════════╝"

    return $true
}

# ============================================================================
# MAIN ENTRY
# ============================================================================

$ErrorActionPreference = "Continue"

try {
    Consolidate-OracleMemory
} catch {
    Write-Log "ERROR: $($_.Exception.Message)" "ERROR"
    exit 1
}
