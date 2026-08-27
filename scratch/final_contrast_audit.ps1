$htmlFiles = Get-ChildItem -Path "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame" -Include "*.html" -Recurse -File | Where-Object { $_.FullName -notmatch '\\.git\\' -and $_.FullName -notmatch 'scratch' -and $_.FullName -notmatch '_old' }

Write-Host "=== FINAL EXHAUSTIVE CHECK FOR WHITE ON WHITE ==="
$foundCount = 0

foreach ($f in $htmlFiles) {
    $lines = [System.IO.File]::ReadAllLines($f.FullName, [System.Text.Encoding]::UTF8)
    for ($i = 0; $i -lt $lines.Length; $i++) {
        $line = $lines[$i]
        
        # Check if line has text-white or white text inline
        if ($line -match 'text-white' -and $line -notmatch 'dark:text-white') {
            # If the same tag has bg-white, bg-slate-50, bg-slate-100, bg-surface, or no background at all in a light section
            if ($line -match 'bg-white[^/]' -or $line -match 'bg-slate-50' -or $line -match 'bg-slate-100' -or $line -match 'bg-surface' -or $line -match 'bg-gray-50') {
                if ($line -notmatch 'bg-sky-' -and $line -notmatch 'bg-blue-' -and $line -notmatch 'bg-primary' -and $line -notmatch 'bg-indigo-' -and $line -notmatch 'bg-emerald-' -and $line -notmatch 'bg-rose-' -and $line -notmatch 'bg-amber-' -and $line -notmatch 'bg-slate-800' -and $line -notmatch 'bg-slate-900' -and $line -notmatch 'bg-black' -and $line -notmatch 'bg-\[\#FF8A00\]' -and $line -notmatch 'bg-\[\#0284c7\]' -and $line -notmatch 'bg-\[\#131D38\]' -and $line -notmatch 'from-' -and $line -notmatch 'bg-gradient') {
                    Write-Host "CRITICAL ISSUE: [$($f.Name):$($i+1)] $line"
                    $foundCount++
                }
            }
        }
    }
}

if ($foundCount -eq 0) {
    Write-Host "SUCCESS: Zero instances of text-white directly on light backgrounds found across all HTML files!"
} else {
    Write-Host "Total issues found: $foundCount"
}
