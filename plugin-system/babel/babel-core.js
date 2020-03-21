const babel = require('@babel/core');
const ret = babel.transform("code();", {});

console.log(ret);