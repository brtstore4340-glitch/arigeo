# jarvis-chatgpt-connector.ps1 - ChatGPT History Connector
# Read and ingest ChatGPT conversation history into JARVIS memory

param(
    [string]$APIKey = $env:OPENAI_API_KEY,
    [string]$ConversationID = "",
    [int]$MaxConversations = 10,
    [switch]$IngestToMemory = $true,
    [string]$MemoryDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory"
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$ChatGPTConfig = @{
    APIEndpoint = "https://api.openai.com/v1"
    ConversationsEndpoint = "https://api.openai.com/v1/conversations"
    Model = "gpt-4"
    Timeout = 30
    MemoryDir = $MemoryDir
}

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

function Test-APIKey {
    param([string]$Key)

    if ([string]::IsNullOrWhiteSpace($Key)) {
        Write-Host "❌ ERROR: OPENAI_API_KEY not set" -ForegroundColor Red
        Write-Host ""
        Write-Host "To use this connector:" -ForegroundColor Yellow
        Write-Host "1. Get key from: https://platform.openai.com/api/keys"
        Write-Host "2. Set environment variable:"
        Write-Host "   `$env:OPENAI_API_KEY = 'sk-...'"
        Write-Host "3. Run: .\jarvis-chatgpt-connector.ps1"
        return $false
    }

    return $true
}

function Get-ChatGPTConversations {
    param([string]$APIKey)

    Write-Host "🔄 Fetching ChatGPT conversations..." -ForegroundColor Cyan

    try {
        $headers = @{
            "Authorization" = "Bearer $APIKey"
            "Content-Type" = "application/json"
        }

        $response = Invoke-RestMethod `
            -Uri "https://api.openai.com/v1/conversations" `
            -Method GET `
            -Headers $headers `
            -TimeoutSec $ChatGPTConfig.Timeout

        if ($response.data) {
            Write-Host "✓ Found $($response.data.Count) conversations" -ForegroundColor Green
            return $response.data
        } else {
            Write-Host "⚠️  No conversations found" -ForegroundColor Yellow
            return @()
        }

    } catch {
        Write-Host "❌ ERROR: Failed to fetch conversations: $_" -ForegroundColor Red
        return @()
    }
}

function Get-ChatGPTConversationMessages {
    param(
        [string]$APIKey,
        [string]$ConversationID
    )

    try {
        $headers = @{
            "Authorization" = "Bearer $APIKey"
            "Content-Type" = "application/json"
        }

        # Note: OpenAI API structure may vary - adjust endpoint as needed
        $response = Invoke-RestMethod `
            -Uri "https://api.openai.com/v1/conversations/$ConversationID" `
            -Method GET `
            -Headers $headers `
            -TimeoutSec $ChatGPTConfig.Timeout

        return $response

    } catch {
        Write-Host "⚠️  Could not fetch messages for $ConversationID : $_" -ForegroundColor Yellow
        return $null
    }
}

function Convert-ToMemoryEntry {
    param(
        [object]$Conversation,
        [string]$Content
    )

    return @{
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
        source = "chatgpt-connector"
        conversation_id = $Conversation.id
        conversation_title = $Conversation.title
        created_at = $Conversation.created_at
        updated_at = $Conversation.updated_at
        type = "imported-conversation"
        content_preview = $Content.Substring(0, [Math]::Min(300, $Content.Length))
        full_content = $Content
        tags = @("chatgpt", "imported", "external-knowledge")
    }
}

function Save-ToJarvisMemory {
    param(
        [array]$MemoryEntries,
        [string]$MemoryDir
    )

    if (-not (Test-Path "$MemoryDir/learnings")) {
        New-Item -ItemType Directory -Path "$MemoryDir/learnings" -Force | Out-Null
    }

    $outputFile = Join-Path "$MemoryDir/learnings" "chatgpt-imported-$(Get-Date -Format 'yyyyMMdd_HHmmss').jsonl"

    Write-Host ""
    Write-Host "💾 Saving to JARVIS memory..." -ForegroundColor Cyan

    foreach ($entry in $MemoryEntries) {
        $json = $entry | ConvertTo-Json -Compress
        Add-Content -Path $outputFile -Value $json -Force
    }

    Write-Host "✓ Saved $($MemoryEntries.Count) entries to: $outputFile" -ForegroundColor Green

    return $outputFile
}

# ============================================================================
# MAIN CONNECTOR
# ============================================================================

function Invoke-ChatGPTConnector {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  JARVIS ↔ ChatGPT CONNECTOR              ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""

    # Validate API key
    if (-not (Test-APIKey -Key $APIKey)) {
        return $false
    }

    Write-Host "✓ API Key detected" -ForegroundColor Green
    Write-Host ""

    # Fetch conversations
    $conversations = Get-ChatGPTConversations -APIKey $APIKey

    if ($conversations.Count -eq 0) {
        Write-Host "⚠️  No conversations to import" -ForegroundColor Yellow
        return $false
    }

    # Convert to memory entries
    $memoryEntries = @()

    foreach ($conv in $conversations | Select-Object -First $MaxConversations) {
        Write-Host "  Processing: $($conv.title)" -ForegroundColor Gray

        # Try to get messages (API structure may vary)
        $messages = Get-ChatGPTConversationMessages -APIKey $APIKey -ConversationID $conv.id

        if ($messages) {
            # Combine all messages into content
            $combinedContent = if ($messages.messages) {
                ($messages.messages | ForEach-Object { "$($_.role): $($_.content)" }) -join "`n`n"
            } else {
                $messages | ConvertTo-Json
            }

            $entry = Convert-ToMemoryEntry -Conversation $conv -Content $combinedContent
            $memoryEntries += $entry

            Write-Host "    ✓ $($entry.tags -join ', ')" -ForegroundColor Green
        }
    }

    Write-Host ""
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  IMPORT SUMMARY                           ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Conversations Found: $($conversations.Count)" -ForegroundColor Gray
    Write-Host "Conversations to Import: $([Math]::Min($MaxConversations, $conversations.Count))" -ForegroundColor Gray
    Write-Host "Memory Entries: $($memoryEntries.Count)" -ForegroundColor Gray
    Write-Host ""

    # Save to JARVIS memory
    if ($IngestToMemory -and $memoryEntries.Count -gt 0) {
        $savedFile = Save-ToJarvisMemory -MemoryEntries $memoryEntries -MemoryDir $MemoryDir

        Write-Host ""
        Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host "✓ ChatGPT conversations imported into JARVIS" -ForegroundColor Green
        Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "JARVIS now has access to:" -ForegroundColor Cyan
        Write-Host "  • $($memoryEntries.Count) ChatGPT conversations"
        Write-Host "  • Full conversation history"
        Write-Host "  • Insights from external knowledge"
        Write-Host ""
        Write-Host "Next time you use JARVIS:" -ForegroundColor Cyan
        Write-Host "  jarvis> help"
        Write-Host "  jarvis> status"
        Write-Host ""
        Write-Host "JARVIS will reference ChatGPT knowledge in:" -ForegroundColor Cyan
        Write-Host "  • Intent parsing (better understanding)"
        Write-Host "  • Risk evaluation (broader context)"
        Write-Host "  • Memory synthesis (pattern discovery)"
        Write-Host ""

        return $true
    } else {
        Write-Host "⚠️  No entries to save" -ForegroundColor Yellow
        return $false
    }
}

# ============================================================================
# MAIN ENTRY
# ============================================================================

$ErrorActionPreference = "Continue"

try {
    Invoke-ChatGPTConnector
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
