import { composeAsync } from './AsyncMiddleware';

function delay(t: number) {
  return new Promise(r => setTimeout(r, t));
}

function t() {
  return Date.now();
}

function asyncFooMiddleware(next) {
  console.log('[fooMiddleware] trigger');
  return async function next_from_foo(action) {
    console.log('[fooMiddleware] before next', t());
    await delay(400);
    await next(action);
    console.log('[fooMiddleware] after next', t());
  };
}

function asyncBarMiddleware(next) {
  console.log('[barMiddleware] trigger');
  return async function next_from_bar(action) {
    console.log('[barMiddleware] before next', t());
    await delay(1000);
    await next(action);
    console.log('[barMiddleware] after next', t());
  };
}

function asyncBazMiddleware(next) {
  console.log('[bazMiddleware] trigger');
  return async function next_from_baz(action) {
    console.log('[bazMiddleware] before next', t());
    await next(action);
    await delay(500);
    console.log('[bazMiddleware] after next', t());
  };
}

function next(action: any) {
  console.log('[next]', action);
}

const fx = composeAsync(asyncFooMiddleware, asyncBarMiddleware, asyncBazMiddleware);
const dispatch = fx(next);

console.log('dispatch', dispatch);
dispatch('{hi}');
