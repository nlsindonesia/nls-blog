$kalenderPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\kalender\index.html"
$defaultEventsPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\kalender\default-events.js"

$lines = [System.IO.File]::ReadAllLines($kalenderPath, [System.Text.Encoding]::UTF8)

$eventLines = @()
$recording = $false

for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    if ($line.Trim().StartsWith("events: [")) {
        $recording = $true
        $eventLines += "window.NLS_DEFAULT_EVENTS = ["
        continue
    }
    if ($recording) {
        if ($line.Trim().StartsWith("categoryLabel()")) {
            $recording = $false
            break
        }
        $eventLines += $line
    }
}

# The last line before categoryLabel() had a trailing comma after ']' - let's fix it to ';'
$lastIdx = $eventLines.Length - 1
while ($lastIdx -ge 0 -and [string]::IsNullOrWhiteSpace($eventLines[$lastIdx])) {
    $lastIdx--
}
if ($eventLines[$lastIdx].Trim().EndsWith(",")) {
    $eventLines[$lastIdx] = $eventLines[$lastIdx].TrimEnd().TrimEnd(",") + ";"
}

[System.IO.File]::WriteAllLines($defaultEventsPath, $eventLines, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Created kalender/default-events.js with" $eventLines.Length "lines!"
