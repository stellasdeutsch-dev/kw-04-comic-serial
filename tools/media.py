"""Собирает картинки сайта в gh/media (webp, до 1600 px) и пишет gh/assets/sizes.js и gh/media/PEOPLE.md.
Люди: на /en/ только Диас (файлы en-*, dias-*), на /tr/ только Тимур (файлы tr-*, timur-*).
Вырезки берутся из work/clean (см. tools/cutouts.py: оригинал → cutout → defringe).
Запуск: python3 tools/media.py
"""
from PIL import Image, ImageOps, ImageEnhance
import os, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'gh', 'media')
W = os.path.join(ROOT, 'work')
DIASW = os.path.expanduser('~/dias/shared/dias-photos-web/dias-IMG_%s.webp')
FR = os.path.join(W, 'frames', '%s.jpg')
DSH1 = os.path.expanduser('~/dias/1/site/media/%s.webp')
DSH3 = os.path.expanduser('~/dias/3/sharp/media/%s.webp')
TSH = os.path.expanduser('~/Desktop/Projects/d4/alterna-tr/media/%s')
os.makedirs(OUT, exist_ok=True)
PEOPLE = []  # (файл на сайте, исходный файл, кто)


def save(im, name, q=78, maxw=1600):
    if im.width > maxw:
        im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    im.save(os.path.join(OUT, name + '.webp'), 'WEBP', quality=q, method=6)


def bw(im, contrast=1.15):
    g = ImageOps.autocontrast(ImageOps.grayscale(im.convert('RGB')), cutoff=1)
    return ImageEnhance.Contrast(g).enhance(contrast).convert('RGB')


def fit(im, aspect, cx=0.5, cy=0.5, box=None, maxw=1400):
    im = ImageOps.exif_transpose(im).convert('RGB')
    if box:
        im = im.crop(box)
    w = min(im.width, maxw)
    return ImageOps.fit(im, (w, round(w / aspect)), Image.LANCZOS, centering=(cx, cy))


def src_name(path):
    import re
    m = re.search(r'/work/(?:frames|full)/t_(\d{4})_(\d+)\.(?:jpg|png)$', path)
    if m:
        return f'~/dias/timur-video/IMG_{m.group(1)}.MOV, кадр на {m.group(2)} с'
    m = re.search(r'/work/frames/tp_(\d{4})\.jpg$', path)
    if m:
        return f'~/dias/timur-video/IMG_{m.group(1)}.HEIC'
    return path.replace(os.path.expanduser('~'), '~')


# ---------- Комикс: одинаковая раскладка, свои кадры ----------
LAYOUT = [('c1-1', 3.7), ('c1-2', 1.1), ('c1-3', 2.0), ('c1-4', 1.07), ('c1-5', 2.05), ('c2-1', 1.3), ('c2-2', 1.0), ('c2-3', 1.1), ('c2-4', 1.5), ('c2-5', 1.5),
          ('c3-1', 1.6), ('c3-2', 1.6), ('c3-3', .9), ('c3-4', .9), ('c3-5', .9), ('c3-6', .9), ('c3-7', .9), ('c3-8', 1.5), ('c3-9', 1.5), ('c3-big', 2.5)]
