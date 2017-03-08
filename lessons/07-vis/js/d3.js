// Да, d3 очень низкоуровневый и сложный.

fetch('/data.json')
  .then(r => r.json())
  .then(data => {
    // Низкоуровневые развлечения: нужно спроецировать координаты из широты и долготы...
    const lats = Object.values(data.stops).map(s => s.lat);
    const longs = Object.values(data.stops).map(s => s.long);
    const latExt = d3.extent(lats);
    const lonExt = d3.extent(longs);
    const ratio = (lonExt[1] - lonExt[0]) / (latExt[1] - latExt[0]);

    // В координаты от 20 до 720 (просто числа из головы, которые влезут на экран)
    // В результате создаем две функции: одна проецирует широту,
    const sLat = x => (1 - (x - latExt[0]) / (latExt[1] - latExt[0])) * (700 / ratio) + 20;
    // вторая - долготу
    const sLon = x => (x - lonExt[0]) / (lonExt[1] - lonExt[0]) * 700 + 20;
    console.log(latExt, lonExt, ratio);


    // Создаем d3 selection - набор элементов страницы, которые сейчас изображают наши данные
    // выбираем все <circle> внутри элемента с id=map
    const sel = d3.select('#map').selectAll('circle') // (сейчас их нет)
      .data(Object.values(data.stops)); // связываем с данными об остановках

    sel.enter() // enter-группа выборки - данные, для которых еще нет элементов
      .append('circle') // прицепляем <circle>
      .attr('r', 3) // радиус 3 для любой отсановки
      .attr('cy', s => sLat(s.lat)) // координата по y = проекция долготы
      .attr('cx', s => sLon(s.long)); // а по х = проекция широты

    // эти три строки собирают один большой массив, который содержит все трипы
    // всех маршрутов
    const trips = Object.values(data.routes).reduce(
      (a, r) => a.concat(Object.values(r.trips)),
      []
    ).map(t => t.shape); // из каждого трипа возьмем только трассировку

    // line - очень полезная функция d3, которая создает атрибут d элемента path
    // из массива координат
    const linePlotter = d3.svg.line()
      // не забываем спроецировать
      .y(d => sLat(d[0]))
      .x(d => sLon(d[1]))
      .interpolate("linear"); // попробуйте basis или bundle - линии сгладятся
    // linePlotter - функция, которая принимает массив координат и выплевывает
    // строку вида "M 0 0 L 1 2 L 3 4" (черепашья программа для SVG-кривой)

    d3.select('#map').selectAll('path')
      .data(trips)
      .enter() // до этого места аналогично остановкам
        .append('path') // но прицепляем <path> вместо <circle> для каждого маршрута
        .style('fill', 'none') // по умолчанию внутренность <path> закрашивается
        .style('stroke', '#88f') // сам путь делаем синим
        .attr('d', linePlotter); // атрибут d делаем из элемента trips генератором путей
  });
