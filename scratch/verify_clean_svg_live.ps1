$blogRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/blog' -UseBasicParsing).Content

Write-Host "=== VERIFYING NO CORRUPTED SYMBOLS ON LIVE VERCEL ==="
Write-Host "1. Contains 'ðŸ':" $blogRes.Contains('ðŸ')
Write-Host "2. Contains 'â­':" $blogRes.Contains('â­')
Write-Host "3. Contains clean SVG for Semua Kategori:" $blogRes.Contains('<span>Semua Kategori</span>')
Write-Host "4. Contains clean SVG for SNBT & UTBK:" $blogRes.Contains('<span>SNBT &amp; UTBK</span>')
Write-Host "5. Contains clean SVG for OSN & Sains:" $blogRes.Contains('<span>OSN &amp; Sains</span>')
