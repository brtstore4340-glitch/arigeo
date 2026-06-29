# ram-memory-select.ps1 - RAM Memory Selector
# Layer 2: Retrieve only relevant context for current task
# Philosophy: Never dump full memory, fetch only what's needed

param(
    [string]$TaskType = "unknown",
    [string]$ProjectContext = "",
    [string]$UserQuery = "",
    [int]$TokenBudget = 2000,
    [switch]$Verbose = $true
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$MemoryConfig = @{
    Version = "1.0"
    Philosophy = "Relevant context only, never full dump"
    MemoryDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory"
    LogsDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\logs"

    # Memory retrieval strategy
    MaxContextTokens = 2000
    MaxChunks = 5
    ChunkSize = 400
    RecencyWeight = 0.3
    RelevanceWeight = 0.7
}

# Memory categories & their storage locations
$MemoryCategories = @{
    project = @{
        path = "learnings"
        patterns = @("salary", "pharmacy", "oos", "mission-control")
        relevance_boost = 1.5
        ttl_days = 30
    }
    user = @{
        path = "learnings"
        patterns = @("khun-ram", "profile", "preference", "rule")
        relevance_boost = 2.0
        ttl_days = 90
    }
    episodic = @{
        path = "logs"
        patterns = @("last", "error", "backup", "proof")
        relevance_boost = 1.8
        ttl_days = 7
    }
    skill = @{
        path = "learnings"
        patterns = @("skill", "capability", "tool", "executor")
        relevance_boost = 1.2
        ttl_days = 60
    }
    wisdom = @{
        path = "learnings"
        patterns = @("soul-brews", "rtk", "learning", "wisdom", "philosophy")
        relevance_boost = 0.8
        ttl_days = 90
    }
    learning = @{
        path = "learnings"
        patterns = @("pattern", "insight", "synthesis", "discovery")
        relevance_boost = 0.9
        ttl_days = 60
    }
}

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    if ($Verbose) {
        $color = switch ($Level) {
            "INFO" { "Cyan" }
            "SUCCESS" { "Green" }
            "WARNING" { "Yellow" }
            "ERROR" { "Red" }
            default { "Gray" }
        }
        Write-Host "[$Level] $Message" -ForegroundColor $color
    }
}

function Get-RelevanceScore {
    param([string]$Content, [string]$Query, [float]$RecencyScore)

    $relevance = 0

    # Keyword matching
    $keywords = $Query.ToLower().Split(" ") | Where-Object { $_.Length -gt 3 }
    foreach ($keyword in $keywords) {
        if ($Content.ToLower().Contains($keyword)) {
            $relevance += 0.3
        }
    }

    # Phrase matching (higher weight)
    if ($Content.ToLower().Contains($Query.ToLower())) {
        $relevance += 0.5
    }

    # Combine with recency (Tham's rule: patterns matter)
    $finalScore = ($relevance * $MemoryConfig.RelevanceWeight) + ($RecencyScore * $MemoryConfig.RecencyWeight)

    return [math]::Min($finalScore, 1.0)
}

function Get-RecencyScore {
    param([datetime]$EntryTime, [int]$DaysOld)

    # Decay function: newer = higher score, older = lower
    # After 30 days = 0.5 score, after 60 days = 0.25
    $halfLife = 30
    $decayFactor = [math]::Pow(0.5, $DaysOld / $halfLife)
    return $decayFactor
}

