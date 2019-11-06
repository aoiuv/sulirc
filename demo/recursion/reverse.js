function reverse(list) {
  if (list.length === 0) {
    return [];
  }
  return reverse(list.slice(1)).concat(list[0]);
}

console.log(reverse([1, 2, 3, 4, 5]));
