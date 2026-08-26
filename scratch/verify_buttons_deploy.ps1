Start-Sleep -Seconds 5
$res = Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/privat' -UseBasicParsing
Write-Host "Status Code:" $res.StatusCode
Write-Host "Contains openPrivatPackage:" $res.Content.Contains('openPrivatPackage')
Write-Host "Contains `$store.paketPrivat.open:" $res.Content.Contains('$store.paketPrivat.open')
Write-Host "Contains x-data on grid:" $res.Content.Contains('x-data class="grid grid-cols-1 lg:grid-cols-3')
