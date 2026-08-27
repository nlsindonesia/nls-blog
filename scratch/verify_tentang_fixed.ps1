Start-Sleep -Seconds 4
$url = "https://nls-blog-plum.vercel.app/tentang"
$res = Invoke-RestMethod -Uri $url -Method Get -Headers @{ "Cache-Control" = "no-cache" }
Write-Host "Contains 10.000+ with deep blue gradient style:" ($res.Contains("linear-gradient(135deg, #004B70 0%, #00263a 100%)"))
Write-Host "Contains fixed amber icon:" ($res.Contains("text-amber-600"))
