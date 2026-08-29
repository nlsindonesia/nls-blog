const fs = require('fs');
const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

// Find all occurrences of hero banners
const heroClasses = content.match(/admin-hero-[a-z0-9-]+/g) || [];
console.log('Hero classes used:', [...new Set(heroClasses)]);

// Find all CSS definitions in <style>
const cssMatches = content.match(/\.admin-hero-[a-z0-9-]+\s*\{[^}]+\}/g) || [];
console.log('CSS definitions for heroes:');
cssMatches.forEach(c => console.log(c));
