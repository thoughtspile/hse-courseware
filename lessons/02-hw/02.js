// Объявляем через function, а не через =>, чтобы this брался из объекта-контекста
const format = function () {
  // В наклонных кавычках (``) в ES6 пишутся строки-шаблоны.
  // Внутри ${...} можно писать выражения, которые подставятся в строку.
  return `(${this.x},${this.y})`;
};

// Фабрика векторов (не конструктор, но возвращает объект)
const makeVec = (x, y) => {
  return {
    // Еще сахар: вместо key: key, можно писать просто key, и
    // по ключу "key" запишется переменная с именем key
    x,
    y,
    // format из родительской области видимости
    format,
  };
};

console.log(makeVec(0, 100).format());