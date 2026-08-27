$blogRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/blog' -UseBasicParsing).Content
Write-Host "Contains 3D feature cards section HTML:" $blogRes.Contains('-mt-10 relative z-20')
