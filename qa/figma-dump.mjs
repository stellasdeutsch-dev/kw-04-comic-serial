// Снимает с живой страницы слои для Figma: блоки, тексты, картинки, иконки. Звук выключен.
import { chromium } from '/Users/shyngysnarseyit/Downloads/alterna/pdf-guides/node_modules/playwright/index.mjs';
import { writeFileSync, mkdirSync } from 'fs';
const out = new URL('./figma/', import.meta.url).pathname; mkdirSync(out, { recursive: true });
const b = await chromium.launch({ channel: 'chrome', args: ['--mute-audio'] });
for (const [page, path] of [['main', ''], ['lesson', 'lesson/']]) for (const w of [1440, 834, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://localhost:8704/' + path, { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '#snow{display:none!important} *{animation:none!important;transition:none!important} [data-reveal]{opacity:1!important;transform:none!important}' });
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 600) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(30); }
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(500);
  const data = await p.evaluate(() => {
    const NAMES = [['.hero', 'Первый экран'], ['main > nav.tabs', 'Вкладки серий'], ['#ep1', 'Комикс · Аэропорт'], ['#ep2', 'Комикс · Отель'], ['.scene', 'Сцена · дом ночью'], ['#ep3', 'Комикс · Кафе'],
      ['.search', 'Реклама платформы · поиск'], ['.browser', 'Реклама платформы · вложенный лендинг'], ['.paths', 'Реклама платформы · два пути'], ['.speakers', 'Реклама платформы · авторы'],
      ['#inside-dias', 'Реклама платформы · внутри Dias English'], ['#inside-timur', 'Реклама платформы · внутри Alterna Timur'], ['.frame', 'Реклама платформы · всё в одном месте'], ['#offers', 'Реклама платформы · цены'],
      ['.cont', 'Продолжение следует'], ['.foot', 'Подвал']];
    const sy = window.scrollY;
    const rgb = c => { const m = c && c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const a = m[1].split(',').map(s => parseFloat(s)); if (a.length > 3 && a[3] === 0) return null; return [a[0] / 255, a[1] / 255, a[2] / 255, a.length > 3 ? a[3] : 1]; };
    const firstGrad = s => { const m = s && s.match(/rgba?\([^)]+\)/g); return m ? rgb(m[0]) : null; };
    const angle = el => { const t = getComputedStyle(el).transform; if (!t || t === 'none') return 0; const m = t.match(/matrix\(([^)]+)\)/); if (!m) return 0; const v = m[1].split(',').map(Number); return Math.round(Math.atan2(v[1], v[0]) * 1800 / Math.PI) / 10; };
    const vis = el => { const s = getComputedStyle(el); if (s.display === 'contents') return true; if (s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) === 0) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const zOf = (el, root) => { let z = 0; for (let a = el; a && a !== root; a = a.parentElement) { const v = parseInt(getComputedStyle(a).zIndex); if (!isNaN(v)) z = Math.max(z, v); } return z; };
    const label = el => { const c = (el.className && el.className.baseVal === undefined ? el.className : '') || ''; const map = { bubble: 'Облачко', tab: 'Вкладка', btn: 'Кнопка', stat: 'Карточка цифры', ticket: 'Билет', ocard: 'Карточка цены', obox: 'Блок цены', hero__card: 'Карточка описания', hero__badge: 'Бейдж', search__bar: 'Строка поиска', chrome: 'Панель браузера', url: 'Адрес', vcard: 'Вертикальная карточка', 'ad-lbl': 'Метка «Реклама»', lbl: 'Метка', frame__phone: 'Телефон', cont__btn: 'Кнопка соцсетей', pill: 'Ник', ticker: 'Бегущая лента', tape: 'Лента', bhero__strip: 'Полоса с фото', ticket__stub: 'Корешок билета', ocard__tag: 'Подпись на фото', ocard__cta: 'Кнопка покупки', panel: 'Кадр', favs: 'Закладки', 'bhero__split': 'Фон', r: 'Красная половина', g: 'Зелёная половина', ep: 'Серия', tabs: 'Вкладки', stats: 'Цифры' };
      for (const k of c.split(/\s+/)) if (map[k]) return map[k]; return null; };
    const res = [];
    for (const [sel, name] of NAMES) {
      const sec = document.querySelector(sel); if (!sec || !vis(sec)) continue;
      const R = sec.getBoundingClientRect(), ox = R.left, oy = R.top;
      const sb = getComputedStyle(sec);
      const S = { name, x: Math.round(R.left), y: Math.round(R.top + sy), w: Math.round(R.width), h: Math.round(R.height), bg: rgb(sb.backgroundColor) || firstGrad(sb.backgroundImage), nodes: [] };
      const box = (el, extra) => { const r = el.getBoundingClientRect(); const ow = el.offsetWidth || r.width, oh = el.offsetHeight || r.height; return Object.assign({ cx: r.left + r.width / 2 - ox, cy: r.top + r.height / 2 - oy, w: ow, h: oh, rot: angle(el), z: zOf(el, sec) }, extra); };
      const walk = el => {
        if (!vis(el)) return;
        const tag = el.tagName; const cs = getComputedStyle(el);
        if (tag === 'CANVAS' || tag === 'NOSCRIPT') return;
        if (tag === 'IMG') { const n = el.src.split('/').pop().replace('.webp', ''); const cp = cs.clipPath; let clip = null;
          if (el.parentElement.classList.contains('panel') && el.parentElement.style.flex) { const pc = getComputedStyle(el.parentElement).clipPath; if (pc && pc !== 'none') { const s = el.parentElement.closest('.grow') ? 22 : 26; const r = el.parentElement.getBoundingClientRect(); const first = !el.parentElement.previousElementSibling, last = !el.parentElement.nextElementSibling; clip = [[first ? 0 : s, 0], [r.width, 0], [last ? r.width : r.width - s, r.height], [0, r.height]]; } }
          const pr = clip ? el.parentElement : el; S.nodes.push(box(pr, { t: 'img', n, alt: el.alt, op: parseFloat(cs.opacity), blend: cs.mixBlendMode, clip, fit: cs.objectFit, gray: /grayscale/.test(cs.filter) })); return; }
        if (tag === 'svg') { if (el.closest('a.hero__qr, a.foot__qr') && !el.classList.contains('ic')) { /* QR */ }
          const col = cs.color; let html = el.outerHTML.replace(/currentColor/g, col); const r = el.getBoundingClientRect();
          if (r.width < 2) return; S.nodes.push(box(el, { t: 'svg', svg: html.replace(/class="[^"]*"/g, '').replace('<svg', `<svg width="${Math.round(r.width)}" height="${Math.round(r.height)}"`), stroke: rgb(cs.color) })); return; }
        const bg = rgb(cs.backgroundColor) || (cs.backgroundImage !== 'none' && !/url\(/.test(cs.backgroundImage) && cs.webkitBackgroundClip !== 'text' && cs.backgroundClip !== 'text' ? firstGrad(cs.backgroundImage) : null);
        const bw = parseFloat(cs.borderTopWidth) || 0, bc = bw ? rgb(cs.borderTopColor) : null;
        if ((bg || bc) && el !== sec) S.nodes.push(box(el, { t: 'rect', name: label(el), bg, bc, bw, rad: parseFloat(cs.borderTopLeftRadius) || 0, op: parseFloat(cs.opacity) }));
        if (el.classList && el.classList.contains('sr')) return;
        const isInline = k => k.nodeType === 3 || (k.nodeType === 1 && ['B', 'STRONG', 'EM', 'I', 'BR', 'SMALL', 'SPAN'].includes(k.tagName) && getComputedStyle(k).display === 'inline' && ![...k.querySelectorAll('*')].some(q => getComputedStyle(q).display !== 'inline' && q.tagName !== 'BR'));
        const emit = (run, inheritBox) => {
          let text = '', segs = [];
          const add = list => { for (const k of list) { if (k.nodeType === 3) { let d = k.data.replace(/\s+/g, ' '); if (!text || /\s$/.test(text)) d = d.replace(/^ /, ''); if (!d) continue; const ps = getComputedStyle(k.parentElement); const st = text.length; text += d; segs.push([st, text.length, rgb(ps.color) || [1, 1, 1, 1], ps.fontWeight, parseFloat(ps.fontSize), ps.fontStyle, ps.fontFamily.split(',')[0].replace(/["']/g, '')]); } else if (k.tagName === 'BR') { text = text.replace(/ $/, ''); text += '\n'; } else add([...k.childNodes]); } };
          add(run); text = text.replace(/ +\n/g, '\n').trim(); if (!text) return;
          const rg = document.createRange(); rg.setStartBefore(run[0]); rg.setEndAfter(run[run.length - 1]); const rr = rg.getBoundingClientRect();
          const transparent = cs.color === 'rgba(0, 0, 0, 0)' || cs.webkitTextFillColor === 'rgba(0, 0, 0, 0)';
          const n = { t: 'text', text, segs, ff: cs.fontFamily.split(',')[0].replace(/["']/g, ''), fw: cs.fontWeight, fs: parseFloat(cs.fontSize), fst: cs.fontStyle, lh: parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2, ls: parseFloat(cs.letterSpacing) || 0, al: cs.textAlign, col: transparent ? 'grad' : rgb(cs.color), nowrap: cs.whiteSpace === 'nowrap', tag: el.tagName, rot: angle(el), z: zOf(el, sec) };
          if (inheritBox) { const r = el.getBoundingClientRect(); const pl = parseFloat(cs.paddingLeft), pr = parseFloat(cs.paddingRight), pt = parseFloat(cs.paddingTop), pb = parseFloat(cs.paddingBottom); const ow = el.clientWidth - pl - pr || r.width, oh = el.clientHeight - pt - pb || r.height; Object.assign(n, { cx: r.left + r.width / 2 - ox + (pl - pr) / 2, cy: r.top + r.height / 2 - oy + (pt - pb) / 2, w: ow, h: oh }); }
          else Object.assign(n, { cx: rr.left + rr.width / 2 - ox, cy: rr.top + rr.height / 2 - oy, w: rr.width, h: rr.height });
          S.nodes.push(n); };
        const kids = [...el.childNodes];
        if (el.textContent.trim() && kids.length && kids.every(isInline)) { emit(kids, true); return; }
        let run = [];
        const flush = () => { if (run.some(k => (k.nodeType === 3 && k.data.trim()) || (k.nodeType === 1 && k.textContent.trim()))) emit(run, false); run = []; };
        for (const k of kids) { if (isInline(k)) run.push(k); else { flush(); if (k.nodeType === 1) walk(k); } }
        flush();
      };
      for (const k of sec.children) walk(k);
      S.nodes = S.nodes.filter(n => n.cx + n.w / 2 > -40 && n.cx - n.w / 2 < S.w + 40 && n.cy + n.h / 2 > -40 && n.cy - n.h / 2 < S.h + 40);
      S.nodes = S.nodes.map((n, i) => (n.i = i, n)).sort((a, b) => a.z - b.z || a.i - b.i);
      S.nodes.forEach(n => { delete n.i; delete n.z; for (const k of ['cx', 'cy', 'w', 'h', 'lh', 'fs', 'ls']) if (typeof n[k] === 'number') n[k] = Math.round(n[k]); });
      res.push(S);
    }
    return { width: innerWidth, height: document.documentElement.scrollHeight, sections: res };
  });
  writeFileSync(`${out}${page}-${w}.json`, JSON.stringify(data));
  console.log(page, w, data.sections.length, data.sections.reduce((a, s) => a + s.nodes.length, 0), JSON.stringify(data).length);
  await p.close();
}
await b.close();
