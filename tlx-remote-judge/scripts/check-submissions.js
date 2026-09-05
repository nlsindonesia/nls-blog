const { chromium } = require('playwright');
const path = require('path');

async function check() {
  const sessionFile = path.resolve(__dirname, '../session/tlx_session.json');
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ storageState: sessionFile });
  const page = await ctx.newPage();

  console.log('Navigating to user submissions...');
  await page.goto('https://tlx.toki.id/problems/troc-30/A/submissions/mine', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const data = await page.evaluate(() => {
    const allTables = Array.from(document.querySelectorAll('table')).map(t => {
      const rows = Array.from(t.querySelectorAll('tr')).map(r => 
        Array.from(r.querySelectorAll('th, td')).map(c => c.innerText.trim()).join(' | ')
      );
      return rows;
    });
    return allTables;
  });

  console.log('Tables found:', JSON.stringify(data, null, 2));

  // Also check global submissions
  console.log('Navigating to global /submissions...');
  await page.goto('https://tlx.toki.id/submissions', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const globalData = await page.evaluate(() => {
    const table = document.querySelector('table');
    if (!table) return [];
    return Array.from(table.querySelectorAll('tr')).map(r => 
      Array.from(r.querySelectorAll('th, td')).map(c => c.innerText.trim()).join(' | ')
    );
  });

  console.log('Global Submissions Table:', JSON.stringify(globalData.slice(0, 10), null, 2));

  await browser.close();
}

check().catch(console.error);
