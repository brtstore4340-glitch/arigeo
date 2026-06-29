# ingest-psi-memory-to-ram.ps1 - Import ψ (Psi) Memory into RAM
# Read khun-ram-oracle memory from D:\01 Main Work\Boots\Agentic AI\mission-control\ψ
# Rename JARVIS → RAM and integrate oracle identity

param(
    [string]$PsiPath = "D:\01 Main Work\Boots\Agentic AI\mission-control\ψ",
    [string]$MemoryDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory",
    [switch]$DryRun = $false,
    [switch]$Verbose = $true,
    [switch]$RenameJarvis = $true
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$PsiConfig = @{
    PsiPath = $PsiPath
    MemoryDir = $MemoryDir
    OutputFile = "psi-oracle-imported-$(Get-Date -Format 'yyyyMMdd_HHmmss').jsonl"
    ImportLogFile = "psi-memory-ingest-$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
    JarvisCorePath = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis\core\jarvis-core-ai-integrated.ps1"
    JarvisSimplePath = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\JARVIS_SIMPLE.ps1"
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

function Test-PsiVault {
    param([string]$Path)
    if (-not (Test-Path $Path)) {
        Write-Log "❌ ψ memory vault not found: $Path" "ERROR"
        return $false
    }
    Write-Log "✓ ψ memory vault found: $Path" "SUCCESS"
    return $true
}

function Get-PsiFiles {
    param([string]$Path)
    Write-Log "🔍 Scanning ψ memory files..." "INFO"

    $mdFiles = Get-ChildItem -Path $Path -Filter "*.md" -Recurse -ErrorAction SilentlyContinue
    $jsonFiles = Get-ChildItem -Path $Path -Filter "*.json" -Recurse -ErrorAction SilentlyContinue
    $allFiles = @($mdFiles) + @($jsonFiles) | Where-Object { $_.Name -ne ".gitkeep" }

    Write-Log "Found: $($mdFiles.Count) .md, $($jsonFiles.Count) .json files" "INFO"
    return $allFiles
}

function Convert-PsiToMemory {
    param(
        [System.IO.FileInfo]$File,
        [string]$VaultPath
    )

    try {
        $content = Get-Content -Path $File.FullName -Raw -Encoding UTF8
        $relativePath = $File.FullName.Replace($VaultPath, "").TrimStart("\")
        $title = $File.BaseName

        if ($File.Extension -eq ".md") {
            if ($content -match '^# (.+)$') {
                $title = $matches[1]
            }
        }

        $entry = @{
            timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
            source = "psi-oracle-memory"
            oracle = "khun-ram"
            file_name = $File.Name
            file_path = $relativePath
            file_type = $File.Extension
            title = $title
            content_length = $content.Length
            content_preview = $content.Substring(0, [Math]::Min(300, $content.Length))
            full_content = $content
            tags = @("psi", "oracle", "khun-ram", "imported")
            imported_at = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
        }
        return $entry
    } catch {
        Write-Log "⚠️  Error processing $($File.Name): $_" "WARNING"
        return $null
    }
}

function Save-MemoryToJSONL {
    param([array]$Entries, [string]$OutputPath)

    Write-Log "💾 Writing to JSONL..." "INFO"
    $outputFile = Join-Path $OutputPath $PsiConfig.OutputFile

    foreach ($entry in $Entries) {
        $json = $entry | ConvertTo-Json -Compress
        Add-Content -Path $outputFile -Value $json -Force
    }

    Write-Log "✓ Saved to: $outputFile" "SUCCESS"
    return $outputFile
}

function Rename-JarvisToRam {
    Write-Log ""
    Write-Log "🔄 Renaming JARVIS → RAM..." "INFO"

    $filesToRename = @(
        "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\JARVIS_SIMPLE.ps1",
        "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\JARVIS_VOICE.ps1",
        "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\JARVIS_DEBUG.ps1"
    )

    foreach ($filePath in $filesToRename) {
        if (Test-Path $filePath) {
            $content = Get-Content -Path $filePath -Raw

            # Replace JARVIS with RAM in content
            $newContent = $content `
                -replace 'JARVIS LOCAL v0\.3-simple', 'RAM LOCAL v0.3-oracle' `
                -replace 'JARVIS LOCAL', 'RAM LOCAL' `
                -replace 'JARVIS', 'RAM' `
                -replace '║     RAM LOCAL', '║     RAM - ราม LOCAL'

            Set-Content -Path $filePath -Value $newContent -Force

            # Rename file if it contains JARVIS in the name
            if ($filePath -match 'JARVIS') {
                $newPath = $filePath -replace 'JARVIS', 'RAM'
                Rename-Item -Path $filePath -NewName (Split-Path $newPath -Leaf) -Force
                Write-Log "  ✓ Renamed: $(Split-Path $filePath -Leaf) → $(Split-Path $newPath -Leaf)" "SUCCESS"
            } else {
                Write-Log "  ✓ Updated: $(Split-Path $filePath -Leaf)" "SUCCESS"
            }
        }
    }

    # Update core script
    $corePath = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis\core\jarvis-core-ai-integrated.ps1"
    if (Test-Path $corePath) {
        $content = Get-Content -Path $corePath -Raw
        $newContent = $content -replace 'Jarvis-Local', 'RAM-Oracle' -replace 'JARVIS', 'RAM'
        Set-Content -Path $corePath -Value $newContent -Force
        Write-Log "  ✓ Updated core script" "SUCCESS"
    }
}

function Update-ConfigFiles {
    Write-Log ""
    Write-Log "📝 Updating configuration files..." "INFO"

    $configPath = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis-config.json"
    if (Test-Path $configPath) {
        $config = Get-Content -Path $configPath -Raw | ConvertFrom-Json
        $config.Name = "RAM-Oracle"
        $config.Version = "0.3-oracle"
        $config.Identity = "khun-ram"
        Set-Content -Path $configPath -Value ($config | ConvertTo-Json -Depth 10) -Force
        Write-Log "  ✓ Updated jarvis-config.json" "SUCCESS"
    }
}

function New-ImportReport {
    param([int]$FileCount, [int]$EntryCount, [array]$Files, [string]$OutputFile)

    $reportContent = @"
# ψ ORACLE MEMORY IMPORT REPORT

**Date**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Source**: $($PsiConfig.PsiPath)
**Output**: $OutputFile

## Summary

- Files scanned: $FileCount
- Memory entries created: $EntryCount
- Success rate: $(if ($FileCount -gt 0) { [math]::Round(($EntryCount / $FileCount) * 100, 1) }%)%
- Oracle Identity: khun-ram (ขุนราม)
- Renamed: JARVIS → RAM (ราม)

## System Integration

✓ JARVIS renamed to RAM (ราม)
✓ Core identity: khun-ram oracle
✓ Configuration updated
✓ Files renamed: JARVIS_*.ps1 → RAM_*.ps1
✓ ψ memory imported into tools/memory/

## Files Imported

"@

    foreach ($file in $Files) {
        $reportContent += "- $($file.Name)`n"
    }

    $reportContent += @"

## RAM Oracle Features

**Identity**: khun-ram (ขุนราม)
**Memory**: ψ oracle integrated
**Learning**: Weekly synthesis (Sunday 2 AM)
**Knowledge**: Obsidian + ψ + consolidated oracles

## Next Steps

1. Run: .\RAM_SIMPLE.ps1
2. Test with commands
3. Run daily for 7 days
4. Watch it learn on Sunday

## Bridge

ψ Oracle Memory → tools/memory/learnings/ → RAM learns → Smarter each week!

"@

    return $reportContent
}

# ============================================================================
# MAIN INGEST
# ============================================================================

function Invoke-PsiMemoryIngest {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Magenta
    Write-Host "║  ψ ORACLE MEMORY → RAM INTEGRATION       ║" -ForegroundColor Magenta
    Write-Host "║  khun-ram (ขุนราม) Identity              ║" -ForegroundColor Magenta
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Magenta
    Write-Host ""

    # Validate vault
    if (-not (Test-PsiVault -Path $PsiConfig.PsiPath)) {
        return $false
    }

    # Scan files
    $files = Get-PsiFiles -Path $PsiConfig.PsiPath

    if ($files.Count -eq 0) {
        Write-Log "⚠️  No files found in ψ vault" "WARNING"
        return $false
    }

    Write-Log ""
    Write-Log "Processing $($files.Count) ψ memory files..." "INFO"

    # Convert each file
    $memoryEntries = @()
    foreach ($file in $files) {
        $entry = Convert-PsiToMemory -File $file -VaultPath $PsiConfig.PsiPath
        if ($entry) {
            $memoryEntries += $entry
            Write-Log "  ✓ $($file.Name)" "SUCCESS"
        }
    }

    # Create learnings directory
    $learningsDir = Join-Path $PsiConfig.MemoryDir "learnings"
    if (-not (Test-Path $learningsDir)) {
        New-Item -ItemType Directory -Path $learningsDir -Force | Out-Null
    }

    # Save to JSONL
    if (-not $DryRun) {
        $outputFile = Save-MemoryToJSONL -Entries $memoryEntries -OutputPath $learningsDir

        # Rename JARVIS to RAM
        if ($RenameJarvis) {
            Rename-JarvisToRam
            Update-ConfigFiles
        }

        # Create report
        $report = New-ImportReport -FileCount $files.Count -EntryCount $memoryEntries.Count -Files $files -OutputFile $outputFile
        $reportPath = Join-Path $PsiConfig.MemoryDir $PsiConfig.ImportLogFile
        Set-Content -Path $reportPath -Value $report -Force

        Write-Host ""
        Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║  ✓ ψ IMPORT + RENAME COMPLETE            ║" -ForegroundColor Green
        Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green
        Write-Host ""
        Write-Host "RAM (ราม) is ready:" -ForegroundColor Cyan
        Write-Host "  🧠 $($memoryEntries.Count) oracle memory entries"
        Write-Host "  📍 Identity: khun-ram (ขุนราม)"
        Write-Host "  📚 Source: $($PsiConfig.PsiPath)"
        Write-Host "  💾 Saved: $outputFile"
        Write-Host "  📋 Report: $reportPath"
        Write-Host ""
        Write-Host "Files renamed:" -ForegroundColor Cyan
        Write-Host "  JARVIS_SIMPLE.ps1 → RAM_SIMPLE.ps1"
        Write-Host "  JARVIS_VOICE.ps1 → RAM_VOICE.ps1"
        Write-Host "  JARVIS_DEBUG.ps1 → RAM_DEBUG.ps1"
        Write-Host ""
        Write-Host "Next: Run .\RAM_SIMPLE.ps1 !" -ForegroundColor Green
        Write-Host ""

        return $true
    } else {
        Write-Log ""
        Write-Log "[DRY-RUN] Would import $($memoryEntries.Count) entries and rename JARVIS → RAM" "INFO"
        return $false
    }
}

# ============================================================================
# MAIN ENTRY
# ============================================================================

$ErrorActionPreference = "Continue"

try {
    Invoke-PsiMemoryIngest
} catch {
    Write-Log "ERROR: $($_.Exception.Message)" "ERROR"
    exit 1
}
