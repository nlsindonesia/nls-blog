$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$content = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

# 1. Add availableArticleCategories in state
$oldArticleState = @'
                // 4. ARTICLE CMS EDITOR
                ckEditorInstance: null,
                isHtmlView: false,
                articleEditor: {
                    isOpen: false,
                    isEdit: false,
                    form: {
                        id: '', title: '', slug: '', category: 'SNBT & UTBK',
                        date: '2026-08-27', author: 'Tim Akademik NLS', status: 'published',
                        coverImage: '/nls-logo-300.png', focusKeyword: '',
                        metaTitle: '', metaDescription: '', content: '', seoScore: 90
                    }
                },
'@

$newArticleState = @'
                // 4. ARTICLE CMS EDITOR WITH MULTI-CATEGORY SUPPORT
                availableArticleCategories: [
                    { name: 'OSN & Sains', icon: '🏆' },
                    { name: 'SNBT & UTBK', icon: '🎯' },
                    { name: 'TKA & Akademik', icon: '📊' },
                    { name: 'Tips Belajar & Prestasi', icon: '💡' },
                    { name: 'Berita Sekolah & Diknas', icon: '🏛️' },
                    { name: 'Informasi NLS', icon: '📢' },
                    { name: 'Panduan Beasiswa', icon: '🎓' },
                    { name: 'Bimbel NexGen', icon: '🚀' }
                ],
                ckEditorInstance: null,
                isHtmlView: false,
                articleEditor: {
                    isOpen: false,
                    isEdit: false,
                    form: {
                        id: '', title: '', slug: '', category: 'SNBT & UTBK',
                        categories: ['SNBT & UTBK'],
                        date: '2026-08-27', author: 'Tim Akademik NLS', status: 'published',
                        coverImage: '/nls-logo-300.png', focusKeyword: '',
                        metaTitle: '', metaDescription: '', content: '', seoScore: 90
                    }
                },
'@

$content = $content.Replace($oldArticleState, $newArticleState)

# 2. Update Create News / Edit News form markup for Multi-Category Selector
$oldCategoryMetaRow = @'
                                    <!-- Category & Meta Row -->
                                    <div class="art-meta-row">
                                        <div>
                                            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Kategori</label>
                                            <select x-model="articleEditor.form.category" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold">
                                                <option value="OSN & Sains">OSN &amp; Sains</option>
                                                <option value="SNBT & UTBK">SNBT &amp; UTBK</option>
                                                <option value="TKA & Akademik">TKA &amp; Akademik</option>
                                                <option value="Tips Belajar & Prestasi">Tips Belajar &amp; Prestasi</option>
                                                <option value="Berita Sekolah & Diknas">Berita Sekolah &amp; Diknas</option>
                                                <option value="Informasi NLS">Informasi NLS</option>
                                                <option value="Panduan Beasiswa">Panduan Beasiswa</option>
                                                <option value="Bimbel NexGen">Bimbel NexGen</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Penulis (Author)</label>
                                            <input type="text" x-model="articleEditor.form.author" placeholder="Nama Penulis"
                                                class="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold">
                                        </div>
                                        <div>
                                            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tanggal Terbit</label>
                                            <input type="date" x-model="articleEditor.form.date"
                                                class="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold">
                                        </div>
                                    </div>
'@

$newCategoryMetaRow = @'
                                    <!-- Category Multi-Select Section (Pilih Lebih dari 1 Kategori) -->
                                    <div class="space-y-2">
                                        <div class="flex items-center justify-between flex-wrap gap-2">
                                            <label class="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                                Kategori Berita (Bisa Pilih Lebih Dari 1 Kategori) *
                                            </label>
                                            <span class="text-[11px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                                                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                <span x-text="(articleEditor.form.categories && articleEditor.form.categories.length) ? articleEditor.form.categories.length : 1"></span> Kategori Dipilih
                                            </span>
                                        </div>

                                        <!-- Multi-Category Interactive Toggle Chips Grid -->
                                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700">
                                            <template x-for="cat in availableArticleCategories" :key="cat.name">
                                                <label class="relative flex items-center gap-2.5 p-2.5 rounded-xl border-2 cursor-pointer transition-all select-none"
                                                    :class="(articleEditor.form.categories || []).includes(cat.name) 
                                                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950/80 dark:border-emerald-400 dark:text-emerald-200 shadow-sm ring-2 ring-emerald-500/20' 
                                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700'">
                                                    <input type="checkbox" :value="cat.name" x-model="articleEditor.form.categories"
                                                        class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600 shrink-0">
                                                    <div class="min-w-0 flex-1">
                                                        <span class="block text-xs font-black truncate" x-text="cat.name"></span>
                                                    </div>
                                                </label>
                                            </template>
                                        </div>
                                    </div>

                                    <!-- Author & Published Date Row -->
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Penulis (Author)</label>
                                            <input type="text" x-model="articleEditor.form.author" placeholder="Nama Penulis"
                                                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold">
                                        </div>
                                        <div>
                                            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tanggal Terbit</label>
                                            <input type="date" x-model="articleEditor.form.date"
                                                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold">
                                        </div>
                                    </div>
