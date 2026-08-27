$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/kalender' -UseBasicParsing).Content

Write-Host "=== VERIFYING THEMED BACKGROUNDS ON LIVE VERCEL ==="
Write-Host "1. .card-theme-osn present:" $res.Contains('.card-theme-osn')
Write-Host "2. .card-theme-tka present:" $res.Contains('.card-theme-tka')
Write-Host "3. .card-theme-snbt present:" $res.Contains('.card-theme-snbt')
Write-Host "4. .card-theme-mitra present:" $res.Contains('.card-theme-mitra')
Write-Host "5. .card-theme-dinas present:" $res.Contains('.card-theme-dinas')
Write-Host "6. getEventCardClass method present:" $res.Contains('getEventCardClass(event.category)')
