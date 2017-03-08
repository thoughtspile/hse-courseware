const values = o => Object.keys(o).map(k => o[k]);

fetch('/data.json')
  .then(res => res.json())
  .then(data => {
    const stops = values(data.stops);
    const routes = values(data.routes);
    routes.forEach(r => { r.color = '#' + Math.random().toString(16).slice(2,5); })

    const lat = stops.map(s => s.lat);
    const lon = stops.map(s => s.long);

    const latRange = d3.extent(lat);
    const lonRange = d3.extent(lon);
    const c = [ d3.mean(latRange), d3.mean(lonRange) ];

    const geoProjection = ([lat, lon]) => [
      (lat - latRange[0]) / (latRange[1] - latRange[0]) * 300 + 20,
      (lon - lonRange[0]) / (lonRange[1] - lonRange[0]) * 300 + 20,
    ];

    const linePlotter = arr => (
      `M ${arr.map(d => geoProjection(d).reverse().join(' ')).join(' L ')}`
    );

    new Vue({
      el: '#mapid',
      data: {
        routes,
        stops,
        pr: (pt) => geoProjection([pt.lat, pt.long]),
        linePlotter,
      },
    });
  });
