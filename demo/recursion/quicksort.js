function quicksort(list) {
  if (list.length === 0) {
    return [];
  }
  let x = list[0];
  let rest = list.slice(1);

  let smallerSorted = quicksort(rest.filter(i => i <= x));
  let biggerSorted = quicksort(rest.filter(i => i > x));

  return [smallerSorted, x, biggerSorted].flat();
}

console.log(quicksort([3, 1, 2, 4, 12, 56, 8, 9, -2]));
