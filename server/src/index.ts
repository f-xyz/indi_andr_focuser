#!/usr/bin/env node

// Run me with nice like:
// sudo nice -n -20 ./index.js

import { App } from "./App";
import { Config } from "./Config";
import { PowerLed } from "./devices/LED/PowerLed";
import { StepperMotorGpio } from "./devices/StepperMotor/StepperMotorGpio";
import { Buttons } from "./devices/Buttons/Buttons";
import { SerialOverUSB } from "./devices/Communication/SerialOverUSB";

(async function main() {
  console.log("INDI Andr Focuser v2");
  console.log("Initializing...");

  const config = new Config({
    gpioPowerLed: 26, // GPIO 26, Green
    gpioMotorEnabled: 22, // GPIO 22, Violet
    gpioMotorDir: 27, // GPIO 27, White
    gpioMotorStep: 13, // GPIO 13, White, hardware PWM
    gpioButtonCw: 5, // GPIO 5, Orange
    gpioButtonCcw: 6, // GPIO 6, Orange
    stepperFrequency: 800
  });

  const powerLed = new PowerLed(config);
  const motor = new StepperMotorGpio(config);
  const usbServer = new SerialOverUSB(config);
  const buttons = new Buttons(config);

  const app = new App(config, {
    powerLed,
    motor,
    usbServer,
    buttons
  });

  app.start();

  console.log("Ready");
}());