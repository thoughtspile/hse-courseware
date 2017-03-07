const request = require('request');
const fs = require('fs');
const path = require('path');

const scrape = () => {
  const url = 'http://navi.kazantransport.ru/api/browser/getRoute.php?mr_id=27';
  request({
    url,
    jar: true,
    headers: {
      'Referer': 'http://navi.kaztransport.ru/main.php',
    },
  }, (err, res, body) => {
    console.log(body);
  });
};

request({
  url: 'http://navi.kazantransport.ru/',
  jar: true,
  headers: {
    'Referer':'http://navi.kazantransport.ru/main.php',
  },
}, () => scrape());

// scrape();
