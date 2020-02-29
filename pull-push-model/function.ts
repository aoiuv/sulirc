function createID() {
  return Math.random().toString(36).substr(2, 9);;
}

const id = createID(); // adb8d7xjm

console.log(id);