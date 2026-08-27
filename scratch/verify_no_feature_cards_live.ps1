$blogRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/blog' -UseBasicParsing).Content

Write-Host "=== VERIFYING REMOVAL OF 4 3D FEATURE CARDS ON LIVE VERCEL ==="
Write-Host "1. Contains feat-card-emerald:" $blogRes.Contains('feat-card-emerald')
Write-Host "2. Contains feat-card-sky:" $blogRes.Contains('feat-card-sky')
Write-Host "3. Hero banner present:" $blogRes.Contains('blog-hero-colorful')
Write-Host "4. Category dropdown present:" $blogRes.Contains('<select x-model="selectedCategory"')
Write-Host "5. Article grid present:" $blogRes.Contains('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8')
