# ram-provider-router.ps1 - RAM Model Provider Router
# Layer 4: Intelligent model selection based on task complexity & token budget
# Philosophy: Pick the right tool for the right job, never overpay

param(
    [string]$TaskType = "unknown",
    [int]$Complexity = 5,
    [string]$Content = "",
    [switch]$Verbose = $true
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$ProviderConfig = @{
    Version = "1.0"
    Philosophy = "Right tool, right job, right budget"
    LocalEndpoint = "http://localhost:20128/v1"
    OpenRouterEndpoint = "https://openrouter.ai/api/v1"
    ClaudeEndpoint = "https://api.anthropic.com/v1"

    # Token budgets (Tham's rule)
    TokenBudget = @{
        known_command = 0
        status_check = 200
        intent_parse = 500
        short_summary = 800
        debug_short = 2000
        script_gen = 4000
        architecture = 8000
        full_audit = 12000
    }

    # Provider availability check
    ProvidersHealthCheck = @{
        local = @{ endpoint = "http://localhost:20128/v1/models"; timeout = 3 }
        openrouter = @{ endpoint = "https://openrouter.ai/api/v1/models"; timeout = 5 }
        claude = @{ endpoint = "https://api.anthropic.com/v1/models"; timeout = 5 }
    }
}

# Model profiles by category
$ModelProfiles = @{
    cheap = @{
        description = "Fast intent parse, cheap, good quality"
        use_cases = @("intent_parse", "classify", "simple_summary", "text_extraction")
        max_tokens = 1000
        models = @(
            @{ name = "Qwen 2.5 1.5B"; provider = "local"; cost_per_1m = 0; latency_ms = 50 }
            @{ name = "openrouter/qwen/qwen-2.5-1.5b"; provider = "openrouter"; cost_per_1m = 0.2; latency_ms = 200 }
            @{ name = "claude-3-5-haiku-20241022"; provider = "claude"; cost_per_1m = 0.8; latency_ms = 300 }
        )
        priority = @("local", "openrouter", "claude")
    }

    balanced = @{
        description = "Good quality, reasonable speed, balanced cost"
        use_cases = @("conversation", "debugging", "review", "explanation")
        max_tokens = 4000
        models = @(
            @{ name = "Mistral 7B"; provider = "local"; cost_per_1m = 0; latency_ms = 150 }
            @{ name = "openrouter/mistralai/mistral-7b-instruct"; provider = "openrouter"; cost_per_1m = 0.14; latency_ms = 250 }
            @{ name = "claude-3-5-sonnet-20241022"; provider = "claude"; cost_per_1m = 3; latency_ms = 400 }
        )
        priority = @("local", "openrouter", "claude")
    }

    reasoning = @{
        description = "Deep reasoning, complex analysis, best quality"
        use_cases = @("architecture", "deep_analysis", "complex_debug", "planning")
        max_tokens = 12000
        models = @(
            @{ name = "openrouter/anthropic/claude-3-7-opus"; provider = "openrouter"; cost_per_1m = 15; latency_ms = 500 }
            @{ name = "claude-3-7-opus-20250219"; provider = "claude"; cost_per_1m = 15; latency_ms = 500 }
            @{ name = "openrouter/openai/gpt-4-turbo"; provider = "openrouter"; cost_per_1m = 10; latency_ms = 600 }
        )
        priority = @("claude", "openrouter")
    }

    coding = @{
        description = "Script generation, code review, debugging"
        use_cases = @("script_gen", "code_review", "debug_code", "refactor")
        max_tokens = 6000
        models = @(
            @{ name = "DeepSeek-Coder 7B"; provider = "local"; cost_per_1m = 0; latency_ms = 200 }
            @{ name = "openrouter/deepseek/deepseek-coder-7b"; provider = "openrouter"; cost_per_1m = 0.14; latency_ms = 300 }
            @{ name = "claude-3-5-sonnet-20241022"; provider = "claude"; cost_per_1m = 3; latency_ms = 400 }
        )
        priority = @("local", "openrouter", "claude")
    }

    local = @{
        description = "Offline only, no internet"
        use_cases = @("offline_work", "privacy_critical", "fast_turnaround")
        max_tokens = 2000
        models = @(
            @{ name = "Qwen 2.5 1.5B"; provider = "local"; cost_per_1m = 0; latency_ms = 50 }
            @{ name = "Mistral 7B"; provider = "local"; cost_per_1m = 0; latency_ms = 150 }
            @{ name = "DeepSeek-Coder 7B"; provider = "local"; cost_per_1m = 0; latency_ms = 200 }
        )
        priority = @("local")
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

function Test-ProviderHealth {
    param([string]$Provider)

    try {
        $config = $ProviderConfig.ProvidersHealthCheck[$Provider]
        if (-not $config) { return $false }

        $response = Invoke-WebRequest -Uri $config.endpoint `
            -Method GET `
            -TimeoutSec $config.timeout `
            -ErrorAction SilentlyContinue

        return $response.StatusCode -eq 200
    } catch {
        return $false
    }
}

function Get-TaskCategory {
    param([string]$TaskType, [int]$Complexity)

    Write-Log "📊 Analyzing task: $TaskType (complexity: $Complexity/10)" "INFO"

    # Route based on task type
    $category = switch -Regex ($TaskType.ToLower()) {
        "intent|parse|classify" { "cheap" }
        "conversation|chat|question" { if ($Complexity -gt 6) { "balanced" } else { "cheap" } }
        "debug|diagnose" { if ($Complexity -gt 7) { "reasoning" } else { "balanced" } }
        "script|code|generate" { "coding" }
        "architecture|design|planning" { "reasoning" }
        "analysis|research" { if ($Complexity -gt 8) { "reasoning" } else { "balanced" } }
        "offline|privacy" { "local" }
        default {
            # Use complexity as fallback
            if ($Complexity -le 3) { "cheap" }
            elseif ($Complexity -le 6) { "balanced" }
            elseif ($Complexity -le 8) { "coding" }
            else { "reasoning" }
        }
    }

    Write-Log "🎯 Category selected: $category" "SUCCESS"
    return $category
}

function Select-BestModel {
    param([string]$Category, [string]$PreferredProvider = $null)

    Write-Log "🔍 Finding best model for: $Category" "INFO"

    $profile = $ModelProfiles[$Category]
    if (-not $profile) {
        Write-Log "⚠️  Category not found, using 'balanced'" "WARNING"
        $profile = $ModelProfiles["balanced"]
    }

    $priority = $profile.priority

    # If preferred provider specified, try it first
    if ($PreferredProvider) {
        $priority = @($PreferredProvider) + ($priority | Where-Object { $_ -ne $PreferredProvider })
    }

    # Try providers in priority order
    foreach ($provider in $priority) {
        Write-Log "  Checking provider: $provider..." "INFO"

        if (Test-ProviderHealth -Provider $provider) {
            $models = $profile.models | Where-Object { $_.provider -eq $provider }
            if ($models) {
                $selected = $models[0]
                Write-Log "  ✓ Selected: $($selected.name) ($provider)" "SUCCESS"
                return @{
                    model = $selected.name
                    provider = $selected.provider
                    cost_per_1m = $selected.cost_per_1m
                    latency_ms = $selected.latency_ms
                    max_tokens = $profile.max_tokens
                    category = $Category
                }
            }
        }
    }

    # Fallback
    Write-Log "⚠️  All providers unavailable, using offline fallback" "WARNING"
    $offline = $profile.models | Where-Object { $_.provider -eq "local" } | Select-Object -First 1
    return @{
        model = $offline.name
        provider = "local"
        cost_per_1m = 0
        latency_ms = $offline.latency_ms
        max_tokens = $profile.max_tokens
        category = $Category
        fallback = $true
    }
}

function Get-EstimatedTokens {
    param([string]$Content)

    # Rough estimate: 1 token ≈ 4 characters
    return [math]::Ceiling($Content.Length / 4)
}

function Get-TokenBudgetWarning {
    param([int]$EstimatedTokens, [string]$TaskType)

    $budget = $ProviderConfig.TokenBudget[$TaskType]
    if (-not $budget) {
        $budget = $ProviderConfig.TokenBudget["short_summary"]
    }

    if ($EstimatedTokens -gt $budget) {
        Write-Log "⚠️  Token warning: estimated $EstimatedTokens > budget $budget" "WARNING"
        return @{
            warning = $true
            estimated = $EstimatedTokens
            budget = $budget
            over = $EstimatedTokens - $budget
        }
    }

    return @{ warning = $false }
}

function Build-PromptCache {
    param([string]$SystemPrompt, [string]$Context)

    # Create stable prefix for caching
    # Content that doesn't change between calls
    $stablePrefix = @{
        system_prompt = $SystemPrompt
        ram_identity = "RAM (ราม) oracle assistant for khun-ram"
        tham_identity = "Tham orchestrator"
        core_rules = @(
            "Nothing is Deleted",
            "Patterns Over Intentions",
            "External Brain",
            "Curiosity Creates",
            "Form and Formless",
            "Transparency"
        )
        output_contract = @(
            "timestamp",
            "intent",
            "executor",
            "risk",
            "status",
            "result",
            "error_log",
            "proof_path"
        )
    }

    return @{
        cache_prefix = $stablePrefix
        dynamic_context = $Context
        cache_ttl = 3600  # 1 hour
    }
}

# ============================================================================
# MAIN ROUTER
# ============================================================================

function Invoke-ProviderRouter {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Magenta
    Write-Host "║  RAM PROVIDER ROUTER - Layer 4             ║" -ForegroundColor Magenta
    Write-Host "║  Select best model for the task           ║" -ForegroundColor Magenta
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Magenta
    Write-Host ""

    # Analyze task
    $category = Get-TaskCategory -TaskType $TaskType -Complexity $Complexity

    # Select model
    $selection = Select-BestModel -Category $category

    # Estimate tokens
    $estimatedTokens = Get-EstimatedTokens -Content $Content
    $tokenWarning = Get-TokenBudgetWarning -EstimatedTokens $estimatedTokens -TaskType $TaskType

    # Build result
    $result = @{
        task_type = $TaskType
        complexity = $Complexity
        category = $category
        model = $selection.model
        provider = $selection.provider
        estimated_tokens = $estimatedTokens
        max_tokens = $selection.max_tokens
        cost_per_1m = $selection.cost_per_1m
        latency_ms = $selection.latency_ms
        token_budget = $ProviderConfig.TokenBudget[$TaskType]
        token_warning = $tokenWarning.warning
        cache_enabled = $true
        fallback = $selection.fallback -or $false
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
    }

    # Display result
    Write-Host "📋 ROUTING DECISION" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Task Type:        $($result.task_type)"
    Write-Host "  Complexity:       $($result.complexity)/10"
    Write-Host "  Category:         $($result.category)"
    Write-Host ""
    Write-Host "  Model:            $($result.model)" -ForegroundColor Yellow
    Write-Host "  Provider:         $($result.provider)" -ForegroundColor Green
    Write-Host "  Latency:          $($result.latency_ms)ms"
    Write-Host "  Cost/1M tokens:   \$$($result.cost_per_1m)"
    Write-Host ""
    Write-Host "  Token Budget:     $($result.token_budget)"
    Write-Host "  Estimated:        $($result.estimated_tokens)"
    Write-Host "  Max Allowed:      $($result.max_tokens)"

    if ($result.token_warning) {
        Write-Host "  ⚠️  WARNING:       Over budget by $($tokenWarning.over) tokens" -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "  Cache:            Enabled (1h TTL)" -ForegroundColor Green

    if ($result.fallback) {
        Write-Host "  Fallback:         Using offline" -ForegroundColor Yellow
    }

    Write-Host ""

    return $result
}

# ============================================================================
# MAIN ENTRY
# ============================================================================

if ($MyInvocation.InvocationName -ne ".") {
    $output = Invoke-ProviderRouter

    # Return as JSON for piping
    $output | ConvertTo-Json | Write-Output
}
