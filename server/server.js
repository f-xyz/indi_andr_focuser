const net = require('net');

const PORT = 12345;
const HOST = '0.0.0.0'; // Listen on localhost

const server = net.createServer((socket) => {
  console.log(`Client connected: ${socket.remoteAddress}:${socket.remotePort}`);
  socket.write('Hello!');

  socket.on('data', (data) => {
    console.log(`<<< ${data.toString().trim()}`);
    socket.write(`Echo: ${data.toString()}`);
  });

  socket.on('end', () => {
    console.log(`Client disconnected: ${socket.remoteAddress}:${socket.remotePort}`);
  });

  socket.on('error', (err) => {
    console.error(`Socket error: ${err.message}`);
  });
});

// Listen for incoming connections
server.listen(PORT, HOST, () => {
  console.log(`TCP server listening on ${HOST}:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  } else {
    console.error(`Server error: ${err.message}`);
  }
});
