$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content

Write-Host "=== VERIFYING ADMIN PRESENT NEWS ON LIVE VERCEL ==="
Write-Host "1. Has filteredArticlesList() method:" $adminRes.Contains('filteredArticlesList()')
Write-Host "2. Has auto-merging default articles logic:" $adminRes.Contains('window.NLS_DEFAULT_ARTICLES.forEach')
Write-Host "3. Has 9 OSN covers in baseline:" $adminRes.Contains('default-articles.js')
