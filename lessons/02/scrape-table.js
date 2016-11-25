// Эти модули хорошо нам знакомы
const request = require('request');
const fs = require('fs');
// cheerio позволяет работать с деревом html под нодой -- например, искать элементы по селектору
const cheerio = require('cheerio');

// Запросим страницу cheerio на гитхабе
request('https://github.com/cheeriojs/cheerio', (err, res, body) => {
  // Чтобы работать со страницой, загрузим ее
  const $ = cheerio.load(body);
  // В этот массив будем класть найденные элементы
  const arr = [];

  // Найти имена всех файлов по селектору. Возвращает не js-массив, а объект...
  $('td .js-navigation-open')
    // ...в котором есть, например, метод each -- аналог <Array>.forEach(<callback>)
    .each(function () {
      // причем текущий элемент мы получаем не аргументом, а в виде this
      // Поэтому тут нельзя писать стрелочную функцию
      arr.push($(this).text()); // сложим текст элемента, подходящего под селектор, в массив
    });

  // Теперь в массиве лежит содержимое всех элементов, подходящих под селектор
  // Сериализуем их в JSON и запишем в файл.
  fs.writeFileSync(__dirname + '/stops.json', JSON.stringify(arr));
});
