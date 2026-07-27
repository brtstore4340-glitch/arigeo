import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_PATH || 'playwright');

const BASE = process.env.BASE || 'http://localhost:3010';
const tag = process.argv[2] || 'baseline';
const outDir = process.env.OUT || 'shots';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 }, deviceScaleFactor: 2 });

await page.goto(`${BASE}/en`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

// Full page
await page.screenshot({ path: `${outDir}/${tag}-home-full.png`, fullPage: true });

// Latest carousel section
const latest = page.locator('.latest-carousel').first();
if (await latest.count()) {
  await latest.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await latest.screenshot({ path: `${outDir}/${tag}-latest.png` });
}

// Purpose / about+brands section
const purpose = page.locator('.arigeo-purpose-area').first();
if (await purpose.count()) {
  await purpose.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await purpose.screenshot({ path: `${outDir}/${tag}-purpose.png` });
}

await browser.close();
console.log(`shot: ${tag}`);
