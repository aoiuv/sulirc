/**
 * Thunk
 */
const { ajax, IO, sulisuli } = require("./base");

function getFile(file) {
  let resp;

  ajax(file, function(text) {
    if (!resp) resp = text;
    else resp(text);
  });

  return function th(cb) {
    if (resp) cb(resp);
    else resp = cb;
  };
}

console.time(sulisuli);

const thunk1 = getFile("file1");
const thunk2 = getFile("file2");
const thunk3 = getFile("file3");

thunk1(resp1 => {
  IO(resp1);
  thunk2(resp2 => {
    IO(resp2);
    thunk3(resp3 => {
      IO(resp3);
      IO("Complete!");
      console.timeEnd(sulisuli);
    });
  });
});
