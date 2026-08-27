$req = [System.Net.WebRequest]::Create("https://nls-blog-plum.vercel.app/")
$req.AllowAutoRedirect = $true
$resp = $req.GetResponse()
$stream = $resp.GetResponseStream()
$reader = New-Object System.IO.StreamReader($stream)
$content = $reader.ReadToEnd()
$reader.Close()
$resp.Close()

$idxKaleidoskop = $content.IndexOf('id="kaleidoskop"')
$idxKalender = $content.IndexOf('id="kalender"')
$idxBerita = $content.IndexOf('id="berita"')

Write-Host "=== VERIFYING HOMEPAGE CALENDAR ON LIVE VERCEL ==="
Write-Host "Index of id='kaleidoskop':" $idxKaleidoskop
Write-Host "Index of id='kalender':" $idxKalender
Write-Host "Index of id='berita':" $idxBerita
Write-Host "Position check (kaleidoskop < kalender):" ($idxKaleidoskop -lt $idxKalender)
Write-Host "Position check (kalender < berita):" ($idxKalender -lt $idxBerita)
Write-Host "Has homeCalendarApp():" $content.Contains("homeCalendarApp()")
Write-Host "Has /kalender/default-events.js:" $content.Contains("/kalender/default-events.js")
Write-Host "Has cal-side-dashboard:" $content.Contains("cal-side-dashboard")
Write-Host "Has getEventAdminCardClass:" $content.Contains("getEventAdminCardClass(event.category)")
