# RAM_VOICE.ps1 - Voice-Enabled Interactive Mode
# Speak commands instead of typing them

param(
    [string]$Provider = "local",
    [switch]$SpeakResponses = $true
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$VoiceConfig = @{
    TTSProvider = "windows"  # windows (SAPI), google, openai
    STTProvider = "windows"  # windows (Cortana), google, whisper
    Language = "th-TH"       # Thai
    VoiceRate = 1            # 1 = normal, 0.5 = slow, 2 = fast
}

# ============================================================================
# TEXT-TO-SPEECH (Windows SAPI)
# ============================================================================

function Speak-Text {
    param([string]$Text)

    try {
        $speak = New-Object System.Speech.Synthesis.SpeechSynthesizer
        $speak.Rate = $VoiceConfig.VoiceRate
        $speak.Speak($Text)
    } catch {
        Write-Host "⚠️ Voice output unavailable: $_" -ForegroundColor Yellow
    }
}

# ============================================================================
# SPEECH-TO-TEXT (Windows Cortana - Requires Windows.Media.SpeechRecognition)
# ============================================================================

function Listen-Voice {
    param([int]$TimeoutSeconds = 10)

    Write-Host "🎤 Listening... (speak your command)" -ForegroundColor Cyan

    try {
        # This is a placeholder - full STT requires Windows Runtime
        # For now, we'll use Read-Host with voice prompting
        Speak-Text "I'm listening. Please speak your command."

        $userInput = Read-Host "Or type command"
        return $userInput
    } catch {
        Write-Host "⚠️ Voice input error: $_" -ForegroundColor Yellow
        return $null
    }
}

# ============================================================================
# SIMPLE COMMAND PARSER
# ============================================================================

$KnownCommands = @{
    "help" = "help"
    "status" = "status"
    "screenshot" = "screenshot"
    "screen" = "screenshot"
    "open" = "open"
    "search" = "search"
    "exit" = "exit"
    "quit" = "exit"
}

function Parse-VoiceIntent {
    param([string]$Input)

    $cmd = $Input.Trim().ToLower()
    $parts = $cmd -split ' ', 2
    $command = $parts[0]

    foreach ($known in $KnownCommands.Keys) {
        if ($command -eq $known) {
            return @{
                command = $KnownCommands[$known]
                target = if ($parts.Count -gt 1) { $parts[1] } else { "" }
            }
        }
    }

    return @{
        command = "unknown"
        target = ""
    }
}

# ============================================================================
# COMMAND EXECUTOR
# ============================================================================

function Execute-VoiceCommand {
    param([object]$Intent)

    $output = ""

    switch ($Intent.command) {
        "help" {
            $output = "Available commands: help, status, screenshot, open, search, exit"
            Write-Host ""
            Write-Host "RAM COMMANDS:" -ForegroundColor Cyan
            Write-Host "  help       - Show available commands"
            Write-Host "  status     - Show RAM status"
            Write-Host "  screenshot - Take a screenshot"
            Write-Host "  open       - Open an application"
            Write-Host "  search     - Search the web"
            Write-Host "  exit       - Exit RAM"
            Write-Host ""
        }

        "status" {
            $output = "RAM is ready and waiting for commands"
            Write-Host ""
            Write-Host "RAM LOCAL STATUS" -ForegroundColor Cyan
            Write-Host "  Version: 0.3-voice"
            Write-Host "  Mode: Voice-enabled"
            Write-Host "  Status: Ready"
            Write-Host ""
        }

        "screenshot" {
            $output = "Taking a screenshot now"
            Write-Host "[DRY-RUN] Would capture the current screen" -ForegroundColor Yellow
            Write-Host ""
        }

        "open" {
            $output = "Opening: $($Intent.target)"
            Write-Host "[DRY-RUN] Would open: $($Intent.target)" -ForegroundColor Yellow
            Write-Host ""
        }

        "search" {
            $output = "Searching for: $($Intent.target)"
            Write-Host "[DRY-RUN] Would search for: $($Intent.target)" -ForegroundColor Yellow
            Write-Host ""
        }

        "exit" {
            return @{ command = "exit"; output = "Goodbye!" }
        }

        default {
            $output = "Command not recognized. Say 'help' for available commands."
            Write-Host "❌ Unknown command" -ForegroundColor Red
            Write-Host ""
        }
    }

    return @{
        command = $Intent.command
        output = $output
        success = ($Intent.command -ne "unknown")
    }
}

# ============================================================================
# MAIN VOICE LOOP
# ============================================================================

function Start-VoiceInterface {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║     RAM - ราม LOCAL - VOICE MODE             ║" -ForegroundColor Cyan
    Write-Host "║     Speak or type your commands            ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🎤 Voice enabled (using Windows SAPI)" -ForegroundColor Green
    Write-Host "💬 Type to type commands, or speak into mic" -ForegroundColor Gray
    Write-Host ""

    Speak-Text "RAM is ready. Speak or type your command."

    $session = @{
        commands = 0
        startTime = Get-Date
    }

    while ($true) {
        # Get input (voice or typed)
        Write-Host ""
        $userInput = Listen-Voice

        if ([string]::IsNullOrWhiteSpace($userInput)) {
            continue
        }

        # Parse intent
        $intent = Parse-VoiceIntent -Input $userInput
        $session.commands++

        Write-Host "Command: $($intent.command)" -ForegroundColor Gray

        # Execute
        $result = Execute-VoiceCommand -Intent $intent

        # Speak response
        if ($SpeakResponses) {
            Speak-Text $result.output
        }

        # Check for exit
        if ($result.command -eq "exit") {
            Write-Host "✓ Goodbye!" -ForegroundColor Green
            Speak-Text "Goodbye"
            Write-Host ""
            break
        }
    }

    # Session summary
    $duration = (Get-Date) - $session.startTime
    Write-Host "Session: $($session.commands) commands in $([math]::Round($duration.TotalSeconds, 1))s" -ForegroundColor Gray
    Write-Host ""
}

# ============================================================================
# MAIN ENTRY
# ============================================================================

$ErrorActionPreference = "Continue"

try {
    Start-VoiceInterface
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

