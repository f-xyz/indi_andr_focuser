class StepperMotor {
  STEPS_PER_ROTATION = 1600; // 1/8 of step

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

    motorDir.writeSync(direction);
    this._rotate(frequency);
  }

  stop() {
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

module.exports = { StepperMotor };