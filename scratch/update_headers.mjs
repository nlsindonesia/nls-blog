import fs from 'fs';
import path from 'path';

function processFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Remove Masuk button from headers
    content = content.replace(/<a\s+href=["']\/(admin\/)?login["'][^>]*>\s*Masuk\s*<\/a>/gi, '');
    content = content.replace(/<a\s+href=["']\/login["'][^>]*>\s*Masuk Akun Siswa\s*<\/a>/gi, '');

    // 2. Redirect Yuk Belajar to https://nls-belajar.vercel.app
    // Replace <a href="https://wa.me/6285163070002"...>Yuk Belajar</a>
    content = content.replace(/href=["']https:\/\/wa\.me\/6285163070002["']([^>]*>\s*Yuk Belajar)/gi, 'href="https://nls-belajar.vercel.app"$1');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated header in:', filePath);
    }
}

function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'scratch' && entry.name !== 'nlsadmin') {
            scanDir(full);
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            processFile(full);
        }
    }
}

scanDir('.');
