$res = Invoke-RestMethod -Uri "https://nls-blog-plum.vercel.app/kalender" -Method Get -Headers @{ "Cache-Control" = "no-cache" }
Write-Host "Contains text-slate-950 in badge:" ($res.Contains("text-slate-950"))
Write-Host "Contains pill-osn with color #0f172a:" ($res.Contains("color: #0f172a !important;"))
