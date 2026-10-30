# Agastya Care Demo - Automatic Git Watcher & Sync Script
# Runs in the background and automatically commits & pushes changes to GitHub

$repoPath = $PSScriptRoot
Set-Location -Path $repoPath

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Agastya Care Auto-Sync Service" -ForegroundColor Cyan
Write-Host " Watching: $repoPath" -ForegroundColor Cyan
Write-Host " Target: GitHub origin/main -> Vercel" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Any saved edit in this workspace will automatically be" -ForegroundColor Green
Write-Host "committed and pushed to GitHub, triggering a Vercel build." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop.`n"

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $repoPath
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true
$watcher.Filter = "*.*"

$lastChange = [DateTime]::MinValue
$debounceSeconds = 3

while ($true) {
    $result = $watcher.WaitForChanged([System.IO.WatcherChangeTypes]::All, 1000)
    if ($result.TimedOut -eq $false) {
        $fileName = $result.Name
        # Ignore git internal files, temp files, screenshots, logs, and self
        if ($fileName -notmatch "^(\.git|node_modules|screenshots|sync\.bat|auto-sync\.ps1|\.system_generated|\.tmp)") {
            $now = Get-Date
            if (($now - $lastChange).TotalSeconds -gt $debounceSeconds) {
                $lastChange = $now
                Start-Sleep -Seconds 2
                
                $status = git status --porcelain
                if ($status) {
                    Write-Host "[$([DateTime]::Now.ToString('HH:mm:ss'))] Detected modification in $fileName" -ForegroundColor Yellow
                    git add .
                    git commit -m "Auto-update: modifications detected in $fileName"
                    git push origin main
                    Write-Host "[$([DateTime]::Now.ToString('HH:mm:ss'))] Successfully pushed to GitHub! Vercel is deploying.`n" -ForegroundColor Green
                }
            }
        }
    }
}
