$req = [System.Net.WebRequest]::Create("https://nls-blog-plum.vercel.app/osn")
$req.AllowAutoRedirect = $true
$resp = $req.GetResponse()
$stream = $resp.GetResponseStream()
$reader = New-Object System.IO.StreamReader($stream)
$content = $reader.ReadToEnd()
$reader.Close()
$resp.Close()

Write-Host "=== VERIFYING DYNAMIC CALENDAR SECTION ON LIVE OSN PAGE ==="
Write-Host "1. Has osnCalendarApp():" $content.Contains("osnCalendarApp()")
Write-Host "2. Has /kalender/default-events.js:" $content.Contains("/kalender/default-events.js")
Write-Host "3. Has cal-side-dashboard:" $content.Contains("cal-side-dashboard")
Write-Host "4. Has calendarCells loop:" $content.Contains("calendarCells")
Write-Host "5. Has displayedEvents loop:" $content.Contains("displayedEvents")
