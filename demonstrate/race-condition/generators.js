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

// function* loadFiles() {
//   const p1 = getFile("file1");
//   const p2 = getFile("file2");
//   const p3 = getFile("file3");

//   IO(yield p1);
//   IO(yield p2);
//   IO(yield p3);

//   IO("Complete!");

//   console.timeEnd(sulisuli);
// }

// co(loadFiles);

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