function quicksort(list) {
  if (list.length === 0) {
    return [];
  }
  let x = list[0];
  let rest = list.slice(1);

  let smallerSorted = quicksort(LE(x, rest));
  let biggerSorted = quicksort(GT(x, rest));

  return [smallerSorted, x, biggerSorted].flat();
}

function LE(x, list) {
  let result = [];
  for (let i = 0; i < list.length; i++) {
    list[i] <= x && result.push(list[i]);
  }
  return result;
}

function GT(x, list) {
  let result = [];
  for (let i = 0; i < list.length; i++) {
    list[i] > x && result.push(list[i]);
  }
  return result;
}

console.log(quicksort([3, 1, 2, 4, 12, 56, 8, 9, -2]));
