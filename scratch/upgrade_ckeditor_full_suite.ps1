$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$content = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

# 1. Update CKEditor CSS in <style>
$oldCkeStyles = @'
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

$newCkeStyles = @'
        /* =========================================================================
           CKEDITOR 4 FULL COMPLETE SUITE STYLING & DIALOGS
           ========================================================================= */
        .cke_chrome {
            border: 2px solid #cbd5e1 !important;
            border-radius: 1rem !important;
            overflow: hidden !important;
            box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.08) !important;
        }
        html.dark .cke_chrome {
            border-color: #334155 !important;
        }
        .cke_top {
            background: #f8fafc !important;
            border-bottom: 1.5px solid #cbd5e1 !important;
            padding: 8px 10px !important;
        }
        html.dark .cke_top {
            background: #0f172a !important;
            border-color: #334155 !important;
        }
        .cke_bottom {
            background: #f1f5f9 !important;
            border-top: 1px solid #e2e8f0 !important;
        }
        html.dark .cke_bottom {
            background: #0f172a !important;
            border-color: #334155 !important;
        }
        .cke_contents {
            background: #ffffff !important;
            min-height: 420px !important;
        }
        /* CKEditor Dialogs High Contrast & Clean Styling */
        .cke_dialog {
            border-radius: 1.25rem !important;
            overflow: hidden !important;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35) !important;
        }
        .cke_dialog_title {
            background: #0284c7 !important;
            color: #ffffff !important;
            font-weight: 800 !important;
            padding: 12px 18px !important;
        }
        .cke_dialog_contents {
            background: #ffffff !important;
            padding: 16px !important;
        }
        .cke_dialog_ui_button {
            border-radius: 0.75rem !important;
            font-weight: 700 !important;
            padding: 6px 14px !important;
        }
        .cke_dialog_ui_button_ok {
            background: #0284c7 !important;
            color: #ffffff !important;
            border: none !important;
        }
'@

$content = $content.Replace($oldCkeStyles, $newCkeStyles)

# 2. Update initCKEditor method in JS
$oldInitCKEditor = @'
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

$newInitCKEditor = @'
                // CKEDITOR 4 FULL COMPLETE METHODS (DYNAMIC 2-WAY SYNC & FULL SUITE)
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
                        height: 440,
                        uiColor: '#f8fafc',
                        extraPlugins: 'font,colorbutton,justify,table,tabletools,tableresize,autolink',
                        fontSize_sizes: '8/8px;9/9px;10/10px;11/11px;12/12px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;28/28px;32/32px;36/36px;48/48px;72/72px;',
                        font_names: 'Inter/Inter, sans-serif;Arial/Arial, Helvetica, sans-serif;Comic Sans MS/Comic Sans MS, cursive;Courier New/Courier New, Courier, monospace;Georgia/Georgia, serif;Lucida Sans Unicode/Lucida Sans Unicode, Lucida Grande, sans-serif;Tahoma/Tahoma, Geneva, sans-serif;Times New Roman/Times New Roman, Times, serif;Trebuchet MS/Trebuchet MS, Helvetica, sans-serif;Verdana/Verdana, Geneva, sans-serif;',
                        toolbar: [
                            { name: 'document', items: [ 'Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates' ] },
                            { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
                            { name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
                            { name: 'insert', items: [ 'Image', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] },
                            '/',
                            { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
                            { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl' ] },
                            { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
                            '/',
                            { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
                            { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
                            { name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] },
                            { name: 'about', items: [ 'About' ] }
                        ],
                        removeButtons: '',
                        allowedContent: true,
                        autoParagraph: false,
                        fillEmptyBlocks: false
                    });

                    const inst = CKEDITOR.instances['editorArea'];
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
                },
'@

$content = $content.Replace($oldInitCKEditor, $newInitCKEditor)

# 3. Update syncEditorContent and updateSeoScore
$oldSyncContent = @'
                syncEditorContent() {
                    const ed = document.getElementById('editorArea');
                    if (ed) this.articleEditor.form.content = ed.innerHTML;
                },
'@

$newSyncContent = @'
                syncEditorContent() {
                    if (typeof CKEDITOR !== 'undefined' && CKEDITOR.instances['editorArea']) {
                        this.articleEditor.form.content = CKEDITOR.instances['editorArea'].getData();
                    } else {
                        const ed = document.getElementById('editorArea');
                        if (ed) this.articleEditor.form.content = ed.value || ed.innerHTML || '';
                    }
                },

                updateSeoScore() {
                    this.articleEditor.form.seoScore = this.calculateSeoScore();
                },
'@

$content = $content.Replace($oldSyncContent, $newSyncContent)

[System.IO.File]::WriteAllText($adminPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Upgraded CKEditor Full Suite with complete dynamic 2-way sync and full toolbar tools in /nlsadmin!"
