#!/usr/bin/env node

import { Gpio } from 'onoff';
import { sleep } from '../utils';

(async function main() {
  console.log("Stepper");

  const powerLed = new Gpio(538, "out"); // GPIO 26 Green
  const motorStep = new Gpio(525, "out"); // GPIO 13 White
  const motorDir = new Gpio(539, "out");  // GPIO 27 White
  const motorEnabled = new Gpio(534, "out"); // GPIO 22 Violet
  const buttonCw = new Gpio(517, "in", "both"); // GPIO 5 Orange
  const buttonCcw = new Gpio(518, "in", "both"); // GPIO 6 Orange
  const STEPS_PER_ROTATION = 1600; // 1/8 of step
  const FREQUENCY = 200;

  powerLed.writeSync(1);
  motorEnabled.writeSync(0);
  motorStep.writeSync(0);

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
  process.on("SIGTERM", shutdown);
  shutdown();

  ////////////////////////////////////////

  async function roll(steps: number, frequency: number) {
    for (let i = 0; i < steps; i++) {
      motorStep.writeSync(1);
      motorStep.writeSync(0);
      await sleep(1e3 / frequency);
    }
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