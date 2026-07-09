import rpio from "rpio";
import { StepperMotor } from "./devices/StepperMotor/StepperMotor";
import { Config } from "./Config";
import { PowerLed } from "./devices/LED/PowerLed";
import { Buttons } from "./devices/Buttons/Buttons";
import { OnUsbPacketCallback, SerialOverUSB } from "./devices/Communication/SerialOverUSB";

export type AppDevices = {
  powerLed: PowerLed;
  motor: StepperMotor;
  usbServer: SerialOverUSB;
  buttons: Buttons;
};

export class App {
  private config: Config;
  private powerLed: PowerLed;
  private motor: StepperMotor;
  private usbServer: SerialOverUSB;
  private buttons: Buttons;

  public constructor(config: Config, devices: AppDevices) {
    this.config = config;
    this.powerLed = devices.powerLed;
    this.motor = devices.motor;
    this.usbServer = devices.usbServer;
    this.buttons = devices.buttons;

    process.on("SIGINT", this.onExit);
    process.on("SIGTERM", this.onExit);

    rpio.init({ gpiomem: false, mapping: "gpio" });

    this.powerLed.open();
    this.motor.open();
    this.usbServer.open();
    this.buttons.open();
  }

  public start() {
    this.usbServer.listen(this.onUsbPacket)
    this.buttons.listen(this.onButton);
  }

  ////////////////////////////////////////

  private processCommand(command: string) {
    const regExp = /^(\w+);Dir:(\d+);Ticks:(\d+)$/i;
    const groups = command.match(regExp)!;

    if (!groups) {
      console.log(`Invalid command: ${command}`);
      return;
    }

    const type = groups[1];
    const direction = parseInt(groups[2], 10) > 0;
    const steps = parseInt(groups[3], 10);
    console.log(`Command: ${type} ${steps} steps ${direction ? "CW" : "CCW"}`);

    const frequency = this.config.stepperFrequency;
    this.motor.steps(direction, frequency, steps);
  }

  private onUsbPacket: OnUsbPacketCallback = (packet: string) => {
    this.processCommand(packet);
  };

  private onButton = (pin: number) => {
    const value = 1 - rpio.read(pin);
    const frequency = this.config.stepperFrequency;

    switch (pin) {
      case this.config.gpioButtonCw:
        console.log("Button CW:", value);
        if (value) {
          this.motor.roll(true, frequency);
        } else {
          this.motor.stop();
        }
        break;

      case this.config.gpioButtonCcw:
        console.log("Button CCW:", value);
        if (value) {
          this.motor.roll(false, frequency);
        } else {
          this.motor.stop();
        }
        break;
    }
  }

  private onExit = () => {
    console.log("\nShutting down...");

    this.usbServer.close();
    this.motor.close();
    this.buttons.close();
    this.powerLed.close();

    console.log("See you soon, racoon!");
  }
}

module.exports = { App };