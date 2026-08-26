$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/privat' -UseBasicParsing).Content
Write-Host "Contains paketPrivatModalContainer:" $res.Contains('paketPrivatModalContainer')
Write-Host "Contains template x-teleport body:" $res.Contains('<template x-teleport="body">')
