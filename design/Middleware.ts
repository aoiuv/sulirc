export function compose(...funcs: Function[]) {
  if (funcs.length === 0) {
    return (arg: any) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function reducer(a, b) {
    return function nextWrapper(...args: any[]) {
      return a(b(...args));
    };
  });
}

export function compose_(middlewares: Function[]) {
  return (context: any) => {
    if (middlewares.length === 0) {
      return context;
    }
    let i = 0;
    middlewares[0](context, next);
    return context;

    function next() {
      const func: Function = middlewares[i++];
      if (typeof func === 'function') {
        func(context, next);
      }
    }
  };
}
