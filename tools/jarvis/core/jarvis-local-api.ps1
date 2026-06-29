# jarvis-local-api.ps1 - Local LLM API support (Ollama, vLLM, etc)
# Auto-detect and use locally-running LLM models

param(
    [string]$LocalEndpoint = "http://localhost:20128/v1",
    [string]$UserInput = "",
    [string]$SelectedModel = $null,
    [switch]$ListModels = $false
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$LocalConfig = @{
    Endpoint = $LocalEndpoint
    DefaultModel = "auto"  # Auto-select best available
    Timeout = 30
    SystemPrompt = @"
You are Jarvis, a local Windows assistant. Parse user commands and extract:
1. action (what to do: open, screenshot, search, send, list, help, status)
2. target (app name, query, recipient, or path)
3. parameters (additional details)
4. confidence (0.0-1.0 how sure you are)

Respond ONLY in this JSON format:
{
  "action": "string",
  "target": "string",
  "parameters": {"key": "value"},
  "confidence": 0.85,
  "reasoning": "brief explanation"
}

Support natural language. Be precise with action names.
"@
}

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

function Test-LocalEndpoint {
    try {
        $response = Invoke-WebRequest -Uri "$($LocalConfig.Endpoint)/models" `
            -Method GET `
            -TimeoutSec 5 `
            -ErrorAction SilentlyContinue

        if ($response.StatusCode -eq 200) {
            return $true
        }
    } catch {
        return $false
    }
    return $false
}

function Get-AvailableModels {
    try {
        $response = Invoke-RestMethod -Uri "$($LocalConfig.Endpoint)/models" `
            -Method GET `
            -TimeoutSec 5

        $models = @()
        if ($response.data) {
            foreach ($model in $response.data) {
                $models += @{
                    id = $model.id
                    name = $model.id
                    owned_by = $model.owned_by
                }
            }
        }

        return $models
    } catch {
        return @()
    }
}

function Select-BestModel {
    param([array]$Models)

    if (-not $Models -or $Models.Count -eq 0) {
        return $null
    }

    # Preference order: prefer larger, more capable models
    $preferences = @(
        "neural", "mistral", "llama", "dolphin", "openchat", "neural-chat",
        "orca", "wizard", "hermes", "nous", "solar", "zephyr"
    )

    foreach ($pref in $preferences) {
        $match = $Models | Where-Object { $_.id -like "*$pref*" } | Select-Object -First 1
        if ($match) { return $match.id }
    }

    # Fallback: return first model
    return $Models[0].id
}

function Call-LocalLLM {
    param(
        [string]$Model,
        [string]$Input
    )

    if (-not $Model) {
        return @{
            error = "No model selected"
            provider = "local"
        }
    }

    $body = @{
        model = $Model
        messages = @(
            @{
                role = "system"
                content = $LocalConfig.SystemPrompt
            }
            @{
                role = "user"
                content = $Input
            }
        )
        temperature = 0.7
        max_tokens = 500
    } | ConvertTo-Json -Depth 10

    try {
        $response = Invoke-RestMethod -Uri "$($LocalConfig.Endpoint)/chat/completions" `
            -Method POST `
            -Headers @{ "Content-Type" = "application/json" } `
            -Body $body `
            -TimeoutSec $LocalConfig.Timeout

        if ($response.choices -and $response.choices.Count -gt 0) {
            $content = $response.choices[0].message.content.Trim()

            # Parse JSON response
            try {
                $parsed = $content | ConvertFrom-Json
                return @{
                    success = $true
                    provider = "local"
                    model = $Model
                    action = $parsed.action
                    target = $parsed.target
                    parameters = $parsed.parameters
                    confidence = $parsed.confidence
                    reasoning = $parsed.reasoning
                }
            } catch {
                return @{
                    error = "Failed to parse response: $content"
                    provider = "local"
                    model = $Model
                }
            }
        }
    } catch {
        return @{
            error = $_.Exception.Message
            provider = "local"
            model = $Model
            hint = "Check local endpoint: $($LocalConfig.Endpoint)"
        }
    }
}

# ============================================================================
# MAIN OPERATIONS
# ============================================================================

function Invoke-LocalAPI {
    # Test endpoint
    if (-not (Test-LocalEndpoint)) {
        return @{
            error = "Local endpoint not reachable: $($LocalConfig.Endpoint)"
            hint = "Ensure local LLM server is running (Ollama, vLLM, etc)"
        }
    }

    # List models if requested
    if ($ListModels) {
        $models = Get-AvailableModels
        Write-Host "Available models at $($LocalConfig.Endpoint):" -ForegroundColor Cyan
        foreach ($model in $models) {
            Write-Host "  • $($model.id)"
        }
        return $models
    }

    # Get available models
    $models = Get-AvailableModels
    if (-not $models -or $models.Count -eq 0) {
        return @{
            error = "No models available at endpoint"
            hint = "Load models into your local LLM server first"
        }
    }

    # Select model
    $model = if ($SelectedModel) { $SelectedModel } else { Select-BestModel -Models $models }

    if (-not $model) {
        return @{
            error = "Could not select model"
            available = $models.id
        }
    }

    Write-Host "✓ Using model: $model" -ForegroundColor Green

    # Call local LLM
    return Call-LocalLLM -Model $model -Input $UserInput
}

# Main execution
if ($MyInvocation.InvocationName -ne ".") {
    Invoke-LocalAPI | ConvertTo-Json -Depth 5
}
