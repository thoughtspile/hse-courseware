const request = require('request');
const cheerio = require('cheerio');

// Селектор: ссылки во втором столбце таблицы класса wikitable
const selector = 'table.wikitable td:nth-child(2) a';
const url = 'https://en.wikipedia.org/wiki/Madrid_Metro';

// Запрашиваем страницу, затем парсим через cheerio
request(url, (err, res, body) => {
  const $ = cheerio.load(body);
  const arr = [];

  $(selector)
    .each(function () {
      // "href" -- атрибут элемента "a", достаем его так:
      const href = $(this).attr('href');
      // текст ссылки -- названия конечных станций через тире:
      const text = $(this).text();
      // используем деструктуризацию: <String>.split(<separator>) возвращает массив,
      // кладем первый элемент в start, а второй в end.
      const [start, end] = text.split('–');

      // Записываем в массив с результатом
      arr.push({start, end, href});
    });

  // записать не в консоль, а в файл можете сами.
  console.log(arr);
});
