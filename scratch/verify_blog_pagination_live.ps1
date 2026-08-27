$blogRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/blog' -UseBasicParsing).Content

Write-Host "=== VERIFYING BLOG 2-ROWS PAGINATION ON LIVE VERCEL ==="
Write-Host "1. Has paginatedArticles():" $blogRes.Contains('paginatedArticles()')
Write-Host "2. Has totalPages():" $blogRes.Contains('totalPages()')
Write-Host "3. Has 2-row grid layout (lg:grid-cols-4):" $blogRes.Contains('lg:grid-cols-4')
Write-Host "4. Has setPage() method:" $blogRes.Contains('setPage(')
Write-Host "5. Has perPage: 8:" $blogRes.Contains('perPage: 8')
Write-Host "6. Has id='katalog-artikel':" $blogRes.Contains('id="katalog-artikel"')
