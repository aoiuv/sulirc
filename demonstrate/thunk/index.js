const compose = require("./compose");

function fakeAjax(url, cb) {
  let fake_responses = {
    file1: "The first text",
    file2: "The middle text",
    file3: "The last text"
  };
  let randomDelay = ((Math.round(Math.random() * 1e4) % 8000) + 1000) / 5;

  console.log("Requesting: " + url + ` time cost: ${randomDelay}`);

  setTimeout(function() {
    cb(fake_responses[url]);
  }, randomDelay);
}

function output(text) {
  console.log(text);
}

// **************************************

// function getFile(file) {
//   let resp;

//   fakeAjax(file, function(text) {
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

// **************************************
function getFileMiddleware(file, cb) {
  let resp;

  fakeAjax(file, function(text) {
    if (!resp) resp = text;
    else resp(text);
  });

  return (ctx, next) => {
    _next = (args) => {
      ctx[file] = args;
      cb && cb(args, ctx);
      next(args);
    };
    if (resp) {
      _next(resp);
    } else {
      resp = _next;
    }
  };
}

const middlewares = [
  getFileMiddleware('file1', output),
  getFileMiddleware('file2', output),
  getFileMiddleware('file3', (resp, ctx) => {
    output(resp);
    output('Complete!');
    // output(ctx);
  }),
];

compose(...middlewares)({});

// let _th1 = (ctx, next) => {
//   th1(text => {
//     ctx.text1 = text;
//     output(text);
//     next();
//   });
// };

// let _th2 = (ctx, next) => {
//   th2(text => {
//     ctx.text2 = text;
//     output(text);
//     next();
//   });
// };

// let _th3 = (ctx, next) => {
//   th3(text => {
//     ctx.text3 = text;
//     output(text);
//     output("Complete!");
//     console.log(ctx);
//     next();
//   });
// };

// compose(
//   _th1,
//   _th2,
//   _th3
// )({});
