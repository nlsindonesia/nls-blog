$blogRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/blog' -UseBasicParsing).Content

Write-Host "=== VERIFYING FULL-COLOR /blog ON LIVE VERCEL ==="
Write-Host "1. .blog-hero-colorful class present in CSS:" $blogRes.Contains('.blog-hero-colorful')
Write-Host "2. Hero section uses blog-hero-colorful:" $blogRes.Contains('class="blog-hero-colorful')
Write-Host "3. 3D Feature Cards present:" ($blogRes.Contains('feat-card-emerald') -and $blogRes.Contains('feat-card-sky'))
Write-Host "4. White crisp search input present:" $blogRes.Contains('bg-white text-slate-900')
Write-Host "5. Themed Card Accent CSS present:" ($blogRes.Contains('card-accent-osn') -and $blogRes.Contains('card-accent-snbt'))
