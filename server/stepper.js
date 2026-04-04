const Gpio = require("onoff").Gpio;
const { sleep } = require("./utils");

(async function main() {
  console.log("Stepper");

  const motorStep = new Gpio(529, "out"); // GPIO 17 White
  const motorDir = new Gpio(539, "out");  // GPIO 27 White
  const motorEnabled = new Gpio(534, "out"); // GPIO 22 Violet
  const STEPS_PER_ROTATION = 1600; // 1/8 of step
  const FREQUENCY = 200;

  motorEnabled.writeSync(0);
  motorStep.writeSync(0);


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
      const x = i / (steps - 1);
      const f = sine(x);
      const g = 1e3 / frequency * f;
      //console.log("  x:", x);
      //console.log("  g:", g.toFixed(2));
      await sleep(1e3 / frequency);
    }
  }

  function sine(x) {
    return Math.sin(x * Math.PI);
  }

  function shutdown() {
    motorEnabled.writeSync(1);
    motorStep.writeSync(0);
    motorDir.writeSync(0);

    motorEnabled.unexport();
    motorStep.unexport();
    motorDir.unexport();

    console.log("Shutdown...");
  }
}());