PANELS = {
    'en': [(DIASW % '8991-3', .5, .5, None), (DIASW % '7362', .5, .3, None), (DIASW % '2053', .5, .5, None), (DIASW % '9216', .5, .45, None), (DIASW % '2054', .6, .72, None),
           (DIASW % '2056', .5, .5, None), (DIASW % '8084-3', .5, .5, None), (DIASW % '9468', .5, .55, None), (DIASW % '2058', .5, .5, None), (DIASW % '5176', .5, .35, None),
           (DIASW % '8898-3', .5, .45, None), (DIASW % '2084', .5, .55, None), (DIASW % '6922', .5, .5, None), (DIASW % '7055', .5, .5, None), (DIASW % '1776', .5, .4, None),
           (DIASW % '9880', .5, .45, None), (DIASW % '6025', .5, .4, None), (DIASW % '2077', .5, .45, None), (DIASW % '9206', .5, .9, None), (DIASW % '9660', .5, .5, None)],
    'tr': [(FR % 't_2799_14', .5, .52, None), (FR % 't_2801_5', .5, .28, None), (FR % 't_2800_12', .5, .45, None), (FR % 't_2853_8', .5, .5, (180, 560, 980, 1340)), (FR % 't_2813_4', .5, .5, None),
           (FR % 't_2810_5', .5, .4, None), (FR % 't_2809_3', .5, .45, None), (FR % 't_2799_25', .5, .4, None), (FR % 't_2809_9', .5, .45, None), (FR % 'tp_2856', .5, .28, None),
           (FR % 't_2799_3', .5, .45, None), (FR % 't_2800_4', .5, .3, None), (FR % 't_2813_14', .5, .4, None), (FR % 't_2811_6', .5, .5, None), (FR % 't_2806_5', .5, .5, None),
           (FR % 't_2854_8', .5, .4, None), (FR % 't_2801_14', .5, .3, None), (FR % 't_2810_10', .5, .45, None), (FR % 'tp_2850', .5, .97, None), (FR % 't_2801_11', .5, .47, None)],
}
WHO = {'en': 'Диас', 'tr': 'Тимур'}
for v, items in PANELS.items():
    for (name, asp), (src, cx, cy, box) in zip(LAYOUT, items):
        im = fit(Image.open(src), asp, cx, cy, box)
        im = ImageEnhance.Color(im).enhance(.75) if name == 'c3-1' else bw(im)
        # по ширине на экране: узкие кадры до 700 px, широкие до 1200 (вес страницы до ~3 МБ)
        save(im, f'{v}-{name}', q=66, maxw=640 if asp < 1.2 else 1100)
        PEOPLE.append((f'{v}-{name}.webp', src_name(src), WHO[v]))

# ---------- Аватары серий ----------
AV = {'en': [DIASW % a for a in ['2534', '8084-3', '8898-3', '1690', '6025', '9449', '5176', '9347', '2748', '3112', '9977', '1371']],
      'tr': [FR % a for a in ['t_2799_14', 't_2800_4', 't_2801_5', 't_2853_3', 't_2809_9', 't_2810_5', 't_2813_4', 'tp_2856', 'tp_2850', 't_2854_4', 't_2800_12', 't_2799_25']]}
for v, lst in AV.items():
    for i, src in enumerate(lst, 1):
        im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
        save(ImageOps.fit(im, (120, 120), Image.LANCZOS, centering=(.5, .33)), f'{v}-ep-{i:02d}', q=72)
        PEOPLE.append((f'{v}-ep-{i:02d}.webp', src_name(src), WHO[v]))

# ---------- Полосы с фото во вложенном лендинге ----------
for name, src, cy, box in [('en-strip-left', DIASW % '1689', .3, None), ('en-strip-right', DIASW % '2748', .4, None),
                           ('tr-strip-left', FR % 't_2801_5', .15, (0, 0, 1080, 900)), ('tr-strip-right', FR % 't_2800_4', .15, (0, 0, 1080, 900))]:
    save(bw(fit(Image.open(src), .55, .5, cy, box=box)), name, q=70, maxw=500)
    PEOPLE.append((name + '.webp', src_name(src), 'Диас' if name.startswith('en') else 'Тимур'))

# ---------- Генерации (без людей) ----------
G = os.path.join(W, 'gen', '%s.png')
for g, name, q in [('hero-bg', 'hero-bg', 72), ('house', 'house-night', 72), ('mantel', 'mantel', 72), ('taxi', 'taxi-night', 72), ('pill', 'pill', 78), ('laptop', 'laptop', 78)]:
    save(Image.open(G % g).convert('RGB'), name, q=q)

# ---------- Предметы: вырезки без каймы (work/clean, см. tools/cutouts.py) ----------
C = os.path.join(W, 'clean', '%s.png')


def save_alpha(src, name, maxw=900):
    im = Image.open(C % src).convert('RGBA')
    if im.width > maxw:
        im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    im.save(os.path.join(OUT, name + '.webp'), 'WEBP', quality=80, alpha_quality=90, method=6)


