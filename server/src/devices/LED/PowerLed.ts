import { BaseDevice } from "../BaseDevice";
import rpio from "rpio";

export type PowerLedConfig = { gpioPowerLed: number };

export class PowerLed extends BaseDevice<PowerLedConfig> {
  public open() {
    rpio.open(this.config.gpioPowerLed, rpio.OUTPUT, rpio.HIGH);
  }

  public close() {
    rpio.write(this.config.gpioPowerLed, rpio.LOW);
    rpio.close(this.config.gpioPowerLed);
  }
}