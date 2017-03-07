const request = require('request');
const fs = require('fs');
const path = require('path');

const IDS = [27, 133];
const routeFiles = [
  IDS.map(id => fs.readFileSync(__dirname + `/${id}.json`))
]


const result = {
  routes: {},
  stops: {},
};

routeFiles.forEach(routeStr => {
  console.log(routeStr);
  const route = JSON.parse(routeStr);
  Object.keys(route.stops).forEach(key => {
    result.stops[key] = {
      lat: route.stops[key].lat,
      long: route.stops[key].long,
      title: route.stops[key].title,
    };
  });
  const routeId = route.num;
  result.routes[route.num] = {
    id: route.number,
    trips: {
      A: {
        stops: route.stopsList.straight.map(stop => stop.id),
        shape: route.lines.A
      },
      B: {
        stops: route.stopsList.reverse.map(stop => stop.id),
        shape: route.lines.B
      }
    }
  };
});
const resJson = JSON.stringify(result, null, '  ')
fs.writeFileSync('data.json', resJson);
