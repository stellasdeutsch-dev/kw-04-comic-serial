---
name: verify
description: Собрать и проверить сайт №04 перед коммитом: локальный сервер, Playwright на 1440/834/390, ссылки покупки.
---

# Проверка сайта №04

1. Если менялись картинки: `python3 tools/media.py` (пишет `gh/media/*.webp` и `gh/assets/sizes.js`).
2. Сервер: `python3 -m http.server 8704 --directory gh` (в фоне).
3. Прогон: `node qa/shoot.mjs http://localhost:8704/ 1440,834,390`.
   Норма: у всех шести страниц `scrollWidth` равен ширине, `broken: []`, `errors: []`, на главной ровно две разные ссылки lava.top, на `/lesson/` ни одной.
4. Скриншоты блоков: `node qa/sections.mjs 390` (и 834, 1440), смотреть `qa/shots/sec-*`.
5. Тексты: `grep -n "[—–]" gh/content.js` должен быть пустым (тире запрещены).
6. После пуша: `gh api repos/stellasdeutsch-dev/kw-04-comic-serial/pages/builds/latest --jq .status` = `built`, обе ссылки отвечают 200.
Звук не включать, Playwright запускается с `--mute-audio`.
