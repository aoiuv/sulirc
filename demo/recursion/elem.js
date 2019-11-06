function elem(a, list) {
  if (list.length === 0) {
    return false;
  }
  if (a === list[0]) {
    return true;
  }

  return elem(a, list.slice(1));
}

console.log(elem(3, [1, 3, 6]));
console.log(elem(0, [1, 3, 6]));
