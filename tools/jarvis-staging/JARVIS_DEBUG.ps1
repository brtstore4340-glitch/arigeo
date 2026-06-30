# JARVIS_DEBUG.ps1 - Debug version to diagnose input capture issue

param(
    [string]$IntentProvider = "local"
)

Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     JARVIS DEBUG MODE                     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "Debugging input capture..." -ForegroundColor Yellow
Write-Host ""

$KnownCommands = @("help", "status", "screenshot", "open", "search", "exit", "quit")

while ($true) {
    # Read input
    Write-Host "Waiting for input..." -ForegroundColor Gray
    $userInput = Read-Host "jarvis"

    # Debug output
    Write-Host ""
    Write-Host "DEBUG INFO:" -ForegroundColor Yellow
    Write-Host "  Raw input: '$userInput'" -ForegroundColor Gray
    Write-Host "  Input type: $($userInput.GetType().Name)" -ForegroundColor Gray
    Write-Host "  Input length: $($userInput.Length)" -ForegroundColor Gray
    Write-Host "  Input bytes: $([System.BitConverter]::ToString([System.Text.Encoding]::UTF8.GetBytes($userInput)))" -ForegroundColor Gray

    # Trim and lowercase
    $trimmed = $userInput.Trim()
    $lower = $trimmed.ToLower()

    Write-Host "  After trim: '$trimmed'" -ForegroundColor Gray
    Write-Host "  After lower: '$lower'" -ForegroundColor Gray

    # Parse first word
    $parts = $lower -split ' ', 2
    $command = $parts[0]

    Write-Host "  First word: '$command'" -ForegroundColor Gray
    Write-Host "  Known: $($KnownCommands -contains $command)" -ForegroundColor Gray
    Write-Host ""

    # Check if known command
    if ($KnownCommands -contains $command) {
        Write-Host "✓ RECOGNIZED: $command" -ForegroundColor Green

        if ($command -eq "exit" -or $command -eq "quit") {
            Write-Host "✓ Exiting..." -ForegroundColor Green
            break
        }
    } else {
        Write-Host "✗ NOT RECOGNIZED: $command" -ForegroundColor Red
    }

    Write-Host ""
}

Write-Host ""
Write-Host "Debug session ended." -ForegroundColor Cyan
