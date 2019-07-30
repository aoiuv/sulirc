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

const urls = ["file1", "file2", "file3"];
const getFilePromises = urls.map(getFile);

getFilePromises
  .concat(Promise.resolve("Complete!"), Promise.resolve())
  .reduce((chain, filePromise) => {
    return chain.then(IO).then(constant(filePromise));
  });
