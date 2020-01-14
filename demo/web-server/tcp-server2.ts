const net = require('net');
const server = net.createServer();
server.on('connection', handleConnection);
server.listen(3000);

function handleConnection(socket) {
  // Subscribe to the readable event once so we can start calling .read()
  socket.once('readable', function() {
    // Set up a buffer to hold the incoming data
    let reqBuffer = new Buffer('');
    // Set up a temporary buffer to read in chunks
    let buf;
    let reqHeader;
    while (true) {
      // Read data from the socket
      buf = socket.read();
      // Stop if there's no more data
      if (buf === null) break;

      // Concatenate existing request buffer with new data
      reqBuffer = Buffer.concat([reqBuffer, buf]);

      // Check if we've reached \r\n\r\n, indicating end of header
      let marker = reqBuffer.indexOf('\r\n\r\n');
      if (marker !== -1) {
        // If we reached \r\n\r\n, there could be data after it. Take note.
        let remaining = reqBuffer.slice(marker + 4);
        // The header is everything we read, up to and not including \r\n\r\n
        reqHeader = reqBuffer.slice(0, marker).toString();
        // This pushes the extra data we read back to the socket's readable stream
        socket.unshift(remaining);
        break;
      }
    }
    console.log(`Request header:\n${reqHeader}`);

    // At this point, we've stopped reading from the socket and have the header as a string
    // If we wanted to read the whole request body, we would do this:

    reqBuffer = new Buffer('');
    while ((buf = socket.read()) !== null) {
      reqBuffer = Buffer.concat([reqBuffer, buf]);
    }
    let reqBody = reqBuffer.toString();
    console.log(`Request body:\n${reqBody}`);

    // Send a generic response
    socket.end('HTTP/1.1 200 OK\r\nServer: my-custom-server\r\nContent-Length: 0\r\n\r\n');
  });
}

export {};
