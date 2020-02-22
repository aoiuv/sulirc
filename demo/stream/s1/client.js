const http = require("http");
const options = {
  hostname: "127.0.0.1",
  port: 8000,
  path: "/upload",
  method: "POST"
};
const req = http.request(options, res => {
  process.stdout.write("Client get response: ");
  res.pipe(process.stdout);
});

req.write("Hi!");
req.end();
