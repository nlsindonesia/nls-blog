$jsonContent = [System.IO.File]::ReadAllText("c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\scratch\articles.json", [System.Text.Encoding]::UTF8)

# 1. Update blog/default-articles.js
$jsContent = @"
/**
 * Master Dataset Berita & Artikel CMS Next Level Study (NLS)
 * Baseline data tersinkronisasi untuk /nlsadmin, /blog, dan homepage.
 */
window.NLS_DEFAULT_ARTICLES = $jsonContent;
"@

[System.IO.File]::WriteAllText("c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\blog\default-articles.js", $jsContent, [System.Text.Encoding]::UTF8)
Write-Host "1. Updated blog/default-articles.js"

# 2. Update nlsadmin/index.html to automatically sync on startup
$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$adminContent = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

# In nlsadmin, let's ensure that if window.NLS_DEFAULT_ARTICLES has new articles not in localStorage, it merges them seamlessly!
$oldAdminLoad = @'
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

$newAdminLoad = @'
                loadArticles() {
                    try {
                        const stored = localStorage.getItem("nls_berita_articles_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                // Merge newly added default articles if not already in user's localStorage
                                if (typeof window.NLS_DEFAULT_ARTICLES !== "undefined" && Array.isArray(window.NLS_DEFAULT_ARTICLES)) {
                                    window.NLS_DEFAULT_ARTICLES.forEach(defArt => {
                                        if (!parsed.some(a => a.id === defArt.id)) {
                                            parsed.unshift(defArt);
                                        }
                                    });
                                }
                                this.articles = parsed;
                                localStorage.setItem("nls_berita_articles_v1", JSON.stringify(this.articles));
                                return;
                            }
                        }
                    } catch (e) {}
                    if (typeof window.NLS_DEFAULT_ARTICLES !== "undefined" && Array.isArray(window.NLS_DEFAULT_ARTICLES)) {
                        this.articles = window.NLS_DEFAULT_ARTICLES;
                        localStorage.setItem("nls_berita_articles_v1", JSON.stringify(this.articles));
                    }
                },
'@

$adminContent = $adminContent.Replace($oldAdminLoad, $newAdminLoad)
[System.IO.File]::WriteAllText($adminPath, $adminContent, [System.Text.Encoding]::UTF8)
Write-Host "2. Updated nlsadmin/index.html"

# 3. Update blog/index.html loadArticles
$blogPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\blog\index.html"
$blogContent = [System.IO.File]::ReadAllText($blogPath, [System.Text.Encoding]::UTF8)

$oldBlogLoad = @'
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

$newBlogLoad = @'
                loadArticles() {
                    try {
                        const stored = localStorage.getItem("nls_berita_articles_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                if (typeof window.NLS_DEFAULT_ARTICLES !== "undefined" && Array.isArray(window.NLS_DEFAULT_ARTICLES)) {
                                    window.NLS_DEFAULT_ARTICLES.forEach(defArt => {
                                        if (!parsed.some(a => a.id === defArt.id)) {
                                            parsed.unshift(defArt);
                                        }
                                    });
                                }
                                this.articles = parsed;
                                localStorage.setItem("nls_berita_articles_v1", JSON.stringify(this.articles));
                                return;
                            }
                        }
                    } catch (e) {}
                    if (typeof window.NLS_DEFAULT_ARTICLES !== "undefined" && Array.isArray(window.NLS_DEFAULT_ARTICLES)) {
                        this.articles = window.NLS_DEFAULT_ARTICLES;
                    }
                },
'@

$blogContent = $blogContent.Replace($oldBlogLoad, $newBlogLoad)
[System.IO.File]::WriteAllText($blogPath, $blogContent, [System.Text.Encoding]::UTF8)
Write-Host "3. Updated blog/index.html"

# 4. Update index.html (Homepage) loadArticles
$homePath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\index.html"
$homeContent = [System.IO.File]::ReadAllText($homePath, [System.Text.Encoding]::UTF8)

$homeContent = $homeContent.Replace($oldBlogLoad, $newBlogLoad)
[System.IO.File]::WriteAllText($homePath, $homeContent, [System.Text.Encoding]::UTF8)
Write-Host "4. Updated index.html"

Write-Host "SUCCESS: 9 OSN articles published and synchronized!"
