// npx babel --config-file=./.babelrc  plugin-system/babel/class.js --out-file plugin-system/babel/class-compiled.js

class Item {
  getId() {
    return `id.` + String(Math.random()).replace(/\./, '#');
  }
}

const item = new Item();
console.log(item.getId());