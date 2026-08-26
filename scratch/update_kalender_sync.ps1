$kalenderPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\kalender\index.html"
$content = [System.IO.File]::ReadAllText($kalenderPath, [System.Text.Encoding]::UTF8)

# 1. Add script tag in head if not present
if (-not $content.Contains('/kalender/default-events.js')) {
    $content = $content.Replace('<link rel="stylesheet" href="/build/assets/app-A86YIcNI.css" data-navigate-track="reload" />', "<script src=`"/kalender/default-events.js`"></script>`r`n    <link rel=`"stylesheet`" href=`"/build/assets/app-A86YIcNI.css`" data-navigate-track=`"reload`" />")
}

# 2. Replace the static 600-line events array in kalenderApp with dynamic loader & init sync
$startMarker = '// Comprehensive 2026 Events Dataset'
$endMarker = 'categoryLabel()'

$startIdx = $content.IndexOf($startMarker)
$endIdx = $content.IndexOf($endMarker)

if ($startIdx -ge 0 -and $endIdx -gt $startIdx) {
    $before = $content.Substring(0, $startIdx)
    $after = $content.Substring($endIdx)
    
    $replacement = @'
// Dynamic Events Dataset (Synced with /kalender-admin & localStorage)
                events: (function() {
                    try {
                        const stored = localStorage.getItem('nls_kalender_events_v1');
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                return parsed;
                            }
                        }
                    } catch (e) {}
                    return (typeof window.NLS_DEFAULT_EVENTS !== 'undefined') ? window.NLS_DEFAULT_EVENTS : [];
                })(),

                init() {
                    // Set active to August 2026 or current month
                    const now = new Date();
                    if (now.getFullYear() === 2026) {
                        this.currentMonth = now.getMonth();
                    } else {
                        this.currentMonth = 7;
                    }

                    // Sync from localStorage if present
                    try {
                        const stored = localStorage.getItem('nls_kalender_events_v1');
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                this.events = parsed;
                            }
                        } else if (typeof window.NLS_DEFAULT_EVENTS !== 'undefined') {
                            localStorage.setItem('nls_kalender_events_v1', JSON.stringify(window.NLS_DEFAULT_EVENTS));
                        }
                    } catch (e) {}

                    // Listen for cross-tab or admin storage updates
                    window.addEventListener('storage', (e) => {
                        if (e.key === 'nls_kalender_events_v1' && e.newValue) {
                            try {
                                this.events = JSON.parse(e.newValue);
                            } catch (err) {}
                        }
                    });

                    // Listen for in-window custom events
                    window.addEventListener('nls-events-updated', (e) => {
                        if (e.detail && Array.isArray(e.detail)) {
                            this.events = e.detail;
                        }
                    });
                },

                get monthLabel() {
                    return `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
                },

                
'@

    $newContent = $before + $replacement + $after
    [System.IO.File]::WriteAllText($kalenderPath, $newContent, [System.Text.Encoding]::UTF8)
    Write-Host "SUCCESS: Updated kalender/index.html with dynamic events loader and real-time live sync!"
} else {
    Write-Host "Error finding markers in kalender/index.html"
}
