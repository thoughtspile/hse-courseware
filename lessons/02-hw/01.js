const reduce = (arr, fn, init) => {
  let val = init;
  for (let i = 0; i < arr.length; i++) {
    val = fn(val, arr[i], i, arr);
  }
  return val;
};

const prod = reduce([1, 2, 3], (acc, val) => acc * val, 1);
console.log('product', prod);

const sum = reduce([1, 2, 3], (acc, val) => acc + val, 0);
console.log('sum', sum);
