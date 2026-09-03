const fs = require('fs');
let content = fs.readFileSync('nlsadmin/lms-results.html', 'utf8');

const alpineStateAnchor = `showDetailModal: false,
                selectedDetail: null,`;

const alpineNewState = `showDetailModal: false,
                selectedDetail: null,
                gradingScores: {},
                gradingFeedback: {},
                isSavingGrade: false,
`;

content = content.replace(alpineStateAnchor, alpineNewState);

const alpineMethodsAnchor = `needsGrading(r) {`;
const alpineNewMethods = `
                openGrading(r) {
                    this.selectedDetail = r;
                    this.gradingScores = {};
                    this.gradingFeedback = {};
                    
                    const node = this.getOriginalNode(r);
                    if (node && node.questions && r.answers) {
                        // Pre-fill grading scores based on existing metadata or calculated values
                        node.questions.forEach(q => {
                            if (q.type !== 'essai') {
                                this.gradingScores[q.id] = this.isCorrectAnswer(q, r.answers) ? (q.bobot || 10) : 0;
                            } else {
                                // If already graded previously, load it
                                if (r.answers._meta && r.answers._meta.gradedScores && r.answers._meta.gradedScores[q.id] !== undefined) {
                                    this.gradingScores[q.id] = r.answers._meta.gradedScores[q.id];
                                } else {
                                    this.gradingScores[q.id] = 0; // Default needs grading
                                }
                                if (r.answers._meta && r.answers._meta.feedback && r.answers._meta.feedback[q.id]) {
                                    this.gradingFeedback[q.id] = r.answers._meta.feedback[q.id];
                                }
                            }
                        });
                    }
                    this.showDetailModal = true;
                },
                
                get liveTotalScore() {
                    const node = this.getOriginalNode(this.selectedDetail);
                    if (!node || !node.questions) return this.selectedDetail ? this.selectedDetail.score : 0;
                    
                    let totalEarned = 0;
                    let totalMax = 0;
                    
                    node.questions.forEach(q => {
                        totalMax += (q.bobot || 10);
                        if (this.gradingScores[q.id] !== undefined) {
                            totalEarned += Number(this.gradingScores[q.id]);
                        }
                    });
                    
                    if (totalMax === 0) return 0;
                    return Math.round((totalEarned / totalMax) * 100);
                },
                
                async saveGrading() {
                    if (!this.selectedDetail) return;
                    this.isSavingGrade = true;
                    try {
                        const newScore = this.liveTotalScore;
                        
                        // Inject feedback and graded scores into answers
                        let updatedAnswers = JSON.parse(JSON.stringify(this.selectedDetail.answers));
                        if (!updatedAnswers._meta) updatedAnswers._meta = {};
                        updatedAnswers._meta.gradedScores = this.gradingScores;
                        updatedAnswers._meta.feedback = this.gradingFeedback;
                        
                        const res = await fetch('/api/pg-lms', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                action: 'admin_update_quiz_result',
                                resultId: this.selectedDetail.id,
                                newScore: newScore,
                                updatedAnswers: updatedAnswers
                            })
                        });
                        const data = await res.json();
                        if (data.success) {
                            // Update local data
                            this.selectedDetail.score = newScore;
                            this.selectedDetail.answers = updatedAnswers;
                            this.showDetailModal = false;
                        } else {
                            alert('Gagal menyimpan nilai: ' + data.message);
                        }
                    } catch(e) {
                        console.error(e);
                        alert('Terjadi kesalahan jaringan.');
                    } finally {
                        this.isSavingGrade = false;
                    }
                },
                
                isCorrectAnswer(q, answers) {
                    if (!answers) return false;
                    const ans = answers[q.id];
                    if (ans === undefined) return false;
                    if (q.type === 'pg') {
                        return q.answer && q.answer.toString() === ans.toString();
                    }
                    if (q.type === 'pg_kompleks') {
                        if (!Array.isArray(q.answer) || !Array.isArray(ans)) return false;
                        const sortedExpected = [...q.answer].sort();
                        const sortedGiven = [...ans].sort();
                        return JSON.stringify(sortedExpected) === JSON.stringify(sortedGiven);
                    }
                    if (q.type === 'tf') {
                        return q.answer !== undefined && q.answer.toString() === ans.toString();
                    }
                    if (q.type === 'blank') {
                        let expected = Array.isArray(q.answer) ? q.answer : [q.answer];
                        let cleanAns = ans.toString().toLowerCase().trim();
                        return expected.some(ex => ex.toString().toLowerCase().trim() === cleanAns);
                    }
                    if (q.type === 'osn_biologi') {
                        if (!Array.isArray(q.answer) || !Array.isArray(ans)) return false;
                        let correctCount = 0;
                        for (let i = 0; i < 4; i++) {
                            if (q.answer[i] === ans[i]) correctCount++;
                        }
                        return correctCount === 4; // Basic check for full score for simplicity in UI display
                    }
                    if (q.type === 'range') {
                        let given = parseFloat(ans);
                        if (isNaN(given)) return false;
                        if (Array.isArray(q.answer)) return given >= q.answer[0] && given <= q.answer[1];
                        return given === parseFloat(q.answer);
                    }
                    if (q.type === 'graph') {
                        if (!q.answer || !ans) return false;
                        return parseFloat(ans.x) === parseFloat(q.answer.x) && parseFloat(ans.y) === parseFloat(q.answer.y);
                    }
                    if (q.type === 'puzzle') {
                        if (!Array.isArray(q.answer) || !Array.isArray(ans)) return false;
                        return JSON.stringify(q.answer) === JSON.stringify(ans);
                    }
                    return false; // Essai defaults to false for auto-check
                },
                
                getStudentAnswerText(q, answers) {
                    if (!answers || answers[q.id] === undefined) return '(Kosong)';
                    const ans = answers[q.id];
                    
                    if (q.type === 'pg' && q.options && q.options[ans]) {
                        return \`[\${String.fromCharCode(65 + parseInt(ans))}] \${q.options[ans]}\`;
                    }
                    if (q.type === 'pg_kompleks' && Array.isArray(ans) && q.options) {
                        return ans.map(a => \`[\${String.fromCharCode(65 + parseInt(a))}] \${q.options[a]}\`).join('\\n');
                    }
                    if (q.type === 'tf') {
                        return ans.toString() === '1' ? 'Benar (T)' : 'Salah (F)';
                    }
                    if (q.type === 'osn_biologi' && Array.isArray(ans)) {
                        return ans.map((a, i) => \`Pernyataan \${i+1}: \${a === 1 ? 'Benar' : (a === 0 ? 'Salah' : 'Kosong')}\`).join('\\n');
                    }
                    if (q.type === 'graph' && ans.x !== undefined) {
                        return \`Titik Koordinat: X = \${ans.x}, Y = \${ans.y}\`;
                    }
                    if (q.type === 'puzzle') {
                        return Array.isArray(ans) ? 'Susunan: ' + ans.join(', ') : ans;
                    }
                    return ans.toString();
                },
                
                needsGrading(r) {`;

