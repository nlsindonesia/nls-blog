$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/privat' -UseBasicParsing).Content

Write-Host "=== VERIFYING CTA BANNER REMOVED ON LIVE VERCEL ==="
Write-Host "CTA banner 'Siap untuk Melejitkan Akademikmu?' present:" $res.Contains('Siap untuk Melejitkan Akademikmu?')
