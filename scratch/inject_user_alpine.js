const fs = require('fs');

let html = fs.readFileSync('nlsadmin/index.html', 'utf8');

// 1. Add state in superAdminApp return object
const stateToAdd = `
                // USER MANAGEMENT STATE
                userView: 'present', // 'present', 'add', 'trash'
                isUserDropdownOpen: false,
                showUserPassword: false,
                users: [],
                trashUsers: [],
                userFilter: { search: '', role: 'all', status: 'all' },
                userForm: {
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
                },
`;

if (!html.includes('// USER MANAGEMENT STATE')) {
    html = html.replace("pengajarView: 'present', // 'present' or 'add'\n                isPengajarDropdownOpen: true,", "pengajarView: 'present', // 'present' or 'add'\n                isPengajarDropdownOpen: true,\n" + stateToAdd);
}

// 2. Add init call in init()
if (!html.includes('this.initUsersData();')) {
    html = html.replace('this.loadTrashArticlesFromStorage();', 'this.loadTrashArticlesFromStorage();\n                    this.initUsersData();');
}

// 3. Add User Management methods
const methodsToAdd = `
                // ==========================================
                // USER MANAGEMENT METHODS
                // ==========================================
                initUsersData() {
                    try {
                        const storedUsers = localStorage.getItem('nls_users_v1');
                        if (storedUsers) {
                            this.users = JSON.parse(storedUsers);
                        } else if (typeof window.UsersDatabase !== 'undefined' && window.UsersDatabase.getAll) {
                            this.users = window.UsersDatabase.getAll();
                            this.saveUsersToStorage();
                        } else {
                            this.users = this.getDefaultUsers();
                            this.saveUsersToStorage();
                        }
                    } catch (e) {
                        this.users = this.getDefaultUsers();
                    }

                    try {
                        const storedTrash = localStorage.getItem('nls_users_trash_v1');
                        this.trashUsers = storedTrash ? JSON.parse(storedTrash) : [];
                    } catch (e) {
                        this.trashUsers = [];
                    }
                },

                getDefaultUsers() {
                    return [
                        {
                            id: 'usr-1',
                            name: 'Handaka Lumu',
                            username: 'handaka.superadmin',
                            email: 'handaka@next-level-study.com',
                            phone: '085163070002',
                            role: 'Super Admin',
                            role_id: 'super_admin',
                            status: 'Aktif',
                            department: 'Direksi & Eksekutif',
                            avatar: '/nls-logo-300.png',
                            notes: 'Penanggung Jawab Utama Sistem Next Level Study',
                            last_login: '2026-08-28 10:30 WIB',
                            created_at: '2026-01-01T00:00:00.000Z'
                        },
                        {
                            id: 'usr-2',
                            name: 'Kak Raditya Pratama, M.Sc.',
                            username: 'raditya.akademik',
                            email: 'raditya@next-level-study.com',
                            phone: '081286096600',
                            role: 'Admin Akademik',
                            role_id: 'admin_akademik',
                            status: 'Aktif',
                            department: 'Divisi Kurikulum & Olimpiade',
                            avatar: '/images/pengajar/mentor-1-math.jpg',
                            notes: 'Koordinator Kalender Pembinaan OSN dan Simulasi UTBK',
                            last_login: '2026-08-28 09:15 WIB',
                            created_at: '2026-02-15T00:00:00.000Z'
                        },
                        {
                            id: 'usr-3',
                            name: 'Kak Dimas (Koordinator Pengajar)',
                            username: 'dimas.tutor',
                            email: 'dimas@next-level-study.com',
                            phone: '08170100788',
                            role: 'Koordinator Pengajar',
                            role_id: 'koordinator_pengajar',
                            status: 'Aktif',
                            department: 'Divisi Pengajar & Mutu Pendidik',
                            avatar: '/images/pengajar/mentor-6-senior-math.jpg',
                            notes: 'Verifikator Seleksi Berkas dan Microteaching Guru',
                            last_login: '2026-08-27 16:45 WIB',
                            created_at: '2026-03-10T00:00:00.000Z'
                        },
                        {
                            id: 'usr-4',
                            name: 'Tim EduTech & Penulis CMS',
                            username: 'edutech.editor',
                            email: 'edutech@next-level-study.com',
                            phone: '085810464960',
                            role: 'Content Editor',
                            role_id: 'content_editor',
                            status: 'Aktif',
                            department: 'Divisi Media & Konten Edukasi',
                            avatar: '/images/stitch/pillar-study.jpg',
                            notes: 'Penyusun Artikel Berita, Silabus, dan Panduan Belajar',
                            last_login: '2026-08-28 08:20 WIB',
                            created_at: '2026-04-01T00:00:00.000Z'
                        },
                        {
                            id: 'usr-5',
                            name: 'Admin Pusat Layanan NLS',
                            username: 'cs.pusat',
                            email: 'cs@next-level-study.com',
                            phone: '085163070002',
                            role: 'Customer Service',
                            role_id: 'customer_service',
                            status: 'Aktif',
                            department: 'Layanan & Pendaftaran Siswa',
                            avatar: '/nls-logo-300.png',
                            notes: 'Pusat Informasi Hotline WhatsApp dan Konsultasi Bimbel',
                            last_login: '2026-08-28 10:10 WIB',
                            created_at: '2026-05-01T00:00:00.000Z'
                        }
                    ];
                },

                toggleUserDropdown() {
                    this.isUserDropdownOpen = !this.isUserDropdownOpen;
                    if (this.isUserDropdownOpen) {
                        this.activeTab = 'users';
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
                },

                openPresentUserView() {
                    this.activeTab = 'users';
                    this.userView = 'present';
                    this.isUserDropdownOpen = true;
                },

                openTrashUserView() {
                    this.activeTab = 'users';
                    this.userView = 'trash';
                    this.isUserDropdownOpen = true;
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
                    localStorage.setItem('nls_users_v1', JSON.stringify(this.users));
                    if (typeof window.UsersDatabase !== 'undefined' && window.UsersDatabase.importJSON) {
                        try { window.UsersDatabase.importJSON(this.users); } catch(e){}
                    }
                },

                saveTrashUsersToStorage() {
                    localStorage.setItem('nls_users_trash_v1', JSON.stringify(this.trashUsers));
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

if (!html.includes('// USER MANAGEMENT METHODS')) {
    html = html.replace('// SQLITE EXPORT WITH COMPREHENSIVE DATASETS', methodsToAdd + '\n                // SQLITE EXPORT WITH COMPREHENSIVE DATASETS');
}

fs.writeFileSync('nlsadmin/index.html', html, 'utf8');
console.log('✅ Alpine.js User Management state and methods injected into nlsadmin/index.html');
