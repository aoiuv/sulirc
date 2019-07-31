/**
 * Generators
 */

const co = require("co");
const { ajax, IO, sulisuli } = require("./base");

function getFile(file) {
  return new Promise(function(resolve) {
    ajax(file, resolve);
  });
}

console.time(sulisuli);

function loadFiles(urls) {
  const getFilePromises = urls.map(getFile);
  return function* gen() {
    do {
      IO(yield getFilePromises.shift())
    } while (getFilePromises.length > 0);
  
    IO("Complete!");
    console.timeEnd(sulisuli);
  }
}

co(loadFiles(["file1", "file2", "file3"]));
