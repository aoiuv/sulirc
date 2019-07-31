/**
 * Promise Best Way
 */

const { ajax, IO, sulisuli } = require("./base");
const constant = v => () => v;

function getFile(file) {
  return new Promise(function(resolve) {
    ajax(file, resolve);
  });
}

console.time(sulisuli);

function loadFiles(urls) {
  const getFilePromises = urls.map(getFile);

  getFilePromises
    .reduce((chain, filePromise) => {
      return chain.then(IO).then(constant(filePromise));
    })
    .then(resp => {
      IO(resp);
      IO("Complete!");
      console.timeEnd(sulisuli);
    });
}

loadFiles(["file1", "file2", "file3"]);
