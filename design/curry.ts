function curry(f: Function) {
  const argsNum = f.length;
  let _args = [];
  return function acc(...args: any) {
    _args = _args.concat(args);
    if (_args.length < argsNum) {
      return acc;
    }
    if (_args.length >= argsNum) {
      return f(..._args);
    }
  };
}

function add(x: number, y: number, z: number) {
  return x + y + z;
}

const add3 = curry(add)(3);
console.log(add3(4, 5));