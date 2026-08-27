$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$content = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

# 1. Add CSS to suppress CKEditor notifications & warning boxes
$oldCkeCss = @'
        /* CKEditor Dialogs High Contrast & Clean Styling */
        .cke_dialog {
'@

$newCkeCss = @'
        /* Suppress CKEditor 4 Security / Version Warning Nag Banner Completely */
        .cke_notification_warning,
        .cke_notifications_area,
        .cke_notification,
        .cke_notification_message,
        .cke_notification_close {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            height: 0 !important;
            min-height: 0 !important;
            max-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
        }

        /* CKEditor Dialogs High Contrast & Clean Styling */
        .cke_dialog {
'@

$content = $content.Replace($oldCkeCss, $newCkeCss)

# 2. Update initCKEditor in JS to disable versionCheck & cancel notificationShow
$oldInitJs = @'
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

$newInitJs = @'
                // CKEDITOR 4 FULL COMPLETE METHODS (DYNAMIC 2-WAY SYNC & SUPPRESSED WARNINGS)
                initCKEditor() {
                    if (typeof CKEDITOR === 'undefined') return;

                    CKEDITOR.config.versionCheck = false;

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
                        versionCheck: false,
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
                    
                    // Permanently suppress any notification/nag popup event
                    inst.on('notificationShow', function(ev) {
                        ev.cancel();
                    });
                    inst.on('notificationUpdate', function(ev) {
                        ev.cancel();
                    });

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

$content = $content.Replace($oldInitJs, $newInitJs)

[System.IO.File]::WriteAllText($adminPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Suppressed CKEditor security version warning popup permanently!"
