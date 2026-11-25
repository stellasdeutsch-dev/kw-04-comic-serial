# Сжимает дамп для Figma: массивы вместо объектов, иконки в общую таблицу, штрихкоды и QR отдельными типами
import json, re, sys, hashlib
def hx(c):
    if not c or c == 'grad': return c
    s = '%02x%02x%02x' % tuple(round(v*255) for v in c[:3])
    return s if len(c) < 4 or c[3] >= .999 else s + '%02x' % round(c[3]*255)
icons = {}
def compact(path):
    d = json.load(open(path)); secs = []
    for S in d['sections']:
        N = []
        for n in S['nodes']:
            g = [round(n['cx']), round(n['cy']), round(n['w']), round(n['h'])]
            if n.get('rot'): g.append(n['rot'])
            t = n['t']
            if t == 'img':
                N.append(['i', g, n['n'], n.get('op', 1) if n.get('op', 1) < 1 else 0, n['blend'] if n.get('blend') not in (None, 'normal') else 0, n.get('clip') and [[round(a), round(b)] for a, b in n['clip']] or 0, n.get('alt') or 0])
            elif t == 'rect':
                N.append(['r', g, n.get('name') or 0, hx(n.get('bg')) or 0, hx(n.get('bc')) or 0, n.get('bw') or 0, round(n.get('rad') or 0), n.get('op', 1) if n.get('op', 1) < 1 else 0])
            elif t == 'svg':
                svg = n['svg']
                if svg.count('<rect') > 25 and 'preserveAspectRatio="none"' in svg:
                    N.append(['b', g, hx(n.get('stroke')) or 'ffffff']); continue
                if 'shape-rendering="crispEdges"' in svg:  # QR
                    key = 'qr'
                else:
                    key = None
                body = re.sub(r'\swidth="[\d.]+"\sheight="[\d.]+"', '', svg, count=1)
                key = key or hashlib.md5(body.encode()).hexdigest()[:8]
                if key not in icons: icons[key] = body
                N.append(['s', g, key])
            elif t == 'text':
                base = (hx(n['col']) if n['col'] != 'grad' else 'grad', n['fw'], n['fs'], n['fst'], n['ff'])
                segs = []
                for st, en, col, fw, fs, fst, ff in n['segs']:
                    v = (hx(col), fw, round(fs), fst, ff)
                    if v != (base[0], base[1], round(base[2]), base[3], base[4]): segs.append([st, en] + list(v))
                N.append(['t', g, n['text'], base[4], base[1], round(base[2], 1), base[3], round(n['lh'], 1), round(n['ls'], 2), n['al'], base[0], 1 if n.get('nowrap') else 0, segs or 0, n.get('tag')])
        secs.append([S['name'], S['x'], S['y'], S['w'], S['h'], hx(S.get('bg')) or 0, N])
    return {'w': d['width'], 'h': d['height'], 's': secs}
res = {f'{v}-{w}': compact(f'qa/figma/{v}-{w}.json') for v in ('en', 'tr') for w in (1440, 834, 390)}
json.dump(icons, open('qa/figma/icons.json', 'w'), ensure_ascii=False, separators=(',', ':'))
for w, r in res.items():
    json.dump(r, open(f'qa/figma/c-{w}.json', 'w'), ensure_ascii=False, separators=(',', ':'))
    print(w, len(json.dumps(r, ensure_ascii=False, separators=(',', ':'))), [ (s[0][:18], len(json.dumps(s, ensure_ascii=False, separators=(',', ':')))) for s in r['s']])
print('icons', len(icons), len(json.dumps(icons)))
