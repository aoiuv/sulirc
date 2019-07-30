/**
 * Thunk & Middleware
 */
const { ajax, IO, sulisuli } = require("./base");
const { compose_3: compose } = require("./compose");

function getFileMiddleware(file, cb) {
  let resp;

  ajax(file, function(text) {
    if (!resp) resp = text;
    else resp(text);
  });

  return next => {
    const wrapper = args => {
      cb && cb(args);
      next(args);
    };
    if (resp) {
      wrapper(resp);
    } else {
      resp = wrapper;
    }
  };
}

console.time(sulisuli);

const middlewares = [
  getFileMiddleware("file1", IO),
  getFileMiddleware("file2", IO),
  getFileMiddleware("file3", resp => {
    IO(resp);
    IO("Complete!");
    console.timeEnd(sulisuli);
  })
];

compose(...middlewares)();