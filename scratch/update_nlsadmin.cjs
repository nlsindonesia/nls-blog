const fs = require('fs');
let file = fs.readFileSync('c:/Users/vc/Documents/nls-blog-hame/nls-blog-hame/nlsadmin/index.html', 'utf8');

// 1. Update Select HTML
const oldSelectHTML = `<label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold">Pilih Guru / Mentor Pengajar *</label>
                            <select x-model="courseModal.form.mentor" required class="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold">`;
const newSelectHTML = `<label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold">Pilih Guru / Mentor Pengajar * <span class="text-[10px] text-slate-500 font-normal ml-2">(Bisa pilih lebih dari satu, tahan Ctrl/Cmd)</span></label>
                            <select x-model="courseModal.form.mentorArr" multiple required class="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold" style="min-height: 100px;">`;
file = file.replace(oldSelectHTML, newSelectHTML);
if (file.indexOf(newSelectHTML) === -1) console.log('Failed to replace select HTML');

// 2. Update Course Card Render
const oldRender = `<div x-text="(course.mentor || 'Admin').split(' ')[0]"></div>
                                                        <div x-text="(course.mentor || 'Admin').split(' ').slice(1).join(' ')" class="font-medium text-[11px] text-slate-500"></div>`;
const newRender = `<div x-text="(course.mentor || 'Admin').split(',')[0]"></div>
                                                        <div x-show="(course.mentor || '').includes(',')" x-text="'+ ' + ((course.mentor || '').split(',').length - 1) + ' Author'" class="font-medium text-[11px] text-slate-500 mt-0.5"></div>
                                                        <div x-show="!(course.mentor || '').includes(',')" x-text="(course.mentor || 'Admin').split(' ').slice(1).join(' ')" class="font-medium text-[11px] text-slate-500 mt-0.5"></div>`;
file = file.replace(oldRender, newRender);
if (file.indexOf(newRender) === -1) console.log('Failed to replace render HTML');

// 3. Update openCourseModal
const oldOpen = `mentor: 'Tim Akademik NLS',
                            mentor_id: 't-1',`;
const newOpen = `mentor: 'Tim Akademik NLS',
                            mentorArr: ['Tim Akademik NLS'],
                            mentor_id: 't-1',`;
file = file.replace(oldOpen, newOpen);
if (file.indexOf(newOpen) === -1) console.log('Failed to replace openCourseModal');

// 4. Update editCourseInfo
const oldEdit = `editCourseInfo(course) {
                    this.courseModal.isEdit = true;
                    this.courseModal.form = JSON.parse(JSON.stringify(course));
                    this.courseModal.isOpen = true;
                },`;
const newEdit = `editCourseInfo(course) {
                    this.courseModal.isEdit = true;
                    this.courseModal.form = JSON.parse(JSON.stringify(course));
                    this.courseModal.form.mentorArr = (this.courseModal.form.mentor || '').split(',').map(s => s.trim()).filter(s => s);
                    this.courseModal.isOpen = true;
                },`;
file = file.replace(oldEdit, newEdit);
if (file.indexOf(newEdit) === -1) console.log('Failed to replace editCourseInfo');

// 5. Update saveCourseData
const oldSave = `saveCourseData() {
                    const form = this.courseModal.form;
                    if (!form.title || !form.title.trim()) {
                        alert('Judul course wajib diisi.');
                        return;
                    }

                    const newCourse = {
                        ...form,
                        title: form.title.trim(),`;
const newSave = `saveCourseData() {
                    const form = this.courseModal.form;
                    if (!form.title || !form.title.trim()) {
                        alert('Judul course wajib diisi.');
                        return;
                    }
                    if (Array.isArray(form.mentorArr) && form.mentorArr.length > 0) {
                        form.mentor = form.mentorArr.join(', ');
                    }

                    const newCourse = {
                        ...form,
                        title: form.title.trim(),`;
file = file.replace(oldSave, newSave);
if (file.indexOf(newSave) === -1) console.log('Failed to replace saveCourseData');

fs.writeFileSync('c:/Users/vc/Documents/nls-blog-hame/nls-blog-hame/nlsadmin/index.html', file, 'utf8');
console.log('Update finished.');
