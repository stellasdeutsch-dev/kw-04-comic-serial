"""Вырезки предметов без каймы (людей не вырезаем, см. RULES.md): оригинал в полном размере → cutout → defringe → лист проверки.
Результат: work/clean/<имя>.png и work/clean/<имя>-check.jpg. Потом tools/media.py переводит их в webp.
Запуск: python3 tools/cutouts.py [имя ...]
"""
import os, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = os.path.join(ROOT, 'work')
DIAS = os.path.expanduser('~/dias/dias photos/')
TIM = os.path.expanduser('~/dias/timur-video/')
CUT = os.path.expanduser('~/.claude/skills/cutout/scripts/cutout')
DEF = os.path.expanduser('~/.claude/skills/cutout/scripts/defringe.py')
# имя на сайте: (исходный файл, кто это, erode)
SRC = {
    # предметы (генерации ElevenLabs в исходном размере)
    'newspaper': (W + '/gen/newspaper.png', 'предмет', 2),
    'objects': (W + '/gen/objects.png', 'предметы', 2),
}
os.makedirs(W + '/clean', exist_ok=True)
names = sys.argv[1:] or list(SRC)
for n in names:
    src, who, er = SRC[n]
    raw = f'{W}/clean/{n}-raw.png'
    if n == 'objects':
        subprocess.run(['nice', CUT, src, raw, '--split', f'{W}/clean/objparts/'], check=True, capture_output=True)
        parts = sorted(os.listdir(f'{W}/clean/objparts'))
        for i, p in enumerate(parts):
            out = ['passport', 'boarding-pass', 'airplane'][i]
            subprocess.run(['nice', 'python3', DEF, f'{W}/clean/objparts/{p}', f'{W}/clean/{out}.png', '--erode', str(er), '--check', f'{W}/clean/{out}-check.jpg'], check=True, capture_output=True)
            print(out, 'ok')
        continue
    subprocess.run(['nice', CUT, src, raw], check=True, capture_output=True)
    subprocess.run(['nice', 'python3', DEF, raw, f'{W}/clean/{n}.png', '--erode', str(er), '--check', f'{W}/clean/{n}-check.jpg'], check=True, capture_output=True)
    print(n, who, 'ok')

# Газета: в шапке сгенерировано «TEN CENTS» (цена не в евро). Закрашиваем строку текста бумагой из той же строки.
if 'newspaper' in names:
    from PIL import Image
    import numpy as np
    p = f'{W}/clean/newspaper.png'; a = np.array(Image.open(p).convert('RGBA'))
    dark = (a[110:160, 1040:1110, :3].astype(int).sum(2) < 400)
    lines = [110 + i for i, f in enumerate(dark.mean(1)) if f > 0.6]
    top = max(l for l in lines if l < 135); bot = min(l for l in lines if l > 135)
    cols = np.where((a[top + 2:bot - 1, 1020:1130, :3].astype(int).sum(2) < 380).any(0))[0] + 1020
    x0 = cols[cols > 1035].min() - 2; x1 = cols.max() + 3
    patch = a[top + 2:bot - 1, x0 - 22:x0 - 2].copy()
    for x in range(x0, x1, 20):
        w = min(20, x1 - x); a[top + 2:bot - 1, x:x + w] = patch[:, :w]
    Image.fromarray(a).save(p); print('newspaper: цена убрана')

