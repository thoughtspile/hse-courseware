// Импортируем встроенный модуль node
const fs = require('fs');

// node кладет в __dirname путь, по которому запущен скрипт
const path = __dirname + '/data.json';

// module.exports можно присвоить что угодно.
// require(<path>) в другом файле получает это значение.
module.exports = () => {
  // readFileSync возвращает не строку, а буфер (оптимизационные трюки)
  const buff = fs.readFileSync(path);
  // '' + <Buffer> пытается сделать конкатенацию строк, и для этого конвертирует буфер в строку -- то что надо.
  console.log('' + buff);
};
