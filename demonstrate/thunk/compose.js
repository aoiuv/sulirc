// module.exports = function compose(...funcs) {
//   if (funcs.length === 0) {
//     return arg => arg;
//   }

//   if (funcs.length === 1) {
//     return funcs[0];
//   }

//   return funcs.reduce((a, b) => (...args) => a(b(...args)));
// }

module.exports = function compose(...middlewares) {
  return ctx => {
    let index = 0;

    function next() {
      index++;
      const func = middlewares[index];
      if (func && typeof func === "function") {
        func(ctx, next);
      }
    }
    middlewares[0](ctx, next);
    return ctx;
  };
};
