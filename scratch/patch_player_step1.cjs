const fs = require('fs');
let content = fs.readFileSync('belajar/lms-player.html', 'utf8');

// 1. Label Tag Modification
content = content.replace(
    /x-text="q\.type === 'pg' \? 'PG Sederhana' : q\.type === 'pg_kompleks' \? 'PG Kompleks' : q\.type === 'pg_majemuk' \? 'B\/S Majemuk' : q\.type === 'jodoh' \? 'Menjodohkan' : q\.type === 'isian' \? 'Isian Singkat' : 'Essay'"/,
    `x-text="q.type === 'pg' ? 'PG Sederhana' : q.type === 'pg_kompleks' ? 'PG Kompleks' : q.type === 'pg_majemuk' ? 'B/S Majemuk' : q.type === 'jodoh' ? 'Menjodohkan' : q.type === 'isian' ? 'Isian Singkat' : q.type === 'blank' ? 'Isi Titik' : q.type === 'osn_biologi' ? 'OSN Biologi' : q.type === 'range' ? 'Tebak Angka' : q.type === 'graph' ? 'Titik Koordinat' : q.type === 'puzzle' ? 'Jigsaw Puzzle' : 'Essay'"`
);

// 2. Add Auto-Grading Logic
// Find auto-grading block
const gradeBlockEnd = /else if \(q\.type === 'isian'\) \{([\s\S]*?)\}\r?\n/m;
const newGradingLogic = `else if (q.type === 'isian') {$1}
                        else if (q.type === 'blank') {
                            const ans = this.quizAnswers[q.id] || {};
                            let correctParts = 0;
                            const totalParts = (q.blankText.match(/{dash}/g) || []).length;
                            const keys = q.blankAnswers.split(',').map(s => s.trim().toLowerCase());
                            for(let i=0; i<totalParts; i++) {
                                if (ans[i] && keys.includes(ans[i].trim().toLowerCase())) correctParts++;
                            }
                            if(totalParts > 0) qScore = (correctParts / totalParts) * q.points;
                        }
                        else if (q.type === 'osn_biologi') {
                            const ans = this.quizAnswers[q.id] || {};
                            let correctStmts = 0;
                            if (Array.isArray(q.osnStatements)) {
                                q.osnStatements.forEach((stmt, idx) => {
                                    if (ans[idx] === stmt.isTrue.toString()) correctStmts++;
                                });
                            }
                            if (correctStmts === 4) qScore = q.points;
                            else if (correctStmts === 3) qScore = q.points * 0.6;
                            else if (correctStmts === 2) qScore = q.points * 0.2;
                            else qScore = 0;
                        }
                        else if (q.type === 'range') {
                            const ans = this.quizAnswers[q.id];
                            if (ans && parseFloat(ans) === parseFloat(q.correctRange)) qScore = q.points;
                        }
                        else if (q.type === 'graph') {
                            const ans = this.quizAnswers[q.id] || [];
                            let allCorrect = true;
                            if (!q.graphCoordinates || ans.length !== q.graphCoordinates.length) allCorrect = false;
                            else {
                                // check if every coordinate in q is present in ans
                                q.graphCoordinates.forEach(gc => {
                                    const match = ans.find(a => parseFloat(a.x) === parseFloat(gc.x) && parseFloat(a.y) === parseFloat(gc.y));
                                    if (!match) allCorrect = false;
                                });
                            }
                            if (allCorrect) qScore = q.points;
                        }
                        else if (q.type === 'puzzle') {
                            const ans = this.quizAnswers[q.id] || [];
                            const totalPieces = Math.pow(parseInt(q.puzzleDifficulty) || 4, 2);
                            let allCorrect = ans.length === totalPieces;
                            if (allCorrect) {
                                for(let i=0; i<totalPieces; i++) {
                                    if (ans[i] !== i) { allCorrect = false; break; }
                                }
                            }
                            if (allCorrect) qScore = q.points;
                        }
`;

content = content.replace(gradeBlockEnd, newGradingLogic);

fs.writeFileSync('belajar/lms-player.html', content, 'utf8');
console.log('Patched step 1: Tags and auto-grading.');
