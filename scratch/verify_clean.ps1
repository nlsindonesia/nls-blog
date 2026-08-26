$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/privat' -UseBasicParsing).Content
Write-Host "Contains icon-[mdi--video]:" $res.Contains('icon-[mdi--video]')
Write-Host "Contains icon-[mdi--home-account]:" $res.Contains('icon-[mdi--home-account]')
Write-Host "Contains icon-[mdi--close]:" $res.Contains('icon-[mdi--close]')
Write-Host "Contains mojibake ðŸ:" $res.Contains('ðŸ')
