$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content
Write-Host "Contains filteredArticlesList:" $res.Contains('filteredArticlesList')
Write-Host "Contains default-articles.js:" $res.Contains('/blog/default-articles.js')
Write-Host "Contains saveArticlesToStorage:" $res.Contains('saveArticlesToStorage')
