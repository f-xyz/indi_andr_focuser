const Gpio = require("onoff").Gpio;
const powerLed = new Gpio(534, "out"); // GPIO 22 Violet
const motorCw = new Gpio(529, "out"); // GPIO 17 White
const motorCcw = new Gpio(539, "out");  // GPIO 27 White
const buttonCw = new Gpio(517, "in", "both"); // GPIO 5 Brown
const buttonCcw = new Gpio(518, "in", "both");  // GPIO 6 Blue

console.log("Button check ");
powerLed.writeSync(1);

buttonCw.watch((err, value) => {
  console.log("Button CW:", value);
  motorCw.writeSync(value);
});

buttonCcw.watch((err, value) => {
  console.log("Button CCW:", value);
  motorCcw.writeSync(value);
});

process.on("SIGINT", _ => {
  powerLed.writeSync(0);
  motorCw.writeSync(0);
  motorCcw.writeSync(0);

  powerLed.unexport();
  motorCw.unexport();
  motorCcw.unexport();
  buttonCw.unexport();
  buttonCcw.unexport();

  console.log("\nBye!\n");
});