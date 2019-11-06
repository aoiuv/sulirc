function repeat(x) {
  return [x].concat(repeat(x));
}

// Haskell有懒执行机制
// 因此可以 take n (repeat "*")
// Javascript 不行，堆栈溢出
console.log(repeat("*"));
