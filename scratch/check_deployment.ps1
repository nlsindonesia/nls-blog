try {
    $adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/kalender-admin' -UseBasicParsing).Content
    Write-Host "1. Admin panel page accessible: True"
    Write-Host "2. Admin auth gate present:" $adminRes.Contains('adminKalenderApp')
    Write-Host "3. ID Admin check present in script:" $adminRes.Contains('nlsindonesia')
} catch {
    Write-Host "Admin page returned:" $_.Exception.Message
}

try {
    $kalenderRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/kalender' -UseBasicParsing).Content
    Write-Host "4. Kalender sync script present on /kalender:" $kalenderRes.Contains('default-events.js')
    Write-Host "5. Dynamic events loader present on /kalender:" $kalenderRes.Contains('nls_kalender_events_v1')
} catch {
    Write-Host "Kalender page returned:" $_.Exception.Message
}
