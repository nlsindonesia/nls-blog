const fs = require('fs');

const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

const scriptStart = content.indexOf('<script>\n        function superAdminApp()');
const scriptEnd = content.indexOf('</script>\n</body>');

if (scriptStart !== -1 && scriptEnd !== -1) {
    const scriptCode = content.slice(scriptStart + 8, scriptEnd);
    try {
        // Evaluate in mock environment
        global.window = { innerWidth: 1200, addEventListener: () => {}, dispatchEvent: () => {} };
        global.sessionStorage = { getItem: () => 'true' };
        global.localStorage = { getItem: () => null, setItem: () => {} };
        eval(scriptCode);
        const app = superAdminApp();
        app.init();
        console.log('✅ superAdminApp() initialized without syntax or runtime error!');
        console.log('   Users count:', app.users.length);
        console.log('   User view:', app.userView);
        console.log('   Active tab:', app.activeTab);
    } catch (e) {
        console.error('❌ Error executing script:', e);
    }
} else {
    console.error('Could not find script block');
}
