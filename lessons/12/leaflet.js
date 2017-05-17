const map = L.map('mapid');
map.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'));

// Получить все значения из объекта
const values = o => Object.keys(o).map(k => o[k]);
// Найти среднее значение массива чисел
const mean = arr => arr.reduce((a, val) => a + val, 0) / arr.length;
// Евклидова метрика - расстояние между двумя точками вида { lat, long }
const d = (s1, s2) => (
  Math.sqrt(Math.pow(s1.lat - s2.lat, 2) + Math.pow(s1.long - s2.long, 2))
);
// Центр массива точек вида [...{ lat, long }...]
const centroid = clust => ({
  lat: mean(clust.map(stop => stop.lat)),
  long: mean(clust.map(stop => stop.long)),
});
// Удалить все лифлет-объекты из featureArr с лифлет-карты map и очистить featureArr
const clearFeatures = (featureArr, map) => {
  featureArr.forEach(f => f.removeFrom(map));
  featureArr.length = 0;
};

// посчитать кластеры по остановкам
const computeClusters = (stops, D) => {
  const clusters = [];
  stops.forEach(stop1 => {
    const nearClust = clusters.find(clust =>
      clust.stops.some(stop2 => d(stop1, stop2) < D)
    );
    if (nearClust) {
      nearClust.stops.push(stop1);
    } else {
      clusters.push({ stops: [stop1] });
    }
  });
  clusters.forEach(c => {
    c.routes = c.stops.reduce((a, stop) => a.concat(stop.routes), []);
  });
  return clusters;
}

// полностью перерисовать карту
const renderNetwork = (stops, routes, map, options = {}) => {
  const clusters = computeClusters(stops, options.D);

  renderClusters(clusters, map);

  // renderRoutes(routes.map(r => values(r.trips)[0]), map);
  renderClusterLinks(clusters, map);

  // сбросить выбранный кластер - его уже нет на карте
  renderActiveCluster(null, map);
}

// нарисовать связи меду кластерами
const renderClusterLinks = (clusters, map) => {
  const clusterLinks = [];
  clusters.forEach(c => {
    clusters
      .filter(c2 => c.routes.some(r => c2.routes.includes(r)))
      .forEach(c2 => clusterLinks.push([c, c2]));
  });
  clusterLinks.forEach(link => {
    const c0 = centroid(link[0].stops);
    const c1 = centroid(link[1].stops);
    const line = [[c0.lat, c0.long], [c1.lat, c1.long]];
    stopsOnMap.push(L.polyline(line, { color: 'white', weight: 1 }).addTo(map));
  });
};

// Нарисовать все кластеры
const stopsOnMap = [];
const renderClusters = (clusters, map) => {
  clearFeatures(stopsOnMap, map);
  clusters.forEach(cluster => {
    const stop = centroid(cluster.stops); // Рисуем в центре кластера
    const marker = L.circleMarker([stop.lat, stop.long], {
      stroke: false,
      fillOpacity: 0.8,
      radius: cluster.stops.length, // точку, размер которой показывает размер кластера
      color: 'white',
    })
    .addTo(map)
    .on('click', () => renderActiveCluster(cluster, map)); // по клику на кластер показывем все остановки в нем
    stopsOnMap.push(marker); // сохраняем, чтобы удалить при перерисовке
  });
};

// Отрисовать остановки в выбранном кластере
const activeCluster = [];
const renderActiveCluster = (cluster, map) => {
  clearFeatures(activeCluster, map);
  if (!cluster) return;
  // для каждой остановки в кластере
  cluster.stops.forEach(stop => {
    // Рисуем точку на месте остановки
    activeCluster.push(L.circleMarker([stop.lat, stop.long], {
      stroke: false,
      fillOpacity: 0.8,
      radius: 1,
      color: 'black',
    }).addTo(map));
    // и соединяем со всеми остальными остановками кластера
    cluster.stops.forEach(stop2 => {
      const shape = [[stop.lat, stop.long], [stop2.lat, stop2.long]];
      activeCluster.push(L.polyline(shape, {
        color: 'red',
        weight: 1,
      }).addTo(map));
    });
  });
};

// Рисование маршрута
const routesOnMap = [];
const renderRoutes = (routeShapes, map) => {
  clearFeatures(routesOnMap, map);
  routeShapes.forEach(s => {
    routesOnMap.push(L.polyline(s.shape, { color: 'white' }).addTo(map));
  });
};

// По массиву остановок найти центр прямоугольника, в который они все влезают
const calculateViewportCenter = (stops) => {
  const lat = stops.map(s => s.lat);
  const lon = stops.map(s => s.long);
  const ll = [
    lat.reduce((a, v) => Math.min(a, v), Infinity),
    lon.reduce((a, v) => Math.min(a, v), Infinity),
  ];
  const ur = [
    lat.reduce((a, v) => Math.max(a, v), -Infinity),
    lon.reduce((a, v) => Math.max(a, v), -Infinity),
  ];
  return [ (ll[0] + ur[0]) / 2, (ll[1] + ur[1]) / 2 ];
};

// Запустить приложение
const startApp = (data, map) => {
  const routes = values(data.routes);
  // в каждую остановку подкладываем:
  Object.keys(data.stops).forEach(k => {
    const stop = data.stops[k];
    // ее id
    stop.id = Number(k);
    // и массив из проходящих через нее маршрутов
    stop.routes = routes.filter(r => values(r.trips).some(t => t.stops.includes(stop.id)));
  });
  // в data данные лежат в объекте. переложим в массив.
  const stops = values(data.stops);
  // распологаем карту так, чтобы остановки были видны
  map.setView(calculateViewportCenter(stops), 11);

  // привязываем отрисовку к интерфейсу
  const clusterControl = document.getElementById('cluster-radius');
  clusterControl.addEventListener('input', () => {
    // получаем значение ползунка, управляющего размером кластера
    const clusterSize = Number(clusterControl.value);
    // перерисовываем маршруты
    renderNetwork(stops, routes, map, { D: clusterSize });
  });
};


fetch('/data.json') // Загружаем данные...
  .then(res => res.json()) // ...парсим как JSON...
  .then(data => startApp(data, map)); // ...и запускаем приложение с ними.
