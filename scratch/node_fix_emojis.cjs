const fs = require('fs');

let str = fs.readFileSync('belajar/index.html', 'utf8');

const replacements = {
    '≡ƒöæ': '🔑',
    '≡ƒô¥': '📝',
    '≡ƒæ¿ΓÇì≡ƒÅ½': '👨‍🏫',
    '┬│': '³',
    '┬▓': '²',
    'Schr├╢dinger': 'Schrödinger',
    '≡ƒÅ½': '🏫',
    '≡ƒÅå': '🏆',
    '≡ƒÄô': '🎓',
    'Γ£¿': '✨',
    '≡ƒæì': '👍',
    'ΓÜí': '⚡'
};

for (const [bad, good] of Object.entries(replacements)) {
    str = str.split(bad).join(good);
}

fs.writeFileSync('belajar/index.html', str, 'utf8');
console.log('Fixed file via Node.js!');
