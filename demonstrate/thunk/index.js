// const compose = require("./compose");
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

// const p1 = getFile("file1");
// const p2 = getFile("file2");
// const p3 = getFile("file3");
// const constant = v => () => v;

// p1.then(t1 => {
//   output(t1);
//   p2.then(t2 => {
//     output(t2);
//     p3.then(t3 => {
//       output(t3);
//       output("Complete!");
//     });
//   });
// });

// p1.then(output)
//   .then(constant(p2))
//   .then(output)
//   .then(constant(p3))
//   .then(output)
//   .then(() => {
//     output("Complete!");
//   });

// const urls = ["file1", "file2", "file3"];
// const getFilePromises = urls.map(getFile);

// getFilePromises
//   .concat(Promise.resolve("Complete!"), Promise.resolve())
//   .reduce((chain, filePromise) => {
//     return chain.then(output).then(constant(filePromise));
//   });

// function* loadFiles() {
//   const p1 = getFile("file1");
//   const p2 = getFile("file2");
//   const p3 = getFile("file3");

//   output(yield p1);
//   output(yield p2);
//   output(yield p3);

//   output("Complete!");
// }

// co(loadFiles);


function loadFiles(urls) {
  const getFilePromises = urls.map(getFile);
  return function* gen() {
    do {
      output(yield getFilePromises.shift())
    } while (getFilePromises.length > 0);
  
    output("Complete!");
  }
}

co(loadFiles(["file1", "file2", "file3"]));

// async function loadFiles(urls) {
//   const getFilePromises = urls.map(getFile);
//   do {
//     const res = await getFilePromises.shift();
//     output(res);
//   } while (getFilePromises.length > 0);

//   output("Complete!");
// }

// loadFiles(["file1", "file2", "file3"]);
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
// let thunk1 = getFile("file1");
// let thunk2 = getFile("file2");
// let thunk3 = getFile("file3");

// thunk1(text => {
//   output(text);
//   thunk2(text => {
//     output(text);
//     thunk3(text => {
//       output(text);
//       output("Complete!");
//     });
//   });
// });

/**
 * Thunks with middlewares
 */
// function compose(...funcs) {
//   if (funcs.length === 0) {
//     return arg => arg;
//   }

//   if (funcs.length === 1) {
//     return funcs[0];
//   }

//   return funcs.reduce((a, b) => (...args) => a(b(...args)));
// }

// function compose(...mdws) {
//   return () => {
//     function next() {
//       const mdw = mdws.shift();
//       mdw && mdw(next);
//     }
//     mdws.shift()(next);
//   };
// }

// function getFileMiddleware(file, cb) {
//   let resp;

//   ajax(file, function(text) {
//     if (!resp) resp = text;
//     else resp(text);
//   });

//   return next => {
//     _next = args => {
//       cb && cb(args);
//       next(args);
//     };
//     if (resp) {
//       _next(resp);
//     } else {
//       resp = _next;
//     }
//   };
// }

// const middlewares = [
//   getFileMiddleware("file1", output),
//   getFileMiddleware("file2", output),
//   getFileMiddleware("file3", resp => {
//     output(resp);
//     output("Complete!");
//   })
// ];

// compose(...middlewares)();
