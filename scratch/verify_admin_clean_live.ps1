$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin/' -UseBasicParsing).Content

Write-Host "=== VERIFYING NLSADMIN CLEAN LABELS ON LIVE VERCEL ==="
Write-Host "1. Contains 'ðŸ':" $adminRes.Contains('ðŸ')
Write-Host "2. Has clean 'Semua Kategori':" $adminRes.Contains('<option value="all">Semua Kategori</option>')
Write-Host "3. Has clean 'Semua Bulan 2026':" $adminRes.Contains('<option value="all">Semua Bulan 2026</option>')
