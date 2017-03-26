
const obj = {
  x: 10,
  'y': 20,
  'hello-denis': 12,
};
const y = [1, 2];
y.hello = 12;
y.push(100);
console.log(y[2])

// y.forEach(x => console.log(x));
// obj.forEach(x => console.log(x));

const keys = Object.keys(obj);
console.log(keys);
keys.forEach((key) => console.log(obj[key]));

const b = obj['x'];
const a = obj.x;
const key = 'x';
const c = obj[key];



// методы массива

const arr = [1, 2, 3, 100];
const mapped = arr.map(x => x * 2);
const forEached = arr.forEach(x => x * 2);
const filtered = arr.filter(x => x < 2);
console.log(mapped, forEached, filtered);

const reduced = arr.reduce((a, x) => a * x, 1);
console.log(reduced);

const hasOne = arr.some(x => x === 1);
const allPos = arr.every(x => x > 0);


// === / ==
console.log(1 == 1, 1 === '1', 1 == '1', {} == {});

const f1 = function (x) { return x * 2; }
console.log(f1(10))
const f2 = function (x) { x * 2; }
console.log(f2(10))
const f3 = (x) => { x * 2; };
console.log(f3(10));
const f4 = (x) => x * 2;
console.log(f4(10));
const f5 = x => x * 2;
console.log(f5(10));

console.log(
  [2, 3, 4].map(
    function (x) { return x * 2; }
  )
);

//
const data = {
  routes: [1, 2],
  stops: [3, 4],
};
// console.log(stops);

const arr2 = [ 12 ];
console.log(arr2['0']);
console.log(Object.keys(arr2));

const obj2 = {
  0: 12,
  1: 120,
  2: 1200,

  forEach(cb) {
    Object.keys(this).forEach(key => cb(this[key], key));
  }
};
obj2.forEach(el => console.log(el));
function forEach(obj, cb) {
  Object.keys(obj).forEach(key => cb(obj[key], key));
}
forEach(obj2, el => console.log(el));
