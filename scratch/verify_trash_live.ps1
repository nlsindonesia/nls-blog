$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content

Write-Host "=== VERIFYING SUPER ADMIN TRASH SYSTEM ON LIVE VERCEL ==="
Write-Host "1. Kalender Trash Submenu button present:" $adminRes.Contains('openTrashEventView()')
Write-Host "2. Berita Trash Submenu button present:" $adminRes.Contains('openTrashNewsView()')
Write-Host "3. Pengajar Trash Submenu button present:" $adminRes.Contains('openTrashTeacherView()')
Write-Host "4. Kalender Trash View present:" $adminRes.Contains('kalenderView === ''trash''')
Write-Host "5. Berita Trash View present:" $adminRes.Contains('beritaView === ''trash''')
Write-Host "6. Pengajar Trash View present:" $adminRes.Contains('pengajarView === ''trash''')
Write-Host "7. Restore & Permanent Delete methods present:" ($adminRes.Contains('restoreEvent') -and $adminRes.Contains('restoreArticle') -and $adminRes.Contains('restoreTeacher'))
Write-Host "8. Trash datasets initialized from LocalStorage:" ($adminRes.Contains('trashEvents:') -and $adminRes.Contains('trashArticles:') -and $adminRes.Contains('trashTeachers:'))
