$res = Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/privat' -UseBasicParsing
Write-Host "Status Code:" $res.StatusCode
Write-Host "Contains openPackageModal:" $res.Content.Contains('openPackageModal')
Write-Host "Contains privatApp:" $res.Content.Contains('privatApp')
Write-Host "Contains Formulir Pendaftaran:" $res.Content.Contains('FORMULIR PENDAFTARAN LES PRIVAT NLS')
