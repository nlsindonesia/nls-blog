$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/kalender' -UseBasicParsing).Content

Write-Host "=== VERIFYING EQUAL HEIGHT & INNER SCROLL ON LIVE VERCEL ==="
Write-Host "1. .cal-detail-body CSS class present:" $res.Contains('.cal-detail-body')
Write-Host "2. align-items: stretch present:" $res.Contains('align-items: stretch;')
Write-Host "3. cal-main-card-el ID present:" $res.Contains('id="cal-main-card-el"')
Write-Host "4. mainCardHeight sync style present:" $res.Contains('mainCardHeight ?')
