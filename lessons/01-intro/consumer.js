// Чтобы импортировать не node-модуль, а свой файл, пишем относительный путь
const fileReader = require('./fileReader.js');

// fileReader экспортирует функцию -- вызовем ее.
fileReader();
