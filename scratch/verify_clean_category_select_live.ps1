$blogRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/blog' -UseBasicParsing).Content

Write-Host "=== VERIFYING CLEAN SARING KATEGORI SELECT ON LIVE VERCEL ==="
Write-Host "1. Contains clean 'Semua Kategori Berita':" $blogRes.Contains('<option value="all">Semua Kategori Berita</option>')
Write-Host "2. Contains clean 'Bimbel NexGen':" $blogRes.Contains('<option value="Bimbel NexGen">Bimbel NexGen</option>')
Write-Host "3. No 'â­':" (-not $blogRes.Contains('â­'))
Write-Host "4. Left Funnel icon has top-1/2 -translate-y-1/2:" $blogRes.Contains('pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2')
Write-Host "5. Right Chevron icon has top-1/2 -translate-y-1/2:" $blogRes.Contains('pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2')
