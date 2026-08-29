const fs = require('fs');

let html = fs.readFileSync('nlsadmin/index.html', 'utf8');

const userMethods = `
                // USER MANAGEMENT DROPDOWN & CRUD METHODS
                toggleUserDropdown() {
                    if (this.activeTab !== 'users') {
                        this.activeTab = 'users';
                        this.userView = 'present';
                        this.isUserDropdownOpen = true;
                    } else {
                        this.isUserDropdownOpen = !this.isUserDropdownOpen;
                    }
                },

                openAddUserView() {
                    this.activeTab = 'users';
                    this.userView = 'add';
                    this.isUserDropdownOpen = true;
                    this.userForm = {
                        id: '',
                        isEdit: false,
                        name: '',
                        username: '',
                        email: '',
                        phone: '',
                        role: 'Admin Akademik',
                        role_id: 'admin_akademik',
                        status: 'Aktif',
                        department: 'Divisi Operasional',
                        avatar: '/nls-logo-300.png',
                        password: '',
                        notes: ''
                    };
                    this.showUserPassword = false;
                    if (this.isMobile) this.isSidebarOpen = false;
                },

                openPresentUserView() {
                    this.activeTab = 'users';
                    this.userView = 'present';
                    this.isUserDropdownOpen = true;
                    if (this.isMobile) this.isSidebarOpen = false;
                },

                openTrashUserView() {
                    this.activeTab = 'users';
                    this.userView = 'trash';
                    this.isUserDropdownOpen = true;
                    if (this.isMobile) this.isSidebarOpen = false;
                },

                setUserRole(role_id, roleName) {
                    this.userForm.role_id = role_id;
                    this.userForm.role = roleName;
                },

                getUserRoleBadgeClass(role_id) {
                    switch (role_id) {
                        case 'super_admin':
                            return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800';
                        case 'admin_akademik':
                            return 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800';
                        case 'content_editor':
                            return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
                        case 'koordinator_pengajar':
                            return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800';
                        case 'customer_service':
                            return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
                        case 'tutor_mentor':
                            return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800';
                        default:
                            return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700';
                    }
                },

                countUsersByRole(role_id) {
                    return this.users.filter(u => u.role_id === role_id).length;
                },

                filteredUsersList() {
                    return this.users.filter(u => {
                        const q = (this.userFilter.search || '').toLowerCase().trim();
                        const matchSearch = !q ||
                            (u.name && u.name.toLowerCase().includes(q)) ||
                            (u.username && u.username.toLowerCase().includes(q)) ||
                            (u.email && u.email.toLowerCase().includes(q)) ||
                            (u.phone && u.phone.toLowerCase().includes(q)) ||
                            (u.role && u.role.toLowerCase().includes(q)) ||
                            (u.department && u.department.toLowerCase().includes(q));

                        const matchRole = this.userFilter.role === 'all' || u.role_id === this.userFilter.role;
                        const matchStatus = this.userFilter.status === 'all' || u.status === this.userFilter.status;

                        return matchSearch && matchRole && matchStatus;
                    });
                },

                resetUserFilters() {
                    this.userFilter = { search: '', role: 'all', status: 'all' };
                },

                saveUser() {
                    const f = this.userForm;
                    if (!f.name || !f.username || !f.email) {
                        alert('Harap isi Nama Lengkap, Username, dan Email!');
                        return;
                    }

                    const userData = {
                        id: f.id || ('usr-' + Date.now()),
                        name: f.name.trim(),
                        username: f.username.trim().replace(/^@/, ''),
                        email: f.email.trim(),
                        phone: f.phone ? f.phone.trim() : '',
                        role: f.role || 'Admin Akademik',
                        role_id: f.role_id || 'admin_akademik',
                        status: f.status || 'Aktif',
                        department: f.department ? f.department.trim() : 'Divisi Operasional',
                        avatar: f.avatar || '/nls-logo-300.png',
                        notes: f.notes ? f.notes.trim() : '',
                        last_login: f.last_login || 'Belum pernah login',
                        created_at: f.created_at || new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    };

                    if (f.isEdit) {
                        const idx = this.users.findIndex(u => u.id === userData.id);
                        if (idx !== -1) {
                            this.users[idx] = { ...this.users[idx], ...userData };
                        }
                    } else {
                        this.users.unshift(userData);
                    }

                    this.saveUsersToStorage();
                    this.userView = 'present';
                    this.showToast(\`Akun "\${userData.name}" berhasil disimpan!\`);
                },

                editUser(user) {
                    this.activeTab = 'users';
                    this.userView = 'add';
                    this.isUserDropdownOpen = true;
                    this.userForm = {
                        ...user,
                        isEdit: true,
                        password: ''
                    };
                    this.showUserPassword = false;
                },

                toggleUserStatus(id) {
                    const idx = this.users.findIndex(u => u.id === id);
                    if (idx !== -1) {
                        const newStatus = this.users[idx].status === 'Aktif' ? 'Nonaktif' : 'Aktif';
                        this.users[idx].status = newStatus;
                        this.saveUsersToStorage();
                        this.showToast(\`Status akun "\${this.users[idx].name}" diubah menjadi \${newStatus}!\`);
                    }
                },

                deleteUserToTrash(id) {
                    const target = this.users.find(u => u.id === id);
                    if (!target) return;

                    if (target.role_id === 'super_admin' && this.countUsersByRole('super_admin') <= 1) {
                        alert('Tidak dapat menghapus Super Admin utama terakhir sistem!');
                        return;
                    }

                    if (confirm(\`Pindahkan akun "\${target.name}" ke Tempat Sampah (Trash)?\`)) {
                        this.users = this.users.filter(u => u.id !== id);
                        target.deleted_at = new Date().toISOString();
                        this.trashUsers.unshift(target);
                        this.saveUsersToStorage();
                        this.saveTrashUsersToStorage();
                        this.showToast(\`Akun "\${target.name}" dipindahkan ke Trash!\`);
                    }
                },

                restoreUserFromTrash(id) {
                    const idx = this.trashUsers.findIndex(u => u.id === id);
                    if (idx !== -1) {
                        const [restored] = this.trashUsers.splice(idx, 1);
                        delete restored.deleted_at;
                        this.users.unshift(restored);
                        this.saveUsersToStorage();
                        this.saveTrashUsersToStorage();
                        this.showToast(\`Akun "\${restored.name}" berhasil dipulihkan!\`);
                    }
                },

                permanentDeleteUser(id) {
                    if (confirm('Hapus akun ini secara permanen dari sistem? Tindakan ini tidak dapat dibatalkan.')) {
                        this.trashUsers = this.trashUsers.filter(u => u.id !== id);
                        this.saveTrashUsersToStorage();
                        this.showToast('Akun pengguna telah dihapus secara permanen!');
                    }
                },

                emptyUsersTrash() {
                    if (confirm('Kosongkan semua pengguna di Tempat Sampah?')) {
                        this.trashUsers = [];
                        this.saveTrashUsersToStorage();
                        this.showToast('Tempat Sampah Pengguna telah dikosongkan!');
                    }
                },

                saveUsersToStorage() {
                    try {
                        localStorage.setItem('nls_users_v1', JSON.stringify(this.users));
                        if (typeof window.UsersDatabase !== 'undefined' && window.UsersDatabase.importJSON) {
                            try { window.UsersDatabase.importJSON(this.users); } catch(e){}
                        }
                    } catch(e){}
                },

                saveTrashUsersToStorage() {
                    try {
                        localStorage.setItem('nls_users_trash_v1', JSON.stringify(this.trashUsers));
                    } catch(e){}
                },

                exportUsersJSON() {
                    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.users, null, 2));
                    const a = document.createElement('a');
                    a.setAttribute('href', dataStr);
                    a.setAttribute('download', \`nls-users-\${Date.now()}.json\`);
                    a.click();
                },

                cleanPhone(phone) {
                    if (!phone) return '';
                    let clean = phone.replace(/[^0-9]/g, '');
                    if (clean.startsWith('0')) {
                        clean = '62' + clean.slice(1);
                    }
                    return clean;
                },
`;

const targetAnchor = `                openTrashTeacherView() {
                    this.activeTab = 'pengajar';
                    this.pengajarView = 'trash';
                    this.isPengajarDropdownOpen = true;
                    if (this.isMobile) this.isSidebarOpen = false;
                },`;

html = html.replace(targetAnchor, targetAnchor + '\n' + userMethods);

fs.writeFileSync('nlsadmin/index.html', html, 'utf8');
console.log('✅ Injected user methods directly inside superAdminApp return object');
