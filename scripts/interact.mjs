import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_PATH || 'playwright');

const BASE = process.env.BASE || 'http://localhost:3021';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 }, deviceScaleFactor: 2 });
await page.goto(`${BASE}/en`, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

const track = page.locator('.latest-carousel__track');
await track.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);

const readState = async () => page.evaluate(() => {
  const t = document.querySelector('.latest-carousel__track');
  const prev = document.querySelectorAll('.latest-carousel__arrows button')[0];
  const next = document.querySelectorAll('.latest-carousel__arrows button')[1];
  const fade = document.querySelector('.latest-carousel__fade');
  const thumb = document.querySelector('.latest-carousel__thumb');
  return {
    scrollLeft: Math.round(t.scrollLeft),
    maxScroll: Math.round(t.scrollWidth - t.clientWidth),
    cardCount: t.querySelectorAll('li').length,
    prevDisabled: prev?.disabled,
    nextDisabled: next?.disabled,
    fadeHidden: fade?.getAttribute('data-hidden'),
    thumbLeft: thumb?.style.left,
    thumbWidth: thumb?.style.width,
  };
});

console.log('AT START:', JSON.stringify(await readState()));

// Click next arrow once
await page.locator('.latest-carousel__arrows button').nth(1).click();
await page.waitForTimeout(700);
console.log('AFTER 1 NEXT CLICK:', JSON.stringify(await readState()));

// Scroll fully to the end
await page.evaluate(() => {
  const t = document.querySelector('.latest-carousel__track');
  t.scrollLeft = t.scrollWidth - t.clientWidth;
  t.dispatchEvent(new Event('scroll'));
});
await page.waitForTimeout(600);
console.log('AT END:', JSON.stringify(await readState()));

const latest = page.locator('.latest-carousel').first();
await latest.screenshot({ path: 'shots/prod-latest-end.png' });

await browser.close();
