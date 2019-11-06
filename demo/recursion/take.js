function take(n, list) {
  if (n <= 0) {
    return [];
  }

  if (list.length === 0) {
    return [];
  }

  return [list[0]].concat(take(n - 1, list.slice(1)));
}

console.log(take(3, [3, 4, 5, 6, 8, 1]));
