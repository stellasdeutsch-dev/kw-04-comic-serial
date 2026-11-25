// Сборщик макета в Figma: читает данные из PNG-контейнера и строит блоки. Параметры: W, FRAME, FROM, TO
const W = '__W__', FRAME = '__FRAME__', FROM = __FROM__, TO = __TO__;
const holder = await figma.getNodeByIdAsync('4:2'); const bytes = await (figma.getImageByHash('85e6c25c527bd2c2f0d508dbb1c767f2e9694cab') || figma.getImageByHash(holder.fills[0].imageHash)).getBytesAsync();
// PNG: собрать IDAT, снять zlib (блоки без сжатия), убрать байты фильтра
let p = 8, idat = [];
while (p < bytes.length) { const len = (bytes[p] << 24 | bytes[p + 1] << 16 | bytes[p + 2] << 8 | bytes[p + 3]) >>> 0; const t = String.fromCharCode(bytes[p + 4], bytes[p + 5], bytes[p + 6], bytes[p + 7]); if (t === 'IDAT') idat.push(bytes.subarray(p + 8, p + 8 + len)); p += 12 + len; }
let total = idat.reduce((a, c) => a + c.length, 0), z = new Uint8Array(total), o = 0; for (const c of idat) { z.set(c, o); o += c.length; }
let q = 2, raw = []; while (q < z.length - 4) { const fin = z[q] & 1; const L = z[q + 1] | z[q + 2] << 8; raw.push(z.subarray(q + 5, q + 5 + L)); q += 5 + L; if (fin) break; }
let rl = raw.reduce((a, c) => a + c.length, 0), r = new Uint8Array(rl); o = 0; for (const c of raw) { r.set(c, o); o += c.length; }
const RW = 1000, rows = r.length / (RW + 1), d = new Uint8Array(rows * RW); for (let i = 0; i < rows; i++) d.set(r.subarray(i * (RW + 1) + 1, (i + 1) * (RW + 1)), i * RW);
const n = (d[0] << 24 | d[1] << 16 | d[2] << 8 | d[3]) >>> 0;
let s = '', i = 4, end = 4 + n; while (i < end) { let c = d[i++]; if (c >= 0xf0) { c = ((c & 7) << 18) | ((d[i++] & 63) << 12) | ((d[i++] & 63) << 6) | (d[i++] & 63); c -= 0x10000; s += String.fromCharCode(0xd800 + (c >> 10), 0xdc00 + (c & 1023)); continue; } if (c >= 0xe0) c = ((c & 15) << 12) | ((d[i++] & 63) << 6) | (d[i++] & 63); else if (c >= 0xc0) c = ((c & 31) << 6) | (d[i++] & 63); s += String.fromCharCode(c); }
const DATA = JSON.parse(s), PAGE = DATA[W], ICONS = DATA.icons, HASH = DATA.hashes;

