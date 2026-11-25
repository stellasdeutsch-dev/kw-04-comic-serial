// Край вырезок на фоне сайта в увеличении (DPR 3): для каждой вырезки кадр у верхнего края и у бокового.
import { chromium } from '/Users/shyngysnarseyit/Downloads/alterna/pdf-guides/node_modules/playwright/index.mjs';
const out = new URL('./edges/', import.meta.url).pathname;
const SEL = ['.hero__person', '.hero__peek--l', '.hero__peek--r', '.hero__paper', '.hero__obj-top', '.hero__obj-bottom', '.spk__ph img', '.ocard__person', '.ocard__plane', '.foot__peek', '.scene__fig'];
const b = await chromium.launch({ channel: 'chrome', args: ['--mute-audio'] });
for (const v of ['en', 'tr']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 3 });
  await p.goto(`http://localhost:8704/${v}/`, { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '#snow{display:none!important} *{animation:none!important;transition:none!important} [data-reveal]{opacity:1!important;transform:none!important}' });
  let n = 0;
  for (const s of SEL) {
    const els = await p.$$(s);
    for (const [i, el] of els.entries()) {
      await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(150);
      const r = await el.boundingBox(); if (!r || r.width < 10) continue;
      // верхний край по центру и левый край на трети высоты
      for (const [tag, cx, cy] of [['top', r.x + r.width / 2, r.y + 6], ['side', r.x + 6, r.y + r.height * .33]]) {
        const clip = { x: Math.max(0, cx - 60), y: Math.max(0, cy - 40), width: 120, height: 120 };
        await p.screenshot({ path: `${out}${v}-${s.replace(/[^a-z-]/g, '')}-${i}-${tag}.png`, clip }); n++;
      }
    }
  }
  console.log(v, n); await p.close();
}
await b.close();
