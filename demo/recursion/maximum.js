function maximum(list) {
  if (list.length === 0) {
    throw new Error("maximum of empty list");
  }

  if (list.length === 1) {
    return list[0];
  }

  return Math.max(list[0], maximum(list.slice(1)));
}

console.log(maximum([3, 4, 5, 10, 1]));
