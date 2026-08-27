$targetFiles = @(
    "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\kalender\index.html",
    "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\index.html",
    "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\osn\index.html",
    "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
)

$newBadgeMethod = @"
getEventCategoryBadge(cat) {
                    switch (cat) {
                        case 'OSN':
                            return 'bg-white/95 dark:bg-sky-950/90 text-slate-950 dark:text-white font-black border-2 border-sky-400 dark:border-sky-500 shadow-xs';
                        case 'TKA':
                            return 'bg-white/95 dark:bg-amber-950/90 text-slate-950 dark:text-white font-black border-2 border-amber-400 dark:border-amber-500 shadow-xs';
                        case 'SNBT':
                            return 'bg-white/95 dark:bg-emerald-950/90 text-slate-950 dark:text-white font-black border-2 border-emerald-400 dark:border-emerald-500 shadow-xs';
                        case 'Mitra Sekolah':
                            return 'bg-white/95 dark:bg-purple-950/90 text-slate-950 dark:text-white font-black border-2 border-purple-400 dark:border-purple-500 shadow-xs';
                        case 'Event Dinas':
                            return 'bg-white/95 dark:bg-rose-950/90 text-slate-950 dark:text-white font-black border-2 border-rose-400 dark:border-rose-500 shadow-xs';
                        default:
                            return 'bg-white/95 dark:bg-slate-900 text-slate-950 dark:text-white font-black border-2 border-slate-400 shadow-xs';
                    }
                }
"@

$badgeRegex = '(?s)getEventCategoryBadge\s*\(\s*cat\s*\)\s*\{.*?switch\s*\(\s*cat\s*\)\s*\{.*?default:.*?\}\s*\}'

foreach ($fPath in $targetFiles) {
    if (Test-Path $fPath) {
        $content = [System.IO.File]::ReadAllText($fPath, [System.Text.Encoding]::UTF8)
        
        if ($content -match $badgeRegex) {
            $content = [regex]::Replace($content, $badgeRegex, $newBadgeMethod)
            Write-Host "Updated getEventCategoryBadge with black text in $fPath"
        }
        
        # Also ensure .pill-* classes have black text
        $content = $content.Replace('.pill-osn { background: #e0f2fe; color: #0369a1;', '.pill-osn { background: #e0f2fe; color: #0f172a !important; font-weight: 800;')
        $content = $content.Replace('.pill-tka { background: #fef3c7; color: #92400e;', '.pill-tka { background: #fef3c7; color: #0f172a !important; font-weight: 800;')
        $content = $content.Replace('.pill-snbt { background: #d1fae5; color: #065f46;', '.pill-snbt { background: #d1fae5; color: #0f172a !important; font-weight: 800;')
        $content = $content.Replace('.pill-mitra { background: #f3e8ff; color: #6b21a8;', '.pill-mitra { background: #f3e8ff; color: #0f172a !important; font-weight: 800;')
        $content = $content.Replace('.pill-dinas { background: #ffe4e6; color: #be123c;', '.pill-dinas { background: #ffe4e6; color: #0f172a !important; font-weight: 800;')
        
        [System.IO.File]::WriteAllText($fPath, $content, [System.Text.Encoding]::UTF8)
    }
}

# Also update theme.css for .pill-*
$themePath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\theme.css"
$themeContent = [System.IO.File]::ReadAllText($themePath, [System.Text.Encoding]::UTF8)
$themeContent = $themeContent.Replace('.pill-osn { background: #e0f2fe; color: #0369a1;', '.pill-osn { background: #e0f2fe; color: #0f172a !important; font-weight: 800;')
$themeContent = $themeContent.Replace('.pill-tka { background: #fef3c7; color: #92400e;', '.pill-tka { background: #fef3c7; color: #0f172a !important; font-weight: 800;')
$themeContent = $themeContent.Replace('.pill-snbt { background: #d1fae5; color: #065f46;', '.pill-snbt { background: #d1fae5; color: #0f172a !important; font-weight: 800;')
$themeContent = $themeContent.Replace('.pill-mitra { background: #f3e8ff; color: #6b21a8;', '.pill-mitra { background: #f3e8ff; color: #0f172a !important; font-weight: 800;')
$themeContent = $themeContent.Replace('.pill-dinas { background: #ffe4e6; color: #be123c;', '.pill-dinas { background: #ffe4e6; color: #0f172a !important; font-weight: 800;')

[System.IO.File]::WriteAllText($themePath, $themeContent, [System.Text.Encoding]::UTF8)
Write-Host "Updated theme.css"
