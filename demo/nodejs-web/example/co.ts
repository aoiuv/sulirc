import co from 'co';

const debug = require('debug')('web');

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

co(function*() {
  yield* a();
});
