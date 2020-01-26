const provinces = require("provinces");
const through = require("through2");
const duplexer = require("duplexer2");
const _ = require('lodash');
const Readable = require("stream").Readable;

function createCountDuplexStream(counter) {
  const counts = {};
  const input = through.obj(write, end);

  // duplexer2([options], writable, readable)
  return duplexer({ objectMode: true }, input, counter);

  function write(row, _, next) {
    counts[row.country] = (counts[row.country] || 0) + 1;
    console.log(`#update# ${row.country} => ${counts[row.country]}`);
    next();
  }

  function end(done) {
    counter.setCounts(counts);
    done();
  }
}

const counter = new Readable({ objectMode: true });

counter._read = function() {};
counter.setCounts = function(counts) {
  Object.keys(counts)
    .sort()
    .forEach(key => {
      this.push(`${key} => ${counts[key]} \n`);
    });
  this.push(null);
};

const stream = createCountDuplexStream(counter);
const sleep = (t = 10) => new Promise(r => setTimeout(r, t));

stream.pipe(process.stdout);

const input = _.shuffle(provinces.slice(0, 300));
(async () => {
  for (let i = 0; i < input.length; i++) {
    stream.write(input[i]);
    await sleep();
  }

  stream.end();
})();
