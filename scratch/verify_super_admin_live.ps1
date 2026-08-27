$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content
$pengajarRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/pengajar' -UseBasicParsing).Content

Write-Host "=== VERIFYING SUPER ADMIN DASHBOARD ON LIVE VERCEL ==="
Write-Host "1. Super Admin Title present:" $adminRes.Contains('Super Admin Portal')
Write-Host "2. Collapsible Sidebar present:" $adminRes.Contains('sidebar-expanded')
Write-Host "3. Berita CMS WYSIWYG & SEO suite present:" $adminRes.Contains('Google Snippet Preview')
Write-Host "4. Pengajar Manager present:" $adminRes.Contains('Manajemen Direktori Pengajar')
Write-Host "5. /pengajar loaded default-teachers.js:" $pengajarRes.Contains('/pengajar/default-teachers.js')
Write-Host "6. /pengajar dynamic sync present:" $pengajarRes.Contains('nls_pengajar_teachers_v1')
