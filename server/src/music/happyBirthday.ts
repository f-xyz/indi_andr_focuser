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

  note(392.00, 375); // Hap-
  note(392.00, 125); // py
  note(440.00, 500); // Birth-
  note(392.00, 500); // day
  note(523.25, 500); // to
  note(493.88, 1000); // you,
  rpio.msleep(50); // rest

  note(392.00, 375); // Hap-
  note(392.00, 125); // py
  note(440.00, 500); // Birth-
  note(392.00, 500); // day
  note(587.33, 500); // to
  note(523.25, 1000); // you,
  rpio.msleep(50); // rest

  note(392.00, 375); // Hap-
  note(392.00, 125); // py
  note(783.99, 500); // Birth-
  note(659.25, 500); // day
  note(523.25, 500); // dear
  note(493.88, 500); // [Name],
  note(440.00, 500); // ...
  rpio.msleep(50); // rest

  note(698.46, 375); // Hap-
  note(698.46, 125); // py
  note(659.25, 500); // Birth-
  note(523.25, 500); // day
  note(587.33, 500); // to
  note(523.25, 1500); // you!


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