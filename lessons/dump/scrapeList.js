const request = require('request');
const fs = require('fs');
const path = require('path');

request({
  url: 'http://transport.orgp.spb.ru/Portal/transport/routes/list',
  method: 'POST',
  headers: {
    'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
  },
  body: 'sEcho=1&iColumns=11&sColumns=id%2CtransportType%2CrouteNumber%2Cname%2Curban%2CpoiStart%2CpoiFinish%2Ccost%2CforDisabled%2CscheduleLinkColumn%2CmapLinkColumn&iDisplayStart=0&iDisplayLength=1000&sNames=id%2CtransportType%2CrouteNumber%2Cname%2Curban%2CpoiStart%2CpoiFinish%2Ccost%2CforDisabled%2CscheduleLinkColumn%2CmapLinkColumn&iSortingCols=1&iSortCol_0=2&sSortDir_0=asc&bSortable_0=true&bSortable_1=true&bSortable_2=true&bSortable_3=true&bSortable_4=true&bSortable_5=true&bSortable_6=true&bSortable_7=true&bSortable_8=true&bSortable_9=false&bSortable_10=false&transport-type=0&transport-type=46&transport-type=2&transport-type=1'
}, (err, res, body) => console.log(body));

// scrape();
