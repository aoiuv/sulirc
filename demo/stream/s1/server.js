const http = require("http");

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url.includes("/upload")) {
    process.stdout.write("Server get request: ");
    req.pipe(process.stdout);
    res.write("Hey!");
    res.end();
  } else {
    res.writeHead(404);
    res.end("Not Found!");
  }
});

server.listen(8000);
