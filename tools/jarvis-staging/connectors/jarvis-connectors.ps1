# jarvis-connectors.ps1 - External Service Connectors (File, Web, Mail, Calendar, GitHub)

param(
    [string]$Service = "file",  # file, browser, gmail, calendar, github
    [string]$Action = "list",   # varies by service
    [string]$Target = "",
    [hashtable]$Parameters = @{}
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$ConnectorConfig = @{
    WorkspaceRoot = "D:\01 Main Work\Boots\Agentic AI\mission-control"
    FilesDir = "D:\01 Main Work\Boots\Agentic AI"
    DefaultBrowser = "chrome"  # chrome, firefox, edge
    MailProvider = "gmail"     # gmail, outlook
    GithubUser = ""
    GithubToken = ""           # From environment variable, NOT hardcoded
}

# ============================================================================
# 1. FILE SYSTEM OPERATIONS
# ============================================================================

function Get-FileSystemInfo {
    param([string]$Path)

    if (-not (Test-Path $Path)) {
        return @{
            exists = $false
            error = "Path not found: $Path"
        }
    }

    $item = Get-Item $Path
    return @{
        exists = $true
        name = $item.Name
        path = $item.FullName
        type = if ($item.PSIsContainer) { "directory" } else { "file" }
        size = if (-not $item.PSIsContainer) { $item.Length } else { 0 }
        modified = $item.LastWriteTime
        created = $item.CreationTime
    }
}

function List-DirectoryContents {
    param(
        [string]$Path,
        [string]$Filter = "*",
        [switch]$Recursive = $false
    )

    if (-not (Test-Path $Path)) {
        return @{ error = "Path not found: $Path" }
    }

    try {
        $items = Get-ChildItem -Path $Path -Filter $Filter -Recurse:$Recursive

        $results = @()
        foreach ($item in $items) {
            $results += @{
                name = $item.Name
                path = $item.FullName
                type = if ($item.PSIsContainer) { "dir" } else { "file" }
                size = if (-not $item.PSIsContainer) { $item.Length } else { 0 }
                modified = $item.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
            }
        }

        return @{
            success = $true
            path = $Path
            count = $results.Count
            items = $results
        }
    }
    catch {
        return @{
            success = $false
            error = $_.Exception.Message
        }
    }
}

function Read-FileContent {
    param(
        [string]$Path,
        [int]$MaxLines = 50
    )

    if (-not (Test-Path $Path)) {
        return @{ error = "File not found: $Path" }
    }

    try {
        $content = Get-Content -Path $Path -TotalCount $MaxLines -Raw
        return @{
            success = $true
            path = $Path
            lines = ($content -split "`n").Count
            content = $content.Substring(0, [Math]::Min(1000, $content.Length))  # First 1000 chars
            truncated = $content.Length -gt 1000
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
# 2. WEB BROWSER OPERATIONS
# ============================================================================

function Open-URL {
    param(
        [string]$URL,
        [string]$Browser = "default"
    )

    if (-not $URL.StartsWith("http")) {
        $URL = "https://$URL"
    }

    try {
        Start-Process $URL
        return @{
            success = $true
            opened = $URL
            browser = $Browser
        }
    }
    catch {
        return @{
            success = $false
            error = $_.Exception.Message
        }
    }
}

function Search-Web {
    param(
        [string]$Query,
        [string]$Engine = "google"  # google, bing, duckduckgo
    )

    $urls = @{
        google = "https://www.google.com/search?q="
        bing = "https://www.bing.com/search?q="
        duckduckgo = "https://duckduckgo.com/?q="
    }

    $baseUrl = $urls[$Engine]
    if (-not $baseUrl) { $baseUrl = $urls["google"] }

    $encodedQuery = [System.Net.WebUtility]::UrlEncode($Query)
    $searchUrl = "$baseUrl$encodedQuery"

    return Open-URL -URL $searchUrl -Browser "default"
}

# ============================================================================
# 3. EMAIL (GMAIL PLACEHOLDER)
# ============================================================================

function Send-Email {
    param(
        [string]$To,
        [string]$Subject,
        [string]$Body
    )

    # Placeholder: Requires OAuth2 configuration
    return @{
        success = $false
        error = "Gmail API requires OAuth2 setup (not stored in source)"
        hint = "Configure Google Cloud credentials and set GMAIL_CREDS env variable"
        example = "jarvis-connectors.ps1 -Service gmail -Action send-email -Target recipient@example.com"
    }
}

function Get-GmailInbox {
    param([int]$MaxResults = 10)

    # Placeholder: Requires OAuth2
    return @{
        success = $false
        error = "Gmail API requires OAuth2 setup"
        hint = "Set up Google Cloud Service Account credentials"
    }
}

# ============================================================================
# 4. CALENDAR (PLACEHOLDER)
# ============================================================================

function Get-CalendarEvents {
    param(
        [datetime]$StartDate = (Get-Date),
        [datetime]$EndDate = (Get-Date).AddDays(7)
    )

    # Placeholder: Would use Google Calendar or Outlook Calendar API
    return @{
        success = $false
        error = "Calendar API requires authentication setup"
        provider = "Google Calendar / Outlook"
    }
}

# ============================================================================
# 5. GITHUB OPERATIONS
# ============================================================================

function Get-GithubStatus {
    # Check if GitHub token is available (from environment)
    $token = $env:GITHUB_TOKEN

    if (-not $token) {
        return @{
            authenticated = $false
            hint = "Set GITHUB_TOKEN environment variable"
        }
    }

    return @{
        authenticated = $true
        user = $env:GITHUB_USER -or "unknown"
    }
}

function List-GithubRepos {
    param([string]$User = "")

    $token = $env:GITHUB_TOKEN
    if (-not $token) {
        return @{
            error = "GitHub token not set"
            hint = "Set GITHUB_TOKEN environment variable"
        }
    }

    # Placeholder: Would use GitHub API
    return @{
        success = $false
        error = "GitHub API not yet implemented"
        note = "Would list repositories for user: $User"
    }
}

# ============================================================================
# 6. SERVICE ROUTING
# ============================================================================

function Invoke-FileService {
    param(
        [string]$Action,
        [string]$Target,
        [hashtable]$Parameters
    )

    switch ($Action.ToLower()) {
        "list" {
            return List-DirectoryContents -Path ($Target -or $ConnectorConfig.FilesDir)
        }
        "info" {
            return Get-FileSystemInfo -Path $Target
        }
        "read" {
            return Read-FileContent -Path $Target
        }
        "search" {
            return List-DirectoryContents -Path ($Target -or $ConnectorConfig.FilesDir) -Filter "*$($Parameters.query)*"
        }
        default {
            return @{ error = "Unknown file action: $Action" }
        }
    }
}

function Invoke-BrowserService {
    param(
        [string]$Action,
        [string]$Target,
        [hashtable]$Parameters
    )

    switch ($Action.ToLower()) {
        "open" {
            return Open-URL -URL $Target
        }
        "search" {
            return Search-Web -Query $Target -Engine ($Parameters.engine -or "google")
        }
        default {
            return @{ error = "Unknown browser action: $Action" }
        }
    }
}

function Invoke-GmailService {
    param(
        [string]$Action,
        [string]$Target,
        [hashtable]$Parameters
    )

    switch ($Action.ToLower()) {
        "send" {
            return Send-Email -To $Target -Subject $Parameters.subject -Body $Parameters.body
        }
        "inbox" {
            return Get-GmailInbox -MaxResults ($Parameters.maxResults -or 10)
        }
        default {
            return @{ error = "Unknown Gmail action: $Action" }
        }
    }
}

function Invoke-GithubService {
    param(
        [string]$Action,
        [string]$Target,
        [hashtable]$Parameters
    )

    switch ($Action.ToLower()) {
        "status" {
            return Get-GithubStatus
        }
        "repos" {
            return List-GithubRepos -User $Target
        }
        default {
            return @{ error = "Unknown GitHub action: $Action" }
        }
    }
}

# ============================================================================
# 7. MAIN ROUTING
# ============================================================================

function Main {
    switch ($Service.ToLower()) {
        "file" {
            return Invoke-FileService -Action $Action -Target $Target -Parameters $Parameters
        }
        "browser" {
            return Invoke-BrowserService -Action $Action -Target $Target -Parameters $Parameters
        }
        "gmail" {
            return Invoke-GmailService -Action $Action -Target $Target -Parameters $Parameters
        }
        "calendar" {
            return Get-CalendarEvents
        }
        "github" {
            return Invoke-GithubService -Action $Action -Target $Target -Parameters $Parameters
        }
        default {
            Write-Output "Available services: file, browser, gmail, calendar, github"
            return @{ error = "Unknown service: $Service" }
        }
    }
}

# Execute if called directly
if ($MyInvocation.InvocationName -ne ".") {
    Main
}
