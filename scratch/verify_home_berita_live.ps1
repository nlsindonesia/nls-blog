$homeRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/' -UseBasicParsing).Content

Write-Host "=== VERIFYING HOMEPAGE BERITA TERKINI SECTION ON LIVE VERCEL ==="
Write-Host "1. Control bar present on homepage:" $homeRes.Contains('Daftar Artikel &amp; Berita Edukasi')
Write-Host "2. Saring Kategori custom dropdown present:" $homeRes.Contains('Saring Kategori:')
Write-Host "3. 5 Columns grid layout present (xl:grid-cols-5):" $homeRes.Contains('xl:grid-cols-5')
Write-Host "4. homeNewsApp() JS engine present:" $homeRes.Contains('function homeNewsApp()')
Write-Host "5. /blog/default-articles.js loaded:" $homeRes.Contains('/blog/default-articles.js')
Write-Host "6. Full reader modal present on homepage:" $homeRes.Contains('isReaderOpen')
