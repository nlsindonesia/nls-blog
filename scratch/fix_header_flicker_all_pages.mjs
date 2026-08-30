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
                    avatar: s.avatar || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8' style='background-color:%23f1f5f9;padding:10%25'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E`,
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
