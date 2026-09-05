const { chromium } = require('playwright');
const path = require('path');

async function test() {
  const sessionFile = path.resolve(__dirname, '../session/tlx_session.json');
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ storageState: sessionFile });
  const page = await ctx.newPage();

  console.log('Visiting problem page...');
  await page.goto('https://tlx.toki.id/problems/troc-30/A', { waitUntil: 'networkidle' });
  console.log('Title:', await page.title());

  const controls = await page.$$eval('button, select, input, textarea, a', els =>
    els.map(e => ({
      tag: e.tagName,
      type: e.type,
      name: e.name,
      text: (e.innerText || e.value || '').trim().replace(/\n/g, ' '),
      disabled: e.disabled,
      cls: e.className
    })).filter(x => x.text || x.name || x.type === 'file')
  );

  console.log('Controls:', JSON.stringify(controls, null, 2));
  await browser.close();
}

test().catch(console.error);
