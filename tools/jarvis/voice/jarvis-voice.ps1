# jarvis-voice.ps1 - Voice I/O Module (STT, TTS, Local Thai Support)

param(
    [string]$Action = "tts",  # tts, stt, list-voices
    [string]$Text = "",
    [string]$Voice = "Microsoft Zira Desktop",
    [string]$OutputPath = "",
    [switch]$UseLocalTTS = $true,
    [string]$ExternalTTSProvider = "",  # google, grok, openai
    [string]$ExternalTTSKey = ""
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$VoiceConfig = @{
    DefaultVoice = "Microsoft Zira Desktop"
    LocalProvider = "Windows-SAPI"
    SupportedLanguages = @("en-US", "th-TH")
    Rate = 0  # -10 to 10
    Volume = 100  # 0 to 100
    OutputDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\voice-output"
}

# Create output directory if not exists
if (-not (Test-Path $VoiceConfig.OutputDir)) {
    New-Item -ItemType Directory -Path $VoiceConfig.OutputDir -Force | Out-Null
}

# ============================================================================
# 1. TEXT-TO-SPEECH (LOCAL - Windows SAPI)
# ============================================================================

function Invoke-LocalTTS {
    param(
        [string]$Text,
        [string]$Voice = "Microsoft Zira Desktop",
        [int]$Rate = 0,
        [int]$Volume = 100,
        [string]$OutputPath = ""
    )

    try {
        # Create SAPI object
        $speak = New-Object -ComObject SAPI.SpVoice

        # Set voice
        $voices = $speak.GetVoices()
        $selectedVoice = $voices | Where-Object { $_.GetDescription() -eq $Voice }

        if ($selectedVoice) {
            $speak.Voice = $selectedVoice
        }

        # Set rate and volume
        $speak.Rate = $Rate
        $speak.Volume = $Volume

        # If output path specified, save to WAV
        if ($OutputPath) {
            $stream = New-Object -ComObject SAPI.SpFileStream
            $stream.Open($OutputPath, 3, $true)  # SSFMCreateForWrite
            $speak.AudioOutputStream = $stream
            $speak.Speak($Text) | Out-Null
            $stream.Close()
            return @{
                success = $true
                output = "TTS saved to: $OutputPath"
                provider = "Windows-SAPI"
            }
        } else {
            # Speak directly
            $speak.Speak($Text) | Out-Null
            return @{
                success = $true
                output = "TTS spoken: $Text"
                provider = "Windows-SAPI"
            }
        }
    }
    catch {
        return @{
            success = $false
            error = $_.Exception.Message
            provider = "Windows-SAPI"
        }
    }
}

# ============================================================================
# 2. EXTERNAL TTS ADAPTERS (Placeholder)
# ============================================================================

function Invoke-GoogleTTS {
    param(
        [string]$Text,
        [string]$Language = "th",
        [string]$OutputPath = ""
    )

    # Placeholder: Would use Google Cloud TTS API
    return @{
        success = $false
        error = "Google TTS requires API key (not stored in source)"
        provider = "Google-TTS"
        hint = "Set GOOGLE_TTS_KEY environment variable"
    }
}

function Invoke-GrokTTS {
    param(
        [string]$Text,
        [string]$OutputPath = ""
    )

    # Placeholder: Would use Grok TTS (xAI)
    return @{
        success = $false
        error = "Grok TTS requires API key (not stored in source)"
        provider = "Grok-TTS"
        hint = "Set GROK_API_KEY environment variable"
    }
}

function Invoke-OpenAITTS {
    param(
        [string]$Text,
        [string]$Voice = "nova",
        [string]$OutputPath = ""
    )

    # Placeholder: Would use OpenAI TTS API
    return @{
        success = $false
        error = "OpenAI TTS requires API key (not stored in source)"
        provider = "OpenAI-TTS"
        hint = "Set OPENAI_API_KEY environment variable"
    }
}

# ============================================================================
# 3. SPEECH-TO-TEXT (Placeholder)
# ============================================================================

function Invoke-LocalSTT {
    param(
        [string]$AudioPath = "",
        [string]$Language = "th-TH"
    )

    # Placeholder: Would use Windows Speech Recognition API
    return @{
        success = $false
        error = "Local STT not yet implemented"
        provider = "Windows-SpeechRec"
        hint = "Use System.Speech.Recognition namespace"
    }
}

function Invoke-ExternalSTT {
    param(
        [string]$AudioPath,
        [string]$Provider = "openai",
        [string]$Language = "th"
    )

    # Placeholder: Would call external STT service
    return @{
        success = $false
        error = "External STT requires API configuration"
        provider = $Provider
        hint = "Set API_KEY environment variable"
    }
}

# ============================================================================
# 4. VOICE MANAGEMENT
# ============================================================================

function Get-AvailableVoices {
    try {
        $speak = New-Object -ComObject SAPI.SpVoice
        $voices = $speak.GetVoices()

        $voiceList = @()
        foreach ($voice in $voices) {
            $voiceList += @{
                name = $voice.GetDescription()
                id = $voice.Id
                language = $voice.GetAttribute("Language")
            }
        }

        return $voiceList
    }
    catch {
        return @{
            error = $_.Exception.Message
        }
    }
}

function Set-PreferredVoice {
    param(
        [string]$VoiceName,
        [int]$Rate = 0,
        [int]$Volume = 100
    )

    # Save to local config
    $config = @{
        voice = $VoiceName
        rate = $Rate
        volume = $Volume
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
    }

    $configPath = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\voice-config.json"
    $config | ConvertTo-Json | Set-Content -Path $configPath

    return @{
        success = $true
        message = "Voice preferences saved"
    }
}

# ============================================================================
# 5. MAIN ROUTING
# ============================================================================

function Main {
    switch ($Action.ToLower()) {
        "tts" {
            if (-not $Text) {
                return @{ error = "Text required for TTS" }
            }

            # Determine provider
            if ($UseLocalTTS) {
                $result = Invoke-LocalTTS -Text $Text -Voice $Voice -OutputPath $OutputPath
            } else {
                if ($ExternalTTSProvider -eq "google") {
                    $result = Invoke-GoogleTTS -Text $Text -OutputPath $OutputPath
                } elseif ($ExternalTTSProvider -eq "grok") {
                    $result = Invoke-GrokTTS -Text $Text -OutputPath $OutputPath
                } elseif ($ExternalTTSProvider -eq "openai") {
                    $result = Invoke-OpenAITTS -Text $Text -OutputPath $OutputPath
                } else {
                    $result = Invoke-LocalTTS -Text $Text -Voice $Voice -OutputPath $OutputPath
                }
            }

            return $result
        }

        "stt" {
            return Invoke-LocalSTT
        }

        "list-voices" {
            $voices = Get-AvailableVoices
            Write-Output "Available Voices:"
            Write-Output "=================="
            $voices | ForEach-Object {
                Write-Output "  - $($_.name) (ID: $($_.id))"
            }
            return @{ success = $true }
        }

        "set-voice" {
            return Set-PreferredVoice -VoiceName $Voice -Rate $VoiceConfig.Rate
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
