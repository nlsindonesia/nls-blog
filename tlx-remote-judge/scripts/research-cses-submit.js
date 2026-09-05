import { chromium } from 'playwright';

async function inspectCsesSubmit() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Login first
  console.log('Logging in as nls_bot...');
  await page.goto('https://cses.fi/login', { waitUntil: 'networkidle' });
  await page.fill('input[name="nick"]', 'nls_bot');
  await page.fill('input[name="pass"]', 'maman123');
  await page.click('input[type="submit"]');
  await page.waitForTimeout(2000);
  
  // Save session state
  await context.storageState({ path: 'session/cses_session.json' });
  console.log('Saved cses_session.json!');
  
  // Go to Weird Algorithm (1068) submit page
  console.log('Navigating to submit page for task 1068...');
  await page.goto('https://cses.fi/problemset/task/1068', { waitUntil: 'networkidle' });
  
  const taskPageInfo = await page.evaluate(() => {
    return {
      title: document.title,
      links: Array.from(document.querySelectorAll('a')).map(a => ({ text: a.innerText.trim(), href: a.href })).filter(l => l.text.toLowerCase().includes('submit') || l.href.includes('submit'))
    };
  });
  console.log('Task Page Submit Links:', JSON.stringify(taskPageInfo, null, 2));
  
  // Go to submit page directly
  await page.goto('https://cses.fi/problemset/submit/1068/', { waitUntil: 'networkidle' });
  const submitFormInfo = await page.evaluate(() => {
    const langs = Array.from(document.querySelectorAll('select[name="lang"] option')).map(o => ({ value: o.value, text: o.innerText.trim(), selected: o.selected }));
    const inputs = Array.from(document.querySelectorAll('input, select, textarea')).map(i => ({ name: i.name, type: i.type, id: i.id, tag: i.tagName }));
    return {
      title: document.title,
      inputs,
      langs
    };
  });
  console.log('Submit Form Info:', JSON.stringify(submitFormInfo, null, 2));

  await browser.close();
}

inspectCsesSubmit().catch(console.error);
