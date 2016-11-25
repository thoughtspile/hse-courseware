// ** this в function **

const obj = {
  x: 12,
  log: function () {
    // Кроме аргументов и переменных из области видимости в функции доступен
    // this -- ссылка на объект, в котором функция вызвана как метод.
    // Здесь this -- obj
    console.log('this:', this);
    console.log('this.x:', this.x);
  },
};

// this появляется только когда мы вызываем функцию как метод объекта:
obj.log();

// Попробуем вынуть ее из объекта и вызвать отдельно:
const freeLogger = obj.log;
freeLogger();
// Значение this в свободной функции зависит от версии / реализации js, но ничего хорошего точно не произойдет


// ** this в стрелочных функциях **

const vkPageLister = {
  root: 'www.vk.com/',
  getUserPages: function(userIds) {
    // Как принято в js, хотим создать функцию и применить к массиву.
    this.arr.forEach(function(el) {
      // О нет! Поскольку мы вызываем эту функцию не как метод объекта, this не такой как надо
      // console.log(this);
      console.log(this.root + el);
    });

    // Решение: стрелочная функция наследует this из родительской области видимости
    this.arr.forEach((el) => {
      console.log(this.root + el);
    });

    // Еще одно решение -- из времен, когда стрелочных функций не было.
    const that = this;
    this.arr.forEach(function(el) {
      console.log(that.root + el);
    });
  },
};

// С другой стороны, стрелочную функцию нельзя сделать методом объекта
const selfLogger = {
  logSelf: () => console.log(this),
};
selfLogger.logSelf(); // Ой!
// Эту досадную пролему мы разрещим на следующем занятии
