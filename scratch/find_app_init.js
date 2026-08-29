const fs = require('fs');

const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

// Find init function in superAdminApp
const initIdx = content.indexOf('init() {');
console.log('init() idx:', initIdx);
const initSnippet = content.slice(initIdx - 200, initIdx + 500);
console.log('initSnippet:');
console.log(initSnippet);
