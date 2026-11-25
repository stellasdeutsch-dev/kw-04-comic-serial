---
name: verify
description: Собрать и проверить сайт №04 перед коммитом: локальный сервер, Playwright на 1440/834/390, ссылки покупки.
---

# Проверка сайта №04

0. Собрать страницы: `python3 tools/build.py`.
1. Если менялись картинки: `python3 tools/media.py` (пишет `gh/media/*.webp` и `gh/assets/sizes.js`).
2. Сервер: `python3 -m http.server 8704 --directory gh` (в фоне).
3. Прогон: `node qa/shoot.mjs http://localhost:8704/ 1440,834,390`.
   Норма: у всех шести страниц `scrollWidth` равен ширине, `broken: []`, `errors: []`, на `/en/` одна ссылка Dias English, на `/tr/` одна Alterna Timur, мини-тест проходится. Перенаправления: `/`, `/lesson/`, `/en/lesson/` ведут на `/en/`, `/tr/lesson/` на `/tr/`. Люди: `python3 qa/people-check.py`.
4. Скриншоты блоков: `node qa/sections.mjs 390` (и 834, 1440), смотреть `qa/shots/sec-*`.
5. Тексты: `grep -n "[—–]" content.en.json content.tr.json` должен быть пустым (тире запрещены). Ссылки: в `gh/en/` только `2c950aa0`, в `gh/tr/` только `2cdbb9f8`.
6. После пуша: `gh api repos/stellasdeutsch-dev/kw-04-comic-serial/pages/builds/latest --jq .status` = `built`, обе ссылки отвечают 200.
Звук не включать, Playwright запускается с `--mute-audio`.
