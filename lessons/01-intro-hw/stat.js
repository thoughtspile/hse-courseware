const stat = (arr) => {
  const min = arr.reduce((acc, val) => Math.min(acc, val), Infinity);
  const max = arr.reduce((acc, val) => Math.max(acc, val), -Infinity);

  const sum = arr.reduce((acc, val) => acc + val, 0);
  const mean = sum / arr.length;

  return {
    min: min,
    max: max,
    mean: mean,
  };
};

module.exports = stat;
