"""Вырезки людей и предметов без каймы: оригинал в полном размере → cutout → defringe → лист проверки.
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
    # Диас, только для /en/
    'dias-hero': (DIAS + 'IMG_2054.HEIC', 'Диас', 2),
    'en-peek-left': (DIAS + 'IMG_8898 (3).HEIC', 'Диас', 2),
    'en-peek-right': (DIAS + 'IMG_2059.HEIC', 'Диас', 2),
    'en-peek-footer': (DIAS + 'IMG_7362.HEIC', 'Диас', 2),
    'speaker-dias': (DIAS + 'IMG_1690.HEIC', 'Диас', 2),
    'card-dias': (DIAS + 'IMG_9206.HEIC', 'Диас', 2),
    'en-sil-a': (DIAS + 'IMG_2535.HEIC', 'Диас', 2),
    'en-sil-b': (DIAS + 'IMG_9206.HEIC', 'Диас', 2),
    # Тимур, только для /tr/
    'timur-hero': (W + '/full/t_2800_4.png', 'Тимур', 2),
    'tr-peek-left': (W + '/full/t_2799_3.png', 'Тимур', 2),
    'tr-peek-right': (W + '/full/t_2801_11.png', 'Тимур', 2),
    'tr-peek-footer': (W + '/full/t_2800_12.png', 'Тимур', 2),
    'speaker-timur': (TIM + 'IMG_2856.HEIC', 'Тимур', 2),
    'card-timur': (TIM + 'IMG_2845.HEIC', 'Тимур', 2),
    'tr-sil-a': (W + '/full/t_2853_3.png', 'Тимур', 2),
    'tr-sil-b': (W + '/full/t_2853_8.png', 'Тимур', 2),
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
