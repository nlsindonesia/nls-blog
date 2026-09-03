$cp1252_to_unicode = new-object int[] 256
for ($i=0; $i -lt 256; $i++) { $cp1252_to_unicode[$i] = $i }
$cp1252_to_unicode[0x80] = 0x20AC; $cp1252_to_unicode[0x81] = 0x0081; $cp1252_to_unicode[0x82] = 0x201A
$cp1252_to_unicode[0x83] = 0x0192; $cp1252_to_unicode[0x84] = 0x201E; $cp1252_to_unicode[0x85] = 0x2026
$cp1252_to_unicode[0x86] = 0x2020; $cp1252_to_unicode[0x87] = 0x2021; $cp1252_to_unicode[0x88] = 0x02C6
$cp1252_to_unicode[0x89] = 0x2030; $cp1252_to_unicode[0x8A] = 0x0160; $cp1252_to_unicode[0x8B] = 0x2039
$cp1252_to_unicode[0x8C] = 0x0152; $cp1252_to_unicode[0x8D] = 0x008D; $cp1252_to_unicode[0x8E] = 0x017D
$cp1252_to_unicode[0x8F] = 0x008F; $cp1252_to_unicode[0x90] = 0x0090; $cp1252_to_unicode[0x91] = 0x2018
$cp1252_to_unicode[0x92] = 0x2019; $cp1252_to_unicode[0x93] = 0x201C; $cp1252_to_unicode[0x94] = 0x201D
$cp1252_to_unicode[0x95] = 0x2022; $cp1252_to_unicode[0x96] = 0x2013; $cp1252_to_unicode[0x97] = 0x2014
$cp1252_to_unicode[0x98] = 0x02DC; $cp1252_to_unicode[0x99] = 0x2122; $cp1252_to_unicode[0x9A] = 0x0161
$cp1252_to_unicode[0x9B] = 0x203A; $cp1252_to_unicode[0x9C] = 0x0153; $cp1252_to_unicode[0x9D] = 0x009D
$cp1252_to_unicode[0x9E] = 0x017E; $cp1252_to_unicode[0x9F] = 0x0178

$unicode_to_cp1252 = @{}
for ($i=0; $i -lt 256; $i++) {
    $unicode_to_cp1252[[char]$cp1252_to_unicode[$i]] = [byte]$i
}

function Fix-Mojibake ($text) {
    # Match any sequence of 2 or more non-ASCII characters that might be mojibake
    $matches = [regex]::Matches($text, "[^\x00-\x7F]{2,5}")
    $uniqueMatches = $matches | Select-Object -ExpandProperty Value -Unique | Sort-Object Length -Descending
    
    $newText = $text
    foreach ($m in $uniqueMatches) {
        $isValid = $true
        $bytes = New-Object byte[] $m.Length
        for ($i=0; $i -lt $m.Length; $i++) {
            $c = $m[$i]
            if ($unicode_to_cp1252.ContainsKey($c)) {
                $bytes[$i] = $unicode_to_cp1252[$c]
            } else {
                $isValid = $false
                break
            }
        }
        
        if ($isValid) {
            # Attempt to decode as UTF8
            $utf8String = [System.Text.Encoding]::UTF8.GetString($bytes)
            # Valid UTF8 if it doesn't contain the replacement character U+FFFD
            if (-not $utf8String.Contains([char]0xFFFD) -and $utf8String.Length -lt $m.Length) {
                Write-Host "Replaced bytes to: $utf8String"
                $newText = $newText.Replace($m, $utf8String)
            }
        }
    }
    return $newText
}

$htmlFiles = Get-ChildItem -Path "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame" -Filter "*.html" -Recurse | Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\.git" }

$count = 0
foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $original = $content
    
    $content = Fix-Mojibake $content
    
    if ($content -cne $original) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        $count++
        Write-Host "Fixed file: "
    }
}
Write-Host "Total files fixed dynamically: $count"
