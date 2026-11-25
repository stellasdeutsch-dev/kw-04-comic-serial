import { chromium } from '/Users/shyngysnarseyit/Downloads/alterna/pdf-guides/node_modules/playwright/index.mjs';
const w = +(process.argv[2] || 390), path = process.argv[3] || '';
const out = new URL('./shots/', import.meta.url).pathname;
const b = await chromium.launch({ channel: 'chrome', args: ['--mute-audio'] });
const p = await b.newPage({ viewport: { width: w, height: 900 } });
await p.goto('http://localhost:8704/' + path, { waitUntil: 'networkidle' });
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 600) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(50); }
await p.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(e => e.classList.add('in')));
await p.addStyleTag({ content: '#snow{display:none}' });
await p.waitForTimeout(700);
const sel = ['.hero', '#ep1', '#ep2', '.scene', '#ep3', '.search', '.browser', '.paths', '#quiz', '.speakers', '#inside-dias', '#inside-timur', '.frame', '#offers', '.cont', '.foot'];
let i = 0;
for (const s of sel) { const el = await p.$(s); if (!el) continue; i++; await el.screenshot({ path: `${out}sec-${w}-${path.split('/').filter(Boolean).join('-')}-${String(i).padStart(2, '0')}-${s.replace(/[.#]/g, '')}.png` }); }
await b.close(); console.log('done', i);
