# Занятие 28.02.17. Фронтенд и визуализация.

- Сделали простую HTML-страницу
- Подняли локальный сервер и запустили наш сайт на нём
- Включили в HTML скрипты и стили
- Загрузили библиотеку из CDN через тег `<script>`
- Загрузили JSON-данные через API `fetch`
- Нарисовали геоданные на карте в Leaflet с подложкой из OpenStreetMaps
- Превратили данные в SVG библиотекой D3

## 1. Поднимаем локальный сервер

Конечно, html-файл можно открыть в браузере (как просто файл в программе). Адрес
будет выглядеть примерно как
`file:///Users/thoughtspile/Documents/buses/lessons/07-vis/index.html`. Но я предлагаю
развернуть локальный статический HTTP-сервер, чтобы рабочая среда была ближе к реальной.
Точнее:
- Доступ идет по протоколу http (`http://localhost`)
- Работают абсолютные ссылки (вида `/images/funny-puppy.jpg`). Если сервер работает
в папке `/Users/thoughtspile/dir`, то запрос вернёт файл
`/Users/toughtspile/dir/images/funny-puppy.jpg`
- JS-код cможет делать запросы к нашему серверу — нам это нужно для загрузки JSON-файла с данными.
- Применяется стандартный URL-рерайтинг: запрос к `localhost/page-1` вернет страницу `localhost/page-1/index.html`

Используем очень простой сервер из npm: `npm install --save http-server`.
Напишем в `package.json` консольную команду запуска сервера:
```json
{
  ...
  "scripts": {
    "dev": "http-server -c-1 ."
  }
  ...
}
```
Параметр `-c-1` отключает кеширование, чтобы, когда обновится файл, новая версия
сразу попала в браузер.

Ура, теперь сервер можно запустить через `npm run dev`. Если все прошло успешно,
то в браузере можно зайти на `localhost:8080` и посмотреть на свою папку.
Остановить сервер — `ctrl + c`.

## 2. HTML и ресурсы

Очень простая [страница](01-simple.html) с очень простым [скриптом.](js/simple.js)

## 3. Загружаем данные

Прежде чем визуализировать данные, сначала нужно как-то запихнуть их на страницу.
Конечно, можно как-то встроить их в HTML, но лучше сразу сделать нормально:
скриптом получить с нашего сервера JSON-файл `data.json`. Для этого используем
новое API fetch
```js
fetch('/data.json')
  .then(res => res.json())
  .then(
    data => console.log('DATA', data),
    err => console.error('ERROR', err)
  );
```
[js/log-data.js](js/log-data.js)

Обратите внимание на `then`: это промисы, другой способ работы с асинхронностью.
Если помните, в модуль `request` нужно было передать не только параметры запроса,
но и коллбек — функцию, которую нужно вызвать, когда на запрос пришел ответ. В
таком стиле `fetch` выглядел бы так:
```js
fetch('/data.json', (err, res) => {
  if (err) {
    // обработать ошибку fetch
    return;
  }
  res.json((err, data) => {
    if (err) {
      // обработать ошибку data.json
      return;
    }
    console.log(data);
  });
});
```
Здесь не только в два раза больше кода, но и сложнее обрабатывать ошибки. Каждый
уровень асинхронности добавляет один уровень вложенности.

Первый аргумент `then` — функция, которую нужно вызвать при успехе, второй — при ошибке.

Страница [02-log-data.html](02-log-data.html) с подключенным скриптом [js/log-data.js](js/log-data.js) загружает данные из
файла [data.json](data.json) и выводит их в консоль.

## 4. Leaflet: визуализация геоданных

Для начала попробуем нарисовать остановки и маршруты на карте. Используем библиотеку
[Leaflet](leafletjs.com). `fetch`-часть остается с прошлого раза.

Классические веб-карты состоят из *слоёв*. Сама карта отрисовывается на сервере и приходит в виде png-картинок 256х256 —  *raster tiles*. Данные рисуются поверх карты на фронте векторными слоями.

Страница: [03-leaflet.html](03-leaflet.html)
и скрипт: [js/leaflet.js](js/leaflet.js)

Это отличная библиотека для геоданных, но как только мы обработаем данные и уберем привязку к географии, рисовать их на карте станет бессмысленно (попробуйте наложить схему московского метро на карту города).

## 5. D3: преобразуем данные в SVG

[D3](d3js.org) — самая популярная js-библиотека для общей визуализации данных. По сравнению с лифлетом приходится писать много низкоуровневого кода, но зато можно сделать не только карту, а любое изображение!

D3 предназначена для интерактивной визуализации — если бы мы
хотели просто картинку, можно было бы нарисовать ее один раз и положить на сервер,
а не тянуть данные и библиотеку! При каждом изменении данных, возможно:
- добавились новые данные (группа `enter`),
- часть старых данных ушла (группа `exit`),
- некоторые данные изменились (группа `update`),
- а с какими-то ничего не произошло.

### Что нужно знать про SVG в вебе
- SVG-элементы живут внутри `<svg></svg>`.
- `<circle cx="20" cy="10" r="5" />` — окружность радиуса 5 с центром в `(20, 10)`
(координаты от левого верхнего угла).
- `<rect x="10" y="20" w="30" h="40" />` — прямоугольник размера `30x40` с левым верхним
углом в `(10, 20)`.
- `<path d="M 10 10 L 20 20 L 30 40" />` — кривая. Атрибут `d` работает как
программа для черепашки:
  - `M 10 10` — пойти в точку `(10, 10)`.
  - `L 20 20` — провести линию в точку `(20, 20)`.
Можно не просто соединять точки отрезками, а добавить хитрую интерполяцию.

Наконец, страница [04-d3.html](04-d3.html) и скрипт [js/d3.js](js/d3.js). Выглядит так себе, но если постараться получше, в d3 можно сделать вообще что угодно: посмотрите на этот [сборник примеров](https://github.com/d3/d3/wiki/Gallery)!
