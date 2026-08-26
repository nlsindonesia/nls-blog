$kalenderPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\kalender\index.html"
$lines = [System.IO.File]::ReadAllLines($kalenderPath, [System.Text.Encoding]::UTF8)

$outLines = @()
$skipping = $false

for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    
    # Add script in head
    if ($line.Contains('<link rel="stylesheet" href="/build/assets/app-A86YIcNI.css" data-navigate-track="reload" />')) {
        $outLines += '    <script src="/kalender/default-events.js"></script>'
        $outLines += $line
        continue
    }

    if ($line.Trim().StartsWith("// Comprehensive 2026 Events Dataset")) {
        $skipping = $true
        # Insert replacement lines
        $outLines += '                // Dynamic Events Dataset (Synced with /kalender-admin & localStorage)'
        $outLines += '                events: (function() {'
        $outLines += '                    try {'
        $outLines += '                        const stored = localStorage.getItem("nls_kalender_events_v1");'
        $outLines += '                        if (stored) {'
        $outLines += '                            const parsed = JSON.parse(stored);'
        $outLines += '                            if (Array.isArray(parsed) && parsed.length > 0) {'
        $outLines += '                                return parsed;'
        $outLines += '                            }'
        $outLines += '                        }'
        $outLines += '                    } catch (e) {}'
        $outLines += '                    return (typeof window.NLS_DEFAULT_EVENTS !== "undefined") ? window.NLS_DEFAULT_EVENTS : [];'
        $outLines += '                })(),'
        $outLines += ''
        $outLines += '                init() {'
        $outLines += '                    // Set active to August 2026 or current month'
        $outLines += '                    const now = new Date();'
        $outLines += '                    if (now.getFullYear() === 2026) {'
        $outLines += '                        this.currentMonth = now.getMonth();'
        $outLines += '                    } else {'
        $outLines += '                        this.currentMonth = 7;'
        $outLines += '                    }'
        $outLines += ''
        $outLines += '                    // Sync from localStorage if present'
        $outLines += '                    try {'
        $outLines += '                        const stored = localStorage.getItem("nls_kalender_events_v1");'
        $outLines += '                        if (stored) {'
        $outLines += '                            const parsed = JSON.parse(stored);'
        $outLines += '                            if (Array.isArray(parsed) && parsed.length > 0) {'
        $outLines += '                                this.events = parsed;'
        $outLines += '                            }'
        $outLines += '                        } else if (typeof window.NLS_DEFAULT_EVENTS !== "undefined") {'
        $outLines += '                            localStorage.setItem("nls_kalender_events_v1", JSON.stringify(window.NLS_DEFAULT_EVENTS));'
        $outLines += '                        }'
        $outLines += '                    } catch (e) {}'
        $outLines += ''
        $outLines += '                    // Listen for cross-tab or admin storage updates'
        $outLines += '                    window.addEventListener("storage", (e) => {'
        $outLines += '                        if (e.key === "nls_kalender_events_v1" && e.newValue) {'
        $outLines += '                            try {'
        $outLines += '                                this.events = JSON.parse(e.newValue);'
        $outLines += '                            } catch (err) {}'
        $outLines += '                        }'
        $outLines += '                    });'
        $outLines += ''
        $outLines += '                    // Listen for in-window custom events'
        $outLines += '                    window.addEventListener("nls-events-updated", (e) => {'
        $outLines += '                        if (e.detail && Array.isArray(e.detail)) {'
        $outLines += '                            this.events = e.detail;'
        $outLines += '                        }'
        $outLines += '                    });'
        $outLines += '                },'
        $outLines += ''
        $outLines += '                get monthLabel() {'
        $outLines += '                    return `${this.monthNames[this.currentMonth]} ${this.currentYear}`;'
        $outLines += '                },'
        $outLines += ''
        continue
    }

    if ($skipping) {
        if ($line.Trim().StartsWith("categoryLabel()")) {
            $skipping = $false
            $outLines += $line
        }
        continue
    }

    $outLines += $line
}

[System.IO.File]::WriteAllLines($kalenderPath, $outLines, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Dynamic loader and live sync added to kalender/index.html!"
