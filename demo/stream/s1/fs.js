// const fs = require("fs");
// const ws = fs.createWriteStream("./dest.txt");

// "Hi!".split("").forEach(char => {
//   console.log("write char", char);
//   ws.write(`The char: ${char} char code is ${char.charCodeAt()}`);
//   ws.write("\n");
// });

// ws.end(":)");

// const stream = require('stream');
// const events = require('events');

// console.log(ws instanceof stream.Writable);
// console.log(ws instanceof events.EventEmitter);
// ws.addListener("open", () => {
//   console.log("ws is open");
// });

// ws.addListener("close", () => {
//   console.log("ws is close");
// });

const fs = require("fs");
const rs = fs.createReadStream("./src.txt");

let sentence = "";

rs.on("data", chunk => {
  sentence += chunk;
});

rs.on("end", () => {
  console.log(sentence);
});
