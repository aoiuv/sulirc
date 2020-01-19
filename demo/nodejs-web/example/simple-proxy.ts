import http from "http";
import fs from "fs";

const app = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello Remote Page \n");
});

app.listen(3000, () => {
  const PORT = app.address().port;
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});
