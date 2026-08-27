# Update nlsadmin/index.html
$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$adminContent = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

# 1. Add "Bimbel NexGen" option in Present News filter dropdown
$oldFilterDropdown = @'
                                <select x-model="articleCategoryFilter" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold">
                                    <option value="all">Semua Kategori</option>
                                    <option value="OSN & Sains">OSN &amp; Sains</option>
'@

$newFilterDropdown = @'
                                <select x-model="articleCategoryFilter" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold">
                                    <option value="all">Semua Kategori</option>
                                    <option value="Bimbel NexGen">Bimbel NexGen</option>
                                    <option value="OSN & Sains">OSN &amp; Sains</option>
'@

$adminContent = $adminContent.Replace($oldFilterDropdown, $newFilterDropdown)

# 2. Add "Bimbel NexGen" option in Create News category select
$oldCreateSelect = @'
                                            <select x-model="articleEditor.form.category" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold">
                                                <option value="OSN & Sains">OSN &amp; Sains</option>
'@

$newCreateSelect = @'
                                            <select x-model="articleEditor.form.category" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold">
                                                <option value="Bimbel NexGen">Bimbel NexGen</option>
                                                <option value="OSN & Sains">OSN &amp; Sains</option>
'@

$adminContent = $adminContent.Replace($oldCreateSelect, $newCreateSelect)

[System.IO.File]::WriteAllText($adminPath, $adminContent, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Added 'Bimbel NexGen' category to nlsadmin/index.html!"

# Update blog/index.html
$blogPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\blog\index.html"
$blogContent = [System.IO.File]::ReadAllText($blogPath, [System.Text.Encoding]::UTF8)

# 3. Add CSS styling for Bimbel NexGen
$nexgenCss = @'
        .category-pill-active-nexgen {
            background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%) !important;
            color: #ffffff !important;
            border: 2px solid #a5f3fc !important;
            box-shadow: 0 4px 14px rgba(6, 182, 212, 0.35) !important;
            font-weight: 900 !important;
        }
        .card-accent-nexgen { border-top: 4px solid #06b6d4 !important; }
'@

if (-not $blogContent.Contains('category-pill-active-nexgen')) {
    $blogContent = $blogContent.Replace(
        '.category-pill-active-osn {',
        $nexgenCss + "`n        .category-pill-active-osn {"
    )
}

# 4. Add Bimbel NexGen button in Hero pills
$oldNexgenButtonLocation = @'
                    <!-- SNBT -->
                    <button type="button" @click="selectedCategory = 'SNBT & UTBK'"
'@

$newNexgenButton = @'
                    <!-- Bimbel NexGen -->
                    <button type="button" @click="selectedCategory = 'Bimbel NexGen'"
                        :class="selectedCategory === 'Bimbel NexGen' ? 'category-pill-active-nexgen scale-105' : 'category-pill-inactive'"
                        class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm">
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2zm1 14.95l6-2.73v3.72L13 21v-4.05zm-2 0V21l-6-3.06v-3.72l6 2.73z"/></svg>
                        <span>Bimbel NexGen</span>
                    </button>

                    <!-- SNBT -->
                    <button type="button" @click="selectedCategory = 'SNBT & UTBK'"
'@

if (-not $blogContent.Contains("selectedCategory = 'Bimbel NexGen'")) {
    $blogContent = $blogContent.Replace($oldNexgenButtonLocation, $newNexgenButton)
}

# 5. Add 'Bimbel NexGen' to categories array and badge class in blogApp()
if (-not $blogContent.Contains("'Bimbel NexGen',")) {
    $blogContent = $blogContent.Replace(
        "categories: [`n                    'SNBT & UTBK',",
        "categories: [`n                    'Bimbel NexGen',`n                    'SNBT & UTBK',"
    )
}

if (-not $blogContent.Contains("case 'Bimbel NexGen': return 'card-accent-nexgen';")) {
    $blogContent = $blogContent.Replace(
        "getArticleAccentClass(cat) {`n                    switch (cat) {",
        "getArticleAccentClass(cat) {`n                    switch (cat) {`n                        case 'Bimbel NexGen': return 'card-accent-nexgen';"
    )
}

if (-not $blogContent.Contains("case 'Bimbel NexGen':`n                            return 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950 dark:text-cyan-300';")) {
    $blogContent = $blogContent.Replace(
        "getCategoryBadgeClass(cat) {`n                    switch (cat) {",
        "getCategoryBadgeClass(cat) {`n                    switch (cat) {`n                        case 'Bimbel NexGen':`n                            return 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950 dark:text-cyan-300';"
    )
}

[System.IO.File]::WriteAllText($blogPath, $blogContent, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Added 'Bimbel NexGen' category to blog/index.html!"
