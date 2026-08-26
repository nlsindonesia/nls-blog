$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/kalender-admin' -UseBasicParsing).Content
$kalenderRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/kalender' -UseBasicParsing).Content

Write-Host "=== VERIFYING /kalender-admin & /kalender ON LIVE VERCEL ==="
Write-Host "1. Admin panel page accessible:" $adminRes.Contains('Admin Kalender &amp; Event NLS')
Write-Host "2. Admin auth gate present:" $adminRes.Contains('adminKalenderApp()')
Write-Host "3. ID Admin check present in script:" $adminRes.Contains('nlsindonesia')
Write-Host "4. Kalender sync script present on /kalender:" $kalenderRes.Contains('default-events.js')
Write-Host "5. Dynamic events loader present on /kalender:" $kalenderRes.Contains('nls_kalender_events_v1')
