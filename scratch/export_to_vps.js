// ==============================================================================
// Next Level Study (NLS) - Standalone VPS Migration Script Generator
// Run via: node scratch/export_to_vps.js
// Generates: vps_migration.sql
// ==============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateVpsSqlDump } from '../api/vps-exporter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputFile = path.join(rootDir, 'vps_migration.sql');

async function run() {
    console.log('[NLS Migration Tool] Connecting to Universal Cloud Database...');
    const startTime = Date.now();
    const sqlContent = await generateVpsSqlDump();
    
    fs.writeFileSync(outputFile, sqlContent, 'utf8');
    const stats = fs.statSync(outputFile);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`[NLS Migration Tool] SUCCESS! Generated: ${outputFile}`);
    console.log(`[NLS Migration Tool] File Size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`[NLS Migration Tool] Time taken: ${duration}s`);
    console.log(`[NLS Migration Tool] You can now import this file into any PostgreSQL VPS:`);
    console.log(`                     psql -U postgres -d your_vps_db -f vps_migration.sql`);
}

run().catch(err => {
    console.error('[NLS Migration Tool] Export failed:', err);
    process.exit(1);
});
