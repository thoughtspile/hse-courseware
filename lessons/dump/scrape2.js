const request = require('request');
const fs = require('fs');
const path = require('path');

let csrf = null;
const j = request.jar();

const scrape = () => {
  const url = `https://yandex.ru/maps/api/search?csrfToken=${csrf}&text=%D1%82%D1%80%D0%B0%D0%BC%D0%B2%D0%B0%D0%B9+31&lang=ru_RU&ll=37.5019548385613%2C55.80927096775866&host_config%5Bh`;
  request({
    url,
    jar: j,
  }, (err, res, body) => {
    console.log(body);
    // console.log(JSON.stringify(JSON.parse(body), null, 2));
  });
};

request({
  url: 'https://maps.yandex.ru',
  jar: j,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
  }
}, (err, res, body) => {
  csrf = body.match(/csrfToken":"([a-z0-9:]*)"/)[1];
  console.log(j);
  scrape();
});

// scrape();
