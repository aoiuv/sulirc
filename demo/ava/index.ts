import test from 'ava';

test('foo', t => {
  t.pass();
});

test('bar', async t => {
  const bar = Promise.resolve('bar');

  t.is(await bar, 'bar');
});

test('1 + 1 = 2', t => {
  let result: number = 2;
  t.is(1 + 1, result);
});