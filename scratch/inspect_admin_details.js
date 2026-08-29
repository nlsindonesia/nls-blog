const fs = require('fs');
const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

const navMatch = content.match(/<nav[\s\S]*?<\/nav>/i);
if (navMatch) {
    console.log('=== SIDEBAR NAVIGATION ===');
    console.log(navMatch[0]);
}

const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>[\s\S]*?<\/body>/i);
if (scriptMatch) {
    console.log('=== JAVASCRIPT STATE & METHODS SUMMARY ===');
    const js = scriptMatch[1];
    console.log(js.slice(0, 1500));
}
