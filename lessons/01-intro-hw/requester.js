const request = require('request');
const fs = require('fs');

fs.readFile(__dirname + '/urls.json', (err, data) => {
  const urls = JSON.parse(data);

  urls.forEach((url, i) => {
    request(url, (err, res, body) => {
      const fname = __dirname + '/pages/' + i + '.html';
      fs.writeFile(, body, () => {
        console.log('OK', url);
      })
    });
  });
});
