/**
 * Reflect.construct(target, argumentsList[, newTarget])
 */

function OneClass() {
  console.log('OneClass');
  console.log(new.target);
}

function OtherClass() {
  console.log('OtherClass');
  console.log(new.target);
}

const args = [];

Reflect.construct(OneClass, args, OtherClass);
