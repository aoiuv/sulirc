const http = require('http');
const server = http.createServer();

server.on('request', (req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  res.setHeader('Content-Type','text/plain');
  res.end(JSON.stringify({
    title: 'simple server',
    text: 'Hello World!'
  }));
});

server.listen(3000);

export {};