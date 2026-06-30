# jarvis-memory-core.ps1 - JARVIS Memory System v0.3
# Two-way memory: learns from execution, improves decisions
# Principle: Nothing is Deleted (archive, don't erase)

param(
    [string]$Operation = "read",  # read, write, search, archive, stats
    [string]$MemoryType = "proof",  # proof, learning, pattern, wiki, resonance
    [object]$Data = $null,
    [string]$Query = "",
    [int]$Days = 7
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$MemoryConfig = @{
    BaseDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory"
    ProofLogsDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\logs"

    Dirs = @{
        proof = "proof-logs"
        learnings = "learnings"
        resonance = "resonance"
        wiki = "wiki"
        archive = "archive"
        temp = "temp"
    }

    RetentionDays = 90
    ArchiveThreshold = 30
    BatchSize = 100
}

# ============================================================================
# CORE FUNCTIONS
# ============================================================================

function Initialize-Memory {
    foreach ($dir in $MemoryConfig.Dirs.Values) {
        $path = Join-Path $MemoryConfig.BaseDir $dir
        if (-not (Test-Path $path)) {
            New-Item -ItemType Directory -Path $path -Force | Out-Null
        }
    }

    Write-Host "✓ Memory initialized at $($MemoryConfig.BaseDir)"
}

function Write-Memory {
    param(
        [string]$Type,
        [object]$Entry,
        [string]$Filename = $null
    )

    if (-not $Filename) {
        $Filename = "memory_$(Get-Date -Format 'yyyyMMdd_HHmmss').jsonl"
    }

    $dir = Join-Path $MemoryConfig.BaseDir $MemoryConfig.Dirs[$Type]
    $path = Join-Path $dir $Filename

    $json = $Entry | ConvertTo-Json -Compress
    Add-Content -Path $path -Value $json -Force

    return @{
        success = $true
        path = $path
        entry = $Entry
    }
}

function Read-Memory {
    param(
        [string]$Type,
        [string]$Filename = $null
    )

    $dir = Join-Path $MemoryConfig.BaseDir $MemoryConfig.Dirs[$Type]

    if ($Filename) {
        $path = Join-Path $dir $Filename
        if (Test-Path $path) {
            return Get-Content $path | ConvertFrom-Json -AsHashtable
        }
        return @()
    }

    # Read all files of this type
    $files = Get-ChildItem -Path $dir -Filter "*.jsonl" -ErrorAction SilentlyContinue
    $entries = @()

    foreach ($file in $files) {
        $entries += Get-Content $file.FullName | ConvertFrom-Json -AsHashtable
    }

    return $entries
}

function Search-Memory {
    param(
        [string]$Type,
        [string]$Query,
        [int]$Limit = 10
    )

    $entries = Read-Memory -Type $Type
    $results = @()

    foreach ($entry in $entries) {
        $entryStr = $entry | ConvertTo-Json -Depth 3
        if ($entryStr -match [regex]::Escape($Query)) {
            $results += $entry
            if ($results.Count -ge $Limit) { break }
        }
    }

    return $results
}

function Archive-Memory {
    param(
        [string]$Type,
        [int]$OlderThanDays = $MemoryConfig.ArchiveThreshold
    )

    $dir = Join-Path $MemoryConfig.BaseDir $MemoryConfig.Dirs[$Type]
    $archiveDir = Join-Path $MemoryConfig.BaseDir $MemoryConfig.Dirs["archive"]

    $cutoffDate = (Get-Date).AddDays(-$OlderThanDays)
    $files = Get-ChildItem -Path $dir -Filter "*.jsonl" | Where-Object { $_.LastWriteTime -lt $cutoffDate }

    foreach ($file in $files) {
        $archivePath = Join-Path $archiveDir "$($file.BaseName)_archived_$(Get-Date -Format 'yyyyMMdd').jsonl"
        Move-Item -Path $file.FullName -Destination $archivePath -Force
    }

    return @{
        archived_count = $files.Count
        archive_dir = $archiveDir
    }
}

function Get-MemoryStats {
    param([string]$Type)

    $dir = Join-Path $MemoryConfig.BaseDir $MemoryConfig.Dirs[$Type]
    $files = Get-ChildItem -Path $dir -Filter "*.jsonl" -ErrorAction SilentlyContinue

    $totalEntries = 0
    $totalSize = 0

    foreach ($file in $files) {
        $totalSize += $file.Length
        $totalEntries += @(Get-Content $file.FullName).Count
    }

    return @{
        type = $Type
        files = $files.Count
        entries = $totalEntries
        size_kb = [math]::Round($totalSize / 1KB, 2)
        oldest_entry = ($files | Sort-Object LastWriteTime | Select-Object -First 1).LastWriteTime
    }
}

# ============================================================================
# MEMORY ENTRY BUILDERS
# ============================================================================

function New-ProofEntry {
    param(
        [string]$Action,
        [string]$Intent,
        [int]$RiskScore,
        [bool]$Approved,
        [bool]$Success,
        [string]$Output = ""
    )

    return @{
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
        action = $Action
        intent = $Intent
        risk_score = $RiskScore
        approved = $Approved
        success = $Success
        output = $Output
    }
}

function New-LearningEntry {
    param(
        [string]$Pattern,
        [string]$Category,
        [double]$Confidence,
        [array]$Evidence = @(),
        [string]$Notes = ""
    )

    return @{
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
        pattern = $Pattern
        category = $Category
        confidence = $Confidence
        evidence_count = $Evidence.Count
        evidence = $Evidence
        notes = $Notes
    }
}

function New-WikiEntry {
    param(
        [string]$Title,
        [string]$Content,
        [array]$Tags = @(),
        [array]$Links = @()
    )

    return @{
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
        title = $Title
        content = $Content
        tags = $Tags
        links = $Links
        updated = Get-Date -Format "yyyy-MM-dd"
    }
}

# ============================================================================
# MEMORY OPERATIONS
# ============================================================================

function Invoke-MemoryOperation {
    switch ($Operation) {
        "read" {
            return Read-Memory -Type $MemoryType
        }
        "write" {
            return Write-Memory -Type $MemoryType -Entry $Data
        }
        "search" {
            return Search-Memory -Type $MemoryType -Query $Query
        }
        "archive" {
            return Archive-Memory -Type $MemoryType -OlderThanDays $Days
        }
        "stats" {
            return Get-MemoryStats -Type $MemoryType
        }
        "init" {
            return Initialize-Memory
        }
        default {
            return @{ error = "Unknown operation: $Operation" }
        }
    }
}

# Main execution
if ($MyInvocation.InvocationName -ne ".") {
    Invoke-MemoryOperation | ConvertTo-Json -Depth 5
}
