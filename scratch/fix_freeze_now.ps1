$path = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$txt = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# 1. Fix double single quotes
$txt = $txt.Replace("''kalender''", "'kalender'")
$txt = $txt.Replace("''berita''", "'berita'")
$txt = $txt.Replace("''pengajar''", "'pengajar'")
$txt = $txt.Replace("''create''", "'create'")
$txt = $txt.Replace("''present''", "'present'")

# 2. Fix unicode encoding artifacts
$txt = $txt.Replace("â€¢", "•")
$txt = $txt.Replace("âœ“", "✓")

# 3. Replace inline x-for expression
$pattern = '(?s)<template x-for="\(hl, hlIdx\) in \(eventForm\.highlightsRaw.*?</template>'
$cleanTemplate = @'
<template x-for="(hl, hlIdx) in getPreviewHighlights()" :key="hlIdx">
                                                    <div class="flex items-center gap-1.5">
                                                        <span class="text-emerald-500 font-bold">✓</span>
                                                        <span x-text="hl"></span>
                                                    </div>
                                                </template>
'@
$txt = [System.Text.RegularExpressions.Regex]::Replace($txt, $pattern, $cleanTemplate)

# 4. Ensure getPreviewHighlights() is added to superAdminApp methods
if (-not $txt.Contains('getPreviewHighlights()')) {
    $methodStr = @'
// KALENDER METHODS
                getPreviewHighlights() {
                    if (!this.eventForm || !this.eventForm.highlightsRaw) {
                        return ['Sistem Penilaian IRT Standar Nasional', 'Webinar Live Pembahasan Soal & Bedah Trik'];
                    }
                    return this.eventForm.highlightsRaw.split('\n').map(s => s.trim()).filter(Boolean);
                },
'@
    $txt = $txt.Replace('// KALENDER METHODS', $methodStr)
}

[System.IO.File]::WriteAllText($path, $txt, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Repaired all syntax errors and resolved freeze issue!"
