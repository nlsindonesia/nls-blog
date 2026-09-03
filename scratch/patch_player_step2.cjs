const fs = require('fs');
let content = fs.readFileSync('belajar/lms-player.html', 'utf8');

const regex = /(<!-- Essay -->\s*<template x-if="q\.type === 'essai'">[\s\S]*?<\/template>)/;

const templates = `
                                                    <!-- Fill in the Blanks -->
                                                    <template x-if="q.type === 'blank'">
                                                        <div class="mt-4 space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-100" x-init="if(typeof quizAnswers[q.id] !== 'object' || Array.isArray(quizAnswers[q.id])) quizAnswers[q.id] = {}">
                                                            <div class="text-lg font-medium text-slate-700 leading-loose flex flex-wrap items-center gap-y-3 gap-x-2">
                                                                <template x-for="(part, idx) in (q.blankText || '').split('{dash}')">
                                                                    <div class="flex items-center">
                                                                        <span x-html="part"></span>
                                                                        <template x-if="idx < (q.blankText || '').split('{dash}').length - 1">
                                                                            <input type="text" x-model="quizAnswers[q.id][idx]" @input.debounce.1000ms="debounceAutosave()" class="mx-2 w-32 px-3 py-1 text-center font-bold text-indigo-700 bg-white border-b-2 border-indigo-300 focus:border-indigo-600 focus:outline-none transition-colors shadow-sm rounded-t-md" placeholder="...">
                                                                        </template>
                                                                    </div>
                                                                </template>
                                                            </div>
                                                        </div>
                                                    </template>

                                                    <!-- OSN Biologi (4 Pernyataan) -->
                                                    <template x-if="q.type === 'osn_biologi'">
                                                        <div class="mt-4 space-y-3" x-init="if(typeof quizAnswers[q.id] !== 'object' || Array.isArray(quizAnswers[q.id])) quizAnswers[q.id] = {}">
                                                            <template x-for="(stmt, idx) in q.osnStatements" :key="idx">
                                                                <div class="flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-xl hover:border-indigo-100 transition-colors">
                                                                    <div class="flex-1 pr-6 font-medium text-slate-700" x-html="stmt.text"></div>
                                                                    <div class="flex items-center gap-4 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                                                                        <label class="flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer transition-colors" :class="quizAnswers[q.id][idx] === 'true' ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-slate-200'">
                                                                            <input type="radio" :name="'osn_' + q.id + '_' + idx" value="true" x-model="quizAnswers[q.id][idx]" @change="debounceAutosave()" class="hidden">
                                                                            <span class="font-bold text-sm">BENAR</span>
                                                                        </label>
                                                                        <label class="flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer transition-colors" :class="quizAnswers[q.id][idx] === 'false' ? 'bg-rose-100 text-rose-700' : 'hover:bg-slate-200'">
                                                                            <input type="radio" :name="'osn_' + q.id + '_' + idx" value="false" x-model="quizAnswers[q.id][idx]" @change="debounceAutosave()" class="hidden">
                                                                            <span class="font-bold text-sm">SALAH</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </template>
                                                        </div>
                                                    </template>

                                                    <!-- Range Slider -->
                                                    <template x-if="q.type === 'range'">
                                                        <div class="mt-8 px-4" x-init="if(typeof quizAnswers[q.id] === 'undefined' || Array.isArray(quizAnswers[q.id]) || typeof quizAnswers[q.id] === 'object') quizAnswers[q.id] = ((parseFloat(q.minRange)||0) + (parseFloat(q.maxRange)||100))/2">
                                                            <div class="relative w-full">
                                                                <input type="range" :min="q.minRange || 0" :max="q.maxRange || 100" :step="q.step || 1" x-model="quizAnswers[q.id]" @change="debounceAutosave()" class="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600">
                                                                <div class="flex justify-between mt-3 text-xs font-black text-slate-400">
                                                                    <span x-text="q.minRange || 0"></span>
                                                                    <span x-text="q.maxRange || 100"></span>
                                                                </div>
                                                                <div class="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white font-black px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                                                                    Jawaban: <span x-text="quizAnswers[q.id]"></span>
                                                                    <div class="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-indigo-600 rotate-45"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </template>

                                                    <!-- Interactive Graph -->
                                                    <template x-if="q.type === 'graph'">
                                                        <div class="mt-4 flex justify-center" x-init="if(!Array.isArray(quizAnswers[q.id])) quizAnswers[q.id] = []">
                                                            <div class="relative bg-white border border-slate-300 rounded-lg shadow-inner overflow-hidden cursor-crosshair w-[400px] h-[400px]" 
                                                                 @click="(e) => { 
                                                                     const rect = $el.getBoundingClientRect(); 
                                                                     const clickX = e.clientX - rect.left; 
                                                                     const clickY = e.clientY - rect.top; 
                                                                     const gridX = Math.round((clickX / 400) * 20 - 10); 
                                                                     const gridY = Math.round(10 - (clickY / 400) * 20); 
                                                                     const existing = quizAnswers[q.id].findIndex(p => p.x === gridX && p.y === gridY);
                                                                     if(existing > -1) quizAnswers[q.id].splice(existing, 1);
                                                                     else quizAnswers[q.id].push({x: gridX, y: gridY});
                                                                     debounceAutosave();
                                                                 }">
                                                                <!-- Grid Lines -->
                                                                <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                                                                    <defs>
                                                                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                                                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" stroke-width="1"/>
                                                                        </pattern>
                                                                    </defs>
                                                                    <rect width="400" height="400" fill="url(#grid)" />
                                                                    <!-- Axes -->
                                                                    <line x1="200" y1="0" x2="200" y2="400" stroke="#94a3b8" stroke-width="2" />
                                                                    <line x1="0" y1="200" x2="400" y2="200" stroke="#94a3b8" stroke-width="2" />
                                                                </svg>
                                                                <!-- Points -->
                                                                <template x-for="(pt, i) in quizAnswers[q.id]" :key="i">
                                                                    <div class="absolute w-4 h-4 bg-indigo-500 rounded-full shadow transform -translate-x-1/2 -translate-y-1/2 transition-all hover:bg-rose-500 hover:scale-125"
                                                                         :style="\`left: \${(pt.x + 10) * 20}px; top: \${(10 - pt.y) * 20}px;\`"
                                                                         @click.stop="quizAnswers[q.id].splice(i, 1); debounceAutosave()">
                                                                    </div>
                                                                </template>
                                                            </div>
                                                        </div>
                                                    </template>

                                                    <!-- Jigsaw Puzzle -->
                                                    <template x-if="q.type === 'puzzle'">
                                                        <div class="mt-4" x-init="
                                                            const diff = parseInt(q.puzzleDifficulty) || 4;
                                                            const total = diff * diff;
                                                            if (!Array.isArray(quizAnswers[q.id]) || quizAnswers[q.id].length !== total) {
                                                                quizAnswers[q.id] = Array.from({length: total}, (_, i) => i).sort(() => Math.random() - 0.5);
                                                            }
                                                            $data.selectedPuzzleTile = null;
                                                        ">
                                                            <div class="max-w-md mx-auto">
                                                                <div class="aspect-square w-full relative grid border-4 border-slate-200 rounded-xl overflow-hidden bg-slate-100"
                                                                     :style="\`grid-template-columns: repeat(\${parseInt(q.puzzleDifficulty) || 4}, 1fr); grid-template-rows: repeat(\${parseInt(q.puzzleDifficulty) || 4}, 1fr);\`">
                                                                    <template x-for="(tileIdx, currentPos) in quizAnswers[q.id]" :key="currentPos">
                                                                        <div class="relative border border-white/30 cursor-pointer hover:opacity-80 transition-opacity"
                                                                             :class="$data.selectedPuzzleTile === currentPos ? 'ring-4 ring-inset ring-indigo-500 z-10' : ''"
                                                                             @click="
                                                                                if($data.selectedPuzzleTile === null) {
                                                                                    $data.selectedPuzzleTile = currentPos;
                                                                                } else {
                                                                                    const temp = quizAnswers[q.id][$data.selectedPuzzleTile];
                                                                                    quizAnswers[q.id][$data.selectedPuzzleTile] = quizAnswers[q.id][currentPos];
                                                                                    quizAnswers[q.id][currentPos] = temp;
                                                                                    $data.selectedPuzzleTile = null;
                                                                                    debounceAutosave();
                                                                                }
                                                                             ">
                                                                             <div class="absolute inset-0 bg-cover bg-no-repeat"
                                                                                  :style="\`background-image: url('\${q.puzzleImage || 'https://via.placeholder.com/400'}'); background-size: \${(parseInt(q.puzzleDifficulty)||4)*100}% \${(parseInt(q.puzzleDifficulty)||4)*100}%; background-position: \${(tileIdx % (parseInt(q.puzzleDifficulty)||4)) * (100/(((parseInt(q.puzzleDifficulty)||4)-1) || 1))}% \${Math.floor(tileIdx / (parseInt(q.puzzleDifficulty)||4)) * (100/(((parseInt(q.puzzleDifficulty)||4)-1) || 1))}%;\`">
                                                                             </div>
                                                                        </div>
                                                                    </template>
                                                                </div>
                                                                <p class="text-center text-xs text-slate-500 mt-4 font-bold bg-slate-100 py-2 rounded-lg border border-slate-200 shadow-sm">Klik kotak pertama, lalu klik kotak kedua untuk menukar posisinya.</p>
                                                            </div>
                                                        </div>
                                                    </template>
`;

if (regex.test(content)) {
    content = content.replace(regex, "$1\n" + templates);
    fs.writeFileSync('belajar/lms-player.html', content, 'utf8');
    console.log('Patched step 2: UI Templates injected successfully via regex.');
} else {
    console.log('Failed to find anchor via regex.');
}