'@

$content = $content.Replace($oldCategoryMetaRow, $newCategoryMetaRow)

# 3. Update Present News badge rendering
$oldPresentBadges = @'
                                                <div class="flex items-center gap-2 flex-wrap">
                                                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
                                                        x-text="art.category"></span>
                                                    <span class="text-xs text-slate-500 font-medium" x-text="art.date"></span>
                                                    <span class="text-xs text-slate-400">•</span>
                                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300" x-text="art.author"></span>
                                                </div>
'@

$newPresentBadges = @'
                                                <div class="flex items-center gap-2 flex-wrap">
                                                    <template x-for="(cat, cIdx) in (art.categories || [art.category || 'Informasi NLS'])" :key="cIdx">
                                                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 shadow-2xs"
                                                            x-text="cat"></span>
                                                    </template>
                                                    <span class="text-xs text-slate-500 font-medium" x-text="art.date"></span>
                                                    <span class="text-xs text-slate-400">•</span>
                                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300" x-text="art.author"></span>
                                                </div>
'@

$content = $content.Replace($oldPresentBadges, $newPresentBadges)

# 4. Update Trash News badge rendering
$oldTrashBadges = @'
                                            <div class="flex items-center gap-2 flex-wrap">
                                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                                    x-text="art.category"></span>
                                                <span class="text-xs text-slate-500 font-medium" x-text="art.date"></span>
                                                <span class="text-xs text-slate-400">•</span>
                                                <span class="text-xs font-bold text-slate-600 dark:text-slate-300" x-text="art.author"></span>
                                            </div>
'@

$newTrashBadges = @'
                                            <div class="flex items-center gap-2 flex-wrap">
                                                <template x-for="(cat, cIdx) in (art.categories || [art.category || 'Informasi NLS'])" :key="cIdx">
                                                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                                                        x-text="cat"></span>
                                                </template>
                                                <span class="text-xs text-slate-500 font-medium" x-text="art.date"></span>
                                                <span class="text-xs text-slate-400">•</span>
                                                <span class="text-xs font-bold text-slate-600 dark:text-slate-300" x-text="art.author"></span>
                                            </div>
'@

$content = $content.Replace($oldTrashBadges, $newTrashBadges)

# 5. Update openCreateNewsView, editArticle, saveArticle, and filteredArticlesList in JS
$oldCreateNewsMethod = @'
                openCreateNewsView() {
                    this.activeTab = 'berita';
                    this.beritaView = 'create';
                    this.isBeritaDropdownOpen = true;
                    this.articleEditor.isEdit = false;
                    this.articleEditor.form = {
                        id: 'art-' + Date.now(),
                        title: '',
                        slug: '',
                        category: 'SNBT & UTBK',
                        date: new Date().toISOString().split('T')[0],
                        author: 'Tim Akademik NLS',
                        status: 'published',
                        coverImage: '/nls-logo-300.png',
                        focusKeyword: '',
                        metaTitle: '',
                        metaDescription: '',
                        content: '<p>Tulis isi konten berita atau panduan belajar lengkap di sini...</p>',
                        seoScore: 85
                    };
                    this.articleEditor.isOpen = true;
                    this.$nextTick(() => {
                        this.initCKEditor();
                    });
                    if (this.isMobile) this.isSidebarOpen = false;
                },
'@

$newCreateNewsMethod = @'
                openCreateNewsView() {
                    this.activeTab = 'berita';
                    this.beritaView = 'create';
                    this.isBeritaDropdownOpen = true;
                    this.articleEditor.isEdit = false;
                    this.articleEditor.form = {
                        id: 'art-' + Date.now(),
                        title: '',
                        slug: '',
                        category: 'SNBT & UTBK',
                        categories: ['SNBT & UTBK'],
                        date: new Date().toISOString().split('T')[0],
                        author: 'Tim Akademik NLS',
                        status: 'published',
                        coverImage: '/nls-logo-300.png',
                        focusKeyword: '',
                        metaTitle: '',
                        metaDescription: '',
                        content: '<p>Tulis isi konten berita atau panduan belajar lengkap di sini...</p>',
                        seoScore: 85
                    };
                    this.articleEditor.isOpen = true;
                    this.$nextTick(() => {
                        this.initCKEditor();
                    });
                    if (this.isMobile) this.isSidebarOpen = false;
                },
'@

$content = $content.Replace($oldCreateNewsMethod, $newCreateNewsMethod)

