$pengajarPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\pengajar\index.html"
$content = [System.IO.File]::ReadAllText($pengajarPath, [System.Text.Encoding]::UTF8)

# 1. Add script tag to head
if (-not $content.Contains('/pengajar/default-teachers.js')) {
    $content = $content.Replace('<script type="module" src="/build/assets/app-Bzd4avQC.js" data-navigate-track="reload"></script>', '<script type="module" src="/build/assets/app-Bzd4avQC.js" data-navigate-track="reload"></script>' + "`n    <script src=`"/pengajar/default-teachers.js`"></script>")
}

# 2. Update teachers initialization in teachersApp()
$oldTeachersPattern = '(?s)\/\/ Comprehensive Professional Teachers Dataset \(100% Multi-Aspect Coverage\)\s*teachers:\s*\[\s*\{\s*id:\s*''t-1'',.*?\}\s*\],\s*\/\/ Methods & Getters'

$newTeachersInit = @'
// Comprehensive Professional Teachers Dataset (Synced with /nlsadmin & localStorage)
                teachers: (function() {
                    try {
                        const stored = localStorage.getItem("nls_pengajar_teachers_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                return parsed;
                            }
                        }
                    } catch (e) {}
                    return (typeof window.NLS_DEFAULT_TEACHERS !== "undefined") ? window.NLS_DEFAULT_TEACHERS : [];
                })(),

                init() {
                    // Sync from localStorage if present
                    try {
                        const stored = localStorage.getItem("nls_pengajar_teachers_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                this.teachers = parsed;
                            }
                        } else if (typeof window.NLS_DEFAULT_TEACHERS !== "undefined") {
                            localStorage.setItem("nls_pengajar_teachers_v1", JSON.stringify(window.NLS_DEFAULT_TEACHERS));
                        }
                    } catch (e) {}

                    // Listen for cross-tab or admin storage updates
                    window.addEventListener("storage", (e) => {
                        if (e.key === "nls_pengajar_teachers_v1" && e.newValue) {
                            try {
                                this.teachers = JSON.parse(e.newValue);
                            } catch (err) {}
                        }
                    });

                    // Listen for in-window custom events
                    window.addEventListener("nls-teachers-updated", (e) => {
                        if (e.detail && Array.isArray(e.detail)) {
                            this.teachers = e.detail;
                        }
                    });
                },

                // Methods & Getters
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldTeachersPattern, $newTeachersInit)

[System.IO.File]::WriteAllText($pengajarPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Updated pengajar/index.html to sync with /nlsadmin dynamic teachers dataset!"
