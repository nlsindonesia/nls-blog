$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content
$blogRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/blog' -UseBasicParsing).Content
$homeRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/' -UseBasicParsing).Content

Write-Host "=== VERIFYING REAL-TIME ARTICLE SYNC ON LIVE VERCEL ==="
Write-Host "1. BroadcastChannel in /nlsadmin:" $adminRes.Contains('BroadcastChannel(''nls_sync_channel'')')
Write-Host "2. BroadcastChannel in /blog:" $blogRes.Contains('BroadcastChannel(''nls_sync_channel'')')
Write-Host "3. BroadcastChannel in homepage:" $homeRes.Contains('BroadcastChannel(''nls_sync_channel'')')
Write-Host "4. Storage event listener in /blog:" $blogRes.Contains('nls_berita_articles_v1')
Write-Host "5. Storage event listener in homepage:" $homeRes.Contains('nls_berita_articles_v1')
