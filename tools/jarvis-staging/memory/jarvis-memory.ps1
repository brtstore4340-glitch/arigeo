# jarvis-memory.ps1 - Memory Module (Local JSONL Memory, History, Monthly Summaries)

param(
    [string]$Action = "log",  # log, query, list-history, summarize, export
    [string]$Category = "command",  # command, interaction, learning, event
    [hashtable]$Data = @{},
    [datetime]$StartDate = (Get-Date).AddDays(-30),
    [datetime]$EndDate = (Get-Date),
    [switch]$ExportCSV = $false
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$MemoryConfig = @{
    MemoryDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory"
    CommandHistoryFile = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory\command-history.jsonl"
    InteractionLogFile = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory\interaction-log.jsonl"
    LearningFile = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory\learnings.jsonl"
    SummaryDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory\summaries"
    MaxMemorySize = 100MB
}

# Create directories
@($MemoryConfig.MemoryDir, $MemoryConfig.SummaryDir) | ForEach-Object {
    if (-not (Test-Path $_)) {
        New-Item -ItemType Directory -Path $_ -Force | Out-Null
    }
}

# ============================================================================
# 1. MEMORY LOGGING
# ============================================================================

function Write-MemoryEntry {
    param(
        [string]$Category,
        [hashtable]$Data
    )

    $entry = @{
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
        category = $Category
        data = $Data
        version = "1"
    }

    $jsonEntry = $entry | ConvertTo-Json -Compress

    # Determine which file to write to
    $targetFile = switch ($Category) {
        "command" { $MemoryConfig.CommandHistoryFile }
        "interaction" { $MemoryConfig.InteractionLogFile }
        "learning" { $MemoryConfig.LearningFile }
        default { $MemoryConfig.CommandHistoryFile }
    }

    # Write to JSONL file
    Add-Content -Path $targetFile -Value $jsonEntry

    # Check memory size and rotate if needed
    if ((Get-Item $targetFile).Length -gt $MemoryConfig.MaxMemorySize) {
        Rotate-MemoryFile -FilePath $targetFile
    }

    return @{
        success = $true
        entry_id = $entry.timestamp
        category = $Category
    }
}

function Rotate-MemoryFile {
    param([string]$FilePath)

    # Archive old file with month suffix
    $month = Get-Date -Format "yyyy-MM"
    $archivePath = "$($FilePath -replace '\.jsonl$', '')-$month.jsonl"

    if (-not (Test-Path $archivePath)) {
        Copy-Item -Path $FilePath -Destination $archivePath
    }

    # Clear current file
    Clear-Content -Path $FilePath -Force

    return @{
        success = $true
        archived = $archivePath
    }
}

# ============================================================================
# 2. MEMORY QUERYING
# ============================================================================

function Query-Memory {
    param(
        [string]$Category,
        [datetime]$StartDate,
        [datetime]$EndDate,
        [string]$FilterKey = "",
        [string]$FilterValue = ""
    )

    $targetFile = switch ($Category) {
        "command" { $MemoryConfig.CommandHistoryFile }
        "interaction" { $MemoryConfig.InteractionLogFile }
        "learning" { $MemoryConfig.LearningFile }
        default { $MemoryConfig.CommandHistoryFile }
    }

    if (-not (Test-Path $targetFile)) {
        return @{ results = @() }
    }

    $results = @()
    Get-Content $targetFile | ForEach-Object {
        $entry = $_ | ConvertFrom-Json
        $entryDate = [datetime]::Parse($entry.timestamp)

        # Date filter
        if ($entryDate -ge $StartDate -and $entryDate -le $EndDate) {
            # Optional value filter
            if ($FilterKey) {
                if ($entry.data.PSObject.Properties[$FilterKey].Value -eq $FilterValue) {
                    $results += $entry
                }
            } else {
                $results += $entry
            }
        }
    }

    return @{
        results = $results
        count = $results.Count
        category = $Category
        date_range = @{
            start = $StartDate.ToString("yyyy-MM-dd")
            end = $EndDate.ToString("yyyy-MM-dd")
        }
    }
}

# ============================================================================
# 3. COMMAND HISTORY
# ============================================================================

function Get-CommandHistory {
    param(
        [int]$Limit = 50,
        [string]$FilterIntent = ""
    )

    if (-not (Test-Path $MemoryConfig.CommandHistoryFile)) {
        return @{ history = @() }
    }

    $commands = @()
    Get-Content $MemoryConfig.CommandHistoryFile | ForEach-Object {
        $entry = $_ | ConvertFrom-Json
        if ($FilterIntent -and $entry.data.intent -ne $FilterIntent) {
            return  # Skip
        }
        $commands += $entry
    }

    # Return last N items
    $commands = $commands | Sort-Object timestamp -Descending | Select-Object -First $Limit

    return @{
        history = $commands
        count = $commands.Count
        limit = $Limit
    }
}

function Add-CommandToHistory {
    param(
        [string]$Intent,
        [string]$Input,
        [string]$Result
    )

    $historyEntry = @{
        intent = $Intent
        input = $Input
        result = $Result
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
    }

    return Write-MemoryEntry -Category "command" -Data $historyEntry
}

# ============================================================================
# 4. MONTHLY SUMMARY
# ============================================================================

function Generate-MonthlySummary {
    param([datetime]$Month = (Get-Date))

    $monthStart = $Month.Date
    $monthEnd = $monthStart.AddMonths(1).AddSeconds(-1)

    # Query all categories for this month
    $commandStats = Query-Memory -Category "command" -StartDate $monthStart -EndDate $monthEnd
    $interactionStats = Query-Memory -Category "interaction" -StartDate $monthStart -EndDate $monthEnd

    # Generate statistics
    $summary = @{
        month = $Month.ToString("yyyy-MM")
        generated_at = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
        statistics = @{
            total_commands = $commandStats.results.Count
            total_interactions = $interactionStats.results.Count
        }
        top_commands = @()
    }

    # Find top intents
    $intentFreq = @{}
    $commandStats.results | ForEach-Object {
        $intent = $_.data.intent
        if (-not $intentFreq[$intent]) {
            $intentFreq[$intent] = 0
        }
        $intentFreq[$intent]++
    }

    $summary.top_commands = $intentFreq.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 5

    # Save summary
    $summaryPath = Join-Path $MemoryConfig.SummaryDir "summary-$($Month.ToString('yyyy-MM')).json"
    $summary | ConvertTo-Json | Set-Content -Path $summaryPath

    return @{
        success = $true
        summary_path = $summaryPath
        summary = $summary
    }
}

function Get-MonthlySummaries {
    param([int]$Months = 12)

    $summaries = @()
    for ($i = 0; $i -lt $Months; $i++) {
        $month = (Get-Date).AddMonths(-$i)
        $summaryPath = Join-Path $MemoryConfig.SummaryDir "summary-$($month.ToString('yyyy-MM')).json"

        if (Test-Path $summaryPath) {
            $summary = Get-Content $summaryPath | ConvertFrom-Json
            $summaries += $summary
        }
    }

    return @{
        summaries = $summaries
        count = $summaries.Count
    }
}

# ============================================================================
# 5. MEMORY EXPORT
# ============================================================================

function Export-Memory {
    param(
        [string]$Category,
        [string]$Format = "json",  # json, csv
        [datetime]$StartDate = (Get-Date).AddDays(-30),
        [datetime]$EndDate = (Get-Date)
    )

    # Query memory
    $memoryData = Query-Memory -Category $Category -StartDate $StartDate -EndDate $EndDate

    # Generate export path
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $exportPath = Join-Path $MemoryConfig.MemoryDir "export-$Category-$timestamp.$Format"

    switch ($Format.ToLower()) {
        "json" {
            $memoryData | ConvertTo-Json -Depth 3 | Set-Content -Path $exportPath
        }
        "csv" {
            $memoryData.results | ConvertTo-Csv -NoTypeInformation | Set-Content -Path $exportPath
        }
        default {
            return @{ error = "Unknown format: $Format" }
        }
    }

    return @{
        success = $true
        export_path = $exportPath
        records = $memoryData.count
        format = $Format
    }
}

# ============================================================================
# 6. MEMORY CLEANUP
# ============================================================================

function Cleanup-OldMemory {
    param([int]$DaysToKeep = 90)

    $cutoffDate = (Get-Date).AddDays(-$DaysToKeep)
    $files = @(
        $MemoryConfig.CommandHistoryFile,
        $MemoryConfig.InteractionLogFile,
        $MemoryConfig.LearningFile
    )

    $removedCount = 0
    foreach ($file in $files) {
        if (-not (Test-Path $file)) { continue }

        $tempFile = "$file.tmp"
        $keptEntries = @()

        Get-Content $file | ForEach-Object {
            $entry = $_ | ConvertFrom-Json
            $entryDate = [datetime]::Parse($entry.timestamp)
            if ($entryDate -gt $cutoffDate) {
                $keptEntries += $_
            } else {
                $removedCount++
            }
        }

        # Write cleaned file
        $keptEntries | Set-Content -Path $tempFile
        Move-Item -Path $tempFile -Destination $file -Force
    }

    return @{
        success = $true
        entries_removed = $removedCount
        keep_days = $DaysToKeep
    }
}

# ============================================================================
# 7. MAIN ROUTING
# ============================================================================

function Main {
    switch ($Action.ToLower()) {
        "log" {
            return Write-MemoryEntry -Category $Category -Data $Data
        }
        "query" {
            return Query-Memory -Category $Category -StartDate $StartDate -EndDate $EndDate
        }
        "history" {
            return Get-CommandHistory -Limit 50
        }
        "summarize" {
            return Generate-MonthlySummary
        }
        "summaries" {
            return Get-MonthlySummaries
        }
        "export" {
            $format = if ($ExportCSV) { "csv" } else { "json" }
            return Export-Memory -Category $Category -Format $format
        }
        "cleanup" {
            return Cleanup-OldMemory -DaysToKeep 90
        }
        default {
            return @{ error = "Unknown action: $Action" }
        }
    }
}

# Execute if called directly
if ($MyInvocation.InvocationName -ne ".") {
    Main
}
