$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content
Write-Host "Contains 'total agenda aktif':" $adminRes.Contains('total agenda aktif')
Write-Host "Contains 'Menampilkan':" $adminRes.Contains('Menampilkan')
Write-Host "Contains 'getEventPaginationRange':" $adminRes.Contains('getEventPaginationRange')
Write-Host "Contains 'goToEventPage':" $adminRes.Contains('goToEventPage')
