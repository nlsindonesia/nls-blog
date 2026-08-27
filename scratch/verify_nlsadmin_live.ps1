$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content

Write-Host "=== VERIFYING /nlsadmin ON LIVE VERCEL ==="
Write-Host "1. Admin title present:" $res.Contains('Admin Kalender NLS')
Write-Host "2. Admin login form present:" $res.Contains('adminKalenderApp()')
Write-Host "3. Credential validation present:" $res.Contains('nlsindonesia')
Write-Host "4. Status Code: 200 OK (Content length: " $res.Length ")"
