# jarvis-memory-wiki.ps1 - Knowledge base + cross-linking
# Self-documenting wiki that links related concepts

param(
    [string]$Operation = "build",  # build, search, link, update
    [string]$Query = "",
    [string]$Title = "",
    [object]$Content = $null,
    [array]$Tags = @(),
    [bool]$Verbose = $false
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$WikiConfig = @{
    WikiDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory\wiki"
    CoreScript = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis-staging\memory\jarvis-memory-core.ps1"
}

# ============================================================================
# WIKI FUNCTIONS
# ============================================================================

function Build-CommandsWiki {
    $commands = @(
        @{
            title = "Open Application"
            category = "actions"
            description = "Open a Windows application or URL"
            examples = @("open chrome", "open notepad", "open https://google.com")
            risk_level = "medium"
            related = @("search", "browser")
        }
        @{
            title = "Take Screenshot"
            category = "actions"
            description = "Capture current screen and save"
            examples = @("take a screenshot", "screenshot", "capture screen")
            risk_level = "low"
            related = @("save", "file")
        }
        @{
            title = "Search"
            category = "actions"
            description = "Search the web for information"
            examples = @("search for thai language", "search google", "find information")
            risk_level = "low"
            related = @("open", "browser")
        }
        @{
            title = "Help"
            category = "system"
            description = "Show available commands and help"
            examples = @("help", "what can you do?", "show commands")
            risk_level = "low"
            related = @("status")
        }
        @{
            title = "Status"
            category = "system"
            description = "Show JARVIS status and configuration"
            examples = @("status", "show status", "system status")
            risk_level = "low"
            related = @("help")
        }
    )

    foreach ($cmd in $commands) {
        $entry = @{
            timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
            type = "command"
            title = $cmd.title
            category = $cmd.category
            description = $cmd.description
            examples = $cmd.examples
            risk_level = $cmd.risk_level
            related_topics = $cmd.related
            tags = @("command", $cmd.category)
        }

        & $WikiConfig.CoreScript -Operation write -MemoryType wiki -Data $entry -Filename "commands.jsonl" | Out-Null
    }
}

function Build-ProvidersWiki {
    $providers = @(
        @{
            name = "Claude"
            type = "ai-provider"
            strengths = @("Best Thai language support", "Context awareness", "Natural language understanding")
            weaknesses = @("Slower than Grok", "Higher cost")
            cost_per_request = 0.003
            speed = "medium"
            language_support = @("English", "Thai", "French", "Spanish", "Chinese")
        }
        @{
            name = "Grok"
            type = "ai-provider"
            strengths = @("Fastest response", "Cheapest", "Real-time knowledge")
            weaknesses = @("Less Thai support", "Smaller context")
            cost_per_request = 0.002
            speed = "fast"
            language_support = @("English", "Chinese")
        }
        @{
            name = "Gemini"
            type = "ai-provider"
            strengths = @("Free tier available", "Fast", "Good general purpose")
            weaknesses = @("Limited Thai support", "Smaller context window")
            cost_per_request = 0
            speed = "fast"
            language_support = @("English", "Chinese")
        }
    )

    foreach ($provider in $providers) {
        $entry = @{
            timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
            type = "provider"
            name = $provider.name
            category = $provider.type
            strengths = $provider.strengths
            weaknesses = $provider.weaknesses
            cost = $provider.cost_per_request
            speed = $provider.speed
            languages = $provider.language_support
            tags = @("provider", "ai", "intent-parser")
        }

        & $WikiConfig.CoreScript -Operation write -MemoryType wiki -Data $entry -Filename "providers.jsonl" | Out-Null
    }
}

function Build-RiskGateWiki {
    $riskLevels = @(
        @{
            level = "low"
            score = "0-30"
            actions = @("help", "status", "screenshot")
            behavior = "Auto-approved"
            examples = @("View help", "Take screenshot", "Check status")
        }
        @{
            level = "medium"
            score = "30-70"
            actions = @("open", "search", "send")
            behavior = "Requires approval in safe mode"
            examples = @("Open application", "Search web", "Send message")
        }
        @{
            level = "high"
            score = "70-100"
            actions = @("delete", "uninstall", "format", "reboot")
            behavior = "Always requires explicit approval"
            examples = @("Delete file", "Uninstall program", "Reboot system")
        }
    )

    foreach ($riskLevel in $riskLevels) {
        $entry = @{
            timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
            type = "risk-level"
            level = $riskLevel.level
            score_range = $riskLevel.score
            safe_actions = $riskLevel.actions
            approval_behavior = $riskLevel.behavior
            examples = $riskLevel.examples
            tags = @("risk", "security", "gate")
        }

        & $WikiConfig.CoreScript -Operation write -MemoryType wiki -Data $entry -Filename "risk_levels.jsonl" | Out-Null
    }
}

function Search-Wiki {
    param([string]$Query)

    $results = & $WikiConfig.CoreScript -Operation search -MemoryType wiki -Query $Query -Limit 20

    return $results
}

function Link-RelatedTopics {
    $wikiEntries = & $WikiConfig.CoreScript -Operation read -MemoryType wiki

    foreach ($entry in $wikiEntries) {
        if ($entry.related_topics) {
            $entry.links = $entry.related_topics
            & $WikiConfig.CoreScript -Operation write -MemoryType wiki -Data $entry | Out-Null
        }
    }
}

# ============================================================================
# MAIN WIKI OPERATIONS
# ============================================================================

function Invoke-WikiOperation {
    switch ($Operation) {
        "build" {
            if ($Verbose) { Write-Host "🗂️  Building wiki..." -ForegroundColor Cyan }
            Build-CommandsWiki
            Build-ProvidersWiki
            Build-RiskGateWiki
            Link-RelatedTopics
            if ($Verbose) { Write-Host "✓ Wiki built with 3 sections" -ForegroundColor Green }
            return @{ success = $true; sections = 3 }
        }
        "search" {
            return Search-Wiki -Query $Query
        }
        "link" {
            Link-RelatedTopics
            return @{ success = $true; linked = "all topics" }
        }
        default {
            return @{ error = "Unknown operation: $Operation" }
        }
    }
}

# Main execution
if ($MyInvocation.InvocationName -ne ".") {
    Invoke-WikiOperation | ConvertTo-Json -Depth 5
}
