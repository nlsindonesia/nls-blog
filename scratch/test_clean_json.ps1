# PowerShell script to accurately parse default-articles.js, default-events.js, and default-teachers.js
$baseDir = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame"

function Clean-JsToJson([string]$jsContent, [string]$varName) {
    # Extract the array part: window.NLS_DEFAULT_... = [ ... ];
    $pattern = '(?s)window\.' + [regex]::Escape($varName) + '\s*=\s*(\[[\s\S]*\]);?'
    $m = [regex]::Match($jsContent, $pattern)
    if (-not $m.Success) {
        # Try without window.
        $pattern2 = '(?s)' + [regex]::Escape($varName) + '\s*=\s*(\[[\s\S]*\]);?'
        $m = [regex]::Match($jsContent, $pattern2)
    }
    if (-not $m.Success) { return $null }
    
    $raw = $m.Groups[1].Value
    
    # Remove single line comments // ...
    $raw = [regex]::Replace($raw, '(?m)^\s*//.*?$', '')
    $raw = [regex]::Replace($raw, '(?m)//[^"'']+$', '')
    
    # Convert single-quoted strings to double-quoted JSON strings
    # But preserve internal double quotes
    return $raw
}

# Test articles
$artPath = Join-Path $baseDir "blog\default-articles.js"
$artContent = [System.IO.File]::ReadAllText($artPath, [System.Text.Encoding]::UTF8)
$artClean = Clean-JsToJson $artContent "NLS_DEFAULT_ARTICLES"
Write-Host "Articles extracted chars:" $artClean.Length

try {
    $parsedArticles = ConvertFrom-Json $artClean
    Write-Host "Articles parsed successfully! Count:" $parsedArticles.Count
} catch {
    Write-Host "Articles JSON error: $_"
}

# Test events
$evtPath = Join-Path $baseDir "kalender\default-events.js"
$evtContent = [System.IO.File]::ReadAllText($evtPath, [System.Text.Encoding]::UTF8)
$evtClean = Clean-JsToJson $evtContent "NLS_DEFAULT_EVENTS"

# In events, replace single quotes with double quotes
# Let's inspect
Write-Host "Events extracted chars:" $evtClean.Length
