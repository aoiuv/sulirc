function fetch(prefix) {
  return new Promise(r => {
    setTimeout(() => {
      const data = `${prefix}#${Math.random()}`;
      console.log('resolve', data);
      r(data);
    }, 500);
  });
}

function* iterator() {
  yield fetch('A');
  yield fetch('B');
  yield fetch('C');
  yield fetch('D');
}

const is = {
  undef: v => v === null || v === undefined,
  notUndef: v => v !== null && v !== undefined,
  func: f => typeof f === 'function',
  number: n => typeof n === 'number',
  string: s => typeof s === 'string',
  array: Array.isArray,
  object: obj => obj && !is.array(obj) && typeof obj === 'object',
  promise: p => p && is.func(p.then),
};

function run(taskDef) {
  let task = taskDef();

  let result = task.next();
  function step() {
    if (!result.done) {
      if (is.promise(result.value)) {
        result.value.then(v => {
          result = task.next(v);
          step();
        });
      } else {
        result = task.next(result.value);
        step();
      }
    }
  }

  step();
}

run(iterator);
