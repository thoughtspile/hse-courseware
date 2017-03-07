fetch('/data.json')
  .then(r => r.json())
  .then(data => {
    const sel = d3.select('#map')
      .selectAll('circle')
      .data(Object.values(data.stops));
    const lats = Object.values(data.stops).map(s => s.lat);
    const longs = Object.values(data.stops).map(s => s.long);

    const latExt = d3.extent(lats);
    const lonExt = d3.extent(longs);
    const ratio = (lonExt[1] - lonExt[0]) / (latExt[1] - latExt[0]);

    const sLat = x => 300 - (x - latExt[0]) / (latExt[1] - latExt[0]) * 300 / ratio + 20;
    const sLon = x => (x - lonExt[0]) / (lonExt[1] - lonExt[0]) * 300 + 20;

    sel.enter()
      .append('circle')
      .attr('r', 1)
      .attr('cy', s => sLat(s.lat))
      .attr('cx', s => sLon(s.long));

    const trips = Object.values(data.routes).reduce(
      (a, r) => a.concat(Object.values(r.trips)),
      []
    ).map(t => t.shape);
    const linePlotter = d3.svg.line()
      .y(d => sLat(d[0]))
      .x(d => sLon(d[1]))
      .interpolate("linear");

    d3.select('#map')
      .selectAll('path')
      .data(trips)
      .enter()
        .append('path')
        .style('fill', 'none')
        .style('stroke', 'blue')
        .attr('d', linePlotter);
  });
