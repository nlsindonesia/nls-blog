# 1. Update nlsadmin/index.html saveArticlesToStorage
$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$adminContent = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

$oldAdminSave = @'
                saveArticlesToStorage() {
                    localStorage.setItem('nls_berita_articles_v1', JSON.stringify(this.articles));
                    window.dispatchEvent(new CustomEvent('nls-articles-updated', { detail: this.articles }));
                },
'@

$newAdminSave = @'
                saveArticlesToStorage() {
                    const dataStr = JSON.stringify(this.articles);
                    localStorage.setItem('nls_berita_articles_v1', dataStr);
                    window.dispatchEvent(new CustomEvent('nls-articles-updated', { detail: this.articles }));
                    
                    // Cross-tab real-time broadcast to /blog and homepage
                    try {
                        const channel = new BroadcastChannel('nls_sync_channel');
                        channel.postMessage({ type: 'ARTICLES_UPDATED', data: this.articles });
                        channel.close();
                    } catch (e) {}

                    // Cross-origin / legacy storage trigger
                    try {
                        window.dispatchEvent(new StorageEvent('storage', {
                            key: 'nls_berita_articles_v1',
                            newValue: dataStr
                        }));
                    } catch (e) {}
                },
'@

$adminContent = $adminContent.Replace($oldAdminSave, $newAdminSave)
[System.IO.File]::WriteAllText($adminPath, $adminContent, [System.Text.Encoding]::UTF8)

# 2. Update blog/index.html init and reader modal
$blogPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\blog\index.html"
$blogContent = [System.IO.File]::ReadAllText($blogPath, [System.Text.Encoding]::UTF8)

$oldBlogInit = @'
                init() {
                    this.loadArticles();
                    // Listen to real-time changes from /nlsadmin across tabs
                    window.addEventListener('storage', (e) => {
                        if (e.key === 'nls_berita_articles_v1' && e.newValue) {
                            try {
                                const parsed = JSON.parse(e.newValue);
                                if (Array.isArray(parsed)) this.articles = parsed;
                            } catch (err) {}
                        }
                    });
                },
'@

$newBlogInit = @'
                init() {
                    this.loadArticles();
                    
                    // 1. Cross-tab Storage Event Listener
                    window.addEventListener('storage', (e) => {
                        if (e.key === 'nls_berita_articles_v1' && e.newValue) {
                            try {
                                const parsed = JSON.parse(e.newValue);
                                if (Array.isArray(parsed) && parsed.length > 0) {
                                    this.articles = parsed;
                                }
                            } catch (err) {}
                        }
                    });

                    // 2. BroadcastChannel Instant Sync (Zero-Latency)
                    try {
                        const channel = new BroadcastChannel('nls_sync_channel');
                        channel.onmessage = (ev) => {
                            if (ev.data && ev.data.type === 'ARTICLES_UPDATED' && Array.isArray(ev.data.data)) {
                                this.articles = ev.data.data;
                            }
                        };
                    } catch (e) {}

                    // 3. Same-tab Custom Event Listener
                    window.addEventListener('nls-articles-updated', (e) => {
                        if (e.detail && Array.isArray(e.detail)) {
                            this.articles = e.detail;
                        }
                    });
                },
'@

$blogContent = $blogContent.Replace($oldBlogInit, $newBlogInit)
[System.IO.File]::WriteAllText($blogPath, $blogContent, [System.Text.Encoding]::UTF8)

# 3. Update homepage index.html init
$homePath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\index.html"
$homeContent = [System.IO.File]::ReadAllText($homePath, [System.Text.Encoding]::UTF8)

$oldHomeInit = @'
                init() {
                    this.loadArticles();
                    // Listen to real-time changes from /nlsadmin across tabs
                    window.addEventListener('storage', (e) => {
                        if (e.key === 'nls_berita_articles_v1' && e.newValue) {
                            try {
                                const parsed = JSON.parse(e.newValue);
                                if (Array.isArray(parsed) && parsed.length > 0) {
                                    this.articles = parsed;
                                }
                            } catch (err) {}
                        }
                    });
                },
'@

$newHomeInit = @'
                init() {
                    this.loadArticles();
                    
                    // 1. Cross-tab Storage Event Listener
                    window.addEventListener('storage', (e) => {
                        if (e.key === 'nls_berita_articles_v1' && e.newValue) {
                            try {
                                const parsed = JSON.parse(e.newValue);
                                if (Array.isArray(parsed) && parsed.length > 0) {
                                    this.articles = parsed;
                                }
                            } catch (err) {}
                        }
                    });

                    // 2. BroadcastChannel Instant Sync (Zero-Latency)
                    try {
                        const channel = new BroadcastChannel('nls_sync_channel');
                        channel.onmessage = (ev) => {
                            if (ev.data && ev.data.type === 'ARTICLES_UPDATED' && Array.isArray(ev.data.data)) {
                                this.articles = ev.data.data;
                            }
                        };
                    } catch (e) {}

                    // 3. Same-tab Custom Event Listener
                    window.addEventListener('nls-articles-updated', (e) => {
                        if (e.detail && Array.isArray(e.detail)) {
                            this.articles = e.detail;
                        }
                    });
                },
'@

$homeContent = $homeContent.Replace($oldHomeInit, $newHomeInit)
[System.IO.File]::WriteAllText($homePath, $homeContent, [System.Text.Encoding]::UTF8)

Write-Host "SUCCESS: Fully synchronized /nlsadmin with /blog and homepage via BroadcastChannel & LocalStorage!"
