import fs from 'fs';
import path from 'path';

const studentSessionInitCode = `        studentSession: (function() {
            try {
                const raw = localStorage.getItem('nls_auth_session') || localStorage.getItem('nls_student_auth_session');
                if (!raw) return null;
                const s = JSON.parse(raw);
                if (!s || typeof s !== 'object') return null;
                return {
                    name: s.name || 'Siswa NLS',
                    nisn: s.nisn || 'NISN: Terdaftar',
                    school: s.school || '',
                    targetProgram: s.targetProgram || 'Program NLS',
                    avatar: s.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                    role: s.role || 'student',
                    roleLabel: (s.role === 'teacher' || (s.roleLabel && s.roleLabel.includes('Guru'))) ? 'Guru Aktif' : ((s.role === 'super_admin') ? 'Super Admin' : 'Siswa Aktif')
                };
            } catch(e) { return null; }
        })(),`;

function getAllHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build') continue;
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            getAllHtmlFiles(fullPath, fileList);
        } else if (file.endsWith('.html') && !fullPath.includes('nlsadmin') && !fullPath.includes('sso-hub.html')) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

const htmlFiles = getAllHtmlFiles('.');
console.log(`Found ${htmlFiles.length} HTML files.`);

let updatedCount = 0;
for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('studentSession: null,')) {
        content = content.replace('studentSession: null,', studentSessionInitCode);
        fs.writeFileSync(file, content, 'utf8');
        updatedCount++;
        console.log(`Updated: ${file}`);
    }
}

console.log(`Successfully updated ${updatedCount} files with synchronous instant session initialization!`);
