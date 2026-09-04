import fs from 'fs';

console.log('=== TEST: Comprehensive Live Preview & New Types Validation ===');

const builderContent = fs.readFileSync('nlsadmin/lms-builder.html', 'utf8');

// Check that all 5 newest types are represented in the preview template
const requiredTypes = [
    { type: 'graph', label: 'Titik Koordinat Kartesius' },
    { type: 'range', label: 'Range Slider' },
    { type: 'puzzle', label: 'Jigsaw Puzzle' },
    { type: 'blank', label: 'Isi Titik-Titik' },
    { type: 'osn_biologi', label: 'OSN Biologi' }
];

let allFound = true;
requiredTypes.forEach(rt => {
    const previewMatch = builderContent.includes(`previewQ.type === '${rt.type}'`);
    if (previewMatch) {
        console.log(`✔ Found template for ${rt.type} (${rt.label}) in Live Preview modal`);
    } else {
        console.error(`❌ Missing template for ${rt.type} in Live Preview modal!`);
        allFound = false;
    }
});

// Check that pointer-events-none is NOT disabling the preview card
if (builderContent.includes('relative pointer-events-none')) {
    console.error('❌ Found pointer-events-none in preview card - preview controls would not be clickable!');
    process.exit(1);
} else {
    console.log('✔ Verified no pointer-events-none blocking user interaction in preview');
}

// Check that showKey toggle exists
if (builderContent.includes('previewSim.showKey')) {
    console.log('✔ Verified "Lihat Kunci Jawaban" teacher peek toggle is implemented');
} else {
    console.error('❌ Missing previewSim.showKey toggle');
    process.exit(1);
}

// Check player scoring for all 5 newest question types
const playerContent = fs.readFileSync('belajar/lms-player.html', 'utf8');
const scoreChecks = [
    'else if (q.type === \'blank\')',
    'else if (q.type === \'osn_biologi\')',
    'else if (q.type === \'range\')',
    'else if (q.type === \'graph\')',
    'else if (q.type === \'puzzle\')'
];

scoreChecks.forEach(sc => {
    if (playerContent.includes(sc)) {
        console.log(`✔ Found scoring block: ${sc}`);
    } else {
        console.error(`❌ Missing scoring block: ${sc}`);
        allFound = false;
    }
});

if (!allFound) {
    process.exit(1);
}

console.log('\nALL PREVIEW & NEW QUESTION TYPE CHECKS PASSED PERFECTLY!');
