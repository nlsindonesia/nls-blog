$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/privat' -UseBasicParsing).Content

Write-Host "=== VERIFYING VIBRANT MODAL SECTION 2 ON LIVE VERCEL ==="
Write-Host "1. Vibrant gradient Sky present:" $res.Contains('from-sky-500 to-blue-600')
Write-Host "2. Vibrant gradient Amber present:" $res.Contains('from-amber-400 via-amber-500 to-amber-600')
Write-Host "3. Vibrant gradient Purple present:" $res.Contains('from-purple-600 to-indigo-600')
Write-Host "4. Experience toggle cards present:" $res.Contains('Fondasi &amp; Konsep Dasar')
