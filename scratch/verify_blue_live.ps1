$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/privat' -UseBasicParsing).Content

Write-Host "=== VERIFYING BLUE THEMED SECTION 2 ON LIVE VERCEL ==="
Write-Host "1. Selected background #e0f2fe present:" $res.Contains('background: #e0f2fe !important')
Write-Host "2. Text color #0f172a present:" $res.Contains('color: #0f172a !important')
Write-Host "3. Border color #0284c7 present:" $res.Contains('border-color: #0284c7 !important')
Write-Host "4. Number 2 badge background present:" $res.Contains('background: #0284c7 !important; color: #ffffff !important;')
