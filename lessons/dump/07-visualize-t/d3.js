const values = o => Object.keys(o).map(k => o[k]);

fetch('/data.json')
  .then(res => res.json())
  .then(data => {
    const stops = values(data.stops);
    const routes = values(data.routes);
    routes.forEach(r => { r.color = '#' + Math.random().toString(16).slice(2,5); });

    const lat = stops.map(s => s.lat);
    const lon = stops.map(s => s.long);

    const latRange = d3.extent(lat);
    const lonRange = d3.extent(lon);
    const c = [ d3.mean(latRange), d3.mean(lonRange) ];
    console.log(latRange, c);

    const geoProjection = d3.geo.mercator()
      .scale(100000)
      .translate([250, 500])
      .center(c);

    d3.select('#mapid')
      .selectAll('circle')
      .data(values(data.stops))
      .enter()
        .append('circle')
        .attr('r', 3)
        .style('fill', 'red')
        .attr('cy', s => geoProjection([s.lat, s.long])[0])
        .attr('cx', s => geoProjection([s.lat, s.long])[1]);

    const trips = values(data.routes).reduce((ts, r) => ts.concat(values(r.trips)), []);
    const tripShapes = trips.map(t => t.shape).map(s => s.map(geoProjection));
    const linePlotter = d3.svg.line()
      .y(d => d[0])
      .x(d => d[1])
      .interpolate("linear");

    d3.select('#mapid')
      .selectAll('path')
      .data(tripShapes)
      .enter()
        .append('path')
        .attr('d', linePlotter)
        .style('fill', 'none')
        .style('stroke', 'red');
  });
