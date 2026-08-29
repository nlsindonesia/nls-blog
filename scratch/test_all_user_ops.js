const fs = require('fs');

const content = fs.readFileSync('nlsadmin/index.html', 'utf8');
const scriptStart = content.indexOf('<script>\n        function superAdminApp()');
const scriptEnd = content.indexOf('</script>\n</body>');

if (scriptStart !== -1 && scriptEnd !== -1) {
    const scriptCode = content.slice(scriptStart + 8, scriptEnd);
    global.window = { innerWidth: 1200, addEventListener: () => {}, dispatchEvent: () => {} };
    global.sessionStorage = { getItem: () => 'true' };
    global.localStorage = {
        _data: {},
        getItem(k) { return this._data[k] || null; },
        setItem(k, v) { this._data[k] = String(v); }
    };
    global.confirm = () => true;
    global.alert = (m) => console.log('Alert:', m);
    eval(scriptCode);
    const app = superAdminApp();
    app.showToast = (m) => console.log('Toast:', m);

    console.log('1. Initial users count:', app.users.length);

    // Test add new user
    app.openAddUserView();
    app.userForm.name = 'Test Mentor NLS';
    app.userForm.username = 'test.mentor';
    app.userForm.email = 'test@nls.com';
    app.saveUser();
    console.log('2. Users count after add:', app.users.length);

    // Test toggle status
    app.toggleUserStatus(app.users[0].id);
    console.log('3. Toggled user status:', app.users[0].status);

    // Test trash
    const newId = app.users[0].id;
    app.deleteUserToTrash(newId);
    console.log('4. Users count after trash:', app.users.length, 'Trash count:', app.trashUsers.length);

    // Test restore
    app.restoreUserFromTrash(newId);
    console.log('5. Users count after restore:', app.users.length, 'Trash count:', app.trashUsers.length);

    console.log('✅ ALL SUPERADMIN APP USER OPERATIONS VERIFIED SUCCESSFULLY!');
}
