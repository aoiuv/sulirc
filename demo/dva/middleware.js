const { green: title, log } = require("../../utils/log");
const NAMESPACE_SEP = "/";

function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

// const ret = compose(...[
//   a => a + '*',
//   b => b + '&'
// ])('{start}');

// log('ret', ret);

const array1 = ["a", "b", "c", "d"];
const reducer = (accumulator, currentValue) => {
  log("accumulator: ", accumulator);
  log("currentValue: ", currentValue);
  return accumulator + currentValue;
};

// 1 + 2 + 3 + 4
// console.log(array1.reduce(reducer));

const state = {
  count: 0
};

function dispatch(action, ...args) {
  title("dispatch");
  log(action, ...args);
}

function getState() {
  title("getState");
  log(state);
  return state;
}

function applyMiddleware(...middlewares) {
  return (reducer, ...args) => {
    const store = {
      dispatch,
      getState
    };
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args)
    };

    const chain = middlewares.map(middleware => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      dispatch
    };
  };
}

function createFooMiddleware() {
  return () => next => {
    log("next in foo");
    return action => {
      log("before foo");
      action = `Foo(${action})`;
      setTimeout(() => {
        next(action);
        log("after foo");
      }, 100);
    };
  };
}

function createBarMiddleware() {
  return () => next => {
    log("next in bar");
    return action => {
      log("before bar");
      action = `Bar(${action})`;
      next(action);
      log("after bar");
    };
  };
}

function createBazMiddleware() {
  return () => next => {
    log("next in baz");
    return action => {
      log("before baz");
      action = `Baz(${action})`;
      next(action);
      log("after baz");
    };
  };
}

const chain = [
  createFooMiddleware(),
  createBarMiddleware(),
  createBazMiddleware()
].map(middleware => middleware(null));
const composeDispatch = compose(...chain)(dispatch);

// => foo(bar())
// =>
composeDispatch("{data}");

// const enhancer = applyMiddleware(...[createFooMiddleware(), createBarMiddleware()]);

// const reducer = (state, action) => {
//   log("in reducer");
//   return state;
// };

// log(enhancer);
// log(enhancer(reducer));
// log(enhancer(reducer).dispatch("{action}"));

// ===========================
function createPromiseMiddleware(app) {
  return () => next => action => {
    const { type } = action;
    if (isEffect(type)) {
      return new Promise((resolve, reject) => {
        next({
          __dva_resolve: resolve,
          __dva_reject: reject,
          ...action
        });
      });
    } else {
      return next(action);
    }
  };

  function isEffect(type) {
    if (!type || typeof type !== "string") return false;
    const [namespace] = type.split(NAMESPACE_SEP);
    const model = app._models.filter(m => m.namespace === namespace)[0];
    if (model) {
      if (model.effects && model.effects[type]) {
        return true;
      }
    }

    return false;
  }
}
