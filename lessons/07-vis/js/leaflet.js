// Первичная настройка
// создаем карту в элементе с id=map
const map = L.map('map');
// центрируем на таких координатах, ставим зум 11
map.setView([55.8,49.15], 11);
// OpenStreetMap предоставляет карту-подложку бесплатно и без регистрации
map.addLayer(
  new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
);

fetch('/data.json')
  .then(r => r.json())
  .then(data => {
    // data.stops - объект (ключ-значение).
    // Object.values делает из него массив ЗНАЧЕНИЙ (только у массива есть forEach)
    Object.values(data.stops).forEach(s => {
      // Для каждой остановки создаём кружок..
      L.circleMarker([s.lat, s.long], { // с такими кооррдинатами...
        // и таким стилем:
        stroke: false,
        color: 'navy',
        fillOpacity: 0.8,
        radius: 5,
      }).addTo(map); // и добавляем на карту
    });
    // все остановки уже нарисованы!

    // Теперь маршруты
    // Тот же трюк с превращением объекта в массив значений
    Object.values(data.routes).forEach(r => {
      // Но дважды, потому что в каждом route есть ОБЪЕКТ trips
      Object.values(r.trips).forEach(t => {
        // создаем ломаную
        // функция принимает массив из пар координат: [[lat0, lon0], [lat1, lon1], ...]
        L.polyline(t.shape)
          .addTo(map); // и цепляем на карту
      });
    });
  });
