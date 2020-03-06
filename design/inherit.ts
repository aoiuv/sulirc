/**
 * js 的各种继承
 */

// function Animal(name, energy) {
//   this.name = name;
//   this.energy = energy;
// }
// Animal.prototype.eat = function(amount) {
//   console.log(`${this.name} is eating.`);
//   this.energy += amount;
// };
// Animal.prototype.sleep = function(length) {
//   console.log(`${this.name} is sleeping.`);
//   this.energy += length;
// };
// Animal.prototype.play = function(length) {
//   console.log(`${this.name} is playing.`);
//   this.energy -= length;
// };

// function Dog(name, energy, breed) {
//   Animal.call(this, name, energy);
//   this.breed = breed;
// }

//////////////////////////

// function Dog (name, energy, breed) {
//   Animal.call(this, name, energy)
//   this.breed = breed
// }
// Dog.prototype = Object.create(Animal.prototype);

//////////////////////////

// function Dog (name, energy, breed) {
//   Animal.call(this, name, energy)
//   this.breed = breed
// }
// Dog.prototype = new Animal('Ancestor', '100');

//////////////////////////

// const charlie = new Dog('Charlie', 10, 'Goldendoodle');
// charlie.eat(10);
// console.log(
//   charlie.name, // Charlie
//   charlie.energy, // 10
//   charlie.breed // Goldendoodle
// );

////////////////////

/**
 *
组合继承

优点：
父类的方法可以被复用
父类的引用属性不会被共享
子类构建实例时可以向父类传递参数

缺点：
调用了两次父类的构造函数，第一次给子类的原型添加了父类的name, arr属性，第二次又给子类的构造函数添加了父类的name, arr属性，从而覆盖了子类原型中的同名参数。这种被覆盖的情况造成了性能上的浪费。
 */
// function SuperType() {
//   this.name = 'parent';
//   this.arr = [1, 2, 3];
// }

// SuperType.prototype.say = function() {
//   console.log('this is parent');
// };

// function SubType() {
//   SuperType.call(this); // 第二次调用SuperType
// }

// SubType.prototype = new SuperType(); // 第一次调用SuperType
// const sub = new SubType();
// console.log(sub.name, sub.arr);
// sub.say();

////////////////////////////////////////////////

/**
 *
原型式继承

核心：原型式继承的object方法本质上是对参数对象的一个浅复制。

优点：
父类方法可以复用

缺点：
父类的引用属性会被所有子类实例共享
子类构建实例时不能向父类传递参数
 */

// function object(o) {
//   function F() {}
//   F.prototype = o;
//   return new F();
// }

// let person = {
//   name: 'Nicholas',
//   friends: ['Shelby', 'Court', 'Van']
// };

// let man = object(person);
// man.name = 'Greg';
// man.friends.push('Rob');

// let woman = object(person);
// woman.name = 'Linda';
// woman.friends.push('Barbie');
// console.log(person.friends); //"Shelby,Court,Van,Rob,Barbie"

////////////////////////////////////////////////

/**
 *
寄生式继承
核心：使用原型式继承获得一个目标对象的浅复制，然后增强这个浅复制的能力。
 */
// function object(o) {
//   function F() {}
//   F.prototype = o;
//   return new F();
// }

// function inherit(original) {
//   var clone = object(original); //通过调用函数创建一个新对象
//   clone.sayHi = function() {
//     //以某种方式来增强这个对象
//     console.log('hi');
//   };
//   return clone; //返回这个对象
// }

// var person = {
//   name: 'Nicholas',
//   friends: ['Shelby', 'Court', 'Van']
// };

// var man = inherit(person);
// man.sayHi(); //"hi"

////////////////////////////////////////////////

/**
 *
寄生组合继承

寄生组合继承就可以解决：组合继承两次调用父类的构造函数造成浪费的缺点
 */
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}
function inheritPrototype(subType, superType) {
  var prototype = object(superType.prototype); // 创建了父类原型的浅复制
  prototype.constructor = subType; // 修正原型的构造函数
  subType.prototype = prototype; // 将子类的原型替换为这个原型
}

function SuperType(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

SuperType.prototype.sayName = function() {
  console.log(this.name);
};

function SubType(name, age) {
  SuperType.call(this, name);
  this.age = age;
}
// 核心：因为是对父类原型的复制，所以不包含父类的构造函数，也就不会调用两次父类的构造函数造成浪费
inheritPrototype(SubType, SuperType);
SubType.prototype.sayAge = function() {
  console.log(this.age);
};
const sub = new SubType('Anna', '19');
console.log(sub.name, sub.colors);
sub.sayAge();
sub.sayName();

////////////////////////////////////////////////

/**
 *
 ES6 继承的原理
 */
class Animal {
  name;
  energy;

  constructor(name, energy) {
    this.name = name;
    this.energy = energy;
  }
  eat(amount) {
    console.log(`${this.name} is eating.`);
    this.energy += amount;
  }
  sleep(length) {
    console.log(`${this.name} is sleeping.`);
    this.energy += length;
  }
  play(length) {
    console.log(`${this.name} is playing.`);
    this.energy -= length;
  }
}

class Dog {
  name;
  energy;
  breed;

  constructor(name, energy, breed) {
    this.name = name;
    this.energy = energy;
    this.breed = breed;
  }
}

// Object.setPrototypeOf = function(obj, proto) {
//   obj.__proto__ = proto;
//   return obj;
// };

(Animal as any).stat = {
  cap: 'A',
  id: Symbol.for('id#animal')
};

// B 的实例继承 A 的实例
Object.setPrototypeOf(Dog.prototype, Animal.prototype);

// B 继承 A 的静态属性
Object.setPrototypeOf(Dog, Animal);

const dog: unknown = new Dog('suli', 100, 5);
console.log(dog);
(dog as Animal).eat(5);
(dog as Animal).play(10);
console.log(dog);
console.log((Dog as any).stat);
