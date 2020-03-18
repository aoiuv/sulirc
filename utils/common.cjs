const map = {
  H: 'Helo',
  S: 'Soul',
  Q: 'Question'
};

const reverseMap = Object.keys(map).reduce((memo, k) => {
  const v = map[k];
  return {
    ...memo,
    [v]: k
  };
}, {});

console.log('map', map);
console.log('reverseMap', reverseMap);
