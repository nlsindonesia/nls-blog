Start-Sleep -Seconds 5
$urls = @(
    "https://nls-blog-plum.vercel.app/kalender",
    "https://nls-blog-plum.vercel.app/",
    "https://nls-blog-plum.vercel.app/osn"
)

Write-Host "=== VERIFYING LIVE CALENDAR EVENT BACKGROUNDS ==="

foreach ($u in $urls) {
    try {
        $res = Invoke-RestMethod -Uri $u -Method Get -Headers @{ "Cache-Control" = "no-cache" }
        $hasAdminOsn = $res.Contains("admin-card-osn")
        $hasMethod = $res.Contains("getEventAdminCardClass")
        Write-Host "[$u] Has admin-card-osn: $hasAdminOsn | Has getEventAdminCardClass: $hasMethod"
    } catch {
        Write-Host "[$u] Error: $_"
    }
}
