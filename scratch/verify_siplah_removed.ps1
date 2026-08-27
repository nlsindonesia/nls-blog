Start-Sleep -Seconds 4
$url = "https://nls-blog-plum.vercel.app/tentang"
$res = Invoke-RestMethod -Uri $url -Method Get -Headers @{ "Cache-Control" = "no-cache" }
Write-Host "Does NOT contain SIPLaH card section:" (-not $res.Contains("Terdaftar Resmi di SIPLaH Kemendikbudristek"))
