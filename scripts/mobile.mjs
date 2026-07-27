import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_PATH || 'playwright');

const BASE = process.env.BASE || 'http://localhost:3021';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await page.goto(`${BASE}/en`, { waitUntil: 'networkidle' });
await page.waitForTimeout(900);

const latest = page.locator('.latest-carousel').first();
await latest.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await latest.screenshot({ path: 'shots/prod-mobile-latest.png' });

const purpose = page.locator('.arigeo-purpose-area').first();
await purpose.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await purpose.screenshot({ path: 'shots/prod-mobile-purpose.png' });

await browser.close();
console.log('mobile shots done');
