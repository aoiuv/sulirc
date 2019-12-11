function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

function next(action) {
  console.log('[next]', action);
}

const fooMdw = next => {
  console.log('[middleware] foo next');
  return action => {
    console.log('[middleware] foo action before');
    next(action);
    console.log('[middleware] foo action after');
  };
};
// fooMdw.t = '[foo]';

const barMdw = next => {
  console.log('[middleware] bar next');
  return action => {
    console.log('[middleware] bar action before');
    next(action);
    console.log('[middleware] bar action after');
  };
};
// barMdw.t = '[bar]';

const bazMdw = next => {
  console.log('[middleware] baz next');
  return action => {
    console.log('[middleware] baz action before');
    next(action);
    console.log('[middleware] baz action after');
  };
};
// bazMdw.t = '[baz]';

/**
 * compose sequence
 */
const chain = compose(fooMdw, barMdw, bazMdw);
// compose f = (...args) => foo(bar(...args))
// compose g = (...args) => f(baz(...args))
// ========
const nextChain = chain(next);
// pass in `next` args
// tigger mdw sequence: baz -> bar -> foo
// ========
// baz: next_from_baz = (action) => { ... next(action) ... };
// bar: next_from_bar = (action) => { ... next_from_baz(action) ... };
// foo: next_from_foo = (action) => { ... next_from_bar(action) ... };
// ========
// nextChain = next_from_foo
console.log('==============================');
nextChain('{data}');
// dispatch action
// trigger next_from_foo until its next -> next_from_bar
// trigger next_from_bar until its next -> next_from_baz
// trigger next_from_baz until its next -> next (i.e. origin next fn)
// trigger next
// return from next, resume next_from_baz
// return from next_from_baz, resume next_from_bar
// return from next_from_bar, resume next_from_foo
// all finish