function Find-MemoryEntries {
    param([string]$Query, [string]$Category, [int]$MaxResults = 10)

    Write-Log "🔍 Searching memory category: $Category" "INFO"

    $results = @()
    $categoryConfig = $MemoryCategories[$Category]
    if (-not $categoryConfig) {
        Write-Log "⚠️  Category not found: $Category" "WARNING"
        return @()
    }

    $searchPath = Join-Path $MemoryConfig.MemoryDir $categoryConfig.path
    if (-not (Test-Path $searchPath)) {
        Write-Log "⚠️  Memory path not found: $searchPath" "WARNING"
        return @()
    }

    # Find JSONL files in category
    $files = Get-ChildItem -Path $searchPath -Filter "*.jsonl" -ErrorAction SilentlyContinue
    Write-Log "  Found $($files.Count) memory files" "INFO"

    foreach ($file in $files) {
        try {
            $entries = Get-Content -Path $file.FullName -ErrorAction SilentlyContinue | `
                ForEach-Object { $_ | ConvertFrom-Json -ErrorAction SilentlyContinue } | `
                Where-Object { $_ -ne $null }

            foreach ($entry in $entries) {
                # Check TTL
                if ($entry.timestamp) {
                    $entryDate = [datetime]::Parse($entry.timestamp)
                    $daysOld = [math]::Ceiling(((Get-Date) - $entryDate).TotalDays)

                    if ($daysOld -gt $categoryConfig.ttl_days) {
                        continue
                    }

                    $recencyScore = Get-RecencyScore -EntryTime $entryDate -DaysOld $daysOld
                } else {
                    $recencyScore = 0.5
                }

                # Extract content for relevance scoring
                $contentToScore = @(
                    $entry.title,
                    $entry.content_preview,
                    $entry.tags -join " ",
                    $entry.file_name
                ) -join " "

                $relevanceScore = Get-RelevanceScore -Content $contentToScore -Query $Query -RecencyScore $recencyScore

                if ($relevanceScore -gt 0.1) {
                    $results += @{
                        entry = $entry
                        relevance = $relevanceScore
                        recency = $recencyScore
                        daysOld = $daysOld
                        category = $Category
                    }
                }
            }
        } catch {
            Write-Log "⚠️  Error reading file $($file.Name): $_" "WARNING"
        }
    }

    # Sort by relevance descending
    $results = $results | Sort-Object -Property @{Expression={$_.relevance}; Descending=$true} | `
        Select-Object -First $MaxResults

    Write-Log "  Found $($results.Count) relevant entries" "SUCCESS"
    return $results
}

function Get-LastActionMemory {
    Write-Log "📋 Retrieving last action..." "INFO"

    $logsDir = $MemoryConfig.LogsDir
    if (-not (Test-Path $logsDir)) {
        return $null
    }

    # Get last proof log
    $proofLogs = Get-ChildItem -Path $logsDir -Filter "ram-*" -ErrorAction SilentlyContinue | `
        Sort-Object LastWriteTime -Descending | Select-Object -First 5

    if (-not $proofLogs) {
        return $null
    }

    # Read last entry
    try {
        $lastEntry = Get-Content -Path $proofLogs[0].FullName | `
            ConvertFrom-Json -ErrorAction SilentlyContinue | Select-Object -Last 1

        return $lastEntry
    } catch {
        return $null
    }
}

function Build-MemoryContext {
    param([array]$RelevantEntries, [object]$LastAction, [int]$TokenBudget)

    Write-Log "🧠 Building memory context..." "INFO"

    $context = @{
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
        token_budget = $TokenBudget
        entries_included = $RelevantEntries.Count
        last_action = $LastAction
        chunks = @()
        total_tokens_used = 0
    }

    # Add last action context
    if ($LastAction) {
        $lastActionJson = $LastAction | ConvertTo-Json -Compress
        $tokens = [math]::Ceiling($lastActionJson.Length / 4)

        if ($context.total_tokens_used + $tokens -lt $TokenBudget) {
            $context.chunks += @{
                type = "last_action"
                content = $LastAction
                tokens = $tokens
                timestamp = $LastAction.timestamp
            }
            $context.total_tokens_used += $tokens
        }
    }

    # Add relevant memory entries
    foreach ($result in $RelevantEntries) {
        $entry = $result.entry
        $contentToInclude = $entry.content_preview

        # Truncate if needed
        if ($contentToInclude.Length -gt $MemoryConfig.ChunkSize) {
            $contentToInclude = $contentToInclude.Substring(0, $MemoryConfig.ChunkSize) + "..."
        }

        $tokens = [math]::Ceiling($contentToInclude.Length / 4)

        # Check token budget
        if ($context.total_tokens_used + $tokens -gt $TokenBudget) {
            Write-Log "⚠️  Token budget reached, stopping retrieval" "WARNING"
            break
        }

        $context.chunks += @{
            type = "memory"
            category = $result.category
            title = $entry.title
            content = $contentToInclude
            relevance = [math]::Round($result.relevance, 2)
            recency = [math]::Round($result.recency, 2)
            daysOld = $result.daysOld
            tokens = $tokens
            tags = $entry.tags
        }

        $context.total_tokens_used += $tokens
    }

    Write-Log "✓ Context built: $($context.chunks.Count) chunks, $($context.total_tokens_used)/$TokenBudget tokens" "SUCCESS"

    return $context
}

# ============================================================================
# MAIN SELECTOR
# ============================================================================

function Invoke-MemorySelector {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Magenta
    Write-Host "║  RAM MEMORY SELECTOR - Layer 2             ║" -ForegroundColor Magenta
    Write-Host "║  Fetch only relevant context              ║" -ForegroundColor Magenta
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Magenta
    Write-Host ""

    Write-Log "Task: $TaskType | Project: $ProjectContext | Budget: $TokenBudget tokens" "INFO"
    Write-Host ""

    # Build search query
    $searchQuery = @($ProjectContext, $UserQuery) -join " "
    if (-not $searchQuery.Trim()) {
        $searchQuery = $TaskType
    }

    # Retrieve relevant entries by priority
    $allResults = @()

    # 1. Project-specific memory (highest priority)
    if ($ProjectContext) {
        Write-Log "Priority 1: Project-specific memory" "INFO"
        $projectResults = Find-MemoryEntries -Query $searchQuery -Category "project" -MaxResults 3
        $allResults += $projectResults
    }

    # 2. User/episodic memory
    Write-Log "Priority 2: User & recent actions" "INFO"
    $userResults = Find-MemoryEntries -Query $searchQuery -Category "user" -MaxResults 2
    $episodicResults = Find-MemoryEntries -Query $searchQuery -Category "episodic" -MaxResults 2
    $allResults += $userResults + $episodicResults

    # 3. Task-relevant skill & learning memory
    Write-Log "Priority 3: Skills & learnings" "INFO"
    $skillResults = Find-MemoryEntries -Query $TaskType -Category "skill" -MaxResults 2
    $learningResults = Find-MemoryEntries -Query $TaskType -Category "learning" -MaxResults 2
    $allResults += $skillResults + $learningResults

    # 4. Wisdom (if needed for context)
    if ($TaskType -match "architecture|design|planning|philosophy") {
        Write-Log "Priority 4: Wisdom & philosophy" "INFO"
        $wisdomResults = Find-MemoryEntries -Query $searchQuery -Category "wisdom" -MaxResults 2
        $allResults += $wisdomResults
    }

    Write-Host ""

    # Sort all results by relevance
    $allResults = $allResults | Sort-Object -Property @{Expression={$_.relevance}; Descending=$true}

    # Get last action
    $lastAction = Get-LastActionMemory

    # Build final context
    $memoryContext = Build-MemoryContext -RelevantEntries $allResults -LastAction $lastAction -TokenBudget $TokenBudget

    # Display summary
    Write-Host "📊 MEMORY CONTEXT SUMMARY" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Total chunks:     $($memoryContext.chunks.Count)"
    Write-Host "  Tokens used:      $($memoryContext.total_tokens_used)/$TokenBudget"
    Write-Host "  Token remaining:  $($TokenBudget - $memoryContext.total_tokens_used)"
    Write-Host ""

    foreach ($chunk in $memoryContext.chunks) {
        if ($chunk.type -eq "last_action") {
            Write-Host "  📌 LAST ACTION:" -ForegroundColor Yellow
            Write-Host "     Intent: $($chunk.content.intent)"
            Write-Host "     Status: $($chunk.content.status)"
        } else {
            Write-Host "  📚 $($chunk.category.ToUpper()): $($chunk.title)" -ForegroundColor Green
            Write-Host "     Relevance: $($chunk.relevance) | Recency: $($chunk.recency)"
            Write-Host "     Content: $($chunk.content.Substring(0, [Math]::Min(60, $chunk.content.Length)))..."
        }
    }

    Write-Host ""

    return $memoryContext
}

# ============================================================================
# MAIN ENTRY
# ============================================================================

if ($MyInvocation.InvocationName -ne ".") {
    $output = Invoke-MemorySelector

    # Return as JSON for piping
    $output | ConvertTo-Json -Depth 10 | Write-Output
}
