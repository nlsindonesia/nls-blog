$homePath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\index.html"
$homeContent = [System.IO.File]::ReadAllText($homePath, [System.Text.Encoding]::UTF8)

$oldHomeInit = @'
                init() {
                    this.loadArticles();
                    // Real-time storage event synchronization with /nlsadmin and /blog
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

Write-Host "SUCCESS: Updated homepage index.html with BroadcastChannel sync!"
