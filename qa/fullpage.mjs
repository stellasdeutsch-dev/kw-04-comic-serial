// Скриншот всей страницы и проверка, что после прокрутки всё видно. node qa/fullpage.mjs <ширина> <en|tr> [reduce]
import { chromium } from '/Users/shyngysnarseyit/Downloads/alterna/pdf-guides/node_modules/playwright/index.mjs';
const w = +process.argv[2], v = process.argv[3], rm = process.argv[4] === 'reduce';
const out = new URL('./shots/', import.meta.url).pathname;
const b = await chromium.launch({ channel: 'chrome', args: ['--mute-audio'] });
const p = await b.newPage({ viewport: { width: w, height: 900 }, reducedMotion: rm ? 'reduce' : 'no-preference' });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(`http://localhost:8704/${v}/`, { waitUntil: 'networkidle' });
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 500) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(120); }
await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(rm ? 300 : 2500);
const r = await p.evaluate(() => {
  const sel = '[data-reveal], [data-stagger] > *, [data-pop], .deco, [data-draw]';
  const hidden = [...document.querySelectorAll(sel)].filter(e => +getComputedStyle(e).opacity < .99).map(e => e.className.baseVal ?? e.className);
  const counts = [...document.querySelectorAll('[data-count]')].map(e => e.textContent + '=' + e.getAttribute('data-count'));
  const icons = document.querySelectorAll('svg.ic').length;
  const deco = [...document.querySelectorAll('.deco')].map(e => e.currentSrc.split('/').pop() + ':' + (e.complete && e.naturalWidth > 0));
  const motion = document.documentElement.classList.contains('js-motion');
  return { sw: document.documentElement.scrollWidth, hidden: hidden.slice(0, 8), hiddenN: hidden.length, counts, icons, deco, motion, q: document.querySelector('.search__bar .q').textContent };
});
console.log(w, v, rm ? 'reduce' : 'motion', JSON.stringify(r), 'errors', errs.length);
await p.addStyleTag({ content: '#snow{display:none!important}' });
await p.screenshot({ path: `${out}full-${w}-${v}${rm ? '-rm' : ''}.png`, fullPage: true });
await b.close();
