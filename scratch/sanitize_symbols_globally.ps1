$targetFiles = Get-ChildItem -Path "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame" -Include @("*.html", "*.js") -Recurse -File | Where-Object { $_.FullName -notmatch '\\.git\\' }

$bullet = [char]0x2022

foreach ($f in $targetFiles) {
    $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $orig = $content

    # 1. Replace JavaScript string concatenation with clean ASCII unicode escape or hyphen
    $content = $content.Replace("event.mode + ' $bullet ' + event.location", "event.mode + (event.location ? ' - ' + event.location : '')")
    $content = $content.Replace("event.mode + ' • ' + event.location", "event.mode + (event.location ? ' - ' + event.location : '')")
    $content = $content.Replace("(eventForm.mode || 'Online') + ' $bullet ' + (eventForm.location || 'Platform CBT NLS')", "(eventForm.mode || 'Online') + ' - ' + (eventForm.location || 'Platform CBT NLS')")
    $content = $content.Replace("(eventForm.mode || 'Online') + ' • ' + (eventForm.location || 'Platform CBT NLS')", "(eventForm.mode || 'Online') + ' - ' + (eventForm.location || 'Platform CBT NLS')")
    $content = $content.Replace("currentQ.badge + ' $bullet ' + currentQ.category", "currentQ.badge + ' - ' + currentQ.category")
    $content = $content.Replace("currentQ.badge + ' • ' + currentQ.category", "currentQ.badge + ' - ' + currentQ.category")

    # 2. Replace HTML spans with &bull;
    $content = $content.Replace("<span>$bullet</span>", "<span>&bull;</span>")
    $content = $content.Replace("<span>•</span>", "<span>&bull;</span>")
    $content = $content.Replace(">$bullet<", ">&bull;<")
    $content = $content.Replace(">•<", ">&bull;<")

    # 3. Replace text with &bull;
    $content = $content.Replace(" • ", " &bull; ")
    $content = $content.Replace(" $bullet ", " &bull; ")

    if ($content -ne $orig) {
        [System.IO.File]::WriteAllText($f.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "SANITIZED SYMBOLS IN: $($f.Name)"
    }
}

Write-Host "SUCCESS: Completed global symbol sanitization!"
