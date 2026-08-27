# ==============================================================================
# Comprehensive Mojibake Fix Across All HTML, JS, CSS, and Markdown Files
# ==============================================================================

$targetExtensions = @("*.html", "*.js", "*.css", "*.md")
$rootDir = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame"

$files = Get-ChildItem -Path $rootDir -Include $targetExtensions -Recurse -File | Where-Object { $_.FullName -notmatch '\\.git\\' }

$replacements = @{
    'â€¢' = '•'
    'âœ“' = '✓'
    'âœ”' = '✔'
    'â€“' = '–'
    'â€”' = '—'
    'â€˜' = "'"
    'â€™' = "'"
    'â€œ' = '"'
    'â€' = '"'
    'â€¦' = '...'
    'â ' = ''
    'Ã—' = '×'
    'â–¼' = '▼'
    'â–²' = '▲'
    'â†’' = '→'
    'â†\u0090' = '←'
}

$fixedCount = 0

foreach ($f in $files) {
    $raw = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $modified = $raw
    
    # 1. Replace specific string concatenation with safe bullet or hyphen
    $modified = $modified.Replace("event.mode + ' â€¢ ' + event.location", "event.mode + ' • ' + event.location")
    $modified = $modified.Replace('event.mode + " â€¢ " + event.location', 'event.mode + " • " + event.location')
    
    # 2. Replace all dictionary entries
    foreach ($k in $replacements.Keys) {
        if ($modified.Contains($k)) {
            $modified = $modified.Replace($k, $replacements[$k])
        }
    }

    if ($modified -ne $raw) {
        [System.IO.File]::WriteAllText($f.FullName, $modified, [System.Text.Encoding]::UTF8)
        Write-Host "FIXED MOJIBAKE IN: $($f.FullName.Replace($rootDir, ''))"
        $fixedCount++
    }
}

Write-Host "Total files cleaned: $fixedCount"
