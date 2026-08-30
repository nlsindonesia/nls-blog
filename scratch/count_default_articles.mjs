import fs from 'fs';

const content = fs.readFileSync('blog/default-articles.js', 'utf8');
const vm = await import('vm');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(content, sandbox);

console.log('window.NLS_DEFAULT_ARTICLES count:', sandbox.window.NLS_DEFAULT_ARTICLES.length);
sandbox.window.NLS_DEFAULT_ARTICLES.forEach((a, i) => console.log(`${i+1}. [${a.id}] ${a.title}`));
