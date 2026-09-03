const fs = require('fs');
let content = fs.readFileSync('belajar/lms-player.html', 'utf8');

const searchStr = '>                                            Mulai Kerjakan';
const replaceStr = '>                                            <span x-text="(pastScores && pastScores[activeNode.id] && pastScores[activeNode.id].some(h => h.status === \'in_progress\')) ? \'Lanjutkan Kuis\' : \'Mulai Kerjakan\'"></span>';

content = content.replace(searchStr, replaceStr);

fs.writeFileSync('belajar/lms-player.html', content, 'utf8');
console.log('Patched button text');
