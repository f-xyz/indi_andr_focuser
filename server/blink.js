const Gpio = require('onoff').Gpio;
const powerLed = new Gpio(538, "out"); // GPIO 26 Green
const blinkInterval = setInterval(blinkLed, 500);
setTimeout(endBlink, 1e4);

function blinkLed() {
  // Check the pin state, if the state is 0 (or off)
  if (powerLed.readSync() === 0) {
    // Set pin state to 1 (turn LED on)    
    console.log('on');
    powerLed.writeSync(1);
  } else {
    // Set pin state to 0 (turn LED off)
    console.log('off');
    powerLed.writeSync(0);
  }
}

function endBlink() {
  clearInterval(blinkInterval);
  powerLed.writeSync(0); // Turn LED off
  powerLed.unexport(); // Unexport GPIO to free resources
}

process.on('SIGINT', _ => {
  powerLed.writeSync(0);
  powerLed.unexport();
});