const net = require('net');
const { logAddress } = require("../utils");

const HOST = '0.0.0.0';
const PORT = 12345;

class TcpServer {
  constructor() {
    this.server = net.createServer((socket) => {
      this.onClientConnected(socket);

      socket.on('data', (data) => this.onPacketReceived(data));
      socket.on('end', () => this.onClientDisconnected());
      socket.on('error', (err) => {
        console.error(`Socket error: ${err.message}`);
      });
    });

    this.server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      } else {
        console.error(`Server error: ${err.message}`);
      }
    });
  }

  listen(host, port) {
    this.server.listen(port, host, () => {
      this.onListen();
    });
  }


  onListen() { console.log('onListen()'); }
  onClientConnected(socket) { console.log('onClientConnected()', logAddress(socket)); }
  onClientDisconnected() { console.log('onClientDisconnected()'); }
  onPacketReceived(data) { console.log('onPacketReceived()', data); }
}

const tcpServer = new TcpServer();
tcpServer.listen(HOST, PORT);

