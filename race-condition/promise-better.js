/**
 * Promise Better Way
 */

const { ajax, IO, sulisuli } = require("./base");
const constant = v => () => v;

function getFile(file) {
  return new Promise(function(resolve) {
    ajax(file, resolve);
  });
}

console.time(sulisuli);

const p1 = getFile("file1");
const p2 = getFile("file2");
const p3 = getFile("file3");

p1.then(IO)
  .then(constant(p2))
  .then(IO)
  .then(constant(p3))
  .then(IO)
  .then(() => {
    IO("Complete!");
    console.timeEnd(sulisuli);
  });
