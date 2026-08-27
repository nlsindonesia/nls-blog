$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content
$blogRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/blog' -UseBasicParsing).Content

Write-Host "=== VERIFYING MULTI-CATEGORY CMS ON LIVE VERCEL ==="
Write-Host "1. availableArticleCategories in nlsadmin:" $adminRes.Contains('availableArticleCategories')
Write-Host "2. Multi-category checkboxes in Create News form:" $adminRes.Contains('articleEditor.form.categories')
Write-Host "3. Category count badge in Create News form:" $adminRes.Contains('Kategori Dipilih')
Write-Host "4. Multi-category badges loop in Present News:" $adminRes.Contains('art.categories || [art.category')
Write-Host "5. Multi-category badges loop in /blog:" $blogRes.Contains('art.categories || [art.category')
