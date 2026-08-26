$css = [System.IO.File]::ReadAllText('c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\build\assets\app-A86YIcNI.css', [System.Text.Encoding]::UTF8)
$matches = [System.Text.RegularExpressions.Regex]::Matches($css, 'icon-\[[^\]]+\]')
$list = @()
foreach ($m in $matches) {
    $list += $m.Value
}
$list | Select-Object -Unique | Sort-Object | ForEach-Object { Write-Host $_ }
