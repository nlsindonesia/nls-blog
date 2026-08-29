const fs = require('fs');
const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

console.log('File length:', content.length);

// Find all scripts
const scripts = content.match(/<script[\s\S]*?<\/script>/gi) || [];
console.log('Found scripts count:', scripts.length);
scripts.forEach((s, idx) => {
    console.log(`Script ${idx} (first 100 chars):`, s.slice(0, 100).replace(/\n/g, ' '));
});

// Find sidebar navigation links or buttons
const navMatches = content.match(/<nav[\s\S]*?<\/nav>/gi) || [];
console.log('Found nav count:', navMatches.length);
if (navMatches[0]) {
    console.log('Nav snippet:', navMatches[0].slice(0, 500));
}

// Find all h2, h3, or menu items
const buttons = content.match(/<button[\s\S]*?<\/button>/gi) || [];
console.log('Buttons count:', buttons.length);

// Extract menu titles / section headers
const sections = content.match(/<section[\s\S]*?>/gi) || [];
console.log('Sections:', sections);
