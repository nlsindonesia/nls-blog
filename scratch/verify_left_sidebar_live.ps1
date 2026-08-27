$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content
Write-Host "1. Full-height sidebar:" $res.Contains('h-screen')
Write-Host "2. Hideable toggle button:" $res.Contains('Sembunyikan Menu Sidebar')
Write-Host "3. Inline SVG icons:" $res.Contains('<svg class="w-4 h-4"')
