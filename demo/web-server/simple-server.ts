const http = require("http");
const server = http.createServer();

function connectType(res, contentType: string, resp: string) {
  res.setHeader("Content-Type", contentType);
  res.end(resp);
}

server.on("request", (req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  // console.log("req:", req);
  // console.log("res:", res);

  connectType(
    res,
    // "text/json",
    // "text/plain",
    'application/octet-stream',
    JSON.stringify({
      title: "simple server",
      text: "Hello World!"
    })
  );
  // connectType(res, "text/css", `a { color: #300; }`);
  // connectType(res, "text/js", `const f = () => 1;`);
});

server.listen(3000);

export {};
