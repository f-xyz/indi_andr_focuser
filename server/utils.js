function logAddress(socket) {
  return `${socket.remoteAddress}:${socket.remotePort}`;
}

async function sleep(n){
  return new Promise(resolve => {
    setTimeout(resolve, n);
  });
}

function sigmoid(x, k= 12) {
  const low = 1 / (1 + Math.exp(-k * (0 - 0.5)));
  const high = 1 / (1 + Math.exp(-k * (1 - 0.5)));
  const result = 1 / (1 + Math.exp(-k * (x - 0.5)));
  return (result - low) / (high - low);
}

module.exports = {
  logAddress,
  sleep,
  sigmoid
};