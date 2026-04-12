const Gpio = require("onoff").Gpio;
const { sleep } = require("./utils");

(async function main() {
  console.log("Stepper");

  const powerLed = new Gpio(538, "out"); // GPIO 26 Green
  const motorStep = new Gpio(529, "out"); // GPIO 17 White
  const motorDir = new Gpio(539, "out");  // GPIO 27 White
  const motorEnabled = new Gpio(534, "out"); // GPIO 22 Violet
  const buttonCw = new Gpio(514, "in", "both"); // GPIO 2 Orange
  const buttonCcw = new Gpio(515, "in", "both"); // GPIO 3 Orange
  const STEPS_PER_ROTATION = 1600; // 1/8 of step
  const FREQUENCY = 200;

  powerLed.writeSync(1);
  motorEnabled.writeSync(0);
  motorStep.writeSync(0);

  ////////////////////////////////////////

  buttonCw.watch((_, value) => {
    console.log("Button CW:", 1 - value);
  });

  buttonCcw.watch((_, value) => {
    console.log("Button CCW:", 1 - value);
  });

  ////////////////////////////////////////

  console.log("Rolling CCW 90 deg...");
  motorDir.writeSync(0);
  await roll(STEPS_PER_ROTATION / 4, FREQUENCY);

  console.log("Rolling CW 180 deg...");
  motorDir.writeSync(1);
  await roll(STEPS_PER_ROTATION / 2, FREQUENCY);

  console.log("Rolling CCW 90 deg...");
  motorDir.writeSync(0);
  await roll(STEPS_PER_ROTATION / 4, FREQUENCY);

  process.on("SIGINT", shutdown);
  shutdown();

  ////////////////////////////////////////

  async function roll(steps, frequency) {
    for (let i = 0; i < steps; i++) {
      // Step
      motorStep.writeSync(1);
      motorStep.writeSync(0);
      // Delay
      //const x = i / (steps - 1);
      //const f = sine(x);
      //const g = 1e3 / frequency * f;
      //console.log("  x:", x);
      //console.log("  g:", g.toFixed(2));
      await sleep(1e3 / frequency);
    }
  }

  function sine(x) {
    return Math.sin(x * Math.PI);
  }

  function shutdown() {
    powerLed.writeSync(0);
    motorEnabled.writeSync(1);
    motorStep.writeSync(0);
    motorDir.writeSync(0);

    buttonCw.unwatch();
    buttonCcw.unwatch();

    powerLed.unexport();
    motorEnabled.unexport();
    motorStep.unexport();
    motorDir.unexport();
    buttonCw.unexport();
    buttonCcw.unexport();

    console.log("Shutdown...");
  }
}());