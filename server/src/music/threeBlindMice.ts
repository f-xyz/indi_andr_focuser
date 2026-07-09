#!/usr/bin/env node
import rpio from "rpio";

(async function main() {
  console.log("Hello!");

  const powerLed = 26; // GPIO 26, Green
  const motorStep = 13; // GPIO 13, White, hardware PWM
  const motorDir = 27; // GPIO 27, White
  const motorEnabled = 22; // GPIO 22, Violet

  rpio.init({ gpiomem: false, mapping: "gpio" });
  rpio.open(powerLed, rpio.OUTPUT, rpio.HIGH);
  rpio.open(motorEnabled, rpio.OUTPUT, rpio.HIGH);
  rpio.open(motorDir, rpio.OUTPUT, rpio.LOW);
  rpio.open(motorStep, rpio.PWM);

  const pwnClockDivider = 128;
  rpio.pwmSetClockDivider(pwnClockDivider); // 19.2 MHz / 1024 = 18.750 KHz
  rpio.write(motorEnabled, rpio.LOW);

  // Three blind mice
  note(329.63, 666);
  note(293.66, 666);
  note(261.63, 1000);
  rpio.msleep(500);
  // Three blind mice
  note(329.63, 666);
  note(293.66, 666);
  note(261.63, 1000);
  rpio.msleep(500);
  // See how they run
  note(392.00, 666);
  note(349.23, 333);
  note(349.23, 333);
  note(329.63, 1000);
  rpio.msleep(500);
  // See how they run
  note(392.00, 666);
  note(349.23, 333);
  note(349.23, 333);
  note(329.63, 1000);
  rpio.msleep(500);
  // They all ran after the farmers wife
  note(392.00, 333);
  note(523.25, 167);
  note(523.25, 167);
  note(493.88, 167);
  note(440.00, 167);
  note(493.88, 167);
  note(523.25, 333);
  rpio.msleep(500);
  // Who cut off their tails with a carving knife
  note(392.00, 333);
  note(523.25, 167);
  note(523.25, 167);
  note(493.88, 167);
  note(440.00, 167);
  note(493.88, 167);
  note(523.25, 333);
  rpio.msleep(500);
  // Did you ever see such a sight in your life
  note(392.00, 333);
  note(523.25, 167);
  note(523.25, 167);
  note(493.88, 167);
  note(440.00, 167);
  note(493.88, 167);
  note(523.25, 333);
  rpio.msleep(500);
  // As three blind mice
  note(329.63, 666);
  note(293.66, 666);
  note(261.63, 1000);
  rpio.msleep(500);
  // Three blind mice
  note(329.63, 666);
  note(293.66, 666);
  note(261.63, 1000);
  rpio.msleep(500);


  rpio.pwmSetData(motorStep, 0);
  rpio.write(motorEnabled, rpio.HIGH);
  rpio.write(powerLed, rpio.LOW);

  console.log("Goodbye!");

  ////////////////////////////////////////

  function note(frequency: number, msDuration: number) {
    const higherOctave = 6 * frequency;
    const pwmRange = getRange(pwnClockDivider, higherOctave);
    const pwmHalfRange = Math.round(pwmRange / 2);
    rpio.pwmSetRange(motorStep, pwmRange);
    rpio.pwmSetData(motorStep, pwmHalfRange);
    rpio.msleep(msDuration);
    rpio.pwmSetData(motorStep, 0);
    rpio.msleep(25); // or 50?
  }

  function getRange(clockDivider: number, frequency: number) {
    const pwmBaseClock = 19.2e6;
    return Math.round(pwmBaseClock / clockDivider / frequency);
  }
}());