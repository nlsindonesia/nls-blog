const fs = require('fs');
let content = fs.readFileSync('belajar/lms-player.html', 'utf8');

const regex = /<div x-init="if\(\!quizAnswers\[q\.id\]\) quizAnswers\[q\.id\] = \[\]"><\/div>\s*<template x-for="\(oIdx, loopIdx\) in q\._shuffledIndices" :key="oIdx">\s*<label class="flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all"\s*:class="quizAnswers\[q\.id\]\.includes\(oIdx\.toString\(\)\) \? 'bg-indigo-50\/80 border-indigo-400 shadow-md shadow-indigo-100\/50' : 'border-slate-100 hover:border-indigo-200 hover:bg-indigo-50\/30'">\s*<input type="checkbox" :name="'q_' \+ q\.id" :value="oIdx\.toString\(\)" x-model="quizAnswers\[q\.id\]" @change="debounceAutosave\(\)" class="mt-1 w-5 h-5 text-indigo-600 border-slate-300 focus:ring-indigo-600 cursor-pointer rounded">/m;

const replacement = `<div x-init="if(!Array.isArray(quizAnswers[q.id])) quizAnswers[q.id] = []"></div>
                                                            <template x-for="(oIdx, loopIdx) in q._shuffledIndices" :key="oIdx">
                                                                    <label class="flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all" 
                                                                        :class="(Array.isArray(quizAnswers[q.id]) && quizAnswers[q.id].includes(oIdx.toString())) ? 'bg-indigo-50/80 border-indigo-400 shadow-md shadow-indigo-100/50' : 'border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30'">
                                                                        <input type="checkbox" :name="'q_' + q.id" :value="oIdx.toString()" 
                                                                            :checked="Array.isArray(quizAnswers[q.id]) && quizAnswers[q.id].includes(oIdx.toString())"
                                                                            @change="if(!Array.isArray(quizAnswers[q.id])) quizAnswers[q.id] = []; if($el.checked) { if(!quizAnswers[q.id].includes($el.value)) quizAnswers[q.id].push($el.value); } else { quizAnswers[q.id] = quizAnswers[q.id].filter(v => v !== $el.value); } debounceAutosave()" 
                                                                            class="mt-1 w-5 h-5 text-indigo-600 border-slate-300 focus:ring-indigo-600 cursor-pointer rounded">`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('belajar/lms-player.html', content, 'utf8');
    console.log('Fixed PG Kompleks bug!');
} else {
    console.log('Regex did not match.');
}
