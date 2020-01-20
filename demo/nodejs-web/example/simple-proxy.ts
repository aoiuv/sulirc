import http from "http";

const debug = require("debug")("web");

const app = http.createServer((req, res) => {
  if ("/remote" === req.url) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("Hello Remote Page \n");
  } else {
    proxy(req, res);
  }
});

function proxy(req, res) {
  const options = {
    host: req.host,
    port: 3000,
    headers: req.headers,
    path: "/remote",
    agent: false,
    method: "GET"
  };

  const httpProxy = http.request(options, response => {
    debug('proxy', req.url);
    response.pipe(res);
  });

  req.pipe(httpProxy);
}

app.listen(3000, () => {
  const address: any = app.address();
  const PORT = address.port;
  debug(`Server running at http://127.0.0.1:${PORT}`);
});
