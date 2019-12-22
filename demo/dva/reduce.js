function add5(x) {
  return x + 5;
}

function div2(x) {
  return x / 2;
}

function sub3(x) {
  return x - 3;
}

const chain = [add5, div2, sub3].reduce((a, b) => (...args) => a(b(...args)));
// (1 + 5) / 2 - 3 = 0
// (1 - 3) / 2 + 5 = 4;
