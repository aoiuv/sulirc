function compose_1(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

function compose_2(...mdws) {
  return ctx => {
    function next() {
      const mdw = mdws.shift();
      mdw && mdw(ctx, next);
    }
    mdws.shift()(ctx, next);
    return ctx;
  };
}

function compose_3(...mdws) {
  return () => {
    function next() {
      const mdw = mdws.shift();
      mdw && mdw(next);
    }
    mdws.shift()(next);
  };
}

module.exports = {
  compose_1,
  compose_2,
  compose_3
};
