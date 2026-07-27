import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_PATH || 'playwright');

const BASE = process.env.BASE || 'http://localhost:3010';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });

page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE ERROR:', m.text()); });
page.on('pageerror', (e) => console.log('PAGE ERROR:', e.message, '\n', e.stack?.split('\n').slice(0,6).join('\n')));

await page.goto(`${BASE}/en`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
console.log('DONE');
await browser.close();
