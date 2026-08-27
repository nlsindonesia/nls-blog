$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content

Write-Host "=== VERIFYING FULL-COLOR PRESENT EVENT ON LIVE VERCEL ==="
Write-Host "1. Active page vibrant gradient & contrast border:" $adminRes.Contains('linear-gradient(135deg, #0284c7 0%, #0369a1 100%)')
Write-Host "2. Card vibrant border CSS present:" $adminRes.Contains('2.5px solid #38bdf8')
Write-Host "3. Edit button full-color class present:" $adminRes.Contains('bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/30')
Write-Host "4. Duplicate button full-color class present:" $adminRes.Contains('bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30')
Write-Host "5. Delete button full-color class present:" $adminRes.Contains('bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30')
Write-Host "6. Pagination status badge color styling present:" $adminRes.Contains('from-sky-50 to-indigo-50')
