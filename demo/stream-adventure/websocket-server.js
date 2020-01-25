const http = require("http");
const path = require("path");
const browserify = require("browserify");
const through = require('through2');
const split = require('split');
const wsock = require("websocket-stream");

function createServer(main) {
  var server = http.createServer(function(req, res) {
    if (req.url === "/bundle.js") {
      res.setHeader("content-type", "text/javascript");
      var b = browserify(main, { debug: true });
      b.bundle().pipe(res);
    } else {
      res.setHeader("content-type", "text/html");
      return res.end('<script src="/bundle.js"></script>');
    }
  });
  server.listen(8099, function() {
    console.log("################################################");
    console.log("#                                              #");
    console.log("# Open http://localhost:8099 to run your code! #");
    console.log("#                                              #");
    console.log("################################################");
    console.log();
  });
  return server;
}

const server = createServer(path.resolve(__dirname, "./websocket-stream.js"));

var wss = wsock.createServer({ server: server }, handle);
function handle(stream) {
  stream.pipe(split()).pipe(
    through(function(buf, enc, next) {
      console.log('buf', buf.toString());
      stream.end();
    })
  );
}
