function zip(list1, list2) {
  if (list1.length === 0) {
    return [];
  }
  if (list2.length === 0) {
    return [];
  }
  return [[list1[0], list2[0]]].concat(zip(list1.slice(1), list2.slice(1)));
}

console.log(zip([1, 2, 3], ["a", "b", "c"]));
