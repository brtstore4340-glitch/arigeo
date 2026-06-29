# ingest-obsidian-to-jarvis.ps1 - Import Obsidian Memory into JARVIS
# Read all .md files from Obsidian vault and convert to JARVIS memory format

param(
    [string]$ObsidianPath = "D:\Obsidian",
    [string]$MemoryDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory",
    [switch]$DryRun = $false,
    [switch]$Verbose = $true
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$IngestConfig = @{
    ObsidianPath = $ObsidianPath
    MemoryDir = $MemoryDir
    OutputFile = "obsidian-imported-$(Get-Date -Format 'yyyyMMdd_HHmmss').jsonl"
    ImportLogFile = "obsidian-ingest-$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
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

function Test-ObsidianVault {
    param([string]$Path)

    if (-not (Test-Path $Path)) {
        Write-Log "❌ Obsidian vault not found: $Path" "ERROR"
        return $false
    }

    Write-Log "✓ Obsidian vault found: $Path" "SUCCESS"
    return $true
}

function Get-ObsidianFiles {
    param([string]$Path)

    Write-Log "🔍 Scanning Obsidian files..." "INFO"

    $mdFiles = Get-ChildItem -Path $Path -Filter "*.md" -Recurse -ErrorAction SilentlyContinue
    $jsonFiles = Get-ChildItem -Path $Path -Filter "*.json" -Recurse -ErrorAction SilentlyContinue

    $allFiles = @($mdFiles) + @($jsonFiles) | Where-Object { $_.Name -ne ".gitkeep" }

    Write-Log "Found: $($mdFiles.Count) .md files, $($jsonFiles.Count) .json files" "INFO"

    return $allFiles
}

function Convert-ObsidianToMemory {
    param(
        [System.IO.FileInfo]$File,
        [string]$VaultPath
    )

    try {
        $content = Get-Content -Path $File.FullName -Raw -Encoding UTF8

        # Get relative path from vault
        $relativePath = $File.FullName.Replace($VaultPath, "").TrimStart("\")

        # Extract title from filename
        $title = $File.BaseName

        # For markdown, try to extract first heading
        if ($File.Extension -eq ".md") {
            $firstHeading = $content -match '^# (.+)$' | ForEach-Object {
                if ($content -match '^# (.+)$') {
                    $matches[1]
                }
            }
            if ($firstHeading) { $title = $firstHeading }
        }

        # Create memory entry
        $entry = @{
            timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
            source = "obsidian-vault"
            file_name = $File.Name
            file_path = $relativePath
            file_type = $File.Extension
            title = $title
            content_length = $content.Length
            content_preview = $content.Substring(0, [Math]::Min(300, $content.Length))
            full_content = $content
            tags = @("obsidian", "imported", "knowledge-base")
            imported_at = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
        }

        return $entry
    } catch {
        Write-Log "⚠️  Error processing $($File.Name): $_" "WARNING"
        return $null
    }
}

function Save-MemoryToJSONL {
    param(
        [array]$Entries,
        [string]$OutputPath
    )

    Write-Log "💾 Writing to JSONL..." "INFO"

    $outputFile = Join-Path $OutputPath $IngestConfig.OutputFile

    foreach ($entry in $Entries) {
        $json = $entry | ConvertTo-Json -Compress
        Add-Content -Path $outputFile -Value $json -Force
    }

    Write-Log "✓ Saved to: $outputFile" "SUCCESS"
    return $outputFile
}

function New-ImportReport {
    param(
        [int]$FileCount,
        [int]$EntryCount,
        [array]$Files,
        [string]$OutputFile
    )

    $reportContent = @"
# OBSIDIAN VAULT IMPORT REPORT

**Date**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Vault**: $($IngestConfig.ObsidianPath)
**Output**: $OutputFile

## Summary

- Files scanned: $FileCount
- Memory entries created: $EntryCount
- Success rate: $(if ($FileCount -gt 0) { [math]::Round(($EntryCount / $FileCount) * 100, 1) }%)%

## Files Imported

"@

    foreach ($file in $Files) {
        $reportContent += "- $($file.Name)`n"
    }

    $reportContent += @"

## Next Steps

JARVIS now has access to your Obsidian knowledge base:
1. Memory will be synthesized weekly (Sunday 2 AM)
2. Patterns will be discovered automatically
3. Knowledge integrated into decision-making

Check results in:
- \`tools/memory/learnings/$($IngestConfig.OutputFile)\`
- \`tools/logs/$($IngestConfig.ImportLogFile)\`

"@

    return $reportContent
}

# ============================================================================
# MAIN INGEST
# ============================================================================

function Invoke-ObsidianIngest {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  OBSIDIAN → JARVIS MEMORY INGEST          ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""

    # Validate vault
    if (-not (Test-ObsidianVault -Path $IngestConfig.ObsidianPath)) {
        return $false
    }

    # Scan files
    $files = Get-ObsidianFiles -Path $IngestConfig.ObsidianPath

    if ($files.Count -eq 0) {
        Write-Log "⚠️  No files found in Obsidian vault" "WARNING"
        return $false
    }

    Write-Log ""
    Write-Log "Processing $($files.Count) files..." "INFO"

    # Convert each file
    $memoryEntries = @()
    foreach ($file in $files) {
        $entry = Convert-ObsidianToMemory -File $file -VaultPath $IngestConfig.ObsidianPath
        if ($entry) {
            $memoryEntries += $entry
            Write-Log "  ✓ $($file.Name)" "SUCCESS"
        }
    }

    # Create learnings directory if needed
    $learningsDir = Join-Path $IngestConfig.MemoryDir "learnings"
    if (-not (Test-Path $learningsDir)) {
        New-Item -ItemType Directory -Path $learningsDir -Force | Out-Null
    }

    # Save to JSONL
    if (-not $DryRun) {
        $outputFile = Save-MemoryToJSONL -Entries $memoryEntries -OutputPath $learningsDir

        # Create report
        $report = New-ImportReport -FileCount $files.Count -EntryCount $memoryEntries.Count -Files $files -OutputFile $outputFile
        $reportPath = Join-Path $IngestConfig.MemoryDir $IngestConfig.ImportLogFile
        Set-Content -Path $reportPath -Value $report -Force

        Write-Host ""
        Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║  ✓ OBSIDIAN IMPORT COMPLETE              ║" -ForegroundColor Green
        Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green
        Write-Host ""
        Write-Host "JARVIS now has access to:" -ForegroundColor Cyan
        Write-Host "  📚 $($memoryEntries.Count) memory entries from Obsidian"
        Write-Host "  📍 Vault: $($IngestConfig.ObsidianPath)"
        Write-Host "  💾 Saved to: $outputFile"
        Write-Host "  📋 Report: $reportPath"
        Write-Host ""
        Write-Host "Next: JARVIS will synthesize weekly (Sunday 2 AM)" -ForegroundColor Green
        Write-Host ""

        return $true
    } else {
        Write-Log ""
        Write-Log "[DRY-RUN] Would import $($memoryEntries.Count) entries" "INFO"
        return $false
    }
}

# ============================================================================
# MAIN ENTRY
# ============================================================================

$ErrorActionPreference = "Continue"

try {
    Invoke-ObsidianIngest
} catch {
    Write-Log "ERROR: $($_.Exception.Message)" "ERROR"
    exit 1
}
