const request = require('request');
const fs = require('fs');
const path = require('path');

const base64decode = (data) => new Buffer(data, 'base64').toString('utf-8');

function addSomeSugar(a) {
    if (!a)
        return "-";
    if (a.charAt(a.length - 1) + a.charAt(a.length - 2) + a.charAt(a.length - 3) == "key") {
        var b = base64decode("MEFiQ2RFZkdoSmtMbU9wcVJzVHVWVw==").split("")
          , c = base64decode("ITw+QCcjLiQlP14mKigpXy1dW317fA==").split("")
          , d = a.split("");
        d.length = d.length - 3;
        for (var e = d.length; e--; )
            for (var f = b.length; f--; )
                d[e] == c[f] && (d[e] = b[f]);
        return base64decode(d.join(""))
    }
    return a
}

const root = 'http://navi.kazantransport.ru';
const base = 'http://navi.kazantransport.ru/api/browser/getStopsInRect.php';

const getStopsInRect = (minlat, minlong, maxlat, maxlong) => {
  const qs = `minlat=${minlat}&minlong=${minlong}&maxlat=${maxlat}&maxlong=${maxlong}`;
  request({ url: root, jar: true }, () => {
    request({
      url: `${base}?${qs}`,
      headers: {
        'Referer': 'http://navi.kazantransport.ru',
      },
      jar: true,
    }, (err, res, body) => {
      const stops = JSON.parse(addSomeSugar(body));
      fs.writeFileSync(path.join(__dirname, 'stops.json'), JSON.stringify(stops, null, '  '));
    });
  });
};

const minlat = 55.59;
const maxlat = 55.90;
const minlong = 48.84;
const minlong = 49.40;
const step = .05;

getStopsInRect(55.59, 48.84, 55.90, 49.40);
