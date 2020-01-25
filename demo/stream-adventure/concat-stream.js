const concat = require("concat-stream");
const http = require("http");

const server = http.createServer(function(req, res) {
  if (req.method === "POST") {
    req.pipe(
      concat(body => {
        try {
          console.log("receive body", body);
					// const string = body.toString();
					const string = body;
					// console.log("to string", string);
					
					// @important JSON.parse(buffer)
          const o = JSON.parse(string);
          console.log("parse string", o);
          res.end(Object.keys(o).join("\n"));
        } catch (e) {
          res.write(body);
          res.end(e.message);
        }
      })
    );
  } else {
    res.end("not POST");
  }
});

server.listen(5000);
console.log("server running at PORT: 5000");

// http POST :5000  -v <<< '{"name": "John", "age": 24}'
// http POST :5000 name=John age=24 -v
