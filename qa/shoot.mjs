import { chromium } from '/Users/shyngysnarseyit/Downloads/alterna/pdf-guides/node_modules/playwright/index.mjs';
const base = process.argv[2] || 'http://localhost:8704/';
const widths = (process.argv[3] || '1440,834,390').split(',').map(Number);
const out = new URL('./shots/', import.meta.url).pathname;
const browser = await chromium.launch({ channel: 'chrome', args: ['--mute-audio'] });
const report = [];
for (const path of ['en/', 'en/lesson/', 'tr/', 'tr/lesson/']) {
  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: w > 800 ? 900 : 844 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(String(e)));
    page.on('requestfailed', r => errors.push('failed ' + r.url()));
    await page.goto(base + path, { waitUntil: 'networkidle' });
    // прокрутить, чтобы подгрузились lazy-картинки
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 700) { await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(60); }
    await page.evaluate(() => { document.querySelectorAll('[data-reveal]').forEach(e => e.classList.add('in')); scrollTo(0, 0); });
    await page.waitForTimeout(800);
    const r = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      h: document.documentElement.scrollHeight,
      imgs: document.images.length,
      hidden: [...document.images].filter(i => !i.offsetParent && getComputedStyle(i).position !== 'fixed').length,
      broken: [...document.images].filter(i => i.offsetParent && !(i.complete && i.naturalWidth > 0)).map(i => i.src.split('/').pop()),
      lava: [...document.querySelectorAll('a[href*="lava.top"]')].map(a => a.href).length,
      lavaSet: [...new Set([...document.querySelectorAll('a[href*="lava.top"]')].map(a => a.href))],
    }));
    let quiz = null;
    if (await page.$('.quiz')) { for (const q of await page.$$('.quiz__q')) { const o = await q.$$('.quiz__opt'); await o[1].click(); }
      quiz = await page.evaluate(() => ({ done: document.querySelector('.quiz').classList.contains('is-done'), level: document.querySelector('[data-out=title]').textContent, cta: document.querySelector('.quiz__cta').href.slice(-12) })); }
    const name = path.split('/').filter(Boolean).join('-') + '-' + w;
    await page.screenshot({ path: out + name + '-full.png', fullPage: true });
    await page.screenshot({ path: out + name + '-first.png' });
    const ad = await page.$('.search');
    if (ad) { await ad.scrollIntoViewIfNeeded(); await page.waitForTimeout(300); await page.screenshot({ path: out + name + '-ad.png' }); }
    report.push({ quiz, page: name, width: w, scrollWidth: r.sw, ok: r.sw === w, height: r.h, imgs: r.imgs, hiddenImgs: r.hidden, broken: r.broken, lavaLinks: r.lava, lavaSet: r.lavaSet, errors });
    await page.close();
  }
}
await browser.close();
console.log(JSON.stringify(report, null, 1));
