function fetch(t = 200) {
  return new Promise(r => setTimeout(() => r(`data-${t}`), t));
}

function* generator() {
  yield 'begin';
  const data = yield fetch(300);
  console.log('get', data);
  yield 'after';
  return 'finish';
}

const gen = generator();

console.log(gen.next());

gen.next().value.then(v => {
  console.log('resolve', v);
  console.log(gen.next(v));
  console.log(gen.next());
});
