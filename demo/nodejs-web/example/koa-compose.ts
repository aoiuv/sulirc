import co from 'co';
import compose from 'koa-compose';

const debug = require('debug')('web');

console.log('ha?');

function* a() {
  debug('before a');
  yield* b();
  debug('after a');
}

function* b() {
  debug('before b');
  yield* c();
  debug('after b');
}

function* c() {
  debug('c');
}

const stack = [a, b, c];
const ret = co(compose(stack));

ret.then(r => {
  r.next();
});

debug(ret);
