"""Собирает страницы из content.en.json и content.tr.json одной командой.
Пишет gh/en/ и gh/tr/ (обе с рекламой) и перенаправления: gh/index.html → en/, gh/lesson/ → en/, gh/en/lesson/ → en/, gh/tr/lesson/ → tr/.
Запуск: python3 tools/build.py
"""
import json, os, html
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GH = os.path.join(ROOT, 'gh')
ICON = ("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22%3E%3Crect width=%2224%22 height=%2224%22 rx=%225%22 fill=%22%23ee3b43%22/%3E"
        "%3Cpath d=%22M20 14v-1.6l-6.7-4V4.2a1.3 1.3 0 0 0-2.6 0v4.2L4 12.4V14l6.7-2v4l-1.8 1.3v1.5l3.1-.9 3.1.9v-1.5L13.3 16v-4z%22 fill=%22%23fff%22/%3E%3C/svg%3E")
PAGE = """<!doctype html>
<html lang="ru" data-version="{version}" data-base="{base}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{base}media/hero-bg.webp">
<meta name="theme-color" content="#000000">
<link rel="icon" href="{icon}">
<link rel="alternate" hreflang="ru" href="{other}">
<link rel="preload" href="{base}assets/fonts/OldStandardTT-n400-cyrillic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{base}assets/fonts.css">
<link rel="stylesheet" href="{base}assets/style.css">
<script>window.CONTENT = {data};</script>
<script src="{base}assets/sizes.js" defer></script>
<script src="{base}assets/qrcode.js" defer></script>
<script src="{base}assets/app.js" defer></script>
</head>
<body>
<div id="app"></div>
<noscript><p style="padding:24px">Для этой страницы нужен JavaScript.</p></noscript>
</body>
</html>
"""
REDIRECT = """<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><title>Один в поездке</title>
<meta http-equiv="refresh" content="0; url={to}"><link rel="canonical" href="{to}">
<script>location.replace({to_js} + location.hash);</script></head>
<body style="background:#000;color:#fff;font:16px sans-serif;padding:24px"><a style="color:#fff" href="{to}">Открыть страницу</a></body></html>
"""
def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, 'w', encoding='utf-8').write(text)
for lang in ('en', 'tr'):
    data = json.load(open(os.path.join(ROOT, f'content.{lang}.json'), encoding='utf-8'))
    blob = json.dumps(data, ensure_ascii=False).replace('</', '<\\/')
    meta = data['meta']
    other = '../tr/' if lang == 'en' else '../en/'
    for version, sub, base in (('ad', '', '../'),):
        write(os.path.join(GH, lang, sub, 'index.html'), PAGE.format(version=version, base=base, title=html.escape(meta['title']), desc=html.escape(meta['description']), icon=ICON, other=(base + other[3:]), data=blob))
write(os.path.join(GH, 'index.html'), REDIRECT.format(to='en/', to_js='"en/"'))
write(os.path.join(GH, 'lesson', 'index.html'), REDIRECT.format(to='../en/', to_js='"../en/"'))
for lang in ('en', 'tr'):
    write(os.path.join(GH, lang, 'lesson', 'index.html'), REDIRECT.format(to='../', to_js='"../"'))
print('ok: en, tr, redirects (/, /lesson/, /en/lesson/, /tr/lesson/)')
