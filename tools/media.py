"""Собирает картинки сайта в gh/media (webp, до 1600 px).
Источники: кадры Тимура (work/frames), фото Диаса, генерации (work/gen), вырезки (work/cut),
скриншоты платформ Dias English и Alterna Timur.
Запуск: python3 tools/media.py
"""
from PIL import Image, ImageOps, ImageEnhance
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'gh', 'media')
W = os.path.join(ROOT, 'work')
DIAS = os.path.expanduser('~/dias/shared/dias-photos-web/dias-IMG_%s.webp')
FR = os.path.join(W, 'frames', '%s.jpg')
DSH1 = os.path.expanduser('~/dias/1/site/media/%s.webp')
DSH3 = os.path.expanduser('~/dias/3/sharp/media/%s.webp')
TSH = os.path.expanduser('~/Desktop/Projects/d4/alterna-tr/media/%s')
os.makedirs(OUT, exist_ok=True)


def save(im, name, q=78, maxw=1600):
    if im.width > maxw:
        im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    p = os.path.join(OUT, name + '.webp')
    im.save(p, 'WEBP', quality=q, method=6)
    return p


def bw(im, contrast=1.15, bright=1.0):
    g = ImageOps.grayscale(im.convert('RGB'))
    g = ImageOps.autocontrast(g, cutoff=1)
    g = ImageEnhance.Contrast(g).enhance(contrast)
    g = ImageEnhance.Brightness(g).enhance(bright)
    return g.convert('RGB')


def fit(im, aspect, cx=0.5, cy=0.5, box=None, maxw=1400):
    im = im.convert('RGB')
    if box:
        im = im.crop(box)
    w = min(im.width, maxw)
    return ImageOps.fit(im, (w, round(w / aspect)), Image.LANCZOS, centering=(cx, cy))


# Комикс: (имя, источник, соотношение, cx, cy, box, цвет?)
PANELS = [
    ('c1-1', FR % 't_2799_14', 3.7, .5, .52, None, False),
    ('c1-2', FR % 't_2801_5', 1.1, .5, .28, None, False),
    ('c1-3', DIAS % '3983', 2.0, .5, .3, None, False),
    ('c1-4', FR % 't_2853_8', 1.07, .5, .5, (180, 560, 980, 1340), False),
    ('c1-5', DIAS % '2054', 2.05, .6, .72, None, False),
    ('c2-1', FR % 't_2810_5', 1.3, .5, .4, None, False),
    ('c2-2', DIAS % '8084-3', 1.0, .5, .5, None, False),
    ('c2-3', DIAS % '9468', 1.1, .5, .55, None, False),
    ('c2-4', FR % 't_2809_9', 1.5, .5, .45, None, False),
    ('c2-5', FR % 'tp_2856', 1.5, .5, .28, None, False),
    ('c3-1', DIAS % '8898-3', 1.6, .5, .45, None, True),
    ('c3-2', FR % 't_2800_4', 1.6, .5, .3, None, False),
    ('c3-3', DIAS % '6922', .9, .5, .5, None, False),
    ('c3-4', DIAS % '7055', .9, .5, .5, None, False),
    ('c3-5', FR % 't_2813_14', .9, .5, .4, None, False),
    ('c3-6', DIAS % '1776', .9, .5, .4, None, False),
    ('c3-7', FR % 't_2799_25', .9, .5, .3, None, False),
    ('c3-8', DIAS % '2084', 1.5, .5, .55, None, False),
    ('c3-9', FR % 'tp_2845', 1.5, .5, .95, None, False),
    ('c3-big', FR % 't_2801_11', 2.5, .5, .47, None, False),
]

for name, src, asp, cx, cy, box, color in PANELS:
    im = Image.open(src)
    im = ImageOps.exif_transpose(im)
    im = fit(im, asp, cx, cy, box)
    if not color:
        im = bw(im)
    else:
        im = ImageEnhance.Color(im).enhance(.75)
    save(im, name, q=74, maxw=1400)

# Аватары серий (кружки)
AV = ['2534', '8084-3', '8898-3', '1690', '6025', '9449', '5176', '9347', '2748', '3112', '9977', '1371']
for i, a in enumerate(AV, 1):
    im = ImageOps.exif_transpose(Image.open(DIAS % a))
    im = ImageOps.fit(im.convert('RGB'), (120, 120), Image.LANCZOS, centering=(.5, .35))
    save(im, 'ep-%02d' % i, q=72)

