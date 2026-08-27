$blogRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/blog' -UseBasicParsing).Content

Write-Host "=== VERIFYING 5 ARTICLES PER ROW ON LIVE VERCEL ==="
Write-Host "1. Grid contains xl:grid-cols-5:" $blogRes.Contains('xl:grid-cols-5')
Write-Host "2. Wide container max-w-[1700px] present:" $blogRes.Contains('max-w-[1700px]')
Write-Host "3. Responsive grid columns present:" $blogRes.Contains('grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5')
Write-Host "4. Compact banner height h-40 sm:h-44 present:" $blogRes.Contains('h-40 sm:h-44')
