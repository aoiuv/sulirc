const combine = require("stream-combiner");
const through = require("through2");
const split = require("split");
const zlib = require("zlib");
const concat = require("concat-stream");
const fs = require("fs");

function createGenreStream() {
  const grouper = through(write, end);
  let current;

  function write(buffer, enc, next) {
    if (buffer.length === 0) {
      return next();
    }
    let row = JSON.parse(buffer);
    // console.log('write row', row);
    // console.log('write current', current);

    if (row.type === "genre") {
      if (current) {
        this.push(JSON.stringify(current) + "\n");
      }
      current = { name: row.name, books: [] };
    }
    if (row.type === "book") {
      current.books.push(row.name);
    }

    next();
  }

  function end(next) {
    if (current) {
      this.push(JSON.stringify(current) + "\n");
    }
    next();
  }

  return combine(split(), grouper, zlib.createGzip());
}

const books = require("./books.json");
const stream = createGenreStream();

for (let i = 0; i < books.length; i++) {
  stream.write(JSON.stringify(books[i]));
  stream.write("\n");
}
stream.end();

const expectedStream = fs.createWriteStream("./expected.json");

stream.pipe(zlib.createGunzip()).pipe(
  concat(function(body) {
    // console.log(body.toString());
    const string = body.toString();
    const json =
      "[" +
      string
        .trim()
        .split("\n")
        .join(",") +
      "]";

    expectedStream.write(JSON.stringify(JSON.parse(json), null, 2));
    expectedStream.end();
  })
  // process.stdout
);
