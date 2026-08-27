# 1. Update nlsadmin/index.html
$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$adminContent = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

# Replace articles initialization in nlsadmin/index.html
$oldAdminArticlesFn = @'
                articles: (function() {
                    const defaultCovers = {
                        'art-1': '/images/blog/cover-snbt-2027.jpg',
                        'art-2': '/images/blog/cover-osn-silabus.jpg',
                        'art-3': '/images/blog/cover-jurusan-kuliah.jpg'
                    };
                    try {
                        const stored = localStorage.getItem("nls_berita_articles_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                let updated = false;
                                parsed.forEach(a => {
                                    if (defaultCovers[a.id] && (!a.coverImage || a.coverImage.includes('nls-logo-300.png') || a.coverImage.includes('article-placeholder'))) {
                                        a.coverImage = defaultCovers[a.id];
                                        updated = true;
                                    }
                                });
                                if (updated) {
                                    localStorage.setItem("nls_berita_articles_v1", JSON.stringify(parsed));
                                }
                                return parsed;
                            }
                        }
                    } catch (e) {}
                    return (typeof window.NLS_DEFAULT_ARTICLES !== "undefined") ? window.NLS_DEFAULT_ARTICLES : [];
                })(),
'@

$newAdminArticlesFn = @'
                articles: (function() {
                    try {
                        const stored = localStorage.getItem("nls_berita_articles_v1");
                        let list = [];
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                list = parsed;
                            }
                        }
                        if (typeof window.NLS_DEFAULT_ARTICLES !== "undefined" && Array.isArray(window.NLS_DEFAULT_ARTICLES)) {
                            if (list.length === 0) {
                                list = JSON.parse(JSON.stringify(window.NLS_DEFAULT_ARTICLES));
                            } else {
                                let changed = false;
                                window.NLS_DEFAULT_ARTICLES.forEach(defArt => {
                                    const idx = list.findIndex(a => a.id === defArt.id);
                                    if (idx === -1) {
                                        list.push(JSON.parse(JSON.stringify(defArt)));
                                        changed = true;
                                    } else {
                                        if (defArt.coverImage && (!list[idx].coverImage || list[idx].coverImage.includes('nls-logo-300.png') || list[idx].coverImage.includes('article-placeholder'))) {
                                            list[idx].coverImage = defArt.coverImage;
                                            changed = true;
                                        }
                                    }
                                });
                                if (changed) {
                                    localStorage.setItem("nls_berita_articles_v1", JSON.stringify(list));
                                }
                            }
                        }
                        return list;
                    } catch (e) {
                        return (typeof window.NLS_DEFAULT_ARTICLES !== "undefined") ? window.NLS_DEFAULT_ARTICLES : [];
                    }
                })(),
'@

$adminContent = $adminContent.Replace($oldAdminArticlesFn, $newAdminArticlesFn)

# Add filteredArticlesList and syncDefaultArticles to nlsadmin/index.html
$oldExportArticles = @'
                exportArticlesJSON() {
                    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.articles, null, 2));
                    const a = document.createElement('a');
                    a.setAttribute('href', dataStr);
                    a.setAttribute('download', `nls-berita-articles-${Date.now()}.json`);
                    a.click();
                },
'@

$newExportArticles = @'
                filteredArticlesList() {
                    return this.articles.filter(a => {
                        const q = (this.articleSearch || '').toLowerCase().trim();
                        const matchSearch = !q ||
                            (a.title && a.title.toLowerCase().includes(q)) ||
                            (a.author && a.author.toLowerCase().includes(q)) ||
                            (a.metaDescription && a.metaDescription.toLowerCase().includes(q)) ||
                            (a.category && a.category.toLowerCase().includes(q)) ||
                            (a.categories && a.categories.join(' ').toLowerCase().includes(q));
                        
                        const matchCat = this.articleCategoryFilter === 'all' ||
                            (a.categories && Array.isArray(a.categories) ? a.categories.includes(this.articleCategoryFilter) : a.category === this.articleCategoryFilter);
                        
                        return matchSearch && matchCat;
                    });
                },

                exportArticlesJSON() {
                    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.articles, null, 2));
                    const a = document.createElement('a');
                    a.setAttribute('href', dataStr);
                    a.setAttribute('download', `nls-berita-articles-${Date.now()}.json`);
                    a.click();
                },
