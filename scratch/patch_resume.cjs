const fs = require('fs');
let content = fs.readFileSync('belajar/lms-player.html', 'utf8');

const anchor = "this.quizAnswers = typeof data.attempt.answers_json === 'string' ? JSON.parse(data.attempt.answers_json) : data.attempt.answers_json;";
const replacement = anchor + `
                                            if (this.quizAnswers && this.quizAnswers._meta) {
                                                if (this.quizAnswers._meta.currentQIdx !== undefined) {
                                                    this.quizState.currentQIdx = parseInt(this.quizAnswers._meta.currentQIdx) || 0;
                                                }
                                                if (Array.isArray(this.quizAnswers._meta.doubtful)) {
                                                    this.quizState.doubtful = this.quizAnswers._meta.doubtful;
                                                }
                                            }
`;

content = content.replace(anchor, replacement);

// There are three instances where payload is created with "answers: this.quizAnswers"
// Lines 1330, 1355, 1464, 1489 in lms-player.html
// Wait, the payload is stringified. Let's replace `answers: this.quizAnswers` with `answers: { ...this.quizAnswers, _meta: { currentQIdx: this.quizState.currentQIdx, doubtful: this.quizState.doubtful } }` globally.
content = content.split('answers: this.quizAnswers').join('answers: { ...this.quizAnswers, _meta: { currentQIdx: this.quizState.currentQIdx, doubtful: this.quizState.doubtful } }');

fs.writeFileSync('belajar/lms-player.html', content, 'utf8');
console.log('Patched quiz state save/load');
