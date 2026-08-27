$blogRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/blog' -UseBasicParsing).Content

Write-Host "=== VERIFYING FULL-COLOR INTUITIVE CONTROL BAR ON LIVE VERCEL ==="
Write-Host "1. Control bar card container present:" $blogRes.Contains('FULL-COLOR INTUITIVE & STYLISH CONTROL BAR')
Write-Host "2. Section title present:" $blogRes.Contains('Daftar Artikel &amp; Berita Edukasi')
Write-Host "3. Category select present:" $blogRes.Contains('<select x-model="selectedCategory"')
Write-Host "4. Active filter tag chips present:" $blogRes.Contains('Filter Aktif:')
Write-Host "5. Reset filter button present:" $blogRes.Contains('Reset Filter')
