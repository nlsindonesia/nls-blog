$req = [System.Net.WebRequest]::Create("https://nls-blog-plum.vercel.app/")
$req.AllowAutoRedirect = $true
$resp = $req.GetResponse()
$stream = $resp.GetResponseStream()
$reader = New-Object System.IO.StreamReader($stream)
$content = $reader.ReadToEnd()
$reader.Close()
$resp.Close()

Write-Host "=== VERIFYING HOMEPAGE CALENDAR ON LIVE VERCEL ==="
Write-Host "1. Has homeCalendarApp():" $content.Contains("homeCalendarApp()")
Write-Host "2. Has /kalender/default-events.js:" $content.Contains("/kalender/default-events.js")
Write-Host "3. Has cal-side-dashboard:" $content.Contains("cal-side-dashboard")
Write-Host "4. Position check (kaleidoskop before kalender):" ($content.IndexOf("id=`"kaleidoskop`"") -lt $content.IndexOf("id=`"kalender`""))
Write-Host "5. Position check (kalender before berita):" ($content.IndexOf("id=`"kalender`"") -lt $content.IndexOf("id=`"berita`""))
Write-Host "6. Has getEventAdminCardClass:" $content.Contains("getEventAdminCardClass(event.category)")
