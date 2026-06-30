# jarvis-computer-use.ps1 - Computer Use Module (Screenshot, UI Actions, Allowlist)

param(
    [string]$Action = "screenshot",  # screenshot, queue-action, execute-queue, list-actions
    [string]$Target = "",
    [string]$Parameters = "",
    [switch]$DryRun = $false,
    [switch]$RequireApproval = $true
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$ComputerUseConfig = @{
    ScreenshotDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\screenshots"
    ActionQueueFile = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\action-queue.jsonl"
    ApprovalRequiredByDefault = $true
    AllowlistPath = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\action-allowlist.json"
}

# Create directories if not exists
@($ComputerUseConfig.ScreenshotDir) | ForEach-Object {
    if (-not (Test-Path $_)) {
        New-Item -ItemType Directory -Path $_ -Force | Out-Null
    }
}

# ============================================================================
# 1. SCREENSHOT CAPTURE
# ============================================================================

function Capture-Screenshot {
    param(
        [string]$OutputPath = "",
        [string]$Format = "png"  # png, jpg, bmp
    )

    try {
        # Generate output path if not provided
        if (-not $OutputPath) {
            $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
            $OutputPath = Join-Path $ComputerUseConfig.ScreenshotDir "screenshot-$timestamp.$Format"
        }

        # Use .NET to capture screenshot
        [System.Reflection.Assembly]::LoadWithPartialName("System.Drawing") | Out-Null
        [System.Reflection.Assembly]::LoadWithPartialName("System.Windows.Forms") | Out-Null

        $screen = [System.Windows.Forms.Screen]::PrimaryScreen
        $bitmap = New-Object System.Drawing.Bitmap($screen.Bounds.Width, $screen.Bounds.Height)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        $graphics.CopyFromScreen($screen.Bounds.Location, [System.Drawing.Point]::Empty, $screen.Bounds.Size)

        # Save to file
        $imageFormat = [System.Drawing.Imaging.ImageFormat]::$([char]::ToUpper($Format[0]) + $Format.Substring(1))
        $bitmap.Save($OutputPath, $imageFormat)
        $graphics.Dispose()
        $bitmap.Dispose()

        return @{
            success = $true
            output = $OutputPath
            size = (Get-Item $OutputPath).Length
            format = $Format
            timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
        }
    }
    catch {
        return @{
            success = $false
            error = $_.Exception.Message
        }
    }
}

# ============================================================================
# 2. ACTION ALLOWLIST
# ============================================================================

function Initialize-Allowlist {
    # Create default allowlist
    $defaultAllowlist = @{
        allowed_actions = @(
            @{ action = "open-app"; targets = @("notepad", "calc", "chrome", "firefox", "edge", "outlook", "teams"); require_approval = $false }
            @{ action = "open-url"; targets = @("http", "https"); require_approval = $false }
            @{ action = "type-text"; targets = @("*"); require_approval = $true }
            @{ action = "click"; targets = @("*"); require_approval = $true }
            @{ action = "screenshot"; targets = @("*"); require_approval = $false }
        )
        blocked_actions = @(
            @{ action = "delete-file"; reason = "Destructive" }
            @{ action = "uninstall-software"; reason = "Destructive" }
            @{ action = "format-drive"; reason = "Destructive" }
            @{ action = "shutdown"; reason = "System-level" }
            @{ action = "reboot"; reason = "System-level" }
            @{ action = "change-password"; reason = "Security-sensitive" }
        )
    }

    if (-not (Test-Path $ComputerUseConfig.AllowlistPath)) {
        $defaultAllowlist | ConvertTo-Json -Depth 3 | Set-Content -Path $ComputerUseConfig.AllowlistPath
    }

    return $defaultAllowlist
}

function Check-Allowlist {
    param(
        [string]$Action,
        [string]$Target
    )

    $allowlist = Initialize-Allowlist

    # Check blocked actions
    $blockedAction = $allowlist.blocked_actions | Where-Object { $_.action -eq $Action }
    if ($blockedAction) {
        return @{
            allowed = $false
            reason = "BLOCKED: $($blockedAction.reason)"
            require_approval = $false
        }
    }

    # Check allowed actions
    $allowedAction = $allowlist.allowed_actions | Where-Object { $_.action -eq $Action }
    if ($allowedAction) {
        $targetAllowed = $allowedAction.targets -contains $Target -or $allowedAction.targets -contains "*"
        return @{
            allowed = $targetAllowed
            reason = if ($targetAllowed) { "Allowed" } else { "Target not in allowlist" }
            require_approval = $allowedAction.require_approval
        }
    }

    return @{
        allowed = $false
        reason = "Action not in allowlist"
        require_approval = $true
    }
}

# ============================================================================
# 3. ACTION QUEUE
# ============================================================================

function Queue-Action {
    param(
        [string]$Action,
        [string]$Target,
        [hashtable]$Parameters
    )

    # Check allowlist
    $allowlistCheck = Check-Allowlist -Action $Action -Target $Target

    if (-not $allowlistCheck.allowed) {
        return @{
            success = $false
            error = $allowlistCheck.reason
            queued = $false
        }
    }

    # Create queue entry
    $queueEntry = @{
        id = [guid]::NewGuid().ToString()
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
        action = $Action
        target = $Target
        parameters = $Parameters
        status = "pending"
        require_approval = $allowlistCheck.require_approval
        approved = -not $allowlistCheck.require_approval
        approved_by = if (-not $allowlistCheck.require_approval) { "automatic" } else { "" }
        approved_at = if (-not $allowlistCheck.require_approval) { Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ" } else { "" }
    }

    # Write to queue
    $queueJson = $queueEntry | ConvertTo-Json -Compress
    Add-Content -Path $ComputerUseConfig.ActionQueueFile -Value $queueJson

    return @{
        success = $true
        queued = $true
        id = $queueEntry.id
        require_approval = $queueEntry.require_approval
    }
}

function Get-ActionQueue {
    if (-not (Test-Path $ComputerUseConfig.ActionQueueFile)) {
        return @{ queue = @() }
    }

    $queue = @()
    Get-Content $ComputerUseConfig.ActionQueueFile | ForEach-Object {
        $queue += ($_ | ConvertFrom-Json)
    }

    $pending = $queue | Where-Object { $_.status -eq "pending" }
    $executed = $queue | Where-Object { $_.status -eq "executed" }
    $blocked = $queue | Where-Object { $_.status -eq "blocked" }

    return @{
        total = $queue.Count
        pending = $pending.Count
        executed = $executed.Count
        blocked = $blocked.Count
        queue = $queue
    }
}

function Approve-Action {
    param(
        [string]$ActionId,
        [string]$ApprovedBy = "user"
    )

    # Read queue
    $queue = @()
    if (Test-Path $ComputerUseConfig.ActionQueueFile) {
        Get-Content $ComputerUseConfig.ActionQueueFile | ForEach-Object {
            $queue += ($_ | ConvertFrom-Json)
        }
    }

    # Find and update action
    $updated = $false
    foreach ($entry in $queue) {
        if ($entry.id -eq $ActionId) {
            $entry.approved = $true
            $entry.approved_by = $ApprovedBy
            $entry.approved_at = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
            $updated = $true
            break
        }
    }

    if (-not $updated) {
        return @{ success = $false; error = "Action not found" }
    }

    # Rewrite queue
    Clear-Content -Path $ComputerUseConfig.ActionQueueFile -Force
    $queue | ForEach-Object {
        $_ | ConvertTo-Json -Compress | Add-Content -Path $ComputerUseConfig.ActionQueueFile
    }

    return @{ success = $true; approved = $true }
}

function Execute-Action {
    param(
        [hashtable]$Action
    )

    if (-not $Action.approved) {
        return @{
            success = $false
            error = "Action requires approval"
        }
    }

    try {
        switch ($Action.action) {
            "open-app" {
                Start-Process $Action.target
                return @{ success = $true; executed = "Application started: $($Action.target)" }
            }
            "open-url" {
                Start-Process $Action.target
                return @{ success = $true; executed = "URL opened: $($Action.target)" }
            }
            "screenshot" {
                $result = Capture-Screenshot
                return $result
            }
            default {
                return @{
                    success = $false
                    error = "Handler not implemented: $($Action.action)"
                }
            }
        }
    }
    catch {
        return @{
            success = $false
            error = $_.Exception.Message
        }
    }
}

function Execute-Queue {
    param([switch]$OnlyApproved = $true)

    $queueStatus = Get-ActionQueue
    $queue = $queueStatus.queue

    if ($OnlyApproved) {
        $queue = $queue | Where-Object { $_.approved -eq $true -and $_.status -eq "pending" }
    }

    $results = @()
    foreach ($action in $queue) {
        $result = Execute-Action -Action $action
        $results += @{
            id = $action.id
            result = $result
        }
    }

    return @{
        executed = $results.Count
        results = $results
    }
}

# ============================================================================
# 4. MAIN ROUTING
# ============================================================================

function Main {
    switch ($Action.ToLower()) {
        "screenshot" {
            $result = Capture-Screenshot
            Write-Output "Screenshot: $($result.output)"
            return $result
        }

        "queue-action" {
            if ($DryRun) {
                return @{
                    success = $true
                    dryRun = $true
                    message = "[DRY-RUN] Would queue: $Target"
                }
            }
            return Queue-Action -Action $Target -Target $Parameters
        }

        "list-queue" {
            $queue = Get-ActionQueue
            Write-Output "Action Queue Status:"
            Write-Output "  Pending:   $($queue.pending)"
            Write-Output "  Executed:  $($queue.executed)"
            Write-Output "  Blocked:   $($queue.blocked)"
            return $queue
        }

        "execute-queue" {
            if ($DryRun) {
                return @{
                    success = $true
                    dryRun = $true
                    message = "[DRY-RUN] Would execute pending actions"
                }
            }
            return Execute-Queue -OnlyApproved:$RequireApproval
        }

        "approve-action" {
            return Approve-Action -ActionId $Target
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
