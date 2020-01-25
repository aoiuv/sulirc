const spawn = require("child_process").spawn;
const duplexer = require("duplexer2");
const path = require("path");
const concat = require("concat-stream");

const cmd = process.execPath;
const n = 1 + Math.floor(Math.random() * 25);

// cmd => process.execPath => '/Users/yanguangjie/.nvm/versions/node/v12.6.0/bin/node'
// args => []
// module.exports = function(cmd, args) {
//   const ps = spawn(cmd, args);
//   return duplexer(ps.stdin, ps.stdout);
// };

function duplexerStream(cmd, args) {
  const ps = spawn(cmd, args);
  // console.log('ps', ps);
  return duplexer(ps.stdin, ps.stdout);
}

const stream = duplexerStream(cmd, [path.resolve(__dirname, "./command.js"), n]);

stream.write("hello duplexer stream!");
stream.pipe(
  concat(function(body) {
    console.log("FINAL", body.toString("utf8"));
  })
);

stream.write("A");
stream.write("B");
stream.end();

// stream.pipe(process.stdout);
// var words = [
//   "beetle",
//   "biscuit",
//   "bat",
//   "bobbin",
//   "bequeath",
//   "brûlée",
//   "byzantine",
//   "bazaar",
//   "blip",
//   "byte",
//   "beep",
//   "boop",
//   "bust",
//   "bite",
//   "balloon",
//   "box",
//   "beet",
//   "boolean",
//   "bake",
//   "bottle",
//   "bug",
//   "burrow"
// ];
// var input = words.slice();

// var iv = setInterval(function() {
//   if (input.length) {
//     stream.write(input.shift());
//   } else {
//     clearInterval(iv);
//     stream.end();
//   }
// }, 50);
