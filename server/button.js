const Gpio = require("onoff").Gpio;

(async function main() {
  console.log("Button + Stepper");

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

  class StepperMotor {
    direction = true;
    isRunning = false;
    timeout = null;

    motorDir = null;
    motorStep = null;
    motorEnabled = null;

    constructor() {
    }

    rotate(direction, frequency) {
      this.stop();

      this.direction = direction;
      this.isRunning = true;

      motorEnabled.writeSync(0);
      motorDir.writeSync(direction);
      this._rotate(frequency);
    }

    stop() {
      motorEnabled.writeSync(1);
      clearTimeout(this.timeout);
      this.isRunning = false;
    }

    _rotate(frequency) {
      if (this.isRunning) {
        this.timeout = setTimeout(() => {
          this._rotate(frequency);
        }, 1e3 / frequency)

        motorStep.writeSync(1);
        motorStep.writeSync(0);
      }
    }
  }

  const motor = new StepperMotor();

  buttonCw.watch((_, value) => {
    const data = 1 - value;
    console.log("Button CW:", data);

    if (data) {
      motor.rotate(0, FREQUENCY);
    } else {
      motor.stop();
    }
  });

  buttonCcw.watch((_, value) => {
    const data = 1 - value;
    console.log("Button CCW:", data);

    if (data) {
      motor.rotate(1, FREQUENCY);
    } else {
      motor.stop();
    }
  });

  ////////////////////////////////////////

  process.on("SIGINT", shutdown);

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