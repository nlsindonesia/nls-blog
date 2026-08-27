$homeRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/' -UseBasicParsing).Content

Write-Host "=== VERIFYING HOMEPAGE 1-ROW PAGINATION ON LIVE VERCEL ==="
Write-Host "1. Has paginatedArticles():" $homeRes.Contains('paginatedArticles()')
Write-Host "2. Has totalPages():" $homeRes.Contains('totalPages()')
Write-Host "3. Has 1-row grid layout (lg:grid-cols-4):" $homeRes.Contains('lg:grid-cols-4')
Write-Host "4. Has setPage(pageNum):" $homeRes.Contains('setPage(pageNum)')
Write-Host "5. Has section id='berita':" $homeRes.Contains('id="berita"')
