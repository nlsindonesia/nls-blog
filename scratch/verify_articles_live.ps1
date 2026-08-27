$blogRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/blog' -UseBasicParsing).Content

Write-Host "=== VERIFYING ARTICLES VISIBILITY ON LIVE VERCEL ==="
Write-Host "1. Dynamic grid container present:" $blogRes.Contains('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8')
Write-Host "2. x-for template present:" $blogRes.Contains('<template x-for="art in filteredArticles()" :key="art.id">')
Write-Host "3. Article cover image markup present:" $blogRes.Contains('<img :src="art.coverImage')
Write-Host "4. Article title element present:" $blogRes.Contains('x-text="art.title"')
Write-Host "5. loadArticles() called in init():" $blogRes.Contains('this.loadArticles();')
