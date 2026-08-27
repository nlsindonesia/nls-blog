$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$content = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

$oldInitJs = @'
                    inst.on('instanceReady', () => {
                        if (this.articleEditor && this.articleEditor.form && this.articleEditor.form.content) {
                            inst.setData(this.articleEditor.form.content);
                        }
                    });

                    const syncHandler = () => {
                        if (this.articleEditor && this.articleEditor.form && inst) {
                            this.articleEditor.form.content = inst.getData();
                            this.updateSeoScore();
                        }
                    };

                    inst.on('change', syncHandler);
                    inst.on('key', syncHandler);
                    inst.on('paste', syncHandler);
                    inst.on('selectionChange', syncHandler);
                    inst.on('blur', syncHandler);
'@

$newInitJs = @'
                    const placeholderPhrases = [
                        'Tulis isi konten berita atau panduan belajar lengkap di sini...',
                        'Tulis konten artikel lengkap di sini...'
                    ];

                    const clearPlaceholderIfPresent = () => {
                        try {
                            const data = inst.getData();
                            for (const ph of placeholderPhrases) {
                                if (data.includes(ph)) {
                                    inst.setData('');
                                    if (this.articleEditor && this.articleEditor.form) {
                                        this.articleEditor.form.content = '';
                                        this.updateSeoScore();
                                    }
                                    break;
                                }
                            }
                        } catch(e) {}
                    };

                    inst.on('focus', clearPlaceholderIfPresent);

                    inst.on('instanceReady', () => {
                        if (this.articleEditor && this.articleEditor.form && this.articleEditor.form.content) {
                            inst.setData(this.articleEditor.form.content);
                        }
                        try {
                            const editable = inst.editable();
                            if (editable) {
                                editable.attachListener(editable, 'click', clearPlaceholderIfPresent);
                                editable.attachListener(editable, 'focus', clearPlaceholderIfPresent);
                                editable.attachListener(editable, 'keydown', (ev) => {
                                    const data = inst.getData();
                                    for (const ph of placeholderPhrases) {
                                        if (data.includes(ph)) {
                                            inst.setData('');
                                            if (this.articleEditor && this.articleEditor.form) {
                                                this.articleEditor.form.content = '';
                                            }
                                            break;
                                        }
                                    }
                                });
                            }
                        } catch(e) {}
                    });

                    const syncHandler = () => {
                        if (this.articleEditor && this.articleEditor.form && inst) {
                            this.articleEditor.form.content = inst.getData();
                            this.updateSeoScore();
                        }
                    };

                    inst.on('change', syncHandler);
                    inst.on('key', syncHandler);
                    inst.on('paste', syncHandler);
                    inst.on('selectionChange', syncHandler);
                    inst.on('blur', syncHandler);
'@

$content = $content.Replace($oldInitJs, $newInitJs)

[System.IO.File]::WriteAllText($adminPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Implemented auto-clear placeholder on click / focus / keypress in CKEditor!"