# Генерации
G = os.path.join(W, 'gen', '%s.png')
save(Image.open(G % 'hero-bg').convert('RGB'), 'hero-bg', q=72)
save(Image.open(G % 'house').convert('RGB'), 'house-night', q=72)
save(Image.open(G % 'mantel').convert('RGB'), 'mantel', q=72)
save(Image.open(G % 'taxi').convert('RGB'), 'taxi-night', q=72)
save(Image.open(G % 'pill').convert('RGB'), 'pill', q=78)
save(Image.open(G % 'laptop').convert('RGB'), 'laptop', q=78)

# Вырезки (прозрачные)
C = os.path.join(W, 'cut', '%s.png')


def save_alpha(src, name, maxw=900, gray=False, dark=None, top=None):
    im = Image.open(src).convert('RGBA')
    if top:  # оставить верх (бюст)
        im = im.crop((0, 0, im.width, round(im.height * top)))
    if gray:
        a = im.getchannel('A')
        g = bw(im.convert('RGB'))
        im = g.convert('RGBA'); im.putalpha(a)
    if dark is not None:  # силуэт заданного цвета
        a = im.getchannel('A')
        im = Image.new('RGBA', im.size, dark + (255,)); im.putalpha(a)
    if im.width > maxw:
        im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    im.save(os.path.join(OUT, name + '.webp'), 'WEBP', quality=80, alpha_quality=90, method=6)


save_alpha(C % 'newspaper', 'newspaper', 900)
save_alpha(C % 'dias_hero', 'dias-hero', 700)
save_alpha(C % 'timur_peek1', 'timur-peek-left', 600)
save_alpha(C % 'timur_peek2', 'timur-peek-right', 600)
save_alpha(C % 'timur_peek3', 'timur-peek-footer', 600)
save_alpha(C % 'objparts/objects_all-1', 'passport', 300)
save_alpha(C % 'objparts/objects_all-2', 'boarding-pass', 420)
save_alpha(C % 'objparts/objects_all-3', 'airplane', 520)
save_alpha(C % 'dias_speaker', 'speaker-dias', 520, top=.5)
save_alpha(C % 'timur_speaker', 'speaker-timur', 520, top=.42)
save_alpha(C % 'dias_profile', 'speaker-you', 520, dark=(6, 40, 30), top=.45)
save_alpha(C % 'timur_card', 'card-timur', 560, gray=True)
save_alpha(C % 'dias_card', 'card-dias', 560, gray=True)
save_alpha(C % 'timur_profile', 'silhouette-timur', 520, dark=(8, 8, 8))
save_alpha(C % 'dias_profile', 'silhouette-dias', 420, dark=(8, 8, 8))

# Фото мест для тонированных полос во вложенном лендинге
im = ImageOps.exif_transpose(Image.open(DIAS % '1689'))
save(bw(fit(im, .55, .5, .3)), 'strip-roma', q=70, maxw=500)
im = Image.open(FR % 't_2800_4')
save(bw(fit(im, .55, .5, .15, box=(0, 0, 1080, 900))), 'strip-palms', q=70, maxw=500)

# Скриншоты платформ
SHOTS = {
    'd-hub': DSH1 % 'n-a2-hub-desktop-hero',
    'd-lexika': DSH3 % 'n-lexika',
    'd-gemini': DSH1 % 'n-a0-gemini-desktop-hero',
    'd-roadmap-m': DSH3 % 'n-m-roadmap',
    'd-habits': DSH3 % 'n-habits',
    'd-materials': DSH3 % 'n-materials',
    'd-grammar': DSH1 % 'n-b1-grammar-desktop-hero',
    't-home': TSH % 'n-a0.webp',
    't-b1': TSH % 'n-b1.webp',
    't-themes': TSH % 'n-themes.webp',
    't-doctor': TSH % 'd-doctor.webp',
    't-kids': TSH % 'd-kids.webp',
    't-podcasts': TSH % 'v-podcasts.jpg',
    't-roadmap-m': TSH % 'ph1961.webp',
}
for name, src in SHOTS.items():
    save(Image.open(src).convert('RGB'), 'shot-' + name, q=80, maxw=1400)

print('ok', len(os.listdir(OUT)))

# Размеры картинок для width/height в разметке
import json
sizes = {}
for f in sorted(os.listdir(OUT)):
    if f.endswith('.webp'):
        with Image.open(os.path.join(OUT, f)) as im:
            sizes[f[:-5]] = list(im.size)
with open(os.path.join(ROOT, 'gh', 'assets', 'sizes.js'), 'w') as fh:
    fh.write('window.MEDIA_SIZES = ' + json.dumps(sizes) + ';\n')
print('sizes', len(sizes))
