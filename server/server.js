const net = require('net');

const HOST = '0.0.0.0';
const PORT = 12345;

const server = net.createServer((socket) => {
  console.log(`INDI driver connected: ${logAddr(socket)}`);

  socket.on('data', (data) => {
    const request = data.toString().trim();
    console.log(`<<< Received: ${request}`);

    const regExp = /^(\w+);Dir:(\d+);Ticks:(\d+)$/;
    const groups = request.match(regExp);

    const command = groups[1];
    const direction = parseInt(groups[2], 10);
    const ticks = parseInt(groups[3], 10);

    console.log('    command:', command);
    console.log('    direction:', direction);
    console.log('    ticks:', ticks);

    setTimeout(() => {
      socket.write(`OK: ${request}`);
    }, 100);
  });

  socket.on('end', () => {
    console.log(`INDI driver disconnected: ${logAddr(socket)}`);
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

function logAddr(socket) {
  return `${socket.remoteAddress}:${socket.remotePort}`;
}