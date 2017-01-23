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
const base = 'http://navi.kazantransport.ru/api/browser/getRoute.php';

const ids = [ 17, 27, 133 ];
const dname = path.join(__dirname, 'routes');

const getRoute = () => {
  const id = ids.pop();
  const qs = `mr_id=${id}`;
  request({
    url: `${base}?${qs}`,
    headers: { 'Referer': 'http://navi.kazantransport.ru' },
    jar: true,
  }, (err, res, body) => {
    const route = JSON.parse(addSomeSugar(body));
    fs.writeFileSync(path.join(dname, `${id}.json`), JSON.stringify(route, null, '  '));
    console.log(`OK, ${ids.length} left`);
    if (ids.length) {
      setTimeout(getRoute, 10000);
    }
  });
};

request({ url: root, jar: true }, getRoute);
