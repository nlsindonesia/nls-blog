$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$content = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

# 1. Update <head> to load CKEditor 4 Full-All package
$content = $content.Replace(
    '<script src="https://cdn.ckeditor.com/ckeditor5/41.3.1/classic/ckeditor.js"></script>',
    '<script src="https://cdn.ckeditor.com/4.22.1/full-all/ckeditor.js"></script>'
)

# 2. Add CKEditor 4 Custom Container Styling
$cke4Css = @'
        /* =========================================================================
           CKEDITOR 4 FULL COMPLETE SUITE STYLING
           ========================================================================= */
        .cke_chrome {
            border: 1px solid #cbd5e1 !important;
            border-radius: 1rem !important;
            overflow: hidden !important;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05) !important;
        }
        .cke_top {
            background: #f1f5f9 !important;
            border-bottom: 1px solid #cbd5e1 !important;
            padding: 8px 10px !important;
        }
        .cke_bottom {
            background: #f8fafc !important;
            border-top: 1px solid #e2e8f0 !important;
        }
        .cke_contents {
            background: #ffffff !important;
        }
'@

if (-not $content.Contains('CKEDITOR 4 FULL COMPLETE SUITE STYLING')) {
    $content = $content.Replace('</style>', $cke4Css + "`n    </style>")
}

# 3. Update HTML markup for textarea in Create News
$oldCKEditor5Markup = @'
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

$newCKEditor4Markup = @'
<!-- CKEDITOR 4 FULL COMPLETE WYSIWYG TOOLBAR -->
                                    <div>
                                        <div class="flex items-center justify-between mb-2">
                                            <label class="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                                Isi Konten Berita &amp; Artikel (CKEditor Full Suite)
                                            </label>
                                            <span class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                                                CKEditor Full Toolbar Active
                                            </span>
                                        </div>
                                        <div class="rounded-2xl overflow-hidden shadow-sm">
                                            <textarea id="editorArea" name="editorArea" rows="12"></textarea>
                                        </div>
                                    </div>
'@

$content = $content.Replace($oldCKEditor5Markup, $newCKEditor4Markup)

# 4. Replace CKEditor initialization methods with CKEditor 4 implementation
$oldCKEditor5Methods = @'
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

$newCKEditor4Methods = @'
                // ==========================================
                // CKEDITOR 4 FULL METHODS
                initCKEditor() {
                    if (typeof CKEDITOR === 'undefined') return;

                    if (CKEDITOR.instances['editorArea']) {
                        try {
                            CKEDITOR.instances['editorArea'].destroy(true);
                        } catch (e) {}
                    }

                    const textarea = document.getElementById('editorArea');
                    if (!textarea) return;

                    CKEDITOR.replace('editorArea', {
                        height: 380,
                        uiColor: '#f1f5f9',
                        toolbar: [
                            { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
                            { name: 'editing', items: [ 'Scayt' ] },
                            { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
                            { name: 'insert', items: [ 'Image', 'Table', 'HorizontalRule', 'SpecialChar' ] },
                            { name: 'tools', items: [ 'Maximize', 'Source' ] },
                            '/',
                            { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Strike', 'Underline', 'RemoveFormat' ] },
                            { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
                            { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
                            { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
                            { name: 'about', items: [ 'About' ] }
                        ],
                        removeButtons: '',
                        allowedContent: true
                    });

                    const inst = CKEDITOR.instances['editorArea'];
                    inst.on('instanceReady', () => {
                        if (this.articleEditor && this.articleEditor.form && this.articleEditor.form.content) {
                            inst.setData(this.articleEditor.form.content);
                        }
                    });

                    inst.on('change', () => {
                        const data = inst.getData();
                        if (this.articleEditor && this.articleEditor.form) {
                            this.articleEditor.form.content = data;
                            this.updateSeoScore();
                        }
                    });
                },
'@

$content = $content.Replace($oldCKEditor5Methods, $newCKEditor4Methods)

# 5. Connect saveArticle to CKEDITOR.instances['editorArea']
$content = $content.Replace(
    'if (this.ckEditorInstance) {',
    "if (typeof CKEDITOR !== 'undefined' && CKEDITOR.instances['editorArea']) { this.articleEditor.form.content = CKEDITOR.instances['editorArea'].getData(); }"
)

[System.IO.File]::WriteAllText($adminPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Upgraded to Full CKEditor 4 Toolbar Suite matching screenshot exactly!"
