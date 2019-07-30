/**
 * Promise
 */

const { ajax, IO, sulisuli } = require("./base");

function getFile(file) {
  return new Promise(function(resolve) {
    ajax(file, resolve);
  });
}

const p1 = getFile("file1");
const p2 = getFile("file2");
const p3 = getFile("file3");

console.time(sulisuli);

p1.then(resp1 => {
  IO(resp1);
  p2.then(resp2 => {
    IO(resp2);
    p3.then(resp3 => {
      IO(resp3);
      IO("Complete!");
      console.timeEnd(sulisuli);
    });
  });
});
