const map = L.map('mapid');
map.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'));

const values = o => Object.keys(o).map(k => o[k]);

fetch('/data.json')
  .then(res => res.json())
  .then(data => {
    const stops = values(data.stops);
    const routes = values(data.routes);
    routes.forEach(r => { r.color = '#' + Math.random().toString(16).slice(2,5); })
    console.log(routes)

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
    const center = [ (ll[0] + ur[0]) / 2, (ll[1] + ur[1]) / 2 ];

    map.setView(center, 12);

    stops.forEach(stop => {
      L.circleMarker([stop.lat, stop.long], {
        stroke: false,
        fillOpacity: 0.8,
        radius: 10
      }).addTo(map);
    });

    routes.forEach(r => {
      values(r.trips).forEach(t => L.polyline(t.shape, {color: r.color}).addTo(map));
    });
  });
