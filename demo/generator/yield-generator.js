function* createNumberIterator() {
  yield 1;
  yield 2;
  return 3;
}

function* createColorIterator() {
  yield 'red';
  yield 'green';
  yield 'blue';
}

function* createCombinedIterator() {
  const result = yield *createNumberIterator();
  yield result;
  console.log('result', result);
  yield *createColorIterator();
}

for(let v of createCombinedIterator()) {
  console.log(v);
}

function* createCharIterator(str) {
  yield *str;
}

for(let v of createCharIterator("hello")) {
  console.log(v);
}