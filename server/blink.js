const Gpio = require('onoff').Gpio;
const led = new Gpio(534, 'out'); // GPIO 22 Violet
const blinkInterval = setInterval(blinkLED, 500);
setTimeout(endBlink, 1e4);

function blinkLED() {
  // Check the pin state, if the state is 0 (or off)
  if (led.readSync() === 0) {
    // Set pin state to 1 (turn LED on)    
    console.log('on');
    led.writeSync(1);
  } else {
    // Set pin state to 0 (turn LED off)
    console.log('off');
    led.writeSync(0);
  }
}

function endBlink() {
  clearInterval(blinkInterval);
  led.writeSync(0); // Turn LED off
  led.unexport(); // Unexport GPIO to free resources
}

process.on('SIGINT', _ => {
  powerLed.writeSync(0);
  powerLed.unexport();
});