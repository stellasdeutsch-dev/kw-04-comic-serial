/* Сайт №04: собирает страницу из window.CONTENT. Разметку блоков правят здесь, тексты в content.js */
(function () {
  'use strict';
  var C = window.CONTENT, SZ = window.MEDIA_SIZES || {};
  var BASE = document.documentElement.getAttribute('data-base') || '';
  var VERSION = document.documentElement.getAttribute('data-version') || 'ad';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Иконки (свои, по смыслу) ---------- */
  var ICONS = {
    arrow: '<path d="M5 5l14 14M19 8v11H8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="square"/>',
    plane: '<path d="M21 14.5v-1.8l-7.6-4.6V3.6a1.4 1.4 0 0 0-2.8 0v4.5L3 12.7v1.8l7.6-2.3v4.6l-2 1.5V20l3.4-1 3.4 1v-1.7l-2-1.5v-4.6z" fill="currentColor"/>',
    insta: '<rect x="3" y="3" width="18" height="18" rx="5.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.4" cy="6.6" r="1.3" fill="currentColor"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    translate: '<path d="M3 5h9M7.5 3v2M5 5c.6 3 2.6 5.4 5 6.5M10 5c-.7 3.4-3 6-6 7.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M12.5 21l4-10 4 10M14 17.5h5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    refresh: '<path d="M19 12a7 7 0 1 1-2.1-5M19 4v4h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    hand: '<path d="M9 11V4.6a1.6 1.6 0 0 1 3.2 0V10m0-1.2a1.6 1.6 0 0 1 3.2 0V11m0-.8a1.6 1.6 0 0 1 3.2 0v4.6A6.4 6.4 0 0 1 12.2 21h-.6a6 6 0 0 1-4.9-2.6L3.9 14a1.7 1.7 0 0 1 2.6-2.1L9 14" fill="#111" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
    sidebar: '<rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M9 5v14" stroke="currentColor" stroke-width="1.7"/>',
    back: '<path d="M14.5 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    fwd: '<path d="M9.5 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    lock: '<rect x="5.5" y="10.5" width="13" height="9.5" rx="2" fill="currentColor"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="currentColor" stroke-width="2"/>',
    share: '<path d="M12 3v12M7.5 7.5L12 3l4.5 4.5M5 12v8h14v-8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    plus: '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    tabs: '<rect x="7" y="7" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M4 16V6a2 2 0 0 1 2-2h10" fill="none" stroke="currentColor" stroke-width="1.7"/>',
    download: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 7.5v8M8.5 12.5l3.5 3.5 3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    shield: '<path d="M12 3l7 3v5.5c0 4.4-3 8-7 9.5-4-1.5-7-5.1-7-9.5V6z" fill="none" stroke="currentColor" stroke-width="1.7"/>',
    check: '<path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
    cart: '<path d="M3 4h2.4l2.2 11h10.6l2-8H7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="19.5" r="1.5" fill="currentColor"/><circle cx="17" cy="19.5" r="1.5" fill="currentColor"/>',
    /* живой сайт: иконки пунктов, вопросов и цифр */
    book: '<path d="M4 5.5C6.5 4.3 9.3 4.3 12 6c2.7-1.7 5.5-1.7 8-.5v13c-2.5-1.2-5.3-1.2-8 .5-2.7-1.7-5.5-1.7-8-.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 6v13" stroke="currentColor" stroke-width="1.8"/>',
    abc: '<rect x="3" y="6" width="15" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6.5 14l2-5 2 5M7.2 12.6h2.6M21 9v10a2 2 0 0 1-2 2H7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    film: '<rect x="3.5" y="5" width="17" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7.5 5v14M16.5 5v14M3.5 9.5h4M3.5 14.5h4M16.5 9.5h4M16.5 14.5h4" stroke="currentColor" stroke-width="1.8"/>',
    tag: '<path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.3 7.3a1 1 0 0 1-1.4 0z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="8.3" cy="8.3" r="1.6" fill="currentColor"/>',
    click: '<path d="M9 9l11 4-5 1.8L13.2 20z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M6 3.5v2.5M2.5 7H5M3.7 3.7l1.8 1.8M10.3 3.7L8.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    exam: '<rect x="5" y="4" width="14" height="17" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 4V2.8h6V4M8.5 12.5l2.4 2.4 4.6-4.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    case: '<rect x="3" y="7.5" width="18" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 7.5V5.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 12.5h18" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    layers: '<path d="M12 3.5l9 4.5-9 4.5L3 8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M3 12.2l9 4.5 9-4.5M3 16.2l9 4.5 9-4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    route: '<circle cx="6" cy="18" r="2.3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M18 3.5c-2 0-3.5 1.5-3.5 3.4 0 2.4 3.5 5.6 3.5 5.6s3.5-3.2 3.5-5.6c0-1.9-1.5-3.4-3.5-3.4z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.3 18H15a3 3 0 0 0 0-6h-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="2 2.4"/>',
    chat: '<path d="M4 5.5h16v10H11l-4.5 3.8v-3.8H4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="8.5" cy="10.5" r="1.1" fill="currentColor"/><circle cx="12" cy="10.5" r="1.1" fill="currentColor"/><circle cx="15.5" cy="10.5" r="1.1" fill="currentColor"/>',
    bars: '<path d="M5 20v-5M10 20v-8M15 20V9M20 20V5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
    target: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/>',
    clock: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3.4 2.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    cap: '<path d="M2.5 9.5L12 5l9.5 4.5L12 14z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M6.5 11.5v4.3c1.5 1.5 3.4 2.2 5.5 2.2s4-.7 5.5-2.2v-4.3M21.5 9.5v5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    bag: '<rect x="5" y="7.5" width="14" height="11.5" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9.5 7.5V4.5h5v3M8 19v1.5M16 19v1.5M9 11v4.5M15 11v4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    compass: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M15.5 8.5l-2 5-5 2 2-5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    phone: '<rect x="6.5" y="2.8" width="11" height="18.4" rx="2.4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10.5 18h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    megaphone: '<path d="M3.5 10v4h3l7 4.5v-13l-7 4.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M17 9a4 4 0 0 1 0 6M7 14l1.2 5h2.4L10 15.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    whatsapp: '<path d="M4 20l1.2-4A8.3 8.3 0 1 1 8 18.8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 8.5c0 3.5 2.6 6.5 6.4 6.5l.8-1.6-2-1-1 .9c-1-.5-2-1.5-2.4-2.4l.9-1-1-2z" fill="currentColor"/>'
  };
  /* иконка по смыслу подписи: у каждого пункта своя */
  function kicon(t) {
    t = String(t).toLowerCase();
    if (/карт|route/.test(t)) return 'route';
    if (/граммат/.test(t)) return 'book';
    if (/лекс|слов|lexika|озвуч/.test(t)) return 'abc';
    if (/книг|фильм|аудио/.test(t)) return 'film';
    if (/ии |gemini|ии$/.test(t)) return 'chat';
    if (/интерактив/.test(t)) return 'click';
    if (/экзам/.test(t)) return 'exam';
    if (/работ/.test(t)) return 'case';
    if (/материал|уровн/.test(t)) return 'layers';
    if (/навсегда|один раз|€/.test(t)) return 'tag';
    if (/whatsapp/.test(t)) return 'whatsapp';
    if (/подписк/.test(t)) return 'tag';
    return 'check';
  }
  function deco(b, cls) { return b.deco ? img(b.deco, b.decoAlt || '', 'deco deco--' + cls) : ''; }
  function icon(n, cls) { return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + ICONS[n] + '</svg>'; }

  /* ---------- Помощники ---------- */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function src(n) { return BASE + 'media/' + n + '.webp'; }
  function img(n, alt, cls, eager) {
    var s = SZ[n] || [800, 600];
    return '<img src="' + src(n) + '" width="' + s[0] + '" height="' + s[1] + '" alt="' + esc(alt || '') + '"' +
      (cls ? ' class="' + cls + '"' : '') + (eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async">';
  }
  function url(h) { return C.links[h] || h || '#'; }
  function ext(h) { var u = url(h); return /^https?:/.test(u) ? ' target="_blank" rel="noopener"' : ''; }
  function a(h, cls, inner, label) {
    return '<a href="' + esc(url(h)) + '"' + ext(h) + (cls ? ' class="' + cls + '"' : '') + (label ? ' aria-label="' + esc(label) + '"' : '') + '>' + inner + '</a>';
  }
  var visible = C.blocks.filter(function (b) { return VERSION === 'ad' || !b.ad; });

  /* ---------- Общие куски ---------- */
  function episodes() {
    return '<div class="eps">' + C.episodes.map(function (e) {
      var inner = img(e.img, '', '', true) + '<span>' + esc(e.top) + '<small>' + esc(e.bottom) + '</small></span>';
      return e.href ? '<a class="ep is-on" href="' + e.href + '">' + inner + '</a>' : '<span class="ep" title="Серия скоро">' + inner + '</span>';
    }).join('') + '</div>';
  }
  function tabs() {
    return '<nav class="tabs wrap" aria-label="Серии" data-stagger>' + C.tabs.map(function (t) {
      return t.href ? '<a class="tab' + (t.current ? ' is-current' : '') + '" href="' + t.href + '"' + (t.current ? ' aria-current="page"' : '') + '>' + esc(t.label) + '</a>'
        : '<span class="tab" title="Серия скоро">' + esc(t.label) + '</span>';
    }).join('') + '</nav>';
  }
  function tickerTrack(words) {
    var one = words.map(function (w) { return '<span class="ticker__item">' + esc(w) + icon('plane') + '</span>'; }).join('');
    var row = ''; for (var i = 0; i < 8; i++) row += one;
    return '<div class="ticker__track" aria-hidden="true">' + row + row + '</div><span class="sr">' + esc(words.join(', ')) + '</span>';
  }
  function bubble(b) {
    return '<p data-pop class="bubble' + (b.lang === 'tr' ? ' bubble--tr' : '') + (b.small ? ' bubble--small' : '') + (b.big ? ' bubble--big' : '') + (b.x >= 45 ? ' bubble--r' : '') + (b.y >= 50 ? ' bubble--b' : '') +
      '" style="left:' + b.x + '%;top:' + b.y + '%" lang="' + (b.lang === 'tr' ? 'tr' : 'en') + '">' + esc(b.text) +
      (b.ru ? '<small lang="ru">' + esc(b.ru) + '</small>' : '') + '</p>';
  }
  function qr(cls, label) {
    return '<a class="' + cls + '" href="' + esc(C.links.social.url) + '" target="_blank" rel="noopener" aria-label="QR-код: ' + esc(label) + '" data-qr="' + esc(C.links.social.url) + '"></a>';
  }
  function barcodeSvg(seed) {
    var x = 0, out = '', s = seed || 7;
    while (x < 200) { s = (s * 9301 + 49297) % 233280; var w = 1 + Math.floor(s / 233280 * 4); out += '<rect x="' + x + '" y="0" width="' + w + '" height="70" fill="currentColor"/>'; x += w + 1 + (s % 3); }
    return '<svg viewBox="0 0 200 70" preserveAspectRatio="none" aria-hidden="true">' + out + '</svg>';
  }

  /* ---------- Блоки ---------- */
  var R = {};

  R.hero = function (b) {
    var m = b.media;
    return '<header class="hero"><div class="hero__stage">' +
      img(m.bg, '', 'hero__bg', true) +
      '<div class="hero__topline" aria-hidden="true">' + b.topline.map(function (w) { return '<span>' + esc(w) + '</span>'; }).join('') + '</div>' +
      episodes() +
      '<h1 class="hero__title"><span class="t1">' + esc(b.title1) + '</span><span>' + esc(b.title2) + '</span><em>' + esc(b.small) + '</em></h1>' +
      '<p class="hero__sub">' + b.subtitle.map(esc).join('<br>') + '</p>' +
      '<div class="hero__badge">' + esc(b.badge) + '</div>' +
      '<p class="hero__card"><span>' + b.card + '</span></p>' +
      '<p class="hero__note">' + b.note + '<small>' + b.noteSmall + '</small></p>' +
      '<div class="hero__vis">' +
        qr('hero__qr', C.links.social.label) +
        '<a class="hero__handle" href="' + esc(C.links.social.url) + '" target="_blank" rel="noopener">' + icon('insta') + esc(C.links.social.label) + '</a>' +
        img(m.peekLeft, m.peekLeftAlt || '', 'hero__peek hero__peek--l', true) + img(m.peekRight, m.peekRightAlt || '', 'hero__peek hero__peek--r', true) +
        img(m.person, m.personAlt || '', 'hero__person', true) +
        '<svg class="hero__heart" viewBox="0 0 40 44" aria-hidden="true"><path d="M6 0h28a6 6 0 0 1 6 6v24a6 6 0 0 1-6 6H24l-4 8-4-8H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6z" fill="#ef3b45"/><path d="M14.5 26.5l-5-5a4 4 0 0 1 5.6-5.6l.9.9.9-.9a4 4 0 0 1 5.6 5.6z" fill="#fff" transform="translate(-1 -3)"/><text x="29" y="24" font-family="Inter,sans-serif" font-weight="600" font-size="13" fill="#fff" text-anchor="middle">1</text></svg>' +
        img(m.objTop, '', 'hero__obj-top', true) +
        img(m.newspaper, 'Газета с заголовком Lost in translation', 'hero__paper', true) +
        img(m.objBottom, '', 'hero__obj-bottom', true) +
      '</div>' +
      '<div class="ticker hero__ticker">' + tickerTrack(b.ticker) + '</div>' +
      '</div></header>';
  };

  R.tabs = function () { return tabs(); };

  function panel(p, i, n, rowCls) {
    var cls = 'panel' + (p.color ? ' is-color' : '') + (p.grow > 55 ? ' is-wide' : '');
    var html = '<figure class="' + cls + '" style="flex:' + p.grow + ' 1 0">' + img(p.img, p.alt) +
      (p.mark ? '<span class="mark" aria-hidden="true">' + esc(p.mark) + '</span>' : '') +
      (p.caption ? '<figcaption class="cap cap--' + (p.caption.side || 'left') + (p.caption.accent === 'green' ? ' cap--green' : '') + (p.barcode ? ' cap--top' : '') + '">' + p.caption.text + '</figcaption>' : '') +
      (p.barcode ? '<div class="barcode"><span>' + esc(p.barcode) + '</span>' + barcodeSvg(11) + '</div>' : '') +
      (p.bubble ? bubble(p.bubble) : '') + '</figure>';
    return html;
  }
  R.comic = function (b) {
    return '<section class="comic' + (b.topSpace ? ' comic--space' : '') + '"' + (b.id ? ' id="' + b.id + '"' : '') + '><div class="wrap">' +
      (b.title ? '<h2 class="comic__title" data-reveal>' + esc(b.title) + '</h2>' : '') +
      b.rows.map(function (r) {
        return '<div class="crow' + (r.panels.length > 2 ? ' crow--many' : '') + '" style="--ar:1024/' + Math.round(r.h * 1024 / 878) + '" data-stagger>' +
          r.panels.map(function (p, i) { return panel(p, i, r.panels.length); }).join('') + '</div>';
      }).join('') + '</div></section>';
  };

  R.scene = function (b) {
    return '<section class="scene" aria-label="Сцена у дома">' + img(b.img, b.alt, 'scene__img') +
      b.figures.map(function (f) { return '<img src="' + src(f.img) + '" alt="" class="scene__fig" loading="lazy" width="' + (SZ[f.img] || [1, 1])[0] + '" height="' + (SZ[f.img] || [1, 1])[1] + '" style="left:' + f.x + '%;width:' + f.w + '%">'; }).join('') +
      b.bubbles.map(bubble).join('') + '</section>';
  };

  R.search = function (b) {
    return '<section class="search wrap" aria-label="Реклама платформ">' +
      '<p class="search__lead" data-reveal>' + b.lead + '</p>' +
      '<div class="search__row" data-reveal><div class="search__bar">' + icon('search') + '<span class="q">' + esc(b.query) + '</span><span class="caret"></span><span class="eng">' + esc(b.engine) + '</span><span class="tools">' + icon('translate') + icon('refresh') + '</span></div>' +
      '<div class="search__user">' + img(b.user.img, '') + '<div><b>' + esc(b.user.name) + '</b><span>' + esc(b.user.sub) + '</span></div></div></div>' +
      '<a class="search__ad" href="' + esc(url(b.adHref)) + '"' + ext(b.adHref) + '><span class="ad-lbl">' + icon('megaphone') + esc(b.adLabel) + '</span><span>' + b.adText + '</span></a>' +
      '<svg class="search__cursor" viewBox="0 0 24 24" aria-hidden="true">' + ICONS.hand + '</svg>' +
      '<small class="search__note">' + esc(b.note) + '</small>' +
      img(b.laptop, '', 'search__laptop') + deco(b, 'search') + '</section>';
  };

  R.browser = function (b) {
    var favs = 'NYYMYN•☆M○○○~GF✦YNS✦YYNGG✦GGGGGGЯGG'.split('').map(function (c) { return '<i>' + c + '</i>'; }).join('');
    function vcard(side, d) {
      return a(d.href, 'vcard vcard--' + side, '<canvas data-matrix="#000"></canvas>' + d.word.split('').map(function (ch, i) { return '<span style="--i:' + i + '">' + ch + '</span>'; }).join(''), d.word + ': купить');
    }
    return '<section class="wide embed browser" aria-label="Платформы Диаса и Тимура">' +
      '<div class="chrome">' + icon('sidebar') + icon('back') + icon('fwd') + icon('shield') + '<div class="url">' + icon('lock') + esc(b.url) + '</div>' + icon('download') + icon('share') + icon('plus') + icon('tabs') + '</div>' +
      '<div class="favs" aria-hidden="true">' + favs + '</div>' +
      '<div class="bhero">' +
        '<div class="bhero__strip bhero__strip--l">' + img(b.left.img, '') + '</div>' +
        '<div class="bhero__strip bhero__strip--r">' + img(b.right.img, '') + '</div>' +
        '<div class="bhero__split"><div class="r"><canvas class="matrix" data-matrix="#ff6b78"></canvas></div><div class="g"><canvas class="matrix" data-matrix="#6dffc4"></canvas></div></div>' +
        (b.photo ? img(b.photo, b.photoAlt || '', 'bhero__photo') : '') +
        vcard('l', b.left) + vcard('r', b.right) +
        '<div class="bhero__lbl bhero__lbl--l">' + icon('arrow') + '<span>' + b.labelLeft + '</span></div>' +
        '<div class="bhero__lbl bhero__lbl--r"><span>' + b.labelRight + '</span></div>' +
        '<p class="bhero__big"><span>' + esc(b.big1) + '</span><span>' + esc(b.big2[0]) + '<span class="bhero__cup">' + esc(b.cupLetter) +
          '</span>' + esc(b.big2[1]) + '</span></p>' +
        '<a class="bhero__btn" href="' + b.button.href + '">' + icon('arrow') + '<span>' + b.button.text + '</span></a>' +
      '</div></section>';
  };

  R.paths = function (b) {
    return '<section class="wide embed paths">' +
      '<h2 class="blur-h" data-reveal>' + b.heading.join('<br>') + '</h2>' +
      '<div class="paths__stage">' + img(b.pill, 'Капсула: половина зелёная, половина розовая', 'paths__pill') +
        '<svg class="path__line" data-draw viewBox="0 0 100 50" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%" aria-hidden="true"><path vector-effect="non-scaling-stroke" pathLength="1" d="M8 16H34L40 22.5"/><path vector-effect="non-scaling-stroke" pathLength="1" d="M92 33H72L64 27"/></svg>' +
        a(b.path1.href, 'path path--1', '<h3>' + icon('compass') + esc(b.path1.title) + '</h3>' + b.path1.text) +
        a(b.path2.href, 'path path--2', '<h3>' + esc(b.path2.title) + icon('phone') + '</h3>' + b.path2.text) +
      '</div></section>';
  };

  R.speakers = function (b) {
    return '<section class="wide embed speakers">' +
      '<h2 class="blur-h" data-reveal>' + b.heading.join('<br>') + '</h2>' +
      deco(b, 'speakers') + '<div class="speakers__grid" style="--n:' + b.items.length + '" data-stagger>' + b.items.map(function (s, i) {
        return a(s.href, 'spk' + (s.dark ? ' spk--dark' : ''), '<div class="spk__ph">' + img(s.img, s.alt || s.name[0]) + '</div>' +
          '<h3>' + s.name.map(esc).join('<br>') + '</h3><div class="spk__role">' + icon(i === 0 ? 'cap' : 'bag') + esc(s.role) + '</div>' +
          '<div class="spk__txt">' + icon('arrow') + '<span>' + s.text + '</span></div>');
      }).join('') + '</div></section>';
  };

  R.gallery = function (b) {
    var col = b.color === 'pink' ? 'var(--pink)' : 'var(--green)';
    return '<section class="gal wrap" id="' + b.id + '" style="--c:' + col + '">' +
      '<h2 class="gal__title" data-reveal>' + esc(b.title) + '</h2><p class="gal__sub">' + esc(b.sub) + '</p>' +
      '<div class="stats" style="--n:' + b.stats.length + '" data-stagger>' + b.stats.map(function (s) { return '<div class="stat">' + icon(kicon(s.t + ' ' + s.n), 'stat__ic') + '<b data-count="' + esc(s.n) + '">' + esc(s.n) + '</b><span>' + esc(s.t) + '</span></div>'; }).join('') + '</div>' +
      b.rows.map(function (r) {
        var hh = r.length === 1 ? 470 : r.length === 2 ? 400 : 300; return '<div class="grow" style="--ar:1024/' + hh + '" data-stagger>' + r.map(function (p) {
          var tall = /-m$/.test(p.img);
          return '<figure class="panel' + (tall ? ' is-tall' : '') + '" style="flex:' + p.grow + ' 1 0">' + img(p.img, p.cap) + '<figcaption>' + esc(p.cap) + '</figcaption></figure>';
        }).join('') + '</div>';
      }).join('') +
      '<div class="gal__cta">' + a(b.href, 'btn', icon('cart') + esc(b.cta)) + '</div></section>';
  };

  R.frame = function (b) {
    return '<section class="frame wide" aria-label="Скриншоты в рамке"><div class="frame__stage"><div class="frame__pic">' + img(b.bg, '', 'frame__bg') +
      '<div class="frame__shot">' + img(b.shot, b.shotAlt) + '</div>' +
      b.labels.map(function (l) {
        return '<div class="lbl' + (l.you ? ' lbl--you' : '') + '" data-pop style="left:calc(21.8% + ' + (l.x * 0.254) + '%);top:calc(8.2% + ' + (l.y * 0.645) + '%)"><b>' + esc(l.title) + '</b>' + (l.text ? '<span>' + l.text + '</span>' : '') + '</div>';
      }).join('') +
      '<div class="frame__phone">' + img(b.phone.img, b.phone.alt) + '<b>' + esc(b.phone.rec) + '</b></div></div>' +
      '<h2 class="frame__head" data-reveal>' + b.heading.map(function (h) { return '<span>' + esc(h) + '</span>'; }).join(' ') + '</h2>' +
      '<p class="frame__sub">' + b.sub + '</p>' +
      '</div></section>';
  };

  R.offers = function (b) {
    var cards = b.cards.map(function (c) {
      return a(c.href, 'ocard ocard--' + c.color, '<div class="ocard__in"><div class="ocard__photo">' + (c.plane ? img(c.plane, '', 'ocard__plane') : '') + img(c.photo, c.photoAlt || c.tag[0], 'ocard__person') +
        '<div class="ocard__tag"><b>' + esc(c.tag[0]) + '</b><span>' + esc(c.tag[1]) + '</span></div></div>' +
        '<div class="ocard__body"><div class="ocard__kicker">' + esc(c.kicker) + '</div>' +
        '<h3 class="ocard__big"><span>' + esc(c.big1) + '</span><span>' + esc(c.big2) + '</span><em>' + esc(c.script) + '</em></h3>' +
        '<div class="ocard__meta"><span class="price" data-pop>' + icon('tag') + esc(c.meta[0]) + '</span><i></i><span>' + esc(c.meta[1]) + '</span></div>' +
        '<p class="ocard__who">' + esc(c.forWhom) + '</p>' +
        '<ul class="ocard__list" data-stagger>' + c.list.map(function (li) { return '<li>' + icon(kicon(li)) + '<span>' + esc(li) + '</span></li>'; }).join('') + '</ul>' +
        '<span class="ocard__cta">' + icon('cart') + esc(c.cta) + '</span></div></div>');
    }).join('');
    var tk = b.tickets.map(function (t) {
      return a(t.href, 'ticket ticket--' + t.color, '<div class="ticket__main"><div class="ticket__name"><span>' + esc(t.name[0]) + ' <i>' + esc(t.tariff) + '</i></span><span>' + esc(t.name[1]) + '</span></div>' +
        '<div class="ticket__lines">' + t.lines + '</div><div class="ticket__foot"><span class="ticket__price">' + esc(t.price) + '</span><span>' + esc(t.when) + '</span></div>' +
        (t.photo ? img(t.photo, t.photoAlt || '', 'ticket__photo') : '') + '</div><div class="ticket__stub">' + barcodeSvg(t.color === 'green' ? 3 : 5) + '</div>', 'Купить ' + t.name.join(' '));
    }).join('');
    return '<section class="offers wrap" id="' + b.id + '">' + cards +
      '<div class="obox" data-reveal><div><h3>' + b.box.title.map(esc).join('<br>') + '</h3><ul>' +
      b.box.items.map(function (it) { return '<li>' + a(it.href, '', icon('arrow') + esc(it.text)) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="tickets" data-stagger>' + tk + '</div></div></section>';
  };

  R.quiz = function (b) {
    var col = b.color === 'pink' ? 'var(--pink)' : 'var(--green)';
    return '<section class="wide embed quiz" id="' + b.id + '" style="--c:' + col + '" aria-label="Мини-тест">' +
      '<h2 class="quiz__h" data-reveal>' + b.heading.map(esc).join('<br>') + '</h2><p class="quiz__sub">' + esc(b.sub) + '</p>' +
      '<div class="quiz__grid"><ol class="quiz__qs">' + b.questions.map(function (q, i) {
        return '<li class="quiz__q" data-key="' + q.key + '"><div class="quiz__num">0' + (i + 1) + '</div><div><h3>' + icon({ level: 'bars', goal: 'target', time: 'clock' }[q.key] || 'check', 'quiz__ic') + '<span>' + esc(q.q) + '</span></h3><div class="quiz__opts" role="group" aria-label="' + esc(q.q) + '" data-stagger>' +
          q.options.map(function (o) { return '<button type="button" class="quiz__opt" data-v="' + o.v + '" aria-pressed="false">' + esc(o.t) + '</button>'; }).join('') + '</div></div></li>';
      }).join('') + '</ol>' +
      '<div class="quiz__res" aria-live="polite"><div class="quiz__ticket"><div class="quiz__main"><div class="quiz__rt">' + esc(b.resultTitle) + '</div>' +
      '<div class="quiz__level" data-out="title">?</div><p class="quiz__wait" data-out="wait">Ответь на ' + b.questions.length + ' вопроса, и здесь появится твой старт</p>' +
      '<p data-out="level"></p><p data-out="goal"></p><p data-out="time"></p>' +
      '<div class="quiz__acts">' + a(b.href, 'quiz__cta', icon('cart') + '<span>' + esc(b.cta) + '</span>') + '<button type="button" class="quiz__again">' + icon('refresh') + esc(b.again) + '</button></div></div>' +
      '<div class="quiz__stub">' + barcodeSvg(9) + '</div></div>' + deco(b, 'quiz') + '</div></div>' +
      '<script type="application/json" class="quiz__data">' + JSON.stringify(b.results).replace(/</g, '\\u003c') + '</script></section>';
  };

  R.continued = function (b) {
    return '<section class="cont" aria-label="Продолжение следует">' + tabs() +
      '<div class="wrap cont__stage">' + img(b.bg, 'Такси ночью на заснеженной улице', 'cont__bg') +
      '<h2 class="cont__title" data-reveal>' + b.title.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</h2>' +
      '<div class="cont__bubbles">' + b.bubbles.map(bubble).join('') + '</div>' +
      '<p class="cont__text">' + b.text + '</p>' +
      '<a class="cont__btn" href="' + esc(C.links.social.url) + '" target="_blank" rel="noopener"><svg class="hand" viewBox="0 0 24 24" aria-hidden="true">' + ICONS.hand + '</svg>' +
      '<span class="hint">' + b.hint + '</span><span class="pill">' + icon('insta') + esc(C.links.social.label) + '</span></a>' +
      '</div></section>';
  };

  R.footer = function (b) {
    return '<footer class="foot"><div class="tapes" aria-hidden="true"><div class="ticker tape tape--b">' + tickerTrack(b.ticker) + '</div><div class="ticker tape tape--a">' + tickerTrack(b.ticker) + '</div></div>' +
      '<div class="foot__body">' + img(b.bg, '', 'foot__bg') + img(b.peek, b.peekAlt || '', 'foot__peek') +
      '<div class="wrap"><div class="foot__grid">' + qr('foot__qr', C.links.social.label) +
      '<div><h2 class="foot__title">' + b.title.map(esc).join('<br>') + '</h2><p class="foot__text">' + b.text + '</p></div></div>' +
      episodes() + '</div>' + deco(b, 'foot') + '</div></footer>';
  };

  /* ---------- Сборка ---------- */
  document.title = C.meta.title;
  var html = visible.map(function (b) { return R[b.type] ? R[b.type](b) : ''; }).join('');
  document.getElementById('app').innerHTML = '<main>' + html + '</main>';

  /* Мини-тест */
  Array.prototype.forEach.call(document.querySelectorAll('.quiz'), function (box) {
    var res = JSON.parse(box.querySelector('.quiz__data').textContent), ans = {}, qs = box.querySelectorAll('.quiz__q');
    function out(k, v) { var el = box.querySelector('[data-out="' + k + '"]'); if (el) el.textContent = v || ''; }
    function update() {
      var done = Object.keys(ans).length === qs.length;
      box.classList.toggle('is-done', done);
      if (!done) { out('title', '?'); out('level'); out('goal'); out('time'); out('wait', box.querySelector('.quiz__wait').getAttribute('data-text') || box.querySelector('.quiz__wait').textContent); return; }
      var L = res.level[ans.level] || {};
      out('title', L.title); out('level', L.text); out('goal', res.goal[ans.goal]); out('time', res.time[ans.time]); out('wait', '');
    }
    box.querySelector('.quiz__wait').setAttribute('data-text', box.querySelector('.quiz__wait').textContent);
    Array.prototype.forEach.call(qs, function (q) {
      Array.prototype.forEach.call(q.querySelectorAll('.quiz__opt'), function (btn) {
        btn.addEventListener('click', function () {
          Array.prototype.forEach.call(q.querySelectorAll('.quiz__opt'), function (o) { o.setAttribute('aria-pressed', 'false'); });
          btn.setAttribute('aria-pressed', 'true'); ans[q.getAttribute('data-key')] = btn.getAttribute('data-v'); update();
        });
      });
    });
    box.querySelector('.quiz__again').addEventListener('click', function () { ans = {}; Array.prototype.forEach.call(box.querySelectorAll('.quiz__opt'), function (o) { o.setAttribute('aria-pressed', 'false'); }); update(); });
  });

  /* QR-коды */
  function drawQR(el) {
    if (!window.qrcode) return;
    var q = window.qrcode(0, 'M'); q.addData(el.getAttribute('data-qr')); q.make();
    var n = q.getModuleCount(), r = '';
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) if (q.isDark(y, x)) r += 'M' + x + ' ' + y + 'h1v1h-1z';
    el.innerHTML = '<svg viewBox="0 0 ' + n + ' ' + n + '" shape-rendering="crispEdges" aria-hidden="true"><path d="' + r + '" fill="currentColor"/></svg>';
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-qr]'), drawQR);

  /* Появление: класс «скрыть до появления» ставит сам скрипт (без JS всё видно) */
  var motion = 'IntersectionObserver' in window && !reduce;
  if (motion) document.documentElement.classList.add('js-motion');
  Array.prototype.forEach.call(document.querySelectorAll('.foot .eps'), function (el) { el.setAttribute('data-stagger', ''); });
  Array.prototype.forEach.call(document.querySelectorAll('[data-stagger]'), function (el) {
    Array.prototype.forEach.call(el.children, function (c, i) { c.style.setProperty('--i', i); });
  });
  /* пузыри и метки внутри одного кадра выходят по очереди */
  Array.prototype.forEach.call(document.querySelectorAll('.frame__pic, .scene, .cont__bubbles'), function (box) {
    Array.prototype.forEach.call(box.querySelectorAll('[data-pop]'), function (el, i) { el.style.setProperty('--d', (i * 140) + 'ms'); });
  });
  function countUp(el) {
    var full = el.getAttribute('data-count'), m = full.match(/^(\D*)(\d+)(.*)$/);
    if (!m) return; var to = +m[2], t0 = performance.now(), dur = Math.min(1600, 700 + to);
    (function tick(t) { var k = Math.min(1, (t - t0) / dur); k = 1 - Math.pow(1 - k, 3); el.textContent = m[1] + Math.round(to * k) + m[3]; if (k < 1) requestAnimationFrame(tick); else el.textContent = full; })(t0);
  }
  function typeIn(el) {
    var full = el.textContent, i = 0; el.textContent = '';
    (function next() { i++; el.textContent = full.slice(0, i); if (i < full.length) setTimeout(next, 45); })();
  }
  function show(el) {
    el.classList.add('in');
    if (el.hasAttribute('data-stagger')) setTimeout(function () { el.classList.add('done'); }, el.children.length * 90 + 800);
    if (!motion) return;
    Array.prototype.forEach.call(el.querySelectorAll('[data-count]'), countUp);
    if (el.classList.contains('search__row')) typeIn(el.querySelector('.q'));
  }
  var rev = document.querySelectorAll('[data-reveal], [data-stagger], [data-pop], [data-draw], .deco');
  if (motion) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(rev, function (el) { io.observe(el); });
  } else { Array.prototype.forEach.call(rev, show); }

  /* «Матрица»: столбцы символов */
  var GLYPHS = 'アイウエオカキクケコサシスセソ0123456789ABCDEFİŞĞÜÖÇ';
  function matrix(cv) {
    var ctx = cv.getContext('2d'), color = cv.getAttribute('data-matrix'), cols, drops, fs, w, h;
    function size() {
      var r = cv.getBoundingClientRect(); w = cv.width = Math.max(1, Math.round(r.width)); h = cv.height = Math.max(1, Math.round(r.height));
      fs = Math.max(9, Math.round(w / 34)); cols = Math.ceil(w / fs); drops = [];
      for (var i = 0; i < cols; i++) drops[i] = Math.random() * h / fs;
      ctx.clearRect(0, 0, w, h);
      if (reduce) { for (var k = 0; k < 40; k++) step(true); }
    }
    function step(still) {
      ctx.fillStyle = 'rgba(0,0,0,.08)';
      ctx.globalCompositeOperation = 'destination-out'; ctx.fillRect(0, 0, w, h); ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = color; ctx.font = fs + 'px monospace';
      for (var i = 0; i < cols; i++) {
        ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], i * fs, drops[i] * fs);
        if (drops[i] * fs > h && Math.random() > .975) drops[i] = 0; drops[i] += still ? 1 : .5;
      }
    }
    size(); window.addEventListener('resize', size);
    return step;
  }
  var steppers = [], live = new Set();
  Array.prototype.forEach.call(document.querySelectorAll('canvas[data-matrix]'), function (cv) { var s = matrix(cv); steppers.push([cv, s]); });
  if (!reduce && steppers.length) {
    var vis = new IntersectionObserver(function (es) { es.forEach(function (e) { e.isIntersecting ? live.add(e.target) : live.delete(e.target); }); });
    steppers.forEach(function (p) { vis.observe(p[0]); });
    var last = 0;
    (function loop(t) { if (t - last > 70) { last = t; steppers.forEach(function (p) { if (live.has(p[0])) p[1](); }); } requestAnimationFrame(loop); })(0);
  }

  /* Снег */
  if (!reduce) {
    var cv = document.createElement('canvas'); cv.id = 'snow'; cv.setAttribute('aria-hidden', 'true'); document.body.appendChild(cv);
    var sx = cv.getContext('2d'), flakes = [], W, H, dpr = Math.min(2, window.devicePixelRatio || 1);
    function rs() { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; sx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(W * H / 16000); flakes = []; for (var i = 0; i < n; i++) flakes.push({ x: Math.random() * W, y: Math.random() * H, r: .6 + Math.random() * 1.8, v: .25 + Math.random() * .7, d: Math.random() * 6 }); }
    rs(); addEventListener('resize', rs);
    (function fall(t) {
      sx.clearRect(0, 0, W, H); sx.fillStyle = 'rgba(255,255,255,.75)'; sx.beginPath();
      for (var i = 0; i < flakes.length; i++) { var f = flakes[i]; f.y += f.v; f.x += Math.sin(t / 1600 + f.d) * .25; if (f.y > H + 4) { f.y = -4; f.x = Math.random() * W; } sx.moveTo(f.x, f.y); sx.arc(f.x, f.y, f.r, 0, 6.283); }
      sx.fill(); requestAnimationFrame(fall);
    })(0);
  }
})();
