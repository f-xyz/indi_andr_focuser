const net = require('net');
const Gpio = require('onoff').Gpio;
const { logAddress } = require('./utils');

const powerLed = new Gpio(534, 'out'); // GPIO 22 Violet
const motorCw = new Gpio(529, 'out'); // GPIO 17 White
const motorCcw = new Gpio(539, 'out');  // GPIO 27 White
const buttonCw = new Gpio(517, 'in', 'both'); // GPIO 5 Brown
const buttonCcw = new Gpio(518, 'in', 'both');  // GPIO 6 Blue

const HOST = '0.0.0.0';
const PORT = 12345;

////////////////////////////////////////

buttonCw.watch((err, value) => {
  console.log('Button CW:', value);
  motorCw.writeSync(value);
});

buttonCcw.watch((err, value) => {
  console.log('Button CCW:', value);
  motorCcw.writeSync(value);
});

////////////////////////////////////////

const server = net.createServer((socket) => {
  console.log(`INDI driver connected: ${logAddress(socket)}`);

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

    if (direction > 0) {
      motorCw.writeSync(1);
      setTimeout(() => {
        motorCw.writeSync(0);
        socket.write(`OK: ${request}`);
      }, ticks * 10);
    } else {
      motorCcw.writeSync(1);
      setTimeout(() => {
        motorCcw.writeSync(0);
        socket.write(`OK: ${request}`);
      }, ticks * 10);
    }
  });

  socket.on('end', () => {
    console.log(`INDI driver disconnected: ${logAddress(socket)}`);
  });

  socket.on('error', (err) => {
    console.error(`Socket error: ${err.message}`);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`TCP server listening on ${HOST}:${PORT}`);
  powerLed.writeSync(1);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  } else {
    console.error(`Server error: ${err.message}`);
  }
});

////////////////////////////////////////

process.on('SIGINT', _ => {
  server.close();

  powerLed.writeSync(0);
  motorCw.writeSync(0);
  motorCcw.writeSync(0);

  powerLed.unexport();
  motorCw.unexport();
  motorCcw.unexport();
  buttonCw.unexport();
  buttonCcw.unexport();

  console.log('\nBye!\n');
  process.exit(0);
});