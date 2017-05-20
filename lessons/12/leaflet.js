const map = L.map('mapid');
const canvasRenderer = L.canvas();
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
const toBoolMap = (arr, hash) => {
  const obj = {};
  for (var i = 0; i < arr.length; i++) {
    obj[hash(arr[i])] = true;
  }
  return obj;
};
const patchFeatures = (vFeatures, dataArr, patch, create, hash, map) => {
  vFeatures = vFeatures || {
    features: [],
    group: (new L.LayerGroup({ renderer: canvasRenderer })).addTo(map),
  };
  const group = vFeatures.group;
  const featureArr = vFeatures.features;

  const extraData = dataArr.length - vFeatures.features.length;
  for (let i = 0; i < extraData; i++) {
    const layer = create();
    group.addLayer(layer);
    featureArr.push(layer);
  }

  dataArr.forEach(d => {
    d.hash = hash(d);
  });
  const dataHashes = toBoolMap(dataArr, d => d.hash);
  const featureHashes = toBoolMap(featureArr, f => f._vFeatureId);
  const absentData = dataArr.filter(item => !featureHashes[item.hash]);
  const freeFeatures = [];
  featureArr.forEach(function(f) {
    if (!dataHashes[f._vFeatureId]) {
      freeFeatures.push(f);
    } else if (!group.hasLayer(f)) {
      group.addLayer(f);
    }
  });

  for (let i = 0; i < -extraData; i++) {
    const lastFree = freeFeatures.pop();
    group.removeLayer(lastFree);
  }
  // console.log('skip', dataArr.length - absentData.length);

  absentData.forEach((item, i) => {
    const layer = freeFeatures[i];
    layer._vFeatureId = item.hash;
    patch(layer, item);
    if (!group.hasLayer(layer)) {
      group.addLayer(layer);
    }
  });

  return vFeatures;
};
const includesPair = (arr, e1, e2) => {
  const L = arr.length;
  for (let i = 0; i < L; i++) {
    if (arr[i][0] === e1 && arr[i][1] === e2 || arr[i][1] === e2 && arr[i][0] === e1) {
      return true;
    }
  }
  return false;
}

// посчитать кластеры по остановкам
const computeClusters = (network, D) => {
  const stops = network.stops;
  const clusters = [];
  const findNearCluster = function(stop1) {
    for (let ic = 0; ic < clusters.length; ic++) {
      const clust = clusters[ic];
      if (d(clust.centroid, stop1) > 2 * D) continue;
      for (var i = 0; i < clust.stops.length; i++) {
        const stop2 = clust.stops[i];
        if (network.stopDistances[stop1.id][stop2.id] < D) {
          return clust;
        }
      }
    }
    return undefined;
  };

  for (let is = 0; is < stops.length; is++) {
    const stop1 = stops[is];
    const nearClust = findNearCluster(stop1);
    if (nearClust) {
      nearClust.stops.push(stop1);
    } else {
      clusters.push({ stops: [stop1], centroid: centroid([stop1]) });
    }
  }

  // accelerators
  for (let ic = 0; ic < clusters.length; ic++) {
    const c = clusters[ic];
    c.id = c.stops.map(s => s.id).sort().join(':');
  }

  return clusters;
};

const computeDistances = (stops) => {
  const cache = {};
  stops.forEach((stop) => {
    cache[stop.id] = {};
    stops.forEach((stop2) => {
      cache[stop.id][stop2.id] = d(stop, stop2);
    });
  });
  return cache;
};

const computeStopEdges = (routes) => {
  const stopEdges = [];
  routes.forEach((r) => {
    values(r.trips).forEach(t => {
      t.stops.slice(1).forEach((s, i) => {
        const prev = t.stops[i];
        if (!includesPair(stopEdges, prev, s)) {
          stopEdges.push([prev, s]);
        }
      });
    });
  });
  return stopEdges;
};

// полностью перерисовать карту
const renderNetwork = (network, map, options = {}) => {
  const clusters = computeClusters(network, options.D);

  renderClusters(clusters, map, options.D);

  // renderRoutes(routes.map(r => values(r.trips)[0]), map);
  renderClusterLinks(clusters, network, map);

  // сбросить выбранный кластер - его уже нет на карте
  renderActiveCluster(null, map);
}

// нарисовать связи меду кластерами
let clusterLinkFeatures = null;
const renderClusterLinks = (clusters, network, map) => {
  const clusterLinks = [];
  const stopIdToCluster = {};
  clusters.forEach((c, id) => {
    c.stops.forEach(stop => {
      stopIdToCluster[stop.id] = c;
    });
  });
  const pairHash = {};
  network.stopEdges.forEach(([fromId, toId]) => {
    const cFrom = stopIdToCluster[fromId];
    const cTo = stopIdToCluster[toId];

    const pairId = cFrom.id < cTo.id ? `${cFrom.id}:${cTo.id}` : `${cTo.id}:${cFrom.id}`;
    if (!pairHash[pairId]) {
      clusterLinks.push([cFrom, cTo]);
      pairHash[pairId] = true;
    }
  });
  const makeClusterLink = () => L.polyline([], { color: 'white', weight: 4 });
  const patchClusterLink = (f, link) => {
    const c0 = centroid(link[0].stops);
    const c1 = centroid(link[1].stops);
    f.setLatLngs([[c0.lat, c0.long], [c1.lat, c1.long]]);
  };
  clusterLinkFeatures = patchFeatures(
    clusterLinkFeatures,
    clusterLinks,
    patchClusterLink,
    makeClusterLink,
    l => `${l[0].id}:${l[1].id}`,
    map
  );
};

// Нарисовать все кластеры
let stopsOnMap = null;
const makeClusterMarker = () => L.circle([0, 0], { stroke: false, color: 'white' });
const renderClusters = (clusters, map, D) => {
  const patchClusterMarker = (f, cluster) => {
    const stop = centroid(cluster.stops); // Рисуем в центре кластера
    f.setLatLng(
      new L.LatLng(stop.lat, stop.long)
    ).setStyle({
      fillOpacity: cluster.stops.length < 3 ? 0.6 : 0.8,
    }).setRadius(
      100 + 30 * cluster.stops.length, // точку, размер которой показывает размер кластера
    ).on(
      'click',
      () => renderActiveCluster(cluster, map, D)
    ); // по клику на кластер показывем все остановки в нем
  };
  stopsOnMap = patchFeatures(
    stopsOnMap,
    clusters,
    patchClusterMarker,
    makeClusterMarker,
    c => c.id,
    map
  );
};

// Отрисовать остановки в выбранном кластере
const activeCluster = [];
const renderActiveCluster = (cluster, map, D) => {
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
    cluster.stops.filter(stop2 => {
      return d(stop, stop2) < D;
    }).forEach(stop2 => {
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
  const network = {
    stops,
    routes,
    stopEdges: computeStopEdges(routes),
    stopDistances: computeDistances(stops),
  };
  const clusterControl = document.getElementById('cluster-radius');
  clusterControl.addEventListener('input', () => {
    // получаем значение ползунка, управляющего размером кластера
    const clusterSize = Number(clusterControl.value);
    // перерисовываем маршруты
    renderNetwork(network, map, { D: clusterSize });
  });
};


fetch('/data.json') // Загружаем данные...
  .then(res => res.json()) // ...парсим как JSON...
  .then(data => startApp(data, map)); // ...и запускаем приложение с ними.
