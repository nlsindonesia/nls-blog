$adminCardCss = @"

/* =========================================================================
   FULL-COLOR VIBRANT THEMED EVENT CARDS (SYNCED WITH NLS ADMIN)
   ========================================================================= */
.admin-card-osn {
    background: linear-gradient(145deg, #e0f2fe 0%, #bae6fd 100%) !important;
    border: 2.5px solid #38bdf8 !important;
    box-shadow: 0 10px 25px -5px rgba(2, 132, 199, 0.25) !important;
}
html.dark .admin-card-osn {
    background: linear-gradient(145deg, #0c2d48 0%, #0f3d63 100%) !important;
    border: 2.5px solid #0284c7 !important;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
}

.admin-card-tka {
    background: linear-gradient(145deg, #fef3c7 0%, #fde68a 100%) !important;
    border: 2.5px solid #f59e0b !important;
    box-shadow: 0 10px 25px -5px rgba(217, 119, 6, 0.25) !important;
}
html.dark .admin-card-tka {
    background: linear-gradient(145deg, #452404 0%, #5e3206 100%) !important;
    border: 2.5px solid #d97706 !important;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
}

.admin-card-snbt {
    background: linear-gradient(145deg, #dcfce7 0%, #bbf7d0 100%) !important;
    border: 2.5px solid #10b981 !important;
    box-shadow: 0 10px 25px -5px rgba(5, 150, 105, 0.25) !important;
}
html.dark .admin-card-snbt {
    background: linear-gradient(145deg, #063d27 0%, #095738 100%) !important;
    border: 2.5px solid #059669 !important;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
}

.admin-card-mitra {
    background: linear-gradient(145deg, #f3e8ff 0%, #e9d5ff 100%) !important;
    border: 2.5px solid #a855f7 !important;
    box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.25) !important;
}
html.dark .admin-card-mitra {
    background: linear-gradient(145deg, #320d53 0%, #461573 100%) !important;
    border: 2.5px solid #7c3aed !important;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
}

.admin-card-dinas {
    background: linear-gradient(145deg, #ffe4e6 0%, #fecdd3 100%) !important;
    border: 2.5px solid #f43f5e !important;
    box-shadow: 0 10px 25px -5px rgba(225, 29, 72, 0.25) !important;
}
html.dark .admin-card-dinas {
    background: linear-gradient(145deg, #4d0a1b 0%, #680f25 100%) !important;
    border: 2.5px solid #e11d48 !important;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
}
"@

# 1. Update theme.css
$themePath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\theme.css"
$themeContent = [System.IO.File]::ReadAllText($themePath, [System.Text.Encoding]::UTF8)
if (-not $themeContent.Contains('.admin-card-osn')) {
    $themeContent += "`n" + $adminCardCss
    [System.IO.File]::WriteAllText($themePath, $themeContent, [System.Text.Encoding]::UTF8)
    Write-Host "Updated theme.css with admin-card CSS classes."
}

# Target HTML files with calendar
$targetFiles = @(
    "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\kalender\index.html",
    "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\index.html",
    "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\osn\index.html"
)

foreach ($fPath in $targetFiles) {
    $content = [System.IO.File]::ReadAllText($fPath, [System.Text.Encoding]::UTF8)
    
    # 2. Add CSS to <style> if not already there
    if (-not $content.Contains('.admin-card-osn')) {
        $content = $content.Replace('</style>', $adminCardCss + "`n</style>")
        Write-Host "Added .admin-card-* styles to <style> in $fPath"
    }
    
    # 3. Update getEventAdminCardClass in Alpine.js
    $patternOldMethod = '(?s)getEventAdminCardClass\s*\(\s*cat\s*\)\s*\{.*?switch\s*\(\s*cat\s*\)\s*\{.*?default:.*?\}\s*\}'
    $newMethod = @"
getEventAdminCardClass(cat) {
                    switch (cat) {
                        case 'OSN': return 'admin-card-osn';
                        case 'TKA': return 'admin-card-tka';
                        case 'SNBT': return 'admin-card-snbt';
                        case 'Mitra Sekolah': return 'admin-card-mitra';
                        case 'Event Dinas': return 'admin-card-dinas';
                        default: return 'admin-card-osn';
                    }
                }
"@
    
    if ($content -match $patternOldMethod) {
        $content = [regex]::Replace($content, $patternOldMethod, $newMethod)
        Write-Host "Updated getEventAdminCardClass method in $fPath"
    }
    
    [System.IO.File]::WriteAllText($fPath, $content, [System.Text.Encoding]::UTF8)
}

# 4. Clean up osn/index.html extra template closing tags
$osnPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\osn\index.html"
$osnContent = [System.IO.File]::ReadAllText($osnPath, [System.Text.Encoding]::UTF8)

# Check if broken template tags exist
$brokenSnippet = @"
                                    </template>
                                            </ul>
                                        </div>
                                    </template>

                                    <!-- WhatsApp CTA Button -->
"@

if ($osnContent.Contains('</ul>') -and $osnContent.Contains('<!-- WhatsApp CTA Button -->')) {
    $osnContent = [regex]::Replace($osnContent, '(?s)</template>\s*</ul>\s*</div>\s*</template>\s*<!-- WhatsApp CTA Button -->.*?</div>\s*</div>\s*</template>\s*</div>', "</template>`n                    </div>")
    [System.IO.File]::WriteAllText($osnPath, $osnContent, [System.Text.Encoding]::UTF8)
    Write-Host "Cleaned up osn/index.html duplicate template closing tags."
}
