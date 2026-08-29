const fs = require('fs');

const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

const scriptStart = content.indexOf('<script>\n        function superAdminApp()');
const scriptEnd = content.indexOf('</script>\n</body>');

if (scriptStart !== -1 && scriptEnd !== -1) {
    const scriptCode = content.slice(scriptStart + 8, scriptEnd);
    try {
        global.window = { innerWidth: 1200, addEventListener: () => {}, dispatchEvent: () => {} };
        global.sessionStorage = { getItem: () => 'true' };
        global.localStorage = { getItem: () => null, setItem: () => {} };
        eval(scriptCode);
        const app = superAdminApp();
        console.log('✅ superAdminApp() instance test:');
        console.log('   Users count at mount:', app.users.length);
        console.log('   Is User Dropdown Open:', app.isUserDropdownOpen);
        console.log('   User view:', app.userView);
        console.log('   Trash users count:', app.trashUsers.length);
        
        // Test switching to users tab
        app.toggleUserDropdown();
        console.log('   Active tab after toggle:', app.activeTab);
        console.log('   Filtered users count:', app.filteredUsersList().length);
    } catch (e) {
        console.error('❌ Error executing script:', e);
    }
}
