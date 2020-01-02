/**
 * Reflect.apply(target, thisArgument, argumentsList)
 */

console.log(Reflect.apply(Math.floor, undefined, [1.75]));
// expected output: 1

console.log(Reflect.apply(String.fromCharCode, undefined, [104, 101, 108, 108, 111]));
// expected output: "hello"

console.log(Reflect.apply(RegExp.prototype.exec, /ab/, ['confabulation']).index);
// expected output: 4

console.log(Reflect.apply(''.charAt, 'ponies', [3]));
// expected output: "i"

function getJob() {
  return this.job;
}

const man = {
  name: 'suri',
  job: 'developer'
};

console.log(Reflect.apply(getJob, man, []));