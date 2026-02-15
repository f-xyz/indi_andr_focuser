function logAddress(socket) {
  return `${socket.remoteAddress}:${socket.remotePort}`;
}

module.exports = { logAddress };