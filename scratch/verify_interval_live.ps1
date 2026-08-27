Start-Sleep -Seconds 5
$urls = @(
    "https://nls-blog-plum.vercel.app/nlsadmin",
    "https://nls-blog-plum.vercel.app/kalender",
    "https://nls-blog-plum.vercel.app/",
    "https://nls-blog-plum.vercel.app/osn"
)

Write-Host "=== VERIFYING LIVE CALENDAR INTERVAL DEPLOYMENT ==="

foreach ($u in $urls) {
    try {
        $res = Invoke-RestMethod -Uri $u -Method Get -Headers @{ "Cache-Control" = "no-cache" }
        $hasRangeMethod = $res.Contains("formatEventDateRange")
        $hasEndDate = $res.Contains("eventForm.endDate") -or $res.Contains("event.endDate")
        Write-Host "[$u] Has formatEventDateRange: $hasRangeMethod | Has endDate: $hasEndDate"
    } catch {
        Write-Host "[$u] Error: $_"
    }
}
