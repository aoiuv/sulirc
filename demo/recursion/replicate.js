function replicate(n, x) {
  if (n <= 0) {
    return [];
  }
  return [x].concat(replicate(n - 1, x));
}

console.log(replicate(9, "+"));
