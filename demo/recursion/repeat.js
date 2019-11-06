function repeat(a, n) {
  let i = 0;
  let result = [];

  while (i++ < n) {
    result.push(a);
  }
  return result;
}

function repeat(a, n) {
  if (!Array.isArray(a)) {
    a = [a];
  }
  if (n === 1) {
    return a;
  }
  
  return repeat(a.concat(a[0]), n - 1);
}

console.log(repeat("+", 9));