$oldEditArticleMethod = @'
                editArticle(art) {
                    this.activeTab = 'berita';
                    this.beritaView = 'create';
                    this.isBeritaDropdownOpen = true;
                    this.articleEditor.isEdit = true;
                    this.articleEditor.form = JSON.parse(JSON.stringify(art));
                    this.articleEditor.isOpen = true;
                    this.$nextTick(() => {
                        this.initCKEditor();
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                },
'@

$newEditArticleMethod = @'
                editArticle(art) {
                    this.activeTab = 'berita';
                    this.beritaView = 'create';
                    this.isBeritaDropdownOpen = true;
                    this.articleEditor.isEdit = true;
                    const cloned = JSON.parse(JSON.stringify(art));
                    if (!cloned.categories || !Array.isArray(cloned.categories) || cloned.categories.length === 0) {
                        cloned.categories = cloned.category ? [cloned.category] : ['SNBT & UTBK'];
                    }
                    this.articleEditor.form = cloned;
                    this.articleEditor.isOpen = true;
                    this.$nextTick(() => {
                        this.initCKEditor();
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                },
'@

$content = $content.Replace($oldEditArticleMethod, $newEditArticleMethod)

$oldSaveArticleMethod = @'
                saveArticle(status) {
                    this.syncEditorContent();
                    const f = this.articleEditor.form;
                    f.status = status;
                    f.seoScore = this.calculateSeoScore();

                    if (!f.title) {
                        alert('Silakan masukkan judul artikel terlebih dahulu.');
                        return;
                    }

                    if (this.articleEditor.isEdit) {
                        const idx = this.articles.findIndex(a => a.id === f.id);
                        if (idx !== -1) this.articles[idx] = JSON.parse(JSON.stringify(f));
                    } else {
                        this.articles.unshift(JSON.parse(JSON.stringify(f)));
                    }

                    this.saveArticlesToStorage();
                    this.articleEditor.isOpen = false; this.beritaView = 'present';
                    this.showToast(`Artikel berhasil ${status === 'published' ? 'dipublikasikan' : 'disimpan sebagai draf'}!`);
                },
'@

$newSaveArticleMethod = @'
                saveArticle(status) {
                    this.syncEditorContent();
                    const f = this.articleEditor.form;
                    f.status = status;
                    f.seoScore = this.calculateSeoScore();

                    if (!f.title) {
                        alert('Silakan masukkan judul artikel terlebih dahulu.');
                        return;
                    }

                    if (!f.categories || !Array.isArray(f.categories) || f.categories.length === 0) {
                        f.categories = ['Informasi NLS'];
                    }
                    f.category = f.categories[0]; // Maintain backward compatibility for single-category consumers

                    if (this.articleEditor.isEdit) {
                        const idx = this.articles.findIndex(a => a.id === f.id);
                        if (idx !== -1) this.articles[idx] = JSON.parse(JSON.stringify(f));
                    } else {
                        this.articles.unshift(JSON.parse(JSON.stringify(f)));
                    }

                    this.saveArticlesToStorage();
                    this.articleEditor.isOpen = false; this.beritaView = 'present';
                    this.showToast(`Artikel berhasil ${status === 'published' ? 'dipublikasikan' : 'disimpan sebagai draf'}!`);
                },
'@

$content = $content.Replace($oldSaveArticleMethod, $newSaveArticleMethod)

# 6. Update filteredArticlesList in Admin
$oldAdminFilteredArticles = @'
                filteredArticlesList() {
                    return this.articles.filter(a => {
                        const matchSearch = !this.articleSearch || a.title.toLowerCase().includes(this.articleSearch.toLowerCase());
                        const matchCat = this.articleCategoryFilter === 'all' || a.category === this.articleCategoryFilter;
                        return matchSearch && matchCat;
                    });
                },
'@

$newAdminFilteredArticles = @'
                filteredArticlesList() {
                    return this.articles.filter(a => {
                        const matchSearch = !this.articleSearch || 
                            a.title.toLowerCase().includes(this.articleSearch.toLowerCase()) ||
                            (a.author && a.author.toLowerCase().includes(this.articleSearch.toLowerCase()));
                        
                        let matchCat = true;
                        if (this.articleCategoryFilter !== 'all') {
                            if (a.categories && Array.isArray(a.categories)) {
                                matchCat = a.categories.includes(this.articleCategoryFilter);
                            } else {
                                matchCat = a.category === this.articleCategoryFilter;
                            }
                        }
                        return matchSearch && matchCat;
                    });
                },
'@

$content = $content.Replace($oldAdminFilteredArticles, $newAdminFilteredArticles)

[System.IO.File]::WriteAllText($adminPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Upgraded /nlsadmin with Multi-Category selection for Berita & Artikel!"
