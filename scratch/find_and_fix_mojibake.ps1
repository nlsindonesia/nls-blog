$files = Get-ChildItem -Path "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame" -Include *.html,*.js,*.json -Recurse -File

Write-Host "Scanning for corrupted mojibake characters in $($files.Count) files..."

$replacements = @{
    'ðŸ” ' = '🔍 '
    'ðŸ”' = '🔍'
    'ðŸ †' = '🏆'
    'ðŸ“Š' = '📊'
    'ðŸŽ¯' = '🎯'
    'ðŸ¤ ' = '🤝'
    'ðŸ ›ï¸ ' = '🏛️'
    'ðŸ ›' = '🏛️'
    'ðŸ“…' = '📅'
    'ðŸ’¡' = '💡'
    'ðŸ“¢' = '📢'
    'ðŸŽ“' = '🎓'
    'ðŸš€' = '🚀'
    'ðŸ“ ' = '📝'
    'â€¢' = '•'
    'â€"' = '—'
    'â€“' = '–'
    'â€œ' = '"'
    'â€' = '"'
    'â€™' = "'"
    'â€˜' = "'"
    'ðŸ' = ''
    'ï¸' = ''
}

foreach ($f in $files) {
    if ($f.FullName -like "*\.git\*" -or $f.FullName -like "*node_modules\*") { continue }
    $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $modified = $false

    foreach ($key in $replacements.Keys) {
        if ($content.Contains($key)) {
            $content = $content.Replace($key, $replacements[$key])
            $modified = $true
            Write-Host "Replaced '$key' in $($f.Name)"
        }
    }

    if ($modified) {
        [System.IO.File]::WriteAllText($f.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "SAVED cleaned file: $($f.FullName)"
    }
}

Write-Host "Completed scan and fix!"