const frame = await figma.getNodeByIdAsync(FRAME);
const vars = await figma.variables.getLocalVariablesAsync('COLOR');
const VAR = {}; for (const v of vars) { const c = v.valuesByMode[Object.keys(v.valuesByMode)[0]]; const h = [c.r, c.g, c.b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join(''); if (!VAR[h] || !v.name.startsWith('текст')) VAR[h] = v; }
const rgb = h => ({ r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255 });
const solid = h => { const pt = { type: 'SOLID', color: rgb(h) }; if (h.length > 6) pt.opacity = parseInt(h.slice(6, 8), 16) / 255; const v = VAR[h.slice(0, 6)]; return v && h.length === 6 ? figma.variables.setBoundVariableForPaint(pt, 'color', v) : pt; };
const W8 = { 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black' };
const font = (fam, w, st) => { w = +w || 400;
  if (fam === 'Old Standard TT') return { family: fam, style: st === 'italic' ? 'Italic' : w >= 700 ? 'Bold' : 'Regular' };
  if (fam === 'Inter') return { family: 'Inter', style: { 400: 'Regular', 500: 'Medium', 600: 'Semi Bold', 700: 'Bold', 800: 'Extra Bold', 900: 'Black' }[w] || 'Regular' };
  if (fam === 'Unbounded' || fam === 'Montserrat' || fam === 'Oswald') return { family: fam, style: W8[w] || 'Regular' };
  return { family: 'Inter', style: 'Medium' }; };
const ICN = [['M4 5.5C6.5', 'book'], ['M6.5 14l2-5', 'word card'], ['M7.5 5v14', 'film'], ['M3.5 12.2V4.5', 'price tag'], ['M9 9l11 4', 'click'], ['M9 4V2.8', 'exam'], ['M9 7.5V5.5', 'briefcase'], ['M12 3.5l9 4.5', 'levels'], ['M18 3.5c-2', 'route'], ['M4 5.5h16', 'chat'], ['M5 20v-5', 'level bars'], ['r="4.5"', 'target'], ['M12 7v5', 'clock'], ['M2.5 9.5L12 5', 'graduation cap'], ['M9.5 7.5V4.5', 'suitcase'], ['M15.5 8.5', 'compass'], ['x="6.5" y="2.8"', 'phone'], ['M3.5 10v4h3', 'megaphone'], ['M4 20l1.2-4', 'whatsapp'], ['viewBox="0 0 40 44"', 'like'], ['M5 5l14 14', 'arrow'], ['M21 14.5', 'plane'], ['cy="12" r="4.2"', 'instagram'], ['cx="10.5"', 'search'], ['M3 5h9', 'translate'], ['M19 12a7', 'refresh'], ['M9 11V4.6', 'hand cursor'], ['M9 5v14', 'sidebar'], ['M14.5 6', 'back'], ['M9.5 6', 'forward'], ['x="5.5" y="10.5"', 'lock'], ['M12 3v12', 'share'], ['M12 5v14M5 12h14', 'plus'], ['x="7" y="7"', 'tabs'], ['r="8.5"', 'download'], ['M12 3l7 3', 'shield'], ['M4 12.5', 'check'], ['M3 4h2.4', 'cart']];
const PIC = { 'hero-bg': 'Фон · зимний город', 'house-night': 'Фото · дом ночью', 'mantel': 'Фон · стена со свечами', 'taxi-night': 'Фото · такси ночью', 'pill': 'Капсула', 'laptop': 'Ноутбук', 'passport': 'Паспорт', 'boarding-pass': 'Посадочный талон', 'airplane': 'Самолёт', 'newspaper': 'Газета', 'strip-roma': 'Фото · Колизей', 'strip-palms': 'Фото · пальмы', 'silhouette-timur': 'Силуэт · Тимур', 'silhouette-dias': 'Силуэт · Диас', 'speaker-you': 'Силуэт · ты', 'timur-peek-left': 'Тимур выглядывает слева', 'timur-peek-right': 'Тимур выглядывает справа', 'timur-peek-footer': 'Тимур выглядывает', 'card-timur': 'Фото · Тимур', 'card-dias': 'Фото · Диас', 'speaker-dias': 'Фото · Диас', 'speaker-timur': 'Фото · Тимур', 'dias-hero': 'Фото · Диас с газетой', 'timur-hero': 'Фото · Тимур с газетой', 'en-peek-left': 'Диас выглядывает слева', 'en-peek-right': 'Диас выглядывает справа', 'en-peek-footer': 'Диас выглядывает в подвале', 'tr-peek-left': 'Тимур выглядывает слева', 'tr-peek-right': 'Тимур выглядывает справа', 'tr-peek-footer': 'Тимур выглядывает в подвале', 'en-silhouette': 'Силуэт · Диас', 'en-silhouette-2': 'Силуэт · Диас', 'tr-silhouette': 'Силуэт · Тимур', 'tr-silhouette-2': 'Силуэт · Тимур', 'en-speaker-you': 'Силуэт · ты', 'tr-speaker-you': 'Силуэт · ты', 'en-strip-left': 'Фото · Диас у Колизея', 'en-strip-right': 'Фото · Диас ночью', 'tr-strip-left': 'Фото · Тимур на набережной', 'tr-strip-right': 'Фото · пальмы', 'en-obj-books': 'Предмет · книги', 'en-obj-notebook': 'Предмет · тетрадь', 'en-obj-cards': 'Предмет · карточки для слов', 'en-obj-bus': 'Предмет · лондонский автобус', 'tr-obj-tea': 'Предмет · турецкий чай', 'tr-obj-notebook': 'Предмет · тетрадь', 'tr-obj-cards': 'Предмет · карточки для слов', 'tr-obj-simit': 'Предмет · симит' };
const BLEND = { lighten: 'LIGHTEN', multiply: 'MULTIPLY', screen: 'SCREEN' };
// шрифты
const need = new Map();
PAGE.s.slice(FROM, TO).forEach(S => S[6].forEach(t => { if (t[0] !== 't') return; const add = f => need.set(f.family + '|' + f.style, f); add(font(t[3], t[4], t[6])); (t[12] || []).forEach(g => add(font(g[6], g[3], g[5]))); }));
await Promise.all([...need.values()].map(f => figma.loadFontAsync(f)));
const place = (node, g, parent) => { const [cx, cy, w, h, rot] = g; parent.appendChild(node);
  if (rot) { const a = rot * Math.PI / 180; node.rotation = -rot; node.x = cx + (-w / 2) * Math.cos(a) - (-h / 2) * Math.sin(a); node.y = cy + (-w / 2) * Math.sin(a) + (-h / 2) * Math.cos(a); }
  else { node.x = cx - w / 2; node.y = cy - h / 2; } };
const made = [];
for (const S of PAGE.s.slice(FROM, TO)) {
  const [name, sx, sy, sw, sh, sbg, nodes] = S;
  const sec = figma.createFrame(); sec.name = name; sec.resize(Math.max(1, sw), Math.max(1, sh)); sec.fills = sbg ? [solid(sbg)] : []; sec.clipsContent = /Первый экран|Сцена|Продолжение|Подвал|вложенный/.test(name);
  frame.appendChild(sec); sec.x = sx; sec.y = sy; made.push(sec.id);
  let k = 0;
  for (const t of nodes) {
    const g = t[1]; let node;
    if (t[0] === 'r') { node = figma.createRectangle(); node.resize(Math.max(1, g[2]), Math.max(1, g[3])); node.fills = t[3] ? [solid(t[3])] : []; if (t[4]) { node.strokes = [solid(t[4])]; node.strokeWeight = t[5]; node.strokeAlign = 'INSIDE'; } node.cornerRadius = Math.min(t[6], g[2] / 2, g[3] / 2); if (t[7]) node.opacity = t[7]; node.name = t[2] || 'Плашка'; }
    else if (t[0] === 'i') { const h = HASH[t[2]]; if (!h) continue; const fill = [{ type: 'IMAGE', imageHash: h, scaleMode: 'FILL' }];
      if (t[5]) { node = figma.createVector(); const pts = t[5]; node.vectorPaths = [{ windingRule: 'NONZERO', data: 'M ' + pts.map(p => p.join(' ')).join(' L ') + ' Z' }]; node.fills = fill; }
      else { node = figma.createRectangle(); node.resize(Math.max(1, g[2]), Math.max(1, g[3])); node.fills = fill; }
      if (t[3]) node.opacity = t[3]; if (t[4] && BLEND[t[4]]) node.blendMode = BLEND[t[4]]; node.name = /-obj-/.test(t[2]) ? PIC[t[2]] : t[6] ? 'Фото · ' + t[6] : (PIC[t[2]] || (t[2].includes('ep-') ? 'Аватар серии' : t[2].startsWith('shot-') ? 'Скриншот платформы' : 'Кадр комикса')); }
    else if (t[0] === 's') { const svg = ICONS[t[2]]; if (!svg) continue; try { node = figma.createNodeFromSvg(svg); } catch (e) { continue; } node.resize(Math.max(1, g[2]), Math.max(1, g[3])); node.name = t[2] === 'qr' ? 'QR-код' : 'Icon / ' + ((ICN.find(c => svg.includes(c[0])) || [0, 'decor'])[1]); }
    else if (t[0] === 'b') { node = figma.createFrame(); node.name = 'Штрихкод'; node.resize(Math.max(1, g[2]), Math.max(1, g[3])); node.fills = []; let x = 0, sd = 7 + k; const bw = g[2] / 200; while (x < 200) { sd = (sd * 9301 + 49297) % 233280; const w = 1 + Math.floor(sd / 233280 * 4); const rr = figma.createRectangle(); rr.resize(w * bw, g[3]); rr.x = x * bw; rr.fills = [solid(t[2])]; rr.name = 'Полоса'; node.appendChild(rr); x += w + 1 + (sd % 3); } }
    else if (t[0] === 't') {
      const [, , text, fam, fw, fs, fst, lh, ls, al, col, nowrap, segs, tag] = t;
      node = figma.createText(); const f = font(fam, fw, fst); node.fontName = f; node.characters = text; node.fontSize = fs; node.lineHeight = { unit: 'PIXELS', value: lh }; if (ls) node.letterSpacing = { unit: 'PIXELS', value: ls };
      node.textAlignHorizontal = { center: 'CENTER', right: 'RIGHT', end: 'RIGHT', justify: 'JUSTIFIED' }[al] || 'LEFT';
      node.fills = [solid(col === 'grad' ? (/Карточка|цены/.test(name) ? 'ffffff' : 'e6e6e6') : col)];
      (segs || []).forEach(sg => { const [a, b, c, w8, z8, st8, ff8] = sg; if (b <= a || b > text.length) return; node.setRangeFontName(a, b, font(ff8, w8, st8)); node.setRangeFontSize(a, b, z8); if (c && c !== 'grad') node.setRangeFills(a, b, [solid(c)]); });
      if (nowrap) node.textAutoResize = 'WIDTH_AND_HEIGHT'; else { node.resize(Math.max(4, g[2] * 1.03 + 4), Math.max(1, g[3])); node.textAutoResize = 'HEIGHT'; }
      node.name = /^H[123]$/.test(tag) ? (tag === 'H1' ? 'Заголовок страницы' : 'Заголовок секции') : text.replace(/\n/g, ' ').slice(0, 40);
    }
    if (!node) continue;
    place(node, t[0] === 't' && t[11] ? [g[0], g[1], node.width, node.height, g[4]] : g, sec); k++;
  }
}
return { frame: FRAME, sections: made, count: made.length };
