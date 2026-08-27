$htmlFiles = Get-ChildItem -Path "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame" -Include "*.html" -Recurse -File | Where-Object { $_.FullName -notmatch '\\.git\\' }

Write-Host "=== AUDITING WHITE TEXT / WHITE LOGOS ON WHITE BACKGROUNDS ==="

foreach ($f in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $lines = $content.Split("`n")

    for ($i = 0; $i -lt $lines.Length; $i++) {
        $line = $lines[$i].Trim()

        # Pattern 1: class containing text-white without a solid dark bg
        if ($line -match 'text-white' -and $line -notmatch 'dark:text-white') {
            # Check if this line has bg-white or is inside a light element
            if ($line -match 'bg-white[^/]' -or $line -match 'bg-slate-50' -or $line -match 'bg-slate-100' -or $line -match 'bg-gray-50' -or $line -match 'bg-surface' -or $line -match 'bg-transparent' -or $line -match 'border-white\b') {
                if ($line -notmatch 'bg-gradient' -and $line -notmatch 'bg-sky-' -and $line -notmatch 'bg-blue-' -and $line -notmatch 'bg-primary' -and $line -notmatch 'bg-indigo-' -and $line -notmatch 'bg-emerald-' -and $line -notmatch 'bg-rose-' -and $line -notmatch 'bg-amber-' -and $line -notmatch 'bg-slate-800' -and $line -notmatch 'bg-slate-900' -and $line -notmatch 'bg-black' -and $line -notmatch 'bg-\[\#FF8A00\]' -and $line -notmatch 'bg-\[\#0284c7\]' -and $line -notmatch 'bg-\[\#131D38\]') {
                    Write-Host "$($f.Name):$($i+1) -> $line"
                }
            }
        }

        # Pattern 2: color: white / color: #fff in style attribute on light elements
        if ($line -match 'color:\s*(#fff|white|#ffffff)' -and $line -match 'background:\s*(#fff|white|#ffffff|transparent)') {
            Write-Host "$($f.Name):$($i+1) [INLINE STYLE] -> $line"
        }
    }
}
