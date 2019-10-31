/**
 * Async/Await
 */

const { ajax, IO, sulisuli } = require("./base");

function getFile(file) {
  return new Promise(function(resolve) {
    ajax(file, resolve);
  });
}

console.time(sulisuli);

async function loadFiles(urls) {
  const getFilePromises = urls.map(getFile);
  do {
    const res = await getFilePromises.shift();
    IO(res);
  } while (getFilePromises.length > 0);

  IO("Complete!");
  console.timeEnd(sulisuli);
}

loadFiles(["file1", "file2", "file3"]);
