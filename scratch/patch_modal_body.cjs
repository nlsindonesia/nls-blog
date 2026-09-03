const fs = require('fs');
let content = fs.readFileSync('nlsadmin/lms-results.html', 'utf8');

const modalBodyAnchor = `<div class="px-6 py-5 bg-slate-50/30 max-h-[60vh] overflow-y-auto results-scroll">`;
const modalBodyEndAnchor = `<div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">`;

// Wait, getting exact text between those might be hard. Let's use regex or split.
let parts = content.split(modalBodyAnchor);
let part2 = parts[1].split(modalBodyEndAnchor);

const advancedModalBody = `
                    <div class="px-6 py-5 bg-slate-50/30 max-h-[60vh] overflow-y-auto results-scroll">
                        <template x-if="selectedDetail && getOriginalNode(selectedDetail) && getOriginalNode(selectedDetail).questions">
                            <div class="space-y-6">
                                <template x-for="(q, index) in getOriginalNode(selectedDetail).questions" :key="q.id">
                                    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                                        <!-- Header Soal -->
                                        <div class="flex justify-between items-start mb-3 pb-3 border-b border-slate-100">
                                            <div class="flex items-center gap-2">
                                                <div class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-black text-xs flex items-center justify-center border border-indigo-100" x-text="index + 1"></div>
                                                <div class="text-xs font-bold text-slate-500 uppercase tracking-wider" x-text="'Tipe: ' + (q.type || 'Pilihan Ganda')"></div>
                                            </div>
                                            <!-- Badge Status -->
                                            <div x-show="q.type !== 'essai'" class="text-[10px] font-bold px-2 py-1 rounded-md border"
                                                :class="isCorrectAnswer(q, selectedDetail.answers) ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'">
                                                <span x-text="isCorrectAnswer(q, selectedDetail.answers) ? 'Benar (' + (q.bobot || 10) + ' poin)' : 'Salah (0 poin)'"></span>
                                            </div>
                                            <div x-show="q.type === 'essai'" class="text-[10px] font-bold px-2 py-1 rounded-md border bg-amber-50 text-amber-700 border-amber-200 animate-pulse">
                                                Butuh Koreksi Manual
                                            </div>
                                        </div>
                                        
                                        <!-- Teks Soal -->
                                        <div class="text-sm font-medium text-slate-700 mb-4 prose prose-sm max-w-none" x-html="q.text"></div>
                                        
                                        <!-- Jawaban Siswa -->
                                        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
                                            <div class="text-[11px] font-bold text-slate-500 mb-2">Jawaban Siswa:</div>
                                            <div class="text-sm font-medium text-indigo-900 whitespace-pre-wrap" x-text="getStudentAnswerText(q, selectedDetail.answers)"></div>
                                        </div>
                                        
                                        <!-- Input Koreksi (HANYA UNTUK ESSAI) -->
                                        <div x-show="q.type === 'essai'" class="bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 mt-4">
                                            <div class="flex flex-col md:flex-row gap-4 items-start md:items-center">
                                                <div class="flex-1 w-full">
                                                    <label class="block text-xs font-bold text-slate-600 mb-1">Berikan Nilai (Maks: <span x-text="q.bobot || 10"></span>)</label>
                                                    <input type="number" min="0" :max="q.bobot || 10" x-model.number="gradingScores[q.id]" class="w-full md:w-32 p-2 rounded-lg border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-amber-400 focus:border-amber-400">
                                                </div>
                                                <div class="flex-2 w-full">
                                                    <label class="block text-xs font-bold text-slate-600 mb-1">Catatan / Umpan Balik (Opsional)</label>
                                                    <input type="text" x-model="gradingFeedback[q.id]" placeholder="Ketik catatan untuk siswa..." class="w-full p-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </template>
                        
                        <!-- Fallback for Legacy Raw JSON -->
                        <template x-if="!selectedDetail || !getOriginalNode(selectedDetail) || !getOriginalNode(selectedDetail).questions">
                            <div class="space-y-4">
                                <template x-if="selectedDetail && selectedDetail.answers && Object.keys(selectedDetail.answers).length > 0">
                                    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm font-medium text-slate-700 whitespace-pre-wrap overflow-x-auto">
                                        <pre x-text="JSON.stringify(selectedDetail.answers, null, 2)" class="text-xs text-indigo-900 font-mono"></pre>
                                    </div>
                                </template>
                                <template x-if="!selectedDetail || !selectedDetail.answers || Object.keys(selectedDetail.answers).length === 0">
                                    <div class="text-center text-slate-500 font-medium text-sm py-4">
                                        Tidak ada data jawaban yang tersedia.
                                    </div>
                                </template>
                                <div class="mt-4 p-4 rounded-xl bg-sky-50 border border-sky-200">
                                    <p class="text-xs font-bold text-sky-800">Mode Tampilan Mentah</p>
                                    <p class="text-[11px] text-sky-700 mt-1">Data master soal tidak ditemukan (kemungkinan kuis lawas yang dihapus). Anda hanya melihat raw JSON ID soal dan jawaban.</p>
                                </div>
                            </div>
                        </template>
                    </div>
`;

content = parts[0] + advancedModalBody + modalBodyEndAnchor + part2[1];

fs.writeFileSync('nlsadmin/lms-results.html', content, 'utf8');
console.log('Patched modal body');
