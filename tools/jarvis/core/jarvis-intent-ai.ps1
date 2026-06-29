# jarvis-intent-ai.ps1 - AI-Powered Intent Parser (Claude/Grok)
# Replaces regex patterns with LLM understanding for Thai language support

param(
    [string]$UserInput,
    [string]$Provider = "claude",  # claude, grok, gemini
    [string]$Model = "claude-sonnet-4-6",  # or grok-3, gemini-2.0-flash
    [string]$APIKey = "",
    [switch]$DryRun = $false
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$AIConfig = @{
    Providers = @{
        claude = @{
            endpoint = "https://api.anthropic.com/v1/messages"
            model = "claude-sonnet-4-6"
            apiKeyEnv = "ANTHROPIC_API_KEY"
            maxTokens = 1024
        }
        grok = @{
            endpoint = "https://api.x.ai/v1/chat/completions"
            model = "grok-3"
            apiKeyEnv = "GROK_API_KEY"
            maxTokens = 1024
        }
        gemini = @{
            endpoint = "https://generativelanguage.googleapis.com/v1beta/models"
            model = "gemini-2.0-flash"
            apiKeyEnv = "GOOGLE_AI_KEY"
            maxTokens = 1024
        }
    }
    SystemPrompt = @"
You are Jarvis, a local Windows assistant. Parse user commands and extract:
1. action (what to do: open, screenshot, search, send, list, help, status)
2. target (app name, query, recipient, or path)
3. parameters (additional details like format, filter, etc.)
4. confidence (0.0-1.0 how sure you are)

Respond ONLY in this JSON format:
{
  "action": "string",
  "target": "string",
  "parameters": {"key": "value"},
  "confidence": 0.85,
  "reasoning": "brief explanation"
}

Support Thai language naturally. Prefer action precision over confidence.
"@
}

# ============================================================================
# API CALLS
# ============================================================================

function Call-OpenRouterAPI {
    param(
        [string]$UserInput,
        [string]$APIKey,
        [string]$Model = "anthropic/claude-3.5-sonnet"
    )

    if (-not $APIKey) {
        $APIKey = $env:OPENROUTER_API_KEY
    }

    if (-not $APIKey) {
        return @{
            error = "OPENROUTER_API_KEY not set. Set environment variable or pass -APIKey"
            provider = "openrouter"
        }
    }

    $headers = @{
        "Authorization" = "Bearer $APIKey"
        "HTTP-Referer" = "https://jarvis-local.ai"
        "X-Title" = "Jarvis Local"
        "Content-Type" = "application/json"
    }

    $body = @{
        model = $Model
        max_tokens = 1024
        system = $AIConfig.SystemPrompt
        messages = @(
            @{
                role = "user"
                content = $UserInput
            }
        )
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod `
            -Uri "https://openrouter.ai/api/v1/chat/completions" `
            -Method POST `
            -Headers $headers `
            -Body $body `
            -TimeoutSec 30

        $content = $response.choices[0].message.content
        $parsed = $content | ConvertFrom-Json

        return @{
            success = $true
            provider = "openrouter"
            model = $Model
            action = $parsed.action
            target = $parsed.target
            parameters = $parsed.parameters
            confidence = $parsed.confidence
            reasoning = $parsed.reasoning
        }
    }
    catch {
        return @{
            error = $_.Exception.Message
            provider = "openrouter"
            hint = "Check API key at https://openrouter.ai"
        }
    }
}

function Call-ClaudeAPI {
    param(
        [string]$UserInput,
        [string]$APIKey
    )

    if (-not $APIKey) {
        $APIKey = $env:ANTHROPIC_API_KEY
    }

    if (-not $APIKey) {
        return @{
            error = "ANTHROPIC_API_KEY not set. Set environment variable or pass -APIKey"
            provider = "claude"
        }
    }

    $headers = @{
        "x-api-key" = $APIKey
        "anthropic-version" = "2023-06-01"
        "content-type" = "application/json"
    }

    $body = @{
        model = "claude-sonnet-4-6"
        max_tokens = 1024
        system = $AIConfig.SystemPrompt
        messages = @(
            @{
                role = "user"
                content = $UserInput
            }
        )
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod `
            -Uri $AIConfig.Providers.claude.endpoint `
            -Method POST `
            -Headers $headers `
            -Body $body `
            -TimeoutSec 30

        $content = $response.content[0].text
        $parsed = $content | ConvertFrom-Json

        return @{
            success = $true
            provider = "claude"
            action = $parsed.action
            target = $parsed.target
            parameters = $parsed.parameters
            confidence = $parsed.confidence
            reasoning = $parsed.reasoning
        }
    }
    catch {
        return @{
            error = $_.Exception.Message
            provider = "claude"
            hint = "Check API key and rate limits"
        }
    }
}

function Call-GrokAPI {
    param(
        [string]$UserInput,
        [string]$APIKey
    )

    if (-not $APIKey) {
        $APIKey = $env:GROK_API_KEY
    }

    if (-not $APIKey) {
        return @{
            error = "GROK_API_KEY not set"
            provider = "grok"
        }
    }

    # Placeholder: Grok API format
    return @{
        error = "Grok API integration pending"
        provider = "grok"
        hint = "https://console.x.ai/"
    }
}

function Call-GeminiAPI {
    param(
        [string]$UserInput,
        [string]$APIKey
    )

    if (-not $APIKey) {
        $APIKey = $env:GOOGLE_AI_KEY
    }

    if (-not $APIKey) {
        return @{
            error = "GOOGLE_AI_KEY not set"
            provider = "gemini"
        }
    }

    # Placeholder: Gemini API format
    return @{
        error = "Gemini API integration pending"
        provider = "gemini"
        hint = "https://ai.google.dev/"
    }
}

# ============================================================================
# MAIN ROUTING
# ============================================================================

function Parse-IntentWithAI {
    param(
        [string]$UserInput,
        [string]$Provider = "openrouter",
        [string]$APIKey = "",
        [string]$Model = "anthropic/claude-3.5-sonnet"
    )

    if (-not $UserInput) {
        return @{
            error = "User input required"
        }
    }

    switch ($Provider.ToLower()) {
        "openrouter" {
            return Call-OpenRouterAPI -UserInput $UserInput -APIKey $APIKey -Model $Model
        }
        "claude" {
            return Call-ClaudeAPI -UserInput $UserInput -APIKey $APIKey
        }
        "grok" {
            return Call-GrokAPI -UserInput $UserInput -APIKey $APIKey
        }
        "gemini" {
            return Call-GeminiAPI -UserInput $UserInput -APIKey $APIKey
        }
        default {
            return @{
                error = "Unknown provider: $Provider"
                available = @("openrouter", "claude", "grok", "gemini")
            }
        }
    }
}

# ============================================================================
# MAIN
# ============================================================================

function Main {
    Write-Host "🧠 AI Intent Parser (Alpha)" -ForegroundColor Cyan
    Write-Host "Provider: $Provider | Model: $Model" -ForegroundColor Gray
    Write-Host ""

    $result = Parse-IntentWithAI -UserInput $UserInput -Provider $Provider -APIKey $APIKey

    if ($result.error) {
        Write-Host "❌ Error: $($result.error)" -ForegroundColor Red
        if ($result.hint) {
            Write-Host "   Hint: $($result.hint)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "✅ Intent Parsed:" -ForegroundColor Green
        Write-Host "   Action:     $($result.action)"
        Write-Host "   Target:     $($result.target)"
        Write-Host "   Confidence: $($result.confidence)"
        Write-Host "   Reasoning:  $($result.reasoning)"
        if ($result.parameters) {
            Write-Host "   Parameters: $($result.parameters | ConvertTo-Json -Compress)"
        }
    }

    return $result
}

if ($MyInvocation.InvocationName -ne ".") {
    Main
}
