const net = require('net');
const server = net.createServer();
server.on('connection', handleConnection);
server.listen(3001);

function handleConnection(socket) {
  socket.on('data', chunk => {
    console.log('Received chunk:\n', chunk.toString());
  });
  socket.write('HTTP/1.1 200 OK\r\nServer: my-web-server\r\nContent-Length: 0\r\n\r\n');
}

export {};