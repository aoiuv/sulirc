// function* makeRangeIterator(start = 0, end = Infinity, step = 1) {
//   for (let i = start; i < end; i += step) {
//     yield i;
//   }
// }
// const it = makeRangeIterator(1, 5, 2);

// it.next(); // {value: 1, done: false}
// it.next(); // {value: 3, done: false}
// it.next(); // {value: undefined, done: true}


function* getCudeSize() {
  const width = 5;
  const depth = 10;
  const height = yield width;

  return width * height * depth;
}

const getHeightByWidth = w => w * 1.6;
const it = getCudeSize();
const { value: width } = it.next();
const { value: size } = it.next(getHeightByWidth(width));

console.log(size);