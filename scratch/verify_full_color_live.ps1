$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content

Write-Host "=== VERIFYING FULL-COLOR SUPER ADMIN ON LIVE VERCEL ==="
Write-Host "1. Hero Kalender gradient present:" $adminRes.Contains('admin-hero-kalender')
Write-Host "2. Hero Berita gradient present:" $adminRes.Contains('admin-hero-berita')
Write-Host "3. Hero Pengajar gradient present:" $adminRes.Contains('admin-hero-pengajar')
Write-Host "4. Stat Card Sky present:" $adminRes.Contains('stat-card-sky')
Write-Host "5. Stat Card Emerald present:" $adminRes.Contains('stat-card-emerald')
Write-Host "6. Stat Card Amber present:" $adminRes.Contains('stat-card-amber')
Write-Host "7. Themed Event Cards present:" $adminRes.Contains('getEventAdminCardClass')
