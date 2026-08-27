Start-Sleep -Seconds 4
$url = "https://nls-blog-plum.vercel.app/nlsadmin"
$res = Invoke-RestMethod -Uri $url -Method Get -Headers @{ "Cache-Control" = "no-cache" }
Write-Host "Contains fixed whatsappMessage string:" ($res.Contains("'Halo Next Level Study, saya ingin mendaftar kegiatan: ' + f.title"))
Write-Host "Does NOT contain broken unquoted string:" (-not $res.Contains("whatsappMessage: Halo Next Level Study"))
