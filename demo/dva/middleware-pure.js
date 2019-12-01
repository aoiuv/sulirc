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
  console.log('HANDLER next', action);
}

const fooMdw = next => {
  console.log("MDW -> foo next");
  return action => {
    console.log("MDW -> foo action before");
    next(action);
    console.log("MDW -> foo action after");
  };
};

const barMdw = next => {
  console.log("MDW -> bar next");
  return action => {
    console.log("MDW -> bar action before");
    next(action);
    console.log("MDW -> bar action after");
  };
};

const bazMdw = next => {
  console.log("MDW -> baz next");
  return action => {
    console.log("MDW -> baz action before");
    next(action);
    console.log("MDW -> baz action after");
  };
};

const chain = compose(fooMdw, barMdw, bazMdw);
// 请从函数堆栈上理解，压栈和弹栈的过程
chain(next)('{data}');