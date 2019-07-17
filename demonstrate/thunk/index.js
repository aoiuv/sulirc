const compose = require("./compose");
const co = require("co");

function ajax(url, cb) {
  let fake_responses = {
    file1: "The first text",
    file2: "The middle text",
    file3: "The last text"
  };
  let wait = (Math.round(Math.random() * 1e4) % 8000) + 1000;
  wait = wait / 5;
  console.log("Requesting: " + url + `, time cost: ${wait} ms`);

  setTimeout(() => {
    cb(fake_responses[url]);
  }, wait);
}

function output(text) {
  console.log(text);
}

const label = "get files total time";

/**
 * Generators
 */
function getFile(file) {
  return new Promise(function(resolve) {
    ajax(file, resolve);
  });
}

function* loadFiles() {
  console.time(label);
  const p1 = getFile("file1");
  const p2 = getFile("file2");
  const p3 = getFile("file3");

  output(yield p1);
  output(yield p2);
  output(yield p3);

  console.timeEnd(label);
  output("Complete!");
}

co(loadFiles);

/**
 * Thunks
 */
// function getFile(file) {
//   let resp;

//   ajax(file, function(text) {
//     if (!resp) resp = text;
//     else resp(text);
//   });

//   return function th(cb) {
//     if (resp) cb(resp);
//     else resp = cb;
//   };
// }

// // request all files at once in "parallel"
// let th1 = getFile("file1");
// let th2 = getFile("file2");
// let th3 = getFile("file3");

// th1(function ready(text) {
//   output(text);
//   th2(function ready(text) {
//     output(text);
//     th3(function ready(text) {
//       output(text);
//       output("Complete!");
//     });
//   });
// });

/**
 * Thunks with middlewares
 */
// function getFileMiddleware(file, cb) {
//   let resp;

//   ajax(file, function(text) {
//     if (!resp) resp = text;
//     else resp(text);
//   });

//   return (ctx, next) => {
//     _next = args => {
//       ctx[file] = args;
//       cb && cb(args, ctx);
//       next(args);
//     };
//     if (resp) {
//       _next(resp);
//     } else {
//       resp = _next;
//     }
//   };
// }

// console.time(label);
// const middlewares = [
//   getFileMiddleware("file1", output),
//   getFileMiddleware("file2", output),
//   getFileMiddleware("file3", (resp, ctx) => {
//     output(resp);
//     output("Complete!");
//     console.timeEnd(label);
//   })
// ];

// compose(...middlewares)({});
