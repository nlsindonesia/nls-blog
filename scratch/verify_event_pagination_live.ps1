$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content

Write-Host "=== VERIFYING PRESENT EVENT PAGINATION ON LIVE VERCEL ==="
Write-Host "1. paginatedEventsList present in template:" $adminRes.Contains('paginatedEventsList()')
Write-Host "2. eventPerPage set to 3 in state:" $adminRes.Contains('eventPerPage: 3')
Write-Host "3. Numbered pagination navigation bar present:" $adminRes.Contains('getEventPaginationRange()')
Write-Host "4. goToEventPage method present:" $adminRes.Contains('goToEventPage(p)')
Write-Host "5. Pagination status text present:" $adminRes.Contains('total agenda aktif')
