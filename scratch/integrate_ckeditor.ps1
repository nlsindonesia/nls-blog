$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$content = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

# 1. Add CKEditor CDN in <head>
if (-not $content.Contains('ckeditor5/41.3.1/classic/ckeditor.js')) {
    $content = $content.Replace(
        '<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script>',
        '<script src="https://cdn.ckeditor.com/ckeditor5/41.3.1/classic/ckeditor.js"></script>' + "`n    " + '<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script>'
    )
}

# 2. Add CKEditor Custom Styling in <style>
$ckeditorCss = @'
        /* =========================================================================
           CKEDITOR 5 FULL TOOLBAR STYLING & DARK THEME SUPPORT
           ========================================================================= */
        .ckeditor-wrapper .ck-editor__editable_inline {
            min-height: 420px !important;
            max-height: 650px !important;
            padding: 1.25rem 1.5rem !important;
            font-size: 0.95rem !important;
            line-height: 1.8 !important;
            color: #0f172a !important;
            background-color: #ffffff !important;
            border-bottom-left-radius: 1rem !important;
            border-bottom-right-radius: 1rem !important;
        }
        .ckeditor-wrapper .ck.ck-toolbar {
            background-color: #f8fafc !important;
            border-color: #cbd5e1 !important;
            border-top-left-radius: 1rem !important;
            border-top-right-radius: 1rem !important;
            padding: 0.5rem 0.75rem !important;
        }
        .ckeditor-wrapper .ck.ck-editor__main > .ck-editor__editable {
            border-color: #cbd5e1 !important;
        }
        .ckeditor-wrapper .ck.ck-toolbar .ck-toolbar__items {
            flex-wrap: wrap !important;
            gap: 2px !important;
        }

        /* Dark Mode for CKEditor 5 */
        html.dark .ckeditor-wrapper .ck-editor__editable_inline {
            background-color: #0b132b !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }
        html.dark .ckeditor-wrapper .ck.ck-toolbar {
            background-color: #131d38 !important;
            border-color: #334155 !important;
        }
        html.dark .ckeditor-wrapper .ck.ck-editor__main > .ck-editor__editable {
            border-color: #334155 !important;
        }
        html.dark .ckeditor-wrapper .ck.ck-button {
            color: #cbd5e1 !important;
        }
        html.dark .ckeditor-wrapper .ck.ck-button:hover {
            background-color: #1e293b !important;
            color: #38bdf8 !important;
        }
        html.dark .ckeditor-wrapper .ck.ck-button.ck-on {
            background-color: #1e293b !important;
            color: #38bdf8 !important;
        }
        html.dark .ckeditor-wrapper .ck.ck-dropdown__panel {
            background-color: #131d38 !important;
            border-color: #334155 !important;
        }
        html.dark .ckeditor-wrapper .ck.ck-list__item button {
            color: #e2e8f0 !important;
        }
        html.dark .ckeditor-wrapper .ck.ck-list__item button:hover {
            background-color: #1e293b !important;
        }
'@

if (-not $content.Contains('CKEDITOR 5 FULL TOOLBAR STYLING')) {
    $content = $content.Replace('</style>', $ckeditorCss + "`n    </style>")
}

# 3. Replace Old Toolbar & Editor HTML with CKEditor 5 Container
$oldEditorMarkupPattern = '(?s)<!-- RICH WYSIWYG TOOLBAR -->.*?<!-- Raw HTML Textarea.*?<\/div>'

$newCKEditorMarkup = @'
<!-- CKEDITOR 5 COMPLETE RICH WYSIWYG TOOLBAR -->
                                    <div>
                                        <div class="flex items-center justify-between mb-2">
                                            <label class="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                                Isi Konten Berita &amp; Artikel (CKEditor 5 Full Toolbar)
                                            </label>
                                            <span class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                                                CKEditor 5 Active
                                            </span>
                                        </div>
                                        <div class="ckeditor-wrapper rounded-2xl overflow-hidden shadow-2xs border border-slate-200 dark:border-slate-700">
                                            <div id="editorArea"></div>
                                        </div>
                                    </div>
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldEditorMarkupPattern, $newCKEditorMarkup)

# 4. Add CKEditor Instance & Init Methods in Alpine superAdminApp
if (-not $content.Contains('ckEditorInstance: null')) {
    $content = $content.Replace(
        "isHtmlView: false,",
        "ckEditorInstance: null,`n                isHtmlView: false,"
    )
}

