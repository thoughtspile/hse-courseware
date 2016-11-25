// ** области видимости и замыкания **

let x = 12;

// Функция имеет доступ к своим аргументам...
const sum = (a, b) => {
  return a + b;
};

// и всем переменным из области видимости, в которой она объявлена:
const addX = (a) => {
  // Например, sum и x:
  return sum(a, x);
};

console.log(addX(8)); // получается 8 + 12 === 20

// Внутри функции ссылка на переменную, то есть значения меняются везде:
x = -8;
console.log(addX(8)); // теперь 0


// Напишем функцию высшего порядка:
const makeLogger = (start) => {
  // В этой области видимости есть start.
  // Создадим еще одну функцию:
  const logger = (end) => {
    // Тут есть start из аргументов makeLogger и end из новых аргументов.
    // Выведем их:
    console.log(start + end);
  };
  // Вернем функцию, которая выводит start и свой аргумент:
  return logger;
};

// Например, logHello(arg) -- функция, которая пишет в консоль 'hello, <arg>'
const logHello = makeLogger('hello, ');
logHello('mr. Mentor'); // hello, mr. Mentor!
logHello('dear students'); // hello, dear students


// Теперь что-то менее синтетическое.
const secInHour = 60 * 60; // 3600 секунд в часу
const hours = [1, 10, 60]; // хотим перевести эти часы в секунды
const seconds = hours.map(h => {
  // secInHour не нужно передавать аргументом!
  return secInHour * h;
});
console.log(hours, '->', seconds)

// Более того, напишем скалярное умножение:
const scalarProd = (n, vec) => {
  return vec.map(el => {
    // n берется из родительской области видимости
    return n * el;
  });
};
console.log(scalarProd(3, [100, 200, 300]));
