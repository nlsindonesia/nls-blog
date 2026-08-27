$htmlFiles = Get-ChildItem -Path "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame" -Include "*.html" -Recurse -File | Where-Object { $_.FullName -notmatch '\\.git\\' -and $_.FullName -notmatch 'scratch' -and $_.FullName -notmatch '_old' }

$report = @()

foreach ($f in $htmlFiles) {
    $lines = [System.IO.File]::ReadAllLines($f.FullName, [System.Text.Encoding]::UTF8)
    for ($i = 0; $i -lt $lines.Length; $i++) {
        $line = $lines[$i]
        if ($line -match 'text-white' -or $line -match 'color:\s*(white|#fff|#ffffff)' -or $line -match 'stroke="white"' -or $line -match 'fill="white"') {
            # Check if this line is in a component or card
            $report += [PSCustomObject]@{
                File = $f.Name
                Line = $i + 1
                Text = $line.Trim()
            }
        }
    }
}

Write-Host "Total matches with white font/stroke/fill: $($report.Count)"
# Filter out obvious dark backgrounds
$suspicious = $report | Where-Object {
    $_.Text -notmatch 'dark:text-white' -and
    $_.Text -notmatch 'bg-primary' -and
    $_.Text -notmatch 'bg-action-blue' -and
    $_.Text -notmatch 'bg-secondary' -and
    $_.Text -notmatch 'bg-sky-[5-9]00' -and
    $_.Text -notmatch 'bg-blue-[5-9]00' -and
    $_.Text -notmatch 'bg-indigo-[5-9]00' -and
    $_.Text -notmatch 'bg-purple-[5-9]00' -and
    $_.Text -notmatch 'bg-emerald-[5-9]00' -and
    $_.Text -notmatch 'bg-teal-[5-9]00' -and
    $_.Text -notmatch 'bg-rose-[5-9]00' -and
    $_.Text -notmatch 'bg-red-[5-9]00' -and
    $_.Text -notmatch 'bg-amber-[5-9]00' -and
    $_.Text -notmatch 'bg-orange-[5-9]00' -and
    $_.Text -notmatch 'bg-slate-[7-9]00' -and
    $_.Text -notmatch 'bg-gray-[7-9]00' -and
    $_.Text -notmatch 'bg-black' -and
    $_.Text -notmatch 'bg-\[\#FF8A00\]' -and
    $_.Text -notmatch 'bg-\[\#0284c7\]' -and
    $_.Text -notmatch 'bg-\[\#004B70\]' -and
    $_.Text -notmatch 'bg-\[\#0B5A8A\]' -and
    $_.Text -notmatch 'bg-\[\#131D38\]' -and
    $_.Text -notmatch 'bg-\[\#006493\]' -and
    $_.Text -notmatch 'bg-\[\#004d73\]' -and
    $_.Text -notmatch 'bg-\[\#e11d48\]' -and
    $_.Text -notmatch 'bg-\[\#059669\]' -and
    $_.Text -notmatch 'bg-\[\#7c3aed\]' -and
    $_.Text -notmatch 'bg-\[\#d97706\]' -and
    $_.Text -notmatch 'bg-\[\#0d9488\]' -and
    $_.Text -notmatch 'bg-\[\#ea580c\]' -and
    $_.Text -notmatch 'bg-gradient' -and
    $_.Text -notmatch 'linear-gradient' -and
    $_.Text -notmatch 'from-' -and
    $_.Text -notmatch 'hover:text-white'
}

Write-Host "Suspicious count after filtering obvious dark backgrounds: $($suspicious.Count)"
$suspicious | ForEach-Object {
    Write-Host "[$($_.File):$($_.Line)] $($_.Text)"
}
