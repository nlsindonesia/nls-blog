$kalenderPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\kalender\index.html"
$defaultEventsPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\kalender\default-events.js"

$content = [System.IO.File]::ReadAllText($kalenderPath, [System.Text.Encoding]::UTF8)

$startMarker = 'events: ['
$endMarker = 'categoryLabel()'

$startIdx = $content.IndexOf($startMarker)
$endIdx = $content.IndexOf($endMarker)

if ($startIdx -ge 0 -and $endIdx -gt $startIdx) {
    # Extract the array text: from '[' to the last ']' before categoryLabel
    $sub = $content.Substring($startIdx + 8, ($endIdx - ($startIdx + 8)))
    $lastBracket = $sub.LastIndexOf(']')
    $eventsArrayStr = $sub.Substring(0, $lastBracket + 1).Trim()
    
    $jsContent = "// Default Master Dataset Kalender NLS`r`nwindow.NLS_DEFAULT_EVENTS = " + $eventsArrayStr + ";"
    [System.IO.File]::WriteAllText($defaultEventsPath, $jsContent, [System.Text.Encoding]::UTF8)
    Write-Host "SUCCESS: Created kalender/default-events.js with master events dataset!"
} else {
    Write-Host "Error finding markers in kalender/index.html"
}
