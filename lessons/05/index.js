
var vue = new Vue({
  el: '#app',
  data: {
    delivType: 'shop',
    shops: [
      { name: 'Москва, Тверская 15' },
      { name : 'Сыктывкар, Ленина 10' },
      { name : 'Сыктывкар, Ленина 20' },
    ],
  },
});

setTimeout(() => {
  vue.shops.push({ name: 'ПРИВЕТ' });
}, 10000);
