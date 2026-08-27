# 1. Update blog/index.html
$blogPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\blog\index.html"
$blogContent = [System.IO.File]::ReadAllText($blogPath, [System.Text.Encoding]::UTF8)

$oldBlogArticlesFn = @'
                articles: (function() {
                    try {
                        const stored = localStorage.getItem("nls_berita_articles_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                        }
                    } catch (e) {}
                    return (typeof window.NLS_DEFAULT_ARTICLES !== "undefined") ? window.NLS_DEFAULT_ARTICLES : [];
                })(),
'@

$newBlogArticlesFn = @'
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

$blogContent = $blogContent.Replace($oldBlogArticlesFn, $newBlogArticlesFn)

$oldBlogLoadFn = @'
                loadArticles() {
                    try {
                        const stored = localStorage.getItem("nls_berita_articles_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                this.articles = parsed;
                                return;
                            }
                        }
                    } catch (e) {}
                    if (typeof window.NLS_DEFAULT_ARTICLES !== "undefined" && Array.isArray(window.NLS_DEFAULT_ARTICLES)) {
                        this.articles = window.NLS_DEFAULT_ARTICLES;
                    }
                },
'@

$newBlogLoadFn = @'
                loadArticles() {
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
                                this.articles = parsed;
                                return;
                            }
                        }
                    } catch (e) {}
                    if (typeof window.NLS_DEFAULT_ARTICLES !== "undefined" && Array.isArray(window.NLS_DEFAULT_ARTICLES)) {
                        this.articles = window.NLS_DEFAULT_ARTICLES;
                    }
                },
'@

$blogContent = $blogContent.Replace($oldBlogLoadFn, $newBlogLoadFn)

# Replace image fallbacks in blog/index.html
$blogContent = $blogContent.Replace("onerror=""this.onerror=null;this.src='/nls-logo-300.png';""", "onerror=""this.onerror=null;this.src='/images/blog/cover-snbt-2027.jpg';""")
$blogContent = $blogContent.Replace(":src=""art.coverImage || '/nls-logo-300.png'""", ":src=""art.coverImage || '/images/blog/cover-snbt-2027.jpg'""")
$blogContent = $blogContent.Replace(":src=""activeArticle.coverImage || '/nls-logo-300.png'""", ":src=""activeArticle.coverImage || '/images/blog/cover-snbt-2027.jpg'""")

[System.IO.File]::WriteAllText($blogPath, $blogContent, [System.Text.Encoding]::UTF8)

# 2. Update index.html (Homepage)
$homePath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\index.html"
$homeContent = [System.IO.File]::ReadAllText($homePath, [System.Text.Encoding]::UTF8)

$oldHomeArticlesFn = @'
                articles: (function() {
                    try {
                        const stored = localStorage.getItem("nls_berita_articles_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                        }
                    } catch (e) {}
                    return (typeof window.NLS_DEFAULT_ARTICLES !== "undefined") ? window.NLS_DEFAULT_ARTICLES : [];
                })(),
'@

$newHomeArticlesFn = @'
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

$homeContent = $homeContent.Replace($oldHomeArticlesFn, $newHomeArticlesFn)

$oldHomeLoadFn = @'
                loadArticles() {
                    try {
                        const stored = localStorage.getItem("nls_berita_articles_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                this.articles = parsed;
                                return;
                            }
                        }
                    } catch (e) {}
                    if (typeof window.NLS_DEFAULT_ARTICLES !== "undefined" && Array.isArray(window.NLS_DEFAULT_ARTICLES)) {
                        this.articles = window.NLS_DEFAULT_ARTICLES;
                    }
                },
'@

$newHomeLoadFn = @'
                loadArticles() {
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
                                this.articles = parsed;
                                return;
                            }
                        }
                    } catch (e) {}
                    if (typeof window.NLS_DEFAULT_ARTICLES !== "undefined" && Array.isArray(window.NLS_DEFAULT_ARTICLES)) {
                        this.articles = window.NLS_DEFAULT_ARTICLES;
                    }
                },
'@

$homeContent = $homeContent.Replace($oldHomeLoadFn, $newHomeLoadFn)

# Replace image fallbacks in index.html
$homeContent = $homeContent.Replace("onerror=""this.onerror=null;this.src='/nls-logo-300.png';""", "onerror=""this.onerror=null;this.src='/images/blog/cover-snbt-2027.jpg';""")
$homeContent = $homeContent.Replace(":src=""art.coverImage || '/nls-logo-300.png'""", ":src=""art.coverImage || '/images/blog/cover-snbt-2027.jpg'""")
$homeContent = $homeContent.Replace(":src=""activeArticle.coverImage || '/nls-logo-300.png'""", ":src=""activeArticle.coverImage || '/images/blog/cover-snbt-2027.jpg'""")

[System.IO.File]::WriteAllText($homePath, $homeContent, [System.Text.Encoding]::UTF8)

# 3. Update nlsadmin/index.html to write back to localStorage when loading
$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$adminContent = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

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
                                parsed.forEach(a => {
                                    if (defaultCovers[a.id] && (!a.coverImage || a.coverImage.includes('nls-logo-300.png') || a.coverImage.includes('article-placeholder'))) {
                                        a.coverImage = defaultCovers[a.id];
                                    }
                                });
                                return parsed;
                            }
                        }
                    } catch (e) {}
                    return (typeof window.NLS_DEFAULT_ARTICLES !== "undefined") ? window.NLS_DEFAULT_ARTICLES : [];
                })(),
'@

$newAdminArticlesFn = @'
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

$adminContent = $adminContent.Replace($oldAdminArticlesFn, $newAdminArticlesFn)
[System.IO.File]::WriteAllText($adminPath, $adminContent, [System.Text.Encoding]::UTF8)

Write-Host "SUCCESS: Synchronized cover images between /nlsadmin, /blog, and homepage!"
