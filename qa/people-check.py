"""Проверяет, что на /en/ только Диас, а на /tr/ только Тимур (по gh/media/PEOPLE.md и картинкам в content.*.json)."""
import json, re, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
who = {}
for line in open(os.path.join(ROOT, 'gh/media/PEOPLE.md')):
    m = re.match(r'\| (\S+)\.webp \| (.+?) \| (Диас|Тимур) \|', line)
    if m: who[m.group(1)] = (m.group(3), m.group(2))
def imgs(o):
    if isinstance(o, dict):
        for k, v in o.items():
            if k in ('img', 'photo', 'silhouette', 'person', 'peekLeft', 'peekRight', 'peek', 'objTop', 'objBottom', 'bg', 'newspaper', 'shot', 'pill', 'laptop', 'plane') and isinstance(v, str): yield v
            else: yield from imgs(v)
    elif isinstance(o, list):
        for v in o: yield from imgs(v)
bad = 0
for v, need, folder in (('en', 'Диас', '~/dias/shared/dias-photos-web'), ('tr', 'Тимур', '')):
    C = json.load(open(os.path.join(ROOT, f'content.{v}.json')))
    used = sorted(set(imgs(C)))
    people = [u for u in used if u in who]
    wrong = [u for u in people if who[u][0] != need]
    src_bad = [u for u in people if v == 'en' and not (who[u][1].startswith('~/dias/shared/dias-photos-web') or who[u][1].startswith('~/dias/dias photos'))] + \
              [u for u in people if v == 'tr' and not who[u][1].startswith('~/dias/timur-video/')]
    print(f'{v}: картинок с людьми {len(people)}, все {need}: {not wrong}, источник из папки автора: {not src_bad}')
    if wrong or src_bad: print('  ошибки:', wrong, src_bad); bad += 1
sys.exit(bad)
