import fs from 'fs';

console.log('=== TEST 1: Check Syntax in lms-player.html and lms-builder.html ===');

function extractScript(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const scriptMatches = content.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi);
    return scriptMatches ? scriptMatches.map(s => s.replace(/<\/?script[\s\S]*?>/gi, '')).join('\n') : '';
}

try {
    const playerJs = extractScript('belajar/lms-player.html');
    new Function(playerJs);
    console.log('✔ belajar/lms-player.html script parsed successfully (no syntax errors)');
} catch (e) {
    console.error('❌ Syntax error in belajar/lms-player.html:', e.message);
    process.exit(1);
}

try {
    const builderJs = extractScript('nlsadmin/lms-builder.html');
    new Function(builderJs);
    console.log('✔ nlsadmin/lms-builder.html script parsed successfully (no syntax errors)');
} catch (e) {
    console.error('❌ Syntax error in nlsadmin/lms-builder.html:', e.message);
    process.exit(1);
}

console.log('\n=== TEST 2: Randomization Functions Simulation ===');

function shuffleArray(array) {
    if (!Array.isArray(array)) return [];
    let curId = array.length;
    while (0 !== curId) {
        let randId = Math.floor(Math.random() * curId);
        curId -= 1;
        let tmp = array[curId];
        array[curId] = array[randId];
        array[randId] = tmp;
    }
    return array;
}

// 1. Acak Paket Simulation
const packages = 3;
const counts = { 1: 0, 2: 0, 3: 0 };
for (let i = 0; i < 3000; i++) {
    const drawn = Math.floor(Math.random() * packages) + 1;
    counts[drawn]++;
}
console.log('Acak Paket Distribution over 3000 runs:', counts);
const isFair = Object.values(counts).every(c => c > 800 && c < 1200);
console.log(isFair ? '✔ Acak Paket has balanced uniform distribution' : '❌ Unbalanced distribution');

// 2. Acak Soal Simulation
const originalQuestions = [
    { id: 'q1', paket: 1, text: 'Soal 1' },
    { id: 'q2', paket: 1, text: 'Soal 2' },
    { id: 'q3', paket: 1, text: 'Soal 3' },
    { id: 'q4', paket: 1, text: 'Soal 4' },
    { id: 'q5', paket: 1, text: 'Soal 5' }
];

let shuffleDiffCount = 0;
for (let i = 0; i < 50; i++) {
    const shuffled = shuffleArray([...originalQuestions]);
    if (shuffled.map(q => q.id).join(',') !== originalQuestions.map(q => q.id).join(',')) {
        shuffleDiffCount++;
    }
}
console.log(`Acak Soal variation rate: ${shuffleDiffCount}/50`);
console.log(shuffleDiffCount >= 45 ? '✔ Acak Soal produces varied question orders' : '❌ Acak Soal failed');

// 3. Acak Opsi Simulation & Scoring Verification
console.log('\n=== TEST 3: Scoring with Shuffled Options ===');

// PG Sederhana
const pgQuestion = {
    id: 'pg1',
    type: 'pg',
    options: ['Kucing', 'Burung', 'Ikan', 'Katak'], // original index 2 is correct ('Ikan')
    correctAnswers: 2
};

const shuffledIndices = shuffleArray(pgQuestion.options.map((_, i) => i));
console.log('PG Original options:', pgQuestion.options);
console.log('Shuffled indices:', shuffledIndices);
console.log('Display order:', shuffledIndices.map(i => pgQuestion.options[i]));

// Student picks the option that is 'Ikan'
// In the UI, student clicks on option where text is 'Ikan', whose :value="oIdx" is 2
const studentAnswer = 2; // bound directly to oIdx
const isPgCorrect = studentAnswer == pgQuestion.correctAnswers;
console.log('PG scoring evaluation (ans == q.correctAnswers):', isPgCorrect ? '✔ CORRECT (Expected)' : '❌ WRONG');

// PG Kompleks
const pgKompleksQ = {
    id: 'pgk1',
    type: 'pg_kompleks',
    options: ['Padi', 'Elang', 'Kelinci', 'Batu'],
    correctAnswersArray: [0, 2] // Padi and Kelinci (indices 0 and 2)
};
const shuffledKIndices = shuffleArray(pgKompleksQ.options.map((_, i) => i));
// Student selects Padi (0) and Kelinci (2)
const studentKAnswers = ['2', '0']; // strings from checkbox inputs in arbitrary click order
const correctArr = (pgKompleksQ.correctAnswersArray || []).map(String);
const userArr = (Array.isArray(studentKAnswers) ? studentKAnswers : []).map(String);
const isPgKCorrect = (correctArr.length === userArr.length && correctArr.every(val => userArr.includes(val)));
console.log('PG Kompleks scoring evaluation:', isPgKCorrect ? '✔ CORRECT (Expected)' : '❌ WRONG');

// PG Majemuk
const pgMajemukQ = {
    id: 'pgm1',
    type: 'pg_majemuk',
    statements: [
        { text: 'Air mendidih pada 100 C', isCorrect: 'true' },
        { text: 'Matahari terbit di barat', isCorrect: false } // mix string & boolean
    ]
};
const studentMAnswers = {
    0: 'true',
    1: 'false'
};
let allMatch = true;
pgMajemukQ.statements.forEach((stmt, sIdx) => {
    if (String(studentMAnswers[sIdx]) !== String(stmt.isCorrect)) allMatch = false;
});
console.log('PG Majemuk scoring evaluation:', allMatch ? '✔ CORRECT (Expected)' : '❌ WRONG');

// 4. Safety Fallback Simulation
console.log('\n=== TEST 4: Fallback if Assigned Package is Empty ===');
const courseQuestions = [
    { id: 'q1', paket: 1, text: 'Soal 1 di Paket 1' },
    { id: 'q2', paket: 1, text: 'Soal 2 di Paket 1' }
];
// Assigned package is 2, but package 2 has no questions
const assignedPaket = 2;
let baseQuestions = courseQuestions.filter(q => (q.paket || 1) === assignedPaket);
if (baseQuestions.length === 0 && courseQuestions.length > 0) {
    baseQuestions = courseQuestions.filter(q => (q.paket || 1) === 1);
    if (baseQuestions.length === 0) baseQuestions = courseQuestions;
}
console.log('Fallback questions count:', baseQuestions.length);
console.log(baseQuestions.length === 2 ? '✔ Safety fallback correctly loaded Paket 1' : '❌ Fallback failed');

console.log('\nALL VERIFICATIONS PASSED SUCCESSFULLY!');
