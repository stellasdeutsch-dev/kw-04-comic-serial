/*
  Сайт №04 «Один в поездке». Все тексты, ссылки, картинки и порядок блоков здесь.
  Блок можно убрать, повторить или переставить в массиве blocks.
  ad: true значит блок есть только на главной (с рекламой), на /lesson/ его нет.
  В текстах можно <b>жирное</b> (акцент цветом) и <br>.
  Картинки лежат в media/. Пути без "media/" писать не надо.
*/
window.CONTENT = {
  meta: {
    lang: 'ru',
    title: 'Один в поездке. Фразы на английском и турецком',
    description: 'Гайд-сериал: три ситуации в поездке и фразы, которые их решают. Английский и турецкий.'
  },

  // Ссылки. Все кнопки покупки берут ссылку отсюда.
  links: {
    dias: 'https://app.lava.top/products/2c950aa0-d8be-4317-8f39-0f9b4016f5da',
    timur: 'https://app.lava.top/products/2cdbb9f8-e65b-443e-8d2c-4fea4c121e41',
    // ЗАГЛУШКА: впиши свой ник и ссылку на инстаграм. По ней же строятся QR-коды.
    social: { label: 'ИНСТАГРАМ', url: 'https://www.instagram.com/' }
  },

  // Серии в шапке и подвале. active: true значит серия есть на этой странице.
  episodes: [
    { top: 'Аэропорт', bottom: 'серия 1', img: 'ep-01', active: true, href: '#ep1' },
    { top: 'Отель', bottom: 'серия 1', img: 'ep-02', active: true, href: '#ep2' },
    { top: 'Кафе', bottom: 'серия 1', img: 'ep-03', active: true, href: '#ep3' },
    { top: 'Такси', bottom: 'скоро', img: 'ep-04' },
    { top: 'Аптека', bottom: 'скоро', img: 'ep-05' },
    { top: 'Рынок', bottom: 'скоро', img: 'ep-06' },
    { top: 'Банк', bottom: 'скоро', img: 'ep-07' },
    { top: 'Врач', bottom: 'скоро', img: 'ep-08' },
    { top: 'Вокзал', bottom: 'скоро', img: 'ep-09' },
    { top: 'Магазин', bottom: 'скоро', img: 'ep-10' },
    { top: 'Ресторан', bottom: 'скоро', img: 'ep-11' },
    { top: 'Друзья', bottom: 'скоро', img: 'ep-12' }
  ],

  // Вкладки «СЕРИЯ N». href пустой значит серия ещё не вышла.
  tabs: [
    { label: 'СЕРИЯ 1', href: '#ep1', current: true },
    { label: 'СЕРИЯ 2' }, { label: 'СЕРИЯ 3' }, { label: 'СЕРИЯ 4' }, { label: 'СЕРИЯ 5' }, { label: 'СЕРИЯ 6' }
  ],

  blocks: [
    {
      type: 'hero',
      topline: ['гайд', 'сериал', 'для', 'тех', 'кто', 'едет', 'один'],
      title1: 'ОДИН', small: 'в', title2: 'ПОЕЗДКЕ',
      subtitle: ['ГАЙД-СЕРИАЛ ПРО ФРАЗЫ', 'ДЛЯ ПОЕЗДКИ ОДНОМУ'],
      badge: 'ОСНОВАНО НА РЕАЛЬНЫХ ПОЕЗДКАХ',
      card: 'Серия коротких историй: <b>одна ситуация</b> и <b>фраза, которая её решает</b>. На английском и турецком.',
      note: 'БЕЛОЕ ОБЛАЧКО ПО-АНГЛИЙСКИ,<br>БЕЖЕВОЕ ПО-ТУРЕЦКИ',
      noteSmall: 'сохрани скриншот, чтобы фразы были<br>под рукой в дороге',
      ticker: ['ФРАЗЫ В ДОРОГУ', 'СЕРИЯ 1'],
      media: {
        bg: 'hero-bg', person: 'dias-hero', newspaper: 'newspaper',
        peekLeft: 'timur-peek-left', peekRight: 'timur-peek-right',
        objTop: 'passport', objBottom: 'boarding-pass'
      }
    },

    { type: 'tabs' },

    {
      type: 'comic', id: 'ep1', title: 'ЧЕМОДААААН!!!',
      rows: [
        { panels: [
          { img: 'c1-1', alt: 'Тимур идёт по набережной с телефоном', grow: 1,
            bubble: { lang: 'en', text: 'Excuse me, where is baggage claim?', ru: 'Простите, где выдача багажа?', x: 14, y: 52 } }
        ], h: 236 },
        { panels: [
          { img: 'c1-2', alt: 'Тимур в тёмных очках', grow: 36, mark: '?',
            bubble: { lang: 'en', text: 'My suitcase didn’t arrive.', ru: 'Мой чемодан не прилетел.', x: 30, y: 66, small: true } },
          { img: 'c1-3', alt: 'Диас с другом делают селфи на улице', grow: 64,
            bubble: { lang: 'tr', text: 'Bavulum gelmedi.', ru: 'Мой чемодан не прилетел.', x: 60, y: 70 } }
        ], h: 250 },
        { panels: [
          { img: 'c1-4', alt: 'Тимур у белой стены смотрит в сторону', grow: 34 },
          { img: 'c1-5', alt: 'Диас у окна с ноутбуком', grow: 66,
            caption: { text: 'Чемодан не прилетел. Иди к стойке Lost&nbsp;&amp;&nbsp;Found и <b>покажи багажную бирку</b>', side: 'right', accent: 'green' },
            barcode: 'BAG TAG _ 0417' }
        ], h: 280 }
      ]
    },

    {
      type: 'comic', id: 'ep2', topSpace: true,
      rows: [
        { panels: [
          { img: 'c2-1', alt: 'Тимур с планшетом, вид через плечо', grow: 33,
            caption: { text: 'В отеле говорят, что <b>брони на твоё имя нет</b>', side: 'left' } },
          { img: 'c2-2', alt: 'Диас ночью у собора Святого Петра', grow: 33,
            bubble: { lang: 'en', text: 'I booked a room for three nights.', ru: 'Я бронировал номер на три ночи.', x: 12, y: 58 } },
          { img: 'c2-3', alt: 'Диас ночью на набережной', grow: 34,
            bubble: { lang: 'tr', text: 'Üç gece için oda ayırttım.', ru: 'Я бронировал номер на три ночи.', x: 10, y: 58 } }
        ], h: 280 },
        { panels: [
          { img: 'c2-4', alt: 'Тимур занимается на планшете', grow: 49,
            bubble: { lang: 'en', text: 'Could you check again, please?', ru: 'Проверьте ещё раз, пожалуйста.', x: 16, y: 56 } },
          { img: 'c2-5', alt: 'Тимур у белой стены улыбается', grow: 51,
            caption: { text: 'Бронь нашлась. <b>Ключ у тебя в руке</b>', side: 'left' } }
        ], h: 236 }
      ]
    },

    {
      type: 'scene', img: 'house-night', alt: 'Кирпичный дом ночью в гирляндах, снег и луна',
      figures: [ { img: 'silhouette-timur', x: 48, w: 13 }, { img: 'silhouette-dias', x: 60, w: 10 } ],
      bubbles: [
        { lang: 'en', text: 'Is breakfast included?', ru: 'Завтрак входит?', x: 33, y: 64 },
        { lang: 'tr', text: 'Kahvaltı dahil mi?', ru: 'Завтрак входит?', x: 60, y: 46 }
      ]
    },

    {
      type: 'comic', id: 'ep3',
      rows: [
        { panels: [
          { img: 'c3-1', alt: 'Диас с чашкой кофе', grow: 48, color: true,
            caption: { text: 'Утром идёшь в кафе и <b>заказываешь сам</b>', side: 'left' } },
          { img: 'c3-2', alt: 'Тимур на набережной с пальмами', grow: 52,
            bubble: { lang: 'en', text: 'A black coffee, please.', ru: 'Чёрный кофе, пожалуйста.', x: 50, y: 70 } }
        ], h: 280 },
        { panels: [
          { img: 'c3-3', alt: 'Пицца на столе в кафе', grow: 1 },
          { img: 'c3-4', alt: 'Завтрак в кафе', grow: 1 },
          { img: 'c3-5', alt: 'Задание на планшете', grow: 1 },
          { img: 'c3-6', alt: 'Диас в кафе с напитком', grow: 1 },
          { img: 'c3-7', alt: 'Тимур улыбается на улице', grow: 1 }
        ], h: 168 },
        { panels: [
          { img: 'c3-8', alt: 'Диас за столиком в кафе', grow: 50,
            bubble: { lang: 'en', text: 'Can I get the bill, please?', ru: 'Можно счёт?', x: 8, y: 76 } },
          { img: 'c3-9', alt: 'Тимур у стены с ноутбуком', grow: 50 }
        ], h: 300 },
        { panels: [
          { img: 'c3-big', alt: 'Тимур в тёмных очках на набережной', grow: 1,
            bubble: { lang: 'tr', text: 'Hesap, lütfen!', ru: 'Счёт, пожалуйста!', x: 62, y: 40, big: true } }
        ], h: 345 }
      ]
    },

    /* ---------- Реклама (только на главной) ---------- */
    {
      type: 'search', ad: true,
      lead: 'Три ситуации ты уже прошёл. <b>Остальные разобраны на платформах</b>',
      query: 'как заговорить на английском или турецком',
      engine: 'Поиск в «Google»',
      adLabel: 'Реклама',
      adText: 'Английский с Диасом и турецкий с Тимуром. <b>От A0 до C1</b>',
      adHref: '#offers',
      note: '*жмёшь на ссылку и смотришь, что внутри',
      user: { name: 'Ты', sub: 'один в поездке', img: 'ep-03' },
      laptop: 'laptop'
    },
    {
      type: 'browser', ad: true,
      url: 'app.lava.top',
      left: { word: 'DIAS', color: 'pink', img: 'strip-roma', href: 'dias' },
      right: { word: 'TIMUR', color: 'green', img: 'strip-palms', href: 'timur' },
      labelLeft: 'ДИАС<br>И ТИМУР', labelRight: 'ОТ A0<br>ДО C1',
      big1: 'SELF', big2: ['ST', 'DY'], cupLetter: 'U',
      button: { text: 'ВЫБРАТЬ<br>ПЛАТФОРМУ', href: '#offers' },
      silhouette: 'silhouette-timur'
    },
    {
      type: 'paths', ad: true,
      heading: ['ДВА ПУТИ,', 'ВЫБЕРИ СВОЙ'],
      pill: 'pill',
      path1: { title: 'ПУТЬ 1', text: '<b>Турецкий</b> с Тимуром:<br>128 гайдов по грамматике<br>и 131 блок лексики', href: 'timur' },
      path2: { title: 'ПУТЬ 2', text: '<b>Английский</b> с Диасом:<br>дорожная карта по неделям<br>от A0 до C1', href: 'dias' }
    },
    {
      type: 'speakers', ad: true,
      heading: ['MEET THE', 'AUTHORS'],
      items: [
        { img: 'speaker-dias', name: ['ДИАС', 'АНГЛИЙСКИЙ'], role: 'АВТОР DIAS ENGLISH', text: 'Вырос в Казыгурте,<br><b>учится в Sapienza</b> в Риме', href: 'dias' },
        { img: 'speaker-timur', name: ['ТИМУР', 'ТУРЕЦКИЙ'], role: 'АВТОР ALTERNA TIMUR', text: 'Разбирает турецкий<br><b>как на канале</b>, от A0 до C1', href: 'timur' },
        { img: 'speaker-you', name: ['ТЫ', 'В ДОРОГЕ'], role: 'ГЛАВНЫЙ ГЕРОЙ', text: 'Переводчик не успевает<br>за разговором. <b>Учишь сам</b>', href: '#offers', dark: true }
      ]
    },
    {
      type: 'gallery', ad: true, id: 'inside-dias', color: 'pink',
      title: 'ВНУТРИ DIAS ENGLISH',
      sub: 'Курс английского в Notion. Настоящие скриншоты с ноутбука и телефона.',
      stats: [
        { n: '210+', t: 'гайдов по грамматике' },
        { n: '170+', t: 'гайдов по лексике с озвучкой' },
        { n: '700+', t: 'книг, фильмов, аудио и экзаменов' },
        { n: '30 €', t: 'один раз, доступ навсегда' }
      ],
      rows: [
        [ { img: 'shot-d-hub', grow: 62, cap: 'Главная уровня: навигация, ресурсы и таймер' },
          { img: 'shot-d-roadmap-m', grow: 38, cap: 'Дорожная карта: 45 до 60 минут в день, 5 дней в неделю', top: true } ],
        [ { img: 'shot-d-lexika', grow: 1, cap: 'Lexika: слова по темам с картинками' },
          { img: 'shot-d-gemini', grow: 1, cap: 'Gemini: ситуации для разговора с ИИ' },
          { img: 'shot-d-habits', grow: 1, cap: 'Трекер: минуты и привычки по дням' } ],
        [ { img: 'shot-d-grammar', grow: 1, cap: 'Грамматика по темам, от A0 до C1' },
          { img: 'shot-d-materials', grow: 1, cap: 'Архив: книги, фильмы и аудио по уровням' } ]
      ],
      href: 'dias', cta: 'Купить Dias English за\u00a030\u00a0€'
    },
    {
      type: 'gallery', ad: true, id: 'inside-timur', color: 'green',
      title: 'ВНУТРИ ALTERNA TIMUR',
      sub: 'Турецкий от A0 до C1. Каждая тема разобрана как на канале.',
      stats: [
        { n: '128', t: 'гайдов по грамматике' },
        { n: '131', t: 'блок лексики по темам' },
        { n: '109', t: 'интерактивных ресурсов' },
        { n: '32', t: 'блока по экзаменам' },
        { n: '36', t: 'гайдов по работе' },
        { n: '1716', t: 'материалов по уровням' }
      ],
      rows: [
        [ { img: 'shot-t-home', grow: 62, cap: 'Главная A0 до A2: разделы и подборка ресурсов' },
          { img: 'shot-t-b1', grow: 38, cap: 'Уровни B1 до C1 отдельной страницей' } ],
        [ { img: 'shot-t-themes', grow: 1, cap: 'Лексика по темам: то, что реально говорят' },
          { img: 'shot-t-doctor', grow: 1, cap: 'Диалоги по ситуациям, например у врача' },
          { img: 'shot-t-kids', grow: 1, cap: 'Словарь и карточки' } ],
        [ { img: 'shot-t-podcasts', grow: 1, cap: 'Подкасты, фильмы и сериалы по уровням' } ]
      ],
      href: 'timur', cta: 'Купить Alterna Timur за\u00a030\u00a0€'
    },
    {
      type: 'frame', ad: true,
      heading: ['ВСЁ', 'В ОДНОМ', 'МЕСТЕ!'],
      sub: 'Скриншоты настоящие.<br>Метки показывают, что где',
      bg: 'mantel', shot: 'shot-t-roadmap-m', shotAlt: 'Маршрут Alterna от нуля до свободного турецкого',
      labels: [
        { x: 56, y: 6, title: 'Маршрут', text: 'от нуля до свободного<br>турецкого' },
        { x: 58, y: 34, title: 'Ступени', text: 'A1, A2, B1, B2, C1' },
        { x: 4, y: 52, title: 'Ты:)', you: true },
        { x: 56, y: 64, title: 'Сроки', text: 'у каждой ступени свои' }
      ],
      phone: { img: 'shot-d-roadmap-m', alt: 'Дорожная карта Dias English A0 и A1 на телефоне', rec: 'REC' }
    },
    {
      type: 'offers', ad: true, id: 'offers',
      cards: [
        { color: 'green', photo: 'card-timur', tag: ['Тимур', 'Alterna, от A0 до C1'], kicker: 'ALTERNA TIMUR',
          big1: 'ТУРЕЦКИЙ', script: 'с', big2: 'НУЛЯ', meta: ['30 € один раз', 'Доступ навсегда'],
          forWhom: 'Едешь в Турцию, любишь сериалы, нужен экзамен или уже живёшь там',
          list: ['128 гайдов по грамматике', '131 блок лексики по темам', '32 блока по экзаменам A1 до C1', '1716 материалов по уровням'],
          href: 'timur', cta: 'Купить за\u00a030\u00a0€', plane: 'airplane' },
        { color: 'pink', photo: 'card-dias', tag: ['Диас', 'Dias English, от A0 до C1'], kicker: 'DIAS ENGLISH',
          big1: 'АНГЛИЙСКИЙ', script: 'с', big2: 'НУЛЯ', meta: ['30 € один раз', 'Доступ навсегда'],
          forWhom: 'Школьникам перед экзаменами, тем, кто едет учиться за границу, и тем, кто учил годами и молчит',
          list: ['Дорожные карты A0 до C1', '210+ гайдов по грамматике', 'Lexika: 170+ гайдов с озвучкой', 'Практика с ИИ в Gemini'],
          href: 'dias', cta: 'Купить за\u00a030\u00a0€' }
      ],
      box: { title: ['ДВЕ ПЛАТФОРМЫ,', 'ПО 30 € КАЖДАЯ'], items: [ { text: '«DIAS ENGLISH»', href: 'dias' }, { text: '«ALTERNA TIMUR»', href: 'timur' } ] },
      tickets: [
        { color: 'green', name: ['ТИМУР', 'ALTERNA'], tariff: 'ТАРИФ', lines: 'ПОЗДРАВЛЯЕМ!<br>ТУРЕЦКИЙ ОТ A0 ДО C1<br>ОТКРЫТ НАВСЕГДА', price: '30 €', when: 'НАВСЕГДА', href: 'timur', silhouette: 'silhouette-timur' },
        { color: 'black', name: ['ДИАС', 'ENGLISH'], tariff: 'ТАРИФ', lines: 'ПОЗДРАВЛЯЕМ!<br>АНГЛИЙСКИЙ ОТ A0 ДО C1', price: '30 €', when: 'НАВСЕГДА', href: 'dias' }
      ]
    },
    /* ---------- конец рекламы ---------- */

    {
      type: 'continued',
      title: ['TO BE', 'CONTINUED...'],
      bg: 'taxi-night',
      bubbles: [
        { lang: 'en', text: 'See you in the next episode!', ru: 'Увидимся в следующей серии!', x: 54, y: 4 },
        { lang: 'tr', text: 'Görüşürüz!', ru: 'Увидимся!', x: 78, y: 34 },
        { lang: 'en', text: 'Taxi!', ru: 'Такси!', x: 66, y: 50, small: true }
      ],
      text: 'Следующие серии: такси, аптека и рынок.<br>Следи за новыми рилсами',
      hint: 'новые серии<br>в соцсетях'
    },

    {
      type: 'footer',
      ticker: ['ФРАЗЫ В ДОРОГУ', 'СЕРИЯ 1'],
      title: ['СЛЕДИ В ИНСТАГРАМ', 'ЗА НОВЫМИ СЕРИЯМИ'],
      text: 'И подписывайся, если хочешь <b>следующие серии</b> раньше всех: такси, аптека, рынок и ещё <em>девять ситуаций в дороге</em>',
      peek: 'timur-peek-footer', bg: 'hero-bg'
    }
  ]
};
