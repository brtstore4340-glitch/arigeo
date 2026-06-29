@echo off
REM RUN_JARVIS_GUARD.cmd - JARVIS Interactive with Guard Patch
REM Guard patch: Handles boolean input bug at parser layer
REM Supports: Local LLM, Claude, Grok, Gemini, OpenRouter

setlocal enabledelayedexpansion

REM ============================================================================
REM CONFIGURATION
REM ============================================================================

set JARVIS_HOME=D:\01 Main Work\Boots\Agentic AI\mission-control\tools
set JARVIS_SCRIPT=%JARVIS_HOME%\START_JARVIS_AI.ps1

REM Default provider (can change: local, claude, grok, gemini, openrouter)
set INTENT_PROVIDER=local

REM Local LLM endpoint (for local provider)
set LOCAL_ENDPOINT=http://localhost:20128/v1

REM ============================================================================
REM MAIN
REM ============================================================================

cls
echo.
echo ╔════════════════════════════════════════════╗
echo ║                                            ║
echo ║     JARVIS LOCAL - INTERACTIVE MODE        ║
echo ║     Guard Patch Enabled                    ║
echo ║                                            ║
echo ╚════════════════════════════════════════════╝
echo.

REM Check if script exists
if not exist "%JARVIS_SCRIPT%" (
    echo ✗ ERROR: JARVIS script not found
    echo   Expected: %JARVIS_SCRIPT%
    echo.
    pause
    exit /b 1
)

REM Navigate to JARVIS directory
cd /d "%JARVIS_HOME%"

REM Display info
echo ℹ️  Configuration:
echo   Provider: %INTENT_PROVIDER%
echo   Home: %JARVIS_HOME%
echo.

REM Show provider-specific info
if "%INTENT_PROVIDER%"=="local" (
    echo 🔌 Local LLM Mode
    echo   Endpoint: %LOCAL_ENDPOINT%
    echo   Make sure your local LLM server is running!
    echo.
)

if "%INTENT_PROVIDER%"=="claude" (
    echo 🔑 Claude Mode
    echo   Requires: ANTHROPIC_API_KEY environment variable
    echo.
)

echo 💬 Starting Interactive Mode...
echo    Type 'help' for commands, 'exit' to quit
echo.
pause

REM ============================================================================
REM RUN JARVIS WITH GUARD PATCH
REM ============================================================================

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$env:INTENT_PROVIDER='%INTENT_PROVIDER%'; " ^
    "& '%JARVIS_SCRIPT%' -Interactive -IntentProvider %INTENT_PROVIDER%"

REM ============================================================================
REM CLEANUP
REM ============================================================================

echo.
echo ╔════════════════════════════════════════════╗
echo ║        SESSION COMPLETED                   ║
echo ╚════════════════════════════════════════════╝
echo.
echo Logs saved to: %JARVIS_HOME%\logs\
echo.
pause
