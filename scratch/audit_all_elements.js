const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\vc\\Documents\\nls-blog-hame\\nls-blog-hame';

function getAllHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            if (file !== '.git' && file !== 'node_modules' && file !== 'brain') {
                results = results.concat(getAllHtmlFiles(fullPath));
            }
        } else if (file.endsWith('.html')) {
            results.push(fullPath);
        }
    });
    return results;
}

const htmlFiles = getAllHtmlFiles(rootDir);
console.log(`Auditing ${htmlFiles.length} HTML files...`);

const report = [];

htmlFiles.forEach(filePath => {
    const relPath = path.relative(rootDir, filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, idx) => {
        const lineNum = idx + 1;
        
        // 1. Look for text-white on light backgrounds
        if (line.includes('text-white') && !line.includes('dark:text-white')) {
            // Check if there is bg-white or light bg
            if (line.includes('bg-white') || line.includes('bg-slate-50') || line.includes('bg-slate-100') || line.includes('bg-gray-50') || line.includes('bg-surface')) {
                // If it doesn't have a solid colored class
                if (!line.includes('bg-sky-') && !line.includes('bg-blue-') && !line.includes('bg-primary') && 
                    !line.includes('bg-indigo-') && !line.includes('bg-emerald-') && !line.includes('bg-rose-') && 
                    !line.includes('bg-amber-') && !line.includes('bg-slate-800') && !line.includes('bg-slate-900') && 
                    !line.includes('bg-black') && !line.includes('bg-[#FF8A00]') && !line.includes('bg-[#0284c7]') && 
                    !line.includes('bg-[#131D38]') && !line.includes('from-') && !line.includes('bg-gradient')) {
                    report.push({ file: relPath, line: lineNum, type: 'TEXT_WHITE_ON_LIGHT', code: line.trim() });
                }
            }
        }

        // 2. Look for style="...color: white... or color: #fff on style="background: white...
        if ((line.includes('color: #fff') || line.includes('color: white')) && (line.includes('background: #fff') || line.includes('background: white') || line.includes('background-color: #fff'))) {
            report.push({ file: relPath, line: lineNum, type: 'INLINE_STYLE_WHITE_ON_WHITE', code: line.trim() });
        }

        // 3. Look for white logo image or icon on white bg
        if (line.includes('logo') && line.includes('white') && (line.includes('bg-white') || line.includes('bg-surface'))) {
            report.push({ file: relPath, line: lineNum, type: 'WHITE_LOGO_ON_LIGHT', code: line.trim() });
        }
    });
});

console.log(`Found ${report.length} potential issues:`);
report.forEach(r => {
    console.log(`[${r.file}:${r.line}] (${r.type}) ${r.code.substring(0, 140)}`);
});
