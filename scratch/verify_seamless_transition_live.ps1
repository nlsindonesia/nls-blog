$blogRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/blog' -UseBasicParsing).Content

Write-Host "=== VERIFYING SEAMLESS TRANSITION ON LIVE VERCEL ==="
Write-Host "1. Organic wave divider present:" $blogRes.Contains('Seamless Organic Wave Divider')
Write-Host "2. Floating overlapping container -mt-12 sm:-mt-16 present:" $blogRes.Contains('-mt-12 sm:-mt-16')
Write-Host "3. Ambient mesh glowing background present:" $blogRes.Contains('Ambient Glowing Mesh Background')
Write-Host "4. Floating glassmorphic control bar present:" $blogRes.Contains('backdrop-blur-xl')
Write-Host "5. Grid 5 columns present:" $blogRes.Contains('xl:grid-cols-5')
