const fs = require('fs');
let content = fs.readFileSync('api/pg-auth.js', 'utf8');

const setupAnchor = 'const usersTable = await sql`';
const alterSql = `
            try {
                await sql\`ALTER TABLE users ADD COLUMN IF NOT EXISTS nisn VARCHAR(50);\`;
                await sql\`ALTER TABLE users ADD COLUMN IF NOT EXISTS school VARCHAR(150);\`;
                await sql\`ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(100);\`;
                await sql\`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);\`;
                await sql\`ALTER TABLE users ADD COLUMN IF NOT EXISTS level VARCHAR(100);\`;
                await sql\`ALTER TABLE users ADD COLUMN IF NOT EXISTS grade VARCHAR(255);\`;
            } catch (e) { console.log('Alter table users failed:', e); }
            
            `;

content = content.replace(setupAnchor, alterSql + setupAnchor);
fs.writeFileSync('api/pg-auth.js', content, 'utf8');
console.log('Added ALTER TABLE to setup');
