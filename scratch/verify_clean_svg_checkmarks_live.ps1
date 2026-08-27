$homeRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/' -UseBasicParsing).Content
$blogRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/blog' -UseBasicParsing).Content

Write-Host "=== VERIFYING CLEAN SVG CHECKMARKS ON LIVE VERCEL ==="
Write-Host "1. Homepage contains crisp SVG checkmark:" $homeRes.Contains('d="M5 13l4 4L19 7"')
Write-Host "2. Blog page contains crisp SVG checkmark:" $blogRes.Contains('d="M5 13l4 4L19 7"')
Write-Host "3. Homepage dropdown option checkmark is SVG:" $homeRes.Contains('svg x-show="selectedCategory === cat"')
Write-Host "4. Blog dropdown option checkmark is SVG:" $blogRes.Contains('svg x-show="selectedCategory === cat"')
