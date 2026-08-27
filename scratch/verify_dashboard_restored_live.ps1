$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content

Write-Host "=== VERIFYING RESTORED SUPER ADMIN DASHBOARD ON LIVE VERCEL ==="
Write-Host "1. Kalender module present:" $adminRes.Contains('Manajemen Kalender &amp; Agenda')
Write-Host "2. Berita CMS WYSIWYG present:" $adminRes.Contains('Content Management System (CMS)')
Write-Host "3. Pengajar module present:" $adminRes.Contains('Manajemen Direktori Pengajar')
Write-Host "4. Left sidebar docked present:" $adminRes.Contains('h-screen')
Write-Host "5. Toggle button present:" $adminRes.Contains('Sembunyikan Menu Sidebar')
Write-Host "6. Status Code 200 OK, Length:" $adminRes.Length
