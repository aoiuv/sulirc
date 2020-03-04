
/**
 * Middleware Playground
 */
function next(action: any) {
  console.log('[next]', action);
}

function fooMiddleware(next) {
  console.log('[fooMiddleware] trigger');
  return function next_from_foo(action) {
    console.log('[fooMiddleware] before next');
    next(action);
    console.log('[fooMiddleware] after next');
  };
}

function barMiddleware(next) {
  console.log('[barMiddleware] trigger');
  return function next_from_bar(action) {
    console.log('[barMiddleware] before next');
    next(action);
    console.log('[barMiddleware] after next');
  };
}

function bazMiddleware(next) {
  console.log('[bazMiddleware] trigger');
  return function next_from_baz(action) {
    console.log('[bazMiddleware] before next');
    next(action);
    console.log('[bazMiddleware] after next');
  };
}

// const chain = Middleware.compose(fooMiddleware, barMiddleware, bazMiddleware);
// const nextChain = chain(next);
// console.log('nextChain', nextChain);
// nextChain("{data}");

const fx = [fooMiddleware, barMiddleware, bazMiddleware].reduce((a, b) => {
  return (...args) => a(b(...args));
});
fx(next)('{yay}');