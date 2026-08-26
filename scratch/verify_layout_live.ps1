$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/privat' -UseBasicParsing).Content

Write-Host "=== VERIFYING FIXED LAYOUT ON LIVE VERCEL ==="
Write-Host "1. Flexbox layout present:" $res.Contains('display: flex; flex-direction: row; flex-wrap: wrap; gap: 36px;')
Write-Host "2. Active pill style with #0284c7 present:" $res.Contains('background: #0284c7 !important; color: #ffffff !important;')
