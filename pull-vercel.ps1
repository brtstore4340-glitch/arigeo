param([string]$DeploymentId, [string]$Token)
$root = "D:\01 Main Work\Boots\Agentic AI\mission-control\arigeo-project"
$team = "team_OS8nENECHPCuieeZsEhya9sF"
$H = @{ Authorization = "Bearer $Token" }

# ดึง file tree ของ deployment
$files = Invoke-RestMethod -Headers $H -Uri "https://api.vercel.com/v7/deployments/$DeploymentId/files?teamId=$team"

function Walk($nodes, $prefix) {
  foreach ($n in $nodes) {
    $path = if ($prefix) { "$prefix/$($n.name)" } else { $n.name }
    if ($n.type -eq "directory" -and $n.children) {
      Walk $n.children $path
    } elseif ($n.type -eq "file" -and $path -notmatch "node_modules|^\.next") {
      $out = Join-Path "$root\recovery\vercel" ($path -replace "/", "\")
      New-Item -ItemType Directory -Force -Path (Split-Path $out) | Out-Null
      $uid = $n.uid
      try {
        Invoke-RestMethod -Headers $H `
          -Uri "https://api.vercel.com/v7/deployments/$DeploymentId/files/$uid`?teamId=$team" `
          -OutFile $out
        Write-Host "OK  $path" -ForegroundColor Green
      } catch {
        Write-Host "ERR $path : $_" -ForegroundColor Red
      }
    }
  }
}
Walk $files ""
Write-Host "`nDone -> recovery\vercel\" -ForegroundColor Cyan
