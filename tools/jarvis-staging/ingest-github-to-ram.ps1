# ingest-github-to-ram.ps1 - Import GitHub Repository into RAM Memory
# Clone repo and import knowledge into RAM's learning system

param(
    [string]$RepoUrl = "https://github.com/chakrit/kien-thai",
    [string]$MemoryDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory",
    [string]$TempDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\backup\temp-time-load-doc",
    [switch]$DryRun = $false,
    [switch]$Verbose = $true
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$GitHubConfig = @{
    RepoUrl = $RepoUrl
    RepoName = $RepoUrl.Split('/')[-1]
    ClonePath = Join-Path $TempDir "github-$(Get-Random)"
    MemoryDir = $MemoryDir
    OutputFile = "github-$(Get-Date -Format 'yyyyMMdd_HHmmss').jsonl"
    ImportLogFile = "github-ingest-$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
    FileExtensions = @(".md", ".txt", ".json", ".ts", ".js", ".py", ".sql", ".ps1", ".sh", ".yml", ".yaml")
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

function Test-GitInstalled {
    $gitPath = Get-Command git -ErrorAction SilentlyContinue
    if (-not $gitPath) {
        Write-Log "❌ Git not found. Install from: https://git-scm.com/" "ERROR"
        return $false
    }
    Write-Log "✓ Git found: $($gitPath.Path)" "SUCCESS"
    return $true
}

function Clone-GitHubRepo {
    param([string]$Url, [string]$DestPath)

    Write-Log "📥 Cloning repository..." "INFO"
    Write-Log "  URL: $Url" "INFO"
    Write-Log "  To: $DestPath" "INFO"

    try {
        if (-not (Test-Path $DestPath)) {
            New-Item -ItemType Directory -Path $DestPath -Force | Out-Null
        }

        Push-Location $DestPath
        git clone $Url . 2>&1 | ForEach-Object { Write-Log "  $_" "INFO" }
        Pop-Location

        if (Test-Path (Join-Path $DestPath ".git")) {
            Write-Log "✓ Repository cloned successfully" "SUCCESS"
            return $true
        } else {
            Write-Log "❌ Clone failed - .git directory not found" "ERROR"
            return $false
        }
    } catch {
        Write-Log "❌ Clone error: $_" "ERROR"
        return $false
    }
}

function Get-RepoFiles {
    param([string]$RepoPath)

    Write-Log "🔍 Scanning repository files..." "INFO"

    $allFiles = Get-ChildItem -Path $RepoPath -Recurse -File -ErrorAction SilentlyContinue
    $relevantFiles = $allFiles | Where-Object {
        $ext = $_.Extension.ToLower()
        $GitHubConfig.FileExtensions -contains $ext -or
        $_.Name -match "README|CHANGELOG|LICENSE|Makefile|Dockerfile|\.gitignore"
    }

    Write-Log "Found: $($allFiles.Count) total files, $($relevantFiles.Count) relevant" "SUCCESS"
    return $relevantFiles
}

function Convert-RepoFileToMemory {
    param(
        [System.IO.FileInfo]$File,
        [string]$RepoPath,
        [string]$RepoName
    )

    try {
        $content = Get-Content -Path $File.FullName -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
        if (-not $content) { return $null }

        $relativePath = $File.FullName.Replace($RepoPath, "").TrimStart("\")
        $title = $File.Name

        # Skip very large files
        if ($content.Length -gt 1MB) {
            Write-Log "⏭️  Skipping large file: $($File.Name)" "WARNING"
            return $null
        }

        $entry = @{
            timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
            source = "github-repository"
            repo_name = $RepoName
            repo_url = $GitHubConfig.RepoUrl
            file_name = $File.Name
            file_path = $relativePath
            file_type = $File.Extension
            file_size = $File.Length
            title = $title
            content_length = $content.Length
            content_preview = $content.Substring(0, [Math]::Min(500, $content.Length))
            full_content = $content
            tags = @("github", "imported", "external-knowledge", $RepoName)
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
    $outputFile = Join-Path $OutputPath $GitHubConfig.OutputFile

    foreach ($entry in $Entries) {
        $json = $entry | ConvertTo-Json -Compress
        Add-Content -Path $outputFile -Value $json -Force
    }

    Write-Log "✓ Saved to: $outputFile" "SUCCESS"
    return $outputFile
}

function New-ImportReport {
    param([int]$FileCount, [int]$EntryCount, [string]$OutputFile)

    $reportContent = @"
# GITHUB REPOSITORY IMPORT REPORT

**Date**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Repository**: $($GitHubConfig.RepoUrl)
**Output**: $OutputFile

## Summary

- Files scanned: $FileCount
- Memory entries created: $EntryCount
- Success rate: $(if ($FileCount -gt 0) { [math]::Round(($EntryCount / $FileCount) * 100, 1) }%)%

## Repository Information

- Name: $($GitHubConfig.RepoName)
- URL: $($GitHubConfig.RepoUrl)
- Clone Path: $($GitHubConfig.ClonePath)

## Content Imported

RAM now has access to:
- Documentation files (.md, .txt)
- Source code (.ts, .js, .py, .ps1, .sh)
- Configuration (.json, .yml, .yaml)
- Database schemas (.sql)
- Build files (Dockerfile, Makefile)

## Integration

1. Files are imported to: \`tools/memory/learnings/$($GitHubConfig.OutputFile)\`
2. Weekly synthesis (Sunday 2 AM) will:
   - Analyze code patterns
   - Extract key concepts
   - Discover relationships
   - Build knowledge graph

3. RAM will use this knowledge for:
   - Better intent understanding
   - Technical advice
   - Pattern recognition
   - Informed decisions

## Next Steps

1. Run your daily RAM commands
2. RAM learns from execution + this knowledge
3. Sunday synthesis improves RAM's understanding
4. Watch RAM get smarter with each interaction!

## Bridge

GitHub Repository → tools/memory/learnings/ → Weekly Synthesis → RAM Intelligence

The more RAM learns, the smarter it becomes! 🧠📚
"@

    return $reportContent
}

# ============================================================================
# MAIN INGEST
# ============================================================================

function Invoke-GitHubIngest {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Magenta
    Write-Host "║  GITHUB REPOSITORY → RAM LEARNING        ║" -ForegroundColor Magenta
    Write-Host "║  Importing Knowledge for Oracle Growth    ║" -ForegroundColor Magenta
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Magenta
    Write-Host ""

    # Check Git
    if (-not (Test-GitInstalled)) {
        return $false
    }

    Write-Host ""

    # Clone repository
    if (-not (Clone-GitHubRepo -Url $GitHubConfig.RepoUrl -DestPath $GitHubConfig.ClonePath)) {
        return $false
    }

    Write-Host ""

    # Scan files
    $files = Get-RepoFiles -RepoPath $GitHubConfig.ClonePath

    if ($files.Count -eq 0) {
        Write-Log "⚠️  No relevant files found in repository" "WARNING"
        return $false
    }

    Write-Log ""
    Write-Log "Processing $($files.Count) files..." "INFO"

    # Convert files
    $memoryEntries = @()
    $processedCount = 0

    foreach ($file in $files) {
        $entry = Convert-RepoFileToMemory -File $file -RepoPath $GitHubConfig.ClonePath -RepoName $GitHubConfig.RepoName
        if ($entry) {
            $memoryEntries += $entry
            $processedCount++
            if ($processedCount % 10 -eq 0) {
                Write-Log "  ✓ Processed $processedCount/$($files.Count) files" "INFO"
            }
        }
    }

    # Create learnings directory
    $learningsDir = Join-Path $GitHubConfig.MemoryDir "learnings"
    if (-not (Test-Path $learningsDir)) {
        New-Item -ItemType Directory -Path $learningsDir -Force | Out-Null
    }

    # Save to JSONL
    if (-not $DryRun) {
        $outputFile = Save-MemoryToJSONL -Entries $memoryEntries -OutputPath $learningsDir

        # Create report
        $report = New-ImportReport -FileCount $files.Count -EntryCount $memoryEntries.Count -OutputFile $outputFile
        $reportPath = Join-Path $GitHubConfig.MemoryDir $GitHubConfig.ImportLogFile
        Set-Content -Path $reportPath -Value $report -Force

        # Cleanup
        Write-Log ""
        Write-Log "🧹 Cleaning up temporary files..." "INFO"
        Remove-Item -Path $GitHubConfig.ClonePath -Recurse -Force -ErrorAction SilentlyContinue
        Write-Log "✓ Cleaned" "SUCCESS"

        Write-Host ""
        Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║  ✓ GITHUB IMPORT COMPLETE                ║" -ForegroundColor Green
        Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green
        Write-Host ""
        Write-Host "RAM has learned from GitHub:" -ForegroundColor Cyan
        Write-Host "  📚 $($memoryEntries.Count) knowledge entries"
        Write-Host "  📍 Repository: $($GitHubConfig.RepoName)"
        Write-Host "  💾 Saved to: $(Split-Path $outputFile -Leaf)"
        Write-Host "  📋 Report: $(Split-Path $reportPath -Leaf)"
        Write-Host ""
        Write-Host "Next: Run RAM daily, watch it grow!" -ForegroundColor Green
        Write-Host "  .\RAM_SIMPLE.ps1"
        Write-Host "  .\RAM_CHAT.ps1"
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
    Invoke-GitHubIngest
} catch {
    Write-Log "ERROR: $($_.Exception.Message)" "ERROR"
    exit 1
}