save_alpha('newspaper', 'newspaper', 900)
save_alpha('passport', 'passport', 300)
save_alpha('boarding-pass', 'boarding-pass', 420)
save_alpha('airplane', 'airplane', 520)
# предметы по теме языка (живой сайт): /en/ книги, тетрадь, карточки, лондонский автобус; /tr/ чай, тетрадь, карточки, симит
for n in ['en-obj-books', 'en-obj-notebook', 'en-obj-bus', 'en-obj-cards', 'tr-obj-tea', 'tr-obj-notebook', 'tr-obj-cards', 'tr-obj-simit']:
    save_alpha(n, n, 480)

# ---------- Люди: только целые фото со своим фоном (без вырезки и масок) ----------
WHOLE = {
    'en': {'hero': DIASW % '1690', 'peek-left': DIASW % '5176', 'peek-right': DIASW % '9347', 'footer': DIASW % '2077', 'speaker': DIASW % '6013',
           'you': DIASW % '2535', 'card': DIASW % '9210', 'browser': DIASW % '4033', 'ticket': DIASW % '3112'},
    'tr': {'hero': FR % 't_2854_4', 'peek-left': FR % 't_2853_8', 'peek-right': FR % 't_2854_8', 'footer': FR % 't_2853_11', 'speaker': FR % 'tp_2856',
           'you': FR % 't_2810_5', 'card': FR % 'tp_2850', 'browser': FR % 't_2853_3', 'ticket': FR % 't_2809_3'},
}
for v, slots in WHOLE.items():
    for slot, src in slots.items():
        im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
        # кадр 9:16 из видео: до 3:4, снизу оставляем всё, убираем пустую стену над головой
        if im.height / im.width > 1.5:
            h = round(im.width * 4 / 3); top = im.height - h if slot not in ('you', 'ticket') else (im.height - h) // 2
            im = im.crop((0, top, im.width, top + h))
        mh = 560 if slot in ('peek-left', 'peek-right', 'footer', 'ticket') else 860  # маленькие рамки не тянут лишний вес
        if im.height > mh:
            im = im.resize((round(im.width * mh / im.height), mh), Image.LANCZOS)
        save(im, f'{v}-photo-{slot}', q=78)
        PEOPLE.append((f'{v}-photo-{slot}.webp', src_name(src), WHO[v]))

# ---------- Скриншоты платформ ----------
SHOTS = {'d-hub': DSH1 % 'n-a2-hub-desktop-hero', 'd-lexika': DSH3 % 'n-lexika', 'd-gemini': DSH1 % 'n-a0-gemini-desktop-hero', 'd-roadmap-m': DSH3 % 'n-m-roadmap',
         'd-habits': DSH3 % 'n-habits', 'd-materials': DSH3 % 'n-materials', 'd-grammar': DSH1 % 'n-b1-grammar-desktop-hero',
         't-home': TSH % 'n-a0.webp', 't-b1': TSH % 'n-b1.webp', 't-themes': TSH % 'n-themes.webp', 't-doctor': TSH % 'd-doctor.webp', 't-kids': TSH % 'd-kids.webp',
         't-podcasts': TSH % 'v-podcasts.jpg', 't-roadmap-m': TSH % 'ph1961.webp'}
for name, src in SHOTS.items():
    save(Image.open(src).convert('RGB'), 'shot-' + name, q=80, maxw=1400)

# ---------- Список людей и размеры ----------
with open(os.path.join(OUT, 'PEOPLE.md'), 'w') as fh:
    fh.write('# Люди на картинках сайта 04\n\nНа /en/ только Диас (файлы en-*), на /tr/ только Тимур (файлы tr-*). Людей не вырезаем: все фото целые, со своим фоном.\n\n| Файл на сайте | Исходный файл | Кто |\n|---|---|---|\n')
    for f, s, who in PEOPLE:
        fh.write(f'| {f} | {s} | {who} |\n')
sizes = {}
for f in sorted(os.listdir(OUT)):
    if f.endswith('.webp'):
        with Image.open(os.path.join(OUT, f)) as im:
            sizes[f[:-5]] = list(im.size)
with open(os.path.join(ROOT, 'gh', 'assets', 'sizes.js'), 'w') as fh:
    fh.write('window.MEDIA_SIZES = ' + json.dumps(sizes) + ';\n')
print('webp', len(sizes), 'people', len(PEOPLE))