content = content.replace(alpineMethodsAnchor, alpineNewMethods);

// Now update the modal footer to add the Save button
const oldModalFooter = `<div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button @click="showDetailModal = false" class="px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-sm shadow-sm active:scale-95">
                        Tutup
                    </button>
                </div>`;

const newModalFooter = `
                <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                    <template x-if="getOriginalNode(selectedDetail) && getOriginalNode(selectedDetail).questions">
                        <div class="flex flex-col">
                            <span class="text-xs font-bold text-slate-500 uppercase">Kalkulasi Nilai Baru</span>
                            <div class="flex items-baseline gap-1">
                                <span class="text-2xl font-black text-indigo-700" x-text="liveTotalScore"></span>
                                <span class="text-sm font-bold text-slate-400">/ 100</span>
                            </div>
                        </div>
                    </template>
                    <template x-if="!getOriginalNode(selectedDetail) || !getOriginalNode(selectedDetail).questions">
                        <div></div>
                    </template>
                    <div class="flex items-center gap-3">
                        <button @click="showDetailModal = false" :disabled="isSavingGrade" class="px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-sm shadow-sm active:scale-95 disabled:opacity-50">
                            Tutup
                        </button>
                        <template x-if="getOriginalNode(selectedDetail) && getOriginalNode(selectedDetail).questions">
                            <button @click="saveGrading()" :disabled="isSavingGrade" class="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all text-sm shadow-md active:scale-95 flex items-center gap-2 disabled:opacity-50">
                                <svg x-show="isSavingGrade" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span x-text="isSavingGrade ? 'Menyimpan...' : 'Simpan Nilai Akhir'"></span>
                            </button>
                        </template>
                    </div>
                </div>`;

content = content.replace(oldModalFooter, newModalFooter);

fs.writeFileSync('nlsadmin/lms-results.html', content, 'utf8');
console.log('Patched modal methods and footer');
