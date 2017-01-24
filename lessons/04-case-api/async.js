// Функция из ядра js, которая вызывает функцию callback через timeout миллисекунд
// setTimeout(callback, timeout)
// Например, написать 'hello' в консоль через 2 секунды:
// setTimeout(() => console.log('hello'), 2000);

const N = 10;
const MS = 100;

// Обертываю каждый кейс в функцию, только чтобы потом вызвать по очереди а не впреремешку.
const fail = () => {
  console.log('FAIL');
  for (var i = 0; i < N; i++) {
    // все созданные функции ссылаются на одну и ту же переменную i, которая будет N после окончания цикла
    setTimeout(() => console.log('end', i), MS);
  }
};

const blockScoped = () => {
  console.log('WIN: block-scoped let & const');
  for (var i = 0; i < N; i++) {
    // const создает переменную, видимую только на текущей итерации
    const j = i;
    setTimeout(() => console.log('end', j), MS);
  }
};

const varIsNotBlockScopedFail = () => {
  console.log('FAIL: var is function-scoped, not block-scoped');
  for (var i = 0; i < N; i++) {
    // переменная, объявленная через var, общая для всей функции
    var j = i;
    setTimeout(() => console.log('end', j), MS);
  }
};

const parametrized = () => {
  console.log('WIN: not referencing external variable');
  // Здесть каждый .log(...) ссылается на свою копию переменной, полученную через параметр функции delay
  const delay = loc => setTimeout(() => console.log('end', loc), MS);
  for (var i = 0; i < N; i++) {
    delay(i);
  }
};

const forEach = () => {
  console.log('WIN: store each variable');
  // Нет общей переменной - нет проблем
  const data = [];
  for (var i = 0; i < N; i++) {
    data.push(i);
  }
  // Тут это кажется глупым, но в жизни мы часто ходим циклом не по числам, а по
  // данным, которые уже лежат в массиве.
  data.forEach(el => {
    setTimeout(() => console.log('end', el), MS);
  });
};

// Просто запустить по порядку
setTimeout(fail, 0);
setTimeout(blockScoped, MS * 2);
setTimeout(varIsNotBlockScopedFail, MS * 4);
setTimeout(parametrized, MS * 6);
setTimeout(forEach, MS * 8);

// Касается не только setTimeout, а любого создания функций в for (...) цикле:
//   - коллбеков для:
//     - запросов через request,
//     - асинхронной записи в файл через fs.writeFile,
//     - запросов к базе данных,
//     - и всех остальных
//   - обработчиков событий в веб-интерфейсе (функция, которую нужно вызвать при нажатии на кнопку).
