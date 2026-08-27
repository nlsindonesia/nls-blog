$htmlFiles = Get-ChildItem -Path "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame" -Include "*.html" -Recurse -File | Where-Object { $_.FullName -notmatch '\\.git\\' }

foreach ($f in $htmlFiles) {
    $lines = [System.IO.File]::ReadAllLines($f.FullName, [System.Text.Encoding]::UTF8)
    for ($i = 0; $i -lt $lines.Length; $i++) {
        $line = $lines[$i]
        # Look for suspicious patterns where text-white might be on light background without dark: or without a solid colored bg
        if ($line -match 'text-white' -and ($line -match 'bg-white' -or $line -match 'bg-slate-50' -or $line -match 'bg-slate-100' -or $line -match 'bg-surface' -or $line -match 'bg-gray-50')) {
            # Check if there is a dark mode prefix or colored gradient on the same element
            if ($line -notmatch 'dark:text-white' -and $line -notmatch 'from-' -and $line -notmatch 'bg-sky-' -and $line -notmatch 'bg-blue-' -and $line -notmatch 'bg-primary' -and $line -notmatch 'bg-indigo-' -and $line -notmatch 'bg-emerald-' -and $line -notmatch 'bg-rose-' -and $line -notmatch 'bg-amber-' -and $line -notmatch 'bg-slate-800' -and $line -notmatch 'bg-slate-900' -and $line -notmatch 'bg-black' -and $line -notmatch 'bg-\[\#FF8A00\]' -and $line -notmatch 'bg-\[\#0284c7\]' -and $line -notmatch 'bg-\[\#131D38\]') {
                Write-Host "$($f.Name):$($i+1) -> $line"
            }
        }
    }
}
