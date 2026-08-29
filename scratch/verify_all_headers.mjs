import fs from 'fs';
import path from 'path';

function findHtml(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (!['.git', 'node_modules', '.gemini', 'scratch', 'nlsadmin', 'login', 'belajar'].includes(file)) {
                findHtml(filePath, fileList);
            }
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

const pages = findHtml('.');
let okCount = 0;
let issueCount = 0;

pages.forEach(p => {
    const c = fs.readFileSync(p, 'utf8');
    
    // Extract <nav>...</nav>
    const navMatch = c.match(/<nav[\s\S]*?<\/nav>/i);
    if (!navMatch) {
        return;
    }
    const navContent = navMatch[0];

    const hasSso = c.includes('/sso-client.js');
    const hasPillInNav = navContent.includes('studentSession.avatar');
    const hasCondYBInNav = navContent.includes('<template x-if="!studentSession">');
    
    // Check if there is an unconditioned Yuk Belajar tag inside <nav> outside of templates
    const navWithoutTemplatesAndComments = navContent.replace(/<!--[\s\S]*?-->/g, '').replace(/<template[\s\S]*?<\/template>/gi, '');
    const hasUnconditionalYukBelajarInNav = navWithoutTemplatesAndComments.includes('Yuk Belajar');

    if (hasSso && hasPillInNav && hasCondYBInNav && !hasUnconditionalYukBelajarInNav) {
        okCount++;
    } else {
        issueCount++;
        console.log(`[ISSUE] ${p}: SSO=${hasSso}, Pill=${hasPillInNav}, CondYB=${hasCondYBInNav}, UncondYB=${hasUnconditionalYukBelajarInNav}`);
    }
});

console.log(`Nav Verification Complete: ${okCount} pages PERFECT, ${issueCount} pages with issues.`);
