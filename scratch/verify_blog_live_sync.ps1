$blogRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/blog' -UseBasicParsing).Content

Write-Host "=== VERIFYING /blog LIVE SYNC ON VERCEL ==="
Write-Host "1. /blog/default-articles.js script loaded:" $blogRes.Contains('/blog/default-articles.js')
Write-Host "2. blogApp() x-data present:" $blogRes.Contains('x-data="blogApp()"')
Write-Host "3. localStorage nls_berita_articles_v1 sync present:" $blogRes.Contains('nls_berita_articles_v1')
Write-Host "4. Dynamic article loop template present:" $blogRes.Contains('filteredArticles()')
Write-Host "5. Full Reader Modal present with x-html:" ($blogRes.Contains('isReaderOpen') -and $blogRes.Contains('activeArticle.content'))
