# RAM Voice Chat - Start Script
# Launches both backend and frontend servers

param(
    [switch]$Verbose = $false
)

function Write-Banner {
    param([string]$Text, [string]$Color = "Cyan")
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor $Color
    Write-Host "║  $Text" -ForegroundColor $Color
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor $Color
    Write-Host ""
}

function Write-Status {
    param([string]$Message, [string]$Status = "INFO")
    $color = switch ($Status) {
        "OK" { "Green" }
        "WARN" { "Yellow" }
        "ERROR" { "Red" }
        default { "Cyan" }
    }
    Write-Host "[$Status] $Message" -ForegroundColor $color
}

# ============================================================================
# STARTUP
# ============================================================================

Write-Banner "RAM Voice Chat Startup" "Magenta"

# Check Node.js
Write-Status "Checking Node.js..." "INFO"
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Status "Node.js found: $nodeVersion" "OK"
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Status "Node.js not installed - please install Node.js 18+" "ERROR"
    exit 1
}

# Check directories
$backendDir = Join-Path $PSScriptRoot "backend"
$frontendDir = Join-Path $PSScriptRoot "frontend"

if (-not (Test-Path $backendDir)) {
    Write-Status "Backend directory not found: $backendDir" "ERROR"
    exit 1
}

if (-not (Test-Path $frontendDir)) {
    Write-Status "Frontend directory not found: $frontendDir" "ERROR"
    exit 1
}

Write-Status "Project structure verified" "OK"
Write-Host ""

# ============================================================================
# INSTALL DEPENDENCIES
# ============================================================================

Write-Banner "Installing Dependencies" "Yellow"

Write-Status "Backend dependencies..." "INFO"
Push-Location $backendDir
if (-not (Test-Path "node_modules")) {
    npm install --quiet
    if ($LASTEXITCODE -ne 0) {
        Write-Status "Backend npm install failed" "ERROR"
        exit 1
    }
}
Write-Status "Backend ready" "OK"
Pop-Location

Write-Status "Frontend dependencies..." "INFO"
Push-Location $frontendDir
if (-not (Test-Path "node_modules")) {
    npm install --quiet
    if ($LASTEXITCODE -ne 0) {
        Write-Status "Frontend npm install failed" "ERROR"
        exit 1
    }
}
Write-Status "Frontend ready" "OK"
Pop-Location

Write-Host ""

# ============================================================================
# START SERVERS
# ============================================================================

Write-Banner "Starting Servers" "Green"

# Start backend in background
Write-Status "Starting backend on port 3001..." "INFO"
Push-Location $backendDir
$backendProcess = Start-Process node -ArgumentList "server.js" -PassThru -NoNewWindow
Write-Status "Backend PID: $($backendProcess.Id)" "OK"
Pop-Location

# Wait a moment for backend to start
Start-Sleep -Seconds 2

# Start frontend in background
Write-Status "Starting frontend on port 3000..." "INFO"
Push-Location $frontendDir
$frontendProcess = Start-Process npm -ArgumentList "run", "dev" -PassThru -NoNewWindow
Write-Status "Frontend PID: $($frontendProcess.Id)" "OK"
Pop-Location

Write-Host ""

# ============================================================================
# READY
# ============================================================================

Write-Banner "RAM Voice Chat is Running!" "Green"

Write-Host "📍 Frontend:  http://localhost:3000" -ForegroundColor Green
Write-Host "📍 Backend:   http://localhost:3001" -ForegroundColor Green
Write-Host ""
Write-Host "🎤 Open the frontend link in your browser to start!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Gray
Write-Host ""

# Keep script running and monitor processes
try {
    while ($true) {
        if ($backendProcess.HasExited) {
            Write-Status "Backend process exited" "WARN"
        }
        if ($frontendProcess.HasExited) {
            Write-Status "Frontend process exited" "WARN"
        }
        Start-Sleep -Seconds 5
    }
} finally {
    Write-Host ""
    Write-Status "Stopping servers..." "INFO"

    if (-not $backendProcess.HasExited) {
        Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
        Write-Status "Backend stopped" "OK"
    }

    if (-not $frontendProcess.HasExited) {
        Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
        Write-Status "Frontend stopped" "OK"
    }

    Write-Host ""
    Write-Status "Shutdown complete" "OK"
}
