// импортируем нужные модули
// Этот модуль установлен через npm
const request = require('request');
// Это встроенный модуль node
const fs = require('fs');

// асинхронно запрашиваем страницу по url.
request(
  'http://orenbus.ru/points/view/281/',
  // когда приходит ответ, вызывается функция (callback) из второго параметра.
  // В node первый параметр колбека обычно флаг ошибки.
  (err, res, body) => {
    // для  request второй параметр коллбека -- ответ с кучей ненужных метаданных.
    // нам нужно только тело, которое лежит в третьем параметре

    // используем регэксп (https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/match)
    // берем первый элемент массива, потому что он достает кусок строки в скобках (.*)
    const match = body.match(/point_obj=(.*);/)[1];

    // записываем результат в файл
    fs.writeFileSync(__dirname + '/stop.json', match);
  }
);
