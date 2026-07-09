#!/usr/bin/env node

import rpio from 'rpio';
import { sleep } from '../utils';

(async function main() {
  console.log("Stepper PWM");

  const powerLed = 26; // GPIO 26 Green
  const motorStep = 13; // GPIO 13 White, hardware PWM
  const motorDir = 27; // GPIO 27 White
  const motorEnabled = 22; // GPIO 22 Violet
  const buttonCw = 5; // GPIO 5 Orange
  const buttonCcw = 6; // GPIO 6 Orange

  const FREQUENCY = 800;
  const STEPS_PER_ROTATION = 1600 * 13.7; // 1/8 of step + reducer
  const PWM_BASE_CLOCK = 19200000;
  const PWM_CLOCK_DIVIDER = 1024;

  const pwmRange = Math.max(2, Math.round(PWM_BASE_CLOCK / PWM_CLOCK_DIVIDER / FREQUENCY));
  const actualFrequency = PWM_BASE_CLOCK / PWM_CLOCK_DIVIDER / pwmRange;

  rpio.init({ gpiomem: false, mapping: "gpio" });
  rpio.open(powerLed, rpio.OUTPUT, rpio.LOW);
  rpio.open(motorEnabled, rpio.OUTPUT, rpio.HIGH);
  rpio.open(motorDir, rpio.OUTPUT, rpio.LOW);
  rpio.open(buttonCw, rpio.INPUT, rpio.PULL_OFF);
  rpio.open(buttonCcw, rpio.INPUT, rpio.PULL_OFF);
  rpio.open(motorStep, rpio.PWM);
  rpio.pwmSetClockDivider(PWM_CLOCK_DIVIDER);
  rpio.pwmSetRange(motorStep, pwmRange);
  rpio.pwmSetData(motorStep, 0);

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  rpio.write(powerLed, rpio.HIGH);
  rpio.write(motorEnabled, rpio.LOW);

  ////////////////////////////////////////

  console.log("Rolling CCW 90 deg...");
  rpio.write(motorDir, rpio.LOW);
  await roll(STEPS_PER_ROTATION / 4, actualFrequency);

  console.log("Rolling CW 180 deg...");
  rpio.write(motorDir, rpio.HIGH);
  await roll(STEPS_PER_ROTATION / 2, actualFrequency);

  console.log("Rolling CCW 90 deg...");
  rpio.write(motorDir, rpio.LOW);
  await roll(STEPS_PER_ROTATION / 4, actualFrequency);

  shutdown();

  ////////////////////////////////////////

  async function roll(steps: number, frequency: number) {
    const durationMs = Math.round(steps / frequency * 1000);

    rpio.pwmSetData(motorStep, Math.floor(pwmRange / 2));
    await sleep(durationMs);
    rpio.pwmSetData(motorStep, 0);
  }

  function shutdown() {
    rpio.pwmSetData(motorStep, 0);
    rpio.write(powerLed, rpio.LOW);
    rpio.write(motorEnabled, rpio.HIGH);
    rpio.write(motorDir, rpio.LOW);

    rpio.close(powerLed);
    rpio.close(motorEnabled);
    rpio.close(motorStep);
    rpio.close(motorDir);
    rpio.close(buttonCw);
    rpio.close(buttonCcw);

    console.log("Shutdown...");
  }
}());