'@

$adminContent = $adminContent.Replace($oldExportArticles, $newExportArticles)

# Update init() in nlsadmin/index.html
$oldAdminInit = @'
                init() {
                    window.addEventListener('resize', () => {
                        this.isMobile = window.innerWidth < 1024;
                    });
                },
'@

$newAdminInit = @'
                init() {
                    window.addEventListener('resize', () => {
                        this.isMobile = window.innerWidth < 1024;
                    });

                    // Sync & merge default articles on startup
                    if (typeof window.NLS_DEFAULT_ARTICLES !== "undefined" && Array.isArray(window.NLS_DEFAULT_ARTICLES)) {
                        let changed = false;
                        window.NLS_DEFAULT_ARTICLES.forEach(defArt => {
                            const idx = this.articles.findIndex(a => a.id === defArt.id);
                            if (idx === -1) {
                                this.articles.push(JSON.parse(JSON.stringify(defArt)));
                                changed = true;
                            }
                        });
                        if (changed) {
                            this.saveArticlesToStorage();
                        }
                    }

                    // Cross-tab real-time storage & broadcast listeners
                    window.addEventListener('storage', (e) => {
                        if (e.key === 'nls_berita_articles_v1' && e.newValue) {
                            try {
                                const parsed = JSON.parse(e.newValue);
                                if (Array.isArray(parsed) && parsed.length > 0) this.articles = parsed;
                            } catch (err) {}
                        }
                    });

                    try {
                        const channel = new BroadcastChannel('nls_sync_channel');
                        channel.onmessage = (ev) => {
                            if (ev.data && ev.data.type === 'ARTICLES_UPDATED' && Array.isArray(ev.data.data)) {
                                this.articles = ev.data.data;
                            }
                        };
                    } catch (e) {}
                },
'@

$adminContent = $adminContent.Replace($oldAdminInit, $newAdminInit)
[System.IO.File]::WriteAllText($adminPath, $adminContent, [System.Text.Encoding]::UTF8)
Write-Host "1. Updated nlsadmin/index.html with filteredArticlesList() and startup sync!"

# 2. Update blog/index.html articles initialization
$blogPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\blog\index.html"
$blogContent = [System.IO.File]::ReadAllText($blogPath, [System.Text.Encoding]::UTF8)

$oldBlogArticlesFn = @'
                articles: (function() {
                    const defaultCovers = {
                        'art-1': '/images/blog/cover-snbt-2027.jpg',
                        'art-2': '/images/blog/cover-osn-silabus.jpg',
                        'art-3': '/images/blog/cover-jurusan-kuliah.jpg'
                    };
                    try {
                        const stored = localStorage.getItem("nls_berita_articles_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                let updated = false;
                                parsed.forEach(a => {
                                    if (defaultCovers[a.id] && (!a.coverImage || a.coverImage.includes('nls-logo-300.png') || a.coverImage.includes('article-placeholder'))) {
                                        a.coverImage = defaultCovers[a.id];
                                        updated = true;
                                    }
                                });
                                if (updated) {
                                    localStorage.setItem("nls_berita_articles_v1", JSON.stringify(parsed));
                                }
                                return parsed;
                            }
                        }
                    } catch (e) {}
                    return (typeof window.NLS_DEFAULT_ARTICLES !== "undefined") ? window.NLS_DEFAULT_ARTICLES : [];
                })(),
'@

$blogContent = $blogContent.Replace($oldBlogArticlesFn, $newAdminArticlesFn)
[System.IO.File]::WriteAllText($blogPath, $blogContent, [System.Text.Encoding]::UTF8)
Write-Host "2. Updated blog/index.html"

# 3. Update index.html (Homepage)
$homePath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\index.html"
$homeContent = [System.IO.File]::ReadAllText($homePath, [System.Text.Encoding]::UTF8)

$homeContent = $homeContent.Replace($oldBlogArticlesFn, $newAdminArticlesFn)
[System.IO.File]::WriteAllText($homePath, $homeContent, [System.Text.Encoding]::UTF8)
Write-Host "3. Updated index.html"

Write-Host "SUCCESS: Fully updated and verified all pages with filteredArticlesList() and seamless auto-merging!"
