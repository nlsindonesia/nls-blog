$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$content = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

# 1. Add CSS rules to <style>
$cssToInject = @'
        /* Custom Responsive Grid Layouts for Super Admin */
        .art-editor-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            width: 100%;
        }
        @media (min-width: 1024px) {
            .art-editor-container {
                display: grid;
                grid-template-columns: 1.35fr 1fr;
                align-items: start;
                gap: 1.5rem;
            }
        }

        .art-meta-row {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }
        @media (min-width: 640px) {
            .art-meta-row {
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 0.75rem;
            }
        }

        .admin-grid-3 {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        @media (min-width: 768px) {
            .admin-grid-3 {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
        }
        @media (min-width: 1280px) {
            .admin-grid-3 {
                grid-template-columns: repeat(3, minmax(0, 1fr));
            }
        }

        .admin-grid-4 {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.75rem;
        }
        @media (min-width: 768px) {
            .admin-grid-4 {
                grid-template-columns: repeat(4, minmax(0, 1fr));
            }
        }

        .admin-grid-6 {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.75rem;
        }
        @media (min-width: 640px) {
            .admin-grid-6 {
                grid-template-columns: repeat(3, minmax(0, 1fr));
            }
        }
        @media (min-width: 1200px) {
            .admin-grid-6 {
                grid-template-columns: repeat(6, minmax(0, 1fr));
            }
        }
'@

if (-not $content.Contains('.art-editor-container')) {
    $content = $content.Replace('</style>', $cssToInject + "`n    </style>")
}

# 2. Fix Article Editor Grid in HTML
$content = $content.Replace('<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">', '<div class="art-editor-container">')
$content = $content.Replace('<div class="lg:col-span-7 space-y-5">', '<div class="space-y-5 min-w-0">')
$content = $content.Replace('<div class="lg:col-span-5 space-y-5">', '<div class="space-y-5 min-w-0">')
$content = $content.Replace('<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">', '<div class="art-meta-row">')

# 3. Fix Statistics and Card Grids in HTML
$content = $content.Replace('<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">', '<div class="admin-grid-6">')
$content = $content.Replace('<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">', '<div class="admin-grid-4">')
$content = $content.Replace('<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">', '<div class="admin-grid-3">')

# 4. Fix Sidebar Icon styles so they never appear invisible/blank
$content = $content.Replace(":class=`"activeTab === 'kalender' ? 'bg-sky-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 group-hover:bg-sky-500 group-hover:text-white'`"", ":class=`"activeTab === 'kalender' ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-sky-500 group-hover:text-white'`"")
$content = $content.Replace(":class=`"activeTab === 'berita' ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 group-hover:bg-emerald-500 group-hover:text-white'`"", ":class=`"activeTab === 'berita' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-emerald-500 group-hover:text-white'`"")
$content = $content.Replace(":class=`"activeTab === 'pengajar' ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 group-hover:bg-indigo-500 group-hover:text-white'`"", ":class=`"activeTab === 'pengajar' ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-indigo-500 group-hover:text-white'`"")

# 5. Add nice background icons for public links in sidebar
$content = $content.Replace('<svg class="w-4 h-4 text-sky-500"', '<span class="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0"><svg class="w-4 h-4"')
$content = $content.Replace('<svg class="w-4 h-4 text-indigo-500"', '<span class="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0"><svg class="w-4 h-4"')
$content = $content.Replace('<svg class="w-4 h-4 text-emerald-500"', '<span class="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0"><svg class="w-4 h-4"')

$content = $content.Replace('<span>Halaman /kalender</span>', '</span><span>Halaman /kalender</span>')
$content = $content.Replace('<span>Halaman /pengajar</span>', '</span><span>Halaman /pengajar</span>')
$content = $content.Replace('<span>Halaman /blog</span>', '</span><span>Halaman /blog</span>')

[System.IO.File]::WriteAllText($adminPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Fixed Article Editor layout, responsive grid containers, and sidebar icons!"