$ckEditorMethods = @'
                // ==========================================
                // CKEDITOR 5 METHODS
                initCKEditor() {
                    if (this.ckEditorInstance) {
                        if (this.articleEditor.form.content) {
                            this.ckEditorInstance.setData(this.articleEditor.form.content);
                        }
                        return;
                    }
                    const el = document.querySelector('#editorArea');
                    if (!el || typeof ClassicEditor === 'undefined') return;

                    ClassicEditor.create(el, {
                        toolbar: {
                            items: [
                                'heading',
                                '|',
                                'bold', 'italic', 'underline', 'strikethrough',
                                '|',
                                'link', 'blockQuote', 'insertTable',
                                '|',
                                'bulletedList', 'numberedList',
                                '|',
                                'undo', 'redo'
                            ],
                            shouldNotGroupWhenFull: false
                        },
                        heading: {
                            options: [
                                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                                { model: 'heading1', view: 'h1', title: 'Heading 1 (H1)', class: 'ck-heading_heading1' },
                                { model: 'heading2', view: 'h2', title: 'Heading 2 (H2)', class: 'ck-heading_heading2' },
                                { model: 'heading3', view: 'h3', title: 'Heading 3 (H3)', class: 'ck-heading_heading3' }
                            ]
                        },
                        table: {
                            contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
                        },
                        placeholder: 'Tulis konten artikel berita lengkap di sini dengan format teks, heading, link, tabel, dan kutipan...'
                    })
                    .then(editor => {
                        this.ckEditorInstance = editor;
                        if (this.articleEditor.form.content) {
                            editor.setData(this.articleEditor.form.content);
                        }
                        editor.model.document.on('change:data', () => {
                            this.articleEditor.form.content = editor.getData();
                            this.updateSeoScore();
                        });
                    })
                    .catch(error => {
                        console.error('CKEditor init error:', error);
                    });
                },
'@

if (-not $content.Contains('// CKEDITOR 5 METHODS')) {
    $content = $content.Replace(
        '// BERITA & ARTIKEL CMS METHODS',
        '// BERITA & ARTIKEL CMS METHODS' + "`n" + $ckEditorMethods
    )
}

# 5. Connect openCreateNewsView, editArticle, and saveArticle to CKEditor
$oldOpenCreateNews = @'
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
                        content: '<p>Tulis konten artikel lengkap di sini...</p>',
                        seoScore: 85
                    };
                    this.articleEditor.isOpen = true;
                    this.isHtmlView = false;
                    this.$nextTick(() => {
                        const ed = document.getElementById('editorArea');
                        if (ed) ed.innerHTML = this.articleEditor.form.content;
                    });
                    if (this.isMobile) this.isSidebarOpen = false;
                },
'@

$newOpenCreateNews = @'
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

$content = $content.Replace($oldOpenCreateNews, $newOpenCreateNews)

$oldEditArticle = @'
                editArticle(art) {
                    this.activeTab = 'berita';
                    this.beritaView = 'create';
                    this.isBeritaDropdownOpen = true;
                    this.articleEditor.isEdit = true;
                    this.articleEditor.form = JSON.parse(JSON.stringify(art));
                    this.articleEditor.isOpen = true;
                    this.isHtmlView = false;
                    this.$nextTick(() => {
                        const ed = document.getElementById('editorArea');
                        if (ed) ed.innerHTML = this.articleEditor.form.content || '';
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                },
'@

$newEditArticle = @'
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

$content = $content.Replace($oldEditArticle, $newEditArticle)

# 6. Ensure saveArticle pulls latest content from CKEditor
$oldSaveArticle = @'
                saveArticle(status = 'published') {
                    const f = this.articleEditor.form;
                    if (!f.title) {
                        alert('Mohon lengkapi judul artikel!');
                        return;
                    }
'@

$newSaveArticle = @'
                saveArticle(status = 'published') {
                    if (this.ckEditorInstance) {
                        this.articleEditor.form.content = this.ckEditorInstance.getData();
                    }
                    const f = this.articleEditor.form;
                    if (!f.title) {
                        alert('Mohon lengkapi judul artikel!');
                        return;
                    }
'@

$content = $content.Replace($oldSaveArticle, $newSaveArticle)

[System.IO.File]::WriteAllText($adminPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Integrated Full CKEditor 5 Toolbar in Create News!"
