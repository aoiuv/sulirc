const trumpet = require("trumpet");
const fs = require("fs");
const through = require("through2");
const tr = trumpet();

fs.createReadStream("input.html").pipe(tr);

// Duplex
const stream = tr.select(".loud").createStream();

stream
  .pipe(
    through(
      function(buf, enc, next) {
        this.push(buf.toString().toUpperCase());
        next();
      },
      function(done) {
        this.push("@{end}");
        done();
      }
    )
  )
  .pipe(stream);

tr.pipe(fs.createWriteStream("expect.html"));
