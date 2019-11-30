const deepequal = require('deep-equal');
function expect(a) {
  return {
    toEqual(b) {
      const ret = deepequal(a, b);
      console.log('=======================');
      console.log('| expect  :', a);
      console.log('| toEqual :', b);
      console.log('| result  :', ret);
      console.log('=======================', '\n');
      return ret;
    },
  };
}

module.exports = expect;
