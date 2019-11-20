// error!
function* demoIterator() {
  yield 1;
  setTimeout(() => {
    yield 2;
  }, 1);
  yield 3;
  return 4;
}

const it = demoIterator();

// console.log(it.next());
// console.log(it.next());

// for(let v of it) {
//   console.log(v);
// }
