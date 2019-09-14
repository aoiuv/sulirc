// const OBJ = {
//   x: "Make",
//   y: "OBJ",
//   z: "Iterator",
//   *[Symbol.iterator]() {
//     for (let key of Object.keys(this)) {
//       yield this[key];
//     }
//   }
// };

// console.log(...OBJ);

let Queue = [];
function _promise(seed) {
  return new Promise((resolve, reject) => {
    const rand = Math.random() + seed;
    setTimeout(() => reject(rand), 2e3);
  });
}

function _async(seed) {
  return async () => await _promise(seed);
}

Queue = [_async(1), _async(3), _async(5)];

async function run() {
  for (let task of Queue) {
    let res;
    try {
      res = await task();
    } catch(err) {
      res = err;
    }
    console.log('task ---', res);
  }
}

run();